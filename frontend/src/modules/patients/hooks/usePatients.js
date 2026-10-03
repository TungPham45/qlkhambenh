import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { createPatient, deletePatient, listPatients, listPatientsByDoctorIds, updatePatient } from "../services/patientApi.js";
import { httpClient } from "../../../api/httpClient.js";
import { unwrapRows } from "../../../api/response.js";

export function usePatients() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({ page: 1, limit: 20 });

  const load = useCallback(async (nextQuery = query) => {
    setLoading(true);
    setError(null);
    try {
      const userRole = String(user?.VaiTro || "").toLowerCase();
      let result;
      
      if (userRole === "bacsi" && user?.MaNV) {
        // Bác sĩ: lấy list MaBN từ medical-record-service theo phiếu khám
        const response = await httpClient.get(`/medical-records/doctor/${user.MaNV}/patients`, {
          params: nextQuery
        });
        const medicalRecordResult = unwrapRows(response);
        
        // Trích xuất danh sách MaBN từ phiếu khám
        const patientIds = medicalRecordResult.rows.map((item) => (item?.MaBN ?? item));
        
        if (patientIds.length > 0) {
          // Gọi patient-service để lấy chi tiết bệnh nhân
          result = await listPatientsByDoctorIds(patientIds, nextQuery);
        } else {
          result = { rows: [], pagination: medicalRecordResult.pagination };
        }
      } else {
        // Admin và bệnh nhân xem danh sách bệnh nhân
        result = await listPatients(nextQuery);
      }
      
      setRows(result.rows);
      setPagination(result.pagination);
      setSummary(result.summary || null);
      setQuery(nextQuery);
    } catch (caught) {
      setError(caught);
    } finally {
      setLoading(false);
    }
  }, [query, user?.VaiTro, user?.MaNV]);

  useEffect(() => {
    load(query);
  }, []);

  async function save(patient) {
    if (patient.MaBN) {
      await updatePatient(patient.MaBN, patient);
    } else {
      await createPatient(patient);
    }
    await load(query);
  }

  async function remove(id) {
    await deletePatient(id);
    await load(query);
  }

  return { rows, pagination, summary, loading, error, query, setQuery, load, save, remove };
}
