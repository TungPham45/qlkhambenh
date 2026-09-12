import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@app/database';
import { REDIS_SERVICES } from '@app/common';
import { MedicalRecordServiceController } from './medical-record-service.controller';
import { MedicalRecordServiceService } from './medical-record-service.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: REDIS_SERVICES.BILLING_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  controllers: [MedicalRecordServiceController],
  providers: [MedicalRecordServiceService],
})
export class MedicalRecordServiceModule {}
