import {
  createBrowserRouter,
} from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout.jsx";
import { AdminLayout } from "../layouts/AdminLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

import { HomePage } from "../pages/HomePage.jsx";
import { PublicLoginPage } from "../pages/PublicLoginPage.jsx";
import { PublicRegisterPage } from "../pages/PublicRegisterPage.jsx";
import { DefaultPage } from "../pages/DefaultPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { AnalyticsPage } from "../pages/AnalyticsPage.jsx";
import { StatisticsPage } from "../pages/StatisticsPage.jsx";

import { PatientsListPage } from "../modules/patients/pages/PatientsListPage.jsx";
import { AppointmentsPage } from "../modules/appointments/AppointmentsPage.jsx";
import { BillingPage } from "../modules/billing/BillingPage.jsx";
import { PharmacyPage } from "../modules/pharmacy/PharmacyPage.jsx";
import { MedicalRecordsPage } from "../modules/medical-records/MedicalRecordsPage.jsx";
import { AccountsPage } from "../modules/accounts/AccountsPage.jsx";
import { StaffPage } from "../modules/accounts/StaffPage.jsx";
import { SpecialtiesPage } from "../modules/specialties/SpecialtiesPage.jsx";
import { AdminPlaceholderPage } from "../pages/AdminPlaceholderPage.jsx";

// ── Người dùng portal ──────────────────────────────
import { UserPortalPage } from "../modules/user-portal/UserPortalPage.jsx";

// ── Bác sĩ ─────────────────────────────────────────
import { DoctorSchedulePage } from "../modules/doctor/DoctorSchedulePage.jsx";
import { roles } from "../utils/roles.js";

export const appRouter = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <PublicLoginPage /> },
  { path: "/register", element: <PublicRegisterPage /> },

  {
    element: <ProtectedRoute roles={roles.admin} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/patients", element: <PatientsListPage /> },
          { path: "/pharmacy", element: <PharmacyPage /> },
          { path: "/medical-records", element: <MedicalRecordsPage /> },
          { path: "/appointments", element: <AppointmentsPage /> },
          { path: "/billing", element: <BillingPage /> },
          { path: "/accounts", element: <AccountsPage /> },
          { path: "/staff", element: <StaffPage /> },
          { path: "/specialties", element: <SpecialtiesPage /> },
          { path: "/diseases", element: <AdminPlaceholderPage title="Danh Mục Bệnh" /> },
          { path: "/drug-suggestions", element: <AdminPlaceholderPage title="Gợi Ý Thuốc" /> },
          { path: "/analytics", element: <AnalyticsPage /> },
          { path: "/statistics", element: <StatisticsPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute roles={roles.doctor} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/patients", element: <PatientsListPage /> },
          { path: "/pharmacy", element: <PharmacyPage /> },
          { path: "/medical-records", element: <MedicalRecordsPage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute roles={roles.doctor} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/doctor-schedule", element: <DoctorSchedulePage /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute roles={roles.patient} />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/my-appointments", element: <UserPortalPage /> },
          { path: "/my-invoices", element: <UserPortalPage /> },
          { path: "/my-prescriptions", element: <UserPortalPage /> },
          { path: "/my-records", element: <UserPortalPage /> },
        ],
      },
    ],
  },

  { path: "/redirect", element: <ProtectedRoute />, children: [{ index: true, element: <DefaultPage /> }] },
  { path: "*", element: <HomePage /> },
]);
