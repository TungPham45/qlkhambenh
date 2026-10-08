import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Appointment } from '@app/database';
import {
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  AppointmentStatus,
  UserRole,
  EVENTS,
  REDIS_SERVICES,
  RedisLockService,
} from '@app/common';

@Injectable()
export class AppointmentServiceService {
  private readonly logger = new Logger(AppointmentServiceService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    private readonly redisLock: RedisLockService,
    @Inject(REDIS_SERVICES.AUTH_SERVICE)
    private readonly eventClient: ClientProxy,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 20);

    const qb = this.apptRepo
      .createQueryBuilder('appt')
      .leftJoinAndSelect('appt.patient', 'patient')
      .leftJoinAndSelect('appt.doctor', 'doctor');

    // Role-based filtering
    if (user?.role === UserRole.NGUOI_DUNG) {
      if (!user?.patientId) throw new ForbiddenException('Tài khoản chưa được liên kết với bệnh nhân');
      qb.andWhere('appt.patientId = :patientId', { patientId: user.patientId });
    } else if (user?.role === UserRole.BAC_SI) {
      if (!user?.staffId) throw new ForbiddenException('Tài khoản chưa được liên kết với bác sĩ');
      qb.andWhere('appt.doctorId = :doctorId', { doctorId: user.staffId });
      if (query?.MaBN) qb.andWhere('appt.patientId = :patientId', { patientId: query.MaBN });
    } else if (user?.role === UserRole.ADMIN) {
      if (query?.MaBN) qb.andWhere('appt.patientId = :patientId', { patientId: query.MaBN });
      if (query?.MaBacSi) qb.andWhere('appt.doctorId = :doctorId', { doctorId: query.MaBacSi });
    } else {
      throw new ForbiddenException('Bạn không có quyền xem lịch khám');
    }

    if (query?.date) {
      qb.andWhere('appt.appointmentDate = :date', { date: query.date });
    }

    if (query?.status) {
      qb.andWhere('appt.status = :status', { status: query.status });
    }

    qb.orderBy('appt.appointmentDate', 'DESC')
      .addOrderBy('appt.appointmentTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map(this.formatAppointment),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number, user: any) {
    const appt = await this.apptRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám');
    this.assertCanAccessAppointment(appt, user);
    return this.formatAppointment(appt);
  }

  async create(dto: CreateAppointmentDto, user: any) {
    // If patient is creating, force patientId to user's patientId
    let patientId = dto.patientId;
    if (user?.role === UserRole.NGUOI_DUNG) {
      if (!user?.patientId) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với mã bệnh nhân');
      }
      patientId = user.patientId;
    }

    const normTime = this.normalizeTime(dto.appointmentTime);

    // Acquire distributed lock on doctor + date to prevent race conditions
    const lockKey = `doctor:${dto.doctorId}:date:${dto.appointmentDate}`;
    const lockId = await this.redisLock.acquireLock(lockKey, 5000);

