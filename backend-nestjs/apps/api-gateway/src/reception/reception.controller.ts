import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import {
  CreatePatientReceptionDto,
  CurrentUser,
  MSG,
  ReceptionQueryDto,
  REDIS_SERVICES,
  Roles,
  UpdatePatientReceptionDto,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Patient Reception')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN, UserRole.BAC_SI)
@Controller('api/reception')
export class ReceptionController {
  constructor(
    @Inject(REDIS_SERVICES.APPOINTMENT_SERVICE)
    private readonly appointmentClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lịch hẹn và trạng thái tiếp nhận' })
  async getAll(
    @Query() query: ReceptionQueryDto,
    @CurrentUser() user: any,
  ) {
    return await this.send(MSG.RECEPTION_GET_ALL, { query, user });
  }

  @Get(':appointmentId')
  @ApiOperation({ summary: 'Xem thông tin tiếp nhận theo lịch hẹn' })
  async getByAppointment(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @CurrentUser() user: any,
  ) {
    return await this.send(MSG.RECEPTION_GET_BY_APPOINTMENT, {
      appointmentId,
      user,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Tiếp nhận bệnh nhân lần đầu' })
  async create(
    @Body() dto: CreatePatientReceptionDto,
    @CurrentUser() user: any,
  ) {
    return await this.send(MSG.RECEPTION_CREATE, { dto, user });
  }

  @Put(':appointmentId')
  @ApiOperation({ summary: 'Cập nhật thông tin tiếp nhận bệnh nhân' })
  async update(
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
    @Body() dto: UpdatePatientReceptionDto,
    @CurrentUser() user: any,
  ) {
    return await this.send(MSG.RECEPTION_UPDATE, {
      appointmentId,
      dto,
      user,
    });
  }

  private async send(pattern: any, payload: any) {
    try {
      return await firstValueFrom(this.appointmentClient.send(pattern, payload));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

function toHttpException(error: any) {
  const payload =
    error?.error && typeof error.error === 'object' ? error.error : error;
  const message =
    payload?.message ||
    error?.message ||
    'Không thể thực hiện thao tác tiếp nhận bệnh nhân';
  const candidateStatus =
    payload?.statusCode ||
    payload?.status ||
    error?.statusCode ||
    error?.status;
  const status =
    Number.isInteger(candidateStatus) &&
    candidateStatus >= 400 &&
    candidateStatus <= 599
      ? candidateStatus
      : HttpStatus.BAD_REQUEST;

  return new HttpException(message, status);
}
