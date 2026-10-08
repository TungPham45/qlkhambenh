import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Drug, MedicalRecord, Prescription, PrescriptionItem } from '@app/database';
import {
  CreateDrugDto,
  UpdateDrugDto,
  CreatePrescriptionDto,
  PrescriptionStatus,
  UserRole,
  RedisLockService,
} from '@app/common';

@Injectable()
export class PharmacyServiceService {
  private readonly logger = new Logger(PharmacyServiceService.name);

  constructor(
    @InjectRepository(Drug)
    private readonly drugRepo: Repository<Drug>,
    @InjectRepository(Prescription)
    private readonly presRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private readonly itemRepo: Repository<PrescriptionItem>,
    private readonly dataSource: DataSource,
    private readonly redisLock: RedisLockService,
  ) {}

  // --- DRUG CRUD ---
  async getDrugs(query: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 200);
    const search = String(query?.search || query?.keyword || '').trim();
    const qb = this.drugRepo
      .createQueryBuilder('drug')
      .orderBy('drug.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    if (search) {
      const rawDrugId = search.replace(/^TH-/i, '');
      const exactDrugId = /^\d+$/.test(rawDrugId)
        ? String(Number(rawDrugId))
        : rawDrugId;
      qb.andWhere(
        '(drug.drugName ILIKE :search OR CAST(drug.id AS TEXT) = :exactDrugId)',
        { search: `%${search}%`, exactDrugId },
      );
    }
    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map(this.formatDrug),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getDrugById(id: number) {
    const drug = await this.drugRepo.findOne({ where: { id } });
    if (!drug) throw new NotFoundException('Không tìm thấy thuốc');
    return this.formatDrug(drug);
  }

  async createDrug(dto: CreateDrugDto) {
    const drug = this.drugRepo.create({
      drugName: dto.drugName,
      unit: dto.unit,
      unitPrice: dto.unitPrice,
      stockQuantity: dto.stockQuantity,
      expiryDate: dto.expiryDate,
      isActive: true,
    });
    const saved = await this.drugRepo.save(drug);
    return this.formatDrug(saved);
  }

  async updateDrug(id: number, dto: UpdateDrugDto) {
    const drug = await this.drugRepo.findOne({ where: { id } });
    if (!drug) throw new NotFoundException('Không tìm thấy thuốc');

    Object.assign(drug, dto);
    const saved = await this.drugRepo.save(drug);
    return this.formatDrug(saved);
  }

  async deleteDrug(id: number) {
    const drug = await this.drugRepo.findOne({ where: { id } });
    if (!drug) throw new NotFoundException('Không tìm thấy thuốc');
    await this.drugRepo.remove(drug);
    return { success: true, message: 'Đã xóa thuốc' };
  }

  // --- PRESCRIPTIONS ---
  async getPrescriptions(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 50);

    const qb = this.presRepo
      .createQueryBuilder('pres')
      .leftJoinAndSelect('pres.items', 'items')
      .leftJoinAndSelect('items.drug', 'drug')
      .leftJoinAndSelect('pres.patient', 'patient')
      .leftJoinAndSelect('pres.doctor', 'doctor');

    this.applyPrescriptionScope(qb, user);

    if (user?.role === UserRole.ADMIN && query?.MaBN) {
      qb.andWhere('pres.patientId = :patientId', { patientId: query.MaBN });
    }
    if (user?.role === UserRole.ADMIN && query?.MaBacSi) {
      qb.andWhere('pres.doctorId = :doctorId', { doctorId: query.MaBacSi });
    }

    if (query?.MaPhieu) {
      qb.andWhere('pres.medicalRecordId = :recordId', { recordId: query.MaPhieu });
    }

