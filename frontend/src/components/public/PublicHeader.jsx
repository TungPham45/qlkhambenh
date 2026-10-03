import { ChevronDown, LogOut, ShieldPlus, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

function getDisplayName(user) {
  return user?.fullName || user?.HoTen || user?.username || user?.TenDangNhap || "Tài khoản";
}

function getInitials(name) {
  return name.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
}

export function PublicHeader({ compact = false, onOpenProfile }) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const displayName = getDisplayName(user);
  const patientCode = user?.MaBN ? `Mã BN: #BN-${String(user.MaBN).padStart(5, "0")}` : "Tài khoản trực tuyến";

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!accountRef.current?.contains(event.target)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleLogout() {
    setIsMenuOpen(false);
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className={`public-header ${compact ? "public-header-compact" : ""}`}>
      <Link className="public-brand" to="/" aria-label="Về trang chủ Bệnh viện đa khoa quốc tế">
        <span className="public-brand-mark"><ShieldPlus size={27} strokeWidth={2.2} /></span>
        <span><strong>BỆNH VIỆN ĐA KHOA QUỐC TẾ <em>CLINIC</em></strong><small>Hệ thống Quản lý Hồ Sơ &amp; Đặt Lịch Khám Trực Tuyến</small></span>
      </Link>

      <div className="public-header-actions">
        {isAuthenticated ? (
          <div className="public-account" ref={accountRef}>
            <button className="public-account-trigger" type="button" aria-expanded={isMenuOpen} aria-haspopup="menu" onClick={() => setIsMenuOpen((open) => !open)}>
              <span className="public-avatar">{getInitials(displayName)}</span>
              <span className="public-account-copy"><strong>{displayName}</strong><small>{patientCode}</small></span>
              <ChevronDown size={17} aria-hidden="true" />
            </button>
            {isMenuOpen ? <div className="public-account-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setIsMenuOpen(false); onOpenProfile?.(); }}><UserRound size={17} aria-hidden="true" />Thay đổi thông tin</button>
              <button type="button" role="menuitem" onClick={handleLogout}><LogOut size={17} aria-hidden="true" />Đăng xuất</button>
            </div> : null}
          </div>
        ) : <><Link className="public-login-link" to="/login">Đăng nhập</Link><Link className="public-signup-button" to="/register">Đăng ký</Link></>}
      </div>
    </header>
  );
}
