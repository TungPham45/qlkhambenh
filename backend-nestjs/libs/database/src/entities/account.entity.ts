import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole, AccountStatus } from '@app/common';
import { Staff } from './staff.entity';
import { Patient } from './patient.entity';
import { Manager } from './clinic-model.entity';

@Entity('tai_khoan')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ten_dang_nhap', unique: true, length: 50 })
  username: string;

  @Column({ name: 'mat_khau_ma_hoa' })
  passwordHash: string;

  @Column({
    name: 'vai_tro',
    type: 'varchar',
    length: 30,
    default: UserRole.NGUOI_DUNG,
  })
  role: UserRole;

  @Column({
    name: 'trang_thai',
    type: 'varchar',
    length: 20,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ name: 'bac_si_id', nullable: true, type: 'bigint' })
  staffId: number;

  @Column({ name: 'benh_nhan_id', nullable: true, type: 'bigint' })
  patientId: number;

  @Column({ name: 'quan_ly_id', nullable: true, type: 'bigint' })
  managerId: number;

  @OneToOne(() => Staff, (staff) => staff.account, { nullable: true })
  @JoinColumn({ name: 'bac_si_id' })
  staff?: Staff;

  @OneToOne(() => Patient, (patient) => patient.account, { nullable: true })
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;

  @OneToOne(() => Manager, { nullable: true })
  @JoinColumn({ name: 'quan_ly_id' })
  manager?: Manager;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
