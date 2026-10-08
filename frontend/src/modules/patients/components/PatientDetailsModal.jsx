import { CalendarDays, ClipboardList, Stethoscope, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { httpClient } from "../../../api/httpClient.js";
import { unwrapRows } from "../../../api/response.js";
import { Modal } from "../../../components/common/Modal.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { formatDate } from "../../../utils/formatters.js";
import { getPatient } from "../services/patientApi.js";

export function PatientDetailsModal({ patientId, open, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDoctor = String(user?.VaiTro || user?.role || "").toLowerCase() === "bacsi";
  const [state, setState] = useState({ loading: false, error: "", patient: null, appointments: [], records: [] });

  useEffect(() => {
    if (!open || !patientId) return undefined;
    let active = true;
    setState((current) => ({ ...current, loading: true, error: "" }));

    Promise.all([
      getPatient(patientId),
      httpClient.get("/appointments", { params: { MaBN: patientId, limit: 20 } }),
      httpClient.get("/medical-records/history", { params: { patientId, limit: 20 } }),
    ])
      .then(([patient, appointmentResponse, recordResponse]) => {
        if (!active) return;
        setState({
          loading: false,
          error: "",
          patient,
          appointments: unwrapRows(appointmentResponse).rows,
          records: unwrapRows(recordResponse).rows,
        });
      })
      .catch((error) => {
        if (!active) return;
        setState({ loading: false, error: error.message || "Không thể tải chi tiết bệnh nhân", patient: null, appointments: [], records: [] });
      });

    return () => { active = false; };
  }, [open, patientId]);

  function goTo(path) {
    onClose();
    navigate(path);
  }

  const { loading, error, patient, appointments, records } = state;
  return (
    <Modal title="Chi tiết bệnh nhân" open={open} onClose={onClose}>
      {loading ? <p className="py-10 text-center text-sm text-slate-500">Đang tải thông tin bệnh nhân...</p> : null}
      {error ? <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {!loading && patient ? (
        <div className="grid gap-4">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-blue-600" /> Thông tin bệnh nhân</h3>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Mã bệnh nhân" value={`BN-${String(patient.MaBN).padStart(5, "0")}`} />
              <Info label="Họ và tên" value={patient.HoTen} />
              <Info label="Ngày sinh" value={formatDate(patient.NgaySinh)} />
              <Info label="Giới tính" value={patient.GioiTinh} />
              <Info label="Số điện thoại" value={patient.SoDienThoai} />
              <Info label="Bảo hiểm y tế" value={patient.SoBaoHiemYTe} />
              <Info label="Email" value={patient.Email} />
              <Info label="Địa chỉ" value={patient.DiaChi} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="h-4 w-4 text-blue-600" /> Lịch hẹn thuộc phạm vi phụ trách ({appointments.length})</h3>
            <div className="grid max-h-44 gap-2 overflow-auto">
              {appointments.length ? appointments.map((item) => (
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm" key={item.MaLich}>
                  <span>#{item.MaLich} · {formatDate(item.NgayKham)} {String(item.GioKham || "").slice(0, 5)}</span>
                  <strong>{item.TrangThai || "-"}</strong>
                </div>
              )) : <p className="text-sm text-slate-500">Chưa có lịch hẹn phù hợp.</p>}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold"><ClipboardList className="h-4 w-4 text-blue-600" /> Lịch sử khám ({records.length})</h3>
            <div className="grid max-h-44 gap-2 overflow-auto">
              {records.length ? records.map((item) => (
                <div className="rounded-md bg-slate-50 px-3 py-2 text-sm" key={item.id}>
                  <strong>{item.recordCode || `Phiếu #${item.id}`}</strong>
                  <span className="ml-2 text-slate-500">{formatDate(item.examinationDate)} · {item.diagnosis || "Chưa ghi chẩn đoán"}</span>
                </div>
              )) : <p className="text-sm text-slate-500">Chưa có hồ sơ bệnh án phù hợp.</p>}
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
            <button className="btn-secondary" type="button" onClick={() => goTo(`/medical-history?patientId=${patient.MaBN}`)}><ClipboardList className="h-4 w-4" /> Xem lịch sử khám</button>
            <button className="btn-primary" type="button" onClick={() => goTo(isDoctor ? "/doctor-schedule" : "/appointments")}><Stethoscope className="h-4 w-4" /> {isDoctor ? "Đến lịch khám của tôi" : "Đến quản lý lịch hẹn"}</button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function Info({ label, value }) {
  return <div><span className="text-xs font-semibold uppercase text-slate-500">{label}</span><p className="mt-1 text-slate-900">{value || "-"}</p></div>;
}
