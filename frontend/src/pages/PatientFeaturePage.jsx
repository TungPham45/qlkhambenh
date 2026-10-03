import { CalendarDays, ClipboardCheck, FileClock, Home, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileDialog } from "../components/public/ProfileDialog.jsx";
import { PublicHeader } from "../components/public/PublicHeader.jsx";

const featureByPath = {
  "/dat-lich-kham": {
    icon: CalendarDays,
    title: "Đặt lịch khám",
    description: "Khu vực đặt lịch được tách riêng và sẽ được kết nối khi chức năng sẵn sàng.",
  },
  "/ho-so-suc-khoe": {
    icon: ClipboardCheck,
    title: "Hồ sơ sức khỏe",
    description: "Khu vực hồ sơ sức khỏe được tách riêng và sẽ được kết nối khi chức năng sẵn sàng.",
  },
  "/lich-kham": {
    icon: FileClock,
    title: "Lịch khám",
    description: "Khu vực lịch khám được tách riêng và sẽ được kết nối khi chức năng sẵn sàng.",
  },
};

export function PatientFeaturePage() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const feature = featureByPath[location.pathname] || featureByPath["/lich-kham"];
  const Icon = feature.icon;

  return (
    <div className="public-page patient-feature-page">
      <PublicHeader onOpenProfile={() => setIsProfileOpen(true)} />
      <main className="patient-feature-main">
        <section className="patient-feature-card">
          <span className="patient-feature-icon"><Icon size={34} /></span>
          <p><LockKeyhole size={15} /> Khu vực dành riêng cho bệnh nhân</p>
          <h1>{feature.title}</h1>
          <div>{feature.description}</div>
          <Link to="/"><Home size={17} /> Quay về trang chủ</Link>
        </section>
      </main>
      <ProfileDialog open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
