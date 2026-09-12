import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function AccountsPage() {
  const { role } = useAuth();

  if (String(role || "").toLowerCase() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <ResourceListPage config={resourceConfigs.accounts} />;
}