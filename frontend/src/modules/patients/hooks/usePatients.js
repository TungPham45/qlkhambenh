import { useCallback, useEffect, useState } from "react";

import {
  createPatient,
  deletePatient,
  listPatients,
  updatePatient,
} from "../services/patientApi.js";

export function usePatients() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ page: 1, limit: 4 });

  const load = useCallback(async (nextQuery) => {
    setLoading(true);
    setError(null);
    try {
      // The API derives the patient scope from the JWT. Doctors receive patients
      // from their assigned appointments, including visits without a record yet.
      const result = await listPatients(nextQuery);
      setRows(result.rows);
      setPagination(result.pagination);
      setQuery(nextQuery);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load({ page: 1, limit: 4 });
  }, [load]);

  async function save(patient) {
    const isNewPatient = !patient.MaBN;
    if (!isNewPatient) {
      await updatePatient(patient.MaBN, patient);
    } else {
      await createPatient(patient);
    }
    await load({ ...query, page: isNewPatient ? 1 : query.page });
  }

  async function remove(id) {
    await deletePatient(id);
    await load(query);
  }

  return { rows, pagination, loading, error, query, setQuery, load, save, remove };
}
