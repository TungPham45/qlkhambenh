function parsePayload(payload) {
  if (typeof payload !== "string") return payload;

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

export function unwrapRows(payload) {
  const normalizedPayload = parsePayload(payload);
  const data = normalizedPayload?.data;
  if (Array.isArray(data)) {
    return { rows: data, pagination: normalizedPayload.pagination || null };
  }
  if (Array.isArray(data?.data)) {
    return { rows: data.data, pagination: data.pagination || null };
  }
  return { rows: [], pagination: null };
}

export function unwrapData(payload) {
  const normalizedPayload = parsePayload(payload);
  return normalizedPayload?.data ?? normalizedPayload ?? null;
}
