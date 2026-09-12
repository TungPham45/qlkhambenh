import { Injectable, Logger, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  Account,
  Staff,
  Patient,
} from '@app/database';
import {
  LoginDto,
  RegisterDto,
  CreateAccountDto,
  UpdateAccountDto,
  UserRole,
  AccountStatus,
  Gender,
  REDIS_SERVICES,
  EVENTS,
} from '@app/common';

@Injectable()
export class AuthServiceService {
  private readonly logger = new Logger(AuthServiceService.name);

  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly jwtService: JwtService,
    @Inject(REDIS_SERVICES.PATIENT_SERVICE)
    private readonly patientClient: ClientProxy,
  ) {}

  async login(dto: LoginDto) {
    const username = (dto.username || dto.TenDangNhap || '').trim();
    const password = dto.password || dto.MatKhau || '';

    if (!username || !password) {
      throw new BadRequestException('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
    }

    const account = await this.accountRepo.findOne({
      where: { username },
      relations: ['staff', 'patient'],
    });

    if (!account) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    if (account.status !== AccountStatus.ACTIVE) {
      throw new UnauthorizedException('Tài khoản đã bị khóa hoặc chưa kích hoạt');
    }

    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác');
    }

    const payload = {
      sub: account.id,
      username: account.username,
      role: account.role,
      patientId: account.patientId || account.patient?.id,
      staffId: account.staffId || account.staff?.id,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: account.id,
        username: account.username,
        role: account.role,
        VaiTro: account.role,
        status: account.status,
        TrangThai: account.status,
        MaBN: account.patientId || account.patient?.id,
        MaNV: account.staffId || account.staff?.id,
        fullName: account.staff?.fullName || account.patient?.fullName || account.username,
        HoTen: account.staff?.fullName || account.patient?.fullName || account.username,
      },
    };
  }

  async register(dto: RegisterDto) {
    const username = (dto.username || dto.TenDangNhap || '').trim();
    const password = dto.password || dto.MatKhau || '';
    const fullName = (dto.fullName || dto.HoTen || '').trim();
    const phone = (dto.phone || dto.SoDienThoai || '').trim();
    const dateOfBirth = dto.dateOfBirth || dto.NgaySinh;
    const gender = (dto.gender || dto.GioiTinh || Gender.NAM) as Gender;
    const address = dto.address || dto.DiaChi;
    const medicalHistory = dto.medicalHistory || dto.TienSuBenh;

    if (!username || !password || !fullName || !phone) {
      throw new BadRequestException('Vui lòng điền đầy đủ các thông tin bắt buộc');
    }

    const existing = await this.accountRepo.findOne({ where: { username } });
    if (existing) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 1. Tạo Bệnh nhân
    const patient = this.patientRepo.create({
      fullName,
      phone,
      dateOfBirth,
      gender,
      address,
      medicalHistory,
      username,
    });
    const savedPatient = await this.patientRepo.save(patient);

    // 2. Tạo Tài khoản liên kết
    const account = this.accountRepo.create({
      username,
      passwordHash,
      role: UserRole.NGUOI_DUNG,
      status: AccountStatus.ACTIVE,
      patientId: savedPatient.id,
    });
    const savedAccount = await this.accountRepo.save(account);

    // Cập nhật account_id cho patient
    savedPatient.account = savedAccount;
    await this.patientRepo.save(savedPatient);

    this.logger.log(`User registered successfully: ${username}`);

    return {
      message: 'Đăng ký tài khoản thành công',
      user: {
        id: savedAccount.id,
        username: savedAccount.username,
        role: savedAccount.role,
        patientId: savedPatient.id,
      },
    };
  }

  async getAccounts(query: any) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.max(1, parseInt(query.limit) || 50);

    const [rows, total] = await this.accountRepo.findAndCount({
      relations: ['staff', 'patient'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const data = rows.map((a) => ({
      id: a.id,
      TenDangNhap: a.username,
      username: a.username,
      VaiTro: a.role,
      role: a.role,
      TrangThai: a.status,
      status: a.status,
      MaBN: a.patientId || a.patient?.id || null,
      MaNV: a.staffId || a.staff?.id || null,
      createdAt: a.createdAt,
    }));

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async getAccountByUsername(username: string) {
    const account = await this.accountRepo.findOne({
      where: { username },
      relations: ['staff', 'patient'],
    });
    if (!account) throw new NotFoundException('Không tìm thấy tài khoản');
    return account;
  }

  async createAccount(dto: CreateAccountDto) {
    const existing = await this.accountRepo.findOne({ where: { username: dto.username } });
    if (existing) {
      throw new BadRequestException('Tên đăng nhập đã tồn tại');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const account = this.accountRepo.create({
      username: dto.username,
      passwordHash,
      role: dto.role,
      status: dto.status || AccountStatus.ACTIVE,
      patientId: dto.patientId,
      staffId: dto.staffId,
    });

    const saved = await this.accountRepo.save(account);
    return {
      TenDangNhap: saved.username,
      VaiTro: saved.role,
      TrangThai: saved.status,
      MaBN: saved.patientId,
      MaNV: saved.staffId,
    };
  }

  async updateAccount(username: string, dto: UpdateAccountDto) {
    const account = await this.accountRepo.findOne({ where: { username } });
    if (!account) throw new NotFoundException('Không tìm thấy tài khoản');

    if (dto.password && dto.password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      account.passwordHash = await bcrypt.hash(dto.password, salt);
    }
    if (dto.role) account.role = dto.role;
    if (dto.status) account.status = dto.status;
    if (dto.patientId !== undefined) account.patientId = dto.patientId;
    if (dto.staffId !== undefined) account.staffId = dto.staffId;

    const saved = await this.accountRepo.save(account);
    return {
      TenDangNhap: saved.username,
      VaiTro: saved.role,
      TrangThai: saved.status,
      MaBN: saved.patientId,
      MaNV: saved.staffId,
    };
  }

  async deleteAccount(username: string) {
    const account = await this.accountRepo.findOne({ where: { username } });
    if (!account) throw new NotFoundException('Không tìm thấy tài khoản');
    await this.accountRepo.remove(account);
    return { success: true, message: 'Đã xóa tài khoản' };
  }
}
