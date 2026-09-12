import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { StaffServiceController } from './staff-service.controller';
import { StaffServiceService } from './staff-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [StaffServiceController],
  providers: [StaffServiceService],
})
export class StaffServiceModule {}
