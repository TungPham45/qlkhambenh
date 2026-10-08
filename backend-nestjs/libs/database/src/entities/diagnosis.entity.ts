import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiseaseCatalog } from './disease-catalog.entity';
import { MedicalRecord } from './medical-record.entity';

@Entity('chan_doan')
export class Diagnosis {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'id_chan_doan',
  })
  id: number;

  @Column({ name: 'id_phieu_kham', type: 'bigint' })
  medicalRecordId: number;

  @Column({ name: 'id_danh_muc_ten_benh', type: 'bigint' })
  diseaseId: number;

  @Column({ name: 'la_chan_doan_chinh', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  note: string | null;

  @ManyToOne(() => MedicalRecord, (record) => record.diagnoses, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_phieu_kham' })
  medicalRecord?: MedicalRecord;

  @ManyToOne(() => DiseaseCatalog, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_danh_muc_ten_benh' })
  disease?: DiseaseCatalog;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}
