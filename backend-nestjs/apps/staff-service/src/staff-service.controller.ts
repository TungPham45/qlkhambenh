import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { StaffServiceService } from './staff-service.service';
import { MSG, CreateSpecialtyDto, CreateStaffDto, UpdateSpecialtyDto, UpdateStaffDto } from '@app/common';

@Controller()
export class StaffServiceController {
  constructor(private readonly staffService: StaffServiceService) {}

  @MessagePattern(MSG.STAFF_GET_ALL)
  async getAll(@Payload() query: any) {
    return await this.staffService.getAll(query);
  }

  @MessagePattern(MSG.STAFF_GET_BY_ID)
  async getById(@Payload() data: { id: number }) {
    return await this.staffService.getById(data.id);
  }

  @MessagePattern(MSG.STAFF_CREATE)
  async create(@Payload() dto: CreateStaffDto) {
    try {
      return await this.staffService.create(dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.STAFF_UPDATE)
  async update(@Payload() data: { id: number; dto: UpdateStaffDto }) {
    try {
      return await this.staffService.update(data.id, data.dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.STAFF_DELETE)
  async delete(@Payload() data: { id: number }) {
    try {
      return await this.staffService.delete(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.SPECIALTY_GET_ALL)
  async getSpecialties(@Payload() query: any) {
    return await this.staffService.getSpecialties(query);
  }

  @MessagePattern(MSG.SPECIALTY_GET_BY_ID)
  async getSpecialty(@Payload() data: { id: number }) {
    return await this.staffService.getSpecialty(data.id);
  }

  @MessagePattern(MSG.SPECIALTY_CREATE)
  async createSpecialty(@Payload() dto: CreateSpecialtyDto) {
    try {
      return await this.staffService.createSpecialty(dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.SPECIALTY_UPDATE)
  async updateSpecialty(@Payload() data: { id: number; dto: UpdateSpecialtyDto }) {
    try {
      return await this.staffService.updateSpecialty(data.id, data.dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.SPECIALTY_DELETE)
  async deleteSpecialty(@Payload() data: { id: number }) {
    try {
      return await this.staffService.deleteSpecialty(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }
}

function toRpcException(error: any) {
  const statusCode = error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể thực hiện thao tác quản lý';
  return new RpcException({ statusCode, message });
}
