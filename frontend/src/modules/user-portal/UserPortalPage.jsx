import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, ClipboardList, CreditCard, Pill, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { httpClient } from "../../api/httpClient.js";
import { formatDate, formatCurrency } from "../../utils/formatters.js";

const TABS = [
  { key: "book", label: "Đặt lịch khám", icon: CalendarDays, path: "/my-appointments" },
  { key: "invoices", label: "Hóa đơn của tôi", icon: CreditCard, path: "/my-invoices" },
  { key: "prescriptions", label: "Thuốc đã kê", icon: Pill, path: "/my-prescriptions" },
  { key: "records", label: "Bệnh án của tôi", icon: ClipboardList, path: "/my-records" },
];

const STATUS_BADGE = {
  "Cho kham": { label: "Chờ khám", color: "badge-yellow", icon: Clock },
  "Dang kham": { label: "Đang khám", color: "badge-blue", icon: AlertCircle },
  "Da kham": { label: "Đã khám", color: "badge-green", icon: CheckCircle },
  Huy: { label: "Đã hủy", color: "badge-red", icon: XCircle },
};

const BILL_STATUS = {
  "Chua thanh toan": { label: "Chưa thanh toán", color: "badge-yellow" },
  "Da thanh toan": { label: "Đã thanh toán", color: "badge-green" },
};

