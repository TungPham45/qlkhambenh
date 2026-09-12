# Chuyển đổi từ giao diện MVC cũ sang React + API

## 1. Mục tiêu của giai đoạn migration

Dự án hiện có một lớp MVC/PHP cũ và một frontend React mới. Giai đoạn chuyển đổi nhằm:

- giữ hệ thống đang chạy ổn định;
- dần chuyển màn hình sang React;
- không phá vỡ API cũ trong khi di trú;
- tránh việc duy trì song song hai logic nghiệp vụ khác nhau cho cùng một màn hình.

## 2. Nguyên tắc chốt

- **React là giao diện chính**.
- MVC cũ chỉ còn vai trò legacy/migration.
- Gateway/API là đường đi chuẩn cho dữ liệu.
- Không mở rộng thêm chức năng mới vào MVC cũ nếu chức năng đó đã có trên React.

## 3. Cách di trú một màn hình

Khi chuyển một module từ MVC sang React:

1. Giữ route/API cũ để tránh đứt luồng.
2. Tạo page React tương ứng.
3. Dùng `httpClient` gọi cùng endpoint backend.
4. Kiểm tra role bằng `ProtectedRoute` hoặc `RoleGate`.
5. Khi React đã ổn định, đánh dấu màn hình MVC là legacy.
6. Chỉ xoá code MVC cũ sau khi đã test xong toàn bộ luồng.

## 4. Những màn hình ưu tiên di trú trước

Ưu tiên theo thứ tự nghiệp vụ:

1. Đăng nhập / đăng ký / phiên người dùng.
2. Dashboard.
3. Bệnh nhân.
4. Lịch khám.
5. Phiếu khám / hồ sơ y tế.
6. Hoá đơn / thanh toán.
7. Thuốc / đơn thuốc.
8. Tài khoản / nhân viên.
9. Analytics / statistics.

## 5. Vai trò của MVC cũ

MVC cũ được giữ lại vì:

- có dữ liệu và logic đang hoạt động;
- có thể dùng làm đối chiếu khi migration;
- hỗ trợ rollback nếu React chưa ổn định.

Tuy nhiên, MVC cũ không nên là nơi phát triển chức năng chính mới.

## 6. Khi nào được xoá giao diện cũ

Chỉ xoá phần UI cũ khi:

- React đã có đủ màn hình tương đương;
- API contract không còn phụ thuộc vào HTML cũ;
- luồng đăng nhập, tạo/sửa/xoá và phân quyền đều chạy ổn định;
- người kiểm thử xác nhận giao diện mới thay thế hoàn toàn.
