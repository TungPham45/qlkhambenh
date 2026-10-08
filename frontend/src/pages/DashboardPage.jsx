import { Building2, Stethoscope, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpClient } from "../api/httpClient.js";

export function DashboardPage() {
  const [summary, setSummary] = useState({ patients: "-", doctors: "-", specialties: "-" });

  useEffect(() => {
    Promise.all([
      httpClient.get("/patients", { params: { page: 1, limit: 1 } }),
      httpClient.get("/staff", { params: { page: 1, limit: 1 } }),
      httpClient.get("/specialties", { params: { page: 1, limit: 1 } }),
    ]).then(([patients, doctors, specialties]) => setSummary({ patients: patients.pagination?.total ?? 0, doctors: doctors.pagination?.total ?? 0, specialties: specialties.pagination?.total ?? 0 })).catch(() => {});
  }, []);

  const cards = [
    { label: "Tổng số bệnh nhân", value: summary.patients, icon: Users, to: "/patients" },
    { label: "Tổng số bác sĩ", value: summary.doctors, icon: Stethoscope, to: "/staff" },
    { label: "Tổng số chuyên khoa", value: summary.specialties, icon: Building2, to: "/specialties" },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-head"><div><h1>Tổng Quan Quản Trị</h1><p>Truy cập nhanh các khu vực quản lý chính của bệnh viện.</p></div></div>
      <section className="admin-dashboard-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link className="admin-dashboard-card" key={card.label} to={card.to}><Icon size={26} /><span>{card.label}</span><strong>{typeof card.value === "number" ? card.value.toLocaleString("vi-VN") : card.value}</strong></Link>
          );
        })}
      </section>
    </div>
  );
}
