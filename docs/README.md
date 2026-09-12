# Tài liệu dự án Quản lý Phòng khám

Tài liệu này mô tả kiến trúc hiện tại và lộ trình chuyển đổi của dự án **quản lý phòng khám** theo hướng **React SPA + API Gateway + các module backend**.

## Đọc theo thứ tự này

1. `setup.md` – cách chạy dự án.
2. `api-microservice.md` – kiến trúc tổng thể và hợp đồng API.
3. `api-migration.md` – cách chuyển dần từ MVC cũ sang API + React.
4. `frontend-migration/react-spa-migration.md` – lộ trình React SPA.
5. `analytics-statistics-services.md` – phần analytics/statistics.
6. `security.md` – quy tắc bảo mật và phiên đăng nhập.

## Trạng thái kiến trúc

- **Frontend chính:** React SPA trong thư mục `frontend/`.
- **Cổng vào backend:** API Gateway.
- **MVC cũ:** giữ lại để migration và đối chiếu, không xem là giao diện chính.
- **Luồng chuẩn:** React gọi `/api/*` qua gateway, không truy cập database trực tiếp.

## Quy ước quan trọng

- Token / session được quản lý ở phía client nhưng phải được backend xác thực lại.
- Phân quyền phải được kiểm tra ở **backend**, không chỉ ẩn menu ở giao diện.
- Các API dùng response JSON thống nhất để frontend dễ normalize dữ liệu.

## URL chạy chính

- Frontend React: `http://localhost:3000/`
- Backend / Gateway: `http://localhost/`
