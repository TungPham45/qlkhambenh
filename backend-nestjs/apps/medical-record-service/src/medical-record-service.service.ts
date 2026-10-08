import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import {
  Appointment,
  Diagnosis,
  DiseaseCatalog,
  MedicalRecord,
} from '@app/database';
import {
  CreateMedicalRecordDto,
  MedicalRecordDiagnosisDto,
  AppointmentStatus,
  DiseaseStatus,
  UserRole,
  REDIS_SERVICES,
  EVENTS,
} from '@app/common';

@Injectable()
export class MedicalRecordServiceService {
  private readonly logger = new Logger(MedicalRecordServiceService.name);

  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordRepo: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    private readonly dataSource: DataSource,
    @Inject(REDIS_SERVICES.BILLING_SERVICE)
    private readonly billingClient: ClientProxy,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 50);

    const qb = this.recordRepo
      .createQueryBuilder('rec')
      .leftJoinAndSelect('rec.patient', 'patient')
      .leftJoinAndSelect('rec.doctor', 'doctor')
      .leftJoinAndSelect('rec.appointment', 'appointment')
      .leftJoinAndSelect('rec.prescription', 'prescription')
      .leftJoinAndSelect('prescription.items', 'items')
      .leftJoinAndSelect('items.drug', 'drug')
      .leftJoinAndSelect('rec.invoice', 'invoice');

    if (user?.role === UserRole.NGUOI_DUNG && user?.patientId) {
      qb.andWhere('rec.patientId = :patientId', { patientId: user.patientId });
    } else if (query?.MaBN) {
      qb.andWhere('rec.patientId = :patientId', { patientId: query.MaBN });
    }

    if (user?.role === UserRole.BAC_SI && user?.staffId) {
      qb.andWhere('rec.doctorId = :doctorId', { doctorId: user.staffId });
    } else if (query?.MaBacSi) {
      qb.andWhere('rec.doctorId = :doctorId', { doctorId: query.MaBacSi });
    }

    qb.orderBy('rec.examinationDate', 'DESC')
      .addOrderBy('rec.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map(this.formatRecord),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getHistory(query: any, user: any) {
    const page = Math.max(1, Number.parseInt(String(query?.page || 1), 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(query?.limit || 20), 10) || 20),
    );

    if (query?.from && query?.to && query.from > query.to) {
      throw new BadRequestException('Ngày bắt đầu không được sau ngày kết thúc');
    }

    const qb = this.createHistoryQuery();
    this.applyHistoryScope(qb, user, query);

    if (query?.from) {
      qb.andWhere('rec.examinationDate >= :from', { from: query.from });
    }
    if (query?.to) {
      qb.andWhere('rec.examinationDate <= :to', { to: query.to });
    }

    const search = String(query?.search || '').trim();
    if (search) {
      qb.andWhere(
        `(
          CAST(rec.id AS TEXT) ILIKE :search
          OR CAST(rec.appointmentId AS TEXT) ILIKE :search
          OR CAST(rec.patientId AS TEXT) ILIKE :search
          OR CAST(rec.doctorId AS TEXT) ILIKE :search
          OR patient.fullName ILIKE :search
          OR patient.phone ILIKE :search
          OR doctor.fullName ILIKE :search
          OR rec.symptoms ILIKE :search
          OR rec.diagnosis ILIKE :search
          OR rec.conclusion ILIKE :search
          OR disease.code ILIKE :search
          OR disease.name ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    qb.distinct(true)
      .orderBy('rec.examinationDate', 'DESC')
      .addOrderBy('rec.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      data: rows.map((record) => this.formatHistoryRecord(record)),
      pagination: {
        total,
        page,
        limit,
        total_pages: totalPages,
        totalPages,
      },
    };
  }

  async getHistoryDetail(id: number, user: any) {
    const qb = this.createHistoryQuery();
    this.applyHistoryScope(qb, user, {});
    qb.andWhere('rec.id = :id', { id });

    const record = await qb.getOne();
    if (!record) {
      throw new NotFoundException('Không tìm thấy lần khám trong phạm vi được phép');
    }

    return this.formatHistoryRecord(record);
  }

  async getById(id: number) {
    const rec = await this.recordRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor', 'appointment', 'prescription', 'prescription.items', 'prescription.items.drug', 'invoice'],
    });
    if (!rec) throw new NotFoundException('Không tìm thấy phiếu khám');
    return this.formatRecord(rec);
  }

  async getByAppointment(appointmentId: number) {
    const rec = await this.recordRepo.findOne({
      where: { appointmentId },
      relations: ['patient', 'doctor', 'prescription', 'prescription.items', 'prescription.items.drug', 'invoice'],
    });
    return rec ? this.formatRecord(rec) : null;
  }

  async create(dto: CreateMedicalRecordDto, user: any) {
    const appt = await this.apptRepo.findOne({ where: { id: dto.appointmentId } });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám tương ứng');

    this.assertDoctorOwnsAppointment(appt, user);
    this.assertAppointmentIdentity(dto, appt);
    const diagnoses = await this.validateDiagnoses(dto.diagnoses || []);

    const saved = await this.dataSource.transaction(async (manager) => {
      const appointmentRepo = manager.getRepository(Appointment);
      const lockedAppointment = await appointmentRepo.findOne({
        where: { id: dto.appointmentId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!lockedAppointment) {
        throw new NotFoundException('Không tìm thấy lịch khám tương ứng');
      }
      this.assertDoctorOwnsAppointment(lockedAppointment, user);
      this.assertAppointmentIdentity(dto, lockedAppointment);

      const recordRepo = manager.getRepository(MedicalRecord);
      const record = recordRepo.create({
        appointmentId: lockedAppointment.id,
        patientId: lockedAppointment.patientId,
        doctorId: lockedAppointment.doctorId,
        examinationDate:
          dto.examinationDate || new Date().toISOString().slice(0, 10),
        symptoms: dto.symptoms,
        diagnosis: dto.diagnosis,
        conclusion: dto.conclusion,
        treatmentDirection: dto.treatmentDirection,
        doctorNotes: dto.doctorNotes,
        followUpDate: dto.followUpDate,
        examinationFee: dto.examinationFee || 150000.0,
      });
      const createdRecord = await recordRepo.save(record);
      if (diagnoses.length) {
        await manager.getRepository(Diagnosis).save(
          diagnoses.map((item) =>
            manager.getRepository(Diagnosis).create({
              medicalRecordId: createdRecord.id,
              diseaseId: item.diseaseId,
              isPrimary: item.isPrimary,
              note: item.note,
            }),
          ),
        );
      }

      lockedAppointment.status = AppointmentStatus.DA_KHAM;
      await appointmentRepo.save(lockedAppointment);
      return createdRecord;
    });

    this.logger.log(
      `Created MedicalRecord #${saved.id} for Appointment #${dto.appointmentId}`,
    );

    this.billingClient.emit(EVENTS.MEDICAL_RECORD_CREATED, {
      recordId: saved.id,
      appointmentId: saved.appointmentId,
      patientId: saved.patientId,
      doctorId: saved.doctorId,
      examinationFee: saved.examinationFee,
    });

    return await this.getById(saved.id);
  }

  async update(
    id: number,
    dto: Partial<CreateMedicalRecordDto>,
    user: any,
  ) {
    const rec = await this.recordRepo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Không tìm thấy phiếu khám');
    this.assertDoctorOwnsRecord(rec, user);

    const { diagnoses: diagnosisInput } = dto;
    const recordInput = { ...dto };
    delete recordInput.diagnoses;
    delete recordInput.appointmentId;
    delete recordInput.patientId;
    delete recordInput.doctorId;
    const diagnoses =
      diagnosisInput === undefined
        ? undefined
        : await this.validateDiagnoses(diagnosisInput);

    const saved = await this.dataSource.transaction(async (manager) => {
      const recordRepo = manager.getRepository(MedicalRecord);
      const record = await recordRepo.findOne({ where: { id } });
      if (!record) throw new NotFoundException('Không tìm thấy phiếu khám');
      this.assertDoctorOwnsRecord(record, user);
      Object.assign(record, recordInput);
      const updated = await recordRepo.save(record);

      if (diagnoses !== undefined) {
        const diagnosisRepo = manager.getRepository(Diagnosis);
        await diagnosisRepo.delete({ medicalRecordId: id });
        if (diagnoses.length) {
          await diagnosisRepo.save(
            diagnoses.map((item) =>
              diagnosisRepo.create({
                medicalRecordId: id,
                diseaseId: item.diseaseId,
                isPrimary: item.isPrimary,
                note: item.note,
              }),
            ),
          );
        }
      }
      return updated;
    });
    return this.formatRecord(saved);
  }

  private async validateDiagnoses(
    diagnoses: MedicalRecordDiagnosisDto[],
  ): Promise<MedicalRecordDiagnosisDto[]> {
    if (!Array.isArray(diagnoses)) {
      throw new BadRequestException('Danh sách chẩn đoán không hợp lệ');
    }
    const ids = diagnoses.map((item) => Number(item.diseaseId));
    if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
      throw new BadRequestException('Mã bệnh trong chẩn đoán không hợp lệ');
    }
    if (new Set(ids).size !== ids.length) {
      throw new BadRequestException('Không thể chọn trùng bệnh trong chẩn đoán');
    }
    if (diagnoses.filter((item) => item.isPrimary).length > 1) {
      throw new BadRequestException('Chỉ được chọn một chẩn đoán chính');
    }
    if (!ids.length) return [];

    const activeDiseases = await this.dataSource
      .getRepository(DiseaseCatalog)
      .find({ where: { id: In(ids), status: DiseaseStatus.ACTIVE } });
    if (activeDiseases.length !== ids.length) {
      throw new BadRequestException(
        'Danh mục có bệnh không tồn tại hoặc đã ngừng sử dụng',
      );
    }

    const hasPrimary = diagnoses.some((item) => item.isPrimary);
    return diagnoses.map((item, index) => ({
      diseaseId: Number(item.diseaseId),
      isPrimary: hasPrimary ? Boolean(item.isPrimary) : index === 0,
      note: item.note?.trim() || undefined,
    }));
  }

  private assertAppointmentIdentity(
    dto: CreateMedicalRecordDto,
    appointment: Appointment,
  ) {
    if (
      Number(dto.patientId) !== Number(appointment.patientId) ||
      Number(dto.doctorId) !== Number(appointment.doctorId)
    ) {
      throw new BadRequestException(
        'Thông tin bệnh nhân hoặc bác sĩ không khớp với lịch hẹn',
      );
    }
  }

  private assertDoctorOwnsAppointment(appointment: Appointment, user: any) {
    if (
      user?.role === UserRole.BAC_SI &&
      (!user?.staffId ||
        Number(appointment.doctorId) !== Number(user.staffId))
    ) {
      throw new ForbiddenException(
        'Bác sĩ chỉ được tạo phiếu khám cho lịch được phân công',
      );
    }
  }

  private assertDoctorOwnsRecord(record: MedicalRecord, user: any) {
    if (
      user?.role === UserRole.BAC_SI &&
      (!user?.staffId || Number(record.doctorId) !== Number(user.staffId))
    ) {
      throw new ForbiddenException(
        'Bác sĩ chỉ được cập nhật phiếu khám do mình phụ trách',
      );
    }
  }

  async getByDoctor(doctorId: number, query: any) {
    return await this.getAll({ ...query, MaBacSi: doctorId }, null);
  }

  private createHistoryQuery() {
    return this.recordRepo
      .createQueryBuilder('rec')
      .leftJoinAndSelect('rec.patient', 'patient')
      .leftJoinAndSelect('rec.doctor', 'doctor')
      .leftJoinAndSelect('rec.appointment', 'appointment')
      .leftJoinAndSelect('rec.diagnoses', 'diagnosisEntry')
      .leftJoinAndSelect('diagnosisEntry.disease', 'disease')
      .leftJoinAndSelect('rec.prescription', 'prescription')
      .leftJoinAndSelect('prescription.items', 'items')
      .leftJoinAndSelect('items.drug', 'drug')
      .leftJoinAndSelect('rec.invoice', 'invoice');
  }

  private applyHistoryScope(qb: any, user: any, query: any) {
    if (user?.role === UserRole.NGUOI_DUNG) {
      const patientId = Number(user.patientId ?? user.MaBN);
      if (!Number.isInteger(patientId) || patientId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bệnh nhân');
      }
      qb.andWhere('rec.patientId = :scopePatientId', {
        scopePatientId: patientId,
      });
      return;
    }

    if (user?.role === UserRole.BAC_SI) {
      const doctorId = Number(user.staffId ?? user.MaNV);
      if (!Number.isInteger(doctorId) || doctorId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bác sĩ');
      }
      qb.andWhere('rec.doctorId = :scopeDoctorId', {
        scopeDoctorId: doctorId,
      });

      const patientId = Number(query?.patientId ?? query?.MaBN);
      if (Number.isInteger(patientId) && patientId > 0) {
        qb.andWhere('rec.patientId = :doctorFilterPatientId', {
          doctorFilterPatientId: patientId,
        });
      }
      return;
    }

    if (user?.role === UserRole.ADMIN) {
      const patientId = Number(query?.patientId ?? query?.MaBN);
      if (Number.isInteger(patientId) && patientId > 0) {
        qb.andWhere('rec.patientId = :filterPatientId', {
          filterPatientId: patientId,
        });
      }

      const doctorId = Number(query?.doctorId ?? query?.MaBacSi);
      if (Number.isInteger(doctorId) && doctorId > 0) {
        qb.andWhere('rec.doctorId = :filterDoctorId', {
          filterDoctorId: doctorId,
        });
      }
      return;
    }

    throw new ForbiddenException('Bạn không có quyền tra cứu lịch sử khám');
  }

  private formatHistoryRecord(r: MedicalRecord) {
    const patient = r.patient
      ? {
          id: Number(r.patient.id),
          code: `BN-${String(r.patient.id).padStart(5, '0')}`,
          fullName: r.patient.fullName,
          dateOfBirth: r.patient.dateOfBirth,
          gender: r.patient.gender,
          phone: r.patient.phone,
          address: r.patient.address,
          email: r.patient.email,
          healthInsuranceNumber: r.patient.healthInsuranceNumber,
        }
      : null;

    const doctor = r.doctor
      ? {
          id: Number(r.doctor.id),
          code: `BS-${String(r.doctor.id).padStart(4, '0')}`,
          fullName: r.doctor.fullName,
          phone: r.doctor.phone,
          specialty: r.doctor.specialty,
        }
      : null;

    const diagnoses = [...(r.diagnoses || [])]
      .sort(
        (first, second) =>
          Number(second.isPrimary) - Number(first.isPrimary) ||
          Number(first.id) - Number(second.id),
      )
      .map((entry) => ({
        id: Number(entry.id),
        diseaseId: Number(entry.diseaseId),
        code: entry.disease?.code || null,
        name: entry.disease?.name || null,
        group: entry.disease?.group || null,
        isPrimary: Boolean(entry.isPrimary),
        note: entry.note,
      }));

    const prescription = r.prescription
      ? {
          id: Number(r.prescription.id),
          prescriptionDate: r.prescription.prescriptionDate,
          note: r.prescription.note,
          status: r.prescription.status,
          items: (r.prescription.items || []).map((item) => {
            const unitPrice = Number(item.unitPriceAtPrescription || 0);
            return {
              id: Number(item.id),
              drugId: Number(item.drugId),
              drugName: item.drug?.drugName || null,
              unit: item.drug?.unit || null,
              quantity: Number(item.quantity),
              dosage: item.dosage,
              frequency: item.frequency,
              durationDays: item.durationDays,
              route: item.route,
              instructions: item.instructions,
              unitPrice,
              totalPrice: unitPrice * Number(item.quantity || 0),
            };
          }),
        }
      : null;

    const invoice = r.invoice
      ? {
          id: r.invoice.id,
          createdDate: r.invoice.createdDate,
          examinationFee: Number(r.invoice.examinationFee || 0),
          drugFee: Number(r.invoice.drugFee || 0),
          totalAmount: Number(r.invoice.totalAmount || 0),
          paymentStatus: r.invoice.paymentStatus,
        }
      : null;

    return {
      id: Number(r.id),
      recordCode: `PK-${String(r.id).padStart(5, '0')}`,
      MaPhieu: Number(r.id),
      appointmentId: Number(r.appointmentId),
      appointmentCode: `LH-${String(r.appointmentId).padStart(5, '0')}`,
      MaLich: Number(r.appointmentId),
      patientId: Number(r.patientId),
      MaBN: Number(r.patientId),
      doctorId: Number(r.doctorId),
      MaBacSi: Number(r.doctorId),
      examinationDate: r.examinationDate,
      NgayKham: r.examinationDate,
      symptoms: r.symptoms,
      TrieuChung: r.symptoms,
      diagnosis: r.diagnosis,
      ChanDoan: r.diagnosis,
      conclusion: r.conclusion,
      KetLuan: r.conclusion,
      treatmentDirection: r.treatmentDirection,
      doctorNotes: r.doctorNotes,
      followUpDate: r.followUpDate,
      examinationFee: Number(r.examinationFee || 0),
      patient,
      doctor,
      appointment: r.appointment
        ? {
            id: Number(r.appointment.id),
            appointmentDate: r.appointment.appointmentDate,
            appointmentTime: r.appointment.appointmentTime,
            status: r.appointment.status,
            notes: r.appointment.notes,
          }
        : null,
      diagnoses,
      prescription,
      invoice,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  }

  private formatRecord(r: MedicalRecord) {
    return {
      id: Number(r.id),
      MaPhieu: Number(r.id),
      MaLich: Number(r.appointmentId),
      appointmentId: Number(r.appointmentId),
      MaBN: Number(r.patientId),
      patientId: Number(r.patientId),
      MaBacSi: Number(r.doctorId),
      doctorId: Number(r.doctorId),
      NgayKham: r.examinationDate,
      examinationDate: r.examinationDate,
      TrieuChung: r.symptoms,
      symptoms: r.symptoms,
      ChanDoan: r.diagnosis,
      diagnosis: r.diagnosis,
      KetLuan: r.conclusion,
      conclusion: r.conclusion,
      HuongDieuTri: r.treatmentDirection,
      treatmentDirection: r.treatmentDirection,
      GhiChuBacSi: r.doctorNotes,
      doctorNotes: r.doctorNotes,
      NgayTaiKham: r.followUpDate,
      followUpDate: r.followUpDate,
      TienKham: Number(r.examinationFee),
      examinationFee: Number(r.examinationFee),
      patient: r.patient,
      doctor: r.doctor,
      prescription: r.prescription,
      invoice: r.invoice,
      createdAt: r.createdAt,
    };
  }
}
