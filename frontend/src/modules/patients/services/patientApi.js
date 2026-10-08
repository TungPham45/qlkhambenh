import { endpoints } from "../../../api/endpoints.js";
import { httpClient } from "../../../api/httpClient.js";
import { unwrapData, unwrapRows } from "../../../api/response.js";

export async function listPatients(params = {}) {
  const response = await httpClient.get(endpoints.patients, { params });
  return unwrapRows(response);
}

export async function getPatient(id) {
  const response = await httpClient.get(`${endpoints.patients}/${encodeURIComponent(id)}`);
  return unwrapData(response);
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
