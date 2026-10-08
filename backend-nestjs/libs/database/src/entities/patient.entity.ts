import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Gender } from '@app/common';
import { Account } from './account.entity';
import { Appointment } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('benh_nhan')
export class Patient {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_benh_nhan' })
  id: number;

  @Column({ name: 'id_tai_khoan', type: 'uuid', unique: true })
  accountId: string;

  @Column({ name: 'ho_ten', length: 150 })
  fullName: string;

  @Column({ name: 'ngay_sinh', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ name: 'gioi_tinh', type: 'varchar', length: 20, nullable: true })
  gender: Gender;

  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
  phone: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  address: string;

  @Column({ name: 'email', length: 150, nullable: true })
  email: string;

  @Column({ name: 'so_bao_hiem_y_te', length: 50, nullable: true })
  healthInsuranceNumber: string;

  @Column({ name: 'trang_thai', length: 30, default: 'Active' })
  status: string;

  @OneToOne(() => Account, (acc) => acc.patient)
  @JoinColumn({ name: 'id_tai_khoan' })
  account?: Account;

  @OneToMany(() => Appointment, (appt) => appt.patient)
  appointments?: Appointment[];

  @OneToMany(() => MedicalRecord, (rec) => rec.patient)
  medicalRecords?: MedicalRecord[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
