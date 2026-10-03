import { useEffect, useState } from "react";

const emptyPatient = {
  HoTen: "",
  NgaySinh: "",
  GioiTinh: "Nam",
  SoDienThoai: "",
  Email: "",
  DiaChi: "",
  SoBaoHiemYTe: "",
  TrangThai: "Active"
};

export function PatientForm({ initialValue, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyPatient);

  useEffect(() => {
    setForm(initialValue ? { ...emptyPatient, ...initialValue } : emptyPatient);
  }, [initialValue]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Họ và tên
          <input className="form-input" required value={form.HoTen} onChange={(event) => updateField("HoTen", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Ngày sinh
          <input className="form-input" type="date" value={form.NgaySinh || ""} onChange={(event) => updateField("NgaySinh", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Giới tính
          <select className="form-input" value={form.GioiTinh || ""} onChange={(event) => updateField("GioiTinh", event.target.value)}>
            <option value="Nam">Nam</option>
            <option value="Nu">Nữ</option>
            <option value="Khac">Khác</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Số điện thoại
          <input className="form-input" required value={form.SoDienThoai || ""} onChange={(event) => updateField("SoDienThoai", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Email
          <input className="form-input" type="email" value={form.Email || ""} onChange={(event) => updateField("Email", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Địa chỉ
          <input className="form-input" value={form.DiaChi || ""} onChange={(event) => updateField("DiaChi", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Số bảo hiểm y tế
          <input className="form-input" value={form.SoBaoHiemYTe || ""} onChange={(event) => updateField("SoBaoHiemYTe", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Trạng thái
          <select className="form-input" value={form.TrangThai || "Active"} onChange={(event) => updateField("TrangThai", event.target.value)}>
            <option value="Active">Đang hoạt động</option>
            <option value="Inactive">Ngừng hoạt động</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu bệnh nhân"}
        </button>
      </div>
    </form>
  );
}
