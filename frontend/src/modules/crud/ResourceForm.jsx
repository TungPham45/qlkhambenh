import { useEffect, useState } from "react";
import { lookupConfigs } from "./resourceConfigs.js";

export function ResourceForm({ config, initialValue, mode, lookups, onSubmit, onCancel, saving }) {
  const fields = mode === "edit" && config.editFields ? config.editFields : config.fields;
  const [form, setForm] = useState({});
  const [items, setItems] = useState([{ MaThuoc: "", SoLuong: 1, LieuDung: "" }]);

  useEffect(() => {
    const next = {};
    fields.forEach((field) => {
      next[field.name] = initialValue?.[field.name] ?? field.default ?? "";
    });
    if (initialValue?.[config.pk]) {
      next[config.pk] = initialValue[config.pk];
    }
    setForm(next);
    if (Array.isArray(initialValue?.ChiTiet) && initialValue.ChiTiet.length) {
      setItems(initialValue.ChiTiet);
    }
  }, [config.pk, fields, initialValue]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function normalizePayload() {
    const payload = { ...form };
    fields.forEach((field) => {
      if (field.type === "number" && payload[field.name] !== "" && payload[field.name] !== null) {
        payload[field.name] = Number(payload[field.name]);
      }
      if (payload[field.name] === "") {
        payload[field.name] = null;
      }
    });
    if (config.customForm === "prescription") {
      payload.ChiTiet = items
        .map((item) => ({
          MaThuoc: item.MaThuoc ? Number(item.MaThuoc) : null,
          SoLuong: item.SoLuong ? Number(item.SoLuong) : null,
          LieuDung: String(item.LieuDung || "").trim()
        }))
        .filter((item) => item.MaThuoc && item.SoLuong && item.LieuDung);
    }
    enrichOwnership(payload, config, lookups);
    return config.toApiPayload ? config.toApiPayload(payload) : payload;
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(normalizePayload());
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.name} field={field} value={form[field.name] ?? ""} lookups={lookups} onChange={setField} />
        ))}
      </div>
      {config.customForm === "prescription" ? (
        <PrescriptionItems items={items} lookups={lookups} onChange={setItems} />
      ) : null}
      <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
        <button className="btn-secondary" type="button" onClick={onCancel}>Hủy</button>
        <button className="btn-primary" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu"}</button>
      </div>
    </form>
  );
}

function enrichOwnership(payload, config, lookups) {
  if (config.workflow === "medicalRecord" && payload.MaLich) {
    const appointment = lookups.appointments?.map?.get(String(payload.MaLich));
    if (appointment) {
      payload.MaBN = appointment.MaBN ?? payload.MaBN ?? null;
      payload.MaBacSi = appointment.MaBacSi ?? payload.MaBacSi ?? null;
    }
  }

  if ((config.workflow === "billing" || config.workflow === "prescription") && payload.MaPhieu) {
    const record = lookups.records?.map?.get(String(payload.MaPhieu));
    if (record) {
      payload.MaBN = record.MaBN ?? payload.MaBN ?? null;
      payload.MaBacSi = record.MaBacSi ?? payload.MaBacSi ?? null;
    }
  }
}

function Field({ field, value, lookups, onChange }) {
  const common = {
    className: "form-input",
    value: value ?? "",
    required: field.required,
    onChange: (event) => onChange(field.name, event.target.value)
  };

  if (field.type === "textarea") {
    return (
      <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
        {field.label}
        <textarea {...common} className="form-input min-h-24" />
      </label>
    );
  }

  if (field.type === "select") {
    const options = field.lookup
      ? (lookups[field.lookup]?.rows || []).map((row) => {
          const lookup = lookupConfigs[field.lookup];
          return { value: row[lookup.key], label: lookup.label(row) };
        })
      : field.options || [];
    return (
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        {field.label}
        <select {...common}>
          <option value="">Chọn</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    );
  }

  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      {field.label}
      <input {...common} type={field.type || "text"} step={field.step} />
    </label>
  );
}

function PrescriptionItems({ items, lookups, onChange }) {
  const drugs = lookups.drugs?.rows || [];

  function update(index, key, value) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  function addRow() {
    onChange([...items, { MaThuoc: "", SoLuong: 1, LieuDung: "" }]);
  }

  function removeRow(index) {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    onChange(next.length ? next : [{ MaThuoc: "", SoLuong: 1, LieuDung: "" }]);
  }

  return (
    <section className="grid gap-3 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-950">Chi tiết thuốc</h3>
        <button className="btn-secondary" type="button" onClick={addRow}>Thêm dòng</button>
      </div>
      {items.map((item, index) => (
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_2fr_auto]" key={index}>
          <select className="form-input" value={item.MaThuoc || ""} onChange={(event) => update(index, "MaThuoc", event.target.value)}>
            <option value="">Chọn thuốc</option>
            {drugs.map((drug) => <option key={drug.MaThuoc} value={drug.MaThuoc}>{drug.TenThuoc}</option>)}
          </select>
          <input className="form-input" type="number" min="1" value={item.SoLuong || 1} onChange={(event) => update(index, "SoLuong", event.target.value)} />
          <input className="form-input" placeholder="Liều dùng" value={item.LieuDung || ""} onChange={(event) => update(index, "LieuDung", event.target.value)} />
          <button className="btn-danger" type="button" onClick={() => removeRow(index)}>Xóa</button>
        </div>
      ))}
    </section>
  );
}
