import { CalendarDays, Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { httpClient } from "../../api/httpClient.js";
import { unwrapRows } from "../../api/response.js";
import { Modal } from "../../components/common/Modal.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate } from "../../utils/formatters.js";
import { AdminPagination } from "../admin/AdminPagination.jsx";

const emptyFilters = { search: "", doctorId: "", date: "", status: "" };
const newSchedule = { doctorId: "", workDate: "", startTime: "08:00", endTime: "17:00", slotMinutes: 30, status: "Active", notes: "" };
const messageOf = (error) => Array.isArray(error?.message) ? error.message.join(". ") : error?.message || "Không thể thực hiện thao tác";

export function WorkSchedulesPage() {
  const { notify } = useToast();
  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState({ ...emptyFilters, page: 1, limit: 10 });
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorError, setDoctorError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const requestId = useRef(0);

  const loadDoctors = useCallback(async () => {
    setDoctorsLoading(true);
    setDoctorError("");
    try {
      const all = [];
      let page = 1;
      let totalPages = 1;
      do {
        const result = unwrapRows(await httpClient.get("/staff", { params: { page, limit: 100 } }));
        all.push(...result.rows);
        totalPages = result.pagination?.total_pages || 1;
        page += 1;
      } while (page <= totalPages);
      setDoctors(all);
    } catch (caught) {
      setDoctorError(messageOf(caught));
    } finally {
      setDoctorsLoading(false);
    }
  }, []);

  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");
    httpClient.get("/work-schedules", { params: query }).then((response) => {
      if (currentRequest !== requestId.current) return;
      const result = unwrapRows(response);
      setRows(result.rows);
      setPagination(result.pagination);
    }).catch((caught) => {
      if (currentRequest === requestId.current) {
        setRows([]);
        setPagination(null);
        setError(messageOf(caught));
      }
    }).finally(() => {
      if (currentRequest === requestId.current) setLoading(false);
    });
    return () => { requestId.current += 1; };
  }, [query, refresh]);

  function submitSearch(event) {
    event.preventDefault();
    setQuery({ ...filters, search: filters.search.trim(), page: 1, limit: query.limit });
  }

  function resetSearch() {
    setFilters(emptyFilters);
    setQuery({ ...emptyFilters, page: 1, limit: query.limit });
  }

  async function save(payload) {
    setSaving(true);
    try {
      if (modal?.id) await httpClient.put(`/work-schedules/${modal.id}`, payload);
      else await httpClient.post("/work-schedules", payload);
      notify(modal?.id ? "Đã cập nhật lịch làm việc" : "Đã thêm lịch làm việc");
      setModal(null);
      setRefresh((value) => value + 1);
    } catch (caught) {
      throw new Error(messageOf(caught));
    } finally {
      setSaving(false);
    }
  }

  async function remove(row) {
    if (!window.confirm(`Xóa lịch làm việc của ${row.doctorName || `bác sĩ #${row.doctorId}`} ngày ${formatDate(row.workDate)} (${row.startTime.slice(0, 5)} - ${row.endTime.slice(0, 5)})?`)) return;
    setDeletingId(row.id);
    try {
      await httpClient.delete(`/work-schedules/${row.id}`);
      notify("Đã xóa lịch làm việc");
      if (rows.length === 1 && query.page > 1) setQuery((current) => ({ ...current, page: current.page - 1 }));
      else setRefresh((value) => value + 1);
    } catch (caught) {
      notify(messageOf(caught), "error");
    } finally {
      setDeletingId(null);
    }
  }

  const total = pagination?.total ?? 0;
  return <div className="admin-page">
    <div className="admin-page-head">
      <div><h1>Quản lý lịch làm việc bác sĩ</h1><p>Thêm, sửa, xóa và tìm kiếm khung giờ khám của bác sĩ.</p></div>
      <div className="admin-summary"><div className="admin-summary-card"><span className="admin-summary-icon"><CalendarDays size={20} /></span><span><small>Lịch làm việc</small><strong>{total.toLocaleString("vi-VN")}</strong></span></div></div>
    </div>
    {error ? <div className="public-alert public-alert-error" role="alert">{error} <button type="button" onClick={() => setRefresh((value) => value + 1)}>Thử lại</button></div> : null}
    {doctorError ? <div className="public-alert public-alert-error" role="alert">Không thể tải danh sách bác sĩ: {doctorError} <button type="button" onClick={loadDoctors}>Thử lại</button></div> : null}
    <section className="admin-panel">
      <form className="admin-filters" onSubmit={submitSearch}>
        <label className="admin-search"><Search size={18} /><input aria-label="Tìm lịch làm việc" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Tìm theo tên bác sĩ, mã lịch hoặc ghi chú" /></label>
        <select className="admin-filter-select" aria-label="Lọc bác sĩ" value={filters.doctorId} onChange={(event) => setFilters({ ...filters, doctorId: event.target.value })}><option value="">Tất cả bác sĩ</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.HoTen || doctor.fullName}</option>)}</select>
        <input className="admin-filter-select" aria-label="Lọc ngày làm việc" type="date" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value })} />
        <select className="admin-filter-select" aria-label="Lọc trạng thái" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">Tất cả trạng thái</option><option value="Active">Đang áp dụng</option><option value="Inactive">Ngừng áp dụng</option></select>
        <button className="admin-excel-button" type="submit"><Search size={17} /> Tìm kiếm</button>
        <button className="admin-excel-button" type="button" onClick={resetSearch}>Đặt lại</button>
        <button className="admin-add-button" type="button" disabled={doctorsLoading || !!doctorError || !doctors.length} onClick={() => setModal({ ...newSchedule })}><Plus size={17} /> Thêm lịch làm việc</button>
      </form>
      {!doctorsLoading && !doctorError && !doctors.length ? <p className="px-6 py-3 text-sm text-slate-600">Chưa có bác sĩ. Vui lòng thêm bác sĩ trước khi lập lịch làm việc.</p> : null}
      <div className="admin-table-wrap"><table className="admin-table">
        <thead><tr><th>Mã lịch</th><th>Bác sĩ</th><th>Ngày làm việc</th><th>Giờ làm việc</th><th>Thời lượng mỗi ca</th><th>Trạng thái</th><th>Ghi chú</th><th>Thao tác</th></tr></thead>
        <tbody>{loading ? <tr><td colSpan={8} className="admin-empty">Đang tải lịch làm việc...</td></tr> : rows.length ? rows.map((row) => <tr key={row.id}>
          <td><span className="admin-code">#{row.id}</span></td><td>{row.doctorName || `Bác sĩ #${row.doctorId}`}</td><td>{formatDate(row.workDate)}</td><td>{row.startTime.slice(0, 5)} - {row.endTime.slice(0, 5)}</td><td>{row.slotMinutes} phút</td><td>{row.status === "Active" ? "Đang áp dụng" : "Ngừng áp dụng"}</td><td className="max-w-xs break-words">{row.notes || "—"}</td>
          <td><div className="admin-row-actions"><button className="admin-action" type="button" title="Sửa lịch làm việc" aria-label={`Sửa lịch làm việc ${row.id}`} disabled={deletingId !== null || saving || doctorsLoading || !!doctorError} onClick={() => setModal(row)}><Edit3 size={16} /></button><button className="admin-action admin-action-danger" type="button" title="Xóa lịch làm việc" aria-label={`Xóa lịch làm việc ${row.id}`} disabled={deletingId !== null || saving} onClick={() => remove(row)}><Trash2 size={16} /></button></div></td>
        </tr>) : <tr><td colSpan={8} className="admin-empty">Không tìm thấy lịch làm việc phù hợp</td></tr>}</tbody>
      </table></div>
      {pagination ? <AdminPagination page={query.page} limit={query.limit} total={total} totalPages={pagination.total_pages} itemLabel="lịch làm việc" onPageChange={(page) => setQuery((current) => ({ ...current, page }))} /> : null}
    </section>
    <Modal title={modal?.id ? "Cập nhật lịch làm việc" : "Thêm lịch làm việc"} open={!!modal} onClose={() => { if (!saving) setModal(null); }}>
      {modal ? <WorkScheduleForm key={modal.id || "new"} initialValue={modal} doctors={doctors} saving={saving} onSave={save} onCancel={() => setModal(null)} /> : null}
    </Modal>
  </div>;
}

