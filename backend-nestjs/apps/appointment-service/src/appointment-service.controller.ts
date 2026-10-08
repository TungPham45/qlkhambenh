import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AppointmentServiceService } from './appointment-service.service';
import {
  MSG,
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
  CreatePatientReceptionDto,
  UpdatePatientReceptionDto,
} from '@app/common';
import { PatientReceptionService } from './patient-reception.service';

@Controller()
export class AppointmentServiceController {
  constructor(
    private readonly apptService: AppointmentServiceService,
    private readonly receptionService: PatientReceptionService,
  ) {}

  @MessagePattern(MSG.APPT_GET_ALL)
  async getAll(@Payload() data: { query: any; user: any }) {
    try {
      return await this.apptService.getAll(data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_GET_BY_ID)
  async getById(@Payload() data: { id: number; user: any }) {
    try {
      return await this.apptService.getById(data.id, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_CREATE)
  async create(@Payload() data: { dto: CreateAppointmentDto; user: any }) {
    try {
      return await this.apptService.create(data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_UPDATE)
  async update(@Payload() data: { id: number; dto: Partial<CreateAppointmentDto>; user: any }) {
    try {
      return await this.apptService.update(data.id, data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_UPDATE_STATUS)
  async updateStatus(@Payload() data: { id: number; dto: UpdateAppointmentStatusDto; user: any }) {
    try {
      return await this.apptService.updateStatus(data.id, data.dto, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_DELETE)
  async delete(@Payload() data: { id: number; user: any }) {
    try {
      return await this.apptService.delete(data.id, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.APPT_GET_BY_DOCTOR)
  async getByDoctor(@Payload() data: { doctorId: number; query: any; user: any }) {
    try {
      return await this.apptService.getByDoctor(data.doctorId, data.query, data.user);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.RECEPTION_GET_ALL)
  async getReceptions(@Payload() data: { query: any; user: any }) {
    return await this.receptionService.getAll(data.query, data.user);
  }

  @MessagePattern(MSG.RECEPTION_GET_BY_APPOINTMENT)
  async getReceptionByAppointment(
    @Payload() data: { appointmentId: number; user: any },
  ) {
    return await this.receptionService.getByAppointment(
      data.appointmentId,
      data.user,
    );
  }

  @MessagePattern(MSG.RECEPTION_CREATE)
  async createReception(
    @Payload() data: { dto: CreatePatientReceptionDto; user: any },
  ) {
    return await this.receptionService.create(data.dto, data.user);
  }

  @MessagePattern(MSG.RECEPTION_UPDATE)
  async updateReception(
    @Payload()
    data: {
      appointmentId: number;
      dto: UpdatePatientReceptionDto;
      user: any;
    },
  ) {
    return await this.receptionService.update(
      data.appointmentId,
      data.dto,
      data.user,
    );
  }
}

function toRpcException(error: any) {
  const statusCode = error instanceof HttpException
    ? error.getStatus()
    : Number(error?.statusCode || error?.status) || HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể xử lý lịch khám';
  return new RpcException({ statusCode, message });
}
