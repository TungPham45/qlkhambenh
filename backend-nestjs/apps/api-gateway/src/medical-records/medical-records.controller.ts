import {
  Controller,
  Get,
  Post,
  Put,
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
  CreateMedicalRecordDto,
} from '@app/common';

@ApiTags('Medical Records')
@ApiBearerAuth()
@Controller('api/medical-records')
export class MedicalRecordsController {
  constructor(
    @Inject(REDIS_SERVICES.MEDICAL_RECORD_SERVICE)
    private readonly medClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách phiếu khám / bệnh án' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_ALL, { query, user }),
    );
  }

  @Get('doctor/:id/patients')
  @ApiOperation({ summary: 'Lấy danh sách bệnh án theo bác sĩ' })
  async getByDoctor(@Param('id', ParseIntPipe) doctorId: number, @Query() query: any) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_DOCTOR, { doctorId, query }),
    );
  }

  @Get('appointments/:id')
  @ApiOperation({ summary: 'Lấy phiếu khám theo mã lịch hẹn' })
  async getByAppointment(@Param('id', ParseIntPipe) appointmentId: number) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_APPT, { appointmentId }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết phiếu khám' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_ID, { id }),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Tạo phiếu khám bệnh' })
  async create(@Body() dto: CreateMedicalRecordDto) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_CREATE, dto),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật phiếu khám' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMedicalRecordDto>,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_UPDATE, { id, dto }),
    );
  }
}
