export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",

    profile: "/auth/profile",

    changePassword:
      "/auth/change-password",
  },

  dashboard: {
    summary: "/dashboard/summary",
  },

  patients: "/patients",

  appointments: "/appointments",

  billings: "/billings",

  drugs: "/drugs",

  prescriptions: "/prescriptions",

  medicalRecords:
    "/medical-records",

  medicalHistory:
    "/medical-records/history",

  diseases: "/diseases",

  reception: "/reception",

  notifications: {
    list: "/notifications",
    unreadCount: "/notifications/unread-count",
    readAll: "/notifications/read-all",
  },

  staffs: "/admin/staff",

  accounts: "/accounts",

  analytics: {
    dashboard:
      "/analytics/dashboard",

    kpis: "/analytics/kpis",
    averages:
      "/analytics/averages",
    distributions:
      "/analytics/distributions",
    trends:
      "/analytics/trends",
    forecast:
      "/analytics/forecast",
    anomalies:
      "/analytics/anomalies",
    timeseries:
      "/analytics/timeseries",
  },
  statistics: {
    averages:
      "/statistics/averages",
    distributions:
      "/statistics/distributions",
    trends:
      "/statistics/trends",
    forecast:
      "/statistics/forecast",
    anomalies:
      "/statistics/anomalies",
    timeseries:
      "/statistics/timeseries",
  },
};
