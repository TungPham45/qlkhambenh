import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('computed_metrics')
export class ComputedMetric {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'metric_type', length: 50 })
  metricType: string; // 'averages', 'distributions', 'trends', 'forecast', 'anomalies', 'timeseries'

  @Column({ name: 'metric_payload', type: 'jsonb' })
  metricPayload: any;

  @CreateDateColumn({ name: 'calculated_at', type: 'timestamptz' })
  calculatedAt: Date;
}
