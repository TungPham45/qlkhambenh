# 🏥 HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA (CLINIC MANAGEMENT SYSTEM)

Hệ thống quản lý phòng khám hiện đại chuẩn **Enterprise Microservices Architecture**:
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Axios (Single Page Application)
- **Backend**: NestJS Monorepo Microservices (10 Services độc lập)
- **Message Broker / Transport**: Redis Microservices Transporter (Pub/Sub & Request-Response)
- **Database / ORM**: PostgreSQL 16 + TypeORM
- **Triển khai**: Docker & Docker Compose (13 Containers)

---

## ⚡ KHỞI ĐỘNG SIÊU TỐC (QUICK START - 1 CLICK)

Chỉ cần clone dự án về và làm theo 1 trong các cách dưới đây:

### 🌟 Cách A: Dành cho Windows (Tiện nhất - Chỉ 1 Click đúp chuột)
1. **Mở Docker Desktop**.
2. Click đúp chuột vào file **`start.bat`** trong thư mục dự án.
   *(Script sẽ tự động tạo file `.env`, build 13 containers và tự mở trình duyệt tới Web App!)*
3. Để tắt hệ thống: Click đúp vào file **`stop.bat`**.

---

### 🚀 Cách B: Dành cho Terminal / Command Line (Khuyến nghị)
Sau khi clone repo về máy:
```bash
# 1. Chạy toàn bộ hệ thống bằng Docker Compose:
docker-compose up -d --build

# Hoặc dùng lệnh npm ngắn gọn:
npm run start:build
```
> ⏳ **Lưu ý**: Lần đầu tiên chạy sẽ mất khoảng 1 - 3 phút để tải image và build các service. Các lần sau chỉ mất vài giây.

---

### 🐧 Cách C: Dành cho Linux / macOS
```bash
chmod +x start.sh stop.sh
./start.sh
```

---

## 🌐 ĐỊA CHỈ TRUY CẬP HỆ THỐNG

| Dịch vụ | Địa chỉ URL | Ghi chú |
|---|---|---|
| **Frontend Web App** | **[http://localhost:3000](http://localhost:3000)** | Giao diện quản lý phòng khám React SPA |
| **API Gateway (Swagger Docs)** | **[http://localhost:3001/api/docs](http://localhost:3001/api/docs)** | Tài liệu OpenAPI / REST API tương tác |
| **Kiểm tra API Health** | [http://localhost:3001/api/health](http://localhost:3001/api/health) | Trạng thái API Gateway |
| **PostgreSQL Database** | `localhost:5432` | DB: `clinic_master`, User: `clinic_admin`, Pass: `clinic_secure_password` |
| **Redis Message Broker** | `localhost:6379` | Broker trao đổi tin nhắn microservices |

---

## 🔐 TÀI KHOẢN ĐĂNG NHẬP MẪU (TEST ACCOUNTS)

Hệ thống đã có sẵn dữ liệu và tài khoản mẫu cho từng phân quyền:

| Phân quyền / Vai trò | Tên đăng nhập | Mật khẩu | Chức năng nghiệp vụ |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `123456` | Toàn quyền quản trị hệ thống, nhân sự, tài chính |
| **Bác sĩ (Doctor)** | `doctor1` | `123456` | Khám bệnh, chẩn đoán ICD-10, kê đơn thuốc, xem hồ sơ |
| **Dược sĩ (Pharmacist)** | `pharmacist1` | `123456` | Quản lý kho dược, xuất/nhập thuốc, phát thuốc theo đơn |
| **Thu ngân (Cashier)** | `cashier1` | `123456` | Tính viện phí, xuất hóa đơn thanh toán |

---

## 💻 DÀNH CHO LẬP TRÌNH VIÊN PHÁT TRIỂN (LOCAL DEV)

Nếu bạn muốn can thiệp code và chạy chế độ Hot-Reload không qua Docker:

### 1. Bật Database PostgreSQL & Redis
```bash
docker-compose up -d postgres redis
```

### 2. Cài đặt toàn bộ dependencies
```bash
npm run install:all
```

### 3. Khởi chạy Backend (NestJS Monorepo)
```bash
cd backend-nestjs
npm run start:dev api-gateway
# Khởi chạy các service khác nếu cần:
npm run start:dev auth-service
npm run start:dev patient-service
# ...
```

### 4. Khởi chạy Frontend (React + Vite)
```bash
cd frontend
npm run dev
```

---

## 🛠️ CÁC LỆNH HỮU ÍCH

| Thao tác | Lệnh ngắn (NPM) | Lệnh Docker Compose tương đương |
|---|---|---|
| **Khởi động** | `npm start` | `docker-compose up -d` |
| **Khởi động & Build lại** | `npm run start:build` | `docker-compose up -d --build` |
| **Dừng hệ thống** | `npm stop` | `docker-compose down` |
| **Khởi động lại** | `npm run restart` | `docker-compose restart` |
| **Xem Logs trực tiếp** | `npm run logs` | `docker-compose logs -f` |
| **Xem trạng thái container** | `npm run ps` | `docker-compose ps` |
| **Reset toàn bộ database** | `npm run clean` | `docker-compose down -v` |