export function UserPortalPage() {
  const { pathname } = useLocation();
  const activeTab = TABS.find((t) => t.path === pathname)?.key || "book";
  const [tab, setTab] = useState(activeTab);

  useEffect(() => {
    setTab(TABS.find((t) => t.path === pathname)?.key || "book");
  }, [pathname]);

  return (
    <div className="grid gap-6">
      <div className="page-toolbar">
        <div>
          <h1 className="text-2xl font-bold">Cổng người dùng</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý lịch khám và thông tin y tế của bạn</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
                tab === t.key
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {tab === "book" && <BookAppointmentTab />}
        {tab === "invoices" && <MyInvoicesTab />}
        {tab === "prescriptions" && <MyPrescriptionsTab />}
        {tab === "records" && <MyRecordsTab />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 1 — ĐẶT LỊCH KHÁM
═══════════════════════════════════════════════════ */
function BookAppointmentTab() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [myAppointments, setMyAppointments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingApts, setLoadingApts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    MaBacSi: "",
    NgayKham: new Date().toISOString().slice(0, 10),
    GioKham: "08:00",
    GhiChu: "",
  });

  const loadDoctors = useCallback(async () => {
    setLoadingDocs(true);
    try {
      const res = await httpClient.get("/admin/staff", { params: { limit: 100 } });
      const rows = res.data?.data || res.data?.rows || res.data || [];
      setDoctors(Array.isArray(rows) ? rows : []);
    } catch {
      setDoctors([]);
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  const loadMyAppointments = useCallback(async () => {
    if (!user?.MaBN) return;
    setLoadingApts(true);
    try {
      const res = await httpClient.get("/appointments", { params: { MaBN: user.MaBN, limit: 50 } });
      const rows = res.data?.data || res.data?.rows || [];
      setMyAppointments(Array.isArray(rows) ? rows : []);
    } catch {
      setMyAppointments([]);
    } finally {
      setLoadingApts(false);
    }
  }, [user?.MaBN]);

  useEffect(() => {
    loadDoctors();
    loadMyAppointments();
  }, [loadDoctors, loadMyAppointments]);

  async function handleBook(e) {
    e.preventDefault();
    if (!user?.MaBN) {
      notify("Tài khoản chưa liên kết mã bệnh nhân. Vui lòng liên hệ quản trị viên.", "error");
      return;
    }
    setSaving(true);
    try {
      await httpClient.post("/appointments", {
        MaBN: user.MaBN,
        MaBacSi: Number(form.MaBacSi) || null,
        NgayKham: form.NgayKham,
        GioKham: form.GioKham,
        TrangThai: "Cho kham",
        GhiChu: form.GhiChu || null,
      });
      notify("Đặt lịch khám thành công!");
      setForm({ MaBacSi: "", NgayKham: new Date().toISOString().slice(0, 10), GioKham: "08:00", GhiChu: "" });
      loadMyAppointments();
    } catch (err) {
      notify(err?.response?.data?.message || err.message || "Không thể đặt lịch", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id) {
    if (!window.confirm("Bạn có chắc muốn hủy lịch khám này?")) return;
    try {
      await httpClient.patch(`/appointments/${id}/status`, { TrangThai: "Huy" });
      notify("Đã hủy lịch khám");
      loadMyAppointments();
    } catch (err) {
      notify(err?.response?.data?.message || "Không thể hủy lịch", "error");
    }
  }

  const timeSlots = ["07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form đặt lịch */}
      <section className="app-card">
        <div className="card-header">
          <h2 className="font-semibold text-slate-900">Đặt lịch khám mới</h2>
        </div>
        <form className="grid gap-4 p-5" onSubmit={handleBook}>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Chọn bác sĩ <span className="text-rose-500">*</span>
            <select
              className="form-input"
              value={form.MaBacSi}
              required
              onChange={(e) => setForm((f) => ({ ...f, MaBacSi: e.target.value }))}
            >
              <option value="">{loadingDocs ? "Đang tải..." : "-- Chọn bác sĩ --"}</option>
              {doctors.map((d) => (
                <option key={d.MaNV} value={d.MaNV}>
                  {d.HoTen}{d.ChuyenKhoa ? ` — ${d.ChuyenKhoa}` : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Ngày khám <span className="text-rose-500">*</span>
              <input
                type="date"
                className="form-input"
                value={form.NgayKham}
                min={new Date().toISOString().slice(0, 10)}
                required
                onChange={(e) => setForm((f) => ({ ...f, NgayKham: e.target.value }))}
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Giờ khám <span className="text-rose-500">*</span>
              <select
                className="form-input"
                value={form.GioKham}
                required
                onChange={(e) => setForm((f) => ({ ...f, GioKham: e.target.value }))}
              >
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Ghi chú / Triệu chứng
            <textarea
              className="form-input min-h-20"
              placeholder="Mô tả triệu chứng hoặc lý do khám..."
              value={form.GhiChu}
              onChange={(e) => setForm((f) => ({ ...f, GhiChu: e.target.value }))}
            />
          </label>

          {!user?.MaBN && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              ⚠️ Tài khoản chưa liên kết mã bệnh nhân. Vui lòng liên hệ quản trị viên để được hỗ trợ.
            </div>
          )}

          <button
            className="btn-primary w-full justify-center"
            type="submit"
            disabled={saving || !user?.MaBN}
          >
            {saving ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
          </button>
        </form>
      </section>

      {/* Lịch đã đặt */}
      <section className="app-card">
        <div className="card-header">
          <h2 className="font-semibold text-slate-900">Lịch khám của tôi</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loadingApts ? (
            <div className="px-5 py-8 text-center text-sm text-slate-400">Đang tải...</div>
          ) : myAppointments.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-slate-400">Chưa có lịch khám nào</div>
          ) : (
            myAppointments.map((apt) => {
              const st = STATUS_BADGE[apt.TrangThai] || { label: apt.TrangThai, color: "badge-grey" };
              const Icon = st.icon || Clock;
              return (
                <div key={apt.MaLich} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(apt.NgayKham)} — {apt.GioKham || ""}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Mã lịch #{apt.MaLich} · BS #{apt.MaBacSi}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                      <Icon className="h-3 w-3" />
                      {st.label}
                    </span>
                    {apt.TrangThai === "Cho kham" && (
                      <button
                        className="btn-danger text-xs px-2 py-1"
                        onClick={() => handleCancel(apt.MaLich)}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 2 — HÓA ĐƠN CỦA TÔI
═══════════════════════════════════════════════════ */
function MyInvoicesTab() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payModal, setPayModal] = useState({ open: false, invoice: null });

  const loadInvoices = useCallback(async () => {
    if (!user?.MaBN) return;
    setLoading(true);
    try {
      const res = await httpClient.get("/billings", { params: { MaBN: user.MaBN, limit: 50 } });
      const rows = res.data?.data || res.data?.rows || [];
      setInvoices(Array.isArray(rows) ? rows : []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [user?.MaBN]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  async function handlePayment(invoice, method) {
    try {
      await httpClient.patch(`/billings/${invoice.MaHoaDon}/status`, {
        TrangThai: "Da thanh toan",
        PhuongThucTT: method,
      });
      notify("Thanh toán thành công!");
      setPayModal({ open: false, invoice: null });
      loadInvoices();
    } catch (err) {
      notify(err?.response?.data?.message || "Không thể cập nhật thanh toán", "error");
    }
  }

  return (
    <>
      <section className="app-card">
        <div className="card-header">
          <h2 className="font-semibold text-slate-900">Hóa đơn của tôi</h2>
        </div>
        {loading ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">Đang tải...</div>
        ) : invoices.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-400">Chưa có hóa đơn nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã HĐ</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày lập</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Tổng tiền</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Thanh toán</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const st = BILL_STATUS[inv.TrangThai] || { label: inv.TrangThai, color: "badge-grey" };
                  return (
                    <tr key={inv.MaHoaDon} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-700">#{inv.MaHoaDon}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.NgayLap)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(inv.TongTien)}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {inv.PhuongThucTT === "Tien mat" ? "Tiền mặt" : inv.PhuongThucTT === "Chuyen khoan" ? "Chuyển khoản" : inv.PhuongThucTT || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {inv.TrangThai === "Chua thanh toan" && (
                          <button
                            className="btn-primary text-xs px-3 py-1"
                            onClick={() => setPayModal({ open: true, invoice: inv })}
                          >
                            Thanh toán
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {payModal.open && payModal.invoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Thanh toán hóa đơn</h3>
            <div className="space-y-3 mb-6">
              <p><strong>Mã hóa đơn:</strong> #{payModal.invoice.MaHoaDon}</p>
              <p><strong>Tổng tiền:</strong> {formatCurrency(payModal.invoice.TongTien)}</p>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                Phương thức thanh toán
                <select
                  className="mt-1 block w-full form-input"
                  onChange={(e) => setPayModal((prev) => ({ ...prev, method: e.target.value }))}
                  defaultValue="Tien mat"
                >
                  <option value="Tien mat">Tiền mặt</option>
                  <option value="Chuyen khoan">Chuyển khoản</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn-secondary"
                onClick={() => setPayModal({ open: false, invoice: null })}
              >
                Hủy
              </button>
              <button
                className="btn-primary"
                onClick={() => handlePayment(payModal.invoice, payModal.method || "Tien mat")}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 3 — THUỐC ĐÃ KÊ
═══════════════════════════════════════════════════ */
function MyPrescriptionsTab() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.MaBN) return;
    setLoading(true);
    httpClient
      .get("/prescriptions", { params: { MaBN: user.MaBN, limit: 50 } })
      .then((res) => {
        const rows = res.data?.data || res.data?.rows || [];
        setPrescriptions(Array.isArray(rows) ? rows : []);
      })
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, [user?.MaBN]);

  return (
    <div className="grid gap-4">
      {loading ? (
        <div className="app-card px-5 py-10 text-center text-sm text-slate-400">Đang tải...</div>
      ) : prescriptions.length === 0 ? (
        <div className="app-card px-5 py-10 text-center text-sm text-slate-400">Chưa có đơn thuốc nào</div>
      ) : (
        prescriptions.map((pres) => (
          <div key={pres.MaDon} className="app-card">
            <div className="card-header">
              <div>
                <h3 className="font-semibold text-slate-900">Đơn thuốc #{pres.MaDon}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ngày kê: {formatDate(pres.NgayKeDon)} · Phiếu khám #{pres.MaPhieu}</p>
              </div>
            </div>
            {pres.GhiChu && (
              <p className="px-5 pt-3 text-sm text-slate-600 italic">📝 {pres.GhiChu}</p>
            )}
            {Array.isArray(pres.ChiTiet) && pres.ChiTiet.length > 0 ? (
              <div className="px-5 pb-5 pt-3">
                <div className="rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Tên thuốc</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Số lượng</th>
                        <th className="px-4 py-2 text-left font-semibold text-slate-600">Liều dùng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pres.ChiTiet.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-slate-800">{item.TenThuoc || `Thuốc #${item.MaThuoc}`}</td>
                          <td className="px-4 py-2 text-slate-600">{item.SoLuong} {item.DonViTinh || ""}</td>
                          <td className="px-4 py-2 text-slate-600">{item.LieuDung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="px-5 py-3 text-sm text-slate-400">Không có chi tiết thuốc</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB 4 — BỆNH ÁN CỦA TÔI
═══════════════════════════════════════════════════ */
function MyRecordsTab() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.MaBN) return;
    setLoading(true);
    httpClient
      .get("/medical-records", { params: { MaBN: user.MaBN, limit: 50 } })
      .then((res) => {
        const rows = res.data?.data || res.data?.rows || [];
        setRecords(Array.isArray(rows) ? rows : []);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [user?.MaBN]);

  return (
    <div className="grid gap-4">
      {loading ? (
        <div className="app-card px-5 py-10 text-center text-sm text-slate-400">Đang tải...</div>
      ) : records.length === 0 ? (
        <div className="app-card px-5 py-10 text-center text-sm text-slate-400">Chưa có hồ sơ bệnh án nào</div>
      ) : (
        records.map((rec) => (
          <div key={rec.MaPhieu} className="app-card">
            <div className="card-header">
              <div>
                <h3 className="font-semibold text-slate-900">Phiếu khám #{rec.MaPhieu}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Ngày khám: {formatDate(rec.NgayKham)}</p>
              </div>
            </div>
            <div className="grid gap-3 p-5 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Triệu chứng</p>
                <p className="text-sm text-slate-800">{rec.TrieuChung || "—"}</p>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Chẩn đoán</p>
                <p className="text-sm text-slate-800">{rec.ChanDoan || "—"}</p>
              </div>
              <div className="rounded-lg bg-green-50 border border-green-100 p-3">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Kết luận</p>
                <p className="text-sm text-slate-800">{rec.KetLuan || "—"}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
