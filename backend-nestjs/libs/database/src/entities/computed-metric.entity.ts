import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chi_so_thong_ke')
export class ComputedMetric {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'loai_chi_so', length: 50 })
  metricType: string; // 'averages', 'distributions', 'trends', 'forecast', 'anomalies', 'timeseries'

  @Column({ name: 'du_lieu_thong_ke', type: 'jsonb' })
  metricPayload: any;

  @CreateDateColumn({ name: 'thoi_gian_tinh', type: 'timestamptz' })
  calculatedAt: Date;
}
