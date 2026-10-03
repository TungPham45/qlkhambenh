CREATE DATABASE IF NOT EXISTS qlphongkham CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE qlphongkham;

CREATE TABLE IF NOT EXISTS tai_khoan (
    TenDangNhap VARCHAR(50) PRIMARY KEY,
    MatKhau VARCHAR(255) NOT NULL,
    VaiTro VARCHAR(50) NOT NULL,
    TrangThai VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS nhan_vien (
    MaNV INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100),
    NgaySinh DATE NULL,
    GioiTinh VARCHAR(10),
    SoDienThoai VARCHAR(15),
    ChuyenKhoa VARCHAR(100),
    TenDangNhap VARCHAR(50) UNIQUE,
    CONSTRAINT fk_nv_tk FOREIGN KEY (TenDangNhap) REFERENCES tai_khoan(TenDangNhap) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS benh_nhan (
    MaBN INT AUTO_INCREMENT PRIMARY KEY,
    HoTen VARCHAR(100),
    NgaySinh DATE NULL,
    GioiTinh VARCHAR(10),
    SoDienThoai VARCHAR(15),
    DiaChi VARCHAR(255),
    TienSuBenh TEXT,
    TenDangNhap VARCHAR(50) UNIQUE,
    CONSTRAINT fk_bn_tk FOREIGN KEY (TenDangNhap) REFERENCES tai_khoan(TenDangNhap) ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS lich_kham (
    MaLich INT AUTO_INCREMENT PRIMARY KEY,
    MaBN INT,
    MaBacSi INT,
    NgayKham DATE,
    GioKham TIME,
    TrangThai VARCHAR(50),
    CONSTRAINT fk_lk_bn FOREIGN KEY (MaBN) REFERENCES benh_nhan(MaBN) ON DELETE CASCADE,
    CONSTRAINT fk_lk_bs FOREIGN KEY (MaBacSi) REFERENCES nhan_vien(MaNV) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS phieu_kham (
    MaPhieu INT AUTO_INCREMENT PRIMARY KEY,
    MaLich INT UNIQUE,
    TrieuChung TEXT,
    ChanDoan TEXT,
    NgayKham DATE,
    KetLuan TEXT,
    CONSTRAINT fk_pk_lk FOREIGN KEY (MaLich) REFERENCES lich_kham(MaLich) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS thuoc (
    MaThuoc INT AUTO_INCREMENT PRIMARY KEY,
    TenThuoc VARCHAR(100),
    DonViTinh VARCHAR(50),
    DonGia FLOAT,
    SoLuongTon INT,
    NgayHetHan DATE
);

CREATE TABLE IF NOT EXISTS don_thuoc (
    MaDon INT AUTO_INCREMENT PRIMARY KEY,
    MaPhieu INT UNIQUE,
    NgayKeDon DATE,
    GhiChu TEXT,
    CONSTRAINT fk_dt_pk FOREIGN KEY (MaPhieu) REFERENCES phieu_kham(MaPhieu) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_don_thuoc (
    MaDon INT,
    MaThuoc INT,
    SoLuong INT,
    LieuDung VARCHAR(255),
    PRIMARY KEY (MaDon, MaThuoc),
    CONSTRAINT fk_ctdt_dt FOREIGN KEY (MaDon) REFERENCES don_thuoc(MaDon) ON DELETE CASCADE,
    CONSTRAINT fk_ctdt_t FOREIGN KEY (MaThuoc) REFERENCES thuoc(MaThuoc) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hoa_don (
    MaHoaDon VARCHAR(20) PRIMARY KEY,
    MaPhieu INT UNIQUE,
    NgayLap DATE,
    TongTien DECIMAL(12,2),
    PhuongThucTT VARCHAR(50),
    TrangThai VARCHAR(50),
    CONSTRAINT fk_hd_pk FOREIGN KEY (MaPhieu) REFERENCES phieu_kham(MaPhieu) ON DELETE CASCADE
);

INSERT INTO tai_khoan (TenDangNhap, MatKhau, VaiTro, TrangThai) VALUES
('admin','123456','Admin','Active'),
('bs1','123456','BacSi','Active'),
('bs2','123456','BacSi','Active'),
('bn1','123456','NguoiDung','Active'),
('bn2','123456','NguoiDung','Active')
ON DUPLICATE KEY UPDATE VaiTro = VALUES(VaiTro), MatKhau = VALUES(MatKhau), TrangThai = VALUES(TrangThai);

INSERT INTO nhan_vien (MaNV, HoTen, NgaySinh, GioiTinh, SoDienThoai, ChuyenKhoa, TenDangNhap) VALUES
(1, 'Nguyen Van A', '1985-05-10', 'Nam', '0901111111', 'Tim mach', 'bs1'),
(2, 'Tran Thi B', '1990-08-20', 'Nu', '0902222222', 'Nhi khoa', 'bs2')
ON DUPLICATE KEY UPDATE HoTen = VALUES(HoTen), ChuyenKhoa = VALUES(ChuyenKhoa), TenDangNhap = VALUES(TenDangNhap);

INSERT INTO benh_nhan (MaBN, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, TienSuBenh, TenDangNhap) VALUES
(1, 'Le Van C', '2000-01-01', 'Nam', '0911111111', 'Ha Noi', 'Khong', 'bn1'),
(2, 'Pham Thi D', '1995-03-15', 'Nu', '0922222222', 'Ha Noi', 'Hen suyen', 'bn2')
ON DUPLICATE KEY UPDATE HoTen = VALUES(HoTen), SoDienThoai = VALUES(SoDienThoai), TenDangNhap = VALUES(TenDangNhap);

INSERT INTO lich_kham (MaLich, MaBN, MaBacSi, NgayKham, GioKham, TrangThai) VALUES
(1, 1, 1, '2026-04-10', '08:00:00', 'Da kham'),
(2, 2, 2, '2026-04-11', '09:00:00', 'Da kham')
ON DUPLICATE KEY UPDATE TrangThai = VALUES(TrangThai), NgayKham = VALUES(NgayKham), GioKham = VALUES(GioKham);

INSERT INTO phieu_kham (MaPhieu, MaLich, TrieuChung, ChanDoan, NgayKham, KetLuan) VALUES
(1, 1, 'Dau nguc', 'Viem phoi', '2026-04-10', 'Uong thuoc theo don'),
(2, 2, 'Ho, sot', 'Cam cum', '2026-04-11', 'Nghi ngoi')
ON DUPLICATE KEY UPDATE ChanDoan = VALUES(ChanDoan), KetLuan = VALUES(KetLuan), NgayKham = VALUES(NgayKham);

INSERT INTO thuoc (MaThuoc, TenThuoc, DonViTinh, DonGia, SoLuongTon, NgayHetHan) VALUES
(1, 'Paracetamol', 'Vien', 5000, 100, '2027-01-01'),
(2, 'Amoxicillin', 'Vien', 8000, 50, '2026-12-01')
ON DUPLICATE KEY UPDATE TenThuoc = VALUES(TenThuoc), DonGia = VALUES(DonGia), SoLuongTon = VALUES(SoLuongTon);

INSERT INTO don_thuoc (MaDon, MaPhieu, NgayKeDon, GhiChu) VALUES
(1, 1, '2026-04-10', 'Sau an'),
(2, 2, '2026-04-11', 'Ngay 2 lan')
ON DUPLICATE KEY UPDATE NgayKeDon = VALUES(NgayKeDon), GhiChu = VALUES(GhiChu);

INSERT INTO chi_tiet_don_thuoc (MaDon, MaThuoc, SoLuong, LieuDung) VALUES
(1, 1, 10, '2 vien/ngay'),
(1, 2, 5, '1 vien/ngay'),
(2, 1, 7, '1 vien/ngay')
ON DUPLICATE KEY UPDATE SoLuong = VALUES(SoLuong), LieuDung = VALUES(LieuDung);

INSERT INTO hoa_don (MaHoaDon, MaPhieu, NgayLap, TongTien, PhuongThucTT, TrangThai) VALUES
('HD001', 1, '2026-04-10', 150000, 'Tien mat', 'Da thanh toan'),
('HD002', 2, '2026-04-11', 90000, 'Chuyen khoan', 'Chua thanh toan')
ON DUPLICATE KEY UPDATE TongTien = VALUES(TongTien), PhuongThucTT = VALUES(PhuongThucTT), TrangThai = VALUES(TrangThai);
