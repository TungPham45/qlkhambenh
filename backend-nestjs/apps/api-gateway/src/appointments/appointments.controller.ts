import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
  CreateAppointmentDto,
  UpdateAppointmentStatusDto,
} from '@app/common';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('api/appointments')
export class AppointmentsController {
  constructor(
    @Inject(REDIS_SERVICES.APPOINTMENT_SERVICE)
    private readonly apptClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch khám' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_GET_ALL, { query, user }),
    );
  }

  @Get('doctor/:id/patients')
  @ApiOperation({ summary: 'Lấy danh sách bệnh nhân theo bác sĩ' })
  async getByDoctor(@Param('id', ParseIntPipe) doctorId: number, @Query() query: any) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_GET_BY_DOCTOR, { doctorId, query }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết lịch khám' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(this.apptClient.send(MSG.APPT_GET_BY_ID, { id }));
  }

  @Post()
  @ApiOperation({ summary: 'Đặt lịch khám mới (kiểm tra chống trùng lịch 60 phút)' })
  async create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_CREATE, { dto, user }),
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật lịch khám' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateAppointmentDto>,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_UPDATE, { id, dto, user }),
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch khám' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentStatusDto,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_UPDATE_STATUS, { id, dto, user }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy hoặc xóa lịch khám' })
  async delete(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.apptClient.send(MSG.APPT_DELETE, { id, user }),
    );
  }
}
