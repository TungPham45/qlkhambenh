export function unwrapRows(payload) {
  const data = payload?.data;
  if (Array.isArray(data)) {
    return {
      rows: data,
      pagination: payload.pagination || null,
      summary: payload.summary || null,
    };
  }
  if (Array.isArray(data?.data)) {
    return { rows: data.data, pagination: data.pagination || null, summary: data.summary || null };
  }
  return { rows: [], pagination: null };
}

export function unwrapData(payload) {
  return payload?.data ?? null;
}
