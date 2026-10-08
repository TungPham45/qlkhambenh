import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints.js";
import { httpClient } from "../api/httpClient.js";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

const initialForm = { username: "", password: "", confirmPassword: "", fullName: "", phone: "", email: "", dateOfBirth: "", gender: "", address: "", healthInsuranceNumber: "" };

export function PublicRegisterPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={getRoleHomeRoute(user)} replace />;

  function setField(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự.");
    if (form.password !== form.confirmPassword) return setError("Mật khẩu xác nhận không khớp.");
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      await httpClient.post(endpoints.auth.register, payload);
      navigate("/login", { replace: true, state: { message: "Đăng ký thành công. Vui lòng đăng nhập." } });
    } catch (caught) {
      setError(caught?.message || "Không thể đăng ký tài khoản.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="public-page auth-public-page">
      <PublicHeader />
      <main className="public-auth-main public-auth-main-wide">
        <section className="public-auth-card public-register-card">
          <div className="public-auth-heading"><small>Đăng ký dành cho bệnh nhân</small><h1>Tạo tài khoản mới</h1><p>Thông tin được dùng để đặt lịch và quản lý hồ sơ sức khỏe.</p></div>
          {error ? <div className="public-alert public-alert-error">{error}</div> : null}
          <form className="public-form" onSubmit={handleSubmit}>
            <div className="public-form-grid">
              <Field label="Họ và tên" value={form.fullName} onChange={(value) => setField("fullName", value)} required />
              <Field label="Số điện thoại" value={form.phone} onChange={(value) => setField("phone", value)} required />
              <Field label="Tên đăng nhập" value={form.username} onChange={(value) => setField("username", value.trimStart())} required />
              <Field label="Email" type="email" value={form.email} onChange={(value) => setField("email", value)} />
              <Field label="Mật khẩu" type="password" value={form.password} onChange={(value) => setField("password", value)} required />
              <Field label="Xác nhận mật khẩu" type="password" value={form.confirmPassword} onChange={(value) => setField("confirmPassword", value)} required />
              <Field label="Ngày sinh" type="date" value={form.dateOfBirth} onChange={(value) => setField("dateOfBirth", value)} />
              <label className="public-field"><span>Giới tính</span><select value={form.gender} onChange={(event) => setField("gender", event.target.value)}><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option></select></label>
              <Field label="Địa chỉ" value={form.address} onChange={(value) => setField("address", value)} />
              <Field label="Số bảo hiểm y tế" value={form.healthInsuranceNumber} onChange={(value) => setField("healthInsuranceNumber", value)} />
            </div>
            <button className="public-button public-button-primary public-button-block" type="submit" disabled={loading}>{loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}</button>
          </form>
          <p className="public-auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </section>
      </main>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required = false }) {
  return <label className="public-field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} /></label>;
}
