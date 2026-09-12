import { useEffect, useState } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  ComposedChart, Area,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { AlertCircle, TrendingUp } from "lucide-react";
import { endpoints } from "../api/endpoints.js";
import { httpClient } from "../api/httpClient.js";
import { LoadingState } from "../components/feedback/LoadingState.jsx";
import { formatCurrency } from "../utils/formatters.js";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function StatisticsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
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

    const buildUrl = (endpoint) => {
      return `${endpoint}?${params.toString()}`;
    };

    Promise.all([
      httpClient.get(buildUrl(endpoints.statistics.averages)),
      httpClient.get(buildUrl(endpoints.statistics.distributions)),
      httpClient.get(buildUrl(endpoints.statistics.forecast)),
      httpClient.get(buildUrl(endpoints.statistics.trends)),
      httpClient.get(buildUrl(endpoints.statistics.anomalies)),
      httpClient.get(buildUrl(endpoints.statistics.timeseries))
    ])
      .then(([averages, distributions, forecast, trends, anomalies, timeseries]) =>
        setData({
          averages: averages.data,
          distributions: distributions.data,
          forecast: forecast.data,
          trends: trends.data,
          anomalies: anomalies.data,
          timeseries: timeseries.data
        })
      )
      .catch((caught) => setError(caught.message || "Không thể tải statistical service"));
  }, [filter, dateRange]);

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

  if (error) {
    return <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>;
  }
  if (!data) {
    return <LoadingState label="Đang tải statistical-service..." />;
  }

  const averages = data.averages || {};
  const distributions = data.distributions || {};
  const forecast = data.forecast || {};
  const trends = data.trends || {};
  const anomalies = data.anomalies || {};
  const timeseries = data.timeseries || {};

  return (
    <div className="grid gap-5">
      <div className="page-toolbar">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Thống kê</h1>
            <p className="text-sm text-slate-500">Phân tích chi tiết và dự báo</p>
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
        <StatCard
          label="Doanh thu TB"
          value={formatCurrency(averages.revenue_average ?? 0)}
          subtext="Trung bình hàng ngày"
          icon="📊"
          color="bg-blue-50 text-blue-700"
        />
        <StatCard
          label="Lịch hẹn TB"
          value={(averages.appointments_average ?? 0).toFixed(1)}
          subtext="Trung bình hàng ngày"
          icon="📅"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          label="Giờ cao điểm"
          value={distributions.peak_hour ? `${distributions.peak_hour}:00` : "-"}
          subtext="Thời gian bận nhất"
          icon="🕐"
          color="bg-orange-50 text-orange-700"
        />
        <StatCard
          label="Tỷ lệ tăng trưởng"
          value={`${(trends.revenue_growth_rate ?? 0).toFixed(1)}%`}
          subtext="Doanh thu"
          icon="📈"
          color="bg-purple-50 text-purple-700"
        />
      </section>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {["overview", "forecast", "anomalies", "distributions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab === "overview" && "Tổng quan"}
            {tab === "forecast" && "Dự báo"}
            {tab === "anomalies" && "Bất thường"}
            {tab === "distributions" && "Phân phối"}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid gap-5">
          {/* Revenue & Appointments Timeseries */}
          <div className="grid md:grid-cols-2 gap-5">
            {timeseries.revenue && timeseries.revenue.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Doanh thu theo ngày</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timeseries.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                      <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                        formatter={(value) => [formatCurrency(value), "Doanh thu"]}
                      />
                      <Area yAxisId="left" type="monotone" dataKey="value" fill="#3b82f6" stroke="#3b82f6" opacity={0.6} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {timeseries.appointments && timeseries.appointments.length > 0 && (
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Lịch hẹn theo ngày</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeseries.appointments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                        formatter={(value) => [value, "Lịch hẹn"]}
                      />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Growth Rates */}
          {trends && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Tỷ lệ tăng trưởng</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <p className="text-sm text-slate-600">Doanh thu</p>
                  <p className={`text-2xl font-bold mt-2 ${(trends.revenue_growth_rate ?? 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {(trends.revenue_growth_rate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">So với kỳ trước</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <p className="text-sm text-slate-600">Lịch hẹn</p>
                  <p className={`text-2xl font-bold mt-2 ${(trends.appointment_growth_rate ?? 0) >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {(trends.appointment_growth_rate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">So với kỳ trước</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <p className="text-sm text-slate-600">Tỷ lệ trung bình</p>
                  <p className="text-2xl font-bold mt-2 text-purple-700">
                    {(((trends.revenue_growth_rate ?? 0) + (trends.appointment_growth_rate ?? 0)) / 2).toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Tổng hợp</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "forecast" && (
        <div className="grid gap-5">
          {/* Revenue Forecast */}
          {forecast.revenue_prediction && forecast.revenue_prediction.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Dự báo doanh thu</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Phương pháp: {forecast.method || "Hồi quy tuyến tính"}</p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecast.revenue_prediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                    <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      formatter={(value) => [formatCurrency(value), "Dự báo"]}
                    />
                    <Area type="monotone" dataKey="value" fill="#3b82f6" stroke="#3b82f6" opacity={0.3} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Appointment Forecast */}
          {forecast.appointment_forecast && forecast.appointment_forecast.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-900">Dự báo lịch hẹn</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecast.appointment_forecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" style={{ fontSize: "12px" }} />
                    <YAxis />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      formatter={(value) => [Math.round(value), "Dự báo"]}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "anomalies" && (
        <div className="grid gap-5">
          {anomalies.baseline && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-slate-900">Phân tích bất thường</h3>
              </div>

              {/* Baseline Stats */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-slate-600">Giá trị trung bình</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {formatCurrency(anomalies.baseline.average || 0)}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-slate-600">Độ lệch chuẩn</p>
                  <p className="text-xl font-bold text-purple-700 mt-1">
                    {formatCurrency(anomalies.baseline.standard_deviation || 0)}
                  </p>
                </div>
              </div>

              {/* Anomaly Candidates */}
              {anomalies.candidates && anomalies.candidates.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Các ngày bất thường ({anomalies.candidates.length})</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {anomalies.candidates.map((item, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-600">{formatCurrency(item.value)}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-orange-200 text-orange-800 rounded">Bất thường</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-700 font-medium">✓ Không phát hiện bất thường</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "distributions" && (
        <div className="grid gap-5">
          {/* Appointment Distribution by Hour */}
          {distributions.appointment_hours && distributions.appointment_hours.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Phân phối lịch hẹn theo giờ</h3>
              <p className="text-sm text-slate-600 mb-4">Giờ cao điểm: <strong>{distributions.peak_hour}:00</strong></p>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributions.appointment_hours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" label={{ value: "Giờ trong ngày", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Số lịch hẹn", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      formatter={(value) => [value, "Lịch hẹn"]}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Status Distribution */}
          {distributions.status_distribution && distributions.status_distribution.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-slate-900">Phân phối trạng thái lịch hẹn</h3>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="value" name="Số lịch hẹn" />
                      <YAxis dataKey="label" type="category" name="Trạng thái" />
                      <Tooltip
                        cursor={{ fill: "rgba(150, 150, 150, 0.1)" }}
                        contentStyle={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                      />
                      <Scatter name="Trạng thái" data={distributions.status_distribution} fill="#8b5cf6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {distributions.status_distribution.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900">{item.label}</span>
                      <span className="text-lg font-bold text-slate-700">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, subtext, icon, color }) {
  return (
    <article className={`${color} rounded-lg p-4 border border-slate-200 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </article>
  );
}