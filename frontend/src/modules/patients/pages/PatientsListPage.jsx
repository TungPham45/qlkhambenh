import {
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "../../../components/common/Modal.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { formatDate } from "../../../utils/formatters.js";
import { PatientForm } from "../components/PatientForm.jsx";
import { usePatients } from "../hooks/usePatients.js";
import { listPatients } from "../services/patientApi.js";

const initialFilters = { search: "", gender: "all", status: "all" };

function getAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age -= 1;
  return age;
}

function getInitials(name) {
  return String(name || "BN").split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
}

function formatPatientCode(id) {
  return `BN-${String(id).padStart(5, "0")}`;
}

function escapeXml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function downloadPatientWorkbook(rows) {
  const columns = [
    ["Mã BN", (row) => formatPatientCode(row.MaBN)],
    ["Họ và tên", (row) => row.HoTen],
    ["Số điện thoại", (row) => row.SoDienThoai],
    ["Ngày sinh", (row) => formatDate(row.NgaySinh)],
    ["Giới tính", (row) => row.GioiTinh === "Nu" ? "Nữ" : row.GioiTinh],
    ["Email", (row) => row.Email],
    ["Số BHYT", (row) => row.SoBaoHiemYTe],
    ["Địa chỉ", (row) => row.DiaChi],
    ["Trạng thái", (row) => row.TrangThai === "Active" ? "Đang hoạt động" : "Ngừng hoạt động"],
  ];
  const header = columns.map(([label]) => `<Cell><Data ss:Type="String">${escapeXml(label)}</Data></Cell>`).join("");
  const body = rows.map((row) => `<Row>${columns.map(([, getValue]) => `<Cell><Data ss:Type="String">${escapeXml(getValue(row))}</Data></Cell>`).join("")}</Row>`).join("");
  const workbook = `<?xml version="1.0" encoding="UTF-8"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Benh nhan"><Table><Row>${header}</Row>${body}</Table></Worksheet></Workbook>`;
  const url = URL.createObjectURL(new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `danh-sach-benh-nhan-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PatientsListPage() {
  const { user } = useAuth();
  const { rows, pagination, summary, loading, error, query, load, save, remove } = usePatients();
  const { notify } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  const canManagePatients = role === "admin";
  const totalPages = Math.max(1, pagination?.total_pages || 1);
  const currentPage = pagination?.page || query.page || 1;
  const visiblePages = useMemo(() => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: Math.min(5, totalPages) }, (_, index) => start + index);
  }, [currentPage, totalPages]);

  function openCreate() {
    if (!canManagePatients) return;
    setSelected(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    if (!canManagePatients) return;
    setSelected(row);
    setModalOpen(true);
  }

  function buildQuery(overrides = {}) {
    const nextFilters = { ...filters, ...overrides };
    return {
      ...query,
      page: 1,
      search: nextFilters.search.trim(),
      gender: nextFilters.gender,
      status: nextFilters.status,
    };
  }

  function submitSearch(event) {
    event.preventDefault();
    load(buildQuery());
  }

  function changeFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
    load(buildQuery({ [name]: value }));
  }

  async function handleSave(payload) {
    if (!canManagePatients) return;
    setSaving(true);
    try {
      await save(payload);
      notify(selected ? "Đã cập nhật bệnh nhân" : "Đã thêm bệnh nhân");
      setModalOpen(false);
    } catch (caught) {
      notify(caught.message || "Không thể lưu bệnh nhân", "error");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !canManagePatients) return;
    try {
      await remove(deleteTarget.MaBN);
      notify("Đã xóa bệnh nhân");
      setDeleteTarget(null);
    } catch (caught) {
      notify(caught.message || "Không thể xóa bệnh nhân", "error");
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      const result = await listPatients({ ...buildQuery(), page: 1, limit: 10000 });
      downloadPatientWorkbook(result.rows);
      notify(`Đã xuất ${result.rows.length} bệnh nhân`);
    } catch (caught) {
      notify(caught.message || "Không thể xuất danh sách", "error");
    } finally {
      setExporting(false);
    }
  }

  const firstItem = pagination?.total ? (currentPage - 1) * pagination.limit + 1 : 0;
  const lastItem = pagination?.total ? Math.min(currentPage * pagination.limit, pagination.total) : 0;

  return (
    <div className="patient-admin-page">
      <header className="patient-page-heading">
        <div><h1>Quản Lý Danh Sách Bệnh Nhân</h1><p>Tra cứu hồ sơ bệnh nhân, quản lý thông tin hành chính và lịch sử khám chữa bệnh.</p></div>
        <div className="patient-summary-grid">
          <article><span className="is-blue"><UsersRound size={21} /></span><div><small>Tổng số</small><strong>{summary?.totalPatients ?? pagination?.total ?? 0}</strong><em>Bệnh nhân</em></div></article>
          <article><span className="is-green"><UserCheck size={21} /></span><div><small>Đang hoạt động</small><strong>{summary?.activePatients ?? 0}</strong><em>Hồ sơ</em></div></article>
          <article><span className="is-orange"><CalendarPlus size={21} /></span><div><small>Mới hôm nay</small><strong>{summary?.createdToday ?? 0}</strong><em>Bệnh nhân</em></div></article>
        </div>
      </header>

      {error ? <div className="patient-error">{error.message}</div> : null}

      <section className="patient-table-card">
        <div className="patient-toolbar">
          <form className="patient-search" onSubmit={submitSearch}>
            <Search size={19} />
            <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Tìm theo mã BN, họ tên, số điện thoại, địa chỉ..." />
          </form>
          <select value={filters.gender} onChange={(event) => changeFilter("gender", event.target.value)} aria-label="Lọc giới tính">
            <option value="all">Tất cả giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option>
          </select>
          <select value={filters.status} onChange={(event) => changeFilter("status", event.target.value)} aria-label="Lọc trạng thái">
            <option value="all">Tất cả trạng thái</option><option value="Active">Đang hoạt động</option><option value="Inactive">Ngừng hoạt động</option>
          </select>
          <div className="patient-toolbar-actions">
            <button className="patient-export-button" type="button" onClick={handleExport} disabled={exporting}><Download size={17} />{exporting ? "Đang xuất..." : "Xuất Excel"}</button>
            {canManagePatients ? <button className="patient-add-button" type="button" onClick={openCreate}><Plus size={18} />Thêm mới bệnh nhân</button> : null}
          </div>
        </div>

        <div className="patient-table-scroll">
          <table className="patient-table">
            <thead><tr><th>Mã BN</th><th>Họ và tên</th><th>Số điện thoại</th><th>Ngày sinh</th><th>Giới tính</th><th>Địa chỉ</th><th>Trạng thái</th>{canManagePatients ? <th aria-label="Thao tác" /> : null}</tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={canManagePatients ? 8 : 7} className="patient-table-message">Đang tải danh sách bệnh nhân...</td></tr> : null}
              {!loading && rows.length === 0 ? <tr><td colSpan={canManagePatients ? 8 : 7} className="patient-table-message">Không tìm thấy bệnh nhân phù hợp.</td></tr> : null}
              {!loading ? rows.map((row) => {
                const age = getAge(row.NgaySinh);
                return (
                  <tr key={row.MaBN}>
                    <td><span className="patient-code">{formatPatientCode(row.MaBN)}</span></td>
                    <td><div className="patient-identity"><span>{getInitials(row.HoTen)}</span><div><strong>{row.HoTen}</strong>{row.SoBaoHiemYTe ? <small>BHYT: {row.SoBaoHiemYTe}</small> : <small>Chưa có BHYT</small>}</div></div></td>
                    <td className="patient-nowrap">{row.SoDienThoai || "-"}</td>
                    <td className="patient-nowrap"><strong className="patient-date">{formatDate(row.NgaySinh)}</strong>{age !== null ? <small className="patient-age">{age} tuổi</small> : null}</td>
                    <td><span className={`patient-gender ${row.GioiTinh === "Nu" ? "is-female" : "is-male"}`}>{row.GioiTinh === "Nu" ? "Nữ" : row.GioiTinh || "Khác"}</span></td>
                    <td><span className="patient-address" title={row.DiaChi}>{row.DiaChi || "-"}</span></td>
                    <td><span className={`patient-status ${row.TrangThai === "Active" ? "is-active" : "is-inactive"}`}>{row.TrangThai === "Active" ? "Hoạt động" : "Ngừng"}</span></td>
                    {canManagePatients ? <td><div className="patient-row-actions"><button type="button" aria-label={`Sửa ${row.HoTen}`} onClick={() => openEdit(row)}><Edit3 size={16} /></button><button className="is-delete" type="button" aria-label={`Xóa ${row.HoTen}`} onClick={() => setDeleteTarget(row)}><Trash2 size={16} /></button></div></td> : null}
                  </tr>
                );
              }) : null}
            </tbody>
          </table>
        </div>

        <footer className="patient-pagination">
          <span>Hiển thị <strong>{firstItem} - {lastItem}</strong> trên tổng số <strong>{pagination?.total || 0}</strong> bệnh nhân</span>
          <nav aria-label="Phân trang bệnh nhân">
            <button type="button" disabled={currentPage <= 1} onClick={() => load({ ...query, page: currentPage - 1 })}><ChevronLeft size={15} /> Trước</button>
            {visiblePages.map((page) => <button type="button" key={page} className={page === currentPage ? "is-current" : ""} onClick={() => load({ ...query, page })}>{page}</button>)}
            <button type="button" disabled={currentPage >= totalPages} onClick={() => load({ ...query, page: currentPage + 1 })}>Sau <ChevronRight size={15} /></button>
          </nav>
        </footer>
      </section>

      {canManagePatients ? <Modal title={selected ? "Cập nhật bệnh nhân" : "Thêm mới bệnh nhân"} open={modalOpen} onClose={() => setModalOpen(false)}><PatientForm initialValue={selected} saving={saving} onSubmit={handleSave} onCancel={() => setModalOpen(false)} /></Modal> : null}
      <Modal title="Xác nhận xóa bệnh nhân" open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <div className="patient-delete-confirm"><p>Bạn có chắc chắn muốn xóa hồ sơ của <strong>{deleteTarget?.HoTen}</strong> không?</p><small>Thao tác này không thể hoàn tác.</small><div><button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>Không, giữ lại</button><button className="btn-danger" type="button" onClick={confirmDelete}><Trash2 size={16} />Có, xóa bệnh nhân</button></div></div>
      </Modal>
    </div>
  );
}
