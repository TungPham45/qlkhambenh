import { ChevronDown, HeartPulse, LogIn, LogOut, Phone, UserPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ProfileDialog } from "./ProfileDialog.jsx";

export function PublicHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function closeMenu(event) {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    }

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const displayName = user?.HoTen || user?.fullName || user?.TenDangNhap || user?.username || "Bệnh nhân";

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

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
          ) : (
            <div className="public-user" ref={menuRef}>
              <button className="public-user-trigger" type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen}>
                <span className="public-avatar">{displayName.charAt(0).toUpperCase()}</span>
                <span className="public-user-name"><strong>{displayName}</strong><small>Bệnh nhân</small></span>
                <ChevronDown size={17} />
              </button>
              {menuOpen ? (
                <div className="public-user-menu">
                  <button type="button" onClick={() => { setMenuOpen(false); setProfileOpen(true); }}>Thay đổi thông tin</button>
                  <button type="button" onClick={handleLogout}><LogOut size={16} /> Đăng xuất</button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <ProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
    </header>
  );
}
