function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date);
}

export function DiseaseDetails({ disease }) {
  if (!disease) {
    return <p className="text-sm text-slate-500">Đang tải thông tin...</p>;
  }

  const details = [
    ["Mã bệnh", disease.code],
    ["Tên bệnh", disease.name],
    ["Nhóm bệnh", disease.group || "-"],
    ["Ngày tạo", formatDateTime(disease.createdAt)],
    ["Cập nhật gần nhất", formatDateTime(disease.updatedAt)],
  ];

  return (
    <div className="grid gap-5">
      <dl className="grid gap-4 sm:grid-cols-2">
        {details.map(([label, value]) => (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3" key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>
      <div>
        <h3 className="text-sm font-semibold text-slate-700">Mô tả</h3>
        <p className="mt-2 whitespace-pre-wrap rounded-lg border border-slate-200 p-4 text-sm leading-6 text-slate-700">
          {disease.description || "Chưa có mô tả."}
        </p>
      </div>
    </div>
  );
}
