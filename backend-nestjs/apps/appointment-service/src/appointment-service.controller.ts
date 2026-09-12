import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentServiceService } from './appointment-service.service';
import {
  MSG,
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/common';

@Controller()
export class AppointmentServiceController {
  constructor(private readonly apptService: AppointmentServiceService) {}

  @MessagePattern(MSG.APPT_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    return await this.apptService.getAll(data.query, data.user);
  }

  @MessagePattern(MSG.APPT_GET_BY_ID)
  async getById(@Payload() data: { id: number }) {
    return await this.apptService.getById(data.id);
  }

  @MessagePattern(MSG.APPT_CREATE)
  async create(@Payload() data: { dto: CreateAppointmentDto; user: any }) {
    return await this.apptService.create(data.dto, data.user);
  }

  @MessagePattern(MSG.APPT_UPDATE)
  async update(@Payload() data: { id: number; dto: Partial<CreateAppointmentDto>; user: any }) {
    return await this.apptService.update(data.id, data.dto, data.user);
  }

  @MessagePattern(MSG.APPT_UPDATE_STATUS)
  async updateStatus(@Payload() data: { id: number; dto: UpdateAppointmentStatusDto; user: any }) {
    return await this.apptService.updateStatus(data.id, data.dto, data.user);
  }

  @MessagePattern(MSG.APPT_DELETE)
  async delete(@Payload() data: { id: number; user: any }) {
    return await this.apptService.delete(data.id, data.user);
  }

  @MessagePattern(MSG.APPT_GET_BY_DOCTOR)
  async getByDoctor(@Payload() data: { doctorId: number; query: any }) {
    return await this.apptService.getByDoctor(data.doctorId, data.query);
  }
}
