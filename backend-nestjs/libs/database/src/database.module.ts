import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Staff } from './entities/staff.entity';
import { Patient } from './entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { MedicalRecord } from './entities/medical-record.entity';
import { Drug } from './entities/drug.entity';
import { Prescription } from './entities/prescription.entity';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { Invoice } from './entities/invoice.entity';
import { ComputedMetric } from './entities/computed-metric.entity';
import {
  ActivityLog,
  AppointmentHistory,
  Diagnosis,
  DiseaseCatalog,
  DoctorSpecialty,
  DrugInventoryTransaction,
  DrugSuggestion,
  Manager,
  MedicalHistory,
  Notification,
  PatientReception,
  Payment,
  Specialty,
  WorkSchedule,
} from './entities/clinic-model.entity';

export const ALL_ENTITIES = [
  Account,
  Staff,
  Patient,
  Appointment,
  MedicalRecord,
  Drug,
  Prescription,
  PrescriptionItem,
  Invoice,
  ComputedMetric,
  Manager,
  Specialty,
  DoctorSpecialty,
  WorkSchedule,
  AppointmentHistory,
  PatientReception,
  DiseaseCatalog,
  Diagnosis,
  MedicalHistory,
  DrugSuggestion,
  DrugInventoryTransaction,
  Payment,
  Notification,
  ActivityLog,
];

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
        entities: ALL_ENTITIES,
        synchronize: false,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
