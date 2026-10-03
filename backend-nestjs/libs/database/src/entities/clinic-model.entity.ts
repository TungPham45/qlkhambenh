import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Staff } from './staff.entity';

@Entity('quan_ly')
export class Manager {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'ho_ten', length: 150 })
  fullName: string;

  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
  phone: string;

  @Column({ length: 150, nullable: true, unique: true })
  email: string;
}

@Entity('chuyen_khoa')
export class Specialty {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'ten_chuyen_khoa', length: 150, unique: true })
  name: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'trang_thai', length: 20, default: 'Active' })
  status: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('bac_si_chuyen_khoa')
export class DoctorSpecialty {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'bac_si_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'chuyen_khoa_id', type: 'bigint' })
  specialtyId: number;

  @Column({ name: 'la_chuyen_khoa_chinh', default: false })
  isPrimary: boolean;

  @Column({ name: 'ngay_gan', type: 'date', default: () => 'CURRENT_DATE' })
  assignedDate: string;

  @ManyToOne(() => Staff, (doctor) => doctor.doctorSpecialties, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bac_si_id' })
  doctor?: Staff;

  @ManyToOne(() => Specialty, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chuyen_khoa_id' })
  specialty?: Specialty;
}

@Entity('lich_lam_viec')
export class WorkSchedule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'bac_si_id', type: 'bigint' })
  doctorId: number;

  @Column({ name: 'ngay_lam_viec', type: 'date' })
  workDate: string;

  @Column({ name: 'gio_bat_dau', type: 'time' })
  startTime: string;

  @Column({ name: 'gio_ket_thuc', type: 'time' })
  endTime: string;

  @Column({ name: 'thoi_luong_moi_ca', type: 'int', default: 30 })
  slotDuration: number;

  @Column({ name: 'trang_thai', length: 20, default: 'Active' })
  status: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('lich_su_lich_hen')
export class AppointmentHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'lich_hen_id', type: 'bigint' })
  appointmentId: number;

  @Column({ name: 'ngay_cu', type: 'date', nullable: true })
  previousDate: string;

  @Column({ name: 'gio_cu', type: 'time', nullable: true })
  previousTime: string;

  @Column({ name: 'ngay_moi', type: 'date', nullable: true })
  newDate: string;

  @Column({ name: 'gio_moi', type: 'time', nullable: true })
  newTime: string;

  @Column({ name: 'trang_thai_cu', length: 30, nullable: true })
  previousStatus: string;

  @Column({ name: 'trang_thai_moi', length: 30, nullable: true })
  newStatus: string;

  @Column({ name: 'loai_thay_doi', length: 50 })
  changeType: string;

  @Column({ name: 'ly_do', type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'nguoi_thay_doi', type: 'uuid', nullable: true })
  changedBy: string;

  @CreateDateColumn({ name: 'thoi_gian_thay_doi', type: 'timestamptz' })
  changedAt: Date;
}

@Entity('tiep_nhan_benh_nhan')
export class PatientReception {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'lich_hen_id', type: 'bigint', unique: true })
  appointmentId: number;

  @Column({ name: 'can_nang', type: 'numeric', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ name: 'chieu_cao', type: 'numeric', precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ name: 'nhiet_do', type: 'numeric', precision: 4, scale: 1, nullable: true })
  temperature: number;

  @Column({ name: 'huyet_ap_tam_thu', type: 'int', nullable: true })
  systolicBloodPressure: number;

  @Column({ name: 'huyet_ap_tam_truong', type: 'int', nullable: true })
  diastolicBloodPressure: number;

  @Column({ name: 'nhip_tim', type: 'int', nullable: true })
  heartRate: number;

  @Column({ name: 'spo2', type: 'numeric', precision: 5, scale: 2, nullable: true })
  spo2: number;

  @Column({ name: 'trieu_chung_ban_dau', type: 'text', nullable: true })
  initialSymptoms: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'thoi_gian_ghi_nhan', type: 'timestamptz' })
  recordedAt: Date;
}

@Entity('danh_muc_ten_benh')
export class DiseaseCatalog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'ma_benh', length: 30, unique: true })
  code: string;

  @Column({ name: 'ten_benh', length: 200 })
  name: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'nhom_benh', length: 100, nullable: true })
  group: string;

  @Column({ name: 'trang_thai', length: 20, default: 'Active' })
  status: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('chan_doan')
