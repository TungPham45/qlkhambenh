import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DatabaseModule } from '@app/database';
import { REDIS_SERVICES } from '@app/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'clinic_jwt_super_secret_key_change_in_prod',
      signOptions: { expiresIn: '24h' },
    }),
    ClientsModule.register([
      {
        name: REDIS_SERVICES.PATIENT_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  controllers: [AuthServiceController, NotificationsController],
  providers: [AuthServiceService, NotificationsService],
})
export class AuthServiceModule {}
