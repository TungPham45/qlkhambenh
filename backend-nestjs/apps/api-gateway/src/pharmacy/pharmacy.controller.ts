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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  CurrentUser,
  CreateDrugDto,
  UpdateDrugDto,
  CreatePrescriptionDto,
  Roles,
  UserRole,
} from '@app/common';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Pharmacy & Prescriptions')
@ApiBearerAuth()
@Controller('api')
export class PharmacyController {
  constructor(
    @Inject(REDIS_SERVICES.PHARMACY_SERVICE)
    private readonly pharmacyClient: ClientProxy,
  ) {}

  // --- DRUGS ---
  @Get('drugs')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy danh mục thuốc' })
  async getDrugs(@Query() query: any) {
    return await firstValueFrom(this.pharmacyClient.send(MSG.DRUG_GET_ALL, query));
  }

  @Get('drugs/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy chi tiết thuốc theo ID' })
  async getDrugById(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.DRUG_GET_BY_ID, { id }),
    );
  }

  @Post('drugs')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Thêm thuốc mới vào kho' })
  async createDrug(@Body() dto: CreateDrugDto) {
    return await firstValueFrom(this.pharmacyClient.send(MSG.DRUG_CREATE, dto));
  }

  @Put('drugs/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin thuốc' })
  async updateDrug(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDrugDto,
  ) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.DRUG_UPDATE, { id, dto }),
    );
  }

  @Delete('drugs/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa thuốc khỏi danh mục' })
  async deleteDrug(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.DRUG_DELETE, { id }),
    );
  }

  // --- PRESCRIPTIONS ---
  @Get('prescriptions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy danh sách đơn thuốc' })
  async getPrescriptions(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.PRESCRIPTION_GET_ALL, { query, user }),
    );
  }

  @Get('prescriptions/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI, UserRole.NGUOI_DUNG)
  @ApiOperation({ summary: 'Lấy chi tiết đơn thuốc' })
  async getPrescriptionById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.PRESCRIPTION_GET_BY_ID, { id, user }),
    );
  }

  @Post('prescriptions')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.BAC_SI)
  @ApiOperation({ summary: 'Kê đơn thuốc cho bệnh nhân' })
  async createPrescription(
    @Body() dto: CreatePrescriptionDto,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.PRESCRIPTION_CREATE, { dto, user }),
    );
  }

  @Post('prescriptions/:id/deduct-stock')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Trừ kho thuốc theo đơn' })
  async deductStock(@Param('id', ParseIntPipe) id: number) {
    return await firstValueFrom(
      this.pharmacyClient.send(MSG.PRESCRIPTION_DEDUCT_STOCK, { id }),
    );
  }
}
