import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_SERVICES } from '@app/common';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';

import { AuthController } from './auth/auth.controller';
import { PatientsController } from './patients/patients.controller';
import { StaffController } from './staff/staff.controller';
import { AppointmentsController } from './appointments/appointments.controller';
import { MedicalRecordsController } from './medical-records/medical-records.controller';
import { PharmacyController } from './pharmacy/pharmacy.controller';
import { BillingController } from './billing/billing.controller';
import { AnalyticsController } from './analytics/analytics.controller';
import { StatisticsController } from './statistics/statistics.controller';
import { DiseasesController } from './diseases/diseases.controller';
import { ReceptionController } from './reception/reception.controller';
import { NotificationsController } from './notifications/notifications.controller';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

const createRedisClient = (name: string) => ({
  name,
  transport: Transport.REDIS as const,
  options: {
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    retryAttempts: 5,
    retryDelay: 3000,
  },
});

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'clinic_jwt_super_secret_key_change_in_prod',
      signOptions: { expiresIn: '24h' },
    }),
    ClientsModule.register([
      createRedisClient(REDIS_SERVICES.AUTH_SERVICE),
      createRedisClient(REDIS_SERVICES.PATIENT_SERVICE),
      createRedisClient(REDIS_SERVICES.STAFF_SERVICE),
      createRedisClient(REDIS_SERVICES.APPOINTMENT_SERVICE),
      createRedisClient(REDIS_SERVICES.MEDICAL_RECORD_SERVICE),
      createRedisClient(REDIS_SERVICES.PHARMACY_SERVICE),
      createRedisClient(REDIS_SERVICES.BILLING_SERVICE),
      createRedisClient(REDIS_SERVICES.ANALYTICS_SERVICE),
      createRedisClient(REDIS_SERVICES.STATISTICAL_SERVICE),
    ]),
  ],
  controllers: [
    AuthController,
    PatientsController,
    StaffController,
    AppointmentsController,
    MedicalRecordsController,
    PharmacyController,
    BillingController,
    AnalyticsController,
    StatisticsController,
    DiseasesController,
    ReceptionController,
    NotificationsController,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
