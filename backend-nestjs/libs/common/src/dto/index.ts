import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
  IsDateString,
  Matches,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  UserRole,
  AccountStatus,
  Gender,
  AppointmentStatus,
  BillingStatus,
  PaymentMethod,
} from '../constants';

// --- AUTH DTOs ---
export class LoginDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  TenDangNhap?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  MatKhau?: string;
}

export class RegisterDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  TenDangNhap?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  MatKhau?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  HoTen?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  SoDienThoai?: string;

  @IsOptional()
  dateOfBirth?: string;

  @IsOptional()
  NgaySinh?: string;

  @IsOptional()
  gender?: Gender | string;

  @IsOptional()
  GioiTinh?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  DiaChi?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  TienSuBenh?: string;
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  staffId?: number;
}

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsInt()
  staffId?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

// --- STAFF DTOs ---
export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class UpdateStaffDto extends CreateStaffDto {}

// --- PATIENT DTOs ---
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên bệnh nhân là bắt buộc' })
  fullName: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại là bắt buộc' })
  phone: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  healthInsuranceNumber?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class UpdatePatientDto extends CreatePatientDto {}

// --- APPOINTMENT DTOs ---
export class CreateAppointmentDto {
  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, {
    message: 'Giờ khám phải theo định dạng HH:mm hoặc HH:mm:ss',
  })
  appointmentTime: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatus)
  @IsNotEmpty()
  status: AppointmentStatus;
}

// --- MEDICAL RECORD DTOs ---
export class CreateMedicalRecordDto {
  @IsInt()
  @IsNotEmpty()
  appointmentId: number;

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsOptional()
  @IsDateString()
  examinationDate?: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  conclusion?: string;

  @IsOptional()
  @IsNumber()
  examinationFee?: number;
}

// --- PHARMACY DTOs ---
export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  drugName: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsInt()
  @Min(0)
  stockQuantity: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class UpdateDrugDto extends CreateDrugDto {}

export class PrescriptionItemDto {
  @IsInt()
  @IsNotEmpty()
  drugId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  dosage: string;
}

export class CreatePrescriptionDto {
  @IsInt()
  @IsNotEmpty()
  medicalRecordId: number;

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsInt()
  @IsNotEmpty()
  doctorId: number;

  @IsOptional()
  @IsDateString()
  prescriptionDate?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}

// --- BILLING DTOs ---
export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @IsInt()
  @IsNotEmpty()
  medicalRecordId: number;

  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsOptional()
  @IsDateString()
  createdDate?: string;

  @IsOptional()
  @IsNumber()
  examinationFee?: number;

  @IsOptional()
  @IsNumber()
  drugFee?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsEnum(BillingStatus)
  paymentStatus?: BillingStatus;
}

export class UpdateInvoiceStatusDto {
  @IsEnum(BillingStatus)
  @IsNotEmpty()
  paymentStatus: BillingStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}

// --- QUERY DTOs ---
export class DateRangeQueryDto {
  @IsOptional()
  @IsString()
  filter?: 'today' | 'week' | 'month' | 'all';

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
