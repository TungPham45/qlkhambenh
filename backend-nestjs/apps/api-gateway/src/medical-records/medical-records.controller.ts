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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  CurrentUser,
  CreateMedicalRecordDto,
  MedicalHistoryQueryDto,
  Roles,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Medical Records')
@ApiBearerAuth()
@Controller('api/medical-records')
export class MedicalRecordsController {
  constructor(
    @Inject(REDIS_SERVICES.MEDICAL_RECORD_SERVICE)
    private readonly medClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy danh sách phiếu khám / bệnh án' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_ALL, { query, user }),
    );
  }

  @Get('history')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Tra cứu lịch sử khám theo phạm vi người dùng' })
  async getHistory(
    @Query() query: MedicalHistoryQueryDto,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_HISTORY, { query, user }),
    );
  }

  @Get('history/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Xem chi tiết một lần khám theo phạm vi người dùng' })
  async getHistoryDetail(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_HISTORY_DETAIL, { id, user }),
    );
  }

  @Get('doctor/:id/patients')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI)
  @ApiOperation({ summary: 'Lấy danh sách bệnh án theo bác sĩ' })
  async getByDoctor(
    @Param('id', ParseIntPipe) doctorId: number,
    @Query() query: any,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_DOCTOR, { doctorId, query, user }),
    );
  }

  @Get('appointments/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy phiếu khám theo mã lịch hẹn' })
  async getByAppointment(
    @Param('id', ParseIntPipe) appointmentId: number,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_APPT, { appointmentId, user }),
    );
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy chi tiết phiếu khám' })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_GET_BY_ID, { id, user }),
    );
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI)
  @ApiOperation({ summary: 'Tạo phiếu khám bệnh' })
  async create(
    @Body() dto: CreateMedicalRecordDto,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_CREATE, { dto, user }),
    );
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI)
  @ApiOperation({ summary: 'Cập nhật phiếu khám' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMedicalRecordDto>,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.medClient.send(MSG.MED_REC_UPDATE, { id, dto, user }),
    );
  }
}
