import { X } from "lucide-react";

export function Modal({ title, open, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40">
      <button className="absolute inset-0 bg-slate-950/40" type="button" onClick={onClose} aria-label="Đóng" />
      <div className="absolute left-1/2 top-1/2 w-[min(720px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2">
        <section className="app-card max-h-[90vh] overflow-auto">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-950">{title}</h2>
            <button className="rounded-md p-2 text-slate-500 hover:bg-slate-100" type="button" onClick={onClose}>
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="p-5">{children}</div>
        </section>
      </div>
    </div>
  );
}
