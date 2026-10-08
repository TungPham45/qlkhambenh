import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateDiseaseDto,
  DiseaseQueryDto,
  MSG,
  UpdateDiseaseDto,
  UpdateDiseaseStatusDto,
} from '@app/common';
import { DiseaseCatalogService } from './disease-catalog.service';

@Controller()
export class DiseaseCatalogController {
  constructor(private readonly diseaseService: DiseaseCatalogService) {}

  @MessagePattern(MSG.DISEASE_GET_ALL)
  async getAll(@Payload() query: DiseaseQueryDto) {
    return this.diseaseService.getAll(query);
  }

  @MessagePattern(MSG.DISEASE_GET_BY_ID)
  async getById(@Payload() data: { id: number }) {
    try {
      return await this.diseaseService.getById(data.id);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DISEASE_CREATE)
  async create(@Payload() dto: CreateDiseaseDto) {
    try {
      return await this.diseaseService.create(dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DISEASE_UPDATE)
  async update(@Payload() data: { id: number; dto: UpdateDiseaseDto }) {
    try {
      return await this.diseaseService.update(data.id, data.dto);
    } catch (error) {
      throw toRpcException(error);
    }
  }

  @MessagePattern(MSG.DISEASE_UPDATE_STATUS)
  async updateStatus(
    @Payload() data: { id: number; dto: UpdateDiseaseStatusDto },
  ) {
    try {
      return await this.diseaseService.updateStatus(data.id, data.dto.status);
    } catch (error) {
      throw toRpcException(error);
    }
  }
}

function toRpcException(error: any) {
  const statusCode =
    error instanceof HttpException ? error.getStatus() : HttpStatus.BAD_REQUEST;
  const message = error?.message || 'Không thể thực hiện thao tác với danh mục bệnh';
  return new RpcException({ statusCode, message });
}
