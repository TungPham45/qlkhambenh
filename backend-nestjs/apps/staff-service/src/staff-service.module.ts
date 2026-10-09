import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ALL_ENTITIES } from '@app/database';
import { StaffServiceController } from './staff-service.controller';
import { StaffServiceService } from './staff-service.service';
import { WorkSchedule } from './work-schedule.entity';
import { WorkSchedulesService } from './work-schedules.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'clinic_admin',
        password: process.env.DB_PASSWORD || 'clinic_secure_password',
        database: process.env.DB_NAME || 'clinic_master',
        entities: [...ALL_ENTITIES, WorkSchedule],
        synchronize: false,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([...ALL_ENTITIES, WorkSchedule]),
  ],
  controllers: [StaffServiceController],
  providers: [StaffServiceService, WorkSchedulesService],
})
export class StaffServiceModule {}
