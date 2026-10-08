import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Invoice, MedicalRecord, Prescription } from '@app/database';
import {
  CreateInvoiceDto,
  UpdateInvoiceStatusDto,
  BillingStatus,
  PaymentMethod,
  UserRole,
  REDIS_SERVICES,
  EVENTS,
} from '@app/common';

@Injectable()
export class BillingServiceService {
  private readonly logger = new Logger(BillingServiceService.name);

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(MedicalRecord)
    private readonly recordRepo: Repository<MedicalRecord>,
    @InjectRepository(Prescription)
    private readonly presRepo: Repository<Prescription>,
    @Inject(REDIS_SERVICES.PHARMACY_SERVICE)
    private readonly pharmacyClient: ClientProxy,
    @Inject(REDIS_SERVICES.ANALYTICS_SERVICE)
    private readonly analyticsClient: ClientProxy,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 100);

    const qb = this.invoiceRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.patient', 'patient')
      .leftJoinAndSelect('inv.medicalRecord', 'record');

    if (user?.role === UserRole.NGUOI_DUNG && user?.patientId) {
      qb.andWhere('inv.patientId = :patientId', { patientId: user.patientId });
    } else if (query?.MaBN) {
      qb.andWhere('inv.patientId = :patientId', { patientId: query.MaBN });
    }

    if (query?.status) {
      qb.andWhere('inv.paymentStatus = :status', { status: query.status });
    }

    qb.orderBy('inv.createdDate', 'DESC')
      .addOrderBy('inv.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map(this.formatInvoice),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string) {
    const inv = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['patient', 'medicalRecord'],
    });
    if (!inv) throw new NotFoundException('Không tìm thấy hóa đơn');
    return this.formatInvoice(inv);
  }

  async create(dto: CreateInvoiceDto) {
    // Determine invoice id
    const invoiceId =
      dto.invoiceId?.trim() || `HD${String(dto.medicalRecordId).padStart(4, '0')}`;

    const existing = await this.invoiceRepo.findOne({ where: { id: invoiceId } });
    if (existing) {
      throw new BadRequestException(`Hóa đơn ${invoiceId} đã tồn tại`);
    }

    const record = await this.recordRepo.findOne({
      where: { id: dto.medicalRecordId },
      relations: ['prescription', 'prescription.items'],
    });

    const examFee = dto.examinationFee || Number(record?.examinationFee || 150000.0);

    let drugFee = dto.drugFee || 0;
    if (!dto.drugFee && record?.prescription?.items) {
      drugFee = record.prescription.items.reduce(
        (sum, it) => sum + Number(it.unitPriceAtPrescription || 0) * it.quantity,
        0,
      );
    }

    const totalAmount = dto.totalAmount || examFee + drugFee;

    const invoice = this.invoiceRepo.create({
      id: invoiceId,
      medicalRecordId: dto.medicalRecordId,
      patientId: dto.patientId || record?.patientId,
      createdDate: dto.createdDate || new Date().toISOString().slice(0, 10),
      examinationFee: examFee,
      drugFee,
      totalAmount,
      paymentMethod: dto.paymentMethod || PaymentMethod.TIEN_MAT,
      paymentStatus: dto.paymentStatus || BillingStatus.CHUA_THANH_TOAN,
      paidAt: dto.paymentStatus === BillingStatus.DA_THANH_TOAN ? new Date() : null,
    });

    const saved = await this.invoiceRepo.save(invoice);
    this.logger.log(`Created Invoice #${saved.id} for Record #${saved.medicalRecordId}`);

    this.analyticsClient.emit(EVENTS.BILLING_INVOICE_CREATED, {
      invoiceId: saved.id,
      recordId: Number(saved.medicalRecordId),
      patientId: Number(saved.patientId),
      totalAmount: Number(saved.totalAmount),
      paymentStatus: saved.paymentStatus,
    });

    // If created directly as Paid, emit event
    if (saved.paymentStatus === BillingStatus.DA_THANH_TOAN) {
      this.emitPaidEvents(saved);
    }

    return this.formatInvoice(saved);
  }

  async updateStatus(id: string, dto: UpdateInvoiceStatusDto, user: any) {
    const inv = await this.invoiceRepo.findOne({ where: { id } });
    if (!inv) throw new NotFoundException('Không tìm thấy hóa đơn');

    const previousStatus = inv.paymentStatus;
    inv.paymentStatus = dto.paymentStatus;
    if (dto.paymentMethod) inv.paymentMethod = dto.paymentMethod;

    if (
      dto.paymentStatus === BillingStatus.DA_THANH_TOAN &&
      previousStatus !== BillingStatus.DA_THANH_TOAN
    ) {
      inv.paidAt = new Date();
      await this.invoiceRepo.save(inv);

      // Emit event across Redis pub/sub
      this.emitPaidEvents(inv);
    } else {
      await this.invoiceRepo.save(inv);
    }

    return this.formatInvoice(inv);
  }

  private emitPaidEvents(inv: Invoice) {
    this.logger.log(`Emitting Event [billing.invoice_paid] for Invoice ${inv.id}`);
    
    // Notify pharmacy service to deduct stock
    this.pharmacyClient.emit(EVENTS.BILLING_INVOICE_PAID, {
      invoiceId: inv.id,
      recordId: Number(inv.medicalRecordId),
      patientId: Number(inv.patientId),
      totalAmount: Number(inv.totalAmount),
    });

    // Notify analytics service to refresh
    this.analyticsClient.emit(EVENTS.BILLING_INVOICE_PAID, {
      invoiceId: inv.id,
      amount: Number(inv.totalAmount),
      date: inv.createdDate,
    });
  }

  private formatInvoice(i: Invoice) {
    return {
      id: i.id,
      MaHoaDon: i.id,
      MaPhieu: Number(i.medicalRecordId),
      medicalRecordId: Number(i.medicalRecordId),
      MaBN: Number(i.patientId),
      patientId: Number(i.patientId),
      NgayLap: i.createdDate,
      createdDate: i.createdDate,
      TienKham: Number(i.examinationFee),
      examinationFee: Number(i.examinationFee),
      TienThuoc: Number(i.drugFee),
      drugFee: Number(i.drugFee),
      TongTien: Number(i.totalAmount),
      totalAmount: Number(i.totalAmount),
      PhuongThucTT: i.paymentMethod,
      paymentMethod: i.paymentMethod,
      TrangThai: i.paymentStatus,
      paymentStatus: i.paymentStatus,
      paidAt: i.paidAt,
      patient: i.patient,
      medicalRecord: i.medicalRecord,
      createdAt: i.createdAt,
    };
  }
}
