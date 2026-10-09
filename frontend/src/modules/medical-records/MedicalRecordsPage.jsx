import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function MedicalRecordsPage() {
  return <ResourceListPage config={resourceConfigs.records} />;
}
