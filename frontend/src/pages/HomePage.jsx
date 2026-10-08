import { CalendarDays, ClipboardList, Clock3, HeartPulse, ShieldCheck } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

const services = [
  { title: "Đặt lịch khám", description: "Chủ động chọn bác sĩ, chuyên khoa và thời gian phù hợp", icon: CalendarDays, to: "/my-appointments", tone: "blue" },
  { title: "Hồ sơ sức khỏe", description: "Theo dõi kết quả khám và thông tin sức khỏe của bạn", icon: ClipboardList, to: "/my-records", tone: "green" },
  { title: "Lịch khám", description: "Xem lịch đã đặt và theo dõi trạng thái cuộc hẹn", icon: Clock3, to: "/my-appointments", tone: "amber" },
];

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const role = String(user?.VaiTro || user?.role || "").toLowerCase();

  if (isAuthenticated && role !== "nguoidung") {
    return <Navigate to={getRoleHomeRoute(user)} replace />;
  }

  return (
    <div className="public-page">
      <PublicHeader />
      <main className="home-main">
        <section className="home-hero">
          <div className="home-copy">
            <div className="home-eyebrow"><ShieldCheck size={17} /> Cổng dịch vụ y tế trực tuyến</div>
            <h1>Đặt lịch và quản lý sức khỏe <span>thuận tiện hơn</span></h1>
            <p className="home-lead">Chủ động đặt lịch khám, theo dõi lịch hẹn và quản lý hồ sơ sức khỏe trong một không gian an toàn, rõ ràng và dễ sử dụng.</p>
            <div className="home-services">
              {services.map(({ title, description, icon: Icon, to, tone }) => (
                <Link key={title} className="home-service-card" to={isAuthenticated ? to : "/login"} state={!isAuthenticated ? { from: { pathname: to } } : undefined}>
                  <span className={`home-service-icon home-service-icon-${tone}`}><Icon size={24} /></span>
                  <span><strong>{title}</strong><small>{description}</small></span>
                </Link>
              ))}
            </div>
            {!isAuthenticated ? (
              <div className="home-cta-row">
                <Link className="public-button public-button-primary public-button-large" to="/register">Đăng ký tài khoản</Link>
                <Link className="public-button public-button-secondary public-button-large" to="/login">Đăng nhập</Link>
              </div>
            ) : null}
          </div>
          <div className="home-visual">
            <img src="/images/reception-patient.png" alt="Nhân viên y tế hỗ trợ bệnh nhân tại phòng khám" />
            <div className="home-visual-note"><HeartPulse size={20} /><span><strong>Chăm sóc tận tâm</strong><small>Đồng hành cùng sức khỏe của bạn</small></span></div>
          </div>
        </section>
      </main>
    </div>
  );
}
