import { ResourceListPage } from "../crud/ResourceListPage.jsx";
import { resourceConfigs } from "../crud/resourceConfigs.js";

export function BillingPage() {
  return <ResourceListPage config={resourceConfigs.billings} />;
}
