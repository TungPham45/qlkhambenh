import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { Staff } from '@app/database';
import { WorkSchedule } from './work-schedule.entity';

interface WorkScheduleInput {
  doctorId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  slotMinutes?: number;
  status?: string;
  notes?: string;
}

@Injectable()
export class WorkSchedulesService {
  constructor(@InjectRepository(WorkSchedule) private readonly schedules: Repository<WorkSchedule>) {}

  async getAll(query: any) {
    const page = this.pageNumber(query?.page, 1);
    const limit = Math.min(100, this.pageNumber(query?.limit, 10));
    const builder = this.schedules.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.doctor', 'doctor');
    const search = String(query?.search || '').trim();
    if (search) {
      builder.andWhere(new Brackets((filter) => filter
        .where('doctor.fullName ILIKE :search', { search: `%${search}%` })
        .orWhere('schedule.notes ILIKE :search', { search: `%${search}%` })
        .orWhere('CAST(schedule.id AS TEXT) = :exactSearch', { exactSearch: search })));
    }
    if (query?.doctorId) {
      const doctorId = Number(query.doctorId);
      if (!Number.isSafeInteger(doctorId) || doctorId < 1) throw new BadRequestException('Mã bác sĩ không hợp lệ');
      builder.andWhere('schedule.doctorId = :doctorId', { doctorId });
    }
    if (query?.date) {
      this.validateDate(query.date);
      builder.andWhere('schedule.workDate = :date', { date: query.date });
    }
    if (query?.status) {
      this.validateStatus(query.status);
      builder.andWhere('schedule.status = :status', { status: query.status });
    }
    const [rows, total] = await builder.orderBy('schedule.workDate', 'DESC')
      .addOrderBy('schedule.startTime', 'ASC').addOrderBy('schedule.id', 'DESC')
      .skip((page - 1) * limit).take(limit).getManyAndCount();
    return {
      data: rows.map((row) => this.format(row)),
      pagination: { page, limit, total, total_pages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async create(input: WorkScheduleInput) {
    const data = this.validateInput(input);
    return this.schedules.manager.transaction(async (manager) => {
      const doctor = await this.lockDoctor(manager, data.doctorId);
      await this.checkOverlap(manager, data);
      const schedule = await manager.getRepository(WorkSchedule).save(manager.getRepository(WorkSchedule).create(data));
      schedule.doctor = doctor;
      return this.format(schedule);
    });
  }

  async update(id: number, input: WorkScheduleInput) {
    const data = this.validateInput(input);
    return this.schedules.manager.transaction(async (manager) => {
      const repository = manager.getRepository(WorkSchedule);
      const snapshot = await repository.findOne({ where: { id } });
      if (!snapshot) throw new NotFoundException('Không tìm thấy lịch làm việc');
      let doctor: Staff;
      for (const doctorId of [...new Set([Number(snapshot.doctorId), data.doctorId])].sort((a, b) => a - b)) {
        const locked = await this.lockDoctor(manager, doctorId);
        if (doctorId === data.doctorId) doctor = locked;
      }
      const schedule = await repository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!schedule) throw new NotFoundException('Không tìm thấy lịch làm việc');
      if (Number(schedule.doctorId) !== Number(snapshot.doctorId)) {
        throw new ConflictException('Lịch làm việc vừa được thay đổi bác sĩ. Vui lòng tải lại và thử lại.');
      }
      const changed = Number(schedule.doctorId) !== data.doctorId || schedule.workDate !== data.workDate
        || schedule.startTime !== data.startTime || schedule.endTime !== data.endTime
        || schedule.slotMinutes !== data.slotMinutes || schedule.status !== data.status;
      if (changed) await this.requireNoAppointments(manager, schedule);
      await this.checkOverlap(manager, data, id);
      Object.assign(schedule, data);
      const saved = await repository.save(schedule);
      saved.doctor = doctor;
      return this.format(saved);
    });
  }

  async delete(id: number) {
    return this.schedules.manager.transaction(async (manager) => {
      const repository = manager.getRepository(WorkSchedule);
      const snapshot = await repository.findOne({ where: { id } });
      if (!snapshot) throw new NotFoundException('Không tìm thấy lịch làm việc');
      await this.lockDoctor(manager, Number(snapshot.doctorId));
      const schedule = await repository.findOne({ where: { id }, lock: { mode: 'pessimistic_write' } });
      if (!schedule) throw new NotFoundException('Không tìm thấy lịch làm việc');
      if (Number(schedule.doctorId) !== Number(snapshot.doctorId)) {
        throw new ConflictException('Lịch làm việc vừa được thay đổi bác sĩ. Vui lòng tải lại và thử lại.');
      }
      await this.requireNoAppointments(manager, schedule);
      await repository.remove(schedule);
      return { success: true, message: 'Đã xóa lịch làm việc' };
    });
  }

  private async lockDoctor(manager: EntityManager, doctorId: number) {
    const doctor = await manager.getRepository(Staff).findOne({ where: { id: doctorId }, lock: { mode: 'pessimistic_write' } });
    if (!doctor) throw new NotFoundException('Không tìm thấy bác sĩ');
    return doctor;
  }

  private async checkOverlap(manager: EntityManager, data: WorkScheduleInput, excludeId?: number) {
    if (data.status !== 'Active') return;
    const query = manager.getRepository(WorkSchedule).createQueryBuilder('schedule')
      .where('schedule.doctorId = :doctorId', { doctorId: data.doctorId })
      .andWhere('schedule.workDate = :date', { date: data.workDate })
      .andWhere('schedule.status = :status', { status: 'Active' })
      .andWhere('schedule.startTime < :endTime AND schedule.endTime > :startTime', data);
    if (excludeId) query.andWhere('schedule.id <> :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException('Bác sĩ đã có lịch làm việc trùng khung giờ này');
  }

  private async requireNoAppointments(manager: EntityManager, schedule: WorkSchedule) {
    const appointments = await manager.query(
      `SELECT id_lich_hen FROM lich_hen
       WHERE id_bac_si = $1 AND ngay_hen = $2 AND gio_hen >= $3 AND gio_hen < $4
       AND trang_thai <> 'Huy' LIMIT 1 FOR SHARE`,
      [schedule.doctorId, schedule.workDate, schedule.startTime, schedule.endTime],
    );
    if (appointments.length) {
      throw new ConflictException('Khung giờ đã có lịch hẹn chưa hủy; chỉ được sửa ghi chú. Hãy xử lý lịch hẹn trước khi sửa hoặc xóa lịch làm việc.');
    }
  }

  private validateInput(input: WorkScheduleInput) {
    const doctorId = Number(input?.doctorId);
    if (!Number.isSafeInteger(doctorId) || doctorId < 1) throw new BadRequestException('Vui lòng chọn bác sĩ hợp lệ');
    this.validateDate(input?.workDate);
    const startTime = this.normalizeTime(input?.startTime);
    const endTime = this.normalizeTime(input?.endTime);
    if (endTime <= startTime) throw new BadRequestException('Giờ kết thúc phải sau giờ bắt đầu');
    const slotMinutes = input?.slotMinutes === undefined ? 30 : Number(input.slotMinutes);
    if (!Number.isSafeInteger(slotMinutes) || slotMinutes < 1 || slotMinutes > 2147483647) {
      throw new BadRequestException('Thời lượng mỗi ca phải là số phút nguyên dương');
    }
    const duration = (this.timeSeconds(endTime) - this.timeSeconds(startTime)) / 60;
    if (slotMinutes > duration) throw new BadRequestException('Thời lượng mỗi ca không được dài hơn khung giờ làm việc');
    const status = input.status === undefined ? 'Active' : input.status;
    this.validateStatus(status);
    if (input.notes !== undefined && input.notes !== null && typeof input.notes !== 'string') {
      throw new BadRequestException('Ghi chú không hợp lệ');
    }
    return { doctorId, workDate: input.workDate, startTime, endTime, slotMinutes, status, notes: input.notes?.trim() || null };
  }

  private validateDate(date: string) {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new BadRequestException('Ngày làm việc phải có định dạng YYYY-MM-DD');
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new BadRequestException('Ngày làm việc không hợp lệ');
  }

  private validateStatus(status: string) {
    if (!['Active', 'Inactive'].includes(status)) throw new BadRequestException('Trạng thái lịch làm việc không hợp lệ');
  }

  private normalizeTime(value: string) {
    if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)) {
      throw new BadRequestException('Giờ làm việc không hợp lệ');
    }
    return value.length === 5 ? `${value}:00` : value;
  }

  private timeSeconds(value: string) {
    const [hours, minutes, seconds] = value.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  private pageNumber(value: any, fallback: number) {
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : fallback;
  }

  private format(schedule: WorkSchedule) {
    return {
      id: Number(schedule.id), doctorId: Number(schedule.doctorId), doctorName: schedule.doctor?.fullName,
      workDate: schedule.workDate, startTime: schedule.startTime, endTime: schedule.endTime,
      slotMinutes: schedule.slotMinutes, status: schedule.status, notes: schedule.notes,
      createdAt: schedule.createdAt, updatedAt: schedule.updatedAt,
    };
  }
}
