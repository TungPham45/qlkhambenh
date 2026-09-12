import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Inject,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  CurrentUser,
  CreatePatientDto,
  UpdatePatientDto,
} from '@app/common';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('api/patients')
export class PatientsController {
  constructor(
    @Inject(REDIS_SERVICES.PATIENT_SERVICE)
    private readonly patientClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bệnh nhân' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_ALL, { query, user }),
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm bệnh nhân' })
  async search(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_ALL, { query, user }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bệnh nhân theo ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_BY_ID, { id }),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Thêm mới hồ sơ bệnh nhân' })
  async create(@Body() dto: CreatePatientDto) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_CREATE, dto),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật hồ sơ bệnh nhân' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePatientDto,
  ) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_UPDATE, { id, dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hồ sơ bệnh nhân' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_DELETE, { id }),
    );
  }
}
