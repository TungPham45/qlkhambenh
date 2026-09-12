# Quy ước bảo mật

Tài liệu này mô tả các nguyên tắc bảo mật tối thiểu của dự án.

## 1. Authentication

Hệ thống dùng JWT cho xác thực.

Luồng chuẩn:

1. Người dùng đăng nhập qua `/auth/login`.
2. Backend trả về token và thông tin người dùng.
3. Frontend lưu token để gửi kèm `Authorization: Bearer <token>`.
4. Khi khởi động lại ứng dụng, frontend gọi `/auth/me` để xác thực lại phiên.

## 2. Authorization

- Frontend chỉ dùng để **ẩn/hiện giao diện** theo role.
- Backend phải kiểm tra role ở từng endpoint quan trọng.
- Không được chỉ dựa vào việc ẩn menu ở React.

## 3. Lưu trạng thái đăng nhập

- Token và user được lưu ở `localStorage` để phục vụ đồ án và dễ triển khai.
- Khi token lỗi hoặc hết hạn, frontend phải tự xoá session và chuyển về trang đăng nhập.

## 4. Dữ liệu demo

- Có thể giữ dữ liệu seed cho mục đích kiểm thử và trình bày đồ án.
- Không hardcode tài khoản vào giao diện đăng nhập.
- Không dùng dữ liệu mặc định trong UI như một cơ chế xác thực.

## 5. Phân quyền phổ biến trong dự án

- `Admin`
- `BacSi`
- `LeTan`
- `NguoiDung`

Tên role cần nhất quán giữa backend và frontend.
