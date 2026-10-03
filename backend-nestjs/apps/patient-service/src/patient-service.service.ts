import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { MedicalHistory, Patient } from '@app/database';
import { CreatePatientDto, UpdatePatientDto } from '@app/common';

@Injectable()
export class PatientServiceService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepo: Repository<MedicalHistory>,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 20);
    const search = String(query?.search || query?.keyword || '').trim();
    const gender = query?.gender && query.gender !== 'all' ? query.gender : undefined;
    const status = query?.status && query.status !== 'all' ? query.status : undefined;

    // Scope for NguoiDung
    if (user?.role === 'NguoiDung' && user?.patientId) {
      const patient = await this.patientRepo.findOne({
        where: { id: user.patientId },
        relations: ['medicalHistories'],
      });
      return {
        data: patient ? [this.formatPatient(patient)] : [],
        pagination: { total: patient ? 1 : 0, page: 1, limit, total_pages: 1 },
      };
    }

    const filters = {
      ...(gender ? { gender } : {}),
      ...(status ? { status } : {}),
    };
    const patientCode = Number(search.replace(/^BN-?/i, ''));
    const where = search
      ? [
          { ...filters, fullName: ILike(`%${search}%`) },
          { ...filters, phone: ILike(`%${search}%`) },
          { ...filters, address: ILike(`%${search}%`) },
          ...(Number.isInteger(patientCode) && patientCode > 0
            ? [{ ...filters, id: patientCode }]
            : []),
        ]
      : filters;

    const [rows, total] = await this.patientRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
      relations: ['medicalHistories'],
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const [totalPatients, activePatients, createdToday] = await Promise.all([
      this.patientRepo.count(),
      this.patientRepo.count({ where: { status: 'Active' } }),
      this.patientRepo.count({ where: { createdAt: Between(startOfToday, endOfToday) } }),
    ]);

    return {
      data: rows.map(this.formatPatient),
      summary: {
        totalPatients,
        activePatients,
        createdToday,
      },
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['medicalHistories'],
    });
    if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');
    return this.formatPatient(patient);
  }

  async create(dto: CreatePatientDto) {
    const patient = this.patientRepo.create({
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      address: dto.address,
      email: dto.email,
      healthInsuranceNumber: dto.healthInsuranceNumber,
      status: dto.status || 'Active',
      username: dto.username,
    });

    const saved = await this.patientRepo.save(patient);
    if (dto.medicalHistory?.trim()) {
      saved.medicalHistories = [
        await this.medicalHistoryRepo.save({
          patientId: saved.id,
          type: 'Khác',
          description: dto.medicalHistory.trim(),
        }),
      ];
    }
    return this.formatPatient(saved);
  }

  async update(id: number, dto: UpdatePatientDto) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');

    const { medicalHistory, ...patientData } = dto;
    Object.assign(patient, patientData);
    const saved = await this.patientRepo.save(patient);
    if (medicalHistory !== undefined) {
      await this.medicalHistoryRepo.delete({ patientId: id });
      if (medicalHistory.trim()) {
        saved.medicalHistories = [
          await this.medicalHistoryRepo.save({
            patientId: id,
            type: 'Khác',
            description: medicalHistory.trim(),
          }),
        ];
      } else {
        saved.medicalHistories = [];
      }
    }
    return this.formatPatient(saved);
  }

  async delete(id: number) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');
    await this.patientRepo.remove(patient);
    return { success: true, message: 'Đã xóa bệnh nhân' };
  }

  private formatPatient(p: Patient) {
    return {
      id: Number(p.id),
      MaBN: Number(p.id),
      HoTen: p.fullName,
      fullName: p.fullName,
      NgaySinh: p.dateOfBirth,
      dateOfBirth: p.dateOfBirth,
      GioiTinh: p.gender,
      gender: p.gender,
      SoDienThoai: p.phone,
      phone: p.phone,
      DiaChi: p.address,
      address: p.address,
      Email: p.email,
      email: p.email,
      SoBaoHiemYTe: p.healthInsuranceNumber,
      healthInsuranceNumber: p.healthInsuranceNumber,
      TrangThai: p.status,
      status: p.status,
      TienSuBenh: p.medicalHistories?.map((history) => history.description).join('; ') || '',
      medicalHistory: p.medicalHistories?.map((history) => history.description).join('; ') || '',
      TenDangNhap: p.username,
      username: p.username,
      createdAt: p.createdAt,
    };
  }
}
