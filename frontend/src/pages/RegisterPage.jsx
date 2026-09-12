import { Activity } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { endpoints } from "../api/endpoints.js";
import { httpClient } from "../api/httpClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  HoTen: "",
  TenDangNhap: "",
  MatKhau: "",
  GioiTinh: "",
  SoDienThoai: "",
  NgaySinh: "",
  DiaChi: "",
  TienSuBenh: ""
};

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await httpClient.post(endpoints.auth.register, form);
      navigate("/login", {
        replace: true,
        state: { message: "Đăng ký tài khoản thành công. Vui lòng đăng nhập." }
      });
    } catch (caught) {
      setError(caught.message || "Không thể đăng ký tài khoản");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="app-card w-full max-w-3xl p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-600 text-white">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Đăng ký tài khoản</h1>
          </div>
        </div>

        {error ? <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Họ tên" name="HoTen" value={form.HoTen} onChange={setField} required />
            <Field label="Tên đăng nhập" name="TenDangNhap" value={form.TenDangNhap} onChange={setField} required />
            <Field label="Mật khẩu" name="MatKhau" type="password" value={form.MatKhau} onChange={setField} required />
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Giới tính
              <select className="form-input" value={form.GioiTinh} onChange={(event) => setField("GioiTinh", event.target.value)} required>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
                <option value="Khac">Khác</option>
              </select>
            </label>
            <Field label="Số điện thoại" name="SoDienThoai" value={form.SoDienThoai} onChange={setField} required />
            <Field label="Ngày sinh" name="NgaySinh" type="date" value={form.NgaySinh} onChange={setField} />
            <Field label="Địa chỉ" name="DiaChi" value={form.DiaChi} onChange={setField} required className="md:col-span-2" />
            <label className="grid gap-1 text-sm font-medium text-slate-700 md:col-span-2">
              Tiền sử bệnh
              <textarea className="form-input min-h-24" value={form.TienSuBenh} onChange={(event) => setField("TienSuBenh", event.target.value)} />
            </label>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-600">
          Đã có tài khoản? <Link className="font-semibold text-blue-700 hover:text-blue-800" to="/login">Đăng nhập</Link>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, className = "" }) {
  return (
    <label className={`grid gap-1 text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <input className="form-input" type={type} value={value} required={required} onChange={(event) => onChange(name, event.target.value)} />
    </label>
  );
}
