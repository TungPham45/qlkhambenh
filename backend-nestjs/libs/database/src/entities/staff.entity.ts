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

@Entity('bac_si')
export class Staff {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_bac_si' })
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

  @Column({ name: 'bang_cap', length: 255, nullable: true })
  specialty: string;

  @Column({ name: 'trang_thai', length: 30, default: 'Active' })
  status: string;

  @OneToOne(() => Account, (acc) => acc.staff)
  @JoinColumn({ name: 'id_tai_khoan' })
  account?: Account;

  @OneToMany(() => Appointment, (appt) => appt.doctor)
  appointments?: Appointment[];

  @OneToMany(() => MedicalRecord, (rec) => rec.doctor)
  medicalRecords?: MedicalRecord[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
