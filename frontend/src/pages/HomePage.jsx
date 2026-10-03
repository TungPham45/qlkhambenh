import { Activity, ArrowRight, CalendarDays, ClipboardCheck, FileClock, HeartPulse, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ProfileDialog } from "../components/public/ProfileDialog.jsx";
import { PublicHeader } from "../components/public/PublicHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

const quickServices = [
  { icon: CalendarDays, title: "Đặt lịch khám", text: "Chọn bác sĩ chuyên khoa và thời gian phù hợp", tone: "blue", path: "/dat-lich-kham" },
  { icon: ClipboardCheck, title: "Hồ sơ sức khỏe", text: "Theo dõi thông tin và lịch sử chăm sóc sức khỏe", tone: "green", path: "/ho-so-suc-khoe" },
  { icon: FileClock, title: "Lịch khám", text: "Xem và quản lý các lịch khám của bạn", tone: "purple", path: "/lich-kham" },
];

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (isAuthenticated && getRoleHomeRoute(user) !== "/") {
    return <Navigate to={getRoleHomeRoute(user)} replace />;
  }

  function handleFeature(path) {
    navigate(path);
  }

  return (
    <div className="public-page">
      <PublicHeader onOpenProfile={() => setIsProfileOpen(true)} />
      <main>
        <section className="reference-hero">
          <div className="public-container reference-hero-grid">
            <div className="reference-hero-copy">
              <p className="reference-badge"><span /> Cổng Dịch Vụ Y Tế Thông Minh</p>
              <h1>Đặt lịch và quản lý lịch khám online</h1>
              <p className="reference-description">Chủ động đặt lịch khám chuyên khoa, theo dõi hồ sơ sức khỏe và quản lý lịch khám của bạn trên một hệ thống an toàn, thuận tiện.</p>
              <div className="reference-service-grid">
                {quickServices.map(({ icon: Icon, title, text, tone, path }) => <button className="reference-service-card" type="button" key={title} onClick={() => handleFeature(path)}><span className={`reference-service-icon ${tone}`}><Icon size={23} /></span><span><strong>{title}</strong><small>{text}</small></span></button>)}
              </div>
            </div>
            <div className="reference-hero-media">
              <img src="/clinic-support.png" alt="Nhân viên y tế hỗ trợ người bệnh" />
            </div>
          </div>
        </section>

        <section className="reference-trust-section"><div className="public-container reference-trust-grid"><div><ShieldCheck size={23} /><span><strong>Bảo mật thông tin</strong><small>Dữ liệu được bảo vệ an toàn</small></span></div><div><HeartPulse size={23} /><span><strong>Chăm sóc tận tâm</strong><small>Đồng hành cùng sức khỏe của bạn</small></span></div><div><Activity size={23} /><span><strong>Tiện ích hiện đại</strong><small>Trải nghiệm y tế số tiện lợi</small></span></div><button type="button" onClick={() => handleFeature("/dat-lich-kham")}>Bắt đầu sử dụng <ArrowRight size={17} /></button></div></section>
      </main>
      <ProfileDialog open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
