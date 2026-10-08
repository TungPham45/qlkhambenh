import { httpClient } from "../../api/httpClient.js";

const baseUrl = "/notifications";

export const notificationsApi = {
  list(params) {
    return httpClient.get(baseUrl, { params });
  },
  unreadCount() {
    return httpClient.get(`${baseUrl}/unread-count`);
  },
  detail(id) {
    return httpClient.get(`${baseUrl}/${encodeURIComponent(id)}`);
  },
  markRead(id) {
    return httpClient.patch(`${baseUrl}/${encodeURIComponent(id)}/read`);
  },
  markAllRead() {
    return httpClient.patch(`${baseUrl}/read-all`);
  },
};

export function announceNotificationChange() {
  window.dispatchEvent(new CustomEvent("notifications:changed"));
}

export function notificationRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

export function notificationPagination(response) {
  return response?.pagination || response?.data?.pagination || null;
}

export function unreadCount(response) {
  return Number(response?.count ?? response?.data?.count ?? 0);
}
