import { useCallback, useEffect, useState } from "react";
import { createResource, deleteResource, getResource, listResource, updateResource } from "./resourceApi.js";

export function useCrudResource(config) {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ page: 1, limit: config.limit || 20 });

  const load = useCallback(async (nextQuery = query) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listResource(config.endpoint, nextQuery);
      setRows(result.rows);
      setPagination(result.pagination);
      setQuery(nextQuery);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, config.limit, query]);

  useEffect(() => {
    load({ page: 1, limit: config.limit || 20 });
  }, [config.endpoint]);

  async function show(id) {
    return getResource(config.endpoint, id);
  }

  async function save(payload, mode = "create") {
    const id = payload[config.pk];
    const isNewResource = mode !== "edit" || !id;
    if (!isNewResource) {
      await updateResource(config.endpoint, id, payload, config);
    } else {
      await createResource(config.endpoint, payload);
    }
    await load({ ...query, page: isNewResource ? 1 : query.page });
  }

  async function remove(id) {
    await deleteResource(config.endpoint, id);
    await load(query);
  }

  return { rows, pagination, loading, error, query, load, show, save, remove };
}
