import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PrescriptionStatus } from '@app/common';
import { MedicalRecord } from './medical-record.entity';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { PrescriptionItem } from './prescription-item.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'medical_record_id', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'doctor_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'prescription_date', type: 'date', default: () => 'CURRENT_DATE' })
  prescriptionDate: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: PrescriptionStatus.CREATED,
  })
  status: PrescriptionStatus;

  @OneToOne(() => MedicalRecord, (rec) => rec.prescription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'doctor_id' })
  doctor?: Staff;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, { cascade: true })
  items?: PrescriptionItem[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
