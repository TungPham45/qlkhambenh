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
  const response = await httpClient.post(endpoints.patients, normalizePatientPayload(payload));
  return unwrapData(response);
}

export async function updatePatient(id, payload) {
  const response = await httpClient.put(`${endpoints.patients}/${id}`, normalizePatientPayload(payload));
  return unwrapData(response);
}

function normalizePatientPayload(payload) {
  return {
    fullName: payload.HoTen ?? payload.fullName,
    dateOfBirth: payload.NgaySinh || payload.dateOfBirth || undefined,
    gender: payload.GioiTinh ?? payload.gender,
    phone: payload.SoDienThoai ?? payload.phone,
    address: payload.DiaChi ?? payload.address,
    email: payload.Email ?? payload.email,
    healthInsuranceNumber: payload.SoBaoHiemYTe ?? payload.healthInsuranceNumber,
    username: payload.TenDangNhap ?? payload.username,
    password: payload.MatKhau || payload.password || undefined,
  };
}

export async function deletePatient(id) {
  const response = await httpClient.delete(`${endpoints.patients}/${id}`);
  return unwrapData(response);
}
