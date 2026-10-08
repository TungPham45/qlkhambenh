import { httpClient } from "../../../api/httpClient.js";

function normalizeResponse(payload) {
  if (typeof payload !== "string") return payload;
  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

export async function listDiseases(params = {}) {
  const compactParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== "" && value != null),
  );
  const response = normalizeResponse(
    await httpClient.get("/diseases", { params: compactParams }),
  );
  const payload = Array.isArray(response?.data?.data) ? response.data : response;
  return {
    rows: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination || null,
    groups: Array.isArray(payload?.filters?.groups) ? payload.filters.groups : [],
  };
}

export async function getDisease(id) {
  const response = normalizeResponse(
    await httpClient.get(`/diseases/${encodeURIComponent(id)}`),
  );
  return response?.data ?? response;
}

export async function createDisease(payload) {
  const response = normalizeResponse(await httpClient.post("/diseases", payload));
  return response?.data ?? response;
}

export async function updateDisease(id, payload) {
  const response = normalizeResponse(
    await httpClient.put(`/diseases/${encodeURIComponent(id)}`, payload),
  );
  return response?.data ?? response;
}

export async function updateDiseaseStatus(id, status) {
  const response = normalizeResponse(
    await httpClient.patch(`/diseases/${encodeURIComponent(id)}/status`, { status }),
  );
  return response?.data ?? response;
}
