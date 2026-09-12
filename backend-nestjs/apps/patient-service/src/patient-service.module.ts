import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { PatientServiceController } from './patient-service.controller';
import { PatientServiceService } from './patient-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PatientServiceController],
  providers: [PatientServiceService],
})
export class PatientServiceModule {}
