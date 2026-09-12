import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setError("");

    const username = form.username.trim();
    const password = form.password;

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      await login({
        username,
        password,
      });

      navigate(
        location.state?.from?.pathname ||
        "/dashboard",
        {
          replace: true,
        }
      );
    } catch (caught) {
      setError(
        caught?.message ||
        "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="login-card">
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/songlinh.jpg"
            alt="Logo phòng khám Song Linh"
            className="h-11 w-11 rounded-lg"
          />

          <div>
            <h1 className="text-xl font-bold text-slate-950">
              Quản lý Phòng khám
            </h1>

            <p className="text-sm text-slate-500">
              Hệ thống quản lý phòng khám
            </p>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger">
            {error}
          </div>
        ) : null}

        {location.state?.message ? (
          <div className="alert alert-success">
            {location.state.message}
          </div>
        ) : null}

        <form
          className="grid gap-4"
          onSubmit={handleSubmit}
        >
          <label className="form-label">
            Tên đăng nhập

            <input
              className="form-control"
              type="text"
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
              autoFocus
              required
              value={form.username}
              onChange={(event) =>
                setForm({
                  ...form,
                  username:
                    event.target.value.trimStart(),
                })
              }
            />
          </label>

          <label className="form-label">
            Mật khẩu

            <input
              className="form-control"
              type="password"
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password:
                    event.target.value,
                })
              }
            />
          </label>

          <button
            className="btn-primary"
            type="submit"
            disabled={
              loading ||
              !form.username.trim() ||
              !form.password.trim()
            }
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-950">
          Chưa có tài khoản?{" "}

          <Link
            className="font-semibold text-blue-700 hover:text-blue-800"
            to="/register"
          >
            Đăng ký
          </Link>
        </div>
      </section>
    </main>
  );
}