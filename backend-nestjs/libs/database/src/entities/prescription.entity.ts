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
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_don_thuoc' })
  id: number;

  @Column({ name: 'id_phieu_kham', type: 'bigint', unique: true })
  medicalRecordId: number;

  @Column({ name: 'id_benh_nhan', type: 'bigint' })
  patientId: number;

  @Column({ name: 'id_bac_si', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_ke_don', type: 'date', default: () => 'CURRENT_DATE' })
  prescriptionDate: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  note: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'trang_thai',
    default: PrescriptionStatus.CREATED,
  })
  status: PrescriptionStatus;

  @OneToOne(() => MedicalRecord, (rec) => rec.prescription, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_phieu_kham' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'id_benh_nhan' })
  patient?: Patient;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: 'id_bac_si' })
  doctor?: Staff;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription, { cascade: true })
  items?: PrescriptionItem[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
