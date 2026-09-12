import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { Prescription } from './prescription.entity';
import { Invoice } from './invoice.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'appointment_id', type: 'bigint', unique: true })
  appointmentId: number;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'doctor_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'examination_date', type: 'date', default: () => 'CURRENT_DATE' })
  examinationDate: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @Column({ type: 'text', nullable: true })
  conclusion: string;

  @Column({
    name: 'examination_fee',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 150000.0,
  })
  examinationFee: number;

  @OneToOne(() => Appointment, (appt) => appt.medicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appointment_id' })
  appointment?: Appointment;

  @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.medicalRecords)
  @JoinColumn({ name: 'doctor_id' })
  doctor?: Staff;

  @OneToOne(() => Prescription, (p) => p.medicalRecord)
  prescription?: Prescription;

  @OneToOne(() => Invoice, (inv) => inv.medicalRecord)
  invoice?: Invoice;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
