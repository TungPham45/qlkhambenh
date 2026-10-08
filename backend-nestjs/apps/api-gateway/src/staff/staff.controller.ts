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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  CreateStaffDto,
  UpdateStaffDto,
  CreateSpecialtyDto,
  UpdateSpecialtyDto,
} from '@app/common';

@ApiTags('Staff & Doctors')
@ApiBearerAuth()
@Controller('api')
export class StaffController {
  constructor(
    @Inject(REDIS_SERVICES.STAFF_SERVICE)
    private readonly staffClient: ClientProxy,
  ) {}

  @Get('staff')
  @ApiOperation({ summary: 'Lấy danh sách nhân viên' })
  async getStaff(@Query() query: any) {
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_GET_ALL, query));
  }

  @Get('admin/staff')
  @ApiOperation({ summary: 'Lấy danh sách nhân viên cho Admin / Lookup' })
  async getAdminStaff(@Query() query: any) {
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_GET_ALL, query));
  }

  @Get('staff/:id')
  @ApiOperation({ summary: 'Lấy chi tiết nhân viên theo ID' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_GET_BY_ID, { id }));
  }

  @Post('admin/staff')
  @ApiOperation({ summary: 'Tạo hồ sơ nhân viên mới' })
  async createAdminStaff(@Body() dto: CreateStaffDto) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.STAFF_CREATE, dto));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Post('staff')
  @ApiOperation({ summary: 'Tạo hồ sơ nhân viên mới' })
  async createStaff(@Body() dto: CreateStaffDto) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.STAFF_CREATE, dto));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Put('staff/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  async updateStaff(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStaffDto,
  ) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.STAFF_UPDATE, { id, dto }));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Delete('staff/:id')
  @ApiOperation({ summary: 'Xóa nhân viên' })
  async deleteStaff(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.STAFF_DELETE, { id }));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Get('specialties')
  @ApiOperation({ summary: 'Lấy danh sách chuyên khoa' })
  async getSpecialties(@Query() query: any) {
    return await firstValueFrom(this.staffClient.send(MSG.SPECIALTY_GET_ALL, query));
  }

  @Get('specialties/:id')
  async getSpecialty(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(this.staffClient.send(MSG.SPECIALTY_GET_BY_ID, { id }));
  }

  @Post('specialties')
  async createSpecialty(@Body() dto: CreateSpecialtyDto) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.SPECIALTY_CREATE, dto));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Put('specialties/:id')
  async updateSpecialty(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSpecialtyDto) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.SPECIALTY_UPDATE, { id, dto }));
    } catch (error) {
      throw toHttpException(error);
    }
  }

  @Delete('specialties/:id')
  async deleteSpecialty(@Param('id', ParseIntPipe) id: number) {
    try {
      return await firstValueFrom(this.staffClient.send(MSG.SPECIALTY_DELETE, { id }));
    } catch (error) {
      throw toHttpException(error);
    }
  }
}

function toHttpException(error: any) {
  const message = error?.message || error?.error?.message || 'Không thể thực hiện thao tác quản lý';
  const candidateStatus = error?.statusCode || error?.status || error?.error?.statusCode;
  const status = Number.isInteger(candidateStatus) && candidateStatus >= 400 && candidateStatus <= 599
    ? candidateStatus
    : HttpStatus.BAD_REQUEST;
  return new HttpException(message, status);
}
