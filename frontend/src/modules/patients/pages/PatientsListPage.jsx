import { Edit3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Modal } from "../../../components/common/Modal.jsx";
import { DataTable } from "../../../components/table/DataTable.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useToast } from "../../../context/ToastContext.jsx";
import { formatDate } from "../../../utils/formatters.js";

import { PatientForm } from "../components/PatientForm.jsx";
import { usePatients } from "../hooks/usePatients.js";

export function PatientsListPage() {
  const { user } = useAuth();
  const { rows, pagination, loading, error, query, load, save, remove } = usePatients();
  const { notify } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const role = String(user?.VaiTro || user?.role || "").toLowerCase();
  const canManagePatients = role !== "letan";
  const canEditPatients = canManagePatients;
  const canDeletePatients = canManagePatients;

  function openCreate() {
    if (!canManagePatients) return;
    setSelected(null);
    setModalOpen(true);
  }

  function openEdit(row) {
    if (!canEditPatients) return;
    setSelected(row);
    setModalOpen(true);
  }

  async function handleSave(payload) {
    if (!canEditPatients) return;

    setSaving(true);
    try {
      await save(payload);
      notify("Đã lưu bệnh nhân");
      setModalOpen(false);
    } catch (caught) {
      notify(caught.message || "Không thể lưu bệnh nhân", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (!canDeletePatients) return;

    if (!window.confirm(`Xóa bệnh nhân ${row.HoTen}?`)) return;

    try {
      await remove(row.MaBN);
      notify("Đã xóa bệnh nhân");
    } catch (caught) {
      notify(caught.message || "Không thể xóa bệnh nhân", "error");
    }
  }

  const columns = useMemo(
    () => [
      { key: "MaBN", header: "ID" },
      { key: "HoTen", header: "Họ tên" },
      { key: "NgaySinh", header: "Ngày sinh", render: (row) => formatDate(row.NgaySinh) },
      { key: "GioiTinh", header: "Giới tính" },
      { key: "SoDienThoai", header: "SĐT" },
      ...(canManagePatients
        ? [
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex justify-end gap-2">
                  <button
                    className="btn-secondary px-3"
                    type="button"
                    onClick={() => openEdit(row)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    className="btn-danger"
                    type="button"
                    onClick={() => handleDelete(row)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]
        : []),
    ],
    [canManagePatients]
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Bệnh nhân</h1>
          {!canManagePatients ? (
            <p className="text-sm text-slate-500">Chế độ chỉ xem cho vai trò Lễ tân.</p>
          ) : null}
        </div>

        {canManagePatients ? (
          <button className="btn-primary" type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Thêm bệnh nhân
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error.message}
        </div>
      ) : null}

      <section className="app-card">
        <DataTable columns={columns} rows={rows} rowKey="MaBN" loading={loading} />

        {pagination ? (
          <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>
              Trang {pagination.page} / {pagination.total_pages}
            </span>

            <div className="flex gap-2">
              <button
                className="btn-secondary"
                disabled={query.page <= 1}
                onClick={() => load({ ...query, page: query.page - 1 })}
                type="button"
              >
                Trước
              </button>
              <button
                className="btn-secondary"
                disabled={query.page >= pagination.total_pages}
                onClick={() => load({ ...query, page: query.page + 1 })}
                type="button"
              >
                Sau
              </button>
            </div>
          </footer>
        ) : null}
      </section>

      {canManagePatients ? (
        <Modal
          title={selected ? "Cập nhật bệnh nhân" : "Thêm bệnh nhân"}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        >
          <PatientForm
            initialValue={selected}
            saving={saving}
            onSubmit={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  );
}