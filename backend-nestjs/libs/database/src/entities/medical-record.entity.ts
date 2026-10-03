import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { Prescription } from './prescription.entity';
import { Invoice } from './invoice.entity';

@Entity('phieu_kham')
export class MedicalRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'lich_hen_id', type: 'bigint', unique: true })
  appointmentId: number;

  @Column({ name: 'benh_nhan_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'bac_si_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_kham', type: 'date', default: () => 'CURRENT_DATE' })
  examinationDate: string;

  @Column({ name: 'trieu_chung', type: 'text', nullable: true })
  symptoms: string;

  @Column({ name: 'ket_qua_kham', type: 'text', nullable: true })
  diagnosis: string;

  @Column({ name: 'ket_luan', type: 'text', nullable: true })
  conclusion: string;

  @Column({
    name: 'chi_phi_kham',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 150000.0,
  })
  examinationFee: number;

  @OneToOne(() => Appointment, (appt) => appt.medicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lich_hen_id' })
  appointment?: Appointment;

  @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.medicalRecords)
  @JoinColumn({ name: 'bac_si_id' })
  doctor?: Staff;

  @OneToOne(() => Prescription, (p) => p.medicalRecord)
  prescription?: Prescription;

  @OneToOne(() => Invoice, (inv) => inv.medicalRecord)
  invoice?: Invoice;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
