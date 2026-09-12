# Analytics và Statistics

Tài liệu này mô tả phần tổng hợp số liệu của hệ thống.
Trong dự án hiện tại, React gọi hai nhóm endpoint:

- `/api/analytics/*`
- `/api/statistics/*`

## 1. Mục tiêu

Phần analytics/statistics phục vụ các nhu cầu:

- xem dashboard tổng quan;
- theo dõi KPI;
- thống kê doanh thu và lượt khám;
- dự báo xu hướng;
- phát hiện bất thường;
- hỗ trợ báo cáo cho quản lý.

## 2. Cách frontend sử dụng

Frontend có 2 trang chính:

- `AnalyticsPage`
- `StatisticsPage`

### AnalyticsPage

Trang này đọc dữ liệu từ:

- `GET /api/analytics/dashboard`

Dữ liệu thường dùng để hiển thị:

- tổng bệnh nhân;
- số lịch khám hôm nay;
- doanh thu hôm nay;
- doanh thu tháng;
- số bác sĩ đang hoạt động.

### StatisticsPage

Trang này gọi song song các endpoint:

- `GET /api/statistics/averages`
- `GET /api/statistics/distributions`
- `GET /api/statistics/forecast`

Dữ liệu hiển thị thường gồm:

- giá trị trung bình;
- phân phối giờ cao điểm;
- dữ liệu dự báo;
- điểm bất thường;
- chuỗi thời gian.

## 3. Quy ước endpoint

### Analytics

- `/analytics/dashboard`
- `/analytics/kpis`
- `/analytics/revenue`
- `/analytics/patients`
- `/analytics/appointments`
- `/analytics/pharmacy`
- `/analytics/doctors`
- `/analytics/trends`

### Statistics

- `/statistics/averages`
- `/statistics/distributions`
- `/statistics/trends`
- `/statistics/forecast`
- `/statistics/anomalies`
- `/statistics/timeseries`

## 4. Quy ước phản hồi

Các endpoint phân tích nên trả dữ liệu theo cấu trúc dễ dựng biểu đồ.
Ví dụ:

```json
{
  "summary": {
    "total_patients": 120,
    "appointments_today": 14,
    "revenue_today": 4500000,
    "monthly_revenue": 98000000,
    "active_doctors": 8
  },
  "charts": {
    "line": {
      "labels": ["2026-05-01", "2026-05-02"],
      "datasets": [{ "label": "Appointment trend", "data": [12, 18] }]
    }
  }
}
```

## 5. Phân quyền

Các màn hình analytics/statistics chỉ nên mở cho nhóm có quyền quản trị hoặc quản lý.
Frontend có thể ẩn menu theo role, nhưng backend vẫn phải chặn ở endpoint.

## 6. Cache và hiệu năng

Các thống kê tổng hợp thường tốn tài nguyên hơn màn hình CRUD thông thường.
Nên ưu tiên:

- cache ngắn hạn cho dashboard;
- tái tính toán theo lịch;
- chỉ cập nhật lại khi có thay đổi nghiệp vụ quan trọng.

## 7. Ghi chú triển khai

Nếu triển khai thành service tách riêng, cần giữ nguyên hợp đồng API để frontend không phải sửa nhiều.
