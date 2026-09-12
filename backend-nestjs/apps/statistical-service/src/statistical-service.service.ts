import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, Invoice, Patient, ComputedMetric } from '@app/database';
import { BillingStatus, RedisLockService } from '@app/common';

@Injectable()
export class StatisticalServiceService {
  private readonly logger = new Logger(StatisticalServiceService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(ComputedMetric)
    private readonly metricRepo: Repository<ComputedMetric>,
    private readonly redisLock: RedisLockService,
  ) {}

  async averages(filters: any) {
    const dailyRev = await this.getDailyRevenue(filters);
    const dailyAppt = await this.getDailyAppointments(filters);

    const revValues = dailyRev.map((r) => r.value);
    const apptValues = dailyAppt.map((r) => r.value);

    return {
      revenue_average: this.calculateAverage(revValues),
      appointments_average: this.calculateAverage(apptValues),
      revenue_moving_average: this.calculateMovingAverage(revValues, 7),
      appointments_moving_average: this.calculateMovingAverage(apptValues, 7),
    };
  }

  async distributions(filters: any) {
    const from = filters?.from;
    const to = filters?.to;

    const allAppts = await this.apptRepo.find();
    const filtered = allAppts.filter((a) => {
      const d = a.appointmentDate || '';
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    const hours: Record<string, number> = {};
    const statuses: Record<string, number> = {};

    for (const a of filtered) {
      const time = (a.appointmentTime || '08:00').trim();
      const hour = time.slice(0, 2);
      hours[hour] = (hours[hour] || 0) + 1;

      const st = a.status || 'Cho kham';
      statuses[st] = (statuses[st] || 0) + 1;
    }

    let peakHour = '08';
    let maxCount = -1;
    const hourPairs = Object.keys(hours)
      .sort()
      .map((h) => {
        if (hours[h] > maxCount) {
          maxCount = hours[h];
          peakHour = h;
        }
        return { label: `${h}:00`, value: hours[h] };
      });

    const statusPairs = Object.keys(statuses).map((s) => ({
      label: s,
      value: statuses[s],
    }));

    return {
      appointment_hours: hourPairs,
      peak_hour: peakHour,
      status_distribution: statusPairs,
    };
  }

  async trends(filters: any) {
    const dailyRev = await this.getDailyRevenue(filters);
    const dailyAppt = await this.getDailyAppointments(filters);

    const monthlyRevMap: Record<string, number> = {};
    for (const r of dailyRev) {
      const m = r.label.slice(0, 7);
      monthlyRevMap[m] = (monthlyRevMap[m] || 0) + r.value;
    }

    const monthlyApptMap: Record<string, number> = {};
    for (const a of dailyAppt) {
      const m = a.label.slice(0, 7);
      monthlyApptMap[m] = (monthlyApptMap[m] || 0) + a.value;
    }

    const revValues = dailyRev.map((r) => r.value);
    const apptValues = dailyAppt.map((r) => r.value);

    return {
      monthly_revenue: Object.keys(monthlyRevMap).sort().map((m) => ({ label: m, value: monthlyRevMap[m] })),
      monthly_appointments: Object.keys(monthlyApptMap).sort().map((m) => ({ label: m, value: monthlyApptMap[m] })),
      revenue_growth_rate: this.calculateGrowthRate(revValues),
      appointment_growth_rate: this.calculateGrowthRate(apptValues),
    };
  }

  async forecast(filters: any) {
    const dailyRev = await this.getDailyRevenue(filters);
    const dailyAppt = await this.getDailyAppointments(filters);

    return {
      revenue_prediction: this.linearRegressionForecast(dailyRev, 7),
      appointment_forecast: this.linearRegressionForecast(dailyAppt, 7),
      method: 'Simple Linear Regression (y = ax + b) over daily time series aggregates',
    };
  }

  async anomalies(filters: any) {
    const dailyRev = await this.getDailyRevenue(filters);
    const values = dailyRev.map((r) => r.value);

    const avg = this.calculateAverage(values);
    const stdDev = this.calculateStandardDeviation(values, avg);

    const candidates = dailyRev.filter((r) => {
      if (stdDev === 0) return false;
      const zScore = Math.abs(r.value - avg) / stdDev;
      return zScore >= 2.0;
    });

    return {
      baseline: {
        average: avg,
        standard_deviation: stdDev,
      },
      candidates,
    };
  }

  async timeseries(filters: any) {
    return {
      revenue: await this.getDailyRevenue(filters),
      appointments: await this.getDailyAppointments(filters),
      patients: await this.getDailyPatients(filters),
    };
  }

  // --- HELPER AGGREGATIONS ---
  private async getDailyRevenue(filters: any): Promise<{ label: string; value: number }[]> {
    const from = filters?.from;
    const to = filters?.to;

    const invoices = await this.invoiceRepo.find({
      where: { paymentStatus: BillingStatus.DA_THANH_TOAN },
      order: { createdDate: 'ASC' },
    });

    const series: Record<string, number> = {};
    for (const inv of invoices) {
      const d = inv.createdDate || '';
      if (from && d < from) continue;
      if (to && d > to) continue;
      series[d] = (series[d] || 0) + Number(inv.totalAmount || 0);
    }

    return Object.keys(series).sort().map((d) => ({ label: d, value: series[d] }));
  }

  private async getDailyAppointments(filters: any): Promise<{ label: string; value: number }[]> {
    const from = filters?.from;
    const to = filters?.to;

    const appts = await this.apptRepo.find({ order: { appointmentDate: 'ASC' } });
    const series: Record<string, number> = {};

    for (const a of appts) {
      const d = a.appointmentDate || '';
      if (from && d < from) continue;
      if (to && d > to) continue;
      series[d] = (series[d] || 0) + 1;
    }

    return Object.keys(series).sort().map((d) => ({ label: d, value: series[d] }));
  }

  private async getDailyPatients(filters: any): Promise<{ label: string; value: number }[]> {
    const from = filters?.from;
    const to = filters?.to;

    const patients = await this.patientRepo.find({ order: { createdAt: 'ASC' } });
    const series: Record<string, number> = {};

    for (const p of patients) {
      const d = (p.createdAt ? p.createdAt.toISOString() : '').slice(0, 10);
      if (from && d < from) continue;
      if (to && d > to) continue;
      series[d] = (series[d] || 0) + 1;
    }

    return Object.keys(series).sort().map((d) => ({ label: d, value: series[d] }));
  }

  // --- STATISTICAL MATH UTILITIES ---
  private calculateAverage(values: number[]): number {
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  private calculateStandardDeviation(values: number[], mean: number): number {
    if (values.length <= 1) return 0;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateMovingAverage(values: number[], window = 7): number[] {
    const result: number[] = [];
    for (let i = 0; i < values.length; i++) {
      const slice = values.slice(Math.max(0, i - window + 1), i + 1);
      result.push(Number((slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(2)));
    }
    return result;
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2 || values[0] === 0) return 0;
    const start = values[0];
    const end = values[values.length - 1];
    return Number((((end - start) / start) * 100).toFixed(2));
  }

  private linearRegressionForecast(
    series: { label: string; value: number }[],
    days = 7,
  ): { label: string; value: number }[] {
    const values = series.map((s) => s.value);
    const n = values.length;
    if (n === 0) return [];

    let xSum = 0;
    let ySum = 0;
    let xySum = 0;
    let x2Sum = 0;

    for (let i = 1; i <= n; i++) {
      const y = values[i - 1];
      xSum += i;
      ySum += y;
      xySum += i * y;
      x2Sum += i * i;
    }

    const denominator = n * x2Sum - xSum * xSum;
    const slope = denominator !== 0 ? (n * xySum - xSum * ySum) / denominator : 0;
    const intercept = (ySum - slope * xSum) / n;

    const lastDate = series.length > 0 ? series[series.length - 1].label : new Date().toISOString().slice(0, 10);
    const lastDateObj = new Date(lastDate);

    const forecast: { label: string; value: number }[] = [];
    for (let i = 1; i <= days; i++) {
      const futureDate = new Date(lastDateObj);
      futureDate.setDate(futureDate.getDate() + i);
      const label = futureDate.toISOString().slice(0, 10);
      const predictedValue = Math.max(0, Number((intercept + slope * (n + i)).toFixed(2)));
      forecast.push({ label, value: predictedValue });
    }

    return forecast;
  }
}
