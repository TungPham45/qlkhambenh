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
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'don_thuoc_id', type: 'bigint' })
  prescriptionId: number;

  @Column({ name: 'thuoc_id', type: 'bigint' })
  drugId: number;

  @Column({ name: 'so_luong', type: 'int' })
  quantity: number;

  @Column({ name: 'lieu_dung', length: 255 })
  dosage: string;

  @Column({
    name: 'don_gia_tai_thoi_diem_ke',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  unitPriceAtPrescription: number;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'don_thuoc_id' })
  prescription?: Prescription;

  @ManyToOne(() => Drug, (d) => d.prescriptionItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'thuoc_id' })
  drug?: Drug;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}
