import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function DefaultPage() {
  const { user } = useAuth();
  const role = String(user?.VaiTro || "").toLowerCase();

  const defaultRoutes = {
    admin: "/dashboard",
    bacsi: "/doctor-schedule",
    letan: "/reception-appointments",
    nguoidung: "/my-appointments",
  };

  const defaultRoute = defaultRoutes[role] || "/my-appointments";

  return <Navigate to={defaultRoute} replace />;
}