import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Gender } from '@app/common';
import { Account } from './account.entity';
import { Appointment } from './appointment.entity';
import { MedicalRecord } from './medical-record.entity';
import { MedicalHistory } from './clinic-model.entity';

@Entity('benh_nhan')
export class Patient {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'ho_ten', length: 150 })
  fullName: string;

  @Column({ name: 'ngay_sinh', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ name: 'gioi_tinh', type: 'varchar', length: 10, nullable: true })
  gender: Gender;

  @Column({ name: 'so_dien_thoai', length: 20 })
  phone: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  address: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'so_bao_hiem_y_te', length: 30, nullable: true, unique: true })
  healthInsuranceNumber: string;

  @Column({ name: 'trang_thai', length: 20, default: 'Active' })
  status: string;

  medicalHistory?: string;

  username?: string;

  @OneToOne(() => Account, (acc) => acc.patient)
  account?: Account;

  @OneToMany(() => Appointment, (appt) => appt.patient)
  appointments?: Appointment[];

  @OneToMany(() => MedicalRecord, (rec) => rec.patient)
  medicalRecords?: MedicalRecord[];

  @OneToMany(() => MedicalHistory, (history) => history.patient)
  medicalHistories?: MedicalHistory[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
