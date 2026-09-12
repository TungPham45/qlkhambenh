import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RedisLockService } from '@app/common';
import { StatisticalServiceController } from './statistical-service.controller';
import { StatisticalServiceService } from './statistical-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StatisticalServiceController],
  providers: [StatisticalServiceService, RedisLockService],
})
export class StatisticalServiceModule {}
