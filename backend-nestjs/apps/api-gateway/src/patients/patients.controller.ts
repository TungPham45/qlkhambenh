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
  HttpException,
  HttpStatus,
  UseGuards,
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
  Roles,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('api/patients')
export class PatientsController {
  constructor(
    @Inject(REDIS_SERVICES.PATIENT_SERVICE)
    private readonly patientClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy danh sách bệnh nhân' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_ALL, { query, user }),
    );
  }

  @Get('search')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Tìm kiếm bệnh nhân' })
  async search(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_ALL, { query, user }),
    );
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy chi tiết bệnh nhân theo ID' })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET_BY_ID, { id, user }),
    );
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Thêm mới hồ sơ bệnh nhân' })
  async create(@Body() dto: CreatePatientDto) {
    try {
      return await firstValueFrom(this.patientClient.send(MSG.PATIENT_CREATE, dto));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật hồ sơ bệnh nhân' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePatientDto,
  ) {
    try {
      return await firstValueFrom(this.patientClient.send(MSG.PATIENT_UPDATE, { id, dto }));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa hồ sơ bệnh nhân' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.patientClient.send(MSG.PATIENT_DELETE, { id }));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

function toHttpException(error: any) {
  const message = error?.message || error?.error?.message || 'Không thể thực hiện thao tác bệnh nhân';
  const candidateStatus = error?.statusCode || error?.status || error?.error?.statusCode;
  const status = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
    ? candidateStatus
    : HttpStatus.BAD_REQUEST;
  return new HttpException(message, status);
}
