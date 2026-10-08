export function hasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles.length) {
    return true;
  }

  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  return allowedRoles.map((item) => item.toLowerCase()).includes(role);
}

export const roles = {
  admin: ["Admin"],
  doctor: ["BacSi"],
  clinical: ["Admin", "BacSi"],
  patient: ["NguoiDung"],
};

export function getRoleHomeRoute(user) {
  const role = String(user?.VaiTro || user?.role || "").toLowerCase();

  if (role === "admin") return "/dashboard";
  if (role === "bacsi") return "/doctor-schedule";
  return "/";
}
