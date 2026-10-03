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
import { DoctorSpecialty } from './clinic-model.entity';

@Entity('bac_si')
export class Staff {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'ho_ten', length: 150 })
  fullName: string;

  @Column({ name: 'ngay_sinh', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ name: 'gioi_tinh', type: 'varchar', length: 10, nullable: true })
  gender: Gender;

  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
  phone: string;

  specialty?: string;

  username?: string;

  @Column({ length: 150, nullable: true, unique: true })
  email: string;

  @Column({ name: 'bang_cap', length: 255, nullable: true })
  degree: string;

  @Column({ name: 'so_chung_chi_hanh_nghe', length: 100, nullable: true, unique: true })
  practiceCertificate: string;

  @Column({ name: 'trang_thai', length: 20, default: 'Active' })
  status: string;

  @OneToOne(() => Account, (acc) => acc.staff)
  account?: Account;

  @OneToMany(() => Appointment, (appt) => appt.doctor)
  appointments?: Appointment[];

  @OneToMany(() => MedicalRecord, (rec) => rec.doctor)
  medicalRecords?: MedicalRecord[];

  @OneToMany(() => DoctorSpecialty, (assignment) => assignment.doctor)
  doctorSpecialties?: DoctorSpecialty[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
