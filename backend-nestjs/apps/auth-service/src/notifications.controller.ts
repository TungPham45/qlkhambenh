import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import {
  CreateNotificationDto,
  EVENTS,
  MSG,
  NotificationQueryDto,
  UpdateNotificationDto,
} from '@app/common';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern(MSG.NOTIFICATION_GET_ALL)
  getAll(@Payload() data: { query: NotificationQueryDto; user: any }) {
    return this.forward(() => this.notificationsService.getAll(data.query, data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_UNREAD_COUNT)
  getUnreadCount(@Payload() data: { user: any }) {
    return this.forward(() => this.notificationsService.getUnreadCount(data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_GET_BY_ID)
  getById(@Payload() data: { id: number; user: any }) {
    return this.forward(() => this.notificationsService.getById(data.id, data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_MARK_READ)
  markRead(@Payload() data: { id: number; user: any }) {
    return this.forward(() => this.notificationsService.markRead(data.id, data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_MARK_ALL_READ)
  markAllRead(@Payload() data: { user: any }) {
    return this.forward(() => this.notificationsService.markAllRead(data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_CREATE)
  create(@Payload() data: { dto: CreateNotificationDto; user: any }) {
    return this.forward(() => this.notificationsService.create(data.dto, data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_UPDATE)
  update(@Payload() data: { id: number; dto: UpdateNotificationDto; user: any }) {
    return this.forward(() => this.notificationsService.update(data.id, data.dto, data.user));
  }

  @MessagePattern(MSG.NOTIFICATION_DELETE)
  delete(@Payload() data: { id: number; user: any }) {
    return this.forward(() => this.notificationsService.delete(data.id, data.user));
  }

  @EventPattern(EVENTS.APPOINTMENT_CREATED)
  onAppointmentCreated(@Payload() event: any) {
    return this.notificationsService.onAppointmentCreated(event);
  }

  @EventPattern(EVENTS.APPOINTMENT_STATUS_CHANGED)
  onAppointmentStatusChanged(@Payload() event: any) {
    return this.notificationsService.onAppointmentStatusChanged(event);
  }

  @EventPattern(EVENTS.PATIENT_RECEIVED)
  onPatientReceived(@Payload() event: any) {
    return this.notificationsService.onPatientReceived(event);
  }

  @EventPattern(EVENTS.MEDICAL_RECORD_CREATED)
  onMedicalRecordCreated(@Payload() event: any) {
    return this.notificationsService.onMedicalRecordCreated(event);
  }

  @EventPattern(EVENTS.BILLING_INVOICE_PAID)
  onInvoicePaid(@Payload() event: any) {
    return this.notificationsService.onInvoicePaid(event);
  }

  @EventPattern(EVENTS.BILLING_INVOICE_CREATED)
  onInvoiceCreated(@Payload() event: any) {
    return this.notificationsService.onInvoiceCreated(event);
  }

  private async forward<T>(operation: () => Promise<T>) {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof RpcException) throw error;
      const statusCode =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new RpcException({
        statusCode,
        status: statusCode,
        message: error?.message || 'Không thể xử lý thông báo',
      });
    }
  }
}
