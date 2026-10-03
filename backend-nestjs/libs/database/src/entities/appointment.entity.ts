import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AppointmentStatus } from '@app/common';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('lich_hen')
@Index(['doctorId', 'appointmentDate', 'appointmentTime'])
export class Appointment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'benh_nhan_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'bac_si_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_hen', type: 'date' })
  appointmentDate: string;

  @Column({ name: 'gio_hen', type: 'time' })
  appointmentTime: string;

  @Column({
    name: 'trang_thai',
    type: 'varchar',
    length: 30,
    default: AppointmentStatus.CHO_KHAM,
  })
  status: AppointmentStatus;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'ly_do_kham', type: 'text', nullable: true })
  reason: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.appointments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'bac_si_id' })
  doctor?: Staff;

  @OneToOne(() => MedicalRecord, (rec) => rec.appointment)
  medicalRecord?: MedicalRecord;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
