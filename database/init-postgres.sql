-- POSTGRESQL INITIALIZATION SCRIPT FOR CLINIC MANAGEMENT SYSTEM
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG TÀI KHOẢN (accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'NguoiDung' CHECK (role IN ('Admin', 'BacSi', 'LeTan', 'NguoiDung')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Locked')),
    staff_id BIGINT NULL,
    patient_id BIGINT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG NHÂN VIÊN Y TẾ (staff)
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nu', 'Khac')),
    phone VARCHAR(20),
    specialty VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG BỆNH NHÂN (patients)
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nu', 'Khac')),
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    medical_history TEXT,
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG LỊCH KHÁM (appointments)
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Cho kham' CHECK (status IN ('Cho kham', 'Dang kham', 'Da kham', 'Huy')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date_time ON appointments(doctor_id, appointment_date, appointment_time);

-- 5. BẢNG PHIẾU KHÁM / BỆNH ÁN (medical_records)
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    doctor_id BIGINT NOT NULL REFERENCES staff(id),
    examination_date DATE NOT NULL DEFAULT CURRENT_DATE,
    symptoms TEXT,
    diagnosis TEXT,
    conclusion TEXT,
    examination_fee NUMERIC(12,2) NOT NULL DEFAULT 150000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG DANH MỤC THUỐC (drugs)
CREATE TABLE IF NOT EXISTS drugs (
    id BIGSERIAL PRIMARY KEY,
    drug_name VARCHAR(150) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ĐƠN THUỐC (prescriptions)
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGSERIAL PRIMARY KEY,
    medical_record_id BIGINT UNIQUE NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    doctor_id BIGINT NOT NULL REFERENCES staff(id),
    prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Created' CHECK (status IN ('Created', 'Dispensed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG CHI TIẾT ĐƠN THUỐC (prescription_items)
CREATE TABLE IF NOT EXISTS prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    drug_id BIGINT NOT NULL REFERENCES drugs(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    dosage VARCHAR(255) NOT NULL,
    unit_price_at_prescription NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_prescription_drug UNIQUE (prescription_id, drug_id)
);

-- 9. BẢNG HÓA ĐƠN (invoices)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    medical_record_id BIGINT UNIQUE NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    examination_fee NUMERIC(12,2) NOT NULL DEFAULT 150000.00,
    drug_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'Tien mat' CHECK (payment_method IN ('Tien mat', 'Chuyen khoan', 'The', 'VNPAY')),
    payment_status VARCHAR(50) DEFAULT 'Chua thanh toan' CHECK (payment_status IN ('Chua thanh toan', 'Da thanh toan', 'Huy')),
    paid_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG LƯU TRỮ CHỈ SỐ THỐNG KÊ & DỰ BÁO (computed_metrics)
CREATE TABLE IF NOT EXISTS computed_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL,
    metric_payload JSONB NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SEED DỮ LIỆU BAN ĐẦU (Mật khẩu '123456' bcrypt: $2a$10$wE99Y5B6vD2M77gQWqTz8O/f8RkZqfWl37r24u3K0aVvK2Y7nKqG6)
INSERT INTO staff (id, full_name, date_of_birth, gender, phone, specialty, username, status)
VALUES 
(1, 'BS. Nguyễn Văn A', '1985-05-10', 'Nam', '0901111111', 'Khoa nhi', 'bs1', 'Active'),
(2, 'BS. Trần Thị B', '1990-08-20', 'Nu', '0902222222', 'Tai mũi họng', 'bs2', 'Active'),
(3, 'Lê Thị Thu Ngân', '1995-12-01', 'Nu', '0903333333', 'Lễ tân', 'letan1', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO patients (id, full_name, date_of_birth, gender, phone, address, medical_history, username)
VALUES
(1, 'Lê Văn Cường', '2000-01-01', 'Nam', '0911111111', 'Hà Nội', 'Không có tiền sử dị ứng', 'bn1'),
(2, 'Phạm Thị Dung', '1995-03-15', 'Nu', '0922222222', 'Hà Nội', 'Hen suyễn nhẹ', 'bn2')
ON CONFLICT (id) DO NOTHING;

INSERT INTO accounts (username, password_hash, role, status, staff_id, patient_id)
VALUES
('admin', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'Admin', 'Active', NULL, NULL),
('bs1', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'BacSi', 'Active', 1, NULL),
('bs2', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'BacSi', 'Active', 2, NULL),
('letan1', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'LeTan', 'Active', 3, NULL),
('bn1', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, 1),
('bn2', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, 2)
ON CONFLICT (username) DO NOTHING;

INSERT INTO drugs (id, drug_name, unit, unit_price, stock_quantity, expiry_date, is_active)
VALUES
(1, 'Paracetamol 500mg', 'Viên', 5000, 500, '2027-01-01', true),
(2, 'Amoxicillin 500mg', 'Viên', 8000, 200, '2026-12-01', true),
(3, 'Berberin', 'Viên', 3000, 300, '2027-06-01', true),
(4, 'Vitamin C 500mg', 'Viên', 2500, 400, '2027-10-01', true),
(5, 'Siro Ho Astex', 'Chai', 45000, 80, '2026-08-01', true)
ON CONFLICT (id) DO NOTHING;

SELECT setval('staff_id_seq', (SELECT MAX(id) FROM staff));
SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients));
SELECT setval('drugs_id_seq', (SELECT MAX(id) FROM drugs));
