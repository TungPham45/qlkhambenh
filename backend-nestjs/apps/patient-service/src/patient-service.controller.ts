import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PatientServiceService } from './patient-service.service';
import { MSG, CreatePatientDto, UpdatePatientDto } from '@app/common';

@Controller()
export class PatientServiceController {
  constructor(private readonly patientService: PatientServiceService) {}

  @MessagePattern(MSG.PATIENT_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    return await this.patientService.getAll(data.query, data.user);
  }

  @MessagePattern(MSG.PATIENT_GET_BY_ID)
  async getById(@Payload() data: { id: number }) {
    return await this.patientService.getById(data.id);
  }

  @MessagePattern(MSG.PATIENT_CREATE)
  async create(@Payload() dto: CreatePatientDto) {
    try {
      return await this.patientService.create(dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.PATIENT_UPDATE)
  async update(@Payload() data: { id: number; dto: UpdatePatientDto }) {
    try {
      return await this.patientService.update(data.id, data.dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.PATIENT_DELETE)
  async delete(@Payload() data: { id: number }) {
    try {
      return await this.patientService.delete(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }
}

function toRpcException(error: any) {
  const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể thực hiện thao tác bệnh nhân';
  return new RpcException({ statusCode, message });
}
