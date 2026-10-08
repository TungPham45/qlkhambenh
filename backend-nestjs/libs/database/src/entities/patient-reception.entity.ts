import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';

@Entity('tiep_nhan_benh_nhan')
export class PatientReception {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'id_tiep_nhan_benh_nhan',
  })
  id: number;

  @Column({ name: 'id_lich_hen', type: 'bigint', unique: true })
  appointmentId: number;

  @Column({ name: 'can_nang', type: 'numeric', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ name: 'chieu_cao', type: 'numeric', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ name: 'nhiet_do', type: 'numeric', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ name: 'huyet_ap_tam_thu', type: 'integer', nullable: true })
  systolicBloodPressure: number;

  @Column({ name: 'huyet_ap_tam_truong', type: 'integer', nullable: true })
  diastolicBloodPressure: number;

  @Column({ name: 'nhip_tim', type: 'integer', nullable: true })
  heartRate: number;

  @Column({ name: 'spo2', type: 'numeric', precision: 5, scale: 2, nullable: true })
  spo2: number;

  @Column({ name: 'trieu_chung_ban_dau', type: 'text', nullable: true })
  initialSymptoms: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'thoi_gian_ghi_nhan', type: 'timestamptz' })
  recordedAt: Date;

  @OneToOne(() => Appointment, (appointment) => appointment.reception, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_lich_hen' })
  appointment?: Appointment;
}
