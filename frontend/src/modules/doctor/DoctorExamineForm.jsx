import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { httpClient } from "../../api/httpClient.js";
import { formatDate } from "../../utils/formatters.js";

export function DoctorExamineForm({ appointment, patient, onSaved, onCancel }) {
  const [drugs, setDrugs] = useState([]);
  const [form, setForm] = useState({
    TrieuChung: "",
    ChanDoan: "",
    KetLuan: "",
    NgayKham: appointment?.NgayKham?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  });
  const [items, setItems] = useState([{ MaThuoc: "", SoLuong: 1, LieuDung: "" }]);
  const [ghiChu, setGhiChu] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    httpClient
      .get("/drugs", { params: { limit: 200 } })
      .then((r) => {
        const rows = r.data?.data || r.data?.rows || [];
        setDrugs(Array.isArray(rows) ? rows : []);
      })
      .catch(() => setDrugs([]));
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // 1. Tạo phiếu khám (medical record)
      const recordRes = await httpClient.post("/medical-records", {
        MaLich: appointment.MaLich,
        MaBN: appointment.MaBN,
        MaBacSi: appointment.MaBacSi,
        NgayKham: form.NgayKham,
        TrieuChung: form.TrieuChung.trim() || null,
        ChanDoan: form.ChanDoan.trim() || null,
        KetLuan: form.KetLuan.trim() || null,
      });

      const newRecord = recordRes.data?.data || recordRes.data;
      const MaPhieu = newRecord?.MaPhieu || newRecord?.id;

      // 2. Kê thuốc nếu có thuốc hợp lệ
      const validItems = items.filter((item) => item.MaThuoc && item.SoLuong && item.LieuDung);
      if (MaPhieu && validItems.length > 0) {
        try {
          await httpClient.post("/prescriptions", {
            MaPhieu,
            MaBN: appointment.MaBN,
            MaBacSi: appointment.MaBacSi,
            NgayKeDon: form.NgayKham,
            GhiChu: ghiChu.trim() || null,
            ChiTiet: validItems.map((item) => ({
              MaThuoc: Number(item.MaThuoc),
              SoLuong: Number(item.SoLuong),
              LieuDung: String(item.LieuDung).trim(),
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
        TrangThai: "Da kham",
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
            ⚠ <strong>Lưu ý:</strong> Chưa chọn thuốc nào. Nếu không cần kê thuốc, hóa đơn sẽ chỉ gồm phí khám.
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
