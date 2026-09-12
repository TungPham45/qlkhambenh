import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { MedicalRecord, Appointment } from '@app/database';
import {
  CreateMedicalRecordDto,
  AppointmentStatus,
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

  async create(dto: CreateMedicalRecordDto) {
    // Check if appointment exists
    const appt = await this.apptRepo.findOne({ where: { id: dto.appointmentId } });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám tương ứng');

    const record = this.recordRepo.create({
      appointmentId: dto.appointmentId,
      patientId: dto.patientId || appt.patientId,
      doctorId: dto.doctorId || appt.doctorId,
      examinationDate: dto.examinationDate || new Date().toISOString().slice(0, 10),
      symptoms: dto.symptoms,
      diagnosis: dto.diagnosis,
      conclusion: dto.conclusion,
      examinationFee: dto.examinationFee || 150000.0,
    });

    const saved = await this.recordRepo.save(record);

    // Update appointment status to 'Da kham'
    appt.status = AppointmentStatus.DA_KHAM;
    await this.apptRepo.save(appt);

    this.logger.log(`Created MedicalRecord #${saved.id} for Appointment #${dto.appointmentId}`);

    // Emit event to billing service
    this.billingClient.emit(EVENTS.MEDICAL_RECORD_CREATED, {
      recordId: saved.id,
      patientId: saved.patientId,
      examinationFee: saved.examinationFee,
    });

    return this.formatRecord(saved);
  }

  async update(id: number, dto: Partial<CreateMedicalRecordDto>) {
    const rec = await this.recordRepo.findOne({ where: { id } });
    if (!rec) throw new NotFoundException('Không tìm thấy phiếu khám');

    Object.assign(rec, dto);
    const saved = await this.recordRepo.save(rec);
    return this.formatRecord(saved);
  }

  async getByDoctor(doctorId: number, query: any) {
    return await this.getAll({ ...query, MaBacSi: doctorId }, null);
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
