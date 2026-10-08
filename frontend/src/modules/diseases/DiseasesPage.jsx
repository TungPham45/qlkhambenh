import {
  Ban,
  BookOpen,
  CheckCircle2,
  Edit3,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "../../components/common/Modal.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { AdminPagination } from "../admin/AdminPagination.jsx";
import { DiseaseDetails } from "./components/DiseaseDetails.jsx";
import { DiseaseForm } from "./components/DiseaseForm.jsx";
import {
  createDisease,
  getDisease,
  listDiseases,
  updateDisease,
  updateDiseaseStatus,
} from "./services/diseaseApi.js";

const INITIAL_QUERY = { page: 1, limit: 10, search: "", group: "", status: "" };

export function DiseasesPage() {
  const { notify } = useToast();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState(INITIAL_QUERY);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [formModal, setFormModal] = useState({ open: false, row: null });
  const [detailModal, setDetailModal] = useState({ open: false, row: null, loading: false });
  const [saving, setSaving] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const result = await listDiseases(query);
        if (!active) return;
        setRows(result.rows);
        setPagination(result.pagination);
        setGroups(result.groups);
      } catch (error) {
        if (!active) return;
        setLoadError(error?.message || "Không thể tải danh mục bệnh");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [query, refreshKey]);

  function submitSearch(event) {
    event.preventDefault();
    setQuery((current) => ({ ...current, page: 1, search: search.trim() }));
  }

  function changeFilter(name, value) {
    setQuery((current) => ({ ...current, page: 1, [name]: value }));
  }

  function openCreate() {
    setFormModal({ open: true, row: null });
  }

  function openEdit(row) {
    setFormModal({ open: true, row });
  }

  function closeForm() {
    if (!saving) setFormModal({ open: false, row: null });
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (formModal.row?.id) {
        await updateDisease(formModal.row.id, payload);
        notify("Đã cập nhật bệnh trong danh mục");
      } else {
        await createDisease(payload);
        notify("Đã thêm bệnh vào danh mục");
      }
      setFormModal({ open: false, row: null });
      setRefreshKey((value) => value + 1);
    } catch (error) {
      notify(error?.message || "Không thể lưu thông tin bệnh", "error");
    } finally {
      setSaving(false);
    }
  }

  async function openDetails(row) {
    setDetailModal({ open: true, row, loading: true });
    try {
      const disease = await getDisease(row.id);
      setDetailModal({ open: true, row: disease, loading: false });
    } catch (error) {
      setDetailModal({ open: false, row: null, loading: false });
      notify(error?.message || "Không thể tải chi tiết bệnh", "error");
    }
  }

  async function toggleStatus(row) {
    const nextStatus = row.status === "Active" ? "Inactive" : "Active";
    const action = nextStatus === "Active" ? "kích hoạt lại" : "ngừng sử dụng";
    if (!window.confirm(`Bạn có chắc muốn ${action} bệnh “${row.name}”?`)) return;

    setChangingStatusId(row.id);
    try {
      await updateDiseaseStatus(row.id, nextStatus);
      notify(nextStatus === "Active" ? "Đã kích hoạt lại bệnh" : "Đã ngừng sử dụng bệnh");
      setRefreshKey((value) => value + 1);
    } catch (error) {
      notify(error?.message || "Không thể cập nhật trạng thái bệnh", "error");
    } finally {
      setChangingStatusId(null);
    }
  }

  const total = pagination?.total ?? rows.length;
  const totalPages = pagination?.total_pages ?? 1;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Danh mục tên bệnh</h1>
          <p>Quản lý mã bệnh, nhóm bệnh và trạng thái sử dụng trong quá trình chẩn đoán.</p>
        </div>
        <div className="admin-summary">
          <div className="admin-summary-card">
            <span className="admin-summary-icon"><BookOpen size={20} /></span>
            <span><small>Tổng số bệnh</small><strong>{total.toLocaleString("vi-VN")}</strong></span>
          </div>
        </div>
      </div>

      {loadError ? <div className="public-alert public-alert-error">{loadError}</div> : null}

      <section className="admin-panel">
        <form className="admin-filters" onSubmit={submitSearch}>
          <label className="admin-search">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo mã bệnh hoặc tên bệnh"
            />
          </label>
          <select
            aria-label="Lọc theo nhóm bệnh"
            className="admin-filter-select"
            value={query.group}
            onChange={(event) => changeFilter("group", event.target.value)}
          >
            <option value="">Tất cả nhóm bệnh</option>
            {groups.map((group) => <option value={group} key={group}>{group}</option>)}
          </select>
          <select
            aria-label="Lọc theo trạng thái"
            className="admin-filter-select"
            value={query.status}
            onChange={(event) => changeFilter("status", event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Ngừng hoạt động</option>
          </select>
          <button className="admin-excel-button" type="submit">
            <Search size={17} /> Tìm kiếm
          </button>
          <button className="admin-add-button" type="button" onClick={openCreate}>
            <Plus size={17} /> Thêm bệnh
          </button>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã bệnh</th>
                <th>Tên bệnh</th>
                <th>Nhóm bệnh</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="admin-empty" colSpan="6">Đang tải danh mục bệnh...</td></tr>
              ) : rows.length ? rows.map((row) => {
                const active = row.status === "Active";
                return (
                  <tr key={row.id}>
                    <td><span className="admin-code">{row.code}</span></td>
                    <td><span className="admin-name-cell"><strong>{row.name}</strong></span></td>
                    <td>{row.group || "-"}</td>
                    <td className="max-w-xs"><span className="line-clamp-2" title={row.description || ""}>{row.description || "-"}</span></td>
                    <td>
                      <span className={active ? "admin-status" : "inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600"}>
                        {active ? "Hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-row-actions">
                        <button className="admin-action" type="button" title="Xem chi tiết" onClick={() => openDetails(row)}>
                          <Eye size={16} />
                        </button>
                        <button className="admin-action" type="button" title="Sửa" onClick={() => openEdit(row)}>
                          <Edit3 size={16} />
                        </button>
                        <button
                          className={`admin-action ${active ? "admin-action-danger" : ""}`}
                          type="button"
                          title={active ? "Ngừng sử dụng" : "Kích hoạt lại"}
                          disabled={changingStatusId === row.id}
                          onClick={() => toggleStatus(row)}
                        >
                          {active ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td className="admin-empty" colSpan="6">Không có bệnh phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={query.page}
          limit={query.limit}
          total={total}
          totalPages={totalPages}
          itemLabel="bệnh"
          onPageChange={(page) => setQuery((current) => ({ ...current, page }))}
        />
      </section>

      <Modal
        title={formModal.row ? "Cập nhật bệnh" : "Thêm bệnh"}
        open={formModal.open}
        onClose={closeForm}
      >
        <DiseaseForm
          initialValue={formModal.row}
          saving={saving}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      </Modal>

      <Modal
        title="Chi tiết bệnh"
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false, row: null, loading: false })}
      >
        <DiseaseDetails disease={detailModal.loading ? null : detailModal.row} />
      </Modal>
    </div>
  );
}
