import { HeartPulse, LogIn, Phone, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { PatientAvatarMenu } from "./PatientAvatarMenu.jsx";
import { getRoleHomeRoute } from "../../utils/roles.js";

export function PublicHeader() {
  const { isAuthenticated, user } = useAuth();
  const isPatient = String(user?.VaiTro || user?.role || "").toLowerCase() === "nguoidung";

  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link className="public-brand" to="/" aria-label="Về trang chủ">
          <span className="public-brand-mark"><HeartPulse size={28} /></span>
          <span><strong>BỆNH VIỆN ĐA KHOA QUỐC TẾ</strong><small>Hệ thống quản lý và đặt lịch khám trực tuyến</small></span>
        </Link>

        <div className="public-header-actions">
          <a className="public-hotline" href="tel:19006422"><Phone size={19} /><span>Hotline: <strong>1900 6422</strong></span></a>
          {!isAuthenticated ? (
            <div className="public-auth-actions">
              <Link className="public-button public-button-secondary" to="/register"><UserPlus size={17} /> Đăng ký</Link>
              <Link className="public-button public-button-primary" to="/login"><LogIn size={17} /> Đăng nhập</Link>
            </div>
          ) : isPatient ? <PatientAvatarMenu /> : <Link className="public-button public-button-primary" to={getRoleHomeRoute(user)}>Vào hệ thống</Link>}
        </div>
      </div>
    </header>
  );
}
