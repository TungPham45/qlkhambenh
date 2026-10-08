import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account, Appointment, Patient } from '@app/database';
import { AccountStatus, CreatePatientDto, UpdatePatientDto, UserRole } from '@app/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PatientServiceService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  async getAll(query: any, user: any) {
    const page = Math.max(1, parseInt(query?.page) || 1);
    const limit = Math.max(1, parseInt(query?.limit) || 20);
    const search = query?.search || query?.keyword || '';
    const gender = query?.gender || '';
    const status = query?.status || '';

    // Scope for NguoiDung
    if (user?.role === UserRole.NGUOI_DUNG && user?.patientId) {
      const patient = await this.patientRepo.findOne({ where: { id: user.patientId } });
      return {
        data: patient ? [this.formatPatient(patient)] : [],
        pagination: { total: patient ? 1 : 0, page: 1, limit, total_pages: 1 },
      };
    }

    const builder = this.patientRepo.createQueryBuilder('patient')
      .leftJoinAndSelect('patient.account', 'account')
      .orderBy('patient.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (user?.role === UserRole.BAC_SI) {
      const doctorId = Number(user.staffId ?? user.MaNV);
      if (!Number.isInteger(doctorId) || doctorId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bác sĩ');
      }
      builder
        .innerJoin(
          Appointment,
          'assignedAppointment',
          'assignedAppointment.patientId = patient.id AND assignedAppointment.doctorId = :doctorId',
          { doctorId },
        )
        .distinct(true);
    } else if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xem danh sách bệnh nhân');
    }
    if (search) {
      const rawPatientId = search.replace(/^BN-/i, '');
      const exactPatientId = /^\d+$/.test(rawPatientId) ? String(Number(rawPatientId)) : rawPatientId;
      builder.andWhere(
        '(patient.fullName ILIKE :search OR patient.phone ILIKE :search OR CAST(patient.id AS TEXT) = :exact)',
        { search: `%${search}%`, exact: exactPatientId },
      );
    }
    if (gender) builder.andWhere('patient.gender = :gender', { gender });
    if (status) builder.andWhere('patient.status = :status', { status });
    const [rows, total] = await builder.getManyAndCount();

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

  async getById(id: number, user: any) {
    const builder = this.patientRepo
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.account', 'account')
      .where('patient.id = :id', { id });

    if (user?.role === UserRole.BAC_SI) {
      const doctorId = Number(user.staffId ?? user.MaNV);
      if (!Number.isInteger(doctorId) || doctorId <= 0) {
        throw new ForbiddenException('Tài khoản chưa được liên kết với bác sĩ');
      }
      builder.innerJoin(
        Appointment,
        'assignedAppointment',
        'assignedAppointment.patientId = patient.id AND assignedAppointment.doctorId = :doctorId',
        { doctorId },
      );
    } else if (user?.role === UserRole.NGUOI_DUNG) {
      builder.andWhere('patient.id = :scopePatientId', {
        scopePatientId: Number(user.patientId),
      });
    } else if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Bạn không có quyền xem bệnh nhân này');
    }

    const patient = await builder.getOne();
    if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');
    return this.formatPatient(patient);
  }

  async create(dto: CreatePatientDto) {
    const username = dto.username?.trim();
    if (!username) throw new BadRequestException('Tên đăng nhập là bắt buộc');

    return this.patientRepo.manager.transaction(async (manager) => {
      const accountRepo = manager.getRepository(Account);
      const patientRepo = manager.getRepository(Patient);
      const existingAccount = await accountRepo.findOne({ where: { username } });
      let account: Account;

      if (existingAccount) {
        const existingPatient = await patientRepo.findOne({ where: { accountId: existingAccount.id } });
        if (existingPatient || existingAccount.role !== UserRole.NGUOI_DUNG) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại');
        }

        account = existingAccount;
        account.passwordHash = await bcrypt.hash(dto.password || '123456', 10);
        account.status = AccountStatus.ACTIVE;
        await accountRepo.save(account);
      } else {
        account = await accountRepo.save(accountRepo.create({
          username,
          passwordHash: await bcrypt.hash(dto.password || '123456', 10),
          role: UserRole.NGUOI_DUNG,
          status: AccountStatus.ACTIVE,
        }));
      }

      const saved = await patientRepo.save(patientRepo.create({
        accountId: account.id,
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        email: dto.email,
        healthInsuranceNumber: dto.healthInsuranceNumber,
        status: 'Active',
      }));
      saved.account = account;
      return this.formatPatient(saved);
    });
  }

  async update(id: number, dto: UpdatePatientDto) {
    return this.patientRepo.manager.transaction(async (manager) => {
      const accountRepo = manager.getRepository(Account);
      const patientRepo = manager.getRepository(Patient);
      const patient = await patientRepo.findOne({ where: { id }, relations: ['account'] });
      if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');

      Object.assign(patient, {
        fullName: dto.fullName,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        phone: dto.phone,
        address: dto.address,
        email: dto.email,
        healthInsuranceNumber: dto.healthInsuranceNumber,
      });
      if (dto.username && patient.account && dto.username !== patient.account.username) {
        const username = dto.username.trim();
        const existingAccount = await accountRepo.findOne({ where: { username } });
        if (existingAccount && existingAccount.id !== patient.account.id) {
          throw new BadRequestException('Tên đăng nhập đã tồn tại');
        }
        patient.account.username = username;
        await accountRepo.save(patient.account);
      }
      return this.formatPatient(await patientRepo.save(patient));
    });
  }

  async delete(id: number) {
    try {
      return await this.patientRepo.manager.transaction(async (manager) => {
        const accountRepo = manager.getRepository(Account);
        const patientRepo = manager.getRepository(Patient);
        const patient = await patientRepo.findOne({ where: { id }, relations: ['account'] });
        if (!patient) throw new NotFoundException('Không tìm thấy bệnh nhân');

        await patientRepo.remove(patient);
        if (patient.account) await accountRepo.remove(patient.account);
        return { success: true, message: 'Đã xóa bệnh nhân và tài khoản đăng nhập' };
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new BadRequestException('Không thể xóa bệnh nhân vì đã có dữ liệu khám hoặc hồ sơ liên quan');
    }
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
      TenDangNhap: p.account?.username,
      username: p.account?.username,
      createdAt: p.createdAt,
    };
  }
}
