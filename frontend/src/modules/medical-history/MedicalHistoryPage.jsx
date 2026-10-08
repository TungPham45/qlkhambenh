import { Eye, RotateCcw, Search, Stethoscope } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DataTable } from "../../components/table/DataTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatCurrency, formatDate } from "../../utils/formatters.js";
import { AdminPagination } from "../admin/AdminPagination.jsx";

import { MedicalHistoryDetailModal } from "./components/MedicalHistoryDetailModal.jsx";
import { getMedicalHistoryDetail, listMedicalHistory } from "./services/medicalHistoryApi.js";

const EMPTY_FILTERS = {
  search: "",
  from: "",
  to: "",
  patientId: "",
  doctorId: "",
};

function truncate(value, maxLength = 72) {
  const text = String(value || "").trim();
  if (!text) return "-";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

function paymentStatusLabel(status) {
  if (status === "Da thanh toan") return "Đã thanh toán";
  if (status === "Thanh toan mot phan") return "Một phần";
  if (status === "Huy") return "Đã hủy";
  return status ? "Chưa thanh toán" : "Chưa có hóa đơn";
}

export function MedicalHistoryPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  const isPatient = role === "nguoidung";
  const isAdmin = role === "admin";
  const canFilterPatient = isAdmin || role === "bacsi";

  const initialPatientId = searchParams.get("patientId") || "";
  const [filters, setFilters] = useState(() => ({ ...EMPTY_FILTERS, patientId: initialPatientId }));
  const [activeQuery, setActiveQuery] = useState(() => ({
    page: 1,
    limit: 10,
    ...(initialPatientId ? { patientId: initialPatientId } : {}),
  }));
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, total_pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const load = useCallback(async (query) => {
    setLoading(true);
    setError("");
    try {
      const result = await listMedicalHistory(query);
      setRows(result.rows);
      setPagination(result.pagination || {
        total: result.rows.length,
        page: query.page || 1,
        limit: query.limit || 10,
        total_pages: result.rows.length ? 1 : 0,
      });
    } catch (caught) {
      const message = caught.message || "Không thể tải lịch sử khám";
      setRows([]);
      setError(message);
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    load(activeQuery);
  }, [activeQuery, load]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setActiveQuery({ ...filters, page: 1, limit: activeQuery.limit || 10 });
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setActiveQuery({ page: 1, limit: activeQuery.limit || 10 });
  }

  function changePage(page) {
    setActiveQuery((current) => ({ ...current, page }));
  }

  async function openDetail(row) {
    setSelectedRecord(row);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const detail = await getMedicalHistoryDetail(row.id);
      setSelectedRecord(detail);
    } catch (caught) {
      notify(caught.message || "Không thể tải chi tiết lần khám", "error");
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }

  const columns = useMemo(() => {
    const result = [
      {
        key: "recordCode",
        header: "Mã phiếu",
        render: (row) => <span className="font-semibold text-blue-700">{row.recordCode}</span>,
      },
      {
        key: "appointmentCode",
        header: "Lịch hẹn",
      },
    ];

    if (!isPatient) {
      result.push({
        key: "patient",
        header: "Bệnh nhân",
        render: (row) => (
          <span>
            <strong className="block text-slate-900">{row.patient?.fullName || "-"}</strong>
            <small className="text-slate-500">{row.patient?.code || ""}</small>
          </span>
        ),
      });
    }

    result.push(
      {
        key: "doctor",
        header: "Bác sĩ",
        render: (row) => row.doctor?.fullName || "-",
      },
      {
        key: "examinationDate",
        header: "Ngày khám",
        render: (row) => formatDate(row.examinationDate),
      },
      {
        key: "diagnosis",
        header: "Chẩn đoán",
        render: (row) => truncate(row.diagnoses?.find((item) => item.isPrimary)?.name || row.diagnosis),
      },
      {
        key: "conclusion",
        header: "Kết luận",
        render: (row) => truncate(row.conclusion),
      },
      {
        key: "payment",
        header: "Thanh toán",
        render: (row) => (
          <span>
            <strong className="block text-slate-800">{paymentStatusLabel(row.invoice?.paymentStatus)}</strong>
            {row.invoice ? <small className="text-slate-500">{formatCurrency(row.invoice.totalAmount)}</small> : null}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        render: (row) => (
          <button className="btn-secondary whitespace-nowrap px-3 py-1.5" type="button" onClick={() => openDetail(row)}>
            <Eye className="h-4 w-4" /> Xem chi tiết
          </button>
        ),
      }
    );
    return result;
  }, [isPatient]);

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>{isPatient ? "Lịch sử khám của tôi" : "Tra cứu lịch sử khám"}</h1>
          <p>
            {isPatient
              ? "Xem lại kết quả khám, chẩn đoán, đơn thuốc và hóa đơn của bạn."
              : "Tra cứu các lần khám cùng thông tin chẩn đoán, điều trị, đơn thuốc và thanh toán."}
          </p>
        </div>
        <div className="admin-summary">
          <div className="admin-summary-card">
            <span className="admin-summary-icon"><Stethoscope size={20} /></span>
            <span><small>Tổng số lần khám</small><strong>{Number(pagination.total || 0).toLocaleString("vi-VN")}</strong></span>
          </div>
        </div>
      </div>

      {error ? <div className="mb-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <section className="admin-panel">
        <form className="admin-filters" onSubmit={handleSubmit}>
          <label className="admin-search">
            <Search size={18} />
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder={isPatient ? "Tìm theo mã phiếu, triệu chứng, chẩn đoán..." : "Tìm theo mã phiếu, bệnh nhân, bác sĩ, chẩn đoán..."}
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            Từ ngày
            <input className="form-input h-[43px] min-w-[145px]" type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-slate-500">
            Đến ngày
            <input className="form-input h-[43px] min-w-[145px]" type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} />
          </label>
          {canFilterPatient ? (
            <label className="grid gap-1 text-xs font-semibold text-slate-500">
              Mã bệnh nhân
              <input className="form-input h-[43px] w-[145px]" min="1" type="number" value={filters.patientId} onChange={(event) => updateFilter("patientId", event.target.value)} placeholder="VD: 12" />
            </label>
          ) : null}
          {isAdmin ? (
            <label className="grid gap-1 text-xs font-semibold text-slate-500">
              Mã bác sĩ
              <input className="form-input h-[43px] w-[135px]" min="1" type="number" value={filters.doctorId} onChange={(event) => updateFilter("doctorId", event.target.value)} placeholder="VD: 3" />
            </label>
          ) : null}
          <button className="admin-add-button" type="submit"><Search size={17} /> Tra cứu</button>
          <button className="admin-excel-button" type="button" onClick={resetFilters}><RotateCcw size={17} /> Đặt lại</button>
        </form>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="id"
          loading={loading}
          emptyLabel="Không có lịch sử khám phù hợp"
        />

        <AdminPagination
          page={pagination.page || activeQuery.page || 1}
          limit={pagination.limit || activeQuery.limit || 10}
          total={pagination.total || 0}
          totalPages={pagination.total_pages || pagination.totalPages || 1}
          itemLabel="lần khám"
          onPageChange={changePage}
        />
      </section>

      <MedicalHistoryDetailModal
        record={selectedRecord}
        open={detailOpen}
        loading={detailLoading}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}

