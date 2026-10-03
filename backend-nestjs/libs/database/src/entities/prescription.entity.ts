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

@Entity('don_thuoc')
export class Prescription {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'phieu_kham_id', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'benh_nhan_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'bac_si_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_ke_don', type: 'date', default: () => 'CURRENT_DATE' })
  prescriptionDate: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  note: string;

  @Column({
    name: 'trang_thai',
    type: 'varchar',
    length: 30,
    default: PrescriptionStatus.CREATED,
  })
  status: PrescriptionStatus;

  @OneToOne(() => MedicalRecord, (rec) => rec.prescription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'phieu_kham_id' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'bac_si_id' })
  doctor?: Staff;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, { cascade: true })
  items?: PrescriptionItem[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