    qb.orderBy('pres.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      data: rows.map(this.formatPrescription),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getPrescriptionById(id: number, user: any) {
    const qb = this.presRepo
      .createQueryBuilder('pres')
      .leftJoinAndSelect('pres.items', 'items')
      .leftJoinAndSelect('items.drug', 'drug')
      .leftJoinAndSelect('pres.patient', 'patient')
      .leftJoinAndSelect('pres.doctor', 'doctor')
      .where('pres.id = :id', { id });
    this.applyPrescriptionScope(qb, user);
    const pres = await qb.getOne();
    if (!pres) throw new NotFoundException('Không tìm thấy đơn thuốc');
    return this.formatPrescription(pres);
  }

  async createPrescription(dto: CreatePrescriptionDto, user: any) {
    if (user?.role === UserRole.NGUOI_DUNG) {
      throw new BadRequestException('Bệnh nhân không thể tạo đơn thuốc');
    }

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Đơn thuốc phải chứa ít nhất một loại thuốc');
    }

    const record = await this.dataSource.getRepository(MedicalRecord).findOne({
      where: { id: dto.medicalRecordId },
    });
    if (!record) {
      throw new NotFoundException('Không tìm thấy hồ sơ bệnh án tương ứng');
    }
    if (
      user?.role === UserRole.BAC_SI &&
      Number(record.doctorId) !== Number(user.staffId)
    ) {
      throw new ForbiddenException('Bác sĩ chỉ được kê đơn cho hồ sơ mình phụ trách');
    }
    if (
      Number(dto.patientId) !== Number(record.patientId) ||
      Number(dto.doctorId) !== Number(record.doctorId)
    ) {
      throw new BadRequestException('Thông tin bệnh nhân hoặc bác sĩ không khớp hồ sơ bệnh án');
    }

    const doctorId = record.doctorId;

