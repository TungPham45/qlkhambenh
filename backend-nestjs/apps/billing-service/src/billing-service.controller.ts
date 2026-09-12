import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BillingServiceService } from './billing-service.service';
import { MSG, CreateInvoiceDto, UpdateInvoiceStatusDto } from '@app/common';

@Controller()
export class BillingServiceController {
  constructor(private readonly billingService: BillingServiceService) {}

  @MessagePattern(MSG.BILLING_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    return await this.billingService.getAll(data.query, data.user);
  }

  @MessagePattern(MSG.BILLING_GET_BY_ID)
  async getById(@Payload() data: { id: string }) {
    return await this.billingService.getById(data.id);
  }

  @MessagePattern(MSG.BILLING_CREATE)
  async create(@Payload() dto: CreateInvoiceDto) {
    return await this.billingService.create(dto);
  }

  @MessagePattern(MSG.BILLING_UPDATE_STATUS)
  async updateStatus(@Payload() data: { id: string; dto: UpdateInvoiceStatusDto; user: any }) {
    return await this.billingService.updateStatus(data.id, data.dto, data.user);
  }
}
