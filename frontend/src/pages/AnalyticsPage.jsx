import { useEffect, useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { endpoints } from "../api/endpoints.js";
import { httpClient } from "../api/httpClient.js";
import { LoadingState } from "../components/feedback/LoadingState.jsx";
import { formatCurrency } from "../utils/formatters.js";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("month");
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter === "all") {
      // Gửi ngày tùy chỉnh khi chọn "Tất cả"
      params.append("from", dateRange.from);
      params.append("to", dateRange.to);
    } else {
      // Gửi filter và ngày khi chọn Today/Week/Month
      params.append("filter", filter);
      params.append("from", dateRange.from);
      params.append("to", dateRange.to);
    }
    const url = `${endpoints.analytics.dashboard}?${params.toString()}`;
    httpClient.get(url)
      .then((response) => setData(response.data))
      .catch((caught) => setError(caught.message || "Không thể tải analytics service"));
  }, [filter, dateRange]);

  if (error) {
    return <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>;
  }
  if (!data) {
    return <LoadingState label="Đang tải analytics-service..." />;
  }

  const summary = data.summary || {};
  const widgets = data.widgets || {};
  const charts = data.charts || {};

  const appointmentTrend = widgets.appointment_trends || [];
  const patientGrowth = widgets.patient_growth || [];
  const revenueTrend = widgets.revenue_trend || [];
  const topMedicines = widgets.top_medicines || [];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      setDateRange({ from: today, to: today });
    } else if (newFilter === "week") {
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
      setDateRange({ from, to });
    } else if (newFilter === "month") {
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
      setDateRange({ from, to });
    }
  };

  return (
    <div className="grid gap-5">
      <div className="page-toolbar">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Phân tích</h1>
            <p className="text-sm text-slate-500">Cập nhật: {new Date(data.generated_at).toLocaleString('vi-VN')}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["today", "week", "month", "all"].map((f) => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {f === "today" && "Hôm nay"}
                {f === "week" && "Tuần"}
                {f === "month" && "Tháng"}
                {f === "all" && "Tất cả"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filter === "all" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <label className="text-sm font-medium text-slate-900 block mb-3">Chọn khoảng thời gian tùy chỉnh</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Từ ngày</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Đến ngày</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Tổng bệnh nhân"
          value={summary.total_patients ?? 0}
          icon="👥"
          color="bg-blue-50 text-blue-700"
        />
        <KpiCard
          label="Lịch hẹn hôm nay"
          value={summary.appointments_today ?? 0}
          icon="📅"
          color="bg-green-50 text-green-700"
        />
        <KpiCard
          label="Doanh thu hôm nay"
          value={formatCurrency(summary.revenue_today ?? 0)}
          icon="💰"
          color="bg-orange-50 text-orange-700"
          isFormat
        />
        <KpiCard
          label="Bác sĩ hoạt động"
          value={summary.active_doctors ?? 0}
          icon="👨‍⚕️"
          color="bg-purple-50 text-purple-700"
        />
      </section>

      {/* Main Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Xu hướng doanh thu</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                  formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Trend */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Xu hướng lịch hẹn</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                <YAxis style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                  formatter={(value) => [value, "Lịch hẹn"]}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Top Medicines */}
        {topMedicines.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Thuốc được sử dụng nhiều nhất</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topMedicines.slice(0, 5)}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {topMedicines.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Patient Growth */}
        {patientGrowth.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-900">Tăng trưởng bệnh nhân</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                    formatter={(value) => [value, "Bệnh nhân mới"]}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Revenue Breakdown */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-slate-900">Doanh thu theo tháng</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueTrend.filter((_, i) => i % Math.ceil(revenueTrend.length / 12) === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" style={{ fontSize: "12px" }} />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" name="Doanh thu" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      {summary.monthly_revenue && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Tóm tắt doanh thu</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-slate-600">Doanh thu hôm nay</p>
              <p className="text-lg font-bold text-blue-700">{formatCurrency(summary.revenue_today || 0)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-slate-600">Doanh thu tháng này</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(summary.monthly_revenue || 0)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-slate-600">Tổng doanh thu</p>
              <p className="text-lg font-bold text-purple-700">
                {formatCurrency((revenueTrend || []).reduce((sum, item) => sum + (item.value || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, icon, color, isFormat }) {
  return (
    <article className={`${color} rounded-lg p-4 border border-slate-200 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${isFormat ? '' : ''}`}>{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </article>
  );
}
