# Hướng dẫn chạy dự án

Tài liệu này mô tả cách chạy hệ thống ở chế độ Docker và chế độ phát triển cục bộ.

## 1. Yêu cầu

- Docker Desktop
- Docker Compose
- Node.js 18+ (nếu chạy frontend ở chế độ dev)
- VSCode hoặc trình soạn thảo tương tự

## 2. Chạy toàn bộ hệ thống bằng Docker

Ở thư mục gốc của dự án, chạy:

```bash
docker compose up -d --build
```

Lệnh này khởi động các container backend, database và các dịch vụ phụ trợ theo `docker-compose.yml`.

## 3. Chạy frontend React riêng

Nếu dùng cấu hình frontend mẫu, chạy:

```bash
docker compose -f docker-compose.yml -f frontend/docker-compose.frontend.example.yml up -d --build frontend
```

Sau đó truy cập:

- Frontend React: `http://localhost:3000/`
- Gateway/API: `http://localhost/`

## 4. Chạy frontend ở chế độ dev

Nếu muốn phát triển giao diện nhanh hơn:

```bash
cd frontend
npm install
npm run dev
```

Vite sẽ proxy các request `/api/*` về backend theo cấu hình trong `frontend/vite.config.js`.

## 5. Kiểm tra container

```bash
docker ps
```

Container frontend thường có tên:

- `clinic_frontend`

## 6. Gợi ý khi gặp lỗi

- Nếu không vào được frontend: kiểm tra container `clinic_frontend` và cổng `3000`.
- Nếu login lỗi: kiểm tra gateway và endpoint `/auth/login`, `/auth/me`.
- Nếu dữ liệu không hiện: kiểm tra seed dữ liệu trong database và log của service tương ứng.
