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
import { PatientReception } from './patient-reception.entity';

@Entity('lich_hen')
@Index(['doctorId', 'appointmentDate', 'appointmentTime'])
export class Appointment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_lich_hen' })
  id: number;

  @Column({ name: 'id_benh_nhan', type: 'bigint' })
  patientId: number;

  @Column({ name: 'id_bac_si', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_hen', type: 'date' })
  appointmentDate: string;

  @Column({ name: 'gio_hen', type: 'time' })
  appointmentTime: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'trang_thai',
    default: AppointmentStatus.CHO_KHAM,
  })
  status: AppointmentStatus;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'thoi_gian_check_in', type: 'timestamptz', nullable: true })
  checkInAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_benh_nhan' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.appointments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_bac_si' })
  doctor?: Staff;

  @OneToOne(() => MedicalRecord, (rec) => rec.appointment)
  medicalRecord?: MedicalRecord;

  @OneToOne(() => PatientReception, (reception) => reception.appointment)
  reception?: PatientReception;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
