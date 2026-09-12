import { useCallback, useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Eye, Stethoscope, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { httpClient } from "../../api/httpClient.js";
import { formatDate } from "../../utils/formatters.js";
import { Modal } from "../../components/common/Modal.jsx";
import { DoctorExamineForm } from "./DoctorExamineForm.jsx";

const STATUS_CONFIG = {
  "Cho kham": { label: "Chờ khám", bg: "bg-yellow-50 border-yellow-200", badge: "badge-yellow", icon: Clock },
  "Dang kham": { label: "Đang khám", bg: "bg-blue-50 border-blue-200", badge: "badge-blue", icon: AlertCircle },
  "Da kham": { label: "Đã khám", bg: "bg-green-50 border-green-200", badge: "badge-green", icon: CheckCircle },
  Huy: { label: "Đã hủy", bg: "bg-slate-50 border-slate-200", badge: "badge-grey", icon: XCircle },
};

export function DoctorSchedulePage() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [examineModal, setExamineModal] = useState({ open: false, appointment: null });
  const [detailModal, setDetailModal] = useState({ open: false, record: null });

  const loadAppointments = useCallback(async () => {
    if (!user?.MaNV) return;
    setLoading(true);
    try {
      const res = await httpClient.get("/appointments", {
        params: { MaBacSi: user.MaNV, limit: 100 },
      });
      const rows = res.data?.data || res.data?.rows || [];
      const sorted = [...(Array.isArray(rows) ? rows : [])].sort(
        (a, b) => new Date(b.NgayKham) - new Date(a.NgayKham)
      );
      setAppointments(sorted);

      // Load patient names
      const ids = [...new Set(sorted.map((r) => r.MaBN).filter(Boolean))];
      if (ids.length > 0) {
        httpClient
          .get("/patients", { params: { limit: 200 } })
          .then((r) => {
            const pRows = r.data?.data || r.data?.rows || [];
            const map = {};
            (Array.isArray(pRows) ? pRows : []).forEach((p) => { map[p.MaBN] = p; });
            setPatients(map);
          })
          .catch(() => {});
      }
    } catch {
      notify("Không thể tải lịch khám", "error");
    } finally {
      setLoading(false);
    }
  }, [user?.MaNV]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function handleStartExamine(apt) {
    try {
      await httpClient.patch(`/appointments/${apt.MaLich}/status`, { TrangThai: "Dang kham" });
      setExamineModal({ open: true, appointment: { ...apt, TrangThai: "Dang kham" } });
      loadAppointments();
    } catch {
      setExamineModal({ open: true, appointment: apt });
    }
  }

  async function handleViewRecord(apt) {
    try {
      const res = await httpClient.get("/medical-records", { params: { MaLich: apt.MaLich, limit: 1 } });
      const rows = res.data?.data || res.data?.rows || [];
      setDetailModal({ open: true, record: rows[0] || null, appointment: apt });
    } catch {
      setDetailModal({ open: true, record: null, appointment: apt });
    }
  }

  function onExamineSaved() {
    setExamineModal({ open: false, appointment: null });
    loadAppointments();
    notify("Đã lưu kết quả khám và kê thuốc!");
  }

  // Filter logic
  const filtered = appointments.filter((apt) => {
    if (filter === "today") return apt.NgayKham?.slice(0, 10) === new Date().toISOString().slice(0, 10);
    if (filter === "date") return apt.NgayKham?.slice(0, 10) === selectedDate;
    if (filter === "pending") return apt.TrangThai === "Cho kham";
    return true;
  });

  const todayCount = appointments.filter(
    (a) => a.NgayKham?.slice(0, 10) === new Date().toISOString().slice(0, 10)
  ).length;
  const pendingCount = appointments.filter((a) => a.TrangThai === "Cho kham").length;

  return (
    <div className="grid gap-6">
      <div className="page-toolbar">
        <div>
          <h1 className="text-2xl font-bold">Lịch khám của tôi</h1>
          <p className="text-sm text-slate-500 mt-1">
            BS #{user?.MaNV} · {user?.HoTen || user?.TenDangNhap}
          </p>
        </div>
      </div>

      {/* KPI mini */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Tổng lịch" value={appointments.length} color="kpi-blue" />
        <Kpi label="Hôm nay" value={todayCount} color="kpi-green" />
        <Kpi label="Chờ khám" value={pendingCount} color="kpi-orange" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { key: "all", label: "Tất cả" },
          { key: "today", label: "Hôm nay" },
          { key: "pending", label: "Chờ khám" },
          { key: "date", label: "Theo ngày" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? "btn-primary" : "btn-secondary"}
          >
            {f.label}
          </button>
        ))}
        {filter === "date" && (
          <input
            type="date"
            className="form-input w-auto"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        )}
      </div>

      {/* List */}
      <section className="app-card overflow-hidden">
        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-400">Đang tải lịch khám...</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-slate-400">Không có lịch khám nào</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((apt) => {
              const st = STATUS_CONFIG[apt.TrangThai] || STATUS_CONFIG["Cho kham"];
              const StatusIcon = st.icon;
              const patient = patients[apt.MaBN];
              const isDone = apt.TrangThai === "Da kham" || apt.TrangThai === "Huy";

              return (
                <div
                  key={apt.MaLich}
                  className={`flex flex-wrap items-center justify-between gap-4 border-l-4 px-5 py-4 transition-all hover:bg-slate-50 ${st.bg}`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.badge}`}>
                        <StatusIcon className="h-3 w-3" />
                        {st.label}
                      </span>
                      <span className="text-xs text-slate-400">Lịch #{apt.MaLich}</span>
                    </div>
                    <p className="mt-1.5 font-semibold text-slate-900">
                      {patient ? patient.HoTen : `Bệnh nhân #${apt.MaBN}`}
                    </p>
                    <p className="text-sm text-slate-500">
                      <Calendar className="inline h-3.5 w-3.5 mr-1" />
                      {formatDate(apt.NgayKham)} · {apt.GioKham || ""}
                      {patient?.SoDienThoai && ` · 📞 ${patient.SoDienThoai}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!isDone && (
                      <button
                        className="btn-primary flex items-center gap-1"
                        onClick={() => handleStartExamine(apt)}
                      >
                        <Stethoscope className="h-4 w-4" />
                        Khám bệnh
                      </button>
                    )}
                    {apt.TrangThai === "Da kham" && (
                      <button
                        className="btn-secondary flex items-center gap-1"
                        onClick={() => handleViewRecord(apt)}
                      >
                        <Eye className="h-4 w-4" />
                        Xem kết quả
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Examine Modal */}
      <Modal
        title="Khám bệnh & Kê thuốc"
        open={examineModal.open}
        onClose={() => setExamineModal({ open: false, appointment: null })}
      >
        {examineModal.appointment && (
          <DoctorExamineForm
            appointment={examineModal.appointment}
            patient={patients[examineModal.appointment?.MaBN]}
            onSaved={onExamineSaved}
            onCancel={() => setExamineModal({ open: false, appointment: null })}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Kết quả khám bệnh"
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, record: null })}
      >
        <RecordDetail record={detailModal.record} appointment={detailModal.appointment} />
      </Modal>
    </div>
  );
}

function Kpi({ label, value, color }) {
  return (
    <div className={`kpi-card ${color}`} style={{ cursor: "default" }}>
      <div>
        <p className="kpi-label">{label}</p>
        <strong className="kpi-value">{value}</strong>
      </div>
    </div>
  );
}

function RecordDetail({ record, appointment }) {
  if (!record) {
    return (
      <div className="py-6 text-center text-sm text-slate-500">
        Chưa có phiếu khám cho lịch này.
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <InfoBlock label="Triệu chứng" value={record.TrieuChung} color="blue" />
        <InfoBlock label="Chẩn đoán" value={record.ChanDoan} color="amber" />
        <InfoBlock label="Kết luận" value={record.KetLuan} color="green" />
      </div>
      {Array.isArray(record.ChiTiet) && record.ChiTiet.length > 0 && (
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 text-sm font-semibold border-b border-slate-200">Đơn thuốc</div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-2 text-left text-slate-600">Thuốc</th>
                <th className="px-4 py-2 text-left text-slate-600">SL</th>
                <th className="px-4 py-2 text-left text-slate-600">Liều dùng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {record.ChiTiet.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2">{item.TenThuoc || `#${item.MaThuoc}`}</td>
                  <td className="px-4 py-2">{item.SoLuong}</td>
                  <td className="px-4 py-2">{item.LieuDung}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-100 text-blue-700",
    amber: "bg-amber-50 border-amber-100 text-amber-700",
    green: "bg-green-50 border-green-100 text-green-700",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-800">{value || "—"}</p>
    </div>
  );
}
