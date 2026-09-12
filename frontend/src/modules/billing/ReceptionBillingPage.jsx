import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Clock, CreditCard, Eye, Plus, Search } from "lucide-react";
import { useToast } from "../../context/ToastContext.jsx";
import { httpClient } from "../../api/httpClient.js";
import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { Modal } from "../../components/common/Modal.jsx";

const BILL_STATUS = {
  "Chua thanh toan": { label: "Chưa thanh toán", badge: "badge-yellow", icon: Clock },
  "Da thanh toan": { label: "Đã thanh toán", badge: "badge-green", icon: CheckCircle },
};

const PAYMENT_METHODS = [
  { value: "Tien mat", label: "Tiền mặt" },
  { value: "Chuyen khoan", label: "Chuyển khoản" },
];
const DEFAULT_EXAM_FEE = 150000;

export function ReceptionBillingPage() {
  const { notify } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState({});
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createModal, setCreateModal] = useState(false);
  const [payModal, setPayModal] = useState({ open: false, invoice: null });
  const [detailModal, setDetailModal] = useState({ open: false, invoice: null });

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [billRes, patientRes, recordRes] = await Promise.all([
        httpClient.get("/billings", { params: { limit: 100 } }),
        httpClient.get("/patients", { params: { limit: 200 } }),
        httpClient.get("/medical-records", { params: { limit: 200 } }),
      ]);
      const bills = billRes.data?.data || billRes.data?.rows || [];
      setInvoices(Array.isArray(bills) ? bills.sort((a, b) => new Date(b.NgayLap) - new Date(a.NgayLap)) : []);

      const pRows = patientRes.data?.data || patientRes.data?.rows || [];
      const pMap = {};
      (Array.isArray(pRows) ? pRows : []).forEach((p) => { pMap[p.MaBN] = p; });
      setPatients(pMap);

      const rRows = recordRes.data?.data || recordRes.data?.rows || [];
      setRecords(Array.isArray(rRows) ? rRows : []);
    } catch {
      notify("Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const filtered = invoices.filter((inv) => {
    const patient = patients[inv.MaBN];
    const matchSearch =
      !search ||
      String(inv.MaHoaDon).includes(search) ||
      String(inv.MaBN).includes(search) ||
      patient?.HoTen?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || inv.TrangThai === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalUnpaid = invoices
    .filter((i) => i.TrangThai === "Chua thanh toan")
    .reduce((sum, i) => sum + (Number(i.TongTien) || 0), 0);

  const totalPaid = invoices
    .filter((i) => i.TrangThai === "Da thanh toan")
    .reduce((sum, i) => sum + (Number(i.TongTien) || 0), 0);

  async function handlePayment(invoice, method) {
    try {
      await httpClient.patch(`/billings/${invoice.MaHoaDon}/status`, {
        TrangThai: "Da thanh toan",
        PhuongThucTT: method,
      });
      notify("Thanh toán thành công!");
      setPayModal({ open: false, invoice: null });
      loadAll();
    } catch (err) {
      notify(err?.response?.data?.message || "Không thể cập nhật thanh toán", "error");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="page-toolbar">
        <div>
          <h1 className="text-2xl font-bold">Quản lý thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">Tạo hóa đơn và xử lý thanh toán bệnh nhân</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setCreateModal(true)}>
          <Plus className="h-4 w-4" />
          Tạo hóa đơn
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="kpi-card kpi-blue">
          <div className="kpi-icon"><CreditCard /></div>
          <div>
            <p className="kpi-label">Tổng hóa đơn</p>
            <strong className="kpi-value">{invoices.length}</strong>
          </div>
        </div>
        <div className="kpi-card kpi-orange">
          <div className="kpi-icon"><Clock /></div>
          <div>
            <p className="kpi-label">Chưa thanh toán</p>
            <strong className="kpi-value">{formatCurrency(totalUnpaid)}</strong>
          </div>
        </div>
        <div className="kpi-card kpi-green">
          <div className="kpi-icon"><CheckCircle /></div>
          <div>
            <p className="kpi-label">Đã thu</p>
            <strong className="kpi-value">{formatCurrency(totalPaid)}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="app-card p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="form-input pl-9 w-full"
              placeholder="Tìm mã HĐ, tên bệnh nhân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["all", "Chua thanh toan", "Da thanh toan"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? "btn-primary" : "btn-secondary"}
              >
                {s === "all" ? "Tất cả" : BILL_STATUS[s]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <section className="app-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">Không có hóa đơn nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã HĐ</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Bệnh nhân</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Ngày lập</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Tổng tiền</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Phương thức</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Trạng thái</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inv) => {
                  const patient = patients[inv.MaBN];
                  const st = BILL_STATUS[inv.TrangThai] || BILL_STATUS["Chua thanh toan"];
                  const StatusIcon = st.icon;
                  const isUnpaid = inv.TrangThai === "Chua thanh toan";
                  const pmLabel = PAYMENT_METHODS.find((m) => m.value === inv.PhuongThucTT)?.label || inv.PhuongThucTT || "—";
                  return (
                    <tr key={inv.MaHoaDon} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-slate-500">#{inv.MaHoaDon}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{patient?.HoTen || `BN #${inv.MaBN}`}</p>
                        <p className="text-xs text-slate-400">Phiếu #{inv.MaPhieu}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.NgayLap)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(inv.TongTien)}</td>
                      <td className="px-4 py-3 text-slate-600">{pmLabel}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.badge}`}>
                          <StatusIcon className="h-3 w-3" />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            className="btn-secondary px-3"
                            onClick={() => setDetailModal({ open: true, invoice: inv })}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {isUnpaid && (
                            <button
                              className="btn-primary flex items-center gap-1 text-xs"
                              onClick={() => setPayModal({ open: true, invoice: inv })}
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              Thanh toán
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create Invoice Modal */}
      <Modal title="Tạo hóa đơn mới" open={createModal} onClose={() => setCreateModal(false)}>
        <CreateInvoiceForm
          records={records}
          patients={patients}
          onSaved={() => { setCreateModal(false); loadAll(); notify("Đã tạo hóa đơn!"); }}
          onCancel={() => setCreateModal(false)}
        />
      </Modal>

      {/* Pay Modal */}
      <Modal title="Xác nhận thanh toán" open={payModal.open} onClose={() => setPayModal({ open: false, invoice: null })}>
        {payModal.invoice && (
          <PayForm
            invoice={payModal.invoice}
            patient={patients[payModal.invoice.MaBN]}
            methods={PAYMENT_METHODS}
            onPay={(method) => handlePayment(payModal.invoice, method)}
            onCancel={() => setPayModal({ open: false, invoice: null })}
          />
        )}
      </Modal>

      {/* Detail Modal */}
      <Modal title="Chi tiết hóa đơn" open={detailModal.open} onClose={() => setDetailModal({ open: false, invoice: null })}>
        {detailModal.invoice && (
          <InvoiceDetail invoice={detailModal.invoice} patient={patients[detailModal.invoice.MaBN]} methods={PAYMENT_METHODS} />
        )}
      </Modal>
    </div>
  );
}

function CreateInvoiceForm({ records, patients, onSaved, onCancel }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ MaHoaDon: "", MaPhieu: "", NgayLap: today, TongTien: "", PhuongThucTT: "Tien mat", TrangThai: "Chua thanh toan" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [autoCalculated, setAutoCalculated] = useState(false);
  const [autoInvoiceCode, setAutoInvoiceCode] = useState("");
  const [computedExamFee, setComputedExamFee] = useState(0);
  const [computedDrugTotal, setComputedDrugTotal] = useState(0);
  const [noPrescriptionWarning, setNoPrescriptionWarning] = useState(false);

  async function handleMaPhieuChange(maPhieu) {
    const selectedRecord = records.find((r) => String(r.MaPhieu) === String(maPhieu));
    const invoiceCode = maPhieu ? `HD${String(maPhieu).padStart(4, '0')}` : "";
    setForm((f) => ({
      ...f,
      MaHoaDon: (!f.MaHoaDon || f.MaHoaDon === autoInvoiceCode) ? invoiceCode : f.MaHoaDon,
      MaPhieu: maPhieu,
      TongTien: "",
    }));
    setAutoInvoiceCode(invoiceCode);
    setAutoCalculated(false);
    setComputedExamFee(0);
    setComputedDrugTotal(0);
    setNoPrescriptionWarning(false);

    if (!maPhieu) return;

    try {
      const examFee = Number(selectedRecord?.TienKham || selectedRecord?.ChiPhi || DEFAULT_EXAM_FEE);
      const prescriptionRes = await httpClient.get("/prescriptions", { params: { MaPhieu: maPhieu, limit: 1 } });
      
      // Unwrap response: could be { data: [...], pagination: {...} } or { rows: [...] }
      const prescriptionsData = prescriptionRes.data || prescriptionRes.rows || [];
      const prescriptions = Array.isArray(prescriptionsData) ? prescriptionsData : (prescriptionsData.data ? prescriptionsData.data : []);
      let drugTotal = 0;

      if (prescriptions.length > 0) {
        const prescription = prescriptions[0];
        if (prescription.ChiTiet && Array.isArray(prescription.ChiTiet)) {
          drugTotal = prescription.ChiTiet.reduce((sum, item) => {
            const price = Number(item.DonGia || 0);
            const quantity = Number(item.SoLuong) || 0;
            return sum + (price * quantity);
          }, 0);
        }
      } else {
        setNoPrescriptionWarning(true);
      }

      const totalAmount = examFee + drugTotal;
      setForm((f) => ({ ...f, TongTien: String(totalAmount) }));
      setAutoCalculated(true);
      setComputedExamFee(examFee);
      setComputedDrugTotal(drugTotal);
    } catch (err) {
      // Ignore errors, user can enter manually - but log for debugging
      console.error("Error loading prescription for MaPhieu:", maPhieu, err);
      setNoPrescriptionWarning(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Enrich with MaBN and MaBacSi from selected record
      const record = records.find((r) => String(r.MaPhieu) === String(form.MaPhieu));
      await httpClient.post("/billings", {
        ...form,
        MaPhieu: Number(form.MaPhieu),
        MaBN: record?.MaBN || null,
        ...(record?.MaBacSi && { MaBacSi: record.MaBacSi }),
        TongTien: Number(form.TongTien) || 0,
      });
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể tạo hóa đơn");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Mã hóa đơn
          <input
            type="text"
            className="form-input"
            value={form.MaHoaDon}
            onChange={(e) => setForm((f) => ({ ...f, MaHoaDon: e.target.value }))}
            placeholder="Tự động sinh từ phiếu khám hoặc nhập tay"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Phiếu khám <span className="text-rose-500">*</span>
          <select className="form-input" required value={form.MaPhieu} onChange={(e) => handleMaPhieuChange(e.target.value)}>
            <option value="">-- Chọn phiếu khám --</option>
            {records.map((r) => {
              const p = patients[r.MaBN];
              return <option key={r.MaPhieu} value={r.MaPhieu}>#{r.MaPhieu} — {p?.HoTen || `BN #${r.MaBN}`} ({formatDate(r.NgayKham)})</option>;
            })}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Ngày lập
          <input type="date" className="form-input" value={form.NgayLap} onChange={(e) => setForm((f) => ({ ...f, NgayLap: e.target.value }))} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Tổng tiền (VNĐ) <span className="text-rose-500">*</span>
          <input type="number" className="form-input" min="0" required value={form.TongTien} onChange={(e) => setForm((f) => ({ ...f, TongTien: e.target.value }))} placeholder={autoCalculated ? "Tự động tính từ phí khám + thuốc" : "Nhập tổng tiền"} />
          {autoCalculated ? (
            <p className="text-xs text-green-600 mt-1">
              ✓ Tự động tính: Phí khám {formatCurrency(computedExamFee)} + Thuốc {formatCurrency(computedDrugTotal)} = {formatCurrency(computedExamFee + computedDrugTotal)}
            </p>
          ) : computedDrugTotal === 0 && form.MaPhieu ? (
            <p className="text-xs text-amber-600 mt-1">
              ⚠ Không tìm thấy đơn thuốc. Tổng tiền = Phí khám {formatCurrency(computedExamFee)}
            </p>
          ) : null}
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Phương thức thanh toán
          <select className="form-input" value={form.PhuongThucTT} onChange={(e) => setForm((f) => ({ ...f, PhuongThucTT: e.target.value }))}>
            {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Trạng thái
          <select className="form-input" value={form.TrangThai} onChange={(e) => setForm((f) => ({ ...f, TrangThai: e.target.value }))}>
            <option value="Chua thanh toan">Chưa thanh toán</option>
            <option value="Da thanh toan">Đã thanh toán</option>
          </select>
        </label>
      </div>
      {error && <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {noPrescriptionWarning && (
        <div className="rounded-lg bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-800">
          <p className="font-semibold mb-1">⚠ Cảnh báo: Không tìm thấy đơn thuốc</p>
          <p className="text-xs">Bác sĩ chưa kê đơn thuốc cho phiếu khám này. Hóa đơn sẽ chỉ bao gồm phí khám. Nếu cần kê thuốc, vui lòng yêu cầu bác sĩ kiểm tra lại phiếu khám.</p>
        </div>
      )}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel}>Hủy</button>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Tạo hóa đơn"}</button>
      </div>
    </form>
  );
}

function PayForm({ invoice, patient, methods, onPay, onCancel }) {
  const [method, setMethod] = useState(invoice.PhuongThucTT || "Tien mat");
  return (
    <div className="grid gap-4">
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm grid gap-1">
        <p><strong>Bệnh nhân:</strong> {patient?.HoTen || `#${invoice.MaBN}`}</p>
        <p><strong>Mã hóa đơn:</strong> #{invoice.MaHoaDon}</p>
        <p><strong>Tổng tiền:</strong> <span className="text-lg font-bold text-blue-700">{formatCurrency(invoice.TongTien)}</span></p>
      </div>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Phương thức thanh toán
        <select className="form-input" value={method} onChange={(e) => setMethod(e.target.value)}>
          {methods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </label>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" onClick={onCancel}>Hủy</button>
        <button className="btn-primary flex items-center gap-2" onClick={() => onPay(method)}>
          <CheckCircle className="h-4 w-4" />
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  );
}

function InvoiceDetail({ invoice, patient, methods }) {
  const st = BILL_STATUS[invoice.TrangThai] || BILL_STATUS["Chua thanh toan"];
  const StatusIcon = st.icon;
  const pmLabel = methods.find((m) => m.value === invoice.PhuongThucTT)?.label || invoice.PhuongThucTT || "—";
  return (
    <div className="grid gap-3 text-sm">
      {[
        { label: "Mã hóa đơn", value: `#${invoice.MaHoaDon}` },
        { label: "Bệnh nhân", value: patient?.HoTen || `#${invoice.MaBN}` },
        { label: "Phiếu khám", value: `#${invoice.MaPhieu}` },
        { label: "Ngày lập", value: formatDate(invoice.NgayLap) },
        { label: "Tổng tiền", value: formatCurrency(invoice.TongTien) },
        { label: "Phương thức", value: pmLabel },
      ].map((item) => (
        <div key={item.label} className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">{item.label}</span>
          <span className="font-medium text-slate-900">{item.value}</span>
        </div>
      ))}
      <div className="flex justify-between">
        <span className="text-slate-500">Trạng thái</span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.badge}`}>
          <StatusIcon className="h-3 w-3" />
          {st.label}
        </span>
      </div>
    </div>
  );
}
