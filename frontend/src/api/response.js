export function unwrapRows(payload) {
  const data = payload?.data;
  if (Array.isArray(data)) {
    return { rows: data, pagination: null };
  }
  if (Array.isArray(data?.data)) {
    return { rows: data.data, pagination: data.pagination || null };
  }
  return { rows: [], pagination: null };
}

export function unwrapData(payload) {
  return payload?.data ?? null;
}
