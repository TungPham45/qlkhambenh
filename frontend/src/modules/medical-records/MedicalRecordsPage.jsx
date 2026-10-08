import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function MedicalRecordsPage() {
  const { user } = useAuth();
  const isDoctor = String(user?.VaiTro || user?.role || "").toLowerCase() === "bacsi";
  const config = useMemo(
    () => ({
      ...resourceConfigs.records,
      // Doctors create records from an assigned appointment in "Lịch khám của tôi".
      canCreate: !isDoctor,
    }),
    [isDoctor],
  );
  return <ResourceListPage config={config} />;
}
