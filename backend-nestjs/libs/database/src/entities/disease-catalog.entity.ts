import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DiseaseStatus } from '@app/common';

@Entity('danh_muc_ten_benh')
export class DiseaseCatalog {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'id_danh_muc_ten_benh',
  })
  id: number;

  @Column({ name: 'ma_benh', type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ name: 'ten_benh', type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'nhom_benh', type: 'varchar', length: 100, nullable: true })
  group: string | null;

  @Column({
    name: 'trang_thai',
    type: 'varchar',
    length: 30,
    default: DiseaseStatus.ACTIVE,
  })
  status: DiseaseStatus;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
