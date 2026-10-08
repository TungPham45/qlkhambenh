import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Appointment } from './appointment.entity';

@Entity('thong_bao')
export class Notification {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'id_thong_bao',
  })
  id: number;

  @Column({ name: 'id_tai_khoan', type: 'uuid', nullable: true })
  accountId: string | null;

  @Column({ name: 'id_lich_hen', type: 'bigint', nullable: true })
  appointmentId: number | null;

  @Column({ name: 'loai', type: 'varchar', length: 50 })
  type: string;

  @Column({ name: 'kenh', type: 'varchar', length: 30, nullable: true })
  channel: string | null;

  @Column({ name: 'tieu_de', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'noi_dung', type: 'text' })
  content: string;

  @Column({ name: 'trang_thai', type: 'varchar', length: 30 })
  status: string;

  @Column({ name: 'thoi_gian_du_kien_gui', type: 'timestamptz', nullable: true })
  scheduledAt: Date | null;

  @Column({ name: 'thoi_gian_gui', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'thoi_gian_doc', type: 'timestamptz', nullable: true })
  readAt: Date | null;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Account, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_tai_khoan' })
  account?: Account;

  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_lich_hen' })
  appointment?: Appointment;
}
