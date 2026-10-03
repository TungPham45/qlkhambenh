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
  const response = await httpClient.post(endpoints.patients, toPatientPayload(payload));
  return unwrapData(response);
}

export async function updatePatient(id, payload) {
  const response = await httpClient.put(`${endpoints.patients}/${id}`, toPatientPayload(payload));
  return unwrapData(response);
}

export async function deletePatient(id) {
  const response = await httpClient.delete(`${endpoints.patients}/${id}`);
  return unwrapData(response);
}

function toPatientPayload(patient) {
  return {
    fullName: patient.HoTen?.trim(),
    dateOfBirth: patient.NgaySinh || undefined,
    gender: patient.GioiTinh || undefined,
    phone: patient.SoDienThoai?.trim(),
    email: patient.Email?.trim() || undefined,
    address: patient.DiaChi?.trim() || undefined,
    healthInsuranceNumber: patient.SoBaoHiemYTe?.trim() || undefined,
    status: patient.TrangThai || 'Active',
  };
}
