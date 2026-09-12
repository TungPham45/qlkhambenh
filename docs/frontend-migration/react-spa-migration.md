# Kế hoạch chuyển sang React SPA

Frontend React trong thư mục `frontend/` là giao diện chính của hệ thống.
Trong giai đoạn chuyển đổi, phần PHP MVC cũ chỉ giữ vai trò legacy để đối chiếu và rollback khi cần.

## 1. Mục tiêu của frontend mới

- Tách giao diện khỏi nghiệp vụ.
- Dùng React Router để quản lý route.
- Dùng Context để quản lý auth và toast.
- Dùng `httpClient` tập trung để gọi API gateway.
- Hạn chế code nghiệp vụ lẫn vào UI.

## 2. Cấu trúc frontend hiện tại

```text
frontend/src/
  api/
    endpoints.js
    httpClient.js
    response.js
  components/
    common/
    feedback/
    table/
  context/
    AuthContext.jsx
    ToastContext.jsx
  hooks/
  layouts/
  modules/
  pages/
  routes/
  services/
  styles/
  utils/
```

## 3. Những phần đã có trong React

- Trang đăng nhập và đăng ký.
- Dashboard.
- Analytics.
- Statistics.
- Các trang module: patients, appointments, billing, pharmacy, medical-records, accounts, staff.
- Layout dùng sidebar và navbar.
- Route bảo vệ cho người chưa đăng nhập.
- Token storage ở phía client.
- Axios client tự gắn JWT vào header `Authorization`.

## 4. Chuẩn giao tiếp với backend

React chỉ gọi các endpoint trong `endpoints.js`.
Không viết URL rải rác trong từng component.

Ví dụ:

- `/auth/login`
- `/auth/me`
- `/patients`
- `/appointments`
- `/billings`
- `/analytics/dashboard`
- `/statistics/averages`

## 5. Quy tắc bảo vệ route

- Chưa đăng nhập: chuyển về `/login`.
- Có token nhưng phiên không hợp lệ: tự logout.
- Không đủ role: chuyển về dashboard hoặc trang hợp lệ khác.

## 6. Ẩn menu theo role

Frontend chỉ nên dùng để ẩn menu và route phù hợp với:

- `Admin`
- `BacSi`
- `LeTan`
- `NguoiDung`

Tuy nhiên, backend vẫn phải kiểm tra quyền lại ở endpoint.

## 7. Lộ trình di trú module

### Bước 1: Auth

- Hoàn thiện login.
- Thêm `GET /auth/me` để bootstrap phiên.
- Logout sạch khi token lỗi.

### Bước 2: Dashboard

- Hiển thị KPI cards.
- Đọc dữ liệu từ `/api/analytics/dashboard`.
- Giữ dashboard ở trạng thái read-only cho tới khi module ổn định.

### Bước 3: Patients

- Tách service API riêng.
- Dùng hook riêng cho danh sách, tìm kiếm và thao tác CRUD.

### Bước 4: Các module còn lại

- Appointments.
- Medical records.
- Billing.
- Pharmacy / prescriptions.
- Accounts / staff.

## 8. Thư viện và thành phần dùng chung

Các thành phần nên tái sử dụng:

- `DataTable`
- `Modal`
- `LoadingState`
- `ErrorBoundary`
- `RoleGate`
- `ProtectedRoute`
- `ToastContext`
- `useAsync`
- `tokenStorage`
- `formatters`

## 9. Khi nào bỏ hoàn toàn giao diện PHP cũ

Chỉ bỏ sau khi:

- React đã có đủ màn hình;
- người dùng nội bộ xác nhận chạy ổn;
- fallback đã được sao lưu;
- không còn route quan trọng nào phụ thuộc giao diện cũ.
