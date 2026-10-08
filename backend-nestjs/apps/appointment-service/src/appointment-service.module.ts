import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@app/database';
import { REDIS_SERVICES, RedisLockService } from '@app/common';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';
import { PatientReceptionService } from './patient-reception.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: REDIS_SERVICES.AUTH_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          password: process.env.REDIS_PASSWORD || undefined,
        },
      },
    ]),
  ],
  controllers: [AppointmentServiceController],
  providers: [AppointmentServiceService, PatientReceptionService, RedisLockService],
})
export class AppointmentServiceModule {}
