import { Building2 } from "lucide-react";
import { AdminResourceListPage } from "../admin/AdminResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function SpecialtiesPage() { return <AdminResourceListPage config={{ ...resourceConfigs.specialties, summaryIcon: Building2 }} />; }
