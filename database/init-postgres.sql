-- Cơ sở dữ liệu hệ thống quản lý phòng khám theo biểu đồ lớp.
-- Tệp này chủ động tạo lại toàn bộ schema public khi được chạy.

BEGIN;

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE quan_ly (
    id BIGSERIAL PRIMARY KEY,
    ho_ten VARCHAR(150) NOT NULL,
    so_dien_thoai VARCHAR(20),
    email VARCHAR(150) UNIQUE
);

CREATE TABLE bac_si (
    id BIGSERIAL PRIMARY KEY,
    ho_ten VARCHAR(150) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('Nam', 'Nu', 'Khac')),
    so_dien_thoai VARCHAR(20),
    email VARCHAR(150) UNIQUE,
    bang_cap VARCHAR(255),
    so_chung_chi_hanh_nghe VARCHAR(100) UNIQUE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE benh_nhan (
    id BIGSERIAL PRIMARY KEY,
    ho_ten VARCHAR(150) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('Nam', 'Nu', 'Khac')),
    so_dien_thoai VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    dia_chi VARCHAR(255),
    so_bao_hiem_y_te VARCHAR(30) UNIQUE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tai_khoan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_ma_hoa VARCHAR(255) NOT NULL,
    vai_tro VARCHAR(30) NOT NULL DEFAULT 'NguoiDung' CHECK (vai_tro IN ('Admin', 'BacSi', 'NguoiDung')),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (trang_thai IN ('Active', 'Inactive', 'Locked')),
    quan_ly_id BIGINT UNIQUE REFERENCES quan_ly(id) ON DELETE SET NULL,
    bac_si_id BIGINT UNIQUE REFERENCES bac_si(id) ON DELETE SET NULL,
    benh_nhan_id BIGINT UNIQUE REFERENCES benh_nhan(id) ON DELETE SET NULL,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_tai_khoan_doi_tuong CHECK (num_nonnulls(quan_ly_id, bac_si_id, benh_nhan_id) <= 1)
);

