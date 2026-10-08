import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PrescriptionItem } from './prescription-item.entity';

@Entity('thuoc')
export class Drug {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_thuoc' })
  id: number;

  @Column({ name: 'ten_thuoc', length: 255 })
  drugName: string;

  @Column({ name: 'don_vi', length: 50, nullable: true })
  unit: string;

  @Column({ name: 'don_gia', type: 'numeric', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ name: 'so_luong_ton', type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ name: 'han_su_dung', type: 'date', nullable: true })
  expiryDate: string;

  @Column({ name: 'dang_hoat_dong', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => PrescriptionItem, (item) => item.drug)
  prescriptionItems?: PrescriptionItem[];

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
