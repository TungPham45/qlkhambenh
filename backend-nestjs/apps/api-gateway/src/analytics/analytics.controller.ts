import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { REDIS_SERVICES, MSG, DateRangeQueryDto } from '@app/common';

@ApiTags('Analytics & BI')
@ApiBearerAuth()
@Controller('api/analytics')
export class AnalyticsController {
  constructor(
    @Inject(REDIS_SERVICES.ANALYTICS_SERVICE)
    private readonly analyticsClient: ClientProxy,
  ) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Lấy dữ liệu tổng hợp Dashboard phân tích' })
  async dashboard(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.analyticsClient.send(MSG.ANALYTICS_DASHBOARD, query),
    );
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Lấy các chỉ số KPIs chính' })
  async kpis(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.analyticsClient.send(MSG.ANALYTICS_KPIS, query),
    );
  }
}
