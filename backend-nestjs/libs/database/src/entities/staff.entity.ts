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

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'full_name', length: 150 })
  fullName: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: Gender;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  specialty: string;

  @Column({ length: 50, nullable: true, unique: true })
  username: string;

  @Column({ length: 20, default: 'Active' })
  status: string;

  @OneToOne(() => Account, (acc) => acc.staff)
  account?: Account;

  @OneToMany(() => Appointment, (appt) => appt.doctor)
  appointments?: Appointment[];

  @OneToMany(() => MedicalRecord, (rec) => rec.doctor)
  medicalRecords?: MedicalRecord[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
