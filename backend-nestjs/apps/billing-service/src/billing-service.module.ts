import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@app/database';
import { REDIS_SERVICES } from '@app/common';
import { BillingServiceController } from './billing-service.controller';
import { BillingServiceService } from './billing-service.service';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: REDIS_SERVICES.PHARMACY_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
      {
        name: REDIS_SERVICES.ANALYTICS_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  controllers: [BillingServiceController],
  providers: [BillingServiceService],
})
export class BillingServiceModule {}
