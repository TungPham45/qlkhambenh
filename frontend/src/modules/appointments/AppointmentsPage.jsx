import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function AppointmentsPage() {
  return <ResourceListPage config={resourceConfigs.appointments} />;
}
