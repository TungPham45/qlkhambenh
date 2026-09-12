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

@Entity('prescription_items')
@Unique(['prescriptionId', 'drugId'])
export class PrescriptionItem {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'prescription_id', type: 'bigint' })
  prescriptionId: number;

  @Column({ name: 'drug_id', type: 'bigint' })
  drugId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ length: 255 })
  dosage: string;

  @Column({
    name: 'unit_price_at_prescription',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  unitPriceAtPrescription: number;

  @ManyToOne(() => Prescription, (p) => p.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prescription_id' })
  prescription?: Prescription;

  @ManyToOne(() => Drug, (d) => d.prescriptionItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'drug_id' })
  drug?: Drug;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
