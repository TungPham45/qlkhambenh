import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Account, Notification, Patient, Staff } from '@app/database';
import {
  CreateNotificationDto,
  NotificationQueryDto,
  UpdateNotificationDto,
  UserRole,
} from '@app/common';

type NotificationPayload = {
  accountId?: string;
  appointmentId?: number | null;
  type?: string;
  channel?: string;
  title?: string;
  content?: string;
  status?: string;
  scheduledAt?: string | Date | null;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  async getAll(query: NotificationQueryDto, user: any) {
    const accountId = this.requireAccountId(user);
    const page = this.positiveInteger(query?.page, 1);
    const limit = Math.min(this.positiveInteger(query?.limit, 20), 100);

    const qb = this.notificationRepo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.appointment', 'appointment')
      .where('notification.accountId = :accountId', { accountId });

    if (this.toBoolean(query?.unreadOnly)) {
      qb.andWhere('notification.readAt IS NULL');
    }

    const type = String(query?.type || '').trim();
    if (type) {
      qb.andWhere('notification.type = :type', { type });
    }

    const date = String(query?.date || '').trim();
    if (date) {
      qb.andWhere('CAST(notification.createdAt AS date) = CAST(:date AS date)', {
        date,
      });
    }

    qb.orderBy('notification.createdAt', 'DESC')
      .addOrderBy('notification.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();
    return {
      data: rows.map((row) => this.format(row)),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getUnreadCount(user: any) {
    const accountId = this.requireAccountId(user);
    const count = await this.notificationRepo.count({
      where: { accountId, readAt: IsNull() },
    });
    return { count };
  }

  async getById(id: number, user: any) {
    const notification = await this.findOwned(id, this.requireAccountId(user));
    return this.format(notification);
  }

  async markRead(id: number, user: any) {
    const notification = await this.findOwned(id, this.requireAccountId(user));
    if (!notification.readAt) {
      notification.readAt = new Date();
      notification.status = 'Da doc';
      await this.notificationRepo.save(notification);
    }
    return this.format(notification);
  }

  async markAllRead(user: any) {
    const accountId = this.requireAccountId(user);
    const now = new Date();
    const result = await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ readAt: now, status: 'Da doc' })
      .where('id_tai_khoan = :accountId', { accountId })
      .andWhere('thoi_gian_doc IS NULL')
      .execute();
    return {
      success: true,
      updated: result.affected || 0,
      readAt: now,
    };
  }

  async create(payload: CreateNotificationDto, user: any) {
    this.requireAdmin(user);
    const accountId = String(payload?.accountId || '').trim();
    const title = String(payload?.title || '').trim();
    const content = String(payload?.content || '').trim();
    const type = String(payload?.type || 'Khac').trim();

    if (!accountId || !title || !content) {
      throw new BadRequestException('Tài khoản, tiêu đề và nội dung là bắt buộc');
    }
    await this.ensureAccount(accountId);

    const now = new Date();
    const notification = this.notificationRepo.create({
      accountId,
      appointmentId: payload.appointmentId
        ? Number(payload.appointmentId)
        : null,
      type,
      channel: String(payload.channel || 'Ung dung').trim(),
      title,
      content,
      status: String(payload.status || 'Da gui').trim(),
      scheduledAt: payload.scheduledAt
        ? new Date(payload.scheduledAt)
        : null,
      sentAt: now,
      readAt: null,
    });
    return this.format(await this.notificationRepo.save(notification));
  }

  async update(id: number, payload: UpdateNotificationDto, user: any) {
    this.requireAdmin(user);
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    if (payload.accountId !== undefined) {
      const accountId = String(payload.accountId).trim();
      await this.ensureAccount(accountId);
      notification.accountId = accountId;
    }
    if (payload.appointmentId !== undefined) {
      notification.appointmentId = payload.appointmentId
        ? Number(payload.appointmentId)
        : null;
    }
    if (payload.type !== undefined) {
      notification.type = this.requiredText(payload.type, 'Loại thông báo');
    }
    if (payload.channel !== undefined) {
      notification.channel = String(payload.channel || '').trim() || null;
    }
    if (payload.title !== undefined) {
      notification.title = this.requiredText(payload.title, 'Tiêu đề');
    }
    if (payload.content !== undefined) {
      notification.content = this.requiredText(payload.content, 'Nội dung');
    }
    if (payload.status !== undefined) {
      notification.status = this.requiredText(payload.status, 'Trạng thái');
    }
    if (payload.scheduledAt !== undefined) {
      notification.scheduledAt = payload.scheduledAt
        ? new Date(payload.scheduledAt)
        : null;
    }

    return this.format(await this.notificationRepo.save(notification));
  }

  async delete(id: number, user: any) {
    this.requireAdmin(user);
    const notification = await this.notificationRepo.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
    await this.notificationRepo.remove(notification);
    return { success: true, message: 'Đã xóa thông báo' };
  }

  async onAppointmentCreated(event: any) {
    const appointmentId = this.numberOrNull(event?.appointmentId || event?.id);
    const date = event?.appointmentDate || event?.date;
    const time = event?.appointmentTime || event?.time;
    await Promise.all([
      this.createForPatient(event?.patientId, {
        appointmentId,
        type: 'Dat lich',
        title: 'Đặt lịch khám thành công',
        content: `Lịch khám${date ? ` ngày ${date}` : ''}${time ? ` lúc ${String(time).slice(0, 5)}` : ''} đã được ghi nhận.`,
      }),
      this.createForStaff(event?.doctorId, {
        appointmentId,
        type: 'Dat lich',
        title: 'Có lịch khám mới',
        content: `Bạn có lịch khám mới${date ? ` ngày ${date}` : ''}${time ? ` lúc ${String(time).slice(0, 5)}` : ''}.`,
      }),
    ]);
  }

  async onAppointmentStatusChanged(event: any) {
    const appointmentId = this.numberOrNull(event?.appointmentId || event?.id);
    const status = String(event?.status || '').trim();
    if (!status) return;
    const payload = {
      appointmentId,
      type: 'Trang thai lich kham',
      title: 'Lịch khám đã thay đổi trạng thái',
      content: `Lịch khám #${appointmentId || ''} hiện có trạng thái: ${status}.`,
    };
    await Promise.all([
      this.createForPatient(event?.patientId, payload),
      this.createForStaff(event?.doctorId, payload),
    ]);
  }

  async onPatientReceived(event: any) {
    const appointmentId = this.numberOrNull(event?.appointmentId);
    const payload = {
      appointmentId,
      type: 'Tiep nhan',
      title: 'Bệnh nhân đã được tiếp nhận',
      content: `Bệnh nhân đã hoàn tất tiếp nhận cho lịch khám #${appointmentId || ''}.`,
    };
    await Promise.all([
      this.createForPatient(event?.patientId, {
        ...payload,
        title: 'Bạn đã được tiếp nhận',
        content: `Bạn đã được tiếp nhận cho lịch khám #${appointmentId || ''}.`,
      }),
      this.createForStaff(event?.doctorId, payload),
    ]);
  }

  async onMedicalRecordCreated(event: any) {
    await this.createForPatient(event?.patientId, {
      appointmentId: this.numberOrNull(event?.appointmentId),
      type: 'Hoan thanh kham',
      title: 'Đã hoàn thành khám',
      content: `Phiếu khám #${event?.recordId || ''} đã được tạo. Bạn có thể xem lại trong lịch sử khám.`,
    });
  }

  async onInvoicePaid(event: any) {
    if (!event?.patientId) return;
    const amount = Number(event?.totalAmount || event?.amount || 0);
    await this.createForPatient(event.patientId, {
      appointmentId: this.numberOrNull(event?.appointmentId),
      type: 'Thanh toan',
      title: 'Thanh toán thành công',
      content: `Hóa đơn ${event?.invoiceId || ''} đã được thanh toán${amount ? ` với số tiền ${amount.toLocaleString('vi-VN')} đ` : ''}.`,
    });
  }

  async onInvoiceCreated(event: any) {
    if (!event?.patientId) return;
    const amount = Number(event?.totalAmount || 0);
    await this.createForPatient(event.patientId, {
      type: 'Hoa don',
      title: 'Bạn có hóa đơn mới',
      content: `Hóa đơn ${event?.invoiceId || ''} đã được tạo${amount ? ` với tổng tiền ${amount.toLocaleString('vi-VN')} đ` : ''}.`,
    });
  }

  private async createForPatient(
    patientId: number | string,
    payload: Omit<NotificationPayload, 'accountId'>,
  ) {
    const id = Number(patientId);
    if (!Number.isInteger(id) || id <= 0) return;
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient?.accountId) return;
    await this.createSystemNotification(patient.accountId, payload);
  }

  private async createForStaff(
    staffId: number | string,
    payload: Omit<NotificationPayload, 'accountId'>,
  ) {
    const id = Number(staffId);
    if (!Number.isInteger(id) || id <= 0) return;
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff?.accountId) return;
    await this.createSystemNotification(staff.accountId, payload);
  }

  private async createSystemNotification(
    accountId: string,
    payload: Omit<NotificationPayload, 'accountId'>,
  ) {
    const now = new Date();
    await this.notificationRepo.save(
      this.notificationRepo.create({
        accountId,
        appointmentId: payload.appointmentId || null,
        type: payload.type || 'Khac',
        channel: 'Ung dung',
        title: payload.title || 'Thông báo',
        content: payload.content || '',
        status: 'Da gui',
        scheduledAt: null,
        sentAt: now,
        readAt: null,
      }),
    );
  }

  private async findOwned(id: number, accountId: string) {
    const notification = await this.notificationRepo.findOne({
      where: { id, accountId },
      relations: ['appointment'],
    });
    if (!notification) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }
    return notification;
  }

  private async ensureAccount(accountId: string) {
    if (!accountId) {
      throw new BadRequestException('Tài khoản nhận thông báo là bắt buộc');
    }
    const exists = await this.accountRepo.exist({ where: { id: accountId } });
    if (!exists) {
      throw new BadRequestException('Tài khoản nhận thông báo không tồn tại');
    }
  }

  private requireAccountId(user: any) {
    const accountId = String(user?.id || '').trim();
    if (!accountId) {
      throw new ForbiddenException('Token không có thông tin tài khoản');
    }
    return accountId;
  }

  private requireAdmin(user: any) {
    if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Chỉ quản trị viên được quản lý thông báo');
    }
  }

  private requiredText(value: unknown, label: string) {
    const text = String(value || '').trim();
    if (!text) throw new BadRequestException(`${label} không được để trống`);
    return text;
  }

  private positiveInteger(value: unknown, fallback: number) {
    const parsed = Number.parseInt(String(value || ''), 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
  }

  private numberOrNull(value: unknown) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private toBoolean(value: unknown) {
    return value === true || value === 'true' || value === '1' || value === 1;
  }

  private format(notification: Notification) {
    return {
      id: Number(notification.id),
      accountId: notification.accountId,
      appointmentId: notification.appointmentId
        ? Number(notification.appointmentId)
        : null,
      type: notification.type,
      channel: notification.channel,
      title: notification.title,
      content: notification.content,
      status: notification.status,
      scheduledAt: notification.scheduledAt,
      sentAt: notification.sentAt,
      readAt: notification.readAt,
      isRead: Boolean(notification.readAt),
      createdAt: notification.createdAt,
      appointment: notification.appointment,
    };
  }
}
