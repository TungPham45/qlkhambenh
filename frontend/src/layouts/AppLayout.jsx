import {
  Bell,
  BriefcaseMedical,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  LogOut,
  Menu,
  Pill,
  ShieldPlus,
  Sparkles,
  Stethoscope,
  UserRoundCog,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ROLE_MENUS = {
  admin: [
    { to: "/patients", label: "Quản lý Bệnh nhân", icon: UsersRound },
    { to: "/staff", label: "Quản lý Bác sĩ", icon: Stethoscope },
    { to: "/admin/specialties", label: "Quản lý Chuyên khoa", icon: BriefcaseMedical },
    { to: "/pharmacy", label: "Quản lý Thuốc", icon: Pill },
    { to: "/admin/diseases", label: "Danh mục Bệnh", icon: ClipboardList },
    { to: "/admin/drug-suggestions", label: "Gợi ý Thuốc", icon: Sparkles },
  ],
  bacsi: [
    { to: "/doctor-schedule", label: "Lịch khám của tôi", icon: CalendarDays },
    { to: "/patients", label: "Quản lý Bệnh nhân", icon: UsersRound },
    { to: "/medical-records", label: "Hồ sơ bệnh án", icon: FileText },
    { to: "/pharmacy", label: "Kho thuốc", icon: Pill },
  ],
  nguoidung: [
    { to: "/my-appointments", label: "Đặt lịch khám", icon: CalendarDays },
    { to: "/my-records", label: "Bệnh án của tôi", icon: ClipboardList },
  ],
};

const PAGE_NAMES = {
  "/dashboard": "Bảng điều khiển",
  "/patients": "Quản lý Bệnh nhân",
  "/staff": "Quản lý Bác sĩ",
  "/admin/specialties": "Quản lý Chuyên khoa",
  "/pharmacy": "Quản lý Thuốc",
  "/admin/diseases": "Danh mục Bệnh",
  "/admin/drug-suggestions": "Gợi ý Thuốc",
  "/appointments": "Quản lý Lịch khám",
  "/billing": "Quản lý Thanh toán",
  "/medical-records": "Hồ sơ Bệnh án",
  "/accounts": "Quản lý Tài khoản",
  "/analytics": "Phân tích",
  "/statistics": "Thống kê",
  "/doctor-schedule": "Lịch khám của tôi",
};

function getDisplayName(user) {
  return user?.fullName || user?.HoTen || user?.TenDangNhap || user?.username || "Người dùng";
}

function getRoleName(role) {
  if (role === "admin") return "Quản trị viên";
  if (role === "bacsi") return "Bác sĩ";
  return "Bệnh nhân";
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = String(user?.VaiTro || user?.role || "").toLowerCase();
  const displayName = getDisplayName(user);
  const initials = displayName.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
  const navItems = useMemo(() => ROLE_MENUS[userRole] || ROLE_MENUS.nguoidung, [userRole]);
  const pageName = PAGE_NAMES[location.pathname] || "Trang quản lý";

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="admin-shell">
      <button
        className={`admin-sidebar-backdrop ${sidebarOpen ? "is-visible" : ""}`}
        type="button"
        aria-label="Đóng menu"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand">
          <span><ShieldPlus size={26} /></span>
          <div><strong>BỆNH VIỆN ĐA KHOA QUỐC TẾ</strong><small>HỆ THỐNG QUẢN TRỊ</small></div>
          <button type="button" aria-label="Đóng menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <nav className="admin-nav" aria-label="Điều hướng quản trị">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `admin-nav-link ${isActive ? "is-active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-menu-button" type="button" aria-label="Mở menu" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <nav className="admin-breadcrumb" aria-label="Đường dẫn"><span>Admin</span><b>/</b><strong>{pageName}</strong></nav>
          </div>
          <div className="admin-topbar-actions">
            <div className="admin-shift"><Clock3 size={17} /><span>Ca trực: <strong>Sáng (07:00 - 15:30)</strong></span></div>
            <button className="admin-notification" type="button" aria-label="Thông báo"><Bell size={19} /><span>3</span></button>
            <div className="admin-account" ref={accountRef}>
              <button type="button" className="admin-account-trigger" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen}>
                <span className="admin-account-avatar">{initials || <UserRoundCog size={18} />}</span>
                <span><strong>{displayName}</strong><small>{getRoleName(userRole)}</small></span>
                <ChevronDown size={17} />
              </button>
              {accountOpen ? (
                <div className="admin-account-menu">
                  <button type="button" onClick={handleLogout}><LogOut size={17} /> Đăng xuất</button>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