    try {
      // Check 60-minute doctor conflict
      await this.checkDoctorConflict(dto.doctorId, dto.appointmentDate, normTime);

      const appt = this.apptRepo.create({
        patientId,
        doctorId: dto.doctorId,
        appointmentDate: dto.appointmentDate,
        appointmentTime: normTime,
        status: dto.status || AppointmentStatus.CHO_KHAM,
        notes: dto.notes,
      });

      const saved = await this.apptRepo.save(appt);
      this.logger.log(`Created appointment #${saved.id} for Doctor #${dto.doctorId} on ${dto.appointmentDate} ${normTime}`);
      this.eventClient.emit(EVENTS.APPOINTMENT_CREATED, {
        appointmentId: Number(saved.id),
        patientId: Number(saved.patientId),
        doctorId: Number(saved.doctorId),
        appointmentDate: saved.appointmentDate,
        appointmentTime: saved.appointmentTime,
        status: saved.status,
      });
      return this.formatAppointment(saved);
    } finally {
      if (lockId) {
        await this.redisLock.releaseLock(lockKey, lockId);
      }
    }
  }

  async update(id: number, dto: Partial<CreateAppointmentDto>, user: any) {
    const appt = await this.apptRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám');

    if (user?.role === UserRole.NGUOI_DUNG) {
      throw new ForbiddenException('Bệnh nhân không có quyền sửa thông tin lịch khám');
    }
    if (
      user?.role === UserRole.BAC_SI &&
      Number(appt.doctorId) !== Number(user.staffId)
    ) {
      throw new ForbiddenException('Bác sĩ chỉ được cập nhật lịch được phân công');
    }

    if (dto.appointmentTime || dto.appointmentDate || dto.doctorId) {
      const docId = dto.doctorId || appt.doctorId;
      const date = dto.appointmentDate || appt.appointmentDate;
      const time = dto.appointmentTime ? this.normalizeTime(dto.appointmentTime) : appt.appointmentTime;

      await this.checkDoctorConflict(docId, date, time, id);
      appt.doctorId = docId;
      appt.appointmentDate = date;
      appt.appointmentTime = time;
    }

    const previousStatus = appt.status;
    if (dto.status) appt.status = dto.status;
    if (dto.notes !== undefined) appt.notes = dto.notes;

    const saved = await this.apptRepo.save(appt);
    if (dto.status && saved.status !== previousStatus) {
      this.emitStatusChanged(saved);
    }
    return this.formatAppointment(saved);
  }

  async updateStatus(id: number, dto: UpdateAppointmentStatusDto, user: any) {
    const appt = await this.apptRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám');

    if (user?.role === UserRole.NGUOI_DUNG) {
      // Patient can only cancel
      if (dto.status !== AppointmentStatus.HUY) {
        throw new ForbiddenException('Bệnh nhân chỉ có quyền hủy lịch khám');
      }
      if (Number(appt.patientId) !== Number(user.patientId)) {
        throw new ForbiddenException('Không có quyền thao tác trên lịch khám này');
      }
    }
    if (
      user?.role === UserRole.BAC_SI &&
      Number(appt.doctorId) !== Number(user.staffId)
    ) {
      throw new ForbiddenException('Bác sĩ chỉ được cập nhật lịch được phân công');
    }

    const previousStatus = appt.status;
    appt.status = dto.status;
    const saved = await this.apptRepo.save(appt);
    if (saved.status !== previousStatus) {
      this.emitStatusChanged(saved);
    }
    return this.formatAppointment(saved);
  }

  async delete(id: number, user: any) {
    const appt = await this.apptRepo.findOne({ where: { id } });
    if (!appt) throw new NotFoundException('Không tìm thấy lịch khám');

    if (user?.role === UserRole.BAC_SI) {
      throw new ForbiddenException('Bác sĩ không có quyền xóa lịch khám');
    }

    if (user?.role === UserRole.NGUOI_DUNG) {
      const previousStatus = appt.status;
      appt.status = AppointmentStatus.HUY;
      const saved = await this.apptRepo.save(appt);
      if (saved.status !== previousStatus) {
        this.emitStatusChanged(saved);
      }
      return { success: true, message: 'Đã hủy lịch khám' };
    }

    await this.apptRepo.remove(appt);
    return { success: true, message: 'Đã xóa lịch khám' };
  }

  async getByDoctor(doctorId: number, query: any, user: any) {
    if (user?.role === UserRole.BAC_SI && Number(doctorId) !== Number(user.staffId)) {
      throw new ForbiddenException('Bác sĩ không được xem lịch của bác sĩ khác');
    }
    return await this.getAll({ ...query, MaBacSi: doctorId }, user);
  }

  private assertCanAccessAppointment(appointment: Appointment, user: any) {
    if (user?.role === UserRole.ADMIN) return;
    if (user?.role === UserRole.BAC_SI && Number(appointment.doctorId) === Number(user.staffId)) return;
    if (user?.role === UserRole.NGUOI_DUNG && Number(appointment.patientId) === Number(user.patientId)) return;
    throw new ForbiddenException('Bạn không có quyền xem lịch khám này');
  }

  /**
   * Chặn trùng lịch trong vòng 60 phút
   */
  private async checkDoctorConflict(doctorId: number, date: string, time: string, excludeId?: number) {
    const targetMinutes = this.timeToMinutes(time);

    const qb = this.apptRepo.createQueryBuilder('appt')
      .where('appt.doctorId = :doctorId', { doctorId })
      .andWhere('appt.appointmentDate = :date', { date })
      .andWhere('appt.status != :cancelled', { cancelled: AppointmentStatus.HUY });

    if (excludeId) {
      qb.andWhere('appt.id != :excludeId', { excludeId });
    }

    const existingAppts = await qb.getMany();

    for (const item of existingAppts) {
      const itemMinutes = this.timeToMinutes(item.appointmentTime);
      if (Math.abs(itemMinutes - targetMinutes) < 60) {
        throw new ConflictException(
          `Bác sĩ đã có lịch hẹn vào lúc ${item.appointmentTime} (trong vòng 60 phút so với giờ bạn chọn). Vui lòng chọn khung giờ khác.`,
        );
      }
    }
  }

  private timeToMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  private normalizeTime(t: string): string {
    const trimmed = (t || '08:00').trim();
    return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
  }

  private emitStatusChanged(appointment: Appointment) {
    this.eventClient.emit(EVENTS.APPOINTMENT_STATUS_CHANGED, {
      appointmentId: Number(appointment.id),
      patientId: Number(appointment.patientId),
      doctorId: Number(appointment.doctorId),
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status,
    });
  }

  private formatAppointment(a: Appointment) {
    return {
      id: Number(a.id),
      MaLich: Number(a.id),
      MaBN: Number(a.patientId),
      patientId: Number(a.patientId),
      MaBacSi: Number(a.doctorId),
      doctorId: Number(a.doctorId),
      NgayKham: a.appointmentDate,
      appointmentDate: a.appointmentDate,
      GioKham: a.appointmentTime,
      appointmentTime: a.appointmentTime,
      TrangThai: a.status,
      status: a.status,
      GhiChu: a.notes,
      notes: a.notes,
      patient: a.patient,
      doctor: a.doctor,
      createdAt: a.createdAt,
    };
  }
}
