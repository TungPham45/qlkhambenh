import { useAuth } from "../context/AuthContext.jsx";
import { AdminLayout } from "./AdminLayout.jsx";
import { AppLayout } from "./AppLayout.jsx";

export function RoleBasedLayout() {
  const { user } = useAuth();
  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  return role === "admin" ? <AdminLayout /> : <AppLayout />;
}
