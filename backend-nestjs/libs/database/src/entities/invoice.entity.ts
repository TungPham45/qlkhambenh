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
  @PrimaryColumn({ length: 50 })
  id: string; // VD: 'HD0001'

  @Column({ name: 'phieu_kham_id', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'benh_nhan_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'ngay_lap', type: 'date', default: () => 'CURRENT_DATE' })
  createdDate: string;

  @Column({
    name: 'chi_phi_kham',
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

  @Column({
    name: 'phuong_thuc_thanh_toan',
    type: 'varchar',
    length: 50,
    default: PaymentMethod.TIEN_MAT,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'trang_thai_thanh_toan',
    type: 'varchar',
    length: 50,
    default: BillingStatus.CHUA_THANH_TOAN,
  })
  paymentStatus: BillingStatus;

  @Column({ name: 'thoi_gian_thanh_toan', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @OneToOne(() => MedicalRecord, (rec) => rec.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phieu_kham_id' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
