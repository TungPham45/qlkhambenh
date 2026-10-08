import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

export function PublicLoginPage() {
  const { isAuthenticated, user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to={getRoleHomeRoute(user)} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const authenticatedUser = await login(form);
      const roleHome = getRoleHomeRoute(authenticatedUser);
      const requestedPath = location.state?.from?.pathname;
      const target = roleHome === "/" && requestedPath ? requestedPath : roleHome;
      navigate(target, { replace: true });
    } catch (caught) {
      setError(caught?.message || "Đăng nhập không thành công.");
    }
  }

  return (
    <div className="public-page auth-public-page">
      <PublicHeader />
      <main className="public-auth-main">
        <section className="public-auth-card">
          <div className="public-auth-heading"><small>Cổng thông tin bệnh viện</small><h1>Đăng nhập tài khoản</h1><p>Nhập thông tin để tiếp tục sử dụng hệ thống.</p></div>
          {location.state?.message ? <div className="public-alert public-alert-success">{location.state.message}</div> : null}
          {error ? <div className="public-alert public-alert-error">{error}</div> : null}
          <form className="public-form" onSubmit={handleSubmit}>
            <label className="public-field"><span>Tên đăng nhập</span><div className="public-input-icon"><UserRound size={18} /><input autoFocus autoComplete="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.trimStart() })} placeholder="Nhập tên đăng nhập" required /></div></label>
            <label className="public-field"><span>Mật khẩu</span><div className="public-input-icon"><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Nhập mật khẩu" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
            <button className="public-button public-button-primary public-button-block" type="submit" disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</button>
          </form>
          <p className="public-auth-switch">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
        </section>
      </main>
    </div>
  );
}
