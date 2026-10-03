import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints.js";
import { httpClient } from "../api/httpClient.js";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = { HoTen: "", TenDangNhap: "", MatKhau: "", GioiTinh: "", SoDienThoai: "", NgaySinh: "", DiaChi: "" };

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await httpClient.post(endpoints.auth.register, form);
      navigate("/login", { replace: true, state: { message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập." } });
    } catch (caught) {
      setError(caught.message || "Không thể đăng ký tài khoản");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <PublicHeader compact />
      <main className="auth-layout">
        <section className="auth-intro">
          <p className="public-eyebrow">Bắt đầu hành trình khỏe mạnh</p>
          <h1>Tạo tài khoản để được chăm sóc chu đáo hơn.</h1>
          <p>Lưu lại thông tin cá nhân, đặt lịch nhanh và chủ động theo dõi sức khỏe cùng Song Linh.</p>
          <ul className="auth-feature-list">
            <li><CheckCircle2 size={17} /> Hồ sơ cá nhân riêng tư</li>
            <li><CheckCircle2 size={17} /> Đặt lịch mọi lúc, mọi nơi</li>
            <li><CheckCircle2 size={17} /> Thông tin được đồng bộ an toàn</li>
          </ul>
        </section>
        <section className="auth-card">
          <div className="auth-card-header"><h1>Đăng ký tài khoản</h1><p>Tạo tài khoản bệnh nhân mới trong vài bước.</p></div>
          {error ? <div className="auth-error">{error}</div> : null}
          <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
            <div className="auth-form-grid">
              <Field label="Họ và tên" name="HoTen" value={form.HoTen} onChange={setField} required />
              <Field label="Tên đăng nhập" name="TenDangNhap" value={form.TenDangNhap} onChange={setField} required />
              <Field label="Mật khẩu" name="MatKhau" type="password" value={form.MatKhau} onChange={setField} required />
              <label className="auth-field">Giới tính<select value={form.GioiTinh} onChange={(event) => setField("GioiTinh", event.target.value)} required><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option></select></label>
              <Field label="Số điện thoại" name="SoDienThoai" value={form.SoDienThoai} onChange={setField} required />
              <Field label="Ngày sinh" name="NgaySinh" type="date" value={form.NgaySinh} onChange={setField} />
              <Field label="Địa chỉ" name="DiaChi" value={form.DiaChi} onChange={setField} required className="auth-field-wide" />
            </div>
            <button className="auth-primary-button" type="submit" disabled={loading}>{loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}</button>
          </form>
          <p className="auth-form-footer">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
          <Link className="auth-back-link" to="/">← Về trang chủ</Link>
        </section>
      </main>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, className = "" }) {
  return <label className={`auth-field ${className}`}>{label}<input type={type} value={value} required={required} onChange={(event) => onChange(name, event.target.value)} /></label>;
}
