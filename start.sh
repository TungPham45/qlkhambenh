#!/bin/bash
set -e

echo "=============================================================================="
echo "       🏥 HỆ THỐNG QUẢN LÝ PHÒNG KHÁM ĐA KHOA (CLINIC MANAGEMENT)"
echo "       Kiến trúc: React + NestJS Microservices + PostgreSQL + Redis"
echo "=============================================================================="
echo ""

# 1. Kiểm tra .env
if [ ! -f .env ]; then
    echo "[1/4] Khởi tạo file .env từ .env.example..."
    cp .env.example .env
    echo "      -> Đã tạo .env thành công!"
else
    echo "[1/4] File .env đã tồn tại."
fi

# 2. Kiểm tra Docker
echo "[2/4] Kiểm tra trạng thái Docker..."
if ! docker info > /dev/null 2>&1; then
    echo ""
    echo "[ERROR] Docker chưa chạy! Vui lòng khởi động Docker service trước."
    echo ""
    exit 1
fi
echo "      -> Docker đang chạy tốt."

# 3. Khởi động các container
echo ""
echo "[3/4] Đang khởi động toàn bộ 13 containers qua Docker Compose..."
docker-compose up -d --build

# 4. Thông báo hoàn tất
echo ""
echo "[4/4] Khởi động thành công!"
echo ""
echo "=============================================================================="
echo " 🌐 TRUY CẬP HỆ THỐNG:"
echo " - Frontend Web App:     http://localhost:3000"
echo " - API Gateway (Docs):    http://localhost:3001/api/docs"
echo " - PostgreSQL:           localhost:5432 (User: clinic_admin, Pass: clinic_secure_password)"
echo " - Redis:                localhost:6379"
echo ""
echo " 🔐 TÀI KHOẢN MẪU: admin / doctor1 / pharmacist1 (Pass: 123456)"
echo "=============================================================================="
