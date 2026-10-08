import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { endpoints } from "../../api/endpoints.js";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function ProfileDialog({ open, onClose }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", dateOfBirth: "", gender: "", address: "", healthInsuranceNumber: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      fullName: user?.fullName || user?.HoTen || "",
      phone: user?.phone || user?.SoDienThoai || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || user?.NgaySinh || "",
      gender: user?.gender || user?.GioiTinh || "",
      address: user?.address || user?.DiaChi || "",
      healthInsuranceNumber: user?.healthInsuranceNumber || user?.SoBaoHiemYTe || "",
    });
    setMessage("");
    setError("");
  }, [open, user]);

  if (!open) return null;

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await httpClient.put(endpoints.auth.profile, form);
      const nextUser = response?.user || response?.data?.user || { ...user, ...form };
      updateUser(nextUser);
      setMessage("Cập nhật thông tin thành công.");
    } catch (caught) {
      setError(caught?.message || "Không thể cập nhật thông tin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="public-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="public-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <div className="public-modal-head"><div><small>Hồ sơ bệnh nhân</small><h2 id="profile-title">Thay đổi thông tin</h2></div><button type="button" onClick={onClose} aria-label="Đóng"><X size={20} /></button></div>
        {message ? <div className="public-alert public-alert-success">{message}</div> : null}
        {error ? <div className="public-alert public-alert-error">{error}</div> : null}
        <form className="public-form" onSubmit={handleSubmit}>
          <div className="public-form-grid">
            <Field label="Họ và tên" value={form.fullName} onChange={(value) => setField("fullName", value)} required />
            <Field label="Số điện thoại" value={form.phone} onChange={(value) => setField("phone", value)} required />
            <Field label="Email" type="email" value={form.email} onChange={(value) => setField("email", value)} />
            <Field label="Ngày sinh" type="date" value={form.dateOfBirth} onChange={(value) => setField("dateOfBirth", value)} />
            <label className="public-field"><span>Giới tính</span><select value={form.gender} onChange={(event) => setField("gender", event.target.value)}><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option></select></label>
            <Field label="Số bảo hiểm y tế" value={form.healthInsuranceNumber} onChange={(value) => setField("healthInsuranceNumber", value)} />
            <Field className="public-field-wide" label="Địa chỉ" value={form.address} onChange={(value) => setField("address", value)} />
          </div>
          <div className="public-form-actions"><button className="public-button public-button-secondary" type="button" onClick={onClose}>Hủy</button><button className="public-button public-button-primary" type="submit" disabled={saving}><Save size={17} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}</button></div>
        </form>
      </section>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required = false, className = "" }) {
  return <label className={`public-field ${className}`}><span>{label}</span><input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} /></label>;
}
