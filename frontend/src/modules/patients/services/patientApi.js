import { endpoints } from "../../../api/endpoints.js";
import { httpClient } from "../../../api/httpClient.js";
import { unwrapData, unwrapRows } from "../../../api/response.js";

export async function listPatients(params = {}) {
  const response = await httpClient.get(endpoints.patients, { params });
  return unwrapRows(response);
}

export async function listPatientsByDoctorIds(patientIds, params = {}) {
  if (!patientIds || patientIds.length === 0) {
    return { rows: [], pagination: { total: 0, page: 1, limit: 20, total_pages: 0 } };
  }
  
  const response = await httpClient.get(endpoints.patients, {
    params: {
      ...params,
      ids: patientIds.join(",")
    }
  });
  return unwrapRows(response);
}

export async function createPatient(payload) {
  const response = await httpClient.post(endpoints.patients, payload);
  return unwrapData(response);
}

export async function updatePatient(id, payload) {
  const response = await httpClient.put(`${endpoints.patients}/${id}`, payload);
  return unwrapData(response);
}

export async function deletePatient(id) {
  const response = await httpClient.delete(`${endpoints.patients}/${id}`);
  return unwrapData(response);
}
