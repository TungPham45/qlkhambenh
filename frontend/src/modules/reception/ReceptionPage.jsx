import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ClipboardCheck,
  Clock3,
  Edit3,
  Eye,
  RotateCcw,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { Modal } from "../../components/common/Modal.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AdminPagination } from "../admin/AdminPagination.jsx";
import {
  createReception,
  getReception,
  listReceptions,
  updateReception,
} from "./services/receptionApi.js";

const APPOINTMENT_STATUSES = [
  ["Cho xac nhan", "Chờ xác nhận"],
  ["Da xac nhan", "Đã xác nhận"],
  ["Da check-in", "Đã check-in"],
  ["Cho kham", "Chờ khám"],
  ["Dang kham", "Đang khám"],
  ["Hoan thanh", "Hoàn thành"],
  ["Da kham", "Đã khám"],
  ["Huy", "Đã hủy"],
];

const STATUS_LABELS = Object.fromEntries(APPOINTMENT_STATUSES);

const VITAL_FIELDS = [
  { name: "weight", label: "Cân nặng", unit: "kg", step: "0.01", min: "0.01", max: "999.99" },
  { name: "height", label: "Chiều cao", unit: "cm", step: "0.01", min: "0.01", max: "999.99" },
  { name: "temperature", label: "Nhiệt độ", unit: "°C", step: "0.1", min: "30", max: "45" },
  { name: "systolicBloodPressure", label: "Huyết áp tâm thu", unit: "mmHg", step: "1", min: "0", max: "500" },
  { name: "diastolicBloodPressure", label: "Huyết áp tâm trương", unit: "mmHg", step: "1", min: "0", max: "500" },
  { name: "heartRate", label: "Nhịp tim", unit: "lần/phút", step: "1", min: "0", max: "400" },
  { name: "spo2", label: "SpO2", unit: "%", step: "0.01", min: "0", max: "100" },
];

function getLocalDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
}

export function ReceptionPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    date: getLocalDate(),
    search: "",
    status: "",
    receptionStatus: "",
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState(query);
  const [modal, setModal] = useState({ open: false, row: null, loading: false });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listReceptions(query);
      setRows(result.rows);
      setPagination(result.pagination);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  const receivedCount = useMemo(
    () => rows.filter((row) => row.hasReception).length,
    [rows],
  );

  function submitFilters(event) {
    event.preventDefault();
    setQuery({
      ...query,
      ...filters,
      search: filters.search.trim(),
      page: 1,
    });
  }

  function resetFilters() {
    const next = {
      ...query,
      date: getLocalDate(),
      search: "",
      status: "",
      receptionStatus: "",
      page: 1,
    };
    setFilters(next);
    setQuery(next);
  }

  async function openReception(row) {
    setModal({ open: true, row, loading: true });
    try {
      const detail = await getReception(row.appointmentId);
      setModal({ open: true, row: detail, loading: false });
    } catch (caught) {
      notify(caught.message || "Không thể tải thông tin tiếp nhận", "error");
      setModal({ open: false, row: null, loading: false });
    }
  }

  function closeModal() {
    setModal({ open: false, row: null, loading: false });
  }

  async function handleSaved() {
    closeModal();
    notify("Đã lưu thông tin tiếp nhận bệnh nhân");
    await load();
  }

  const total = pagination?.total ?? rows.length;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Tiếp nhận bệnh nhân</h1>
          <p>
            Theo dõi lịch khám trong ngày và ghi nhận thông tin ban đầu trước khi
            bác sĩ thăm khám.
          </p>
        </div>
        <div className="admin-summary">
          <div className="admin-summary-card">
            <span className="admin-summary-icon"><ClipboardCheck size={20} /></span>
            <span><small>Lịch phù hợp</small><strong>{total.toLocaleString("vi-VN")}</strong></span>
          </div>
          <div className="admin-summary-card">
            <span className="admin-summary-icon"><UserRoundCheck size={20} /></span>
            <span><small>Đã tiếp nhận (trang này)</small><strong>{receivedCount}</strong></span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error.message || "Không thể tải danh sách tiếp nhận"}
        </div>
      ) : null}

      <section className="admin-panel">
        <form className="admin-filters" onSubmit={submitFilters}>
          <label className="admin-search">
            <Search size={18} />
            <input
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Tìm tên, mã bệnh nhân hoặc số điện thoại"
            />
          </label>
          <input
            aria-label="Ngày khám"
            className="admin-filter-select"
            type="date"
            value={filters.date}
            onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
          />
          <select
            aria-label="Trạng thái lịch khám"
            className="admin-filter-select"
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
          >
            <option value="">Tất cả trạng thái lịch</option>
            {APPOINTMENT_STATUSES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select
            aria-label="Trạng thái tiếp nhận"
            className="admin-filter-select"
            value={filters.receptionStatus}
            onChange={(event) => setFilters((current) => ({ ...current, receptionStatus: event.target.value }))}
          >
            <option value="">Tất cả tiếp nhận</option>
            <option value="pending">Chưa tiếp nhận</option>
            <option value="received">Đã tiếp nhận</option>
          </select>
          <button className="admin-excel-button" type="submit">
            <Search size={17} /> Tìm kiếm
          </button>
          <button className="admin-excel-button" type="button" onClick={resetFilters}>
            <RotateCcw size={17} /> Đặt lại
          </button>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã bệnh nhân</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Ngày · Giờ khám</th>
                <th>Trạng thái lịch</th>
                <th>Tiếp nhận</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="admin-empty" colSpan="7">Đang tải dữ liệu...</td></tr>
              ) : rows.length ? rows.map((row) => (
                <tr key={row.appointmentId}>
                  <td><span className="admin-code">{row.patient?.code || `BN-${row.patientId}`}</span></td>
                  <td>
                    <span className="admin-name-cell">
                      <strong>{row.patient?.fullName || `Bệnh nhân #${row.patientId}`}</strong>
                      <small>{row.patient?.phone || "Chưa có số điện thoại"}</small>
                    </span>
                  </td>
                  <td>{row.doctor?.fullName || `Bác sĩ #${row.doctorId}`}</td>
                  <td>{formatDate(row.appointmentDate)} · {String(row.appointmentTime || "").slice(0, 5)}</td>
                  <td>{STATUS_LABELS[row.appointmentStatus] || row.appointmentStatus || "-"}</td>
                  <td>
                    <span className={row.hasReception ? "admin-status" : "inline-flex rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700"}>
                      {row.receptionStatus}
                    </span>
                    {row.checkInAt ? <small className="mt-1 block text-slate-500">{formatDateTime(row.checkInAt)}</small> : null}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className={row.hasReception ? "admin-action" : "admin-add-button"}
                        type="button"
                        title={row.hasReception ? "Xem/Cập nhật" : "Tiếp nhận"}
                        onClick={() => openReception(row)}
                      >
                        {row.hasReception ? <><Edit3 size={16} /><span className="sr-only">Xem/Cập nhật</span></> : <><UserRoundCheck size={16} /> Tiếp nhận</>}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="admin-empty" colSpan="7">Không có lịch khám phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination ? (
          <AdminPagination
            page={query.page}
            limit={query.limit}
            total={total}
            totalPages={pagination.total_pages}
            itemLabel="lịch khám"
            onPageChange={(page) => setQuery((current) => ({ ...current, page }))}
          />
        ) : null}
      </section>

      <Modal
        title={modal.row?.hasReception ? "Xem/Cập nhật tiếp nhận" : "Tiếp nhận bệnh nhân"}
        open={modal.open}
        onClose={closeModal}
      >
        {modal.loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Đang tải thông tin...</div>
        ) : modal.row ? (
          <ReceptionForm appointment={modal.row} onSaved={handleSaved} onCancel={closeModal} />
        ) : null}
      </Modal>
    </div>
  );
}

