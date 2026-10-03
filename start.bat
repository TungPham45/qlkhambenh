@echo off
chcp 65001 > nul
cls
echo ==============================================================================
echo        🏥 HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA (CLINIC MANAGEMENT)
echo        Kiến trúc: React + NestJS Microservices + PostgreSQL + Redis
echo ==============================================================================
echo.

:: 1. Kiểm tra file .env
if not exist .env (
    echo [1/4] Khởi tạo file cấu hình môi trường .env từ .env.example...
    copy .env.example .env > nul
    echo       -> Đã tạo .env thành công!
) else (
    echo [1/4] File cấu hình .env đã tồn tại.
)

:: 2. Kiểm tra Docker
echo [2/4] Kiểm tra trạng thái Docker...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker chưa được khởi động!
    echo Vui lòng mở ứng dụng Docker Desktop và đợi Docker khởi động xong, sau đó chạy lại file này.
    echo.
    pause
    exit /b 1
)
echo       -> Docker đang chạy tốt.

:: 3. Build và khởi động các container
echo.
echo [3/4] Đang khởi động toàn bộ 13 containers (DB, Redis, Microservices, Frontend)...
echo       (Lần đầu tiên có thể mất 2-3 phút để tải và build...)
echo.
docker-compose up -d --build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Khởi động thất bại! Vui lòng kiểm tra lại log bên trên.
    pause
    exit /b 1
)

:: 4. Hoàn tất & Mở trình duyệt
echo.
echo [4/4] Khởi động thành công!
echo.
echo ==============================================================================
echo  🌐 TRUY CẬP HỆ THỐNG:
echo  - Frontend Web App:     http://localhost:3000
echo  - API Gateway (Docs):    http://localhost:3001/api/docs
echo  - PostgreSQL Database:   localhost:5432 (User: clinic_admin, Pass: clinic_secure_password)
echo  - Redis Message Broker:  localhost:6379
echo.
echo  🔐 TÀI KHOẢN MẪU:
echo  - Quản trị viên: admin       / 123456
echo  - Bác sĩ:        doctor1     / 123456
echo  - Dược sĩ:       pharmacist1 / 123456
echo  - Thu ngân:      cashier1    / 123456
echo ==============================================================================
echo.
echo Đang mở trình duyệt vào Web App...
start http://localhost:3000

echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này (Hệ thống vẫn tiếp tục chạy ngầm).
echo Để dừng hệ thống, chạy file 'stop.bat'.
echo.
pause > nul
