import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

import {
  hasAnyRole,
} from "../utils/roles.js";

export function ProtectedRoute({
  roles = [],
}) {
  const {
    bootstrapped,
    isAuthenticated,
    user,
  } = useAuth();

  const location = useLocation();

  if (!bootstrapped) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-slate-500">
        Đang khởi tạo phiên đăng nhập...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  const requiresRole =
    Array.isArray(roles) &&
    roles.length > 0;

  if (
    requiresRole &&
    !hasAnyRole(user, roles)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          unauthorized: true,
        }}
      />
    );
  }

  return <Outlet />;
}