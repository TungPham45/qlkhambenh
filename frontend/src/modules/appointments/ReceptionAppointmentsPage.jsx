import { useCallback, useEffect, useState } from "react";
import { CalendarPlus, CheckCircle, Clock, Edit3, Search, AlertCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { httpClient } from "../../api/httpClient.js";
import { formatDate } from "../../utils/formatters.js";
import { Modal } from "../../components/common/Modal.jsx";

const STATUS_CONFIG = {
  "Cho kham": { label: "Chờ khám", badge: "badge-yellow", icon: Clock },
  "Dang kham": { label: "Đang khám", badge: "badge-blue", icon: AlertCircle },
  "Da kham": { label: "Đã khám", badge: "badge-green", icon: CheckCircle },
  Huy: { label: "Đã hủy", badge: "badge-grey", icon: XCircle },
};

const STATUS_OPTIONS = [
  { value: "Cho kham", label: "Chờ khám" },
  { value: "Dang kham", label: "Đang khám" },
  { value: "Da kham", label: "Đã khám" },
  { value: "Huy", label: "Hủy" },
];

const TIME_SLOTS = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export function ReceptionAppointmentsPage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const role = String(user?.VaiTro || "").toLowerCase();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [bookModal, setBookModal] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, apt: null });
  const [page, setPage] = useState(1);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [aptsRes, patientsRes, doctorsRes] = await Promise.all([
        httpClient.get("/appointments", { params: { limit: 100, page } }),
        httpClient.get("/patients", { params: { limit: 200 } }),
        httpClient.get("/admin/staff", { params: { limit: 100 } }),
      ]);
      const apts = aptsRes.data?.data || aptsRes.data?.rows || [];
      setAppointments(Array.isArray(apts) ? apts.sort((a, b) => new Date(b.NgayKham) - new Date(a.NgayKham)) : []);

      const pRows = patientsRes.data?.data || patientsRes.data?.rows || [];
      const pMap = {};
      (Array.isArray(pRows) ? pRows : []).forEach((p) => { pMap[p.MaBN] = p; });
      setPatients(pMap);

      const dRows = doctorsRes.data?.data || doctorsRes.data?.rows || [];
      setDoctors(Array.isArray(dRows) ? dRows : []);
    } catch {
      notify("Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Filter
  const filtered = appointments.filter((apt) => {
    const patient = patients[apt.MaBN];
    const matchSearch =
      !search ||
      String(apt.MaLich).includes(search) ||
      String(apt.MaBN).includes(search) ||
      patient?.HoTen?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || apt.TrangThai === statusFilter;
    const matchDate = !dateFilter || apt.NgayKham?.slice(0, 10) === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  async function handleStatusChange(apt, newStatus) {
    try {
      await httpClient.patch(`/appointments/${apt.MaLich}/status`, { TrangThai: newStatus });
      notify("Đã cập nhật trạng thái lịch");
      loadAll();
    } catch (err) {
      notify(err?.response?.data?.message || "Không thể cập nhật", "error");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="page-toolbar">
        <div>
          <h1 className="text-2xl font-bold">Quản lý lịch khám</h1>
          <p className="text-sm text-slate-500 mt-1">Đặt mới, theo dõi và cập nhật lịch hẹn bệnh nhân</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setBookModal(true)}>
          <CalendarPlus className="h-4 w-4" />
          Đặt lịch mới
        </button>
      </div>

      {/* Filters */}
      <div className="app-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="form-input pl-9 w-full"
              placeholder="Tìm mã lịch, tên bệnh nhân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-input w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <input
            type="date"
            className="form-input w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {(search || statusFilter !== "all" || dateFilter) && (
            <button
              className="btn-secondary text-xs"
              onClick={() => { setSearch(""); setStatusFilter("all"); setDateFilter(""); }}
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {STATUS_OPTIONS.map((s) => {
          const count = appointments.filter((a) => a.TrangThai === s.value).length;
          const conf = STATUS_CONFIG[s.value];
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setStatusFilter(s.value === statusFilter ? "all" : s.value)}
              className={`rounded-xl border p-3 text-left transition-all hover:shadow-sm ${statusFilter === s.value ? "ring-2 ring-blue-500" : "border-slate-200 bg-white"}`}
            >
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <section className="app-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">Không có lịch khám nào phù hợp</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã lịch</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Bệnh nhân</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Bác sĩ</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày · Giờ</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((apt) => {
                  const patient = patients[apt.MaBN];
                  const doctor = doctors.find((d) => d.MaNV == apt.MaBacSi);
                  const st = STATUS_CONFIG[apt.TrangThai] || STATUS_CONFIG["Cho kham"];
                  const StatusIcon = st.icon;
                  return (
                    <tr key={apt.MaLich} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{apt.MaLich}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{patient?.HoTen || `BN #${apt.MaBN}`}</p>
                        <p className="text-xs text-slate-400">{patient?.SoDienThoai || ""}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{doctor?.HoTen || `BS #${apt.MaBacSi}`}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(apt.NgayKham)} · {apt.GioKham || ""}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.badge}`}>
                          <StatusIcon className="h-3 w-3" />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn-secondary px-3"
                          onClick={() => setEditModal({ open: true, apt })}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Book Modal */}
      <Modal title="Đặt lịch khám mới" open={bookModal} onClose={() => setBookModal(false)}>
        <BookForm
          patients={Object.values(patients)}
          doctors={doctors}
          timeSlots={TIME_SLOTS}
          onSaved={() => { setBookModal(false); loadAll(); notify("Đã đặt lịch thành công!"); }}
          onCancel={() => setBookModal(false)}
        />
      </Modal>

      {/* Edit status Modal */}
      <Modal title="Cập nhật lịch khám" open={editModal.open} onClose={() => setEditModal({ open: false, apt: null })}>
        {editModal.apt && (
          <EditStatusForm
            apt={editModal.apt}
            patient={patients[editModal.apt.MaBN]}
            doctor={doctors.find((d) => d.MaNV == editModal.apt.MaBacSi)}
            onSaved={(newStatus) => {
              handleStatusChange(editModal.apt, newStatus);
              setEditModal({ open: false, apt: null });
            }}
            onCancel={() => setEditModal({ open: false, apt: null })}
          />
        )}
      </Modal>
    </div>
  );
}

function BookForm({ patients, doctors, timeSlots, onSaved, onCancel }) {
  const [form, setForm] = useState({
    MaBN: "",
    MaBacSi: "",
    NgayKham: new Date().toISOString().slice(0, 10),
    GioKham: "08:00",
    TrangThai: "Cho kham",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await httpClient.post("/appointments", {
        ...form,
        MaBN: Number(form.MaBN),
        MaBacSi: Number(form.MaBacSi),
      });
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể đặt lịch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Bệnh nhân <span className="text-rose-500">*</span>
          <select className="form-input" required value={form.MaBN} onChange={(e) => setForm((f) => ({ ...f, MaBN: e.target.value }))}>
            <option value="">-- Chọn bệnh nhân --</option>
            {patients.map((p) => <option key={p.MaBN} value={p.MaBN}>{p.HoTen} (#{p.MaBN})</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Bác sĩ <span className="text-rose-500">*</span>
          <select className="form-input" required value={form.MaBacSi} onChange={(e) => setForm((f) => ({ ...f, MaBacSi: e.target.value }))}>
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map((d) => <option key={d.MaNV} value={d.MaNV}>{d.HoTen}{d.ChuyenKhoa ? ` — ${d.ChuyenKhoa}` : ""}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Ngày khám <span className="text-rose-500">*</span>
          <input type="date" className="form-input" required value={form.NgayKham} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setForm((f) => ({ ...f, NgayKham: e.target.value }))} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Giờ khám <span className="text-rose-500">*</span>
          <select className="form-input" value={form.GioKham} onChange={(e) => setForm((f) => ({ ...f, GioKham: e.target.value }))}>
            {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>
      {error && <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel}>Hủy</button>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Xác nhận đặt lịch"}</button>
      </div>
    </form>
  );
}

function EditStatusForm({ apt, patient, doctor, onSaved, onCancel }) {
  const [status, setStatus] = useState(apt.TrangThai || "Cho kham");
  return (
    <div className="grid gap-4">
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
        <p><strong>Bệnh nhân:</strong> {patient?.HoTen || `#${apt.MaBN}`}</p>
        <p><strong>Bác sĩ:</strong> {doctor?.HoTen || `#${apt.MaBacSi}`}</p>
        <p><strong>Ngày:</strong> {formatDate(apt.NgayKham)} · {apt.GioKham || ""}</p>
      </div>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Trạng thái mới
        <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </label>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button className="btn-primary" onClick={() => onSaved(status)}>Cập nhật</button>
      </div>
    </div>
  );
}
