export function hasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles.length) {
    return true;
  }

  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  return allowedRoles.map((item) => item.toLowerCase()).includes(role);
}

export const roles = {
  admin: ["Admin", "admin"],
  staff: ["Admin", "BacSi", "LeTan"],
  patient: ["NguoiDung"]
};
