# TÀI LIỆU ĐẶC TẢ HỆ THỐNG VÀ HƯỚNG DẪN CHUYỂN ĐỔI KIẾN TRÚC
## DỰ ÁN: HỆ THỐNG QUẢN LÝ PHÒNG KHÁM (CLINIC MANAGEMENT SYSTEM)
### KIẾN TRÚC MỤC TIÊU: REACT (TYPESCRIPT) + NESTJS MICROSERVICES + REDIS (TRANSPORT, PUB/SUB, CACHE, LOCK) + POSTGRESQL

---

## MỤC LỤC
1. [TỔNG QUAN KIẾN TRÚC MỤC TIÊU (NESTJS MICROSERVICES + REDIS + POSTGRESQL)](#1-tổng-quan-kiến-trúc-mục-tiêu-nestjs-microservices--redis--postgresql)
2. [CẤU TRÚC DỰ ÁN HIỆN TẠI VÀ BẢN ĐỒ CHUYỂN ĐỔI](#2-cấu-trúc-dự-án-hiện-tại-và-bản-đồ-chuyển-đổi)
3. [MÔ HÌNH TRUYỀN THÔNG & TƯƠNG TÁC QUA REDIS](#3-mô-hình-truyền-thông--tương-tác-qua-redis)
   - [3.1 Cơ chế Request - Response RPC (Message Pattern)](#31-cơ-chế-request---response-rpc-message-pattern)
   - [3.2 Cơ chế Bất đồng bộ Hướng sự kiện (Event-Driven Pub/Sub)](#32-cơ-chế-bất-đồng-bộ-hướng-sự-kiện-event-driven-pubsub)
   - [3.3 Khóa phân tán Redis (Distributed Lock / Redlock)](#33-khóa-phân-tán-redis-distributed-lock--redlock)
   - [3.4 Bộ nhớ đệm phân tán (Redis Caching & Invalidation)](#34-bộ-nhớ-đệm-phân-tán-redis-caching--invalidation)
   - [3.5 Hàng đợi tác vụ nền (BullMQ / Redis Queue)](#35-hàng-đợi-tác-vụ-nền-bullmq--redis-queue)
4. [MA TRẬN PHÂN QUYỀN & VAI TRÒ (RBAC MATRIX)](#4-ma-trận-phân-quyền--vai-trò-rbac-matrix)
5. [THIẾT KẾ CƠ SỞ DỮ LIỆU POSTGRESQL THEO TỪNG MICROSERVICE (DATABASE-PER-SERVICE)](#5-thiết-kế-cơ-sở-dữ-liệu-postgresql-theo-từng-microservice-database-per-service)
6. [ĐẶC TẢ CHI TIẾT TỪNG DỊCH VỤ MICROSERVICE (PROCESS & CRITERIA)](#6-đặc-tả-chi-tiết-từng-dịch-vụ-microservice-process--criteria)
   - [6.1 API Gateway Service (Entry Point & Security)](#61-api-gateway-service-entry-point--security)
   - [6.2 Auth & Account Microservice](#62-auth--account-microservice)
   - [6.3 Staff Microservice](#63-staff-microservice)
   - [6.4 Patient Microservice](#64-patient-microservice)
   - [6.5 Appointment Microservice (Chống trùng lịch)](#65-appointment-microservice-chống-trùng-lịch)
   - [6.6 Medical Record Microservice (EMR)](#66-medical-record-microservice-emr)
   - [6.7 Pharmacy Microservice (Quản lý dược & Atomic Stock Deduction)](#67-pharmacy-microservice-quản-lý-dược--atomic-stock-deduction)
   - [6.8 Billing Microservice (Thu ngân & Tính tiền tự động)](#68-billing-microservice-thu-ngân--tính-tiền-tự-động)
   - [6.9 Analytics Microservice (BI & Realtime Dashboard)](#69-analytics-microservice-bi--realtime-dashboard)
   - [6.10 Statistical Microservice (AI/Stats Forecasting & Anomaly Engine)](#610-statistical-microservice-aistats-forecasting--anomaly-engine)
7. [THIẾT KẾ MÃ NGUỒN BACKEND NESTJS MICROSERVICES MONOREPO](#7-thiết-kế-mã-nguồn-backend-nestjs-microservices-monorepo)
8. [THIẾT KẾ MÃ NGUỒN FRONTEND REACT (TYPESCRIPT)](#8-thiết-kế-mã-nguồn-frontend-react-typescript)
9. [KỊCH BẢN DDL POSTGRESQL HOÀN CHỈNH](#9-kịch-bản-ddl-postgresql-hoàn-chỉnh)
10. [LỘ TRÌNH THỰC THI & DOCKER COMPOSE ORCHESTRATION](#10-lộ-trình-thực-thi--docker-compose-orchestration)

---

## 1. TỔNG QUAN KIẾN TRÚC MỤC TIÊU (NESTJS MICROSERVICES + REDIS + POSTGRESQL)

```
                                  ┌─────────────────────────────────────────┐
                                  │      React 18 SPA (TypeScript + Vite)   │
                                  │   TanStack Query + Zustand + Tailwind   │
                                  └────────────────────┬────────────────────┘
                                                       │ HTTPS / REST / WS
                                                       ▼
                                  ┌─────────────────────────────────────────┐
                                  │           NestJS API GATEWAY            │
                                  │  - Global JWT Authentication Guard      │
                                  │  - Role-based Access Control (RBAC)     │
                                  │  - ValidationPipe (class-validator)     │
                                  │  - Redis Rate Limiting (Throttler)      │
                                  │  - ClientProxy (Redis Transporter)      │
                                  └────────────────────┬────────────────────┘
                                                       │
                           ┌───────────────────────────┴───────────────────────────┐
                           │               REDIS MESSAGE BROKER & BUS              │
                           │  - Transport: REDIS (Host: redis:6379)               │
                           │  - RPC (@MessagePattern) & Pub/Sub (@EventPattern)   │
                           │  - Distributed Locks (Redlock)                       │
                           │  - Realtime Cache-Aside (TTL + Invalidation)         │
                           │  - BullMQ Queue Engine (Cron jobs, Heavy stats)      │
                           └─┬─────────┬─────────┬─────────┬─────────┬───────────┬─┘
                             │         │         │         │         │           │
     ┌───────────────────────┼─────────┼─────────┼─────────┼─────────┼───────────┤
     │                       │         │         │         │         │           │
┌────▼──────┐ ┌──────────────▼┐ ┌──────▼────┐ ┌──▼───────┐ ┌▼────────▼┐ ┌▼──────────▼─┐
│Auth & Acct│ │  Appointment  │ │Medical Rec│ │ Pharmacy │ │ Billing  │ │Stats & BI  │
│Microserv. │ │  Microservice │ │Microserv. │ │Microserv.│ │Microserv.│ │Microservs. │
└────┬──────┘ └──────────────┬┘ └──────┬────┘ └──┬───────┘ └┬─────────┘ └┬───────────┘
     │                       │         │         │          │            │
┌────▼──────┐ ┌──────────────▼┐ ┌──────▼────┐ ┌──▼───────┐ ┌▼─────────┐ ┌▼───────────┐
│PostgreSQL │ │  PostgreSQL   │ │PostgreSQL │ │PostgreSQL│ │PostgreSQL│ │ PostgreSQL  │
│ (db_auth) │ │(db_appointmnt)│ │(db_medrec)│ │(db_pharm)│ │(db_bill) │ │(db_analyt)  │
└───────────┘ └───────────────┘ └───────────┘ └──────────┘ └──────────┘ └─────────────┘
```

---

## 2. CẤU TRÚC DỰ ÁN HIỆN TẠI VÀ BẢN ĐỒ CHUYỂN ĐỔI

| Thành phần hiện tại (PHP + MySQL) | Thành phần chuyển đổi (NestJS + Redis + PostgreSQL) | Giao thức / Cơ chế giao tiếp |
| :--- | :--- | :--- |
| `services/gateway` (PHP Apache Proxy) | `apps/api-gateway` (NestJS REST API Gateway) | HTTP (Client) $\rightarrow$ Redis ClientProxy |
| `services/auth-service` & `account-service` | `apps/auth-service` (NestJS Microservice) | `Transport.REDIS` (Message & Events) |
| `services/patient-service` | `apps/patient-service` (NestJS Microservice) | `Transport.REDIS` |
| `services/appointment-service` | `apps/appointment-service` (NestJS Microservice) | `Transport.REDIS` + Redis Distributed Lock |
| `services/medical-record-service` | `apps/medical-record-service` (NestJS Microservice) | `Transport.REDIS` |
| `services/pharmacy-service` | `apps/pharmacy-service` (NestJS Microservice) | `Transport.REDIS` + Atomic Stock Lock |
| `services/billing-service` | `apps/billing-service` (NestJS Microservice) | `Transport.REDIS` + Event-driven Emitters |
| `services/analytics-service` | `apps/analytics-service` (NestJS Microservice) | `Transport.REDIS` + Redis Cache Invalidation |
| `services/statistical-service` | `apps/statistical-service` (NestJS Microservice) | `Transport.REDIS` + BullMQ Cron Workers |
| `frontend/` (React Vite JS) | `apps/web-client` (React 18 + TS + TanStack Query) | REST API to API Gateway |
| MySQL Databases | PostgreSQL 16+ (Database-per-service hoặc Multi-schema) | TypeORM / Prisma ORM |

---

## 3. MÔ HÌNH TRUYỀN THÔNG & TƯƠNG TÁC QUA REDIS

### 3.1 Cơ chế Request - Response RPC (Message Pattern)
Dùng cho các nghiệp vụ đồng bộ cần kết quả trả về ngay cho Frontend thông qua API Gateway.

```typescript
// Trong API Gateway Controller:
@Get('patients/:id')
async getPatient(@Param('id', ParseIntPipe) id: number) {
  return await firstValueFrom(
    this.patientClient.send({ cmd: 'patient.get_by_id' }, { id })
  );
}

// Trong Patient Microservice Controller:
@MessagePattern({ cmd: 'patient.get_by_id' })
async handleGetPatientById(@Payload() data: { id: number }) {
  return await this.patientService.findById(data.id);
}
```

### 3.2 Cơ chế Bất đồng bộ Hướng sự kiện (Event-Driven Pub/Sub)
Dùng cho các nghiệp vụ không cần người dùng chờ đợi, giúp tách rời (decoupling) các dịch vụ.

```
                  ┌──────────────────────────────┐
                  │   Doctor Finish Examination  │
                  └──────────────┬───────────────┘
                                 │
                   Emits: 'medical_record.created'
                                 ▼
                     [REDIS EVENT BUS (PUBSUB)]
                     ┌───────────┴───────────┐
                     │                       │
                     ▼                       ▼
           ┌──────────────────┐    ┌──────────────────┐
           │ Billing Service  │    │Pharmacy Service  │
           │ Tạo bản nháp HĐ  │    │Chuẩn bị đơn thuốc│
           └──────────────────┘    └──────────────────┘

                                 ...

                  ┌──────────────────────────────┐
                  │    Patient Pay Invoice       │
                  └──────────────┬───────────────┘
                                 │
                     Emits: 'billing.invoice_paid'
                                 ▼
                     [REDIS EVENT BUS (PUBSUB)]
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌───────────────────┐    ┌──────────────────┐
│Pharmacy Service │    │ Analytics Service │    │Notification Svc  │
│Trừ tồn kho thuốc│    │ Xóa Cache DoanhThu│    │Gửi SMS/Zalo Bệnh │
│(Atomic Deduct)  │    │ & Tính lại KPIs   │    │nhân biên lai     │
└─────────────────┘    └───────────────────┘    └──────────────────┘
```

### 3.3 Khóa phân tán Redis (Distributed Lock / Redlock)
Được áp dụng tại 2 điểm xung yếu nhất của phòng khám:
1. **Chống trùng lịch khám Bác sĩ (`appointment-service`)**:
   - Khi có 2 yêu cầu đặt lịch cùng lúc cho 1 bác sĩ trong cùng khung giờ:
   - Sử dụng khóa: `lock:doctor:${doctorId}:date:${date}:slot:${time}` với TTL 5 giây để tuần tự hóa việc kiểm tra xung đột và ghi dữ liệu.
2. **Chống bán âm kho thuốc (`pharmacy-service`)**:
   - Khi nhiều giao dịch thanh toán đồng thời chứa cùng một loại thuốc:
   - Sử dụng khóa: `lock:drug:${drugId}:stock` kết hợp câu lệnh PostgreSQL `SELECT ... FOR UPDATE` đảm bảo tính nhất quán tuyệt đối.

### 3.4 Bộ nhớ đệm phân tán (Redis Caching & Invalidation)
- **Danh mục thuốc & Nhân viên y tế**: Cache trong Redis với TTL 1 giờ (`cache:drugs:catalog`, `cache:staff:doctors`).
- **Dashboard KPIs**: Cache với TTL 5 phút (`cache:analytics:dashboard:kpis`).
- **Cơ chế Xóa Cache Chủ động (Active Invalidation)**: Khi có sự kiện `billing.invoice_paid` hoặc `appointment.created`, Redis tự động xóa cache liên quan thay vì chờ hết TTL.

### 3.5 Hàng đợi tác vụ nền (BullMQ / Redis Queue)
- Tác vụ huấn luyện / tính toán mô hình Hồi quy tuyến tính (Linear Regression) và Phát hiện dị thường (Anomaly Detection) được đưa vào hàng đợi `stats-processing-queue` chạy ngầm vào 00:00 hàng ngày hoặc khi có lệnh Recompute từ Quản trị viên.

---

## 4. MA TRẬN PHÂN QUYỀN & VAI TRÒ (RBAC MATRIX)

| Phân hệ / Endpoint Logic | Admin | Bác sĩ (`BacSi`) | Bệnh nhân (`NguoiDung`) |
| :--- | :---: | :---: | :---: |
| `POST /api/auth/register`, `POST /api/auth/login` | Có | Có | Có |
| `GET /api/accounts`, `POST /api/accounts` | Toàn quyền | Không | Không |
| `GET /api/staff`, `POST /api/staff` | Toàn quyền | Xem danh sách | Xem danh sách |
| `GET /api/patients`, `POST /api/patients` | Toàn quyền | Xem/Tìm kiếm | Chỉ xem hồ sơ cá nhân |
| `POST /api/appointments` | Toàn quyền | Không | Đặt cho chính mình |
| `PATCH /api/appointments/:id/status` | Toàn quyền | Cập nhật ca khám | Hủy lịch của mình |
| `POST /api/medical-records` | Xem | Tạo phiếu khám | Xem bệnh án của mình |
| `POST /api/prescriptions` | Xem | Kê đơn thuốc | Xem đơn thuốc của mình |
| `GET /api/drugs`, `POST /api/drugs` | Toàn quyền | Xem danh mục | Không |
| `POST /api/billings` | Toàn quyền | Xem | Xem hóa đơn của mình |
| `PATCH /api/billings/:id/status` (Thanh toán) | Toàn quyền | Không | Tự thanh toán online |
| `GET /api/analytics/dashboard` | Toàn quyền | Xem số liệu cá nhân | Không |
| `GET /api/statistics/*` (Dự báo, Bất thường) | Toàn quyền | Không | Không |

---

## 5. THIẾT KẾ CƠ SỞ DỮ LIỆU POSTGRESQL THEO TỪNG MICROSERVICE (DATABASE-PER-SERVICE)

Hệ thống triển khai theo mô hình **Database-per-Service** (mỗi microservice sở hữu schema hoặc database riêng biệt để độc lập mở rộng):

```
PostgreSQL Server
├── db_auth          (Bảng: accounts, roles, permissions)
├── db_staff         (Bảng: staff, specialties, schedules)
├── db_patient       (Bảng: patients, patient_allergies)
├── db_appointment   (Bảng: appointments, time_slots)
├── db_medical_record(Bảng: medical_records, diagnoses)
├── db_pharmacy      (Bảng: drugs, prescriptions, prescription_items, stock_audits)
├── db_billing       (Bảng: invoices, invoice_items, payments)
└── db_analytics     (Bảng: computed_metrics, daily_snapshots, forecasts)
```

---

## 6. ĐẶC TẢ CHI TIẾT TỪNG DỊCH VỤ MICROSERVICE (PROCESS & CRITERIA)

---

### 6.1 API Gateway Service (Entry Point & Security)
- **Nhiệm vụ**:
  1. Tiếp nhận toàn bộ HTTP request từ Frontend React.
  2. Xác thực JWT Bearer Token qua `JwtAuthGuard`.
  3. Kiểm tra vai trò người dùng qua `RolesGuard`.
  4. Xác thực dữ liệu đầu vào qua `ValidationPipe` (class-validator).
  5. Giới hạn tần suất gọi API qua `ThrottlerGuard` lưu trữ trạng thái trên Redis (Rate Limiting: 100 requests/phút).
  6. Chuyển tiếp request đến các Microservices tương ứng thông qua `ClientProxy` với Redis Transporter.

---

### 6.2 Auth & Account Microservice
- **Message Patterns**:
  - `auth.login`: Xác thực username, password hash (Bcrypt / Argon2id). Trả về Access Token (1h) + Refresh Token (7d).
  - `auth.register`: Đăng ký tài khoản mới $\rightarrow$ Phát sự kiện `auth.user_registered` để `patient-service` tự động tạo profile Bệnh nhân.
  - `account.get_all`, `account.update_status`, `account.reset_password`.
- **Tiêu chí**:
  - Mật khẩu tối thiểu 6 ký tự.
  - Chặn đăng nhập nếu `status === 'Inactive'` hoặc `'Locked'`.

---

### 6.3 Staff Microservice
- **Message Patterns**:
  - `staff.get_all`, `staff.get_by_id`, `staff.create`, `staff.update`, `staff.get_doctors`.
- **Tiêu chí**:
  - Phân loại chuyên khoa (`specialty`): *Khoa nhi, Tai mũi họng, Khoa xét nghiệm, Khoa mắt*.

---

### 6.4 Patient Microservice
- **Message Patterns**:
  - `patient.get_all`: Phân trang, lọc theo tên, số điện thoại.
  - `patient.get_by_id`: Lấy thông tin chi tiết + tiền sử bệnh án.
  - `patient.create`: Tạo bệnh nhân mới (kiểm tra trùng số điện thoại).
  - `patient.update`: Cập nhật thông tin.
- **Event Listeners**:
  - `@EventPattern('auth.user_registered')`: Tự động khởi tạo bản ghi bệnh nhân gắn với `account_id`.

---

### 6.5 Appointment Microservice (Chống trùng lịch)
- **Message Patterns**:
  - `appointment.get_list`, `appointment.get_by_id`, `appointment.create`, `appointment.update_status`.
- **Thuật toán Chống trùng lịch (Doctor Conflict Detection)**:
  - Khi nhận request đặt lịch tại ngày $D$, giờ $T$ cho Bác sĩ $B$:
    1. Đặt Redis Lock: `lock:doctor:${B}:date:${D}` (TTL 3s).
    2. Truy vấn cơ sở dữ liệu tìm tất cả lịch hẹn khác trạng thái `'Huy'` của Bác sĩ $B$ trong ngày $D$.
    3. Nếu tồn tại bất kỳ ca khám nào có $|T_{\text{khám}} - T| < 60\text{ phút}$:
       $\rightarrow$ Giải phóng Lock và ném `RpcException` với mã lỗi `409 Conflict`.
    4. Nếu thỏa mãn: Lưu bản ghi mới với `status = 'Cho kham'` $\rightarrow$ Giải phóng Lock.
    5. Phát sự kiện `@EventPattern('appointment.created')`.

---

### 6.6 Medical Record Microservice (EMR)
- **Message Patterns**:
  - `medical_record.create`: Tạo phiếu khám gồm `symptoms`, `diagnosis`, `conclusion`, `examination_fee` (mặc định 150.000 VNĐ).
  - `medical_record.get_by_appointment`, `medical_record.get_by_patient`.
- **Quy trình kết hợp**:
  - Khi Bác sĩ nhấn *Hoàn thành khám*:
    1. Gửi lệnh tạo Phiếu khám `medical_record.create`.
    2. Nếu có kê thuốc: Gửi tiếp lệnh `prescription.create` sang `pharmacy-service`.
    3. Cập nhật trạng thái lịch khám `appointment.update_status` sang `'Da kham'`.
    4. Phát sự kiện `@EventPattern('medical_record.completed')` để `billing-service` tự động chuẩn bị hóa đơn.

---

### 6.7 Pharmacy Microservice (Quản lý dược & Atomic Stock Deduction)
- **Message Patterns**:
  - `drug.get_all`, `drug.create`, `drug.update_stock`.
  - `prescription.create`: Lưu đơn thuốc và danh sách chi tiết (`prescription_items`).
  - `prescription.deduct_stock`: Thực hiện trừ tồn kho theo đơn thuốc.
- **Cơ chế Trừ kho Nguyên tử (Atomic Concurrency Deduction)**:
  - Lắng nghe sự kiện `@EventPattern('billing.invoice_paid')` hoặc RPC `prescription.deduct_stock`:
    1. Thiết lập Distributed Lock trên Redis cho từng mã thuốc trong đơn.
    2. Mở Transaction PostgreSQL:
       ```sql
       SELECT id, drug_name, stock_quantity FROM drugs WHERE id = :drugId FOR UPDATE;
       ```
    3. Kiểm tra: Nếu `stock_quantity < quantity_needed` $\rightarrow$ Rollback và ghi nhật ký cảnh báo thiếu thuốc.
    4. Thực thi: `UPDATE drugs SET stock_quantity = stock_quantity - :quantity WHERE id = :drugId;`
    5. Commit Transaction $\rightarrow$ Giải phóng Redis Lock $\rightarrow$ Phát sự kiện `@EventPattern('pharmacy.stock_updated')`.

---

### 6.8 Billing Microservice (Thu ngân & Tính tiền tự động)
- **Message Patterns**:
  - `billing.create_invoice`:
    - Tính toán: $\text{Tổng tiền} = \text{TienKham} + \sum (\text{SoLuong} \times \text{DonGia})$.
    - Sinh mã hóa đơn: `HD` + `padStart(medical_record_id, 4, '0')`.
    - Trạng thái mặc định: `'Chua thanh toan'`.
  - `billing.process_payment`:
    - Nhận `invoice_id`, `payment_method` (`'Tien mat'` hoặc `'Chuyen khoan'`).
    - Cập nhật `payment_status = 'Da thanh toan'`, `paid_at = NOW()`.
    - **Phát sự kiện**: `@EventPattern('billing.invoice_paid')` kèm toàn bộ thông tin đơn thuốc để các microservice khác xử lý đồng thời (Trừ kho, Thống kê, Gửi hóa đơn).

---

### 6.9 Analytics Microservice (BI & Realtime Dashboard)
- **Nhiệm vụ & Redis Caching**:
  - Lắng nghe các sự kiện: `appointment.created`, `billing.invoice_paid`, `patient.created` $\rightarrow$ Tự động vô hiệu hóa khóa Cache Redis `analytics:dashboard:kpis`.
  - Cung cấp dữ liệu thống kê:
    - KPIs hôm nay: Tổng bệnh nhân, Lịch hẹn hôm nay, Doanh thu hôm nay, Số bác sĩ trực.
    - Biểu đồ xu hướng: Doanh thu theo ngày/tháng, Tăng trưởng bệnh nhân mới, Top 10 loại thuốc sử dụng nhiều nhất.

---

### 6.10 Statistical Microservice (AI/Stats Forecasting & Anomaly Engine)
- **Thuật toán triển khai**:
  1. **Trung bình động 7 ngày (7-Day Moving Average)**:
     $$MA_7(t) = \frac{1}{7}\sum_{i=0}^6 x_{t-i}$$
  2. **Phân tích Khung giờ cao điểm (Peak Hour Binning)**: Gom nhóm theo 24 khung giờ $00:00 \rightarrow 23:00$ để tìm $\max(\text{count})$.
  3. **Hồi quy tuyến tính Dự báo 7 ngày tiếp theo (Linear Regression)**:
     $$y = ax + b, \quad a = \frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}, \quad b = \frac{\sum y - a\sum x}{n}$$
  4. **Phát hiện dữ liệu bất thường (Outlier / Anomaly Detection)**:
     $$|Z\text{-score}| = \left|\frac{x_i - \mu}{\sigma}\right| \ge 2.0 \quad (\text{với } \sigma = \sqrt{\text{Variance}})$$
  - Chạy định kỳ thông qua **BullMQ Worker** vào 00:00 mỗi ngày và lưu kết quả vào bảng `computed_metrics` để phản hồi tức thì cho người dùng.

---

## 7. THIẾT KẾ MÃ NGUỒN BACKEND NESTJS MICROSERVICES MONOREPO

### 7.1 Cấu trúc NestJS Monorepo (`nest-cli.json`)

```
backend-nestjs/
├── nest-cli.json
├── package.json
├── tsconfig.json
├── docker-compose.yml
├── apps/
│   ├── api-gateway/              # Entry point REST API (Port 3000)
│   │   ├── src/
│   │   │   ├── auth/             # AuthController (chuyển tiếp tới auth-service)
│   │   │   ├── appointments/     # AppointmentsController
│   │   │   ├── billing/          # BillingController
│   │   │   ├── medical-records/  # MedicalRecordsController
│   │   │   ├── patients/         # PatientsController
│   │   │   ├── pharmacy/         # PharmacyController
│   │   │   ├── analytics/        # AnalyticsController
│   │   │   ├── statistics/       # StatisticsController
│   │   │   ├── guards/           # JwtAuthGuard, RolesGuard
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   ├── auth-service/             # Microservice Auth (Redis Transport)
│   ├── patient-service/          # Microservice Patient (Redis Transport)
│   ├── appointment-service/      # Microservice Appointment (Redis Transport)
│   ├── medical-record-service/   # Microservice Medical Record (Redis Transport)
│   ├── pharmacy-service/         # Microservice Pharmacy (Redis Transport)
│   ├── billing-service/          # Microservice Billing (Redis Transport)
│   ├── analytics-service/        # Microservice Analytics BI (Redis Transport)
│   └── statistical-service/      # Microservice Statistics (Redis Transport + BullMQ)
└── libs/
    ├── common/                   # Shared DTOs, Interfaces, Constants, Redis Utils
    └── database/                 # TypeORM Database Configuration Module
```

### 7.2 Cấu hình Khởi chạy Microservice với `Transport.REDIS`

```typescript
// apps/appointment-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppointmentServiceModule } from './appointment-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppointmentServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
  );
  await app.listen();
  console.log('🚀 Appointment Microservice is listening via Redis transport...');
}
bootstrap();
```

### 7.3 Đăng ký ClientProxy trong `API Gateway Module`

```typescript
// apps/api-gateway/src/app.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_SERVICES } from '@app/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: REDIS_SERVICES.APPOINTMENT_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
      {
        name: REDIS_SERVICES.BILLING_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
      {
        name: REDIS_SERVICES.PHARMACY_SERVICE,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      },
    ]),
  ],
  controllers: [/* ... các Gateway Controllers */],
})
export class AppModule {}
```

---

## 8. THIẾT KẾ MÃ NGUỒN FRONTEND REACT (TYPESCRIPT)

### 8.1 Cấu trúc thư mục Frontend

```
frontend-react-ts/
├── src/
│   ├── assets/                       # Images, Icons, Static assets
│   ├── components/                   # UI dùng chung
│   │   ├── common/                   # Button, Modal, Card, Badge, Dropdown
│   │   ├── forms/                    # Input, Select, DatePicker, Textarea
│   │   ├── table/                    # DataTable, Pagination, SearchBar
│   │   └── feedback/                 # Toast, LoadingSkeleton, EmptyState
│   ├── context/                      # AuthContext, ThemeContext
│   ├── hooks/                        # useAuth, useDebounce, useMediaQuery
│   ├── layouts/                      # AppLayout, AuthLayout, Header, Sidebar
│   ├── modules/                      # Feature modules
│   │   ├── accounts/                 # Quản lý tài khoản & nhân viên
│   │   ├── appointments/             # Quản lý lịch khám
│   │   ├── billing/                  # Quản lý hóa đơn & Thu ngân
│   │   ├── doctor/                   # Bàn làm việc & Màn hình khám bệnh
│   │   ├── medical-records/          # Bệnh án điện tử
│   │   ├── patients/                 # Quản lý hồ sơ bệnh nhân
│   │   ├── pharmacy/                 # Kho thuốc & Kê đơn
│   │   └── user-portal/              # Cổng bệnh nhân (4 Tabs)
│   ├── pages/                        # DashboardPage, AnalyticsPage, StatisticsPage...
│   ├── routes/                       # AppRoutes.tsx, ProtectedRoute.tsx, RoleGuard.tsx
│   ├── services/                     # Axios Instance, API Endpoints, Token Storage
│   ├── types/                        # TypeScript Interfaces & Enums
│   ├── utils/                        # formatCurrency, formatDate, helpers
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## 9. KỊCH BẢN DDL POSTGRESQL HOÀN CHỈNH

```sql
-- KỊCH BẢN TẠO CƠ SỞ DỮ LIỆU POSTGRESQL 16+
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG TÀI KHOẢN (db_auth)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('Admin', 'BacSi', 'NguoiDung')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Locked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. BẢNG NHÂN VIÊN Y TẾ (db_staff)
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nu', 'Khac')),
    phone VARCHAR(20),
    specialty VARCHAR(100),
    account_id UUID UNIQUE REFERENCES accounts(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG BỆNH NHÂN (db_patient)
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nu', 'Khac')),
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    medical_history TEXT,
    account_id UUID UNIQUE REFERENCES accounts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. BẢNG LỊCH KHÁM (db_appointment)
CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Cho kham' CHECK (status IN ('Cho kham', 'Dang kham', 'Da kham', 'Huy')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date_time ON appointments(doctor_id, appointment_date, appointment_time);

-- 5. BẢNG PHIẾU KHÁM / BỆNH ÁN (db_medical_record)
CREATE TABLE IF NOT EXISTS medical_records (
    id BIGSERIAL PRIMARY KEY,
    appointment_id BIGINT UNIQUE NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    doctor_id BIGINT NOT NULL REFERENCES staff(id),
    examination_date DATE NOT NULL DEFAULT CURRENT_DATE,
    symptoms TEXT,
    diagnosis TEXT,
    conclusion TEXT,
    examination_fee NUMERIC(12,2) NOT NULL DEFAULT 150000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. BẢNG DANH MỤC THUỐC (db_pharmacy)
CREATE TABLE IF NOT EXISTS drugs (
    id BIGSERIAL PRIMARY KEY,
    drug_name VARCHAR(150) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. BẢNG ĐƠN THUỐC (db_pharmacy)
CREATE TABLE IF NOT EXISTS prescriptions (
    id BIGSERIAL PRIMARY KEY,
    medical_record_id BIGINT UNIQUE NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    doctor_id BIGINT NOT NULL REFERENCES staff(id),
    prescription_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'Created' CHECK (status IN ('Created', 'Dispensed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG CHI TIẾT ĐƠN THUỐC (db_pharmacy)
CREATE TABLE IF NOT EXISTS prescription_items (
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    drug_id BIGINT NOT NULL REFERENCES drugs(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    dosage VARCHAR(255) NOT NULL,
    unit_price_at_prescription NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_prescription_drug UNIQUE (prescription_id, drug_id)
);

-- 9. BẢNG HÓA ĐƠN (db_billing)
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    medical_record_id BIGINT UNIQUE NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
    patient_id BIGINT NOT NULL REFERENCES patients(id),
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    examination_fee NUMERIC(12,2) NOT NULL DEFAULT 150000.00,
    drug_fee NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) DEFAULT 'Tien mat' CHECK (payment_method IN ('Tien mat', 'Chuyen khoan', 'The', 'VNPAY')),
    payment_status VARCHAR(50) DEFAULT 'Chua thanh toan' CHECK (payment_status IN ('Chua thanh toan', 'Da thanh toan', 'Huy')),
    paid_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. BẢNG LƯU TRỮ CHỈ SỐ THỐNG KÊ & DỰ BÁO (db_analytics)
CREATE TABLE IF NOT EXISTS computed_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_type VARCHAR(50) NOT NULL, -- 'averages', 'trends', 'forecast', 'anomalies', 'distributions'
    metric_payload JSONB NOT NULL,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. LỘ TRÌNH THỰC THI & DOCKER COMPOSE ORCHESTRATION

### 10.1 Cấu hình `docker-compose.yml` Đích

```yaml
version: '3.8'

services:
  # Redis Message Broker & Cache
  redis:
    image: redis:7-alpine
    container_name: clinic_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # PostgreSQL Database Server
  postgres:
    image: postgres:16-alpine
    container_name: clinic_postgres
    environment:
      POSTGRES_USER: clinic_admin
      POSTGRES_PASSWORD: clinic_secure_password
      POSTGRES_DB: clinic_master
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # NestJS API Gateway
  api-gateway:
    build:
      context: ./backend-nestjs
      dockerfile: apps/api-gateway/Dockerfile
    container_name: clinic_gateway
    ports:
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - JWT_SECRET=clinic_jwt_super_secret_key
    depends_on:
      - redis
      - postgres

  # Microservices
  auth-service:
    build:
      context: ./backend-nestjs
      dockerfile: apps/auth-service/Dockerfile
    environment:
      - REDIS_HOST=redis
      - DB_HOST=postgres
    depends_on: [redis, postgres]

  appointment-service:
    build:
      context: ./backend-nestjs
      dockerfile: apps/appointment-service/Dockerfile
    environment:
      - REDIS_HOST=redis
      - DB_HOST=postgres
    depends_on: [redis, postgres]

  pharmacy-service:
    build:
      context: ./backend-nestjs
      dockerfile: apps/pharmacy-service/Dockerfile
    environment:
      - REDIS_HOST=redis
      - DB_HOST=postgres
    depends_on: [redis, postgres]

  billing-service:
    build:
      context: ./backend-nestjs
      dockerfile: apps/billing-service/Dockerfile
    environment:
      - REDIS_HOST=redis
      - DB_HOST=postgres
    depends_on: [redis, postgres]

  # Frontend Web Client
  web-client:
    build:
      context: ./frontend-react-ts
      dockerfile: Dockerfile
    container_name: clinic_web_client
    ports:
      - "80:80"
    depends_on:
      - api-gateway

volumes:
  redis_data:
  postgres_data:
```

### 10.2 Các bước triển khai (Step-by-Step)
1. **Khởi tạo NestJS Monorepo**: `nest new backend-nestjs` $\rightarrow$ `nest g app api-gateway`, `nest g app appointment-service`, `nest g app pharmacy-service`...
2. **Cài đặt thư viện**: `@nestjs/microservices`, `ioredis`, `redis`, `typeorm`, `pg`, `class-validator`, `class-transformer`, `bullmq`.
3. **Thiết lập Redis Transport**: Cấu hình `Transport.REDIS` trên tất cả các microservices và liên kết qua `ClientProxy` tại Gateway.
4. **Viết logic nghiệp vụ & Event Pub/Sub**: Chuyển đổi toàn bộ thuật toán chống trùng lịch, khóa phân tán trừ tồn kho, tính toán thống kê và hồi quy dự báo.
5. **Nâng cấp Frontend React TypeScript**: Tích hợp TanStack Query v5 và liên kết chuẩn API Gateway.
