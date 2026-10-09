import { Edit3, Plus, RefreshCw, Save, Trash2, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { endpoints } from "../../api/endpoints.js";
import { httpClient } from "../../api/httpClient.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import { formatDate } from "../../utils/formatters.js";

const emptyForm = { fullName: "", phone: "", email: "", dateOfBirth: "", gender: "", address: "", healthInsuranceNumber: "" };
const genderLabels = { Nam: "Nam", Nu: "Nữ", Khac: "Khác" };

function toForm(profile) {
  return Object.fromEntries(Object.keys(emptyForm).map((key) => [key, profile?.[key] || ""]));
}

export function PatientProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const applyProfile = useCallback((response) => {
    const nextUser = response.user;
    setProfile(nextUser);
    setHasProfile(Boolean(response.hasProfile ?? nextUser?.hasProfile));
    updateUser(nextUser);
  }, [updateUser]);

  useEffect(() => {
    let active = true;
    httpClient.get(endpoints.auth.profile)
      .then((response) => { if (active) applyProfile(response); })
      .catch((caught) => { if (active) setError(caught?.message || "Không thể tải thông tin cá nhân."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [applyProfile]);

  async function reloadProfile() {
    setLoading(true);
    setError("");
    try {
      applyProfile(await httpClient.get(endpoints.auth.profile));
    } catch (caught) {
      setError(caught?.message || "Không thể tải thông tin cá nhân.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing() {
    setForm(hasProfile ? toForm(profile) : { ...emptyForm });
    setError("");
    setMessage("");
    setEditing(true);
  }

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (saving) return;
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim() || null]));
    if (!payload.fullName) {
      setError("Vui lòng nhập họ và tên.");
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = hasProfile
        ? await httpClient.put(endpoints.auth.profile, payload)
        : await httpClient.post(endpoints.auth.profile, payload);
      applyProfile(response);
      setEditing(false);
      setMessage(hasProfile ? "Đã cập nhật thông tin cá nhân." : "Đã thêm thông tin cá nhân.");
    } catch (caught) {
      setError(caught?.message || "Không thể lưu thông tin cá nhân.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProfile() {
    if (saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      applyProfile(await httpClient.delete(endpoints.auth.profile));
      setDeleting(false);
      setMessage("Đã xóa thông tin cá nhân. Bạn có thể thêm lại hồ sơ khi cần.");
    } catch (caught) {
      setDeleting(false);
      setError(caught?.message || "Không thể xóa thông tin cá nhân.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-5 max-w-4xl mx-auto">
      <div className="page-toolbar"><div><h1 className="text-2xl font-bold">Thông tin cá nhân</h1><p className="mt-1 text-sm text-slate-500">Quản lý hồ sơ bệnh nhân của chính bạn.</p></div></div>
      {error ? <div className="public-alert public-alert-error" role="alert">{error}</div> : null}
      {message ? <div className="public-alert public-alert-success" role="status">{message}</div> : null}
      {loading ? <div className="app-card p-6" role="status">Đang tải thông tin cá nhân...</div> : !profile ? (
        <div className="app-card p-6"><button className="btn-secondary" type="button" onClick={reloadProfile}><RefreshCw size={16} /> Tải lại</button></div>
      ) : (
        <section className="app-card p-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-5 mb-5"><span className="public-avatar" aria-hidden="true"><UserRound size={22} /></span><div><h2 className="text-lg font-semibold">{hasProfile ? profile.fullName : "Chưa có thông tin cá nhân"}</h2><p className="text-sm text-slate-500">Tài khoản: {profile.username}</p></div></div>
          {editing ? (
            <form className="grid gap-5" onSubmit={saveProfile}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Họ và tên" name="fullName" value={form.fullName} onChange={setField} maxLength={150} required />
                <Field label="Số điện thoại" name="phone" type="tel" value={form.phone} onChange={setField} maxLength={20} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={setField} maxLength={150} />
                <Field label="Ngày sinh" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={setField} max={new Date().toLocaleDateString("sv-SE")} />
                <label className="grid gap-2 text-sm font-medium"><span>Giới tính</span><select className="form-input" name="gender" value={form.gender} onChange={(event) => setField("gender", event.target.value)}><option value="">Chọn giới tính</option><option value="Nam">Nam</option><option value="Nu">Nữ</option><option value="Khac">Khác</option></select></label>
                <Field label="Số bảo hiểm y tế" name="healthInsuranceNumber" value={form.healthInsuranceNumber} onChange={setField} maxLength={50} />
                <Field className="sm:col-span-2" label="Địa chỉ" name="address" value={form.address} onChange={setField} maxLength={255} />
              </div>
              <div className="flex flex-wrap justify-end gap-3"><button className="btn-secondary" type="button" disabled={saving} onClick={() => { setEditing(false); setError(""); }}>Hủy</button><button className="btn-primary" type="submit" disabled={saving}><Save size={16} /> {saving ? "Đang lưu..." : hasProfile ? "Lưu thay đổi" : "Thêm thông tin"}</button></div>
            </form>
          ) : hasProfile ? (
            <>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Detail label="Họ và tên" value={profile.fullName} /><Detail label="Số điện thoại" value={profile.phone} />
                <Detail label="Email" value={profile.email} /><Detail label="Ngày sinh" value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : null} />
                <Detail label="Giới tính" value={genderLabels[profile.gender] || profile.gender} /><Detail label="Số bảo hiểm y tế" value={profile.healthInsuranceNumber} />
                <Detail label="Địa chỉ" value={profile.address} />
              </dl>
              <div className="flex flex-wrap justify-end gap-3 mt-6"><button className="btn-secondary" type="button" onClick={startEditing}><Edit3 size={16} /> Sửa thông tin</button><button className="btn-danger" type="button" onClick={() => { setError(""); setDeleting(true); }}><Trash2 size={16} /> Xóa thông tin</button></div>
            </>
          ) : (
            <div className="grid justify-items-start gap-4"><p className="text-sm text-slate-500">Thêm thông tin cá nhân để hoàn thiện hồ sơ và sử dụng dịch vụ khám bệnh.</p><button className="btn-primary" type="button" onClick={startEditing}><Plus size={16} /> Thêm thông tin cá nhân</button></div>
          )}
        </section>
      )}
      <Modal title="Xóa thông tin cá nhân" open={deleting} onClose={() => { if (!saving) setDeleting(false); }}>
        <p className="text-sm">Bạn có chắc muốn xóa hồ sơ cá nhân? Tài khoản đăng nhập vẫn được giữ để bạn có thể thêm lại thông tin.</p>
        <div className="flex justify-end gap-3 mt-5"><button className="btn-secondary" type="button" disabled={saving} onClick={() => setDeleting(false)}>Hủy</button><button className="btn-danger" type="button" disabled={saving} onClick={deleteProfile}>{saving ? "Đang xóa..." : "Xác nhận xóa"}</button></div>
      </Modal>
    </div>
  );
}

function Field({ label, name, value, onChange, className = "", ...props }) {
  return <label className={`grid gap-2 text-sm font-medium ${className}`}><span>{label}</span><input className="form-input" name={name} value={value} onChange={(event) => onChange(name, event.target.value)} {...props} /></label>;
}

function Detail({ label, value }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-medium break-words">{value || "Chưa cung cấp"}</dd></div>;
}
