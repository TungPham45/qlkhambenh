import { httpClient } from "../../../api/httpClient.js";
import { unwrapData, unwrapRows } from "../../../api/response.js";

const RECEPTION_PATH = "/reception";

export async function listReceptions(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value != null),
  );
  return unwrapRows(await httpClient.get(RECEPTION_PATH, { params: cleanParams }));
}

export async function getReception(appointmentId) {
  return unwrapData(await httpClient.get(`${RECEPTION_PATH}/${appointmentId}`));
}

export async function createReception(payload) {
  return unwrapData(await httpClient.post(RECEPTION_PATH, payload));
}

export async function updateReception(appointmentId, payload) {
  return unwrapData(
    await httpClient.put(`${RECEPTION_PATH}/${appointmentId}`, payload),
  );
}
