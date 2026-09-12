import { httpClient } from "../../api/httpClient.js";
import { unwrapData, unwrapRows } from "../../api/response.js";

export async function listResource(endpoint, params = {}) {
  const response = await httpClient.get(endpoint, { params });
  return unwrapRows(response);
}

export async function getResource(endpoint, id) {
  const response = await httpClient.get(`${endpoint}/${encodeURIComponent(id)}`);
  return unwrapData(response);
}

export async function createResource(endpoint, payload) {
  const response = await httpClient.post(endpoint, payload);
  return unwrapData(response);
}

export async function updateResource(endpoint, id, payload, config = {}) {
  const path = config.editPath ? config.editPath(id) : `${endpoint}/${encodeURIComponent(id)}`;
  const method = String(config.editMethod || "PUT").toLowerCase();
  const response = await httpClient[method](path, payload);
  return unwrapData(response);
}

export async function deleteResource(endpoint, id) {
  const response = await httpClient.delete(`${endpoint}/${encodeURIComponent(id)}`);
  return unwrapData(response);
}
