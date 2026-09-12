import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatisticalServiceService } from './statistical-service.service';
import { MSG } from '@app/common';

@Controller()
export class StatisticalServiceController {
  constructor(private readonly statsService: StatisticalServiceService) {}

  @MessagePattern(MSG.STATS_AVERAGES)
  async averages(@Payload() filters: any) {
    return await this.statsService.averages(filters);
  }

  @MessagePattern(MSG.STATS_DISTRIBUTIONS)
  async distributions(@Payload() filters: any) {
    return await this.statsService.distributions(filters);
  }

  @MessagePattern(MSG.STATS_TRENDS)
  async trends(@Payload() filters: any) {
    return await this.statsService.trends(filters);
  }

  @MessagePattern(MSG.STATS_FORECAST)
  async forecast(@Payload() filters: any) {
    return await this.statsService.forecast(filters);
  }

  @MessagePattern(MSG.STATS_ANOMALIES)
  async anomalies(@Payload() filters: any) {
    return await this.statsService.anomalies(filters);
  }

  @MessagePattern(MSG.STATS_TIMESERIES)
  async timeseries(@Payload() filters: any) {
    return await this.statsService.timeseries(filters);
  }
}
