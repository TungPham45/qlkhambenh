import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StaffServiceService } from './staff-service.service';
import { MSG, CreateStaffDto, UpdateStaffDto } from '@app/common';

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
    return await this.staffService.create(dto);
  }

  @MessagePattern(MSG.STAFF_UPDATE)
  async update(@Payload() data: { id: number; dto: UpdateStaffDto }) {
    return await this.staffService.update(data.id, data.dto);
  }

  @MessagePattern(MSG.STAFF_DELETE)
  async delete(@Payload() data: { id: number }) {
    return await this.staffService.delete(data.id);
  }
}
