import { useAuth } from "../../context/AuthContext.jsx";
import { hasAnyRole } from "../../utils/roles.js";

export function RoleGate({ roles, children, fallback = null }) {
  const { user } = useAuth();
  return hasAnyRole(user, roles) ? children : fallback;
}
