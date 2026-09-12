export enum UserRole {
  ADMIN = 'Admin',
  BAC_SI = 'BacSi',
  LE_TAN = 'LeTan',
  NGUOI_DUNG = 'NguoiDung',
}

export enum AccountStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  LOCKED = 'Locked',
}

export enum Gender {
  NAM = 'Nam',
  NU = 'Nu',
  KHAC = 'Khac',
}

export enum AppointmentStatus {
  CHO_KHAM = 'Cho kham',
  DANG_KHAM = 'Dang kham',
  DA_KHAM = 'Da kham',
  HUY = 'Huy',
}

export enum BillingStatus {
  CHUA_THANH_TOAN = 'Chua thanh toan',
  DA_THANH_TOAN = 'Da thanh toan',
  HUY = 'Huy',
}

export enum PaymentMethod {
  TIEN_MAT = 'Tien mat',
  CHUYEN_KHOAN = 'Chuyen khoan',
  THE = 'The',
  VNPAY = 'VNPAY',
}

export enum PrescriptionStatus {
  CREATED = 'Created',
  DISPENSED = 'Dispensed',
  CANCELLED = 'Cancelled',
}

export const REDIS_SERVICES = {
  AUTH_SERVICE: 'AUTH_SERVICE',
  PATIENT_SERVICE: 'PATIENT_SERVICE',
  STAFF_SERVICE: 'STAFF_SERVICE',
  APPOINTMENT_SERVICE: 'APPOINTMENT_SERVICE',
  MEDICAL_RECORD_SERVICE: 'MEDICAL_RECORD_SERVICE',
  PHARMACY_SERVICE: 'PHARMACY_SERVICE',
  BILLING_SERVICE: 'BILLING_SERVICE',
  ANALYTICS_SERVICE: 'ANALYTICS_SERVICE',
  STATISTICAL_SERVICE: 'STATISTICAL_SERVICE',
} as const;

export const MSG = {
  // Auth
  AUTH_LOGIN: { cmd: 'auth.login' },
  AUTH_REGISTER: { cmd: 'auth.register' },
  AUTH_ME: { cmd: 'auth.me' },
  AUTH_GET_ACCOUNTS: { cmd: 'auth.get_accounts' },
  AUTH_GET_ACCOUNT_BY_USER: { cmd: 'auth.get_account_by_user' },
  AUTH_CREATE_ACCOUNT: { cmd: 'auth.create_account' },
  AUTH_UPDATE_ACCOUNT: { cmd: 'auth.update_account' },
  AUTH_DELETE_ACCOUNT: { cmd: 'auth.delete_account' },

  // Staff
  STAFF_GET_ALL: { cmd: 'staff.get_all' },
  STAFF_GET_BY_ID: { cmd: 'staff.get_by_id' },
  STAFF_CREATE: { cmd: 'staff.create' },
  STAFF_UPDATE: { cmd: 'staff.update' },
  STAFF_DELETE: { cmd: 'staff.delete' },
  STAFF_GET_DOCTORS: { cmd: 'staff.get_doctors' },

  // Patients
  PATIENT_GET_ALL: { cmd: 'patient.get_all' },
  PATIENT_GET_BY_ID: { cmd: 'patient.get_by_id' },
  PATIENT_CREATE: { cmd: 'patient.create' },
  PATIENT_UPDATE: { cmd: 'patient.update' },
  PATIENT_DELETE: { cmd: 'patient.delete' },
  PATIENT_SEARCH: { cmd: 'patient.search' },

  // Appointments
  APPT_GET_ALL: { cmd: 'appointment.get_all' },
  APPT_GET_BY_ID: { cmd: 'appointment.get_by_id' },
  APPT_CREATE: { cmd: 'appointment.create' },
  APPT_UPDATE: { cmd: 'appointment.update' },
  APPT_UPDATE_STATUS: { cmd: 'appointment.update_status' },
  APPT_DELETE: { cmd: 'appointment.delete' },
  APPT_GET_BY_DOCTOR: { cmd: 'appointment.get_by_doctor' },

  // Medical Records
  MED_REC_GET_ALL: { cmd: 'medical_record.get_all' },
  MED_REC_GET_BY_ID: { cmd: 'medical_record.get_by_id' },
  MED_REC_GET_BY_APPT: { cmd: 'medical_record.get_by_appt' },
  MED_REC_GET_BY_DOCTOR: { cmd: 'medical_record.get_by_doctor' },
  MED_REC_CREATE: { cmd: 'medical_record.create' },
  MED_REC_UPDATE: { cmd: 'medical_record.update' },

  // Pharmacy
  DRUG_GET_ALL: { cmd: 'drug.get_all' },
  DRUG_GET_BY_ID: { cmd: 'drug.get_by_id' },
  DRUG_CREATE: { cmd: 'drug.create' },
  DRUG_UPDATE: { cmd: 'drug.update' },
  DRUG_DELETE: { cmd: 'drug.delete' },
  PRESCRIPTION_GET_ALL: { cmd: 'prescription.get_all' },
  PRESCRIPTION_GET_BY_ID: { cmd: 'prescription.get_by_id' },
  PRESCRIPTION_CREATE: { cmd: 'prescription.create' },
  PRESCRIPTION_DEDUCT_STOCK: { cmd: 'prescription.deduct_stock' },

  // Billing
  BILLING_GET_ALL: { cmd: 'billing.get_all' },
  BILLING_GET_BY_ID: { cmd: 'billing.get_by_id' },
  BILLING_CREATE: { cmd: 'billing.create' },
  BILLING_UPDATE_STATUS: { cmd: 'billing.update_status' },

  // Analytics & Statistics
  ANALYTICS_DASHBOARD: { cmd: 'analytics.dashboard' },
  ANALYTICS_REVENUE: { cmd: 'analytics.revenue' },
  ANALYTICS_PATIENTS: { cmd: 'analytics.patients' },
  ANALYTICS_APPOINTMENTS: { cmd: 'analytics.appointments' },
  ANALYTICS_PHARMACY: { cmd: 'analytics.pharmacy' },
  ANALYTICS_DOCTORS: { cmd: 'analytics.doctors' },
  ANALYTICS_TRENDS: { cmd: 'analytics.trends' },
  ANALYTICS_KPIS: { cmd: 'analytics.kpis' },

  STATS_AVERAGES: { cmd: 'stats.averages' },
  STATS_DISTRIBUTIONS: { cmd: 'stats.distributions' },
  STATS_TRENDS: { cmd: 'stats.trends' },
  STATS_FORECAST: { cmd: 'stats.forecast' },
  STATS_ANOMALIES: { cmd: 'stats.anomalies' },
  STATS_TIMESERIES: { cmd: 'stats.timeseries' },
} as const;

export const EVENTS = {
  AUTH_USER_REGISTERED: 'auth.user_registered',
  APPOINTMENT_CREATED: 'appointment.created',
  APPOINTMENT_COMPLETED: 'appointment.completed',
  MEDICAL_RECORD_CREATED: 'medical_record.created',
  BILLING_INVOICE_CREATED: 'billing.invoice_created',
  BILLING_INVOICE_PAID: 'billing.invoice_paid',
  PHARMACY_STOCK_DEDUCTED: 'pharmacy.stock_deducted',
} as const;
