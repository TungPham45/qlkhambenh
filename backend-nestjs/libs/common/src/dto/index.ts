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
  Max,
  MaxLength,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  UserRole,
  AccountStatus,
  Gender,
  AppointmentStatus,
  BillingStatus,
  PaymentMethod,
  DiseaseStatus,
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
  email?: string;

  @IsOptional()
  @IsString()
  healthInsuranceNumber?: string;
}

export class UpdateProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() healthInsuranceNumber?: string;
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

  @IsOptional()
  @IsString()
  password?: string;
}

export class UpdateStaffDto extends CreateStaffDto {}

export class CreateSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateSpecialtyDto extends CreateSpecialtyDto {}

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
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;
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

// --- PATIENT RECEPTION DTOs ---
export class PatientReceptionVitalsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Cân nặng phải lớn hơn 0' })
  @Max(999.99, { message: 'Cân nặng vượt quá giới hạn cho phép' })
  weight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Chiều cao phải lớn hơn 0' })
  @Max(999.99, { message: 'Chiều cao vượt quá giới hạn cho phép' })
  height?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(30, { message: 'Nhiệt độ phải từ 30°C đến 45°C' })
  @Max(45, { message: 'Nhiệt độ phải từ 30°C đến 45°C' })
  temperature?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Huyết áp tâm thu phải là số nguyên' })
  @Min(0, { message: 'Huyết áp tâm thu không được âm' })
  @Max(500, { message: 'Huyết áp tâm thu vượt quá giới hạn cho phép' })
  systolicBloodPressure?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Huyết áp tâm trương phải là số nguyên' })
  @Min(0, { message: 'Huyết áp tâm trương không được âm' })
  @Max(500, { message: 'Huyết áp tâm trương vượt quá giới hạn cho phép' })
  diastolicBloodPressure?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Nhịp tim phải là số nguyên' })
  @Min(0, { message: 'Nhịp tim không được âm' })
  @Max(400, { message: 'Nhịp tim vượt quá giới hạn cho phép' })
  heartRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'SpO2 phải từ 0 đến 100' })
  @Max(100, { message: 'SpO2 phải từ 0 đến 100' })
  spo2?: number;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(4000)
  initialSymptoms?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(4000)
  notes?: string;
}

export class CreatePatientReceptionDto extends PatientReceptionVitalsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  appointmentId: number;
}

export class UpdatePatientReceptionDto extends PatientReceptionVitalsDto {}

// --- MEDICAL RECORD DTOs ---
export class MedicalRecordDiagnosisDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  diseaseId: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  note?: string;
}

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
  @IsString()
  treatmentDirection?: string;

  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: string;

  @IsOptional()
  @IsNumber()
  examinationFee?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalRecordDiagnosisDto)
  diagnoses?: MedicalRecordDiagnosisDto[];
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

// --- DISEASE CATALOG DTOs ---
const trimText = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOptionalText = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim();
  return normalized || undefined;
};

export class CreateDiseaseDto {
  @Transform(trimText)
  @IsString()
  @IsNotEmpty({ message: 'Mã bệnh là bắt buộc' })
  @MaxLength(50, { message: 'Mã bệnh không được vượt quá 50 ký tự' })
  code: string;

  @Transform(trimText)
  @IsString()
  @IsNotEmpty({ message: 'Tên bệnh là bắt buộc' })
  @MaxLength(255, { message: 'Tên bệnh không được vượt quá 255 ký tự' })
  name: string;

  @IsOptional()
  @Transform(trimText)
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(trimText)
  @IsString()
  @MaxLength(100, { message: 'Nhóm bệnh không được vượt quá 100 ký tự' })
  group?: string;

  @IsOptional()
  @IsEnum(DiseaseStatus, { message: 'Trạng thái bệnh không hợp lệ' })
  status?: DiseaseStatus;
}

export class UpdateDiseaseDto {
  @IsOptional()
  @Transform(trimText)
  @IsString()
  @IsNotEmpty({ message: 'Mã bệnh không được để trống' })
  @MaxLength(50, { message: 'Mã bệnh không được vượt quá 50 ký tự' })
  code?: string;

  @IsOptional()
  @Transform(trimText)
  @IsString()
  @IsNotEmpty({ message: 'Tên bệnh không được để trống' })
  @MaxLength(255, { message: 'Tên bệnh không được vượt quá 255 ký tự' })
  name?: string;

  @IsOptional()
  @Transform(trimText)
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(trimText)
  @IsString()
  @MaxLength(100, { message: 'Nhóm bệnh không được vượt quá 100 ký tự' })
  group?: string;

  @IsOptional()
  @IsEnum(DiseaseStatus, { message: 'Trạng thái bệnh không hợp lệ' })
  status?: DiseaseStatus;
}

export class UpdateDiseaseStatusDto {
  @IsEnum(DiseaseStatus, { message: 'Trạng thái bệnh không hợp lệ' })
  status: DiseaseStatus;
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

export class MedicalHistoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  patientId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  doctorId?: number;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class DiseaseQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(trimOptionalText)
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @Transform(trimOptionalText)
  @IsString()
  @MaxLength(100)
  group?: string;

  @IsOptional()
  @Transform(trimOptionalText)
  @IsEnum(DiseaseStatus, { message: 'Trạng thái bệnh không hợp lệ' })
  status?: DiseaseStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ReceptionQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  receptionStatus?: 'received' | 'pending';

  @IsOptional()
  @Transform(trimOptionalText)
  @IsString()
  @MaxLength(150)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class NotificationQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === true || value === 'true' || value === '1') return true;
    if (value === false || value === 'false' || value === '0') return false;
    return value;
  })
  @IsBoolean()
  unreadOnly?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CreateNotificationDto {
  @IsUUID()
  accountId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  appointmentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  channel?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @Transform(({ value }) => (value == null ? value : Number(value)))
  @IsInt()
  @Min(1)
  appointmentId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  channel?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  status?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string | null;
}
