import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../../components/table/DataTable.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  announceNotificationChange,
  notificationPagination,
  notificationRows,
  notificationsApi,
} from "./notificationsApi.js";

const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  unreadOnly: false,
  type: "",
  date: "",
};

const KNOWN_TYPES = [
  "Dat lich",
  "Trang thai lich kham",
  "Tiep nhan",
  "Nhac lich",
  "Hoan thanh kham",
  "Hoa don",
  "Thanh toan",
  "Khac",
];

export function NotificationsPage() {
  const { notify } = useToast();
  const { user } = useAuth();
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadedAccountKey, setLoadedAccountKey] = useState("");
  const requestRef = useRef(0);
  const accountKey = String(user?.id || user?.username || user?.TenDangNhap || "");
  const accountRef = useRef(accountKey);
  accountRef.current = accountKey;

  const load = useCallback(async () => {
    if (!accountKey) {
      setRows([]);
      setPagination(null);
      setLoadedAccountKey("");
      setLoading(false);
      return;
    }
    const requestedAccount = accountKey;
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const response = await notificationsApi.list({
        ...query,
        unreadOnly: query.unreadOnly || undefined,
        type: query.type || undefined,
        date: query.date || undefined,
      });
      if (accountRef.current !== requestedAccount || requestRef.current !== requestId) return;
      setRows(notificationRows(response));
      setPagination(notificationPagination(response));
      setLoadedAccountKey(requestedAccount);
    } catch (error) {
      if (accountRef.current === requestedAccount && requestRef.current === requestId) {
        notify(error?.message || "Không thể tải danh sách thông báo", "error");
      }
    } finally {
      if (accountRef.current === requestedAccount && requestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [accountKey, notify, query]);

  useEffect(() => {
    requestRef.current += 1;
    setRows([]);
    setPagination(null);
    setLoadedAccountKey("");
    setQuery({ ...DEFAULT_QUERY });
  }, [accountKey]);

  useEffect(() => {
    load();
    return () => {
      requestRef.current += 1;
    };
  }, [load]);

  const markRead = useCallback(async (item) => {
    const requestedAccount = accountKey;
    try {
      await notificationsApi.markRead(item.id);
      if (accountRef.current !== requestedAccount) return;
      setRows((current) => current.map((row) => (row.id === item.id ? { ...row, isRead: true, readAt: new Date().toISOString() } : row)));
      announceNotificationChange();
      if (query.unreadOnly) await load();
    } catch (error) {
      if (accountRef.current === requestedAccount) {
        notify(error?.message || "Không thể đánh dấu đã đọc", "error");
      }
    }
  }, [accountKey, load, notify, query.unreadOnly]);

  async function markAllRead() {
    const requestedAccount = accountKey;
    try {
      await notificationsApi.markAllRead();
      if (accountRef.current !== requestedAccount) return;
      notify("Đã đánh dấu tất cả thông báo là đã đọc");
      announceNotificationChange();
      await load();
    } catch (error) {
      if (accountRef.current === requestedAccount) {
        notify(error?.message || "Không thể đánh dấu tất cả đã đọc", "error");
      }
    }
  }

  const visibleRows = loadedAccountKey === accountKey ? rows : [];
  const visiblePagination = loadedAccountKey === accountKey ? pagination : null;

  const typeOptions = useMemo(
    () => Array.from(new Set([...KNOWN_TYPES, ...visibleRows.map((item) => item.type).filter(Boolean)])),
    [visibleRows],
  );

  const columns = useMemo(
    () => [
      {
        key: "state",
        header: "Trạng thái",
        render: (row) => (
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${row.isRead || row.readAt ? "bg-slate-100 text-slate-600" : "bg-blue-100 text-blue-700"}`}>
            {row.isRead || row.readAt ? "Đã đọc" : "Chưa đọc"}
          </span>
        ),
      },
      { key: "type", header: "Loại" },
      {
        key: "message",
        header: "Thông báo",
        render: (row) => (
          <div className="min-w-64 max-w-2xl">
            <strong className="block text-slate-900">{row.title}</strong>
            <p className="mt-1 whitespace-normal text-sm leading-5 text-slate-600">{row.content}</p>
          </div>
        ),
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        render: (row) => formatDateTime(row.createdAt),
      },
      {
        key: "action",
        header: "",
        render: (row) =>
          row.isRead || row.readAt ? (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600"><Check className="h-4 w-4" /> Đã đọc</span>
          ) : (
            <button className="btn-secondary whitespace-nowrap px-3" onClick={() => markRead(row)} type="button">
              <Check className="h-4 w-4" /> Đánh dấu đã đọc
            </button>
          ),
      },
    ],
    [markRead],
  );

  const totalPages = Math.max(1, Number(visiblePagination?.total_pages || 1));

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-950">Thông báo</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Các cập nhật dành riêng cho tài khoản của bạn.</p>
        </div>
        <button className="btn-secondary" onClick={markAllRead} type="button">
          <CheckCheck className="h-4 w-4" /> Đánh dấu tất cả đã đọc
        </button>
      </header>

      <section className="app-card p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-48 flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500" htmlFor="notification-type">Loại thông báo</label>
            <select
              className="form-input"
              id="notification-type"
              onChange={(event) => setQuery((current) => ({ ...current, type: event.target.value, page: 1 }))}
              value={query.type}
            >
              <option value="">Tất cả loại</option>
              {typeOptions.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="min-w-48 flex-1">
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500" htmlFor="notification-date">Ngày tạo</label>
            <input
              className="form-input"
              id="notification-date"
              onChange={(event) => setQuery((current) => ({ ...current, date: event.target.value, page: 1 }))}
              type="date"
              value={query.date}
            />
          </div>
          <label className="flex h-11 cursor-pointer items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700">
            <input
              checked={query.unreadOnly}
              onChange={(event) => setQuery((current) => ({ ...current, unreadOnly: event.target.checked, page: 1 }))}
              type="checkbox"
            />
            <Filter className="h-4 w-4" /> Chỉ chưa đọc
          </label>
        </div>
      </section>

      <section className="app-card">
        <DataTable columns={columns} emptyLabel="Không có thông báo phù hợp." loading={loading} rowKey="id" rows={visibleRows} />
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
          <span>{visiblePagination?.total || 0} thông báo · Trang {query.page}/{totalPages}</span>
          <div className="flex gap-2">
            <button className="btn-secondary" disabled={query.page <= 1 || loading} onClick={() => setQuery((current) => ({ ...current, page: current.page - 1 }))} type="button">Trước</button>
            <button className="btn-secondary" disabled={query.page >= totalPages || loading} onClick={() => setQuery((current) => ({ ...current, page: current.page + 1 }))} type="button">Sau</button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
