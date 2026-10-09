import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MedicalRecordServiceService } from './medical-record-service.service';
import { MSG, CreateMedicalRecordDto } from '@app/common';

@Controller()
export class MedicalRecordServiceController {
  constructor(private readonly medService: MedicalRecordServiceService) {}

  @MessagePattern(MSG.MED_REC_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    return await this.medService.getAll(data.query, data.user);
  }

  @MessagePattern(MSG.MED_REC_HISTORY)
  async getHistory(@Payload() data: { query: any; user: any }) {
    return await this.medService.getHistory(data.query, data.user);
  }

  @MessagePattern(MSG.MED_REC_HISTORY_DETAIL)
  async getHistoryDetail(@Payload() data: { id: number; user: any }) {
    return await this.medService.getHistoryDetail(data.id, data.user);
  }

  @MessagePattern(MSG.MED_REC_GET_BY_ID)
  async getById(@Payload() data: { id: number }) {
    return await this.medService.getById(data.id);
  }

  @MessagePattern(MSG.MED_REC_GET_BY_APPT)
  async getByAppointment(@Payload() data: { appointmentId: number }) {
    return await this.medService.getByAppointment(data.appointmentId);
  }

  @MessagePattern(MSG.MED_REC_CREATE)
  async create(@Payload() data: { dto: CreateMedicalRecordDto; user: any }) {
    return await this.medService.create(data.dto, data.user);
  }

  @MessagePattern(MSG.MED_REC_UPDATE)
  async update(@Payload() data: { id: number; dto: Partial<CreateMedicalRecordDto>; user: any }) {
    return await this.medService.update(data.id, data.dto, data.user);
  }

  @MessagePattern(MSG.MED_REC_GET_BY_DOCTOR)
  async getByDoctor(@Payload() data: { doctorId: number; query: any }) {
    return await this.medService.getByDoctor(data.doctorId, data.query);
  }
}
