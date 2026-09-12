import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { RedisLockService } from '@app/common';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AppointmentServiceController],
  providers: [AppointmentServiceService, RedisLockService],
})
export class AppointmentServiceModule {}
