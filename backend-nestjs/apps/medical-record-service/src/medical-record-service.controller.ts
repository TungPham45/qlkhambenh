import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { MedicalRecordServiceService } from './medical-record-service.service';
import { MSG, CreateMedicalRecordDto } from '@app/common';

@Controller()
export class MedicalRecordServiceController {
  constructor(private readonly medService: MedicalRecordServiceService) {}

  @MessagePattern(MSG.MED_REC_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    try {
      return await this.medService.getAll(data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_HISTORY)
  async getHistory(@Payload() data: { query: any; user: any }) {
    try {
      return await this.medService.getHistory(data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_HISTORY_DETAIL)
  async getHistoryDetail(@Payload() data: { id: number; user: any }) {
    try {
      return await this.medService.getHistoryDetail(data.id, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_GET_BY_ID)
  async getById(@Payload() data: { id: number; user: any }) {
    try {
      return await this.medService.getById(data.id, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_GET_BY_APPT)
  async getByAppointment(@Payload() data: { appointmentId: number; user: any }) {
    try {
      return await this.medService.getByAppointment(data.appointmentId, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_CREATE)
  async create(@Payload() data: { dto: CreateMedicalRecordDto; user: any }) {
    try {
      return await this.medService.create(data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_UPDATE)
  async update(@Payload() data: { id: number; dto: Partial<CreateMedicalRecordDto>; user: any }) {
    try {
      return await this.medService.update(data.id, data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.MED_REC_GET_BY_DOCTOR)
  async getByDoctor(@Payload() data: { doctorId: number; query: any; user: any }) {
    try {
      return await this.medService.getByDoctor(data.doctorId, data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }
}

function toRpcException(error: any) {
  const statusCode = error instanceof HttpException
    ? error.getStatus()
    : Number(error?.statusCode || error?.status) || HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể xử lý hồ sơ bệnh án';
  return new RpcException({ statusCode, message });
}
