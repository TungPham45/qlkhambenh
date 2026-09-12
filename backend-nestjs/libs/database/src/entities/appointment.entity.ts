import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AppointmentStatus } from '@app/common';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('appointments')
@Index(['doctorId', 'appointmentDate', 'appointmentTime'])
export class Appointment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'doctor_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'appointment_date', type: 'date' })
  appointmentDate: string;

  @Column({ name: 'appointment_time', type: 'time' })
  appointmentTime: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: AppointmentStatus.CHO_KHAM,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.appointments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: Staff;

  @OneToOne(() => MedicalRecord, (rec) => rec.appointment)
  medicalRecord?: MedicalRecord;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
