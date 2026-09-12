import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '@app/database';
import { CreateStaffDto, UpdateStaffDto } from '@app/common';

@Injectable()
export class StaffServiceService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  async getAll(query: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 100);

    const [rows, total] = await this.staffRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      data: rows.map(this.formatStaff),
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');
    return this.formatStaff(staff);
  }

  async create(dto: CreateStaffDto) {
    const staff = this.staffRepo.create({
      fullName: dto.fullName,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      phone: dto.phone,
      specialty: dto.specialty,
      username: dto.username,
      status: 'Active',
    });

    const saved = await this.staffRepo.save(staff);
    return this.formatStaff(saved);
  }

  async update(id: number, dto: UpdateStaffDto) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');

    Object.assign(staff, dto);
    const saved = await this.staffRepo.save(staff);
    return this.formatStaff(saved);
  }

  async delete(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');
    await this.staffRepo.remove(staff);
    return { success: true, message: 'Đã xóa nhân viên' };
  }

  private formatStaff(s: Staff) {
    return {
      id: Number(s.id),
      MaNV: Number(s.id),
      HoTen: s.fullName,
      fullName: s.fullName,
      NgaySinh: s.dateOfBirth,
      dateOfBirth: s.dateOfBirth,
      GioiTinh: s.gender,
      gender: s.gender,
      SoDienThoai: s.phone,
      phone: s.phone,
      ChuyenKhoa: s.specialty,
      specialty: s.specialty,
      TenDangNhap: s.username,
      username: s.username,
      TrangThai: s.status,
      status: s.status,
      createdAt: s.createdAt,
    };
  }
}
