import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RedisLockService } from '@app/common';
import { PharmacyServiceController } from './pharmacy-service.controller';
import { PharmacyServiceService } from './pharmacy-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PharmacyServiceController],
  providers: [PharmacyServiceService, RedisLockService],
})
export class PharmacyServiceModule {}
