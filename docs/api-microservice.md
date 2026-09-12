# Kiến trúc API và mô hình microservice

## 1. Mục tiêu

Dự án được tổ chức theo hướng **React SPA + API Gateway + backend theo module/service**.
Mục tiêu chính là:

- Tách giao diện ra khỏi xử lý nghiệp vụ.
- Đưa mọi request từ frontend đi qua gateway.
- Dễ mở rộng từng module theo kiểu service.
- Giữ tương thích với phần MVC cũ trong giai đoạn chuyển đổi.

## 2. Thành phần chính

- **Frontend React**: giao diện chính của hệ thống.
- **API Gateway**: điểm vào duy nhất của backend đối với frontend.
- **Auth**: đăng nhập, đăng xuất, xác thực phiên, lấy thông tin user.
- **Patient**: quản lý bệnh nhân.
- **Appointment**: quản lý lịch khám.
- **Medical Record**: hồ sơ khám, chẩn đoán, phiếu khám.
- **Billing**: hoá đơn, thanh toán.
- **Drug / Prescription**: thuốc và đơn thuốc.
- **Accounts / Staff**: tài khoản và nhân sự.
- **Analytics / Statistics**: dashboard, KPI, số liệu tổng hợp.

## 3. Ranh giới trách nhiệm

### Frontend React

Frontend chỉ làm các việc sau:

- hiển thị giao diện;
- điều hướng màn hình;
- gọi API qua `httpClient`;
- lưu token/session ở phía client;
- render theo role;
- hiển thị trạng thái loading, lỗi và empty state.

Frontend **không** truy cập database trực tiếp.

### API Gateway

Gateway chịu trách nhiệm:

- xác thực JWT;
- chuyển request tới module phù hợp;
- chuẩn hoá request/response ở mức đường biên;
- chặn request không hợp lệ;
- hỗ trợ aggregation cho dashboard và báo cáo.

### Backend module/service

Mỗi module/backend service phụ trách nghiệp vụ riêng và trả JSON theo hợp đồng đã thống nhất.

## 4. Luồng đăng nhập

1. Người dùng mở `http://localhost:3000/`.
2. React hiển thị màn hình đăng nhập.
3. Frontend gọi `POST /api/auth/login`.
4. Backend trả token và user.
5. Frontend lưu token và user.
6. Khi app khởi động lại, frontend gọi `GET /api/auth/me` để xác thực phiên.

## 5. Hợp đồng endpoint chính

### Auth

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`
- `GET /auth/me`

### Nghiệp vụ

- `GET /patients`
- `GET /appointments`
- `GET /billings`
- `GET /drugs`
- `GET /prescriptions`
- `GET /medical-records`
- `GET /admin/staff`

### Phân tích số liệu

- `GET /analytics/dashboard`
- `GET /analytics/kpis`
- `GET /statistics/averages`
- `GET /statistics/distributions`
- `GET /statistics/trends`
- `GET /statistics/forecast`
- `GET /statistics/anomalies`
- `GET /statistics/timeseries`

## 6. Định dạng dữ liệu

Frontend hiện hỗ trợ 2 dạng payload phổ biến:

### Dạng danh sách

```json
{
  "data": [
    { "id": 1, "name": "A" },
    { "id": 2, "name": "B" }
  ]
}
```

### Dạng danh sách có phân trang

```json
{
  "data": {
    "data": [
      { "id": 1, "name": "A" }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 1
    }
  }
}
```

### Dạng object đơn

```json
{
  "data": {
    "token": "...",
    "user": {
      "id": 1,
      "VaiTro": "Admin"
    }
  }
}
```

## 7. Quy tắc khi thêm endpoint mới

Khi bổ sung API mới, cần giữ 4 nguyên tắc:

- route rõ nghĩa, đặt theo số nhiều nếu là collection;
- response JSON nhất quán;
- backend kiểm tra quyền;
- frontend chỉ dùng `endpoints.js` để tập trung cấu hình.
