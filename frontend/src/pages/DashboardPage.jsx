import { CalendarDays, CreditCard, Users, UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient.js";
import { endpoints } from "../api/endpoints.js";
import { formatCurrency } from "../utils/formatters.js";

const fallbackCards = [
  { label: "Bệnh nhân", value: "-", icon: Users, class: "kpi-blue" },
  { label: "Lịch hẹn hôm nay", value: "-", icon: CalendarDays, class: "kpi-green" },
  { label: "Doanh thu hôm nay", value: "-", icon: CreditCard, class: "kpi-orange" },
  { label: "Bác sĩ hoạt động", value: "-", icon: UserRoundCheck, class: "kpi-purple" }
];

export function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    httpClient.get(endpoints.analytics.dashboard)
      .then((response) => setSummary(response.data?.summary || null))
      .catch(() => setSummary(null));
  }, []);

  const cards = summary ? [
    { label: "Bệnh nhân", value: summary.total_patients, icon: Users, class: "kpi-blue" },
    { label: "Lịch hẹn hôm nay", value: summary.appointments_today, icon: CalendarDays, class: "kpi-green" },
    { label: "Doanh thu hôm nay", value: formatCurrency(summary.revenue_today), icon: CreditCard, class: "kpi-orange" },
    { label: "Bác sĩ hoạt động", value: summary.active_doctors, icon: UserRoundCheck, class: "kpi-purple" }
  ] : fallbackCards;

  return (
    <div className="grid gap-6">
      <div className="page-toolbar">
        <div>
          <h1 className="text-2xl font-bold">Bảng điều khiển</h1>
        </div>
      </div>
      <section className="kpi-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className={`kpi-card ${card.class}`} key={card.label}>
              <div className="kpi-icon">
                <Icon />
              </div>
              <div>
                <p className="kpi-label">{card.label}</p>
                <strong className="kpi-value">{card.value}</strong>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
