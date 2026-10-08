import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('chuyen_khoa')
export class Specialty {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_chuyen_khoa' })
  id: number;

  @Column({ name: 'ten_chuyen_khoa', length: 150, unique: true })
  name: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'trang_thai', length: 30, default: 'Active' })
  status: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
