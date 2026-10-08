import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { Drug } from './drug.entity';

@Entity('chi_tiet_don_thuoc')
@Unique(['prescriptionId', 'drugId'])
export class PrescriptionItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_chi_tiet_don_thuoc' })
  id: number;

  @Column({ name: 'id_don_thuoc', type: 'bigint' })
  prescriptionId: number;

  @Column({ name: 'id_thuoc', type: 'bigint' })
  drugId: number;

  @Column({ name: 'so_luong', type: 'int' })
  quantity: number;

  @Column({ name: 'lieu_dung', length: 255, nullable: true })
  dosage: string;

  @Column({ name: 'tan_suat', length: 100, nullable: true })
  frequency: string | null;

  @Column({ name: 'so_ngay_dung', type: 'int', nullable: true })
  durationDays: number | null;

  @Column({ name: 'duong_dung', length: 100, nullable: true })
  route: string | null;

  @Column({ name: 'huong_dan', type: 'text', nullable: true })
  instructions: string | null;

  @Column({
    name: 'don_gia_tai_thoi_diem_ke',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  unitPriceAtPrescription: number;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_don_thuoc' })
  prescription?: Prescription;

  @ManyToOne(() => Drug, (d) => d.prescriptionItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_thuoc' })
  drug?: Drug;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}
