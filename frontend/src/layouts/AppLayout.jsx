import { NavLink, Outlet,} from "react-router-dom";
import { BarChart3, Bell, CalendarDays, ChartNoAxesCombined, ClipboardCheck, ClipboardList, CreditCard, FileText, History, LayoutDashboard, LogOut, Menu, Moon, Pill, Sun, UserCog, Users,} from "lucide-react";
import { useMemo, useState,} from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { NotificationBell } from "../modules/notifications/NotificationBell.jsx";
import { PatientAvatarMenu } from "../components/public/PatientAvatarMenu.jsx";
const ROLE_MENUS = {
  admin: [
    {
      to: "/dashboard",
      label: "Bảng điều khiển",
      icon: LayoutDashboard,
    },

    {
      to: "/patients",
      label: "Bệnh nhân",
      icon: Users,
    },

    {
      to: "/appointments",
      label: "Lịch hẹn",
      icon: CalendarDays,
    },

    {
      to: "/billing",
      label: "Thanh toán",
      icon: CreditCard,
    },

    {
      to: "/pharmacy",
      label: "Nhà thuốc",
      icon: Pill,
    },

    {
      to: "/medical-records",
      label: "Hồ sơ bệnh án",
      icon: FileText,
    },

    {
      to: "/medical-history",
      label: "Lịch sử khám",
      icon: History,
    },

    {
      to: "/reception",
      label: "Tiếp nhận bệnh nhân",
      icon: ClipboardCheck,
    },

    {
      to: "/accounts",
      label: "Tài khoản",
      icon: UserCog,
    },

    {
      to: "/staff",
      label: "Nhân viên",
      icon: Users,
    },

    {
      to: "/analytics",
      label: "Phân tích",
      icon: ChartNoAxesCombined,
    },

    {
      to: "/statistics",
      label: "Thống kê",
      icon: BarChart3,
    },

    {
      to: "/notifications",
      label: "Thông báo",
      icon: Bell,
    },
  ],

  bacsi: [
    {
      to: "/doctor-schedule",
      label: "Lịch khám của tôi",
      icon: CalendarDays,
    },

    {
      to: "/patients",
      label: "Quản lý bệnh nhân",
      icon: Users,
    },

    {
      to: "/reception",
      label: "Tiếp nhận bệnh nhân",
      icon: ClipboardCheck,
    },

    {
      to: "/medical-history",
      label: "Tra cứu lịch sử khám",
      icon: History,
    },

    {
      to: "/medical-records",
      label: "Hồ sơ bệnh án",
      icon: FileText,
    },

    {
      to: "/pharmacy",
      label: "Kho thuốc",
      icon: Pill,
    },

    {
      to: "/notifications",
      label: "Thông báo",
      icon: Bell,
    },
  ],

  nguoidung: [
    {
      to: "/my-appointments",
      label: "Đặt lịch khám",
      icon: CalendarDays,
    },

    {
      to: "/my-invoices",
      label: "Hóa đơn của tôi",
      icon: CreditCard,
    },

    {
      to: "/my-prescriptions",
      label: "Thuốc đã kê",
      icon: Pill,
    },

    {
      to: "/my-records",
      label: "Lịch sử khám của tôi",
      icon: ClipboardList,
    },

    {
      to: "/notifications",
      label: "Thông báo",
      icon: Bell,
    },
  ],
};
export function AppLayout() {
  const [open, setOpen] =
    useState(false);
  const { user, logout } =
    useAuth();
  const {
    isDark,
    toggleTheme,
  } = useTheme();
  const userRole = String(
    user?.VaiTro || user?.role || ""
  ).toLowerCase();
  const navItems = useMemo(() => {
    return (
      ROLE_MENUS[userRole] ||
      ROLE_MENUS.nguoidung
    );
  }, [userRole]);
  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          open ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">
            <img
              src="/songlinh.jpg"
              alt="Logo phòng khám Song Linh"
            />
          </div>
          <div className="brand-text">
            <strong>
              Phòng khám Song Linh
            </strong>
            <p className="text-xs text-slate-500">
              Microservice React SPA
            </p>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() =>
                  setOpen(false)
                }
                className={({
                  isActive,
                }) =>
                  `nav-link ${
                    isActive
                      ? "nav-link-active"
                      : ""
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="icon-btn lg:hidden"
            type="button"
            onClick={() =>
              setOpen(
                (value) => !value
              )
            }
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="topbar-title">
            <strong>
              {user?.HoTen || user?.fullName || user?.username || user?.TenDangNhap ||
                "Người dùng"}
            </strong>

            <span>
              {user?.VaiTro ||
                "Không xác định"}
            </span>
          </div>

          <div className="topbar-actions">
            <NotificationBell />
            <button
              className="icon-btn"
              type="button"
              onClick={
                toggleTheme
              }
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {userRole === "nguoidung" ? <PatientAvatarMenu /> : <button
              className="btn-secondary"
              type="button"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />

              Đăng xuất
            </button>}
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
