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
  CreateStaffDto,
  UpdateStaffDto,
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
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_CREATE, dto));
  }

  @Post('staff')
  @ApiOperation({ summary: 'Tạo hồ sơ nhân viên mới' })
  async createStaff(@Body() dto: CreateStaffDto) {
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_CREATE, dto));
  }

  @Put('staff/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  async updateStaff(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStaffDto,
  ) {
    return await firstValueFrom(
      this.staffClient.send(MSG.STAFF_UPDATE, { id, dto }),
    );
  }

  @Delete('staff/:id')
  @ApiOperation({ summary: 'Xóa nhân viên' })
  async deleteStaff(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(this.staffClient.send(MSG.STAFF_DELETE, { id }));
  }
}
