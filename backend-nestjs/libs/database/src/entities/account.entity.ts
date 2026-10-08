import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UserRole, AccountStatus } from '@app/common';
import { Staff } from './staff.entity';
import { Patient } from './patient.entity';

@Entity('tai_khoan')
export class Account {
  @PrimaryGeneratedColumn('uuid', { name: 'id_tai_khoan' })
  id: string;

  @Column({ name: 'ten_dang_nhap', unique: true, length: 100 })
  username: string;

  @Column({ name: 'mat_khau_ma_hoa' })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'vai_tro',
    default: UserRole.NGUOI_DUNG,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'trang_thai',
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @OneToOne(() => Staff, (staff) => staff.account, { nullable: true })
  staff?: Staff;

  @OneToOne(() => Patient, (patient) => patient.account, { nullable: true })
  patient?: Patient;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
