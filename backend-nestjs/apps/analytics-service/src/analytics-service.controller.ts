import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { AnalyticsServiceService } from './analytics-service.service';
import { MSG, EVENTS } from '@app/common';

@Controller()
export class AnalyticsServiceController {
  constructor(private readonly analyticsService: AnalyticsServiceService) {}

  @MessagePattern(MSG.ANALYTICS_DASHBOARD)
  async dashboard(@Payload() filters: any) {
    return await this.analyticsService.dashboard(filters);
  }

  @MessagePattern(MSG.ANALYTICS_KPIS)
  async kpis(@Payload() filters: any) {
    const d = await this.analyticsService.dashboard(filters);
    return d.summary;
  }

  @EventPattern(EVENTS.BILLING_INVOICE_PAID)
  async handleInvoicePaid() {
    await this.analyticsService.invalidateCache();
  }

  @EventPattern(EVENTS.APPOINTMENT_CREATED)
  async handleAppointmentCreated() {
    await this.analyticsService.invalidateCache();
  }
}
