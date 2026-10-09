import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export function PatientAvatarMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const navigate = useNavigate();
  const displayName = user?.HoTen || user?.fullName || user?.username || user?.TenDangNhap || "Bệnh nhân";

  useEffect(() => {
    function closeOutside(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    if (!open) return;
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function visitProfile() {
    setOpen(false);
    navigate("/my-profile");
  }

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="public-user" ref={menuRef}>
      <button ref={triggerRef} className="public-user-trigger" type="button" onClick={() => setOpen((current) => !current)} aria-label="Mở menu tài khoản bệnh nhân" aria-expanded={open} aria-haspopup="true">
        <span className="public-avatar" aria-hidden="true">{displayName.charAt(0).toUpperCase()}</span>
        <span className="public-user-name"><strong>{displayName}</strong><small>Bệnh nhân</small></span>
        <ChevronDown size={17} />
      </button>
      {open ? (
        <div className="public-user-menu">
          <button type="button" onClick={visitProfile}><UserRound size={16} /> Thông tin cá nhân</button>
          <button type="button" onClick={handleLogout}><LogOut size={16} /> Đăng xuất</button>
        </div>
      ) : null}
    </div>
  );
}
