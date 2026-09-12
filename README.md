# 🏥 HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA (CLINIC MANAGEMENT SYSTEM)

Hệ thống quản lý phòng khám hiện đại được xây dựng theo kiến trúc **Microservices chuẩn Enterprise**:
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + Axios (Single Page Application)
- **Backend**: NestJS Monorepo Microservices (10 Services độc lập)
- **Message Broker / Transport**: Redis Microservice Transporter (Pub/Sub & Request-Response)
- **Database / ORM**: PostgreSQL 16 + TypeORM
- **Triển khai**: Docker & Docker Compose

---

## 📋 Yêu Cầu Cài Đặt Trước (Prerequisites)

Trước khi bắt đầu, máy tính của bạn cần cài đặt:
1. **Git**: Để clone mã nguồn.
2. **Docker & Docker Desktop** *(Khuyến nghị - cách nhanh và chuẩn nhất)*: [Tải tại đây](https://www.docker.com/products/docker-desktop/)
3. **Node.js**: Phiên bản `v18.x` hoặc `v20.x` *(Chỉ cần nếu muốn chạy trực tiếp không qua Docker)*: [Tải tại đây](https://nodejs.org/)

---

## 🚀 CÁCH 1: KHỞI ĐỘNG NHANH BẰNG DOCKER (KHUYẾN NGHỊ ⭐⭐⭐)

Đây là cách đơn giản nhất dành cho người mới clone repo về máy. Toàn bộ cơ sở dữ liệu PostgreSQL, Redis cache, 10 Backend Microservices và Frontend React sẽ tự động cài đặt và chạy chỉ với 1 câu lệnh.

### Bước 1: Clone dự án về máy
```bash
git clone <URL_REPO_CUA_BAN>
cd qlphongkham_build
```

### Bước 2: Tạo file cấu hình môi trường `.env`
Sao chép file `.env.example` thành `.env`:
- **Trên Windows PowerShell**:
  ```powershell
  Copy-Item .env.example .env
  ```
- **Trên Linux / MacOS**:
  ```bash
  cp .env.example .env
  ```

*(File `.env.example` đã được cấu hình sẵn các thông số mặc định tương thích 100% với Docker Compose, bạn không cần phải sửa gì thêm nếu chạy mặc định).*

### Bước 3: Build và khởi động toàn bộ hệ thống
```bash
docker-compose up -d --build
```
> ⏳ **Lưu ý**: Lần đầu tiên chạy sẽ mất khoảng 2 - 5 phút để Docker tải image và build các container.

### Bước 4: Kiểm tra trạng thái các container
```bash
docker-compose ps
```
Khi thấy tất cả 13 containers đều ở trạng thái `running` / `Up` là hệ thống đã sẵn sàng!

---

## 💻 CÁCH 2: CHẠY THỦ CÔNG ĐỂ PHÁT TRIỂN (LOCAL DEVELOPMENT)

Nếu bạn là lập trình viên muốn chỉnh sửa code và xem thay đổi ngay (Hot Reload):

### 1. Khởi động PostgreSQL & Redis bằng Docker trước
```bash
docker-compose up -d postgres redis
```

### 2. Cài đặt và khởi chạy Backend (NestJS Monorepo)
```bash
# Di chuyển vào thư mục backend
cd backend-nestjs

# Cài đặt toàn bộ dependencies
npm install

# Khởi chạy API Gateway và các Microservices cần thiết:
npm run start:dev api-gateway
```
*(Để chạy các microservice khác trong cửa sổ terminal riêng:)*
```bash
npm run start:dev auth-service
npm run start:dev patient-service
npm run start:dev appointment-service
npm run start:dev medical-record-service
npm run start:dev pharmacy-service
npm run start:dev billing-service
npm run start:dev staff-service
npm run start:dev statistical-service
npm run start:dev analytics-service
```

### 3. Cài đặt và khởi chạy Frontend (React + Vite)
Mở một cửa sổ Terminal mới:
```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Khởi chạy giao diện ở chế độ Development
npm run dev
```

---

## 🌐 ĐỊA CHỈ TRUY CẬP VÀ DANH MỤC CỔNG (PORTS)

| Dịch vụ | Địa chỉ URL / Port | Mô tả |
|---|---|---|
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Giao diện quản lý phòng khám React |
| **API Gateway (REST API)** | [http://localhost:3001](http://localhost:3001) | Cổng API backend công khai |
| **Kiểm tra sức khỏe API** | [http://localhost:3001/api/health](http://localhost:3001/api/health) | Healthcheck endpoint |
| **PostgreSQL Database** | `localhost:5432` | DB: `qlphongkham`, User: `postgres`, Pass: `postgres` |
| **Redis Broker** | `localhost:6379` | Message broker & cache |

---

## 🔐 TÀI KHOẢN ĐĂNG NHẬP MẪU (TEST ACCOUNTS)

Hệ thống đã có sẵn dữ liệu và tài khoản mẫu cho từng phân quyền:

| Vai trò | Tên đăng nhập | Mật khẩu | Chức năng chính |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `123456` | Toàn quyền quản trị hệ thống, nhân sự, cấu hình |
| **Bác sĩ (Doctor)** | `doctor1` | `123456` | Khám bệnh, chẩn đoán, kê đơn thuốc, xem hồ sơ bệnh án |
| **Tiếp tân (Receptionist)** | `reception1` | `123456` | Tiếp đón bệnh nhân, đặt lịch khám, phân phòng |
| **Dược sĩ (Pharmacist)** | `pharmacist1` | `123456` | Quản lý kho thuốc, cấp phát thuốc theo đơn |
| **Thu ngân (Cashier)** | `cashier1` | `123456` | Thu viện phí, xuất hóa đơn thanh toán |

---

## 🛠️ CÁC LỆNH HỮU ÍCH KHI QUẢN LÝ DỰ ÁN

### 1. Xem nhật ký log của hệ thống
- Xem log toàn bộ hệ thống:
  ```bash
  docker-compose logs -f
  ```
- Xem log riêng của 1 service (ví dụ `api-gateway` hoặc `auth-service`):
  ```bash
  docker-compose logs -f api-gateway
  docker-compose logs -f auth-service
  ```

### 2. Dừng hệ thống
```bash
docker-compose down
```

### 3. Dừng hệ thống và XÓA SẠCH dữ liệu database (Reset từ đầu)
```bash
docker-compose down -v
```

### 4. Build lại hệ thống khi có cập nhật code mới
```bash
docker-compose up -d --build
```

---

## ❓ XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

1. **Lỗi `Port 5432 or 3000 is already in use`**:
   - Kiểm tra xem máy bạn có đang chạy PostgreSQL cục bộ hoặc dịch vụ nào khác chiếm cổng hay không. Hãy tắt dịch vụ đó hoặc đổi cổng trong file `.env`.
2. **Lỗi không kết nối được Database**:
   - Chạy lệnh `docker-compose restart api-gateway` sau khi PostgreSQL container đã chuyển sang trạng thái sẵn sàng.
3. **Frontend không gọi được API**:
   - Đảm bảo `API Gateway` đang chạy tại port `3001` và file `.env` của frontend có `VITE_API_BASE_URL=http://localhost:3001/api`.
