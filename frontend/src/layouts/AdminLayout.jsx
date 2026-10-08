import { BookOpen, Building2, ChevronDown, Hospital, LayoutDashboard, LogOut, Menu, Pill, Sparkles, Stethoscope, Users } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const adminMenu = [
  { to: "/patients", label: "Quản lý Bệnh nhân", icon: Users },
  { to: "/staff", label: "Quản lý Bác sĩ", icon: Stethoscope },
  { to: "/specialties", label: "Quản lý Chuyên khoa", icon: Building2 },
  { to: "/pharmacy", label: "Quản lý Thuốc", icon: Pill },
  { to: "/diseases", label: "Danh mục Bệnh", icon: BookOpen },
  { to: "/drug-suggestions", label: "Gợi ý Thuốc", icon: Sparkles },
];

const pageNames = {
  "/dashboard": "Tổng quan",
  "/patients": "Quản lý Bệnh nhân",
  "/staff": "Quản lý Bác sĩ",
  "/specialties": "Quản lý Chuyên khoa",
  "/pharmacy": "Quản lý Thuốc",
  "/diseases": "Danh mục Bệnh",
  "/drug-suggestions": "Gợi ý Thuốc",
};

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = pageNames[location.pathname] || "Quản trị hệ thống";
  const displayName = user?.HoTen || user?.fullName || user?.TenDangNhap || user?.username || "Quản trị viên";

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}>
        <Link className="admin-brand" to="/dashboard" onClick={() => setSidebarOpen(false)}>
          <span className="admin-brand-icon"><Hospital size={26} /></span>
          <span><strong>BỆNH VIỆN ĐA KHOA QUỐC TẾ</strong><small>HỆ THỐNG QUẢN TRỊ</small></span>
        </Link>
        <nav className="admin-nav">
          {adminMenu.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-system-status"><span /><small>Hệ thống ổn định</small><b>LIVE</b></div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb"><button type="button" onClick={() => setSidebarOpen((value) => !value)}><Menu size={20} /></button><Link to="/dashboard">Admin</Link><span>/</span><strong>{pageName}</strong></div>
          <div className="admin-user-wrap">
            <button className="admin-user-trigger" type="button" onClick={() => setUserOpen((value) => !value)}>
              <span className="admin-user-avatar">{displayName.charAt(0).toUpperCase()}</span>
              <span><strong>{displayName}</strong><small>Quản trị viên</small></span><ChevronDown size={17} />
            </button>
            {userOpen ? <div className="admin-user-menu"><button type="button" onClick={handleLogout}><LogOut size={16} /> Đăng xuất</button></div> : null}
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </section>
    </div>
  );
}
