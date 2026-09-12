import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function StaffPage() {
  return <ResourceListPage config={resourceConfigs.staff} />;
}
