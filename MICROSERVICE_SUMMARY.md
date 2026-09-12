# TỔNG QUAN KIẾN TRÚC HỆ THỐNG QUẢN LÝ PHÒNG KHÁM (REACT + NESTJS MICROSERVICES + POSTGRESQL + REDIS)

## 🎯 Tổng quan
Hệ thống đã được chuyển đổi hoàn toàn sang kiến trúc hiện đại chuẩn Enterprise:
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Axios
- **Backend**: NestJS Monorepo Microservices (10 Services)
- **Transport / Message Broker**: Redis Microservices Transporter (Pub/Sub & Request-Response Patterns)
- **Database / ORM**: PostgreSQL + TypeORM
- **Containerization**: Docker & Docker Compose đa container

---

## 🏗️ Sơ đồ Kiến trúc Hệ thống

```
                                  ┌──────────────────────────────┐
                                  │      React + Vite Frontend   │
                                  │       (Port: 3000 / Web)     │
                                  └──────────────┬───────────────┘
                                                 │ HTTP / REST API (JWT)
                                  ┌──────────────▼───────────────┐
                                  │      API Gateway (NestJS)    │
                                  │       (HTTP Port: 3001)      │
                                  │  - Auth Guard / JWT Verify   │
                                  │  - Routing & Aggregation     │
                                  │  - Global Validation / CORS  │
                                  └──────────────┬───────────────┘
                                                 │
                                                 │ Redis Microservice Transporter
                     ┌───────────────────────────┴──────────────────────────┐
                     │              REDIS (Broker / PubSub - 6379)          │
                     └───┬────────────┬────────────┬────────────┬───────────┘
                         │            │            │            │
          ┌──────────────┼────────────┼────────────┼────────────┼──────────────┐
          │              │            │            │            │              │
    ┌─────▼────┐   ┌─────▼────┐ ┌─────▼────┐ ┌─────▼────┐ ┌─────▼────┐   ┌─────▼────┐
    │  Auth    │   │ Patient  │ │ Appoint- │ │ Medical  │ │ Pharmacy │   │ Billing  │ ...
    │ Service  │   │ Service  │ │   ment   │ │  Record  │ │ Service  │   │ Service  │
    └─────┬────┘   └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘   └─────┬────┘
          │              │            │            │            │              │
          └──────────────┴────────────┼────────────┴────────────┴──────────────┘
                                      │ TypeORM Queries
                               ┌──────▼──────┐
                               │  PostgreSQL │
                               │ (Port 5432) │
                               └─────────────┘
```

---

## 📁 Cấu trúc Thư mục Toàn bộ Dự án Sau khi Chuyển Đổi

