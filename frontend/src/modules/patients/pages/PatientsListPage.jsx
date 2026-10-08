import { Download, Edit3, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";

import { Modal } from "../../../components/common/Modal.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { formatDate } from "../../../utils/formatters.js";

import { PatientForm } from "../components/PatientForm.jsx";
import { usePatients } from "../hooks/usePatients.js";
import { AdminPagination } from "../../admin/AdminPagination.jsx";

export function PatientsListPage() {
  const { user } = useAuth();
  const { rows, pagination, loading, error, query, load, save, remove } = usePatients();
  const { notify } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");

  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  const canManagePatients = role === "admin";
  const canEditPatients = canManagePatients;
  const canDeletePatients = canManagePatients;

  function openCreate() {
    if (!canManagePatients) return;
    setSelected(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    if (!canEditPatients) return;
    setSelected(row);
    setModalOpen(true);
  }

  async function handleSave(payload) {
    if (!canEditPatients) return;

    setSaving(true);
    try {
      await save(payload);
      notify("Đã lưu bệnh nhân");
      setModalOpen(false);
    } catch (caught) {
      notify(caught.message || "Không thể lưu bệnh nhân", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (!canDeletePatients) return;

    if (!window.confirm(`Xóa bệnh nhân ${row.HoTen}?`)) return;

    try {
      await remove(row.MaBN);
      notify("Đã xóa bệnh nhân");
    } catch (caught) {
      notify(caught.message || "Không thể xóa bệnh nhân", "error");
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    load({ ...query, page: 1, search: search.trim(), gender, status });
  }

  function exportExcel() {
    const headers = ["Mã BN", "Họ và tên", "Số điện thoại", "Ngày sinh", "Giới tính", "Địa chỉ", "Email", "Trạng thái"];
    const data = rows.map((row) => [row.MaBN, row.HoTen, row.SoDienThoai, row.NgaySinh, row.GioiTinh, row.DiaChi, row.Email, row.TrangThai]);
    const csv = [headers, ...data].map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "danh-sach-benh-nhan.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head"><div><h1>Quản Lý Danh Sách Bệnh Nhân</h1><p>Tra cứu hồ sơ bệnh nhân, quản lý thông tin hành chính và tài khoản đăng nhập.</p></div><div className="admin-summary"><div className="admin-summary-card"><span className="admin-summary-icon"><Users size={20} /></span><span><small>Tổng số bệnh nhân</small><strong>{(pagination?.total ?? rows.length).toLocaleString("vi-VN")}</strong></span></div></div></div>

      {error ? (
        <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error.message}
        </div>
      ) : null}

      <section className="admin-panel">
        <form className="admin-filters" onSubmit={handleSearch}><label className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm theo mã BN, họ tên, số điện thoại" /></label><select className="admin-filter-select" value={gender} onChange={(event) => setGender(event.target.value)}><option value="">Tất cả giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option></select><select className="admin-filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Tất cả trạng thái</option><option value="Active">Hoạt động</option><option value="Inactive">Ngừng hoạt động</option></select><button className="admin-excel-button" type="submit"><Search size={17} /> Tìm kiếm</button><button className="admin-excel-button" type="button" onClick={exportExcel}><Download size={17} /> Xuất Excel</button>{canManagePatients ? <button className="admin-add-button" type="button" onClick={openCreate}><Plus size={17} /> Thêm mới bệnh nhân</button> : null}</form>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Mã BN</th><th>Họ và tên</th><th>Số điện thoại</th><th>Ngày sinh</th><th>Giới tính</th><th>Địa chỉ</th><th>Trạng thái</th>{canManagePatients ? <th /> : null}</tr></thead><tbody>{loading ? <tr><td className="admin-empty" colSpan="8">Đang tải dữ liệu...</td></tr> : rows.length ? rows.map((row) => <tr key={row.MaBN}><td><span className="admin-code">BN-{String(row.MaBN).padStart(5, "0")}</span></td><td><span className="admin-name-cell"><strong>{row.HoTen}</strong><small>{row.Email || row.TenDangNhap || "-"}</small></span></td><td>{row.SoDienThoai || "-"}</td><td>{formatDate(row.NgaySinh)}</td><td><span className={`admin-gender ${row.GioiTinh === "Nu" ? "admin-gender-female" : ""}`}>{row.GioiTinh === "Nu" ? "Nữ" : row.GioiTinh}</span></td><td>{row.DiaChi || "-"}</td><td><span className="admin-status">{row.TrangThai === "Inactive" ? "Ngừng hoạt động" : "Hoạt động"}</span></td>{canManagePatients ? <td><div className="admin-row-actions"><button className="admin-action" type="button" title="Sửa" onClick={() => openEdit(row)}><Edit3 size={16} /></button><button className="admin-action admin-action-danger" type="button" title="Xóa" onClick={() => handleDelete(row)}><Trash2 size={16} /></button></div></td> : null}</tr>) : <tr><td className="admin-empty" colSpan="8">Không có bệnh nhân</td></tr>}</tbody></table></div>
        {pagination ? <AdminPagination page={query.page} limit={query.limit} total={pagination.total} totalPages={pagination.total_pages} itemLabel="bệnh nhân" onPageChange={(page) => load({ ...query, page })} /> : null}
      </section>

      {canManagePatients ? (
        <Modal
          title={selected ? "Cập nhật bệnh nhân" : "Thêm bệnh nhân"}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <PatientForm
            initialValue={selected}
            saving={saving}
            onSubmit={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}
