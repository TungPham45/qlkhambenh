import { CalendarDays, ClipboardList, CreditCard, Pill, Stethoscope, UserRound } from "lucide-react";

import { Modal } from "../../../components/common/Modal.jsx";
import { formatCurrency, formatDate } from "../../../utils/formatters.js";

function Value({ children }) {
  return <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{children || "Chưa ghi nhận"}</p>;
}

function Field({ label, children }) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <Value>{children}</Value>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-blue-600" /> {title}
      </h3>
      {children}
    </section>
  );
}

function paymentStatusLabel(status) {
  if (status === "Da thanh toan") return "Đã thanh toán";
  if (status === "Thanh toan mot phan") return "Thanh toán một phần";
  if (status === "Huy") return "Đã hủy";
  return status ? "Chưa thanh toán" : "Chưa có hóa đơn";
}

export function MedicalHistoryDetailModal({ record, open, loading, onClose }) {
  return (
    <Modal
      title={record ? `Chi tiết lần khám ${record.recordCode || `#${record.id}`}` : "Chi tiết lần khám"}
      open={open}
      onClose={onClose}
    >
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Đang tải chi tiết lần khám...</div>
      ) : record ? (
        <div className="grid gap-4">
          <Section icon={CalendarDays} title="Thông tin lần khám">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mã phiếu khám">{record.recordCode}</Field>
              <Field label="Mã lịch hẹn">{record.appointmentCode}</Field>
              <Field label="Ngày khám">{formatDate(record.examinationDate)}</Field>
              <Field label="Giờ hẹn">{record.appointment?.appointmentTime?.slice(0, 5)}</Field>
            </div>
          </Section>

          <div className="grid gap-4 sm:grid-cols-2">
            <Section icon={UserRound} title="Bệnh nhân">
              <div className="grid gap-3">
                <Field label="Họ và tên">{record.patient?.fullName}</Field>
                <Field label="Mã bệnh nhân">{record.patient?.code}</Field>
                <Field label="Ngày sinh">{formatDate(record.patient?.dateOfBirth)}</Field>
                <Field label="Số điện thoại">{record.patient?.phone}</Field>
                <Field label="Bảo hiểm y tế">{record.patient?.healthInsuranceNumber}</Field>
              </div>
            </Section>

            <Section icon={Stethoscope} title="Bác sĩ">
              <div className="grid gap-3">
                <Field label="Họ và tên">{record.doctor?.fullName}</Field>
                <Field label="Mã bác sĩ">{record.doctor?.code}</Field>
                <Field label="Chuyên khoa / bằng cấp">{record.doctor?.specialty}</Field>
                <Field label="Số điện thoại">{record.doctor?.phone}</Field>
              </div>
            </Section>
          </div>

          <Section icon={ClipboardList} title="Nội dung khám và chẩn đoán">
            <div className="grid gap-4">
              <Field label="Triệu chứng">{record.symptoms}</Field>
              <Field label="Kết quả khám / chẩn đoán">{record.diagnosis}</Field>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Bệnh được chẩn đoán
                </span>
                {record.diagnoses?.length ? (
                  <ul className="mt-2 grid gap-2">
                    {record.diagnoses.map((diagnosis) => (
                      <li className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" key={diagnosis.id}>
                        <div className="flex flex-wrap items-center gap-2">
                          <strong>{diagnosis.name || "Bệnh chưa có tên"}</strong>
                          {diagnosis.code ? <span className="text-slate-500">({diagnosis.code})</span> : null}
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${diagnosis.isPrimary ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
                            {diagnosis.isPrimary ? "Chẩn đoán chính" : "Chẩn đoán phụ"}
                          </span>
                        </div>
                        {diagnosis.note ? <p className="mt-1 text-slate-600">{diagnosis.note}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Value>Chưa ghi nhận bệnh từ danh mục</Value>
                )}
              </div>
              <Field label="Kết luận">{record.conclusion}</Field>
              <Field label="Hướng điều trị">{record.treatmentDirection}</Field>
              <Field label="Ghi chú bác sĩ">{record.doctorNotes}</Field>
              <Field label="Ngày tái khám">{record.followUpDate ? formatDate(record.followUpDate) : null}</Field>
            </div>
          </Section>

          <Section icon={Pill} title="Đơn thuốc">
            {record.prescription ? (
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Mã đơn thuốc">{`DT-${String(record.prescription.id).padStart(5, "0")}`}</Field>
                  <Field label="Ngày kê đơn">{formatDate(record.prescription.prescriptionDate)}</Field>
                </div>
                <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                      <tr><th className="px-3 py-2">Thuốc</th><th className="px-3 py-2">Số lượng</th><th className="px-3 py-2">Liều dùng</th><th className="px-3 py-2">Hướng dẫn</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {record.prescription.items?.length ? record.prescription.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 font-medium text-slate-800">{item.drugName || `Thuốc #${item.drugId}`}</td>
                          <td className="px-3 py-2">{item.quantity} {item.unit || ""}</td>
                          <td className="px-3 py-2">{[item.dosage, item.frequency, item.durationDays ? `${item.durationDays} ngày` : ""].filter(Boolean).join(" · ") || "-"}</td>
                          <td className="px-3 py-2">{[item.route, item.instructions].filter(Boolean).join(" · ") || "-"}</td>
                        </tr>
                      )) : (
                        <tr><td className="px-3 py-6 text-center text-slate-500" colSpan="4">Đơn thuốc chưa có thuốc</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Field label="Ghi chú đơn thuốc">{record.prescription.note}</Field>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Lần khám này không có đơn thuốc.</p>
            )}
          </Section>

          <Section icon={CreditCard} title="Hóa đơn và thanh toán">
            {record.invoice ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mã hóa đơn">{record.invoice.id}</Field>
                <Field label="Ngày lập">{formatDate(record.invoice.createdDate)}</Field>
                <Field label="Phí khám">{formatCurrency(record.invoice.examinationFee)}</Field>
                <Field label="Tiền thuốc">{formatCurrency(record.invoice.drugFee)}</Field>
                <Field label="Tổng tiền">{formatCurrency(record.invoice.totalAmount)}</Field>
                <Field label="Trạng thái">{paymentStatusLabel(record.invoice.paymentStatus)}</Field>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Chưa có hóa đơn cho lần khám này.</p>
            )}
          </Section>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-slate-500">Không tìm thấy thông tin lần khám.</div>
      )}
    </Modal>
  );
}

