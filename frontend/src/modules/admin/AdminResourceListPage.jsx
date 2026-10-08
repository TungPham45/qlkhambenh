import { Download, Edit3, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { ResourceForm } from "../crud/ResourceForm.jsx";
import { useCrudResource } from "../crud/useCrudResource.js";
import { AdminPagination } from "./AdminPagination.jsx";

export function AdminResourceListPage({ config }) {
  const { rows, pagination, loading, error, query, load, save, remove } = useCrudResource(config);
  const { notify } = useToast();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, mode: "create", row: null });
  const [saving, setSaving] = useState(false);
  const total = pagination?.total ?? rows.length;

  function submitSearch(event) { event.preventDefault(); load({ ...query, page: 1, search: search.trim() }); }
  async function handleSave(payload) { setSaving(true); try { await save(payload, modal.mode); notify("Đã lưu dữ liệu"); setModal({ open: false, mode: "create", row: null }); } catch (caught) { notify(caught?.message || "Không thể lưu dữ liệu", "error"); } finally { setSaving(false); } }
  async function handleDelete(row) { if (!window.confirm(`Bạn có chắc muốn xóa ${config.itemLabel.toLowerCase()} này không?`)) return; try { await remove(row[config.pk]); notify("Đã xóa dữ liệu"); } catch (caught) { notify(caught?.message || "Không thể xóa dữ liệu", "error"); } }
  function exportExcel() { const headers = config.columns.map((column) => column.header); const data = rows.map((row) => config.columns.map((column) => String(row[column.key] ?? "").replaceAll('"', '""'))); const csv = [headers, ...data].map((line) => line.map((value) => `"${value}"`).join(",")).join("\n"); const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${config.exportName}.csv`; anchor.click(); URL.revokeObjectURL(url); }

  const SummaryIcon = config.summaryIcon;
  return <div className="admin-page">
    <div className="admin-page-head"><div><h1>{config.pageTitle}</h1><p>{config.description}</p></div><div className="admin-summary"><div className="admin-summary-card"><span className="admin-summary-icon"><SummaryIcon size={20} /></span><span><small>{config.summaryLabel}</small><strong>{total.toLocaleString("vi-VN")}</strong></span></div></div></div>
    {error ? <div className="public-alert public-alert-error">{error.message}</div> : null}
    <section className="admin-panel">
      <form className="admin-filters" onSubmit={submitSearch}><label className="admin-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={config.searchPlaceholder} /></label><button className="admin-excel-button" type="submit"><Search size={17} /> Tìm kiếm</button><button className="admin-excel-button" type="button" onClick={exportExcel}><Download size={17} /> Xuất Excel</button><button className="admin-add-button" type="button" onClick={() => setModal({ open: true, mode: "create", row: null })}><Plus size={17} /> Thêm mới {config.itemLabel.toLowerCase()}</button></form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{config.columns.map((column) => <th key={column.key}>{column.header}</th>)}<th /></tr></thead><tbody>{loading ? <tr><td className="admin-empty" colSpan={config.columns.length + 1}>Đang tải dữ liệu...</td></tr> : rows.length ? rows.map((row) => <tr key={row[config.pk]}>{config.columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key] ?? "-"}</td>)}<td><div className="admin-row-actions"><button className="admin-action" type="button" title="Sửa" onClick={() => setModal({ open: true, mode: "edit", row })}><Edit3 size={16} /></button><button className="admin-action admin-action-danger" type="button" title="Xóa" onClick={() => handleDelete(row)}><Trash2 size={16} /></button></div></td></tr>) : <tr><td className="admin-empty" colSpan={config.columns.length + 1}>Không có dữ liệu</td></tr>}</tbody></table></div>
      {pagination ? <AdminPagination page={query.page} limit={query.limit} total={total} totalPages={pagination.total_pages} itemLabel={config.itemLabel.toLowerCase()} onPageChange={(page) => load({ ...query, page })} /> : null}
    </section>
    <Modal title={modal.mode === "edit" ? `Cập nhật ${config.itemLabel}` : `Thêm ${config.itemLabel}`} open={modal.open} onClose={() => setModal({ open: false, mode: "create", row: null })}><ResourceForm config={config} initialValue={modal.row} mode={modal.mode} lookups={{}} saving={saving} onSubmit={handleSave} onCancel={() => setModal({ open: false, mode: "create", row: null })} /></Modal>
  </div>;
}
