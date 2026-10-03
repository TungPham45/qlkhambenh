import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    const username = form.username.trim();
    if (!username || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login({ username, password: form.password });
      const roleHomeRoute = getRoleHomeRoute(loggedInUser);
      const requestedPath = location.state?.from?.pathname;
      navigate(roleHomeRoute === "/" && requestedPath ? requestedPath : roleHomeRoute, { replace: true });
    } catch (caught) {
      setError(caught?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <PublicHeader compact />
      <main className="auth-layout">
        <section className="auth-intro">
          <p className="public-eyebrow">Chào mừng trở lại</p>
          <h1>Chăm sóc sức khỏe bắt đầu từ một lần đăng nhập.</h1>
          <p>Truy cập lịch khám, hồ sơ sức khỏe và các dịch vụ phù hợp với bạn tại Song Linh.</p>
          <ul className="auth-feature-list">
            <li>✓ Theo dõi lịch hẹn dễ dàng</li>
            <li>✓ Quản lý thông tin sức khỏe an toàn</li>
            <li>✓ Kết nối với đội ngũ bác sĩ</li>
          </ul>
        </section>
        <section className="auth-card">
          <div className="auth-card-header">
            <h1>Đăng nhập</h1>
            <p>Nhập thông tin tài khoản để tiếp tục.</p>
          </div>
          {error ? <div className="auth-error">{error}</div> : null}
          {location.state?.message ? <div className="auth-success">{location.state.message}</div> : null}
          <form className="auth-form" autoComplete="off" onSubmit={handleSubmit}>
            <label className="auth-field">
              Tên đăng nhập
              <input type="text" name="clinic-login-username" placeholder="Nhập tên đăng nhập" autoComplete="off" autoFocus required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.trimStart() })} />
            </label>
            <label className="auth-field">
              Mật khẩu
              <input type="password" name="clinic-login-password" placeholder="Nhập mật khẩu" autoComplete="off" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
            </label>
            <button className="auth-primary-button" type="submit" disabled={loading || !form.username.trim() || !form.password.trim()}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
          </form>
          <p className="auth-form-footer">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
          <Link className="auth-back-link" to="/">← Về trang chủ</Link>
        </section>
      </main>
    </div>
  );
}