function ReceptionForm({ appointment, onSaved, onCancel }) {
  const { notify } = useToast();
  const reception = appointment.reception || {};
  const [form, setForm] = useState(() => ({
    weight: reception.weight ?? "",
    height: reception.height ?? "",
    temperature: reception.temperature ?? "",
    systolicBloodPressure: reception.systolicBloodPressure ?? "",
    diastolicBloodPressure: reception.diastolicBloodPressure ?? "",
    heartRate: reception.heartRate ?? "",
    spo2: reception.spo2 ?? "",
    initialSymptoms: reception.initialSymptoms ?? "",
    notes: reception.notes ?? "",
  }));
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        VITAL_FIELDS.map(({ name }) => [
          name,
          form[name] === "" ? null : Number(form[name]),
        ]),
      );
      payload.initialSymptoms = form.initialSymptoms.trim();
      payload.notes = form.notes.trim();

      if (appointment.hasReception) {
        await updateReception(appointment.appointmentId, payload);
      } else {
        await createReception({ appointmentId: appointment.appointmentId, ...payload });
      }
      await onSaved();
    } catch (caught) {
      notify(caught.message || "Không thể lưu thông tin tiếp nhận", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={submit}>
      <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
        <p><strong>Bệnh nhân:</strong> {appointment.patient?.fullName || `#${appointment.patientId}`}</p>
        <p><strong>Mã bệnh nhân:</strong> {appointment.patient?.code || `#${appointment.patientId}`}</p>
        <p><strong>Số điện thoại:</strong> {appointment.patient?.phone || "-"}</p>
        <p><strong>Bác sĩ:</strong> {appointment.doctor?.fullName || `#${appointment.doctorId}`}</p>
        <p><strong>Lịch khám:</strong> {formatDate(appointment.appointmentDate)} · {String(appointment.appointmentTime || "").slice(0, 5)}</p>
        <p><strong>Check-in:</strong> {formatDateTime(appointment.checkInAt)}</p>
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Clock3 size={17} /> Chỉ số ban đầu
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {VITAL_FIELDS.map((field) => (
            <label className="grid gap-1 text-sm font-medium text-slate-700" key={field.name}>
              {field.label} ({field.unit})
              <input
                className="form-input"
                type="number"
                inputMode="decimal"
                step={field.step}
                min={field.min}
                max={field.max}
                value={form[field.name]}
                onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}
                placeholder="Không bắt buộc"
              />
            </label>
          ))}
        </div>
      </div>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Triệu chứng ban đầu
        <textarea
          className="form-input min-h-24"
          maxLength="4000"
          value={form.initialSymptoms}
          onChange={(event) => setForm((current) => ({ ...current, initialSymptoms: event.target.value }))}
          placeholder="Ghi nhận triệu chứng người bệnh mô tả; không tự động kết luận chẩn đoán"
        />
      </label>

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        Ghi chú
        <textarea
          className="form-input min-h-20"
          maxLength="4000"
          value={form.notes}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Thông tin bổ sung khi tiếp nhận"
        />
      </label>

      {reception.recordedAt ? (
        <p className="text-xs text-slate-500">Ghi nhận lần đầu: {formatDateTime(reception.recordedAt)}</p>
      ) : null}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel}>Hủy</button>
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : appointment.hasReception ? <><Eye size={16} /> Lưu cập nhật</> : <><UserRoundCheck size={16} /> Xác nhận tiếp nhận</>}
        </button>
      </div>
    </form>
  );
}