CREATE TABLE chuyen_khoa (
    id BIGSERIAL PRIMARY KEY,
    ten_chuyen_khoa VARCHAR(150) UNIQUE NOT NULL,
    mo_ta TEXT,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bac_si_chuyen_khoa (
    id BIGSERIAL PRIMARY KEY,
    bac_si_id BIGINT NOT NULL REFERENCES bac_si(id) ON DELETE CASCADE,
    chuyen_khoa_id BIGINT NOT NULL REFERENCES chuyen_khoa(id) ON DELETE CASCADE,
    la_chuyen_khoa_chinh BOOLEAN NOT NULL DEFAULT FALSE,
    ngay_gan DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uq_bac_si_chuyen_khoa UNIQUE (bac_si_id, chuyen_khoa_id)
);
CREATE UNIQUE INDEX uq_bac_si_chuyen_khoa_chinh ON bac_si_chuyen_khoa(bac_si_id) WHERE la_chuyen_khoa_chinh;

CREATE TABLE lich_lam_viec (
    id BIGSERIAL PRIMARY KEY,
    bac_si_id BIGINT NOT NULL REFERENCES bac_si(id) ON DELETE CASCADE,
    ngay_lam_viec DATE NOT NULL,
    gio_bat_dau TIME NOT NULL,
    gio_ket_thuc TIME NOT NULL,
    thoi_luong_moi_ca INTEGER NOT NULL DEFAULT 30 CHECK (thoi_luong_moi_ca > 0),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active',
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_lich_lam_viec_gio CHECK (gio_ket_thuc > gio_bat_dau),
    CONSTRAINT uq_lich_lam_viec UNIQUE (bac_si_id, ngay_lam_viec, gio_bat_dau)
);

CREATE TABLE lich_hen (
    id BIGSERIAL PRIMARY KEY,
    benh_nhan_id BIGINT NOT NULL REFERENCES benh_nhan(id) ON DELETE CASCADE,
    bac_si_id BIGINT NOT NULL REFERENCES bac_si(id) ON DELETE RESTRICT,
    ngay_hen DATE NOT NULL,
    gio_hen TIME NOT NULL,
    ly_do_kham TEXT,
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'Cho kham' CHECK (trang_thai IN ('Cho kham', 'Dang kham', 'Da kham', 'Huy')),
    nguon_dat_lich VARCHAR(30) DEFAULT 'Truc tuyen',
    ghi_chu TEXT,
    ly_do_huy TEXT,
    thoi_gian_huy TIMESTAMPTZ,
    thoi_gian_check_in TIMESTAMPTZ,
    thoi_gian_bat_dau_kham TIMESTAMPTZ,
    thoi_gian_ket_thuc_kham TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_lich_hen_bac_si_ngay_gio ON lich_hen(bac_si_id, ngay_hen, gio_hen);
CREATE UNIQUE INDEX uq_lich_hen_khung_gio ON lich_hen(bac_si_id, ngay_hen, gio_hen) WHERE trang_thai <> 'Huy';

CREATE TABLE lich_su_lich_hen (
    id BIGSERIAL PRIMARY KEY,
    lich_hen_id BIGINT NOT NULL REFERENCES lich_hen(id) ON DELETE CASCADE,
    ngay_cu DATE,
    gio_cu TIME,
    ngay_moi DATE,
    gio_moi TIME,
    trang_thai_cu VARCHAR(30),
    trang_thai_moi VARCHAR(30),
    loai_thay_doi VARCHAR(50) NOT NULL,
    ly_do TEXT,
    nguoi_thay_doi UUID REFERENCES tai_khoan(id) ON DELETE SET NULL,
    thoi_gian_thay_doi TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tiep_nhan_benh_nhan (
    id BIGSERIAL PRIMARY KEY,
    lich_hen_id BIGINT UNIQUE NOT NULL REFERENCES lich_hen(id) ON DELETE CASCADE,
    can_nang NUMERIC(5,2),
    chieu_cao NUMERIC(5,2),
    nhiet_do NUMERIC(4,1),
    huyet_ap_tam_thu INTEGER,
    huyet_ap_tam_truong INTEGER,
    nhip_tim INTEGER,
    spo2 NUMERIC(5,2),
    trieu_chung_ban_dau TEXT,
    ghi_chu TEXT,
    thoi_gian_ghi_nhan TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phieu_kham (
    id BIGSERIAL PRIMARY KEY,
    lich_hen_id BIGINT UNIQUE NOT NULL REFERENCES lich_hen(id) ON DELETE CASCADE,
    benh_nhan_id BIGINT NOT NULL REFERENCES benh_nhan(id) ON DELETE RESTRICT,
    bac_si_id BIGINT NOT NULL REFERENCES bac_si(id) ON DELETE RESTRICT,
    ngay_kham DATE NOT NULL DEFAULT CURRENT_DATE,
    trieu_chung TEXT,
    ket_qua_kham TEXT,
    ket_luan TEXT,
    huong_dieu_tri TEXT,
    ghi_chu_bac_si TEXT,
    ngay_tai_kham DATE,
    chi_phi_kham NUMERIC(12,2) NOT NULL DEFAULT 150000 CHECK (chi_phi_kham >= 0),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE danh_muc_ten_benh (
    id BIGSERIAL PRIMARY KEY,
    ma_benh VARCHAR(30) UNIQUE NOT NULL,
    ten_benh VARCHAR(200) NOT NULL,
    mo_ta TEXT,
    nhom_benh VARCHAR(100),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Active',
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chan_doan (
    id BIGSERIAL PRIMARY KEY,
    phieu_kham_id BIGINT NOT NULL REFERENCES phieu_kham(id) ON DELETE CASCADE,
    benh_id BIGINT NOT NULL REFERENCES danh_muc_ten_benh(id) ON DELETE RESTRICT,
    la_chan_doan_chinh BOOLEAN NOT NULL DEFAULT FALSE,
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_chan_doan UNIQUE (phieu_kham_id, benh_id)
);

CREATE TABLE tien_su_benh (
    id BIGSERIAL PRIMARY KEY,
    benh_nhan_id BIGINT NOT NULL REFERENCES benh_nhan(id) ON DELETE CASCADE,
    loai_tien_su VARCHAR(100) NOT NULL,
    mo_ta TEXT NOT NULL,
    ngay_phat_hien DATE,
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thuoc (
    id BIGSERIAL PRIMARY KEY,
    ten_thuoc VARCHAR(150) NOT NULL,
    hoat_chat VARCHAR(150),
    ham_luong VARCHAR(80),
    don_vi VARCHAR(50) NOT NULL,
    don_gia NUMERIC(12,2) NOT NULL CHECK (don_gia >= 0),
    so_luong_ton INTEGER NOT NULL DEFAULT 0 CHECK (so_luong_ton >= 0),
    han_su_dung DATE,
    nha_san_xuat VARCHAR(150),
    ma_thuoc VARCHAR(50) UNIQUE NOT NULL,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goi_y_thuoc (
    id BIGSERIAL PRIMARY KEY,
    benh_id BIGINT NOT NULL REFERENCES danh_muc_ten_benh(id) ON DELETE CASCADE,
    thuoc_id BIGINT NOT NULL REFERENCES thuoc(id) ON DELETE CASCADE,
    muc_do_uu_tien INTEGER NOT NULL DEFAULT 1 CHECK (muc_do_uu_tien > 0),
    muc_dich_su_dung TEXT,
    lieu_dung_goi_y VARCHAR(255),
    ghi_chu TEXT,
    dang_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_goi_y_thuoc UNIQUE (benh_id, thuoc_id)
);

CREATE TABLE giao_dich_kho_thuoc (
    id BIGSERIAL PRIMARY KEY,
    thuoc_id BIGINT NOT NULL REFERENCES thuoc(id) ON DELETE RESTRICT,
    loai_giao_dich VARCHAR(30) NOT NULL CHECK (loai_giao_dich IN ('Nhap', 'Xuat', 'Dieu chinh')),
    so_luong INTEGER NOT NULL CHECK (so_luong > 0),
    tham_chieu_id VARCHAR(80),
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE don_thuoc (
    id BIGSERIAL PRIMARY KEY,
    phieu_kham_id BIGINT UNIQUE NOT NULL REFERENCES phieu_kham(id) ON DELETE CASCADE,
    benh_nhan_id BIGINT NOT NULL REFERENCES benh_nhan(id) ON DELETE RESTRICT,
    bac_si_id BIGINT NOT NULL REFERENCES bac_si(id) ON DELETE RESTRICT,
    ngay_ke_don DATE NOT NULL DEFAULT CURRENT_DATE,
    ghi_chu TEXT,
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'Created' CHECK (trang_thai IN ('Created', 'Dispensed', 'Cancelled')),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chi_tiet_don_thuoc (
    id BIGSERIAL PRIMARY KEY,
    don_thuoc_id BIGINT NOT NULL REFERENCES don_thuoc(id) ON DELETE CASCADE,
    thuoc_id BIGINT NOT NULL REFERENCES thuoc(id) ON DELETE RESTRICT,
    so_luong INTEGER NOT NULL CHECK (so_luong > 0),
    lieu_dung VARCHAR(255) NOT NULL,
    tan_suat VARCHAR(100),
    so_ngay_dung INTEGER CHECK (so_ngay_dung > 0),
    duong_dung VARCHAR(100),
    huong_dan TEXT,
    don_gia_tai_thoi_diem_ke NUMERIC(12,2) NOT NULL CHECK (don_gia_tai_thoi_diem_ke >= 0),
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_chi_tiet_don_thuoc UNIQUE (don_thuoc_id, thuoc_id)
);

CREATE TABLE hoa_don (
    id VARCHAR(50) PRIMARY KEY,
    phieu_kham_id BIGINT UNIQUE NOT NULL REFERENCES phieu_kham(id) ON DELETE CASCADE,
    benh_nhan_id BIGINT NOT NULL REFERENCES benh_nhan(id) ON DELETE RESTRICT,
    ngay_lap DATE NOT NULL DEFAULT CURRENT_DATE,
    chi_phi_kham NUMERIC(12,2) NOT NULL DEFAULT 150000 CHECK (chi_phi_kham >= 0),
    tien_thuoc NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (tien_thuoc >= 0),
    tong_tien NUMERIC(12,2) NOT NULL CHECK (tong_tien >= 0),
    phuong_thuc_thanh_toan VARCHAR(50) DEFAULT 'Tien mat',
    trang_thai_thanh_toan VARCHAR(50) NOT NULL DEFAULT 'Chua thanh toan' CHECK (trang_thai_thanh_toan IN ('Chua thanh toan', 'Da thanh toan', 'Huy')),
    thoi_gian_thanh_toan TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thanh_toan (
    id BIGSERIAL PRIMARY KEY,
    hoa_don_id VARCHAR(50) NOT NULL REFERENCES hoa_don(id) ON DELETE CASCADE,
    so_tien NUMERIC(12,2) NOT NULL CHECK (so_tien > 0),
    phuong_thuc_thanh_toan VARCHAR(50) NOT NULL,
    ma_giao_dich VARCHAR(100) UNIQUE,
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'Thanh cong',
    thoi_gian_thanh_toan TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE thong_bao (
    id BIGSERIAL PRIMARY KEY,
    tai_khoan_id UUID NOT NULL REFERENCES tai_khoan(id) ON DELETE CASCADE,
    lich_hen_id BIGINT REFERENCES lich_hen(id) ON DELETE CASCADE,
    loai VARCHAR(50) NOT NULL,
    kenh VARCHAR(30) NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai VARCHAR(30) NOT NULL DEFAULT 'Cho gui',
    thoi_gian_du_kien_gui TIMESTAMPTZ,
    thoi_gian_gui TIMESTAMPTZ,
    thoi_gian_doc TIMESTAMPTZ,
    ngay_tao TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE nhat_ky_hoat_dong (
    id BIGSERIAL PRIMARY KEY,
    tai_khoan_id UUID REFERENCES tai_khoan(id) ON DELETE SET NULL,
    hanh_dong VARCHAR(100) NOT NULL,
    loai_doi_tuong VARCHAR(80) NOT NULL,
    doi_tuong_id VARCHAR(80),
    du_lieu_cu JSONB,
    du_lieu_moi JSONB,
    thoi_gian TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chi_so_thong_ke (
    id BIGSERIAL PRIMARY KEY,
    loai_chi_so VARCHAR(50) NOT NULL,
    du_lieu_thong_ke JSONB NOT NULL,
    thoi_gian_tinh TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu. Tất cả tài khoản có mật khẩu: 123456
INSERT INTO quan_ly (id, ho_ten, so_dien_thoai, email) VALUES
    (1, 'Nguyễn Minh Quản', '0901000001', 'admin@clinic.vn');

INSERT INTO bac_si (id, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, bang_cap, so_chung_chi_hanh_nghe) VALUES
    (1, 'BS. Nguyễn Văn An', '1985-05-10', 'Nam', '0901111111', 'an.nguyen@clinic.vn', 'Bác sĩ chuyên khoa I', 'CCHN-0001'),
    (2, 'BS. Trần Thị Bình', '1990-08-20', 'Nu', '0902222222', 'binh.tran@clinic.vn', 'Thạc sĩ Y khoa', 'CCHN-0002'),
    (3, 'BS. Lê Quốc Cường', '1982-11-12', 'Nam', '0903333333', 'cuong.le@clinic.vn', 'Bác sĩ chuyên khoa II', 'CCHN-0003');

INSERT INTO benh_nhan (id, ho_ten, ngay_sinh, gioi_tinh, so_dien_thoai, email, dia_chi, so_bao_hiem_y_te) VALUES
    (1, 'Lê Văn Cường', '2000-01-01', 'Nam', '0911111111', 'cuong.le@example.com', 'Cầu Giấy, Hà Nội', 'HN-00100001'),
    (2, 'Phạm Thị Dung', '1995-03-15', 'Nu', '0922222222', 'dung.pham@example.com', 'Hai Bà Trưng, Hà Nội', 'HN-00100002'),
    (3, 'Đỗ Minh Hoàng', '1988-07-22', 'Nam', '0933333333', 'hoang.do@example.com', 'Nam Từ Liêm, Hà Nội', 'HN-00100003'),
    (4, 'Vũ Thu Lan', '2003-12-09', 'Nu', '0944444444', 'lan.vu@example.com', 'Long Biên, Hà Nội', 'HN-00100004');

INSERT INTO tai_khoan (id, ten_dang_nhap, mat_khau_ma_hoa, vai_tro, trang_thai, quan_ly_id, bac_si_id, benh_nhan_id) VALUES
    ('10000000-0000-0000-0000-000000000001', 'admin', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'Admin', 'Active', 1, NULL, NULL),
    ('20000000-0000-0000-0000-000000000001', 'bs1', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'BacSi', 'Active', NULL, 1, NULL),
    ('20000000-0000-0000-0000-000000000002', 'bs2', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'BacSi', 'Active', NULL, 2, NULL),
    ('20000000-0000-0000-0000-000000000003', 'bs3', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'BacSi', 'Active', NULL, 3, NULL),
    ('30000000-0000-0000-0000-000000000001', 'bn1', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, NULL, 1),
    ('30000000-0000-0000-0000-000000000002', 'bn2', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, NULL, 2),
    ('30000000-0000-0000-0000-000000000003', 'bn3', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, NULL, 3),
    ('30000000-0000-0000-0000-000000000004', 'bn4', '$2a$10$UryyYyn.Pf/mhB.T5KLuFOXb/Quo56mC5xmkpmzy7q/lhSa0jGF.e', 'NguoiDung', 'Active', NULL, NULL, 4);

INSERT INTO chuyen_khoa (id, ten_chuyen_khoa, mo_ta) VALUES
    (1, 'Nội tổng quát', 'Khám và điều trị bệnh lý nội khoa'),
    (2, 'Nhi khoa', 'Chăm sóc sức khỏe trẻ em'),
    (3, 'Tai Mũi Họng', 'Điều trị bệnh tai, mũi và họng'),
    (4, 'Tim mạch', 'Khám và điều trị bệnh tim mạch');

INSERT INTO bac_si_chuyen_khoa (bac_si_id, chuyen_khoa_id, la_chuyen_khoa_chinh) VALUES
    (1, 2, TRUE), (1, 1, FALSE), (2, 3, TRUE), (3, 4, TRUE);

INSERT INTO lich_lam_viec (bac_si_id, ngay_lam_viec, gio_bat_dau, gio_ket_thuc, thoi_luong_moi_ca) VALUES
    (1, CURRENT_DATE + 1, '08:00', '11:30', 30),
    (2, CURRENT_DATE + 1, '13:30', '17:00', 30),
    (3, CURRENT_DATE + 2, '08:00', '11:30', 30),
    (1, CURRENT_DATE + 3, '13:30', '17:00', 30);

INSERT INTO danh_muc_ten_benh (id, ma_benh, ten_benh, mo_ta, nhom_benh) VALUES
    (1, 'J00', 'Viêm mũi họng cấp', 'Nhiễm khuẩn đường hô hấp trên thường gặp', 'Hô hấp'),
    (2, 'J45', 'Hen phế quản', 'Bệnh viêm mạn tính đường thở', 'Hô hấp'),
    (3, 'I10', 'Tăng huyết áp nguyên phát', 'Tăng huyết áp không rõ nguyên nhân thứ phát', 'Tim mạch'),
    (4, 'R50', 'Sốt chưa rõ nguyên nhân', 'Thân nhiệt tăng chưa xác định nguyên nhân', 'Triệu chứng');

INSERT INTO tien_su_benh (benh_nhan_id, loai_tien_su, mo_ta, ngay_phat_hien) VALUES
    (1, 'Dị ứng', 'Dị ứng nhẹ với hải sản', '2018-06-01'),
    (2, 'Bệnh mạn tính', 'Hen phế quản mức độ nhẹ', '2015-09-12'),
    (3, 'Gia đình', 'Bố có tiền sử tăng huyết áp', '2020-01-01'),
    (4, 'Phẫu thuật', 'Chưa từng phẫu thuật', NULL);

INSERT INTO thuoc (id, ten_thuoc, hoat_chat, ham_luong, don_vi, don_gia, so_luong_ton, han_su_dung, nha_san_xuat, ma_thuoc) VALUES
    (1, 'Paracetamol 500mg', 'Paracetamol', '500mg', 'Viên', 5000, 500, '2028-01-01', 'Dược Hậu Giang', 'TH-0001'),
    (2, 'Amoxicillin 500mg', 'Amoxicillin', '500mg', 'Viên', 8000, 200, '2027-12-01', 'Imexpharm', 'TH-0002'),
    (3, 'Berberin', 'Berberin chloride', '100mg', 'Viên', 3000, 300, '2028-06-01', 'Traphaco', 'TH-0003'),
    (4, 'Vitamin C 500mg', 'Ascorbic acid', '500mg', 'Viên', 2500, 400, '2028-10-01', 'Dược Hậu Giang', 'TH-0004'),
    (5, 'Siro ho Astex', 'Húng chanh và núc nác', '90ml', 'Chai', 45000, 80, '2027-08-01', 'OPC', 'TH-0005'),
    (6, 'Loratadine 10mg', 'Loratadine', '10mg', 'Viên', 3500, 250, '2028-03-01', 'Stada', 'TH-0006'),
    (7, 'Amlodipine 5mg', 'Amlodipine', '5mg', 'Viên', 4200, 180, '2028-04-01', 'Domesco', 'TH-0007'),
    (8, 'Salbutamol 2mg', 'Salbutamol', '2mg', 'Viên', 6000, 120, '2027-11-01', 'Mekophar', 'TH-0008');

INSERT INTO goi_y_thuoc (benh_id, thuoc_id, muc_do_uu_tien, muc_dich_su_dung, lieu_dung_goi_y) VALUES
    (1, 1, 1, 'Hạ sốt, giảm đau', '1 viên khi sốt, cách 6 giờ'),
    (1, 6, 2, 'Giảm triệu chứng dị ứng', '1 viên mỗi tối'),
    (2, 8, 1, 'Giãn phế quản', 'Theo chỉ định bác sĩ'),
    (3, 7, 1, 'Kiểm soát huyết áp', '1 viên mỗi ngày');

INSERT INTO lich_hen (id, benh_nhan_id, bac_si_id, ngay_hen, gio_hen, ly_do_kham, trang_thai, nguon_dat_lich, ghi_chu) VALUES
    (1, 1, 1, CURRENT_DATE - 2, '08:30', 'Sốt và đau họng', 'Da kham', 'Truc tuyen', 'Đã hoàn thành khám'),
    (2, 2, 2, CURRENT_DATE + 1, '14:00', 'Tái khám viêm mũi dị ứng', 'Cho kham', 'Truc tuyen', NULL),
    (3, 3, 3, CURRENT_DATE + 2, '09:00', 'Kiểm tra huyết áp', 'Cho kham', 'Truc tuyen', NULL),
    (4, 4, 1, CURRENT_DATE + 3, '15:00', 'Ho kéo dài', 'Cho kham', 'Truc tuyen', NULL);

INSERT INTO lich_su_lich_hen (lich_hen_id, ngay_moi, gio_moi, trang_thai_moi, loai_thay_doi, nguoi_thay_doi) VALUES
    (1, CURRENT_DATE - 2, '08:30', 'Cho kham', 'Tao moi', '30000000-0000-0000-0000-000000000001'),
    (1, CURRENT_DATE - 2, '08:30', 'Da kham', 'Cap nhat trang thai', '20000000-0000-0000-0000-000000000001'),
    (2, CURRENT_DATE + 1, '14:00', 'Cho kham', 'Tao moi', '30000000-0000-0000-0000-000000000002');

INSERT INTO tiep_nhan_benh_nhan (lich_hen_id, can_nang, chieu_cao, nhiet_do, huyet_ap_tam_thu, huyet_ap_tam_truong, nhip_tim, spo2, trieu_chung_ban_dau) VALUES
    (1, 62.5, 170, 38.2, 118, 76, 88, 98, 'Sốt, đau họng và mệt mỏi');

INSERT INTO phieu_kham (id, lich_hen_id, benh_nhan_id, bac_si_id, ngay_kham, trieu_chung, ket_qua_kham, ket_luan, huong_dieu_tri, ngay_tai_kham, chi_phi_kham) VALUES
    (1, 1, 1, 1, CURRENT_DATE - 2, 'Sốt 38.2 độ, đau họng', 'Họng đỏ, phổi thông khí tốt', 'Viêm mũi họng cấp', 'Điều trị triệu chứng, uống nhiều nước', CURRENT_DATE + 5, 150000);

INSERT INTO chan_doan (phieu_kham_id, benh_id, la_chan_doan_chinh, ghi_chu) VALUES
    (1, 1, TRUE, 'Chẩn đoán chính'), (1, 4, FALSE, 'Triệu chứng kèm theo');

INSERT INTO don_thuoc (id, phieu_kham_id, benh_nhan_id, bac_si_id, ngay_ke_don, ghi_chu, trang_thai) VALUES
    (1, 1, 1, 1, CURRENT_DATE - 2, 'Uống thuốc sau ăn', 'Dispensed');

INSERT INTO chi_tiet_don_thuoc (don_thuoc_id, thuoc_id, so_luong, lieu_dung, tan_suat, so_ngay_dung, duong_dung, huong_dan, don_gia_tai_thoi_diem_ke) VALUES
    (1, 1, 10, '1 viên/lần', '2 lần/ngày', 5, 'Đường uống', 'Uống sau ăn', 5000),
    (1, 4, 10, '1 viên/lần', '2 lần/ngày', 5, 'Đường uống', 'Uống sau ăn', 2500);

INSERT INTO giao_dich_kho_thuoc (thuoc_id, loai_giao_dich, so_luong, tham_chieu_id, ghi_chu) VALUES
    (1, 'Nhap', 500, 'PN-0001', 'Nhập kho đầu kỳ'),
    (4, 'Nhap', 400, 'PN-0002', 'Nhập kho đầu kỳ'),
    (1, 'Xuat', 10, 'DT-1', 'Cấp theo đơn thuốc số 1'),
    (4, 'Xuat', 10, 'DT-1', 'Cấp theo đơn thuốc số 1');

INSERT INTO hoa_don (id, phieu_kham_id, benh_nhan_id, ngay_lap, chi_phi_kham, tien_thuoc, tong_tien, phuong_thuc_thanh_toan, trang_thai_thanh_toan, thoi_gian_thanh_toan) VALUES
    ('HD0001', 1, 1, CURRENT_DATE - 2, 150000, 75000, 225000, 'Chuyen khoan', 'Da thanh toan', CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO thanh_toan (hoa_don_id, so_tien, phuong_thuc_thanh_toan, ma_giao_dich, trang_thai, thoi_gian_thanh_toan) VALUES
    ('HD0001', 225000, 'Chuyen khoan', 'GD-DEMO-0001', 'Thanh cong', CURRENT_TIMESTAMP - INTERVAL '2 days');

INSERT INTO thong_bao (tai_khoan_id, lich_hen_id, loai, kenh, tieu_de, noi_dung, trang_thai, thoi_gian_du_kien_gui) VALUES
    ('30000000-0000-0000-0000-000000000002', 2, 'Nhac lich', 'Ung dung', 'Nhắc lịch khám', 'Bạn có lịch khám vào ngày mai lúc 14:00.', 'Cho gui', CURRENT_TIMESTAMP + INTERVAL '1 hour'),
    ('30000000-0000-0000-0000-000000000003', 3, 'Xac nhan', 'Email', 'Đặt lịch thành công', 'Lịch khám tim mạch của bạn đã được xác nhận.', 'Da gui', CURRENT_TIMESTAMP - INTERVAL '1 hour');

INSERT INTO nhat_ky_hoat_dong (tai_khoan_id, hanh_dong, loai_doi_tuong, doi_tuong_id, du_lieu_moi) VALUES
    ('10000000-0000-0000-0000-000000000001', 'TAO_TAI_KHOAN', 'TaiKhoan', 'bs3', '{"vaiTro":"BacSi"}'),
    ('30000000-0000-0000-0000-000000000001', 'DAT_LICH', 'LichHen', '1', '{"trangThai":"Cho kham"}'),
    ('20000000-0000-0000-0000-000000000001', 'HOAN_THANH_KHAM', 'PhieuKham', '1', '{"ketLuan":"Viêm mũi họng cấp"}');

INSERT INTO chi_so_thong_ke (loai_chi_so, du_lieu_thong_ke) VALUES
    ('tong_quan', '{"tongBenhNhan":4,"tongBacSi":3,"tongLichHen":4}'),
    ('doanh_thu_ngay', '{"tongTien":225000,"soHoaDon":1}'),
    ('lich_hen_theo_trang_thai', '{"choKham":3,"daKham":1,"huy":0}');

SELECT setval(pg_get_serial_sequence('quan_ly', 'id'), COALESCE(MAX(id), 1), TRUE) FROM quan_ly;
SELECT setval(pg_get_serial_sequence('bac_si', 'id'), COALESCE(MAX(id), 1), TRUE) FROM bac_si;
SELECT setval(pg_get_serial_sequence('benh_nhan', 'id'), COALESCE(MAX(id), 1), TRUE) FROM benh_nhan;
SELECT setval(pg_get_serial_sequence('chuyen_khoa', 'id'), COALESCE(MAX(id), 1), TRUE) FROM chuyen_khoa;
SELECT setval(pg_get_serial_sequence('lich_hen', 'id'), COALESCE(MAX(id), 1), TRUE) FROM lich_hen;
SELECT setval(pg_get_serial_sequence('phieu_kham', 'id'), COALESCE(MAX(id), 1), TRUE) FROM phieu_kham;
SELECT setval(pg_get_serial_sequence('danh_muc_ten_benh', 'id'), COALESCE(MAX(id), 1), TRUE) FROM danh_muc_ten_benh;
SELECT setval(pg_get_serial_sequence('thuoc', 'id'), COALESCE(MAX(id), 1), TRUE) FROM thuoc;
SELECT setval(pg_get_serial_sequence('don_thuoc', 'id'), COALESCE(MAX(id), 1), TRUE) FROM don_thuoc;

COMMIT;
