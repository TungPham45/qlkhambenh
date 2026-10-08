import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';
import { Prescription } from './prescription.entity';
import { Invoice } from './invoice.entity';
import { Diagnosis } from './diagnosis.entity';

@Entity('phieu_kham')
export class MedicalRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_phieu_kham' })
  id: number;

  @Column({ name: 'id_lich_hen', type: 'bigint', unique: true })
  appointmentId: number;

  @Column({ name: 'id_benh_nhan', type: 'bigint' })
  patientId: number;

  @Column({ name: 'id_bac_si', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_kham', type: 'date', default: () => 'CURRENT_DATE' })
  examinationDate: string;

  @Column({ name: 'trieu_chung', type: 'text', nullable: true })
  symptoms: string;

  @Column({ name: 'ket_qua_kham', type: 'text', nullable: true })
  diagnosis: string;

  @Column({ name: 'ket_luan', type: 'text', nullable: true })
  conclusion: string;

  @Column({ name: 'huong_dieu_tri', type: 'text', nullable: true })
  treatmentDirection: string | null;

  @Column({ name: 'ghi_chu_bac_si', type: 'text', nullable: true })
  doctorNotes: string | null;

  @Column({ name: 'ngay_tai_kham', type: 'date', nullable: true })
  followUpDate: string | null;

  @Column({
    name: 'phi_kham',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 150000.0,
  })
  examinationFee: number;

  @OneToOne(() => Appointment, (appt) => appt.medicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_lich_hen' })
  appointment?: Appointment;

  @ManyToOne(() => Patient, (patient) => patient.medicalRecords)
  @JoinColumn({ name: 'id_benh_nhan' })
  patient?: Patient;

  @ManyToOne(() => Staff, (staff) => staff.medicalRecords)
  @JoinColumn({ name: 'id_bac_si' })
  doctor?: Staff;

  @OneToOne(() => Prescription, (p) => p.medicalRecord)
  prescription?: Prescription;

  @OneToOne(() => Invoice, (inv) => inv.medicalRecord)
  invoice?: Invoice;

  @OneToMany(() => Diagnosis, (diagnosis) => diagnosis.medicalRecord)
  diagnoses?: Diagnosis[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
