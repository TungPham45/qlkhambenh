import { formatCurrency, formatDate } from "../../utils/formatters.js";

const today = new Date().toISOString().slice(0, 10);

export const genderOptions = [
  { value: "Nam", label: "Nam" },
  { value: "Nu", label: "Nữ" }
];

export const appointmentStatusOptions = [
  { value: "Cho kham", label: "Chờ khám" },
  { value: "Dang kham", label: "Đang khám" },
  { value: "Da kham", label: "Đã khám" },
  { value: "Huy", label: "Hủy" }
];

export const billingStatusOptions = [
  { value: "Chua thanh toan", label: "Chưa thanh toán" },
  { value: "Da thanh toan", label: "Đã thanh toán" }
];

export const paymentOptions = [
  { value: "Tien mat", label: "Tiền mặt" },
  { value: "Chuyen khoan", label: "Chuyển khoản" }
];

export const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "BacSi", label: "Bác sĩ" },
  { value: "NguoiDung", label: "Người dùng" }
];

export const accountStatusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" }
];

export const specialtyOptions = [
  { value: "Khoa nhi", label: "Khoa nhi" },
  { value: "Tai mui hong", label: "Tai mũi họng" },
  { value: "Khoa xet nghiem", label: "Khoa xét nghiệm" },
  { value: "Khoa mat", label: "Khoa mắt" }
];

export const lookupConfigs = {
  patients: {
    endpoint: "/patients",
    key: "MaBN",
    label: (row) => `${row.HoTen || "Bệnh nhân"} (#${row.MaBN})`
  },
  staff: {
    endpoint: "/admin/staff",
    key: "MaNV",
    label: (row) => `${row.HoTen || "Nhân viên"}${row.ChuyenKhoa ? ` - ${row.ChuyenKhoa}` : ""}`
  },
  appointments: {
    endpoint: "/appointments",
    key: "MaLich",
    label: (row) => `#${row.MaLich} - BN ${row.MaBN} - BS ${row.MaBacSi}`
  },
  records: {
    endpoint: "/medical-records",
    workflow: "medicalRecord",
    key: "MaPhieu",
    label: (row) => `#${row.MaPhieu} - Lịch ${row.MaLich}`
  },
  drugs: {
    endpoint: "/drugs",
    key: "MaThuoc",
    label: (row) => `${row.TenThuoc || "Thuốc"} (#${row.MaThuoc})`
  }
};

function optionLabel(options, value) {
  return options.find((item) => String(item.value) === String(value))?.label || value || "-";
}

