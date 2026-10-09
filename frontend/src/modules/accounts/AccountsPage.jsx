import { Edit3, Search, Shield, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";
import { Modal } from "../../components/common/Modal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AdminPagination } from "../admin/AdminPagination.jsx";

const roles = { Admin: "Quản trị viên", BacSi: "Bác sĩ", NguoiDung: "Bệnh nhân" };
const statuses = { Active: "Đang hoạt động", Inactive: "Ngừng hoạt động", Locked: "Đã khóa" };

export function AccountsPage() {
  const { role } = useAuth();
  return String(role || "").toLowerCase() === "admin"
    ? <AccountManagement />
    : <Navigate to="/dashboard" replace />;
}

function AccountManagement() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 });
  const [query, setQuery] = useState({ page: 1, limit: 20, search: "", role: "", status: "" });
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [nextStatus, setNextStatus] = useState("Active");
  const [saving, setSaving] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const response = await httpClient.get("/accounts", { params: query });
      if (currentRequest !== requestId.current) return;
      setRows(response?.data || []);
      setPagination(response?.pagination || { total: 0, total_pages: 1 });
      if (query.page > (response?.pagination?.total_pages || 1)) {
        setQuery((current) => ({ ...current, page: response?.pagination?.total_pages || 1 }));
      }
    } catch (caught) {
      if (currentRequest === requestId.current) setError(caught?.message || "Không thể tải tài khoản");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
    return () => { requestId.current += 1; };
  }, [load]);

  function search(event) {
    event.preventDefault();
    if (saving) return;
    setQuery({ ...query, page: 1, ...filters, search: filters.search.trim() });
  }

  async function saveStatus(event) {
    event.preventDefault();
    if (!selected || saving) return;
    setSaving(true);
    try {
      await httpClient.put("/accounts/" + encodeURIComponent(selected.username), { status: nextStatus });
      setSelected(null);
      notify("Đã cập nhật trạng thái tài khoản");
      await load();
    } catch (caught) {
      notify(caught?.message || "Không thể cập nhật trạng thái", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteAccount(account) {
    if (saving || !window.confirm('Xóa tài khoản "' + account.username + '" và hồ sơ liên kết chưa có dữ liệu khám bệnh?')) return;
    setSaving(true);
    try {
      await httpClient.delete("/accounts/" + encodeURIComponent(account.username));
      notify("Đã xóa tài khoản");
      await load();
    } catch (caught) {
      notify(caught?.message || "Không thể xóa tài khoản", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h1>Quản lý tài khoản</h1><p>Quản lý tài khoản quản trị viên, bác sĩ và bệnh nhân.</p></div>
        <div className="admin-summary"><div className="admin-summary-card">
          <span className="admin-summary-icon"><Shield size={20} /></span>
          <span><small>Tổng tài khoản</small><strong>{pagination.total.toLocaleString("vi-VN")}</strong></span>
        </div></div>
      </div>
      {error ? <div className="public-alert public-alert-error" role="alert">{error}</div> : null}
      <section className="admin-panel">
        <form className="admin-filters" onSubmit={search}>
          <label className="admin-search"><Search size={18} />
            <input aria-label="Tìm kiếm tài khoản" value={filters.search} disabled={saving} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Tên đăng nhập, họ tên, số điện thoại..." />
          </label>
          <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" aria-label="Lọc vai trò" value={filters.role} disabled={saving} onChange={(event) => setFilters({ ...filters, role: event.target.value })}>
            <option value="">Tất cả vai trò</option>
            {Object.entries(roles).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" aria-label="Lọc trạng thái" value={filters.status} disabled={saving} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button className="admin-excel-button" type="submit" disabled={loading || saving}><Search size={17} /> Tìm kiếm</button>
        </form>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tên đăng nhập</th><th>Họ tên</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
            <tbody>
              {loading ? <tr><td className="admin-empty" colSpan={5}>Đang tải tài khoản...</td></tr>
                : rows.length ? rows.map((account) => {
                  const isSelf = account.id === user?.id || account.username === user?.username;
                  return <tr key={account.id}>
                    <td>{account.username}{isSelf ? <span className="ml-2 text-xs text-slate-500">(Bạn)</span> : null}</td>
                    <td>{account.fullName || "-"}</td>
                    <td>{roles[account.role] || account.role}</td>
                    <td><span className={account.status === "Active" ? "text-emerald-700" : account.status === "Locked" ? "text-rose-700" : "text-slate-500"}>{statuses[account.status] || account.status}</span></td>
                    <td><div className="admin-row-actions">
                      <button className="admin-action disabled:opacity-40" type="button" aria-label={"Sửa trạng thái " + account.username} title={isSelf ? "Không thể tự khóa tài khoản đang đăng nhập" : "Sửa trạng thái"} disabled={saving || isSelf} onClick={() => { setSelected(account); setNextStatus(account.status); }}><Edit3 size={16} /></button>
                      <button className="admin-action admin-action-danger disabled:opacity-40" type="button" aria-label={"Xóa tài khoản " + account.username} title={isSelf ? "Không thể xóa tài khoản đang đăng nhập" : "Xóa tài khoản"} disabled={saving || isSelf} onClick={() => deleteAccount(account)}><Trash2 size={16} /></button>
                    </div></td>
                  </tr>;
                }) : <tr><td className="admin-empty" colSpan={5}>Không tìm thấy tài khoản phù hợp</td></tr>}
            </tbody>
          </table>
        </div>
        <AdminPagination page={query.page} limit={query.limit} total={pagination.total} totalPages={pagination.total_pages} itemLabel="tài khoản" onPageChange={(page) => { if (!loading && !saving) setQuery({ ...query, page }); }} />
      </section>
      <Modal title="Sửa trạng thái tài khoản" open={Boolean(selected)} onClose={() => { if (!saving) setSelected(null); }}>
        <form className="grid gap-5" onSubmit={saveStatus}>
          <div className="text-sm text-slate-600">Tài khoản: <strong className="text-slate-900">{selected?.username}</strong></div>
          <label className="grid gap-2 text-sm font-medium text-slate-700">Trạng thái
            <select className="rounded-md border border-slate-300 bg-white px-3 py-2" value={nextStatus} disabled={saving} onChange={(event) => setNextStatus(event.target.value)}>
              {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <p className="text-sm text-slate-500">Tài khoản ngừng hoạt động hoặc đã khóa sẽ không thể tiếp tục truy cập hệ thống.</p>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" type="button" disabled={saving} onClick={() => setSelected(null)}>Hủy</button>
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu trạng thái"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
