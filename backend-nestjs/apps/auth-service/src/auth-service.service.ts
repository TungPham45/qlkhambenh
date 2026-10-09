import { Injectable, UnauthorizedException, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Account, Staff, Patient } from '@app/database';
import { LoginDto, RegisterDto, CreateAccountDto, UpdateAccountDto, UpdateProfileDto, UserRole, AccountStatus, Gender } from '@app/common';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const username = (dto.username || dto.TenDangNhap || '').trim();
    const password = dto.password || dto.MatKhau || '';
    if (!username || !password) throw new BadRequestException('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
    const account = await this.accountRepo.findOne({ where: { username }, relations: ['staff', 'patient'] });
    if (!account || !await bcrypt.compare(password, account.passwordHash)) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không chính xác');
    }
    this.requireActive(account);
    const token = this.jwtService.sign({
      sub: account.id, username: account.username, role: account.role,
      patientId: account.patient?.id, staffId: account.staff?.id,
    });
    return { token, user: this.formatProfile(account, account.patient, account.staff) };
  }

  async register(dto: RegisterDto) {
    const username = (dto.username || dto.TenDangNhap || '').trim();
    const password = dto.password || dto.MatKhau || '';
    const profile = this.profileValues({
      fullName: dto.fullName || dto.HoTen,
      phone: dto.phone || dto.SoDienThoai,
      dateOfBirth: dto.dateOfBirth || dto.NgaySinh,
      gender: (dto.gender || dto.GioiTinh || Gender.NAM) as Gender,
      address: dto.address || dto.DiaChi,
      email: dto.email,
      healthInsuranceNumber: dto.healthInsuranceNumber,
    }, true);
    if (!username || username.length > 100 || !password || !profile.phone) {
      throw new BadRequestException('Vui lòng điền đầy đủ các thông tin bắt buộc');
    }
    try {
      return await this.accountRepo.manager.transaction(async (manager) => {
        const accounts = manager.getRepository(Account);
        if (await accounts.exists({ where: { username } })) throw new ConflictException('Tên đăng nhập đã tồn tại');
        const account = await accounts.save(accounts.create({
          username, passwordHash: await bcrypt.hash(password, 10), role: UserRole.NGUOI_DUNG, status: AccountStatus.ACTIVE,
        }));
        const patients = manager.getRepository(Patient);
        const patient = await patients.save(patients.create({ ...profile, accountId: account.id, status: 'Active' }));
        return { message: 'Đăng ký tài khoản thành công', user: this.formatProfile(account, patient) };
      });
    } catch (error) {
      if (this.databaseCode(error) === '23505') throw new ConflictException('Tên đăng nhập đã tồn tại');
      throw error;
    }
  }

  async getCurrentUser(accountId: string) {
    const account = await this.accountRepo.findOne({ where: { id: accountId }, relations: ['patient', 'staff'] });
    this.requireActive(account);
    return this.formatProfile(account, account.patient, account.staff);
  }

  async getAccounts(query: any = {}) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
    const search = String(query.search || '').trim();
    const builder = this.accountRepo.createQueryBuilder('account')
      .leftJoinAndSelect('account.staff', 'staff')
      .leftJoinAndSelect('account.patient', 'patient')
      .leftJoin('quan_ly', 'admin_profile', 'admin_profile.id_tai_khoan = account.id')
      .orderBy('account.createdAt', 'DESC').addOrderBy('account.id', 'ASC')
      .skip((page - 1) * limit).take(limit);
    if (search) {
      builder.andWhere('(account.username ILIKE :search OR staff.fullName ILIKE :search OR patient.fullName ILIKE :search OR admin_profile.ho_ten ILIKE :search OR staff.phone ILIKE :search OR patient.phone ILIKE :search OR admin_profile.so_dien_thoai ILIKE :search)', { search: '%' + search + '%' });
    }
    if (query.role) {
      if (!Object.values(UserRole).includes(query.role)) throw new BadRequestException('Vai trò không hợp lệ');
      builder.andWhere('account.role = :role', { role: query.role });
    }
    if (query.status) {
      if (!Object.values(AccountStatus).includes(query.status)) throw new BadRequestException('Trạng thái không hợp lệ');
      builder.andWhere('account.status = :status', { status: query.status });
    }
    const [rows, total] = await builder.getManyAndCount();
    return {
      data: rows.map((account) => this.formatAccount(account)),
      pagination: { total, page, limit, total_pages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async getAccountByUsername(username: string) {
    const account = await this.accountRepo.findOne({ where: { username }, relations: ['staff', 'patient'] });
    if (!account) throw new NotFoundException('Không tìm thấy tài khoản');
    return this.formatAccount(account);
  }

  async createAccount(dto: CreateAccountDto) {
    const username = dto.username?.trim();
    if (!username || username.length > 100 || !dto.password) throw new BadRequestException('Tên đăng nhập và mật khẩu không hợp lệ');
    if (!Object.values(UserRole).includes(dto.role) || (dto.status && !Object.values(AccountStatus).includes(dto.status))) {
      throw new BadRequestException('Vai trò hoặc trạng thái không hợp lệ');
    }
    if (dto.patientId || dto.staffId) throw new BadRequestException('Không thể chuyển hồ sơ của tài khoản khác');
    try {
      const saved = await this.accountRepo.save(this.accountRepo.create({
        username, passwordHash: await bcrypt.hash(dto.password, 10), role: dto.role, status: dto.status || AccountStatus.ACTIVE,
      }));
      return this.formatAccount(saved);
    } catch (error) {
      if (this.databaseCode(error) === '23505') throw new ConflictException('Tên đăng nhập đã tồn tại');
      throw error;
    }
  }

  async updateAccount(username: string, dto: UpdateAccountDto, actorId: string) {
    if ((dto.role && !Object.values(UserRole).includes(dto.role)) || (dto.status && !Object.values(AccountStatus).includes(dto.status))) {
      throw new BadRequestException('Vai trò hoặc trạng thái không hợp lệ');
    }
    if (dto.patientId || dto.staffId) throw new BadRequestException('Không thể chuyển hồ sơ của tài khoản khác');
    return this.accountRepo.manager.transaction(async (manager) => {
      const accounts = manager.getRepository(Account);
      const admins = await this.lockAdmins(manager);
      const account = await accounts.findOne({ where: { username }, lock: { mode: 'pessimistic_write' } });
      if (!account) throw new NotFoundException('Không tìm thấy tài khoản');
      const nextRole = dto.role || account.role;
      const nextStatus = dto.status || account.status;
      if (account.id === actorId && (nextStatus !== AccountStatus.ACTIVE || nextRole !== UserRole.ADMIN)) {
        throw new ConflictException('Bạn không thể tự khóa hoặc thay đổi quyền quản trị của mình');
      }
      if (account.role === UserRole.ADMIN && account.status === AccountStatus.ACTIVE
        && (nextRole !== UserRole.ADMIN || nextStatus !== AccountStatus.ACTIVE)
        && admins.filter((item) => item.status === AccountStatus.ACTIVE).length <= 1) {
        throw new ConflictException('Phải giữ lại ít nhất một tài khoản quản trị đang hoạt động');
      }
      if (nextRole !== account.role) {
        const patient = await manager.getRepository(Patient).exists({ where: { accountId: account.id } });
        const staff = await manager.getRepository(Staff).exists({ where: { accountId: account.id } });
        const managers = await manager.query('SELECT 1 FROM quan_ly WHERE id_tai_khoan = $1', [account.id]);
        if (patient || staff || managers.length) throw new ConflictException('Tài khoản đã có hồ sơ liên kết nên không thể đổi vai trò');
      }
      if (dto.password?.trim()) account.passwordHash = await bcrypt.hash(dto.password, 10);
      account.role = nextRole;
      account.status = nextStatus;
      await accounts.save(account);
      return this.formatAccount(await accounts.findOne({ where: { id: account.id }, relations: ['patient', 'staff'] }));
    });
  }

  async deleteAccount(username: string, actorId: string) {
    try {
      return await this.accountRepo.manager.transaction(async (manager) => {
        const accounts = manager.getRepository(Account);
        const admins = await this.lockAdmins(manager);
        const account = await accounts.findOne({ where: { username }, lock: { mode: 'pessimistic_write' } });
        if (!account) throw new NotFoundException('Không tìm thấy tài khoản');
        if (account.id === actorId) throw new ConflictException('Bạn không thể xóa tài khoản đang đăng nhập');
        if (account.role === UserRole.ADMIN && account.status === AccountStatus.ACTIVE
          && admins.filter((item) => item.status === AccountStatus.ACTIVE).length <= 1) {
          throw new ConflictException('Phải giữ lại ít nhất một tài khoản quản trị đang hoạt động');
        }
        const patients = manager.getRepository(Patient);
        const staffRepo = manager.getRepository(Staff);
        const patient = await patients.findOne({ where: { accountId: account.id }, lock: { mode: 'pessimistic_write' } });
        const staff = await staffRepo.findOne({ where: { accountId: account.id }, lock: { mode: 'pessimistic_write' } });
        if (staff) {
          const schedules = await manager.query('SELECT 1 FROM lich_lam_viec WHERE id_bac_si = $1 LIMIT 1', [staff.id]);
          if (schedules.length) throw new ConflictException('Bác sĩ đã có lịch làm việc. Hãy xử lý lịch làm việc hoặc khóa tài khoản');
          await staffRepo.delete(staff.id);
        }
        if (patient) await patients.delete(patient.id);
        await manager.query('DELETE FROM quan_ly WHERE id_tai_khoan = $1', [account.id]);
        await accounts.delete(account.id);
        return { success: true, message: 'Đã xóa tài khoản và hồ sơ liên kết chưa có dữ liệu khám bệnh' };
      });
    } catch (error) {
      if (this.databaseCode(error) === '23503') {
        throw new ConflictException('Không thể xóa tài khoản đã có lịch hẹn hoặc hồ sơ khám bệnh liên quan. Bạn có thể khóa tài khoản');
      }
      throw error;
    }
  }

  async getProfile(accountId: string) {
    const user = await this.getCurrentUser(accountId);
    if (user.role !== UserRole.NGUOI_DUNG) throw new ForbiddenException('Chỉ bệnh nhân được quản lý hồ sơ cá nhân tại đây');
    return { user, hasProfile: user.hasProfile };
  }

  async createProfile(accountId: string, dto: UpdateProfileDto) {
    const profile = this.profileValues(dto, true);
    return this.accountRepo.manager.transaction(async (manager) => {
      const account = await this.lockPatientAccount(manager, accountId);
      const patients = manager.getRepository(Patient);
      if (await patients.exists({ where: { accountId } })) throw new ConflictException('Bạn đã có thông tin cá nhân. Vui lòng sử dụng chức năng sửa');
      const patient = await patients.save(patients.create({ ...profile, accountId, status: 'Active' }));
      return { user: this.formatProfile(account, patient), hasProfile: true };
    });
  }

  async updateProfile(accountId: string, dto: UpdateProfileDto) {
    const profile = this.profileValues(dto);
    return this.accountRepo.manager.transaction(async (manager) => {
      const account = await manager.getRepository(Account).findOne({ where: { id: accountId }, lock: { mode: 'pessimistic_write' } });
      this.requireActive(account);
      if (account.role === UserRole.NGUOI_DUNG) {
        const patients = manager.getRepository(Patient);
        const patient = await patients.findOne({ where: { accountId } });
        if (!patient) throw new NotFoundException('Bạn chưa có thông tin cá nhân. Vui lòng thêm thông tin');
        Object.assign(patient, profile);
        await patients.save(patient);
        return { user: this.formatProfile(account, patient), hasProfile: true };
      }
      if (account.role === UserRole.BAC_SI) {
        const staffRepo = manager.getRepository(Staff);
        const staff = await staffRepo.findOne({ where: { accountId } });
        if (!staff) throw new NotFoundException('Tài khoản chưa có hồ sơ bác sĩ liên kết');
        for (const key of ['fullName', 'phone', 'dateOfBirth', 'gender']) {
          if (Object.prototype.hasOwnProperty.call(profile, key)) staff[key] = profile[key];
        }
        await staffRepo.save(staff);
        return { user: this.formatProfile(account, undefined, staff), hasProfile: true };
      }
      throw new ForbiddenException('Tài khoản không có hồ sơ cá nhân để cập nhật');
    });
  }

  async deleteProfile(accountId: string) {
    try {
      return await this.accountRepo.manager.transaction(async (manager) => {
        const account = await this.lockPatientAccount(manager, accountId);
        const patients = manager.getRepository(Patient);
        const patient = await patients.findOne({ where: { accountId }, lock: { mode: 'pessimistic_write' } });
        if (!patient) throw new NotFoundException('Bạn chưa có thông tin cá nhân để xóa');
        await patients.delete(patient.id);
        return { success: true, message: 'Đã xóa thông tin cá nhân', user: this.formatProfile(account), hasProfile: false };
      });
    } catch (error) {
      if (this.databaseCode(error) === '23503') {
        throw new ConflictException('Không thể xóa thông tin cá nhân đã có lịch hẹn, tiền sử bệnh hoặc hồ sơ khám bệnh liên quan. Bạn vẫn có thể sửa thông tin');
      }
      throw error;
    }
  }

  private async lockAdmins(manager: EntityManager) {
    return manager.getRepository(Account).createQueryBuilder('account').where('account.role = :role', { role: UserRole.ADMIN })
      .orderBy('account.id', 'ASC').setLock('pessimistic_write').getMany();
  }

  private async lockPatientAccount(manager: EntityManager, accountId: string) {
    const account = await manager.getRepository(Account).findOne({ where: { id: accountId }, lock: { mode: 'pessimistic_write' } });
    this.requireActive(account);
    if (account.role !== UserRole.NGUOI_DUNG) throw new ForbiddenException('Chỉ bệnh nhân được quản lý hồ sơ cá nhân tại đây');
    return account;
  }

  private requireActive(account?: Account) {
    if (!account || account.status !== AccountStatus.ACTIVE) throw new UnauthorizedException('Tài khoản đã bị khóa, ngừng hoạt động hoặc không còn tồn tại');
  }

  private profileValues(dto: UpdateProfileDto, requireName = false): Partial<Patient> {
    const values: any = {};
    const lengths = { fullName: 150, phone: 20, email: 150, address: 255, healthInsuranceNumber: 50 };
    for (const [key, max] of Object.entries(lengths)) {
      if (!Object.prototype.hasOwnProperty.call(dto, key)) continue;
      if (dto[key] !== null && dto[key] !== undefined && typeof dto[key] !== 'string') throw new BadRequestException('Thông tin cá nhân không hợp lệ');
      const value = dto[key]?.trim() || null;
      if (value && value.length > max) throw new BadRequestException('Thông tin cá nhân vượt quá độ dài cho phép');
      values[key] = value;
    }
    if ((requireName || Object.prototype.hasOwnProperty.call(values, 'fullName')) && !values.fullName) {
      throw new BadRequestException('Họ tên là bắt buộc');
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new BadRequestException('Email không hợp lệ');
    if (values.phone && !/^[+\d][\d\s().-]{5,19}$/.test(values.phone)) throw new BadRequestException('Số điện thoại không hợp lệ');
    if (Object.prototype.hasOwnProperty.call(dto, 'gender')) {
      if (dto.gender && !Object.values(Gender).includes(dto.gender)) throw new BadRequestException('Giới tính không hợp lệ');
      values.gender = dto.gender || null;
    }
    if (Object.prototype.hasOwnProperty.call(dto, 'dateOfBirth')) {
      const value = dto.dateOfBirth || null;
      const date = value ? new Date(value + 'T00:00:00Z') : null;
      const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
      const today = ['year', 'month', 'day'].map((key) => parts.find((part) => part.type === key).value).join('-');
      if (value && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || value > today)) {
        throw new BadRequestException('Ngày sinh không hợp lệ hoặc lớn hơn ngày hiện tại');
      }
      values.dateOfBirth = value;
    }
    return values;
  }

  private databaseCode(error: any) { return error?.code || error?.driverError?.code; }

  private formatAccount(account: Account) {
    return {
      id: account.id, username: account.username, TenDangNhap: account.username,
      role: account.role, VaiTro: account.role, status: account.status, TrangThai: account.status,
      fullName: account.staff?.fullName || account.patient?.fullName || account.username,
      phone: account.staff?.phone || account.patient?.phone || null,
      MaBN: account.patient?.id || null, MaNV: account.staff?.id || null, createdAt: account.createdAt,
    };
  }

  private formatProfile(account: Account, patient?: Patient, staff?: Staff) {
    const profile = patient || staff;
    return {
      id: account.id, username: account.username, role: account.role, VaiTro: account.role,
      status: account.status, TrangThai: account.status,
      fullName: profile?.fullName || account.username, HoTen: profile?.fullName || account.username,
      phone: profile?.phone || null, dateOfBirth: profile?.dateOfBirth || null, gender: profile?.gender || null,
      email: patient?.email || null, address: patient?.address || null, healthInsuranceNumber: patient?.healthInsuranceNumber || null,
      MaBN: patient?.id || null, patientId: patient?.id || null, MaNV: staff?.id || null, staffId: staff?.id || null,
      hasProfile: Boolean(profile),
    };
  }
}
