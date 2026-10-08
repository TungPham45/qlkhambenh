import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload, RpcException } from '@nestjs/microservices';
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
    try {
      return await this.pharmacyService.getDrugs(query);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DRUG_GET_BY_ID)
  async getDrugById(@Payload() data: { id: number }) {
    try {
      return await this.pharmacyService.getDrugById(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DRUG_CREATE)
  async createDrug(@Payload() dto: CreateDrugDto) {
    try {
      return await this.pharmacyService.createDrug(dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DRUG_UPDATE)
  async updateDrug(@Payload() data: { id: number; dto: UpdateDrugDto }) {
    try {
      return await this.pharmacyService.updateDrug(data.id, data.dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DRUG_DELETE)
  async deleteDrug(@Payload() data: { id: number }) {
    try {
      return await this.pharmacyService.deleteDrug(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  // --- PRESCRIPTIONS ---
  @MessagePattern(MSG.PRESCRIPTION_GET_ALL)
  async getPrescriptions(@Payload() data: { query: any; user: any }) {
    try {
      return await this.pharmacyService.getPrescriptions(data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.PRESCRIPTION_GET_BY_ID)
  async getPrescriptionById(@Payload() data: { id: number; user: any }) {
    try {
      return await this.pharmacyService.getPrescriptionById(data.id, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.PRESCRIPTION_CREATE)
  async createPrescription(@Payload() data: { dto: CreatePrescriptionDto; user: any }) {
    try {
      return await this.pharmacyService.createPrescription(data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.PRESCRIPTION_DEDUCT_STOCK)
  async deductStock(@Payload() data: { id: number }) {
    try {
      return await this.pharmacyService.deductStock(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
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

function toRpcException(error: any) {
  const statusCode = error instanceof HttpException
    ? error.getStatus()
    : Number(error?.statusCode || error?.status) || HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể xử lý dữ liệu kho thuốc';
  return new RpcException({ statusCode, message });
}
