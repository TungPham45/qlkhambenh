import { Stethoscope } from "lucide-react";
import { AdminResourceListPage } from "../admin/AdminResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function StaffPage() {
  return <AdminResourceListPage config={{ ...resourceConfigs.staff, summaryIcon: Stethoscope }} />;
}