```text
qlphongkham_build/
├── .env                                # Biến môi trường hệ thống (Docker & Microservices)
├── .env.example                        # Mẫu file cấu hình môi trường
├── .gitignore                          # Cấu hình bỏ qua các file rác/node_modules/dist
├── docker-compose.yml                  # Docker Compose triển khai toàn bộ 13 containers
├── MIGRATION_SPECIFICATION_*.md        # Bản đặc tả kỹ thuật chi tiết
├── MICROSERVICE_SUMMARY.md             # Tài liệu kiến trúc tổng quát
│
├── database/                           # Dữ liệu & Script khởi tạo cơ sở dữ liệu
│   ├── init-postgres.sql               # Script khởi tạo bảng & dữ liệu mẫu PostgreSQL
│   ├── qlphongkham.sql                 # Dữ liệu mẫu ban đầu
│   └── schema.sql                      # Schema DDL PostgreSQL
│
├── backend-nestjs/                     # TOÀN BỘ BACKEND NESTJS MICROSERVICES (Monorepo)
│   ├── Dockerfile                      # Multi-stage Dockerfile cho các microservices
│   ├── nest-cli.json                   # Cấu hình Workspace NestJS Monorepo
│   ├── package.json                    # Dependencies (TypeORM, pg, redis, @nestjs/microservices, ...)
│   ├── tsconfig.json                   # Cấu hình TypeScript & Path Mapping (@app/common, @app/database)
│   │
│   ├── libs/                           # Thư viện dùng chung giữa các Services
│   │   ├── common/                     # Tiện ích chung, DTOs, Enums, Guards, Decorators
│   │   └── database/                   # TypeORM Entities (User, Patient, Appointment, Bill, Medicine, ...)
│   │
│   └── apps/                           # 10 Microservices độc lập
│       ├── api-gateway/                # Cổng vào duy nhất tiếp nhận HTTP/REST từ Frontend
│       │   └── src/
│       │       ├── controllers/        # Điều phối request (Auth, Patient, Appointment, Billing, ...)
│       │       └── main.ts             # Lắng nghe HTTP Port 3001
│       │
│       ├── auth-service/               # Xác thực, Đăng nhập, JWT, Phân quyền RBAC
│       ├── patient-service/            # Quản lý Hồ sơ Bệnh nhân, Tiền sử bệnh
│       ├── appointment-service/        # Quản lý Đặt lịch khám, Lịch hẹn bác sĩ
│       ├── medical-record-service/     # Quản lý Phiếu khám, Chẩn đoán, Toa thuốc
│       ├── pharmacy-service/           # Quản lý Kho dược phẩm, Đơn vị, Nhập xuất kho
│       ├── billing-service/            # Quản lý Hóa đơn, Thanh toán, Chi phí khám/thuốc
│       ├── staff-service/              # Quản lý Nhân sự, Bác sĩ, Dược sĩ, Ca làm việc
│       ├── statistical-service/        # Thống kê Doanh thu, Lượt khám, Báo cáo tài chính
│       └── analytics-service/          # Phân tích dữ liệu & Dashboard chỉ số
│
└── frontend/                           # GIAO DIỆN NGƯỜI DÙNG REACT + VITE + TAILWIND CSS
    ├── Dockerfile                      # Nginx / Node container cho Frontend
    ├── index.html                      # Entry HTML
    ├── package.json                    # React 18, Lucide React, Axios, React Router Dom
    ├── vite.config.js                  # Vite configuration
    ├── tailwind.config.js              # Tailwind CSS Design Tokens & Utilities
    └── src/
        ├── App.jsx                     # Root React Router Component
        ├── main.jsx                    # Entry point ReactDOM
        ├── api/                        # Axios instance & Cấu hình Interceptors (JWT Bearer)
        ├── services/                   # API clients gọi sang API Gateway
        ├── context/                    # AuthContext, NotificationContext, Global State
        ├── hooks/                      # Custom Hooks (useAuth, useFetch, ...)
        ├── layouts/                    # MainLayout (Sidebar, Topbar, Header, Footer)
        ├── components/                 # UI Components (Button, Modal, Table, Card, Badge, Alert, ...)
        ├── pages/                      # Các trang nghiệp vụ:
        │   ├── DashboardPage.jsx       # Trang tổng quan thống kê
        │   ├── LoginPage.jsx           # Trang đăng nhập
        │   ├── PatientsPage.jsx        # Quản lý bệnh nhân
        │   ├── AppointmentsPage.jsx    # Lịch khám
        │   ├── MedicalRecordsPage.jsx  # Hồ sơ bệnh án & khám bệnh
        │   ├── PharmacyPage.jsx        # Quản lý kho thuốc & cấp thuốc
        │   ├── BillingPage.jsx         # Thu ngân & Hóa đơn
        │   ├── StaffPage.jsx           # Quản lý nhân sự & bác sĩ
        │   ├── StatisticsPage.jsx      # Báo cáo thống kê chuyên sâu
        │   └── SettingsPage.jsx        # Cài đặt hệ thống
        └── styles/                     # CSS tùy chỉnh, animations, glassmorphism
```

---

## ⚙️ Bảng phân phối Cổng (Ports) & Dịch vụ Docker

| Dịch vụ / Container | Công nghệ | Cổng Host | Vai trò |
|---|---|---|---|
| **postgres** | PostgreSQL 16 | `5432` | Lưu trữ dữ liệu quan hệ tập trung |
| **redis** | Redis 7 Alpine | `6379` | Message Broker & Cache tốc độ cao |
| **frontend** | React + Vite (Nginx) | `3000` | Giao diện Single Page Application (SPA) |
| **api-gateway** | NestJS HTTP | `3001` | REST API Gateway công khai |
| **auth-service** | NestJS Microservice | Internal | Xác thực & Quản lý User |
| **patient-service** | NestJS Microservice | Internal | Hồ sơ bệnh nhân |
| **appointment-service**| NestJS Microservice | Internal | Đặt lịch khám |
| **medical-record-service**| NestJS Microservice | Internal | Khám bệnh & Bệnh án |
| **pharmacy-service** | NestJS Microservice | Internal | Kho dược & Thuốc |
| **billing-service** | NestJS Microservice | Internal | Viện phí & Hóa đơn |
| **staff-service** | NestJS Microservice | Internal | Nhân sự bác sĩ |
| **statistical-service**| NestJS Microservice | Internal | Báo cáo thống kê |
| **analytics-service** | NestJS Microservice | Internal | Phân tích dữ liệu |
