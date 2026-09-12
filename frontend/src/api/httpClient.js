import axios from "axios";
import { getToken, clearSession } from "../services/tokenStorage.js";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  timeout: 30000
});

httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (status === 401) {
      clearSession();
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }

    return Promise.reject({
      status,
      message: payload?.message || error.message || "Request failed",
      errors: payload?.errors || [],
      raw: error
    });
  }
);
