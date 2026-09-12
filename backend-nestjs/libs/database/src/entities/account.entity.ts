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

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 30,
    default: UserRole.NGUOI_DUNG,
  })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 20,
    default: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @Column({ name: 'staff_id', nullable: true, type: 'bigint' })
  staffId: number;

  @Column({ name: 'patient_id', nullable: true, type: 'bigint' })
  patientId: number;

  @OneToOne(() => Staff, (staff) => staff.account, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff?: Staff;

  @OneToOne(() => Patient, (patient) => patient.account, { nullable: true })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
