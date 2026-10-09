import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Staff } from '@app/database';

@Entity('lich_lam_viec')
export class WorkSchedule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'id_lich_lam_viec' })
  id: number;

  @Column({ name: 'id_bac_si', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_lam_viec', type: 'date' })
  workDate: string;

  @Column({ name: 'gio_bat_dau', type: 'time' })
  startTime: string;

  @Column({ name: 'gio_ket_thuc', type: 'time' })
  endTime: string;

  @Column({ name: 'thoi_luong_moi_ca', type: 'integer', default: 30 })
  slotMinutes: number;

  @Column({ name: 'trang_thai', length: 30, default: 'Active' })
  status: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_bac_si' })
  doctor?: Staff;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}
