import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  announceNotificationChange,
  notificationRows,
  notificationsApi,
  unreadCount as readUnreadCount,
} from "./notificationsApi.js";

export function NotificationBell({ admin = false }) {
  const { user } = useAuth();
  const { notify } = useToast();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);
  const accountKey = String(user?.id || user?.username || user?.TenDangNhap || "");
  const accountRef = useRef(accountKey);
  accountRef.current = accountKey;

  const loadCount = useCallback(async () => {
    if (!accountKey) return;
    const requestedAccount = accountKey;
    try {
      const response = await notificationsApi.unreadCount();
      if (accountRef.current !== requestedAccount) return;
      setCount(readUnreadCount(response));
    } catch (error) {
      if (error?.status !== 401) console.error("Cannot load notification count", error);
    }
  }, [accountKey]);

  const loadLatest = useCallback(async () => {
    if (!accountKey) return;
    const requestedAccount = accountKey;
    setLoading(true);
    try {
      const response = await notificationsApi.list({ page: 1, limit: 6 });
      if (accountRef.current !== requestedAccount) return;
      setItems(notificationRows(response));
    } catch (error) {
      if (error?.status !== 401) notify(error?.message || "Không thể tải thông báo", "error");
    } finally {
      if (accountRef.current === requestedAccount) setLoading(false);
    }
  }, [accountKey, notify]);

  useEffect(() => {
    setOpen(false);
    setCount(0);
    setItems([]);
    setLoading(false);
    if (!accountKey) return undefined;

    let active = true;
    const safeLoadCount = async () => {
      if (active) await loadCount();
    };
    safeLoadCount();
    const timer = window.setInterval(safeLoadCount, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [accountKey, loadCount]);

  useEffect(() => {
    function onChanged() {
      loadCount();
      if (open) loadLatest();
    }
    function onPointerDown(event) {
      if (open && wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("notifications:changed", onChanged);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("notifications:changed", onChanged);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [loadCount, loadLatest, open]);

  async function togglePanel() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) await loadLatest();
  }

  async function markRead(item) {
    if (item.isRead || item.readAt) return;
    const requestedAccount = accountKey;
    try {
      const updated = await notificationsApi.markRead(item.id);
      if (accountRef.current !== requestedAccount) return;
      setItems((current) =>
        current.map((entry) => (entry.id === item.id ? { ...entry, ...updated, isRead: true } : entry)),
      );
      setCount((current) => Math.max(0, current - 1));
      announceNotificationChange();
    } catch (error) {
      if (accountRef.current === requestedAccount) {
        notify(error?.message || "Không thể đánh dấu đã đọc", "error");
      }
    }
  }

  async function markAllRead() {
    const requestedAccount = accountKey;
    try {
      await notificationsApi.markAllRead();
      if (accountRef.current !== requestedAccount) return;
      setItems((current) => current.map((item) => ({ ...item, isRead: true, readAt: new Date().toISOString() })));
      setCount(0);
      announceNotificationChange();
    } catch (error) {
      if (accountRef.current === requestedAccount) {
        notify(error?.message || "Không thể đánh dấu tất cả đã đọc", "error");
      }
    }
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        aria-expanded={open}
        aria-label="Thông báo"
        className={admin ? "notification-admin-button" : "icon-btn relative"}
        onClick={togglePanel}
        type="button"
      >
        <Bell className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-4 text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <section className={`notification-panel ${admin ? "notification-panel-admin" : ""}`}>
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <strong className="text-sm">Thông báo</strong>
              <p className="mt-0.5 text-xs text-slate-500">{count} thông báo chưa đọc</p>
            </div>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50" disabled={!count} onClick={markAllRead} type="button">
              <CheckCheck className="mr-1 inline h-4 w-4" />
              Đọc tất cả
            </button>
          </header>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin" /> Đang tải...
              </div>
            ) : items.length ? (
              items.map((item) => {
                const isRead = Boolean(item.isRead || item.readAt);
                return (
                  <button
                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${isRead ? "opacity-70" : "bg-blue-50/70"}`}
                    key={item.id}
                    onClick={() => markRead(item)}
                    type="button"
                  >
                    <span className="flex items-start gap-2">
                      {!isRead ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" /> : <span className="w-2 shrink-0" />}
                      <span>
                        <strong className="block text-sm text-slate-900">{item.title}</strong>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-600">{item.content}</span>
                        <span className="mt-1 block text-[11px] text-slate-400">{formatDateTime(item.createdAt)}</span>
                      </span>
                    </span>
                  </button>
                );
              })
            ) : (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Bạn chưa có thông báo nào.</p>
            )}
          </div>

          <footer className="border-t border-slate-200 px-4 py-3 text-center">
            <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" onClick={() => setOpen(false)} to="/notifications">
              Xem tất cả
            </Link>
          </footer>
        </section>
      ) : null}
    </div>
  );
}

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
