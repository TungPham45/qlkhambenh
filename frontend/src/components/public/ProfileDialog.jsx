import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { endpoints } from "../../api/endpoints.js";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../context/AuthContext.jsx";

function getValue(user, ...keys) {
  return keys.map((key) => user?.[key]).find((value) => value !== undefined && value !== null) || "";
}

export function ProfileDialog({ open, onClose }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      fullName: getValue(user, "fullName", "HoTen"),
      phone: getValue(user, "phone", "SoDienThoai"),
      dateOfBirth: getValue(user, "dateOfBirth", "NgaySinh")?.slice(0, 10),
      gender: getValue(user, "gender", "GioiTinh"),
      address: getValue(user, "address", "DiaChi"),
    });
    setError("");
  }, [open, user]);

  if (!open) return null;

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, value]) => value !== "")
      );
      const response = await httpClient.put(endpoints.auth.profile, payload);
      const nextUser = response?.user || response?.data?.user;
      if (nextUser) updateUser(nextUser);
      onClose();
    } catch (caught) {
      setError(caught?.message || "Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-dialog-title">
      <button className="profile-modal-backdrop" type="button" aria-label="Đóng cửa sổ" onClick={onClose} />
      <section className="profile-dialog">
        <div className="profile-dialog-header">
          <div>
            <p className="public-eyebrow">Tài khoản của bạn</p>
            <h2 id="profile-dialog-title">Thay đổi thông tin</h2>
          </div>
          <button className="profile-close-button" type="button" aria-label="Đóng" onClick={onClose}>
            <X size={19} aria-hidden="true" />
          </button>
        </div>

        {error ? <p className="auth-error">{error}</p> : null}

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Họ và tên
            <input value={form.fullName} onChange={(event) => setField("fullName", event.target.value)} />
          </label>
          <label>
            Số điện thoại
            <input value={form.phone} onChange={(event) => setField("phone", event.target.value)} />
          </label>
          <label>
            Ngày sinh
            <input type="date" value={form.dateOfBirth} onChange={(event) => setField("dateOfBirth", event.target.value)} />
          </label>
          <label>
            Giới tính
            <select value={form.gender} onChange={(event) => setField("gender", event.target.value)}>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
              <option value="Khac">Khác</option>
            </select>
          </label>
          <label className="profile-form-wide">
            Địa chỉ
            <input value={form.address} onChange={(event) => setField("address", event.target.value)} />
          </label>
          <div className="profile-dialog-actions">
            <button className="auth-secondary-button" type="button" onClick={onClose}>Hủy</button>
            <button className="auth-primary-button" type="submit" disabled={loading}>
              <Save size={17} aria-hidden="true" />
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
