import {
  createBrowserRouter,
} from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
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

// ── Người dùng portal ──────────────────────────────
import { UserPortalPage } from "../modules/user-portal/UserPortalPage.jsx";

// ── Bác sĩ ─────────────────────────────────────────
import { DoctorSchedulePage } from "../modules/doctor/DoctorSchedulePage.jsx";

// ── Lễ tân ─────────────────────────────────────────
import { ReceptionAppointmentsPage } from "../modules/appointments/ReceptionAppointmentsPage.jsx";
import { ReceptionBillingPage } from "../modules/billing/ReceptionBillingPage.jsx";

export const appRouter = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DefaultPage /> },

          // ── Shared / Admin ─────────────────────────
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/patients", element: <PatientsListPage /> },
          { path: "/appointments", element: <AppointmentsPage /> },
          { path: "/billing", element: <BillingPage /> },
          { path: "/pharmacy", element: <PharmacyPage /> },
          { path: "/medical-records", element: <MedicalRecordsPage /> },
          { path: "/accounts", element: <AccountsPage /> },
          { path: "/staff", element: <StaffPage /> },
          { path: "/analytics", element: <AnalyticsPage /> },
          { path: "/statistics", element: <StatisticsPage /> },

          // ── Người dùng (NguoiDung) ─────────────────
          { path: "/my-appointments", element: <UserPortalPage /> },
          { path: "/my-invoices", element: <UserPortalPage /> },
          { path: "/my-prescriptions", element: <UserPortalPage /> },
          { path: "/my-records", element: <UserPortalPage /> },

          // ── Bác sĩ (BacSi) ─────────────────────────
          { path: "/doctor-schedule", element: <DoctorSchedulePage /> },

          // ── Lễ tân (LeTan) ─────────────────────────
          { path: "/reception-appointments", element: <ReceptionAppointmentsPage /> },
          { path: "/reception-billing", element: <ReceptionBillingPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <DefaultPage /> },
]);