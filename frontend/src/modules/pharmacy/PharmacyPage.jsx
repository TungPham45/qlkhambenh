import { useState } from "react";
import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function PharmacyPage() {
  const [tab, setTab] = useState("drugs");
  return (
    <div className="grid gap-4">
      <div className="flex gap-2">
        <button className={tab === "drugs" ? "btn-primary" : "btn-secondary"} type="button" onClick={() => setTab("drugs")}>Thuốc</button>
        <button className={tab === "prescriptions" ? "btn-primary" : "btn-secondary"} type="button" onClick={() => setTab("prescriptions")}>Đơn thuốc</button>
      </div>
      <ResourceListPage config={tab === "drugs" ? resourceConfigs.drugs : resourceConfigs.prescriptions} />
    </div>
  );
}
