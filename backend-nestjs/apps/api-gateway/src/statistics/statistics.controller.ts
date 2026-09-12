import { Controller, Get, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { REDIS_SERVICES, MSG, DateRangeQueryDto } from '@app/common';

@ApiTags('Statistical & AI Forecast Engine')
@ApiBearerAuth()
@Controller('api/statistics')
export class StatisticsController {
  constructor(
    @Inject(REDIS_SERVICES.STATISTICAL_SERVICE)
    private readonly statsClient: ClientProxy,
  ) {}

  @Get('averages')
  @ApiOperation({ summary: 'Thống kê trung bình & Trung bình động 7 ngày' })
  async averages(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_AVERAGES, query),
    );
  }

  @Get('distributions')
  @ApiOperation({ summary: 'Phân phối giờ cao điểm và trạng thái lịch hẹn' })
  async distributions(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_DISTRIBUTIONS, query),
    );
  }

  @Get('trends')
  @ApiOperation({ summary: 'Xu hướng doanh thu, lịch hẹn và tỷ lệ tăng trưởng' })
  async trends(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_TRENDS, query),
    );
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Dự báo hồi quy tuyến tính 7 ngày tiếp theo' })
  async forecast(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_FORECAST, query),
    );
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Phát hiện dữ liệu bất thường (Z-score >= 2.0)' })
  async anomalies(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_ANOMALIES, query),
    );
  }

  @Get('timeseries')
  @ApiOperation({ summary: 'Chuỗi dữ liệu thời gian chi tiết' })
  async timeseries(@Query() query: DateRangeQueryDto) {
    return await firstValueFrom(
      this.statsClient.send(MSG.STATS_TIMESERIES, query),
    );
  }
}
