import { useEffect, useState } from "react";

const EMPTY_FORM = {
  code: "",
  name: "",
  group: "",
  description: "",
};

export function DiseaseForm({ initialValue, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setForm({
      code: initialValue?.code || "",
      name: initialValue?.name || "",
      group: initialValue?.group || "",
      description: initialValue?.description || "",
    });
  }, [initialValue]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      group: form.group.trim(),
      description: form.description.trim(),
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Mã bệnh <span className="text-rose-600">*</span>
          <input
            className="form-input uppercase"
            maxLength={50}
            required
            value={form.code}
            onChange={(event) => updateField("code", event.target.value)}
            placeholder="Ví dụ: J00"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Tên bệnh <span className="text-rose-600">*</span>
          <input
            className="form-input"
            maxLength={255}
            required
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Nhập tên bệnh"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Nhóm bệnh
          <input
            className="form-input"
            maxLength={100}
            value={form.group}
            onChange={(event) => updateField("group", event.target.value)}
            placeholder="Ví dụ: Hô hấp"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
          Mô tả
          <textarea
            className="form-input min-h-28"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Mô tả ngắn về bệnh"
          />
        </label>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </button>
      </div>
    </form>
  );
}
