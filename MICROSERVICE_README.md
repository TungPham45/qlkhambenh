# Hướng Dẫn Chạy & Kiến Trúc Hệ Thống Quản Lý Phòng Khám (React + NestJS + PostgreSQL + Redis)

## 📋 Tổng quan
Hệ thống quản lý phòng khám đã được chuyển đổi hoàn toàn sang kiến trúc **Microservices chuẩn Enterprise**:
- **Giao diện (Frontend)**: React 18 (Vite, Tailwind CSS, Lucide Icons, Axios)
- **Hệ thống dịch vụ (Backend)**: NestJS Monorepo Microservices (10 Services độc lập)
- **Giao tiếp nội bộ (Message Broker)**: Redis Microservice Transporter
- **Cơ sở dữ liệu (Database)**: PostgreSQL 16 + TypeORM
- **Triển khai (DevOps)**: Docker & Docker Compose

---

## 🚀 Hướng dẫn Chạy Nhanh (Quick Start)

### 1. Yêu cầu hệ thống
- **Docker Desktop** (hoặc Docker Engine + Docker Compose v2)
- **Node.js** v18+ / v20+ (nếu muốn chạy trực tiếp trên máy không qua Docker)
- Cổng trống trên máy: `3000` (Frontend), `3001` (API Gateway), `5432` (PostgreSQL), `6379` (Redis)

### 2. Khởi động toàn bộ hệ thống bằng Docker Compose
Mở PowerShell tại thư mục gốc của dự án:
```powershell
docker-compose up -d --build
```

Kiểm tra trạng thái các container:
```powershell
docker-compose ps
```

### 3. Truy cập hệ thống
- **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
- **API Gateway (Swagger / Health)**: [http://localhost:3001/api/health](http://localhost:3001/api/health)
- **Tài khoản mặc định**:
  - `admin` / `123456` (Quản trị viên hệ thống)
  - `doctor1` / `123456` (Bác sĩ)
  - `reception1` / `123456` (Tiếp tân)
  - `pharmacist1` / `123456` (Dược sĩ)
  - `cashier1` / `123456` (Thu ngân)

---

## 🏗️ Danh sách các Microservices (Backend Monorepo)

| Service | Thư mục | Chức năng chính |
|---|---|---|
| **api-gateway** | `apps/api-gateway` | Cổng HTTP tiếp nhận request, xác thực JWT, điều phối sang Redis |
| **auth-service** | `apps/auth-service` | Đăng nhập, cấp phát và xác thực JWT, phân quyền người dùng |
| **patient-service** | `apps/patient-service` | Quản lý hồ sơ bệnh nhân, lịch sử khám |
| **appointment-service** | `apps/appointment-service` | Đặt lịch khám, phân bổ khung giờ bác sĩ |
| **medical-record-service** | `apps/medical-record-service`| Phiếu khám bệnh, chẩn đoán ICD-10, kê đơn thuốc |
| **pharmacy-service** | `apps/pharmacy-service` | Danh mục thuốc, quản lý nhập xuất tồn kho thuốc |
| **billing-service** | `apps/billing-service` | Tính tiền, xuất hóa đơn khám & thuốc |
| **staff-service** | `apps/staff-service` | Quản lý thông tin nhân viên, bác sĩ, lịch trực |
| **statistical-service** | `apps/statistical-service` | Báo cáo doanh thu, lượt khám, thuốc tiêu thụ |
| **analytics-service** | `apps/analytics-service` | Thống kê nâng cao và dự báo dữ liệu |

---

## 🛠️ Phát triển cục bộ (Local Development)

### Chạy Backend (Development mode)
```powershell
cd backend-nestjs
npm install
# Khởi động riêng lẻ từng service:
npm run start:dev api-gateway
npm run start:dev auth-service
npm run start:dev patient-service
# ...
```

### Chạy Frontend
```powershell
cd frontend
npm install
npm run dev
```
Giao diện frontend sẽ chạy tại: `http://localhost:3000` hoặc `http://localhost:5173`.
