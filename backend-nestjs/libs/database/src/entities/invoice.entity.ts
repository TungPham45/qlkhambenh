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

@Entity('hoa_don')
export class Invoice {
  @PrimaryColumn({ name: 'id_hoa_don', length: 30 })
  id: string; // VD: 'HD0001'

  @Column({ name: 'id_phieu_kham', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'id_benh_nhan', type: 'bigint' })
  patientId: number;

  @Column({ name: 'ngay_lap', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate: string;

  @Column({
    name: 'phi_kham',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 150000.0,
  })
  examinationFee: number;

  @Column({
    name: 'tien_thuoc',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0.0,
  })
  drugFee: number;

  @Column({
    name: 'tong_tien',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  totalAmount: number;

  paymentMethod: PaymentMethod;

  @Column({
    name: 'trang_thai_thanh_toan',
    type: 'varchar',
    length: 50,
    default: BillingStatus.CHUA_THANH_TOAN,
  })
  paymentStatus: BillingStatus;

  paidAt: Date;

  @OneToOne(() => MedicalRecord, (rec) => rec.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_phieu_kham' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'id_benh_nhan' })
  patient?: Patient;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