    return await this.dataSource.transaction(async (manager) => {
      const pres = manager.create(Prescription, {
        medicalRecordId: dto.medicalRecordId,
        patientId: record.patientId,
        doctorId,
        prescriptionDate: dto.prescriptionDate || new Date().toISOString().slice(0, 10),
        note: dto.note,
        status: PrescriptionStatus.CREATED,
      });

      const savedPres = await manager.save(Prescription, pres);

      for (const item of dto.items) {
        const drug = await manager.findOne(Drug, { where: { id: item.drugId } });
        if (!drug) {
          throw new NotFoundException(`Không tìm thấy thuốc ID #${item.drugId}`);
        }

        const presItem = manager.create(PrescriptionItem, {
          prescriptionId: savedPres.id,
          drugId: item.drugId,
          quantity: item.quantity,
          dosage: item.dosage,
          unitPriceAtPrescription: drug.unitPrice,
        });

        await manager.save(PrescriptionItem, presItem);
      }

      this.logger.log(`Created Prescription #${savedPres.id} with ${dto.items.length} items for Record #${dto.medicalRecordId}`);

      const result = await manager.findOne(Prescription, {
        where: { id: savedPres.id },
        relations: ['items', 'items.drug'],
      });

      return this.formatPrescription(result);
    });
  }

  /**
   * Atomic Stock Deduction with PostgreSQL SELECT FOR UPDATE + Redis Distributed Lock
   */
  async deductStock(prescriptionId: number): Promise<boolean> {
    this.logger.log(`Deducting stock for Prescription #${prescriptionId}...`);

    const pres = await this.presRepo.findOne({
      where: { id: prescriptionId },
      relations: ['items', 'items.drug'],
    });

    if (!pres) {
      this.logger.warn(`Prescription #${prescriptionId} not found for deduction.`);
      return false;
    }

    if (pres.status === PrescriptionStatus.DISPENSED) {
      this.logger.log(`Prescription #${prescriptionId} already dispensed. Skipping.`);
      return true;
    }

    return await this.dataSource.transaction(async (manager) => {
      for (const item of pres.items || []) {
        const lockKey = `drug:${item.drugId}:stock`;
        const lockId = await this.redisLock.acquireLock(lockKey, 3000);

        try {
          // Pessimistic write lock in PostgreSQL
          const drug = await manager.findOne(Drug, {
            where: { id: item.drugId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!drug) {
            throw new NotFoundException(`Không tìm thấy thuốc #${item.drugId}`);
          }

          if (drug.stockQuantity < item.quantity) {
            this.logger.error(`Stock insufficient for ${drug.drugName}: has ${drug.stockQuantity}, needs ${item.quantity}`);
            throw new BadRequestException(`Không đủ tồn kho cho thuốc: ${drug.drugName} (Còn ${drug.stockQuantity})`);
          }

          drug.stockQuantity -= item.quantity;
          await manager.save(Drug, drug);
          this.logger.log(`Deducted ${item.quantity} of ${drug.drugName}. Remaining: ${drug.stockQuantity}`);
        } finally {
          if (lockId) {
            await this.redisLock.releaseLock(lockKey, lockId);
          }
        }
      }

      pres.status = PrescriptionStatus.DISPENSED;
      await manager.save(Prescription, pres);
      return true;
    });
  }

  async deductStockByRecordId(medicalRecordId: number): Promise<boolean> {
    const pres = await this.presRepo.findOne({ where: { medicalRecordId } });
    if (pres) {
      return await this.deductStock(pres.id);
    }
    return false;
  }

  private applyPrescriptionScope(qb: any, user: any) {
    if (user?.role === UserRole.ADMIN) return;

    if (user?.role === UserRole.BAC_SI) {
      const doctorId = Number(user.staffId ?? user.MaNV);
      if (!Number.isInteger(doctorId) || doctorId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bác sĩ');
      }
      qb.andWhere('pres.doctorId = :scopeDoctorId', { scopeDoctorId: doctorId });
      return;
    }

    if (user?.role === UserRole.NGUOI_DUNG) {
      const patientId = Number(user.patientId ?? user.MaBN);
      if (!Number.isInteger(patientId) || patientId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bệnh nhân');
      }
      qb.andWhere('pres.patientId = :scopePatientId', { scopePatientId: patientId });
      return;
    }

    throw new ForbiddenException('Bạn không có quyền xem đơn thuốc');
  }

  private formatDrug(d: Drug) {
    return {
      id: Number(d.id),
      MaThuoc: Number(d.id),
      TenThuoc: d.drugName,
      drugName: d.drugName,
      DonViTinh: d.unit,
      unit: d.unit,
      DonGia: Number(d.unitPrice),
      unitPrice: Number(d.unitPrice),
      SoLuongTon: d.stockQuantity,
      stockQuantity: d.stockQuantity,
      NgayHetHan: d.expiryDate,
      expiryDate: d.expiryDate,
      isActive: d.isActive,
      createdAt: d.createdAt,
    };
  }

  private formatPrescription(p: Prescription) {
    return {
      id: Number(p.id),
      MaDon: Number(p.id),
      MaPhieu: Number(p.medicalRecordId),
      medicalRecordId: Number(p.medicalRecordId),
      MaBN: Number(p.patientId),
      patientId: Number(p.patientId),
      MaBacSi: Number(p.doctorId),
      doctorId: Number(p.doctorId),
      NgayKeDon: p.prescriptionDate,
      prescriptionDate: p.prescriptionDate,
      GhiChu: p.note,
      note: p.note,
      TrangThai: p.status,
      status: p.status,
      ChiTiet: (p.items || []).map((it) => ({
        id: Number(it.id),
        MaThuoc: Number(it.drugId),
        drugId: Number(it.drugId),
        TenThuoc: it.drug?.drugName || `Thuốc #${it.drugId}`,
        DonViTinh: it.drug?.unit || '',
        DonGia: Number(it.unitPriceAtPrescription || it.drug?.unitPrice || 0),
        SoLuong: it.quantity,
        quantity: it.quantity,
        LieuDung: it.dosage,
        dosage: it.dosage,
      })),
      createdAt: p.createdAt,
    };
  }
}
