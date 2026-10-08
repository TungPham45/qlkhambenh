import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import {
  CreateDiseaseDto,
  DiseaseQueryDto,
  MSG,
  REDIS_SERVICES,
  Roles,
  UpdateDiseaseDto,
  UpdateDiseaseStatusDto,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Disease Catalog')
@ApiBearerAuth()
@Controller('api/diseases')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.BAC_SI)
export class DiseasesController {
  constructor(
    @Inject(REDIS_SERVICES.MEDICAL_RECORD_SERVICE)
    private readonly medicalRecordClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh mục tên bệnh' })
  async getAll(@Query() query: DiseaseQueryDto) {
    return this.forward(MSG.DISEASE_GET_ALL, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một bệnh trong danh mục' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.forward(MSG.DISEASE_GET_BY_ID, { id });
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Thêm bệnh vào danh mục' })
  async create(@Body() dto: CreateDiseaseDto) {
    return this.forward(MSG.DISEASE_CREATE, dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật bệnh trong danh mục' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiseaseDto,
  ) {
    return this.forward(MSG.DISEASE_UPDATE, { id, dto });
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Kích hoạt hoặc ngừng sử dụng bệnh' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDiseaseStatusDto,
  ) {
    return this.forward(MSG.DISEASE_UPDATE_STATUS, { id, dto });
  }

  private async forward(pattern: object, payload: unknown) {
    try {
      return await firstValueFrom(this.medicalRecordClient.send(pattern, payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

function toHttpException(error: any) {
  const payload =
    error?.message && typeof error.message === 'object'
      ? error.message
      : error?.error && typeof error.error === 'object'
        ? error.error
        : error;
  const candidateStatus = payload?.statusCode ?? payload?.status;
  const status =
    Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
      ? candidateStatus
      : HttpStatus.BAD_REQUEST;
  const message =
    payload?.message || error?.message || 'Không thể thực hiện thao tác với danh mục bệnh';
  return new HttpException(message, status);
}
