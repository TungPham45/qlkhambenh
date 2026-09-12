import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from '@app/database';
import { CreatePatientDto, UpdatePatientDto } from '@app/common';

@Injectable()
export class PatientServiceService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 20);
    const search = query?.search || query?.keyword || '';

    // Scope for NguoiDung
    if (user?.role === 'NguoiDung' && user?.patientId) {
      const patient = await this.patientRepo.findOne({ where: { id: user.patientId } });
      return {
        data: patient ? [this.formatPatient(patient)] : [],
        pagination: { total: patient ? 1 : 0, page: 1, limit, total_pages: 1 },
      };
    }

    const where: any = {};
    if (search) {
      // Search by name or phone
      where.fullName = Like(`%${search}%`);
    }

    const [rows, total] = await this.patientRepo.findAndCount({
      where: search ? [{ fullName: Like(`%${search}%`) }, { phone: Like(`%${search}%`) }] : {},
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });

    return {
      data: rows.map(this.formatPatient),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    const patient = await this.patientRepo.findOne({ where: { id } });
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
      medicalHistory: dto.medicalHistory,
      username: dto.username,
    });

    const saved = await this.patientRepo.save(patient);
    return this.formatPatient(saved);
  }

  async update(id: number, dto: UpdatePatientDto) {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');

    Object.assign(patient, dto);
    const saved = await this.patientRepo.save(patient);
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
      TienSuBenh: p.medicalHistory,
      medicalHistory: p.medicalHistory,
      TenDangNhap: p.username,
      username: p.username,
      createdAt: p.createdAt,
    };
  }
}
