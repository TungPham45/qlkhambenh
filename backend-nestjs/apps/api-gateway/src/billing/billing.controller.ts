import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  REDIS_SERVICES,
  MSG,
  CurrentUser,
  CreateInvoiceDto,
  UpdateInvoiceStatusDto,
} from '@app/common';

@ApiTags('Billing & Payments')
@ApiBearerAuth()
@Controller('api/billings')
export class BillingController {
  constructor(
    @Inject(REDIS_SERVICES.BILLING_SERVICE)
    private readonly billingClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách hóa đơn' })
  async getAll(@Query() query: any, @CurrentUser() user: any) {
    return await firstValueFrom(
      this.billingClient.send(MSG.BILLING_GET_ALL, { query, user }),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết hóa đơn theo mã' })
  async getById(@Param('id') id: string) {
    return await firstValueFrom(
      this.billingClient.send(MSG.BILLING_GET_BY_ID, { id }),
    );
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới hóa đơn' })
  async create(@Body() dto: CreateInvoiceDto) {
    return await firstValueFrom(
      this.billingClient.send(MSG.BILLING_CREATE, dto),
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Thanh toán hoặc cập nhật trạng thái hóa đơn' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
    @CurrentUser() user: any,
  ) {
    return await firstValueFrom(
      this.billingClient.send(MSG.BILLING_UPDATE_STATUS, { id, dto, user }),
    );
  }
}
