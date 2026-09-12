import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  Account,
  Staff,
  Patient,
  Appointment,
  MedicalRecord,
  Drug,
  Prescription,
  PrescriptionItem,
  Invoice,
} from '../libs/database/src/entities';
import {
  UserRole,
  AccountStatus,
  Gender,
  AppointmentStatus,
  BillingStatus,
  PaymentMethod,
  PrescriptionStatus,
} from '../libs/common/src/constants';

async function seed() {
  console.log('🌱 Starting Database Seeding for PostgreSQL...');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'clinic_admin',
    password: process.env.DB_PASSWORD || 'clinic_secure_password',
    database: process.env.DB_NAME || 'clinic_master',
    entities: [
      Account,
      Staff,
      Patient,
      Appointment,
      MedicalRecord,
      Drug,
      Prescription,
      PrescriptionItem,
      Invoice,
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('✅ Connected to PostgreSQL Database');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  // 1. Staff
  const staffRepo = dataSource.getRepository(Staff);
  let doc1 = await staffRepo.findOne({ where: { username: 'bs1' } });
  if (!doc1) {
    doc1 = await staffRepo.save({
      fullName: 'BS. Nguyễn Văn A',
      dateOfBirth: '1985-05-10',
      gender: Gender.NAM,
      phone: '0901111111',
      specialty: 'Khoa nhi',
      username: 'bs1',
      status: 'Active',
    });
  }

  let doc2 = await staffRepo.findOne({ where: { username: 'bs2' } });
  if (!doc2) {
    doc2 = await staffRepo.save({
      fullName: 'BS. Trần Thị B',
      dateOfBirth: '1990-08-20',
      gender: Gender.NU,
      phone: '0902222222',
      specialty: 'Tai mũi họng',
      username: 'bs2',
      status: 'Active',
    });
  }

  let letan = await staffRepo.findOne({ where: { username: 'letan1' } });
  if (!letan) {
    letan = await staffRepo.save({
      fullName: 'Lê Thị Thu Ngân',
      dateOfBirth: '1995-12-01',
      gender: Gender.NU,
      phone: '0903333333',
      specialty: 'Lễ tân',
      username: 'letan1',
      status: 'Active',
    });
  }

  // 2. Patients
  const patientRepo = dataSource.getRepository(Patient);
  let patient1 = await patientRepo.findOne({ where: { username: 'bn1' } });
  if (!patient1) {
    patient1 = await patientRepo.save({
      fullName: 'Lê Văn Cường',
      dateOfBirth: '2000-01-01',
      gender: Gender.NAM,
      phone: '0911111111',
      address: 'Hà Nội',
      medicalHistory: 'Không có tiền sử dị ứng',
      username: 'bn1',
    });
  }

  let patient2 = await patientRepo.findOne({ where: { username: 'bn2' } });
  if (!patient2) {
    patient2 = await patientRepo.save({
      fullName: 'Phạm Thị Dung',
      dateOfBirth: '1995-03-15',
      gender: Gender.NU,
      phone: '0922222222',
      address: 'Hà Nội',
      medicalHistory: 'Hen suyễn nhẹ',
      username: 'bn2',
    });
  }

  // 3. Accounts
  const accountRepo = dataSource.getRepository(Account);
  const accountsToCreate = [
    { username: 'admin', role: UserRole.ADMIN, staffId: null, patientId: null },
    { username: 'bs1', role: UserRole.BAC_SI, staffId: Number(doc1.id), patientId: null },
    { username: 'bs2', role: UserRole.BAC_SI, staffId: Number(doc2.id), patientId: null },
    { username: 'letan1', role: UserRole.LE_TAN, staffId: Number(letan.id), patientId: null },
    { username: 'bn1', role: UserRole.NGUOI_DUNG, staffId: null, patientId: Number(patient1.id) },
    { username: 'bn2', role: UserRole.NGUOI_DUNG, staffId: null, patientId: Number(patient2.id) },
  ];

  for (const acc of accountsToCreate) {
    const exists = await accountRepo.findOne({ where: { username: acc.username } });
    if (!exists) {
      await accountRepo.save({
        username: acc.username,
        passwordHash,
        role: acc.role,
        status: AccountStatus.ACTIVE,
        staffId: acc.staffId,
        patientId: acc.patientId,
      });
    }
  }

  // 4. Drugs
  const drugRepo = dataSource.getRepository(Drug);
  const drugsData = [
    { drugName: 'Paracetamol 500mg', unit: 'Viên', unitPrice: 5000, stockQuantity: 500, expiryDate: '2027-01-01' },
    { drugName: 'Amoxicillin 500mg', unit: 'Viên', unitPrice: 8000, stockQuantity: 200, expiryDate: '2026-12-01' },
    { drugName: 'Berberin', unit: 'Viên', unitPrice: 3000, stockQuantity: 300, expiryDate: '2027-06-01' },
    { drugName: 'Vitamin C 500mg', unit: 'Viên', unitPrice: 2500, stockQuantity: 400, expiryDate: '2027-10-01' },
    { drugName: 'Siro Ho Astex', unit: 'Chai', unitPrice: 45000, stockQuantity: 80, expiryDate: '2026-08-01' },
  ];

  for (const d of drugsData) {
    const exists = await drugRepo.findOne({ where: { drugName: d.drugName } });
    if (!exists) {
      await drugRepo.save(d);
    }
  }

  // 5. Sample Appointment, Medical Record, Prescription & Invoice
  const apptRepo = dataSource.getRepository(Appointment);
  const recRepo = dataSource.getRepository(MedicalRecord);
  const presRepo = dataSource.getRepository(Prescription);
  const itemRepo = dataSource.getRepository(PrescriptionItem);
  const invRepo = dataSource.getRepository(Invoice);

  let appt1 = await apptRepo.findOne({ where: { patientId: Number(patient1.id), doctorId: Number(doc1.id) } });
  if (!appt1) {
    appt1 = await apptRepo.save({
      patientId: Number(patient1.id),
      doctorId: Number(doc1.id),
      appointmentDate: '2026-04-10',
      appointmentTime: '08:00:00',
      status: AppointmentStatus.DA_KHAM,
      notes: 'Khám định kỳ',
    });

    const rec1 = await recRepo.save({
      appointmentId: Number(appt1.id),
      patientId: Number(patient1.id),
      doctorId: Number(doc1.id),
      examinationDate: '2026-04-10',
      symptoms: 'Đau tức ngực nhẹ khi thở sâu',
      diagnosis: 'Viêm đường hô hấp trên',
      conclusion: 'Uống thuốc theo đơn, tái khám sau 7 ngày nếu không đỡ',
      examinationFee: 150000.0,
    });

    const para = await drugRepo.findOne({ where: { drugName: 'Paracetamol 500mg' } });
    const amox = await drugRepo.findOne({ where: { drugName: 'Amoxicillin 500mg' } });

    const pres1 = await presRepo.save({
      medicalRecordId: Number(rec1.id),
      patientId: Number(patient1.id),
      doctorId: Number(doc1.id),
      prescriptionDate: '2026-04-10',
      note: 'Uống sau ăn 30 phút',
      status: PrescriptionStatus.DISPENSED,
    });

    if (para) {
      await itemRepo.save({
        prescriptionId: Number(pres1.id),
        drugId: Number(para.id),
        quantity: 10,
        dosage: '2 viên/ngày, sáng 1 tối 1',
        unitPriceAtPrescription: 5000,
      });
    }

    if (amox) {
      await itemRepo.save({
        prescriptionId: Number(pres1.id),
        drugId: Number(amox.id),
        quantity: 5,
        dosage: '1 viên/ngày sau ăn',
        unitPriceAtPrescription: 8000,
      });
    }

    await invRepo.save({
      id: 'HD0001',
      medicalRecordId: Number(rec1.id),
      patientId: Number(patient1.id),
      createdDate: '2026-04-10',
      examinationFee: 150000.0,
      drugFee: 90000.0,
      totalAmount: 240000.0,
      paymentMethod: PaymentMethod.TIEN_MAT,
      paymentStatus: BillingStatus.DA_THANH_TOAN,
      paidAt: new Date('2026-04-10T08:30:00Z'),
    });
  }

  console.log('✨ Seed Data created successfully!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
