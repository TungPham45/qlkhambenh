import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentMethod, BillingStatus } from '@app/common';
import { MedicalRecord } from './medical-record.entity';
import { Patient } from './patient.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryColumn({ length: 50 })
  id: string; // VD: 'HD0001'

  @Column({ name: 'medical_record_id', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'patient_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'created_date', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate: string;

  @Column({
    name: 'examination_fee',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 150000.0,
  })
  examinationFee: number;

  @Column({
    name: 'drug_fee',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  drugFee: number;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  totalAmount: number;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 50,
    default: PaymentMethod.TIEN_MAT,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 50,
    default: BillingStatus.CHUA_THANH_TOAN,
  })
  paymentStatus: BillingStatus;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @OneToOne(() => MedicalRecord, (rec) => rec.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