export class Diagnosis {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'phieu_kham_id', type: 'bigint' })
  medicalRecordId: number;

  @Column({ name: 'benh_id', type: 'bigint' })
  diseaseId: number;

  @Column({ name: 'la_chan_doan_chinh', default: false })
  isPrimary: boolean;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('tien_su_benh')
export class MedicalHistory {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'benh_nhan_id', type: 'bigint' })
  patientId: number;

  @Column({ name: 'loai_tien_su', length: 100 })
  type: string;

  @Column({ name: 'mo_ta', type: 'text' })
  description: string;

  @Column({ name: 'ngay_phat_hien', type: 'date', nullable: true })
  detectedDate: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Patient, (patient) => patient.medicalHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benh_nhan_id' })
  patient?: Patient;
}

@Entity('goi_y_thuoc')
export class DrugSuggestion {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'benh_id', type: 'bigint' })
  diseaseId: number;

  @Column({ name: 'thuoc_id', type: 'bigint' })
  drugId: number;

  @Column({ name: 'muc_do_uu_tien', type: 'int', default: 1 })
  priority: number;

  @Column({ name: 'muc_dich_su_dung', type: 'text', nullable: true })
  purpose: string;

  @Column({ name: 'lieu_dung_goi_y', length: 255, nullable: true })
  suggestedDosage: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'dang_hoat_dong', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ngay_cap_nhat', type: 'timestamptz' })
  updatedAt: Date;
}

@Entity('giao_dich_kho_thuoc')
export class DrugInventoryTransaction {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'thuoc_id', type: 'bigint' })
  drugId: number;

  @Column({ name: 'loai_giao_dich', length: 30 })
  transactionType: string;

  @Column({ name: 'so_luong', type: 'int' })
  quantity: number;

  @Column({ name: 'tham_chieu_id', length: 80, nullable: true })
  referenceId: string;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('thanh_toan')
export class Payment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'hoa_don_id', length: 50 })
  invoiceId: string;

  @Column({ name: 'so_tien', type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'phuong_thuc_thanh_toan', length: 50 })
  paymentMethod: string;

  @Column({ name: 'ma_giao_dich', length: 100, nullable: true, unique: true })
  transactionCode: string;

  @Column({ name: 'trang_thai', length: 30, default: 'Thanh cong' })
  status: string;

  @CreateDateColumn({ name: 'thoi_gian_thanh_toan', type: 'timestamptz' })
  paidAt: Date;
}

@Entity('thong_bao')
export class Notification {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'tai_khoan_id', type: 'uuid' })
  accountId: string;

  @Column({ name: 'lich_hen_id', type: 'bigint', nullable: true })
  appointmentId: number;

  @Column({ name: 'loai', length: 50 })
  type: string;

  @Column({ name: 'kenh', length: 30 })
  channel: string;

  @Column({ name: 'tieu_de', length: 200 })
  title: string;

  @Column({ name: 'noi_dung', type: 'text' })
  content: string;

  @Column({ name: 'trang_thai', length: 30, default: 'Cho gui' })
  status: string;

  @Column({ name: 'thoi_gian_du_kien_gui', type: 'timestamptz', nullable: true })
  scheduledAt: Date;

  @Column({ name: 'thoi_gian_gui', type: 'timestamptz', nullable: true })
  sentAt: Date;

  @Column({ name: 'thoi_gian_doc', type: 'timestamptz', nullable: true })
  readAt: Date;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamptz' })
  createdAt: Date;
}

@Entity('nhat_ky_hoat_dong')
export class ActivityLog {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ name: 'tai_khoan_id', type: 'uuid', nullable: true })
  accountId: string;

  @Column({ name: 'hanh_dong', length: 100 })
  action: string;

  @Column({ name: 'loai_doi_tuong', length: 80 })
  entityType: string;

  @Column({ name: 'doi_tuong_id', length: 80, nullable: true })
  entityId: string;

  @Column({ name: 'du_lieu_cu', type: 'jsonb', nullable: true })
  oldData: Record<string, unknown>;

  @Column({ name: 'du_lieu_moi', type: 'jsonb', nullable: true })
  newData: Record<string, unknown>;

  @CreateDateColumn({ name: 'thoi_gian', type: 'timestamptz' })
  createdAt: Date;
}