function truncate(value, max = 70) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max)}...` : text || "-";
}

export const resourceConfigs = {
  appointments: {
    title: "Lịch khám",
    endpoint: "/appointments",
    pk: "MaLich",
    lookups: ["patients", "staff"],
    columns: [
      { key: "MaLich", header: "Mã lịch" },
      { key: "MaBN", header: "Bệnh nhân", lookup: "patients" },
      { key: "MaBacSi", header: "Bác sĩ", lookup: "staff" },
      { key: "NgayKham", header: "Ngày khám", render: (row) => formatDate(row.NgayKham) },
      { key: "GioKham", header: "Giờ khám" },
      { key: "TrangThai", header: "Trạng thái", render: (row) => optionLabel(appointmentStatusOptions, row.TrangThai) }
    ],
    fields: [
      { name: "MaBN", label: "Bệnh nhân", type: "select", lookup: "patients", required: true },
      { name: "MaBacSi", label: "Bác sĩ", type: "select", lookup: "staff", required: true },
      { name: "NgayKham", label: "Ngày khám", type: "date", required: true },
      { name: "GioKham", label: "Giờ khám", type: "time", required: true },
      { name: "TrangThai", label: "Trạng thái", type: "select", options: appointmentStatusOptions, default: "Cho kham" }
    ]
  },
  records: {
    title: "Phiếu khám",
    endpoint: "/medical-records",
    workflow: "medicalRecord",
    pk: "MaPhieu",
    searchPlaceholder: "Tìm theo mã phiếu, mã bệnh nhân, họ tên, số điện thoại hoặc chẩn đoán",
    lookups: ["appointments"],
    columns: [
      { key: "MaPhieu", header: "Mã phiếu" },
      { key: "MaLich", header: "Lịch khám", lookup: "appointments" },
      { key: "NgayKham", header: "Ngày khám", render: (row) => formatDate(row.NgayKham) },
      { key: "TrieuChung", header: "Triệu chứng", render: (row) => truncate(row.TrieuChung) },
      { key: "ChanDoan", header: "Chẩn đoán", render: (row) => truncate(row.ChanDoan) }
    ],
    fields: [
      { name: "MaLich", label: "Lịch khám", type: "select", lookup: "appointments", required: true },
      { name: "NgayKham", label: "Ngày khám", type: "date", default: today, required: true },
      { name: "TrieuChung", label: "Triệu chứng", type: "textarea" },
      { name: "ChanDoan", label: "Chẩn đoán", type: "textarea" },
      { name: "KetLuan", label: "Kết luận", type: "textarea" }
    ],
    canDelete: false,
    toApiPayload: (payload) => ({
      MaPhieu: payload.MaPhieu,
      appointmentId: Number(payload.MaLich),
      patientId: Number(payload.MaBN),
      doctorId: Number(payload.MaBacSi),
      examinationDate: payload.NgayKham || undefined,
      symptoms: payload.TrieuChung || undefined,
      diagnosis: payload.ChanDoan || undefined,
      conclusion: payload.KetLuan || undefined,
    })
  },
  billings: {
    title: "Hóa đơn",
    endpoint: "/billings",
    workflow: "billing",
    pk: "MaHoaDon",
    lookups: ["records"],
    editPath: (id) => `/billings/${encodeURIComponent(id)}/status`,
    editMethod: "PATCH",
    columns: [
      { key: "MaHoaDon", header: "Mã hóa đơn" },
      { key: "MaPhieu", header: "Phiếu khám", lookup: "records" },
      { key: "NgayLap", header: "Ngày lập", render: (row) => formatDate(row.NgayLap) },
      { key: "TongTien", header: "Tổng tiền", render: (row) => formatCurrency(row.TongTien) },
      { key: "PhuongThucTT", header: "Thanh toán", render: (row) => optionLabel(paymentOptions, row.PhuongThucTT) },
      { key: "TrangThai", header: "Trạng thái", render: (row) => optionLabel(billingStatusOptions, row.TrangThai) }
    ],
    fields: [
      { name: "MaHoaDon", label: "Mã hóa đơn", type: "text" },
      { name: "MaPhieu", label: "Phiếu khám", type: "select", lookup: "records", required: true },
      { name: "NgayLap", label: "Ngày lập", type: "date", default: today },
      { name: "TongTien", label: "Tổng tiền", type: "number", step: "0.01" },
      { name: "PhuongThucTT", label: "Thanh toán", type: "select", options: paymentOptions, default: "Tien mat" },
      { name: "TrangThai", label: "Trạng thái", type: "select", options: billingStatusOptions, default: "Chua thanh toan" }
    ],
    editFields: [
      { name: "PhuongThucTT", label: "Thanh toán", type: "select", options: paymentOptions },
      { name: "TrangThai", label: "Trạng thái", type: "select", options: billingStatusOptions }
    ],
    canDelete: false
  },
  drugs: {
    title: "Thuốc",
    endpoint: "/drugs",
    pk: "MaThuoc",
    searchPlaceholder: "Tìm theo mã hoặc tên thuốc",
    columns: [
      { key: "MaThuoc", header: "Mã thuốc" },
      { key: "TenThuoc", header: "Tên thuốc" },
      { key: "DonViTinh", header: "Đơn vị" },
      { key: "DonGia", header: "Đơn giá", render: (row) => formatCurrency(row.DonGia) },
      { key: "SoLuongTon", header: "Tồn kho" },
      { key: "NgayHetHan", header: "Hạn dùng", render: (row) => formatDate(row.NgayHetHan) }
    ],
    fields: [
      { name: "TenThuoc", label: "Tên thuốc", type: "text", required: true },
      { name: "DonViTinh", label: "Đơn vị tính", type: "text", required: true },
      { name: "DonGia", label: "Đơn giá", type: "number", step: "0.01", required: true },
      { name: "SoLuongTon", label: "Tồn kho", type: "number", step: "1", required: true },
      { name: "NgayHetHan", label: "Ngày hết hạn", type: "date" }
    ],
    toApiPayload: (payload) => ({
      MaThuoc: payload.MaThuoc,
      drugName: payload.TenThuoc,
      unit: payload.DonViTinh,
      unitPrice: Number(payload.DonGia),
      stockQuantity: Number(payload.SoLuongTon),
      expiryDate: payload.NgayHetHan || undefined,
    })
  },
  prescriptions: {
    title: "Đơn thuốc",
    endpoint: "/prescriptions",
    workflow: "prescription",
    pk: "MaDon",
    lookups: ["records", "drugs"],
    columns: [
      { key: "MaDon", header: "Mã đơn" },
      { key: "MaPhieu", header: "Phiếu khám", lookup: "records" },
      { key: "NgayKeDon", header: "Ngày kê", render: (row) => formatDate(row.NgayKeDon) },
      { key: "GhiChu", header: "Ghi chú", render: (row) => truncate(row.GhiChu) }
    ],
    fields: [
      { name: "MaPhieu", label: "Phiếu khám", type: "select", lookup: "records", required: true },
      { name: "NgayKeDon", label: "Ngày kê đơn", type: "date", default: today, required: true },
      { name: "GhiChu", label: "Ghi chú", type: "textarea" }
    ],
    customForm: "prescription",
    canEdit: false,
    canDelete: false,
    toApiPayload: (payload) => ({
      medicalRecordId: Number(payload.MaPhieu),
      patientId: Number(payload.MaBN),
      doctorId: Number(payload.MaBacSi),
      prescriptionDate: payload.NgayKeDon || undefined,
      note: payload.GhiChu || undefined,
      items: (payload.ChiTiet || []).map((item) => ({
        drugId: Number(item.MaThuoc),
        quantity: Number(item.SoLuong),
        dosage: item.LieuDung,
      })),
    })
  },
  accounts: {
    title: "Tài khoản",
    endpoint: "/accounts",
    pk: "TenDangNhap",
    lookups: ["patients", "staff"],
    canCreate: true,
    canEdit: true,
    canDelete: true,
    columns: [
      { key: "TenDangNhap", header: "Tên đăng nhập" },
      { key: "VaiTro", header: "Vai trò", render: (row) => optionLabel(roleOptions, row.VaiTro) },
      { key: "TrangThai", header: "Trạng thái", render: (row) => optionLabel(accountStatusOptions, row.TrangThai) },
      { key: "MaBN", header: "Bệnh nhân", lookup: "patients" },
      { key: "MaNV", header: "Nhân viên", lookup: "staff" }
    ],
    fields: [
      { name: "TenDangNhap", label: "Tên đăng nhập", type: "text", required: true },
      { name: "MatKhau", label: "Mật khẩu", type: "password", required: true },
      { name: "VaiTro", label: "Vai trò", type: "select", options: roleOptions, required: true },
      { name: "TrangThai", label: "Trạng thái", type: "select", options: accountStatusOptions, default: "Active", required: true },
      { name: "MaBN", label: "Bệnh nhân", type: "select", lookup: "patients" },
      { name: "MaNV", label: "Nhân viên", type: "select", lookup: "staff" }
    ],
    editFields: [
      { name: "MatKhau", label: "Mật khẩu mới", type: "password" },
      { name: "VaiTro", label: "Vai trò", type: "select", options: roleOptions, required: true },
      { name: "TrangThai", label: "Trạng thái", type: "select", options: accountStatusOptions, required: true },
      { name: "MaBN", label: "Bệnh nhân", type: "select", lookup: "patients" },
      { name: "MaNV", label: "Nhân viên", type: "select", lookup: "staff" }
    ]
  },
  staff: {
    title: "Bác sĩ", pageTitle: "Quản Lý Danh Sách Bác Sĩ", description: "Quản lý hồ sơ bác sĩ, thông tin liên hệ và tài khoản đăng nhập.", itemLabel: "Bác sĩ", summaryLabel: "Tổng số bác sĩ", searchPlaceholder: "Tìm kiếm bác sĩ theo mã, họ tên, số điện thoại", exportName: "danh-sach-bac-si", endpoint: "/staff", limit: 4,
    pk: "MaNV",
    columns: [
      { key: "MaNV", header: "Mã NV" },
      { key: "HoTen", header: "Họ tên" },
      { key: "NgaySinh", header: "Ngày sinh", render: (row) => formatDate(row.NgaySinh) },
      { key: "GioiTinh", header: "Giới tính" },
      { key: "SoDienThoai", header: "SĐT" },
      { key: "ChuyenKhoa", header: "Bằng cấp" },
      { key: "TenDangNhap", header: "Tên đăng nhập" }
    ],
    fields: [
      { name: "fullName", label: "Họ tên", type: "text", required: true }, { name: "dateOfBirth", label: "Ngày sinh", type: "date" }, { name: "gender", label: "Giới tính", type: "select", options: genderOptions }, { name: "phone", label: "Số điện thoại", type: "text" }, { name: "specialty", label: "Bằng cấp", type: "text" }, { name: "username", label: "Tên đăng nhập", type: "text", required: true }, { name: "password", label: "Mật khẩu", type: "password", required: true }
    ],
    editFields: [
      { name: "fullName", label: "Họ tên", type: "text", required: true }, { name: "dateOfBirth", label: "Ngày sinh", type: "date" }, { name: "gender", label: "Giới tính", type: "select", options: genderOptions }, { name: "phone", label: "Số điện thoại", type: "text" }, { name: "specialty", label: "Bằng cấp", type: "text" }, { name: "username", label: "Tên đăng nhập", type: "text", required: true }
    ]
  },
  specialties: {
    title: "Chuyên khoa", pageTitle: "Quản Lý Danh Sách Chuyên Khoa", description: "Quản lý thông tin chuyên khoa và phân bổ bác sĩ trong bệnh viện.", itemLabel: "Chuyên khoa", summaryLabel: "Tổng số chuyên khoa", searchPlaceholder: "Tìm kiếm chuyên khoa theo mã hoặc tên", exportName: "danh-sach-chuyen-khoa", endpoint: "/specialties", pk: "MaChuyenKhoa",
    columns: [
      { key: "MaChuyenKhoa", header: "Mã CK", render: (row) => `CK-${String(row.MaChuyenKhoa).padStart(3, "0")}` }, { key: "TenChuyenKhoa", header: "Tên chuyên khoa" }, { key: "MoTa", header: "Mô tả" }, { key: "SoLuongBacSi", header: "Số lượng BS" }, { key: "TrangThai", header: "Trạng thái" }
    ],
    fields: [
      { name: "name", label: "Tên chuyên khoa", type: "text", required: true }, { name: "description", label: "Mô tả", type: "textarea" }, { name: "status", label: "Trạng thái", type: "select", options: accountStatusOptions, default: "Active" }
    ]
  }
};
