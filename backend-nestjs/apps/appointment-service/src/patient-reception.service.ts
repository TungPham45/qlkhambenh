import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, PatientReception } from '@app/database';
import {
  CreatePatientReceptionDto,
  EVENTS,
  REDIS_SERVICES,
  UpdatePatientReceptionDto,
  UserRole,
} from '@app/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class PatientReceptionService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly dataSource: DataSource,
    @Inject(REDIS_SERVICES.AUTH_SERVICE)
    private readonly notificationClient: ClientProxy,
  ) {}

  async getAll(query: any, user: any) {
    this.assertClinicalUser(user);

    const page = Math.max(1, Number.parseInt(query?.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(query?.limit, 10) || 10));
    const qb = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.reception', 'reception');

    if (user.role === UserRole.BAC_SI) {
      if (!user.staffId) {
        this.fail(
          HttpStatus.FORBIDDEN,
          'Tài khoản bác sĩ chưa được liên kết với hồ sơ bác sĩ',
        );
      }
      qb.andWhere('appointment.doctorId = :doctorId', {
        doctorId: Number(user.staffId),
      });
    }

    if (query?.date) {
      qb.andWhere('appointment.appointmentDate = :date', { date: query.date });
    }

    if (query?.status) {
      qb.andWhere('appointment.status = :status', { status: query.status });
    }

    if (query?.receptionStatus === 'received') {
      qb.andWhere('reception.id IS NOT NULL');
    } else if (query?.receptionStatus === 'pending') {
      qb.andWhere('reception.id IS NULL');
    }

    const search = String(query?.search || '').trim();
    if (search) {
      qb.andWhere(
        `(
          patient.fullName ILIKE :search
          OR patient.phone ILIKE :search
          OR CAST(patient.id AS TEXT) ILIKE :search
          OR CONCAT('BN-', LPAD(CAST(patient.id AS TEXT), 5, '0')) ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    qb.orderBy('appointment.appointmentDate', 'DESC')
      .addOrderBy('appointment.appointmentTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [appointments, total] = await qb.getManyAndCount();
    return {
      data: appointments.map((appointment) => this.formatAppointment(appointment)),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getByAppointment(appointmentId: number, user: any) {
    this.assertClinicalUser(user);
    const appointment = await this.findAppointment(appointmentId);
    this.assertAppointmentAccess(appointment, user);
    return this.formatAppointment(appointment);
  }

  async create(dto: CreatePatientReceptionDto, user: any) {
    this.assertClinicalUser(user);

    try {
      const received = await this.dataSource.transaction(async (manager) => {
        const appointment = await this.findAppointmentForUpdate(
          manager,
          dto.appointmentId,
        );
        this.assertAppointmentAccess(appointment, user);

        if (!appointment.patient) {
          this.fail(HttpStatus.NOT_FOUND, 'Không tìm thấy bệnh nhân của lịch hẹn');
        }

        const receptionRepo = manager.getRepository(PatientReception);
        const existing = await receptionRepo.findOne({
          where: { appointmentId: Number(dto.appointmentId) },
        });
        if (existing) {
          this.fail(
            HttpStatus.CONFLICT,
            'Lịch hẹn này đã được tiếp nhận; hãy dùng chức năng cập nhật',
          );
        }

        const reception = receptionRepo.create({
          appointmentId: Number(dto.appointmentId),
        });
        this.applyReceptionData(reception, dto);
        appointment.checkInAt = appointment.checkInAt || new Date();

        const savedReception = await receptionRepo.save(reception);
        await manager.getRepository(Appointment).save(appointment);
        appointment.reception = savedReception;

        return this.formatAppointment(appointment);
      });
      this.notificationClient.emit(EVENTS.PATIENT_RECEIVED, {
        appointmentId: received.appointmentId,
        patientId: received.patientId,
        doctorId: received.doctorId,
      });
      return received;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      if (error?.code === '23505' || error?.driverError?.code === '23505') {
        this.fail(
          HttpStatus.CONFLICT,
          'Lịch hẹn này đã có bản ghi tiếp nhận',
        );
      }
      throw error;
    }
  }

  async update(
    appointmentId: number,
    dto: UpdatePatientReceptionDto,
    user: any,
  ) {
    this.assertClinicalUser(user);

    return await this.dataSource.transaction(async (manager) => {
      const appointment = await this.findAppointmentForUpdate(manager, appointmentId);
      this.assertAppointmentAccess(appointment, user);

      const reception = await manager.getRepository(PatientReception).findOne({
        where: { appointmentId: Number(appointmentId) },
        lock: { mode: 'pessimistic_write' },
      });
      if (!reception) {
        this.fail(
          HttpStatus.NOT_FOUND,
          'Lịch hẹn chưa có bản ghi tiếp nhận',
        );
      }

      this.applyReceptionData(reception, dto);
      appointment.checkInAt = appointment.checkInAt || new Date();
      const savedReception = await manager
        .getRepository(PatientReception)
        .save(reception);
      await manager.getRepository(Appointment).save(appointment);
      appointment.reception = savedReception;

      return this.formatAppointment(appointment);
    });
  }

  private async findAppointment(appointmentId: number) {
    const appointment = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.reception', 'reception')
      .where('appointment.id = :appointmentId', {
        appointmentId: Number(appointmentId),
      })
      .getOne();

    if (!appointment) {
      this.fail(HttpStatus.NOT_FOUND, 'Không tìm thấy lịch hẹn');
    }
    return appointment;
  }

  private async findAppointmentForUpdate(
    manager: EntityManager,
    appointmentId: number,
  ) {
    const appointment = await manager
      .getRepository(Appointment)
      .createQueryBuilder('appointment')
      .setLock('pessimistic_write', undefined, ['appointment'])
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.reception', 'reception')
      .where('appointment.id = :appointmentId', {
        appointmentId: Number(appointmentId),
      })
      .getOne();

    if (!appointment) {
      this.fail(HttpStatus.NOT_FOUND, 'Không tìm thấy lịch hẹn');
    }
    return appointment;
  }

  private assertClinicalUser(user: any) {
    if (![UserRole.ADMIN, UserRole.BAC_SI].includes(user?.role)) {
      this.fail(
        HttpStatus.FORBIDDEN,
        'Bạn không có quyền truy cập thông tin tiếp nhận bệnh nhân',
      );
    }
  }

  private assertAppointmentAccess(appointment: Appointment, user: any) {
    if (
      user?.role === UserRole.BAC_SI &&
      (!user?.staffId || Number(appointment.doctorId) !== Number(user.staffId))
    ) {
      this.fail(
        HttpStatus.FORBIDDEN,
        'Bác sĩ chỉ được truy cập lịch khám được phân công cho mình',
      );
    }
  }

  private applyReceptionData(
    reception: PatientReception,
    dto: CreatePatientReceptionDto | UpdatePatientReceptionDto,
  ) {
    const numericFields = [
      'weight',
      'height',
      'temperature',
      'systolicBloodPressure',
      'diastolicBloodPressure',
      'heartRate',
      'spo2',
    ] as const;

    for (const field of numericFields) {
      if (dto[field] !== undefined) {
        (reception as any)[field] = dto[field] === null ? null : Number(dto[field]);
      }
    }

    for (const field of ['initialSymptoms', 'notes'] as const) {
      if (dto[field] !== undefined) {
        const value = dto[field];
        reception[field] = value === null ? null : String(value).trim() || null;
      }
    }
  }

  private formatAppointment(appointment: Appointment) {
    const patientId = Number(appointment.patientId);
    const reception = appointment.reception
      ? this.formatReception(appointment.reception)
      : null;

    return {
      appointmentId: Number(appointment.id),
      patientId,
      doctorId: Number(appointment.doctorId),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      appointmentStatus: appointment.status,
      checkInAt: appointment.checkInAt,
      hasReception: Boolean(reception),
      receptionStatus: reception ? 'Đã tiếp nhận' : 'Chưa tiếp nhận',
      patient: appointment.patient
        ? {
            id: patientId,
            code: `BN-${String(patientId).padStart(5, '0')}`,
            fullName: appointment.patient.fullName,
            phone: appointment.patient.phone,
          }
        : null,
      doctor: appointment.doctor
        ? {
            id: Number(appointment.doctor.id),
            fullName: appointment.doctor.fullName,
            specialty: appointment.doctor.specialty,
          }
        : null,
      reception,
    };
  }

  private formatReception(reception: PatientReception) {
    return {
      id: Number(reception.id),
      appointmentId: Number(reception.appointmentId),
      weight: this.toNullableNumber(reception.weight),
      height: this.toNullableNumber(reception.height),
      temperature: this.toNullableNumber(reception.temperature),
      systolicBloodPressure: this.toNullableNumber(
        reception.systolicBloodPressure,
      ),
      diastolicBloodPressure: this.toNullableNumber(
        reception.diastolicBloodPressure,
      ),
      heartRate: this.toNullableNumber(reception.heartRate),
      spo2: this.toNullableNumber(reception.spo2),
      initialSymptoms: reception.initialSymptoms,
      notes: reception.notes,
      recordedAt: reception.recordedAt,
    };
  }

  private toNullableNumber(value: number | string | null | undefined) {
    return value === null || value === undefined ? null : Number(value);
  }

  private fail(statusCode: number, message: string): never {
    throw new RpcException({ statusCode, status: statusCode, message });
  }
}
