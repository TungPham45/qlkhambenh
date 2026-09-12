import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RedisLockService } from '@app/common';
import { AnalyticsServiceController } from './analytics-service.controller';
import { AnalyticsServiceService } from './analytics-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AnalyticsServiceController],
  providers: [AnalyticsServiceService, RedisLockService],
})
export class AnalyticsServiceModule {}
