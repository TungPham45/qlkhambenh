import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function PharmacyPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("drugs");
  const isAdmin = String(user?.VaiTro || user?.role || "").toLowerCase() === "admin";
  const drugsConfig = useMemo(
    () => ({
      ...resourceConfigs.drugs,
      canCreate: isAdmin,
      canEdit: isAdmin,
      canDelete: isAdmin,
    }),
    [isAdmin],
  );
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button className={tab === "drugs" ? "btn-primary" : "btn-secondary"} type="button" onClick={() => setTab("drugs")}>Thuốc</button>
        <button className={tab === "prescriptions" ? "btn-primary" : "btn-secondary"} type="button" onClick={() => setTab("prescriptions")}>Đơn thuốc</button>
      </div>
      <ResourceListPage config={tab === "drugs" ? drugsConfig : resourceConfigs.prescriptions} />
    </div>
  );
}
