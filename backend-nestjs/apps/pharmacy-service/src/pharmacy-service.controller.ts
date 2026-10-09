import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { PharmacyServiceService } from './pharmacy-service.service';
import {
  MSG,
  EVENTS,
  CreateDrugDto,
  UpdateDrugDto,
  CreatePrescriptionDto,
} from '@app/common';

@Controller()
export class PharmacyServiceController {
  private readonly logger = new Logger(PharmacyServiceController.name);

  constructor(private readonly pharmacyService: PharmacyServiceService) {}

  // --- DRUGS ---
  @MessagePattern(MSG.DRUG_GET_ALL)
  async getDrugs(@Payload() query: any) {
    return await this.pharmacyService.getDrugs(query);
  }

  @MessagePattern(MSG.DRUG_GET_BY_ID)
  async getDrugById(@Payload() data: { id: number }) {
    return await this.pharmacyService.getDrugById(data.id);
  }

  @MessagePattern(MSG.DRUG_CREATE)
  async createDrug(@Payload() dto: CreateDrugDto) {
    return await this.pharmacyService.createDrug(dto);
  }

  @MessagePattern(MSG.DRUG_UPDATE)
  async updateDrug(@Payload() data: { id: number; dto: UpdateDrugDto }) {
    return await this.pharmacyService.updateDrug(data.id, data.dto);
  }

  @MessagePattern(MSG.DRUG_DELETE)
  async deleteDrug(@Payload() data: { id: number }) {
    return await this.pharmacyService.deleteDrug(data.id);
  }

  // --- PRESCRIPTIONS ---
  @MessagePattern(MSG.PRESCRIPTION_GET_ALL)
  async getPrescriptions(@Payload() data: { query: any; user: any }) {
    return await this.pharmacyService.getPrescriptions(data.query, data.user);
  }

  @MessagePattern(MSG.PRESCRIPTION_GET_BY_ID)
  async getPrescriptionById(@Payload() data: { id: number }) {
    return await this.pharmacyService.getPrescriptionById(data.id);
  }

  @MessagePattern(MSG.PRESCRIPTION_CREATE)
  async createPrescription(@Payload() data: { dto: CreatePrescriptionDto; user: any }) {
    return await this.pharmacyService.createPrescription(data.dto, data.user);
  }

  @MessagePattern(MSG.PRESCRIPTION_DEDUCT_STOCK)
  async deductStock(@Payload() data: { id: number }) {
    return await this.pharmacyService.deductStock(data.id);
  }

  // --- EVENT DRIVEN LISTENER ---
  @EventPattern(EVENTS.BILLING_INVOICE_PAID)
  async handleInvoicePaid(@Payload() data: { recordId: number; invoiceId: string }) {
    this.logger.log(`Received Event [billing.invoice_paid] for Record #${data.recordId} / Invoice ${data.invoiceId}`);
    if (data.recordId) {
      await this.pharmacyService.deductStockByRecordId(data.recordId);
    }
  }
}