function WorkScheduleForm({ initialValue, doctors, saving, onSave, onCancel }) {
  const [form, setForm] = useState({ ...newSchedule, ...initialValue, notes: initialValue.notes || "" });
  const [error, setError] = useState("");
  const field = (name) => ({ value: form[name], disabled: saving, onChange: (event) => setForm((current) => ({ ...current, [name]: event.target.value })) });

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (form.endTime <= form.startTime) { setError("Giờ kết thúc phải sau giờ bắt đầu"); return; }
    const [startHour, startMinute, startSecond = 0] = form.startTime.split(":").map(Number);
    const [endHour, endMinute, endSecond = 0] = form.endTime.split(":").map(Number);
    const availableMinutes = (endHour - startHour) * 60 + endMinute - startMinute + (endSecond - startSecond) / 60;
    if (Number(form.slotMinutes) > availableMinutes) { setError("Thời lượng mỗi ca không được dài hơn khung giờ làm việc"); return; }
    try {
      await onSave({ doctorId: Number(form.doctorId), workDate: form.workDate, startTime: form.startTime, endTime: form.endTime, slotMinutes: Number(form.slotMinutes), status: form.status, notes: form.notes.trim() });
    } catch (caught) {
      setError(messageOf(caught));
    }
  }

  return <form className="grid gap-4" onSubmit={submit}>
    {error ? <div className="public-alert public-alert-error" role="alert">{error}</div> : null}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-1 text-sm font-medium text-slate-700">Bác sĩ <select className="form-input" required {...field("doctorId")}><option value="">Chọn bác sĩ</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.HoTen || doctor.fullName}</option>)}</select></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">Ngày làm việc <input className="form-input" type="date" required {...field("workDate")} /></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">Giờ bắt đầu <input className="form-input" type="time" step="1" required {...field("startTime")} /></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">Giờ kết thúc <input className="form-input" type="time" step="1" required {...field("endTime")} /></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">Thời lượng mỗi ca (phút) <input className="form-input" type="number" min="1" step="1" required {...field("slotMinutes")} /></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">Trạng thái <select className="form-input" required {...field("status")}><option value="Active">Đang áp dụng</option><option value="Inactive">Ngừng áp dụng</option></select></label>
      <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">Ghi chú <textarea className="form-input min-h-24" {...field("notes")} /></label>
    </div>
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4"><button className="btn-secondary" type="button" disabled={saving} onClick={onCancel}>Hủy</button><button className="btn-primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu lịch làm việc"}</button></div>
  </form>;
}
