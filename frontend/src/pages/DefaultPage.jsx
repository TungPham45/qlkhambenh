import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getRoleHomeRoute } from "../utils/roles.js";

export function DefaultPage() {
  const { user } = useAuth();
  return <Navigate to={getRoleHomeRoute(user)} replace />;
}
