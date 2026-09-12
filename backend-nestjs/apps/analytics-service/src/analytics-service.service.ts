import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  Patient,
  Appointment,
  Invoice,
  Drug,
  Prescription,
  PrescriptionItem,
  Staff,
  ComputedMetric,
} from '@app/database';
import { BillingStatus, RedisLockService } from '@app/common';

@Injectable()
export class AnalyticsServiceService {
  private readonly logger = new Logger(AnalyticsServiceService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly apptRepo: Repository<Appointment>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Drug)
    private readonly drugRepo: Repository<Drug>,
    @InjectRepository(Prescription)
    private readonly presRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private readonly itemRepo: Repository<PrescriptionItem>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(ComputedMetric)
    private readonly metricRepo: Repository<ComputedMetric>,
    private readonly redisLock: RedisLockService,
  ) {}

  async dashboard(filters: any) {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    const fromDate = filters?.from;
    const toDate = filters?.to;

    // Check Redis cache if no custom date filter
    const cacheKey = `analytics:dashboard:${filters?.filter || 'default'}:${fromDate || ''}:${toDate || ''}`;
    const redis = this.redisLock.getClient();
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // ignore redis read error
    }

    // 1. Summary KPIs
    const totalPatients = await this.patientRepo.count();

    const appointmentsToday = await this.apptRepo.count({
      where: { appointmentDate: today },
    });

    const revenueTodayRows = await this.invoiceRepo.find({
      where: { createdDate: today, paymentStatus: BillingStatus.DA_THANH_TOAN },
    });
    const revenueToday = revenueTodayRows.reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

    const paidInvoices = await this.invoiceRepo.find({
      where: { paymentStatus: BillingStatus.DA_THANH_TOAN },
      order: { createdDate: 'ASC' },
    });

    const monthlyRevenue = paidInvoices
      .filter((i) => (i.createdDate || '').startsWith(month))
      .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

    const activeDoctors = await this.staffRepo.count({
      where: { status: 'Active' },
    });

    // 2. Revenue Trend
    const revenueByDate: Record<string, number> = {};
    for (const inv of paidInvoices) {
      const d = inv.createdDate || today;
      if (fromDate && d < fromDate) continue;
      if (toDate && d > toDate) continue;
      revenueByDate[d] = (revenueByDate[d] || 0) + Number(inv.totalAmount || 0);
    }
    const revenueTrend = Object.keys(revenueByDate)
      .sort()
      .map((d) => ({ label: d, value: revenueByDate[d] }));

    // 3. Appointment Trends
    const allAppointments = await this.apptRepo.find({ order: { appointmentDate: 'ASC' } });
    const apptByDate: Record<string, number> = {};
    for (const a of allAppointments) {
      const d = a.appointmentDate || today;
      if (fromDate && d < fromDate) continue;
      if (toDate && d > toDate) continue;
      apptByDate[d] = (apptByDate[d] || 0) + 1;
    }
    const appointmentTrends = Object.keys(apptByDate)
      .sort()
      .map((d) => ({ label: d, value: apptByDate[d] }));

    // 4. Patient Growth
    const allPatients = await this.patientRepo.find({ order: { createdAt: 'ASC' } });
    const patientByDate: Record<string, number> = {};
    for (const p of allPatients) {
      const d = (p.createdAt ? p.createdAt.toISOString() : today).slice(0, 10);
      if (fromDate && d < fromDate) continue;
      if (toDate && d > toDate) continue;
      patientByDate[d] = (patientByDate[d] || 0) + 1;
    }
    const patientGrowth = Object.keys(patientByDate)
      .sort()
      .map((d) => ({ label: d, value: patientByDate[d] }));

    // 5. Top Medicines
    const allItems = await this.itemRepo.find({ relations: ['drug'] });
    const drugUsage: Record<string, { label: string; value: number }> = {};
    for (const it of allItems) {
      const name = it.drug?.drugName || `Thuốc #${it.drugId}`;
      if (!drugUsage[it.drugId]) {
        drugUsage[it.drugId] = { label: name, value: 0 };
      }
      drugUsage[it.drugId].value += Number(it.quantity || 0);
    }
    const topMedicines = Object.values(drugUsage)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const result = {
      summary: {
        total_patients: totalPatients,
        appointments_today: appointmentsToday,
        revenue_today: revenueToday,
        monthly_revenue: monthlyRevenue,
        active_doctors: activeDoctors,
      },
      widgets: {
        appointment_trends: appointmentTrends,
        patient_growth: patientGrowth,
        revenue_trend: revenueTrend,
        top_medicines: topMedicines,
      },
      generated_at: new Date().toISOString(),
    };

    // Cache in Redis for 300 seconds
    try {
      await redis.set(cacheKey, JSON.stringify(result), 'EX', 300);
    } catch (e) {
      // ignore
    }

    return result;
  }

  async invalidateCache() {
    this.logger.log('Invalidating analytics dashboard cache...');
    const redis = this.redisLock.getClient();
    try {
      const keys = await redis.keys('analytics:dashboard:*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (e) {
      this.logger.warn(`Failed to clear Redis analytics keys: ${e.message}`);
    }
  }
}
