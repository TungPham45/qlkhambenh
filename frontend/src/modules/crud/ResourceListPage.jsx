import { Edit3, Eye, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { DataTable } from "../../components/table/DataTable.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { httpClient } from "../../api/httpClient.js";
import { useCrudResource } from "./useCrudResource.js";
import { useLookups } from "./useLookups.js";
import { lookupConfigs } from "./resourceConfigs.js";
import { ResourceForm } from "./ResourceForm.jsx";

export function ResourceListPage({ config }) {
  const { rows, pagination, loading, error, query, load, show, save, remove } = useCrudResource(config);
  const lookups = useLookups(config.lookups || []);
  const { notify } = useToast();
  const [modal, setModal] = useState({ open: false, mode: "create", row: null });
  const [detail, setDetail] = useState(null);
  const [saving, setSaving] = useState(false);

  const columns = useMemo(() => [
    ...config.columns.map((column) => ({
      key: column.key,
      header: column.header,
      render: (row) => {
        if (column.render) {
          return column.render(row);
        }
        if (column.lookup) {
          return lookupLabel(column.lookup, row[column.key], lookups);
        }
        return row[column.key] ?? "-";
      }
    })),
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button className="btn-secondary px-3" type="button" onClick={() => openDetail(row)}>
            <Eye className="h-4 w-4" />
          </button>
          {config.canEdit === false ? null : (
            <button className="btn-secondary px-3" type="button" onClick={() => setModal({ open: true, mode: "edit", row })}>
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          {config.canDelete === false ? null : (
            <button className="btn-danger" type="button" onClick={() => handleDelete(row)}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )
    }
  ], [config, lookups]);

  async function openDetail(row) {
    try {
      const data = await show(row[config.pk]);
      setDetail(data || row);
    } catch (caught) {
      notify(caught.message || "Không thể tải chi tiết", "error");
    }
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      await save(payload, modal.mode);
      await runPostSaveWorkflow(config, payload);
      notify("Đã lưu dữ liệu");
      setModal({ open: false, mode: "create", row: null });
    } catch (caught) {
      notify(caught.message || "Không thể lưu dữ liệu", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Xóa ${config.title.toLowerCase()} này?`)) {
      return;
    }
    try {
      await remove(row[config.pk]);
      notify("Đã xóa dữ liệu");
    } catch (caught) {
      notify(caught.message || "Không thể xóa dữ liệu", "error");
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">{config.title}</h1>
        </div>
        {config.canCreate === false ? null : (
          <button className="btn-primary" type="button" onClick={() => setModal({ open: true, mode: "create", row: null })}>
            <Plus className="h-4 w-4" />
            Thêm mới
          </button>
        )}
      </div>

      {error ? <div className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error.message}</div> : null}

      <section className="app-card">
        <DataTable columns={columns} rows={rows} rowKey={config.pk} loading={loading} />
        {pagination ? (
          <footer className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
            <span>Trang {pagination.page} / {pagination.total_pages}</span>
            <div className="flex gap-2">
              <button className="btn-secondary" disabled={query.page <= 1} onClick={() => load({ ...query, page: query.page - 1 })}>Trước</button>
              <button className="btn-secondary" disabled={query.page >= pagination.total_pages} onClick={() => load({ ...query, page: query.page + 1 })}>Sau</button>
            </div>
          </footer>
        ) : null}
      </section>

      <Modal title={modal.mode === "edit" ? `Cập nhật ${config.title}` : `Thêm ${config.title}`} open={modal.open} onClose={() => setModal({ open: false, mode: "create", row: null })}>
        <ResourceForm
          config={config}
          initialValue={modal.row}
          mode={modal.mode}
          lookups={lookups}
          saving={saving}
          onSubmit={handleSave}
          onCancel={() => setModal({ open: false, mode: "create", row: null })}
        />
      </Modal>

      <Modal title={`Chi tiết ${config.title}`} open={Boolean(detail)} onClose={() => setDetail(null)}>
        <DetailView row={detail} config={config} lookups={lookups} />
      </Modal>
    </div>
  );
}

async function runPostSaveWorkflow(config, payload) {
  if (config.workflow === "medicalRecord" && payload.MaLich) {
    await httpClient.patch(`/appointments/${encodeURIComponent(payload.MaLich)}/status`, {
      TrangThai: "Da kham"
    });
  }
}

function lookupLabel(name, value, lookups) {
  const config = lookupConfigs[name];
  const row = lookups[name]?.map?.get(String(value));
  return row && config ? config.label(row) : value || "-";
}

function DetailView({ row, config, lookups }) {
  if (!row) {
    return null;
  }

  const keys = Array.from(new Set([...config.columns.map((column) => column.key), ...Object.keys(row)])).filter((key) => key !== "actions" && key !== "ChiTiet");

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        {keys.map((key) => {
          const column = config.columns.find((item) => item.key === key);
          const value = column?.lookup ? lookupLabel(column.lookup, row[key], lookups) : row[key];
          return (
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3" key={key}>
              <div className="text-xs font-semibold uppercase text-slate-500">{column?.header || key}</div>
              <div className="mt-1 text-sm text-slate-900">{String(value ?? "-")}</div>
            </div>
          );
        })}
      </div>
      {Array.isArray(row.ChiTiet) && row.ChiTiet.length ? (
        <div className="rounded-md border border-slate-200">
          <div className="border-b border-slate-200 px-3 py-2 text-sm font-semibold">Chi tiết thuốc</div>
          <div className="divide-y divide-slate-100">
            {row.ChiTiet.map((item, index) => (
              <div className="grid gap-2 px-3 py-2 text-sm md:grid-cols-4" key={index}>
                <span>{item.TenThuoc || item.MaThuoc}</span>
                <span>SL: {item.SoLuong}</span>
                <span>{item.DonGia ? `Giá: ${item.DonGia}` : item.DonViTinh || ""}</span>
                <span>{item.LieuDung}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
