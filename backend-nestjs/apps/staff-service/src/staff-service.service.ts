import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Account, Specialty, Staff } from '@app/database';
import { AccountStatus, CreateSpecialtyDto, CreateStaffDto, UpdateSpecialtyDto, UpdateStaffDto, UserRole } from '@app/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class StaffServiceService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Specialty)
    private readonly specialtyRepo: Repository<Specialty>,
  ) {}

  async getAll(query: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 100);
    const search = String(query?.search || '').trim();

    const [rows, total] = await this.staffRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: search ? [{ fullName: ILike(`%${search}%`) }, { phone: ILike(`%${search}%`) }] : {},
      order: { id: 'ASC' },
      relations: ['account'],
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
    const staff = await this.staffRepo.findOne({ where: { id }, relations: ['account'] });
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');
    return this.formatStaff(staff);
  }

  async create(dto: CreateStaffDto) {
    const username = dto.username?.trim();
    if (!username || !dto.password) {
      throw new BadRequestException('Tên đăng nhập và mật khẩu bác sĩ là bắt buộc');
    }

    return this.staffRepo.manager.transaction(async (manager) => {
      const accountRepo = manager.getRepository(Account);
      const staffRepo = manager.getRepository(Staff);
      const existingAccount = await accountRepo.findOne({ where: { username } });
      let account: Account;

      if (existingAccount) {
        const existingStaff = await staffRepo.findOne({ where: { accountId: existingAccount.id } });
        if (existingStaff || existingAccount.role !== UserRole.BAC_SI) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại');
        }

        account = existingAccount;
        account.passwordHash = await bcrypt.hash(dto.password, 10);
        account.status = AccountStatus.ACTIVE;
        await accountRepo.save(account);
      } else {
        account = await accountRepo.save(accountRepo.create({
          username,
          passwordHash: await bcrypt.hash(dto.password, 10),
          role: UserRole.BAC_SI,
          status: AccountStatus.ACTIVE,
        }));
      }

      const saved = await staffRepo.save(staffRepo.create({
        accountId: account.id,
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        specialty: dto.specialty,
        status: 'Active',
      }));
      saved.account = account;
      return this.formatStaff(saved);
    });
  }

  async update(id: number, dto: UpdateStaffDto) {
    return this.staffRepo.manager.transaction(async (manager) => {
      const accountRepo = manager.getRepository(Account);
      const staffRepo = manager.getRepository(Staff);
      const staff = await staffRepo.findOne({ where: { id }, relations: ['account'] });
      if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');

      Object.assign(staff, {
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        specialty: dto.specialty,
      });
      if (dto.username && staff.account && dto.username !== staff.account.username) {
        const username = dto.username.trim();
        const existingAccount = await accountRepo.findOne({ where: { username } });
        if (existingAccount && existingAccount.id !== staff.account.id) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại');
        }
        staff.account.username = username;
        await accountRepo.save(staff.account);
      }
      return this.formatStaff(await staffRepo.save(staff));
    });
  }

  async delete(id: number) {
    try {
      return await this.staffRepo.manager.transaction(async (manager) => {
        const accountRepo = manager.getRepository(Account);
        const staffRepo = manager.getRepository(Staff);
        const staff = await staffRepo.findOne({ where: { id }, relations: ['account'] });
        if (!staff) throw new NotFoundException('Không tìm thấy nhân viên');

        await staffRepo.remove(staff);
        if (staff.account) await accountRepo.remove(staff.account);
        return { success: true, message: 'Đã xóa bác sĩ và tài khoản đăng nhập' };
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Không thể xóa bác sĩ vì đã có lịch khám hoặc hồ sơ điều trị liên quan');
    }
  }

  async getSpecialties(query: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 20);
    const search = String(query?.search || '').trim();
    const builder = this.specialtyRepo.createQueryBuilder('specialty')
      .leftJoin('bac_si_chuyen_khoa', 'assignment', 'assignment.id_chuyen_khoa = specialty.id')
      .addSelect('COUNT(assignment.id_bac_si)', 'doctor_count')
      .groupBy('specialty.id')
      .orderBy('specialty.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) builder.where('specialty.name ILIKE :search', { search: `%${search}%` });
    const total = await this.specialtyRepo.count({ where: search ? { name: ILike(`%${search}%`) } : {} });
    const { entities, raw } = await builder.getRawAndEntities();
    return {
      data: entities.map((item, index) => this.formatSpecialty(item, Number(raw[index]?.doctor_count || 0))),
      pagination: { total, page, limit, total_pages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async getSpecialty(id: number) {
    const specialty = await this.specialtyRepo.findOne({ where: { id } });
    if (!specialty) throw new NotFoundException('Không tìm thấy chuyên khoa');
    const count = await this.specialtyRepo.manager.query(
      'SELECT COUNT(*)::int AS count FROM bac_si_chuyen_khoa WHERE id_chuyen_khoa = $1',
      [id],
    );
    return this.formatSpecialty(specialty, Number(count[0]?.count || 0));
  }

  async createSpecialty(dto: CreateSpecialtyDto) {
    const existing = await this.specialtyRepo.findOne({ where: { name: dto.name.trim() } });
    if (existing) throw new BadRequestException('Tên chuyên khoa đã tồn tại');
    const saved = await this.specialtyRepo.save(this.specialtyRepo.create({
      name: dto.name.trim(),
      description: dto.description?.trim(),
      status: dto.status || 'Active',
    }));
    return this.formatSpecialty(saved, 0);
  }

  async updateSpecialty(id: number, dto: UpdateSpecialtyDto) {
    const specialty = await this.specialtyRepo.findOne({ where: { id } });
    if (!specialty) throw new NotFoundException('Không tìm thấy chuyên khoa');
    specialty.name = dto.name.trim();
    specialty.description = dto.description?.trim();
    specialty.status = dto.status || specialty.status;
    return this.formatSpecialty(await this.specialtyRepo.save(specialty), 0);
  }

  async deleteSpecialty(id: number) {
    const specialty = await this.specialtyRepo.findOne({ where: { id } });
    if (!specialty) throw new NotFoundException('Không tìm thấy chuyên khoa');
    try {
      await this.specialtyRepo.remove(specialty);
      return { success: true, message: 'Đã xóa chuyên khoa' };
    } catch {
      throw new BadRequestException('Chuyên khoa đang có bác sĩ hoặc dữ liệu liên quan nên không thể xóa');
    }
  }

  private formatSpecialty(item: Specialty, doctorCount: number) {
    return {
      id: Number(item.id),
      MaChuyenKhoa: Number(item.id),
      TenChuyenKhoa: item.name,
      name: item.name,
      MoTa: item.description,
      description: item.description,
      TrangThai: item.status,
      status: item.status,
      SoLuongBacSi: doctorCount,
    };
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
      TenDangNhap: s.account?.username,
      username: s.account?.username,
      TrangThai: s.status,
      status: s.status,
      createdAt: s.createdAt,
    };
  }
}
