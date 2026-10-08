import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { httpClient } from "../../api/httpClient.js";
import { formatDate } from "../../utils/formatters.js";

export function DoctorExamineForm({ appointment, patient, onSaved, onCancel }) {
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [catalogError, setCatalogError] = useState("");
  const [form, setForm] = useState({
    TrieuChung: "",
    ChanDoan: "",
    KetLuan: "",
    NgayKham: appointment?.NgayKham?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    HuongDieuTri: "",
    NgayTaiKham: "",
  });
  const [items, setItems] = useState([{ MaThuoc: "", SoLuong: 1, LieuDung: "" }]);
  const [ghiChu, setGhiChu] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    httpClient
      .get("/drugs", { params: { limit: 200 } })
      .then((r) => {
        const rows = Array.isArray(r) ? r : r?.data || r?.rows || [];
        setDrugs(Array.isArray(rows) ? rows : []);
      })
      .catch((loadError) => {
        console.error("Failed to load drugs:", loadError);
        setDrugs([]);
      });

    httpClient
      .get("/diseases", { params: { status: "Active", limit: 100 } })
      .then((response) => {
        const rows = Array.isArray(response)
          ? response
          : response?.data || response?.rows || [];
        setDiseases(Array.isArray(rows) ? rows : []);
        setCatalogError("");
      })
      .catch((loadError) => {
        console.error("Failed to load disease catalog:", loadError);
        setCatalogError(
          loadError?.message || "Không thể tải danh mục bệnh; vẫn có thể nhập chẩn đoán bằng văn bản.",
        );
      });
  }, []);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateItem(index, key, value) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, { MaThuoc: "", SoLuong: 1, LieuDung: "" }]);
  }

  function removeItem(index) {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ MaThuoc: "", SoLuong: 1, LieuDung: "" }];
    });
  }

  function addDisease(diseaseId) {
    const id = Number(diseaseId);
    if (!id || selectedDiseases.some((item) => item.diseaseId === id)) return;
    setSelectedDiseases((current) => [
      ...current,
      { diseaseId: id, isPrimary: current.length === 0, note: "" },
    ]);
  }

  function setPrimaryDisease(diseaseId) {
    setSelectedDiseases((current) =>
      current.map((item) => ({
        ...item,
        isPrimary: item.diseaseId === diseaseId,
      })),
    );
  }

  function removeDisease(diseaseId) {
    setSelectedDiseases((current) => {
      const remaining = current.filter((item) => item.diseaseId !== diseaseId);
      if (remaining.length && !remaining.some((item) => item.isPrimary)) {
        return remaining.map((item, index) => ({
          ...item,
          isPrimary: index === 0,
        }));
      }
      return remaining;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // 1. Tạo phiếu khám (medical record)
      const recordRes = await httpClient.post("/medical-records", {
        appointmentId: appointment.MaLich,
        patientId: appointment.MaBN,
        doctorId: appointment.MaBacSi,
        examinationDate: form.NgayKham,
        symptoms: form.TrieuChung.trim() || null,
        diagnosis: form.ChanDoan.trim() || null,
        conclusion: form.KetLuan.trim() || null,
        treatmentDirection: form.HuongDieuTri.trim() || null,
        followUpDate: form.NgayTaiKham || null,
        diagnoses: selectedDiseases,
      });

      const newRecord = recordRes.data?.data || recordRes.data;
      const MaPhieu = newRecord?.MaPhieu || newRecord?.id;

      // 2. Kê thuốc nếu có thuốc hợp lệ
      const validItems = items.filter((item) => item.MaThuoc && item.SoLuong && item.LieuDung);
      if (MaPhieu && validItems.length > 0) {
        try {
          await httpClient.post("/prescriptions", {
            medicalRecordId: MaPhieu,
            patientId: appointment.MaBN,
            doctorId: appointment.MaBacSi,
            prescriptionDate: form.NgayKham,
            note: ghiChu.trim() || null,
            items: validItems.map((item) => ({
              drugId: Number(item.MaThuoc),
              quantity: Number(item.SoLuong),
              dosage: String(item.LieuDung).trim(),
            })),
          });
        } catch (prescriptionErr) {
          console.error("Failed to create prescription:", prescriptionErr);
          throw new Error("Không thể kê đơn thuốc: " + (prescriptionErr?.response?.data?.message || prescriptionErr.message));
        }
      } else if (MaPhieu && validItems.length === 0) {
        console.warn("No prescription items provided - skipping prescription creation");
      }

      // 3. Cập nhật trạng thái lịch
      await httpClient.patch(`/appointments/${appointment.MaLich}/status`, {
        status: "Da kham",
      });

      onSaved();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Có lỗi xảy ra, vui lòng thử lại";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {/* Patient info banner */}
      <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
        <p className="text-sm font-medium text-blue-900">
          🧑‍⚕️ Bệnh nhân:{" "}
          <strong>{patient ? patient.HoTen : `#${appointment.MaBN}`}</strong>
          {patient?.NgaySinh ? ` · ${patient.NgaySinh?.slice(0,4)} tuổi` : ""}
          {patient?.SoDienThoai ? ` · 📞 ${patient.SoDienThoai}` : ""}
        </p>
        <p className="text-xs text-blue-700 mt-0.5">
          Lịch #{appointment.MaLich} · {formatDate(appointment.NgayKham)} {appointment.GioKham || ""}
        </p>
      </div>

      {/* Diagnosis fields */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Kết quả khám</h3>
        <div className="grid gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Triệu chứng
            <textarea
              className="form-input min-h-20"
              placeholder="Nhập triệu chứng của bệnh nhân..."
              value={form.TrieuChung}
              onChange={(e) => setField("TrieuChung", e.target.value)}
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Chẩn đoán
              <textarea
                className="form-input min-h-20"
                placeholder="Chẩn đoán bệnh..."
                value={form.ChanDoan}
                onChange={(e) => setField("ChanDoan", e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Kết luận / Tái khám
              <textarea
                className="form-input min-h-20"
                placeholder="Kết luận và hướng điều trị..."
                value={form.KetLuan}
                onChange={(e) => setField("KetLuan", e.target.value)}
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Chọn bệnh từ danh mục
            <select
              className="form-input"
              value=""
              onChange={(event) => addDisease(event.target.value)}
            >
              <option value="">-- Chọn bệnh đang hoạt động --</option>
              {diseases
                .filter(
                  (disease) =>
                    !selectedDiseases.some(
                      (item) => item.diseaseId === Number(disease.id),
                    ),
                )
                .map((disease) => (
                  <option key={disease.id} value={disease.id}>
                    {disease.code} · {disease.name}
                  </option>
                ))}
            </select>
          </label>
          {catalogError ? (
            <p className="text-xs text-amber-700">{catalogError}</p>
          ) : null}
          {selectedDiseases.length ? (
            <ul className="grid gap-2">
              {selectedDiseases.map((item) => {
                const disease = diseases.find(
                  (candidate) => Number(candidate.id) === item.diseaseId,
                );
                return (
                  <li
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm"
                    key={item.diseaseId}
                  >
                    <span>
                      <strong>{disease?.code}</strong> · {disease?.name}
                      {item.isPrimary ? (
                        <span className="ml-2 text-xs font-semibold text-blue-700">
                          Chẩn đoán chính
                        </span>
                      ) : null}
                    </span>
                    <span className="flex items-center gap-2">
                      {!item.isPrimary ? (
                        <button
                          className="text-xs font-semibold text-blue-700"
                          onClick={() => setPrimaryDisease(item.diseaseId)}
                          type="button"
                        >
                          Chọn làm chính
                        </button>
                      ) : null}
                      <button
                        className="text-xs font-semibold text-rose-700"
                        onClick={() => removeDisease(item.diseaseId)}
                        type="button"
                      >
                        Bỏ chọn
                      </button>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Hướng điều trị
              <textarea
                className="form-input min-h-20"
                value={form.HuongDieuTri}
                onChange={(event) => setField("HuongDieuTri", event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Ngày tái khám
              <input
                className="form-input"
                type="date"
                value={form.NgayTaiKham}
                onChange={(event) => setField("NgayTaiKham", event.target.value)}
              />
            </label>
          </div>
        </div>
      </section>

      {/* Prescription */}
      <section className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">Kê đơn thuốc</h3>
          <button className="btn-secondary flex items-center gap-1 text-xs" type="button" onClick={addItem}>
            <Plus className="h-3.5 w-3.5" />
            Thêm thuốc
          </button>
        </div>
        {items.every((item) => !item.MaThuoc) && (
          <div className="mb-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
            ⚠ <strong>Lưu ý:</strong> Chưa chọn thuốc nào. Nếu không cần kê thuốc, lễ tân sẽ tạo hóa đơn chỉ với phí khám.
          </div>
        )}
        <div className="grid gap-2">
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 md:grid-cols-[2fr_80px_1.5fr_auto] items-end">
              <label className="grid gap-1 text-xs font-medium text-slate-600">
                {index === 0 ? "Tên thuốc" : ""}
                <select
                  className="form-input"
                  value={item.MaThuoc}
                  onChange={(e) => updateItem(index, "MaThuoc", e.target.value)}
                >
                  <option value="">-- Chọn thuốc --</option>
                  {drugs.map((d) => (
                    <option key={d.MaThuoc} value={d.MaThuoc}>
                      {d.TenThuoc} ({d.DonViTinh})
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-xs font-medium text-slate-600">
                {index === 0 ? "Số lượng" : ""}
                <input
                  className="form-input"
                  type="number"
                  min="1"
                  value={item.SoLuong}
                  onChange={(e) => updateItem(index, "SoLuong", e.target.value)}
                />
              </label>
              <label className="grid gap-1 text-xs font-medium text-slate-600">
                {index === 0 ? "Liều dùng / Hướng dẫn" : ""}
                <input
                  className="form-input"
                  placeholder="VD: 2 viên/ngày, sáng tối"
                  value={item.LieuDung}
                  onChange={(e) => updateItem(index, "LieuDung", e.target.value)}
                />
              </label>
              <button
                className="btn-danger px-2 py-2 h-[38px]"
                type="button"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <label className="grid gap-1 text-sm font-medium text-slate-700 mt-3">
          Ghi chú đơn thuốc
          <input
            className="form-input"
            placeholder="Ghi chú thêm nếu có..."
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
          />
        </label>
      </section>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          ⚠️ {error}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "✅ Hoàn thành khám"}
        </button>
      </div>
    </form>
  );
}
