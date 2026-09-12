export function LoadingState({ label = "Đang tải dữ liệu..." }) {
  return (
    <div className="app-card flex min-h-48 items-center justify-center p-8 text-sm font-medium text-slate-600">
      {label}
    </div>
  );
}
