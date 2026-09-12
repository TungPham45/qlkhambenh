param(
    [string]$ProjectRoot = (Resolve-Path "$PSScriptRoot\..").Path
)

$ErrorActionPreference = "Stop"
$source = Join-Path $ProjectRoot "database\qlphongkham.sql"

if (-not (Test-Path $source)) {
    throw "Cannot find $source"
}

function Import-LegacyDb([string]$containerService) {
    Get-Content -Raw $source | docker compose exec -T $containerService mysql -uroot -proot
}

function Run-Sql([string]$containerService, [string]$sql) {
    $sql | docker compose exec -T $containerService mysql -uroot -proot
}

Push-Location $ProjectRoot
try {
    Import-LegacyDb "db_auth"
    Run-Sql "db_auth" @"
DELETE FROM db_auth.tai_khoan;
INSERT INTO db_auth.tai_khoan (TenDangNhap, MatKhau, VaiTro, TrangThai)
SELECT TenDangNhap, MatKhau, VaiTro, TrangThai FROM qlphongkham.tai_khoan;
"@

    Import-LegacyDb "db_patient"
    Run-Sql "db_patient" @"
DELETE FROM db_patient.benh_nhan;
INSERT INTO db_patient.benh_nhan (MaBN, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, TienSuBenh, TenDangNhap)
SELECT MaBN, HoTen, NgaySinh, GioiTinh, SoDienThoai, DiaChi, TienSuBenh, TenDangNhap FROM qlphongkham.benh_nhan;
"@

    Import-LegacyDb "db_account"
    Run-Sql "db_account" @"
DELETE FROM db_account.nhan_vien;
INSERT INTO db_account.nhan_vien (MaNV, HoTen, NgaySinh, GioiTinh, SoDienThoai, ChuyenKhoa, TenDangNhap)
SELECT MaNV, HoTen, NgaySinh, GioiTinh, SoDienThoai, ChuyenKhoa, TenDangNhap FROM qlphongkham.nhan_vien;
"@

    Import-LegacyDb "db_appointment"
    Run-Sql "db_appointment" @"
DELETE FROM db_appointment.lich_kham;
INSERT INTO db_appointment.lich_kham (MaLich, MaBN, MaBacSi, NgayKham, GioKham, TrangThai)
SELECT MaLich, MaBN, MaBacSi, NgayKham, GioKham, TrangThai FROM qlphongkham.lich_kham;
"@

    Import-LegacyDb "db_medical_record"
    Run-Sql "db_medical_record" @"
DELETE FROM db_medical_record.phieu_kham;
INSERT INTO db_medical_record.phieu_kham (MaPhieu, MaLich, TrieuChung, ChanDoan, NgayKham, KetLuan)
SELECT MaPhieu, MaLich, TrieuChung, ChanDoan, NgayKham, KetLuan FROM qlphongkham.phieu_kham;
"@

    Import-LegacyDb "db_billing"
    Run-Sql "db_billing" @"
DELETE FROM db_billing.hoa_don;
INSERT INTO db_billing.hoa_don (MaHoaDon, MaPhieu, NgayLap, TongTien, PhuongThucTT, TrangThai)
SELECT MaHoaDon, MaPhieu, NgayLap, TongTien, PhuongThucTT, TrangThai FROM qlphongkham.hoa_don;
"@

    Import-LegacyDb "db_pharmacy"
    Run-Sql "db_pharmacy" @"
DELETE FROM db_pharmacy.chi_tiet_don_thuoc;
DELETE FROM db_pharmacy.don_thuoc;
DELETE FROM db_pharmacy.thuoc;

INSERT INTO db_pharmacy.thuoc (MaThuoc, TenThuoc, DonViTinh, DonGia, SoLuongTon, NgayHetHan)
SELECT MaThuoc, TenThuoc, DonViTinh, DonGia, SoLuongTon, NgayHetHan FROM qlphongkham.thuoc;

INSERT INTO db_pharmacy.don_thuoc (MaDon, MaPhieu, NgayKeDon, GhiChu)
SELECT MaDon, MaPhieu, NgayKeDon, GhiChu FROM qlphongkham.don_thuoc;

INSERT INTO db_pharmacy.chi_tiet_don_thuoc (MaDon, MaThuoc, SoLuong, LieuDung)
SELECT MaDon, MaThuoc, SoLuong, LieuDung FROM qlphongkham.chi_tiet_don_thuoc;
"@
}
finally {
    Pop-Location
}
