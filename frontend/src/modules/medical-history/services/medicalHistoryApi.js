import { httpClient } from "../../../api/httpClient.js";
import { unwrapData, unwrapRows } from "../../../api/response.js";

const MEDICAL_HISTORY_ENDPOINT = "/medical-records/history";

function compactParams(params) {
  return Object.fromEntries(
    Object.entries(params || {}).filter(([, value]) =>
      value !== "" && value !== null && value !== undefined
    )
  );
}

export async function listMedicalHistory(params = {}) {
  const response = await httpClient.get(MEDICAL_HISTORY_ENDPOINT, {
    params: compactParams(params),
  });
  return unwrapRows(response);
}

export async function getMedicalHistoryDetail(id) {
  const response = await httpClient.get(
    `${MEDICAL_HISTORY_ENDPOINT}/${encodeURIComponent(id)}`
  );
  return unwrapData(response);
}

