# Analytics & Statistics Testing Guide

## Overview
This document provides testing instructions for the enhanced Analytics and Statistics services in the clinic management system.

## Analytics Service Endpoints

### 1. Dashboard Analytics
**Endpoint:** `GET /analytics/dashboard`
**Description:** Returns comprehensive dashboard with summary, trends, and charts data

**Query Parameters:**
- `filter` (optional): `today`, `week`, `month`
- `from` (optional): Start date (YYYY-MM-DD)
- `to` (optional): End date (YYYY-MM-DD)

**Example Request:**
```bash
curl "http://localhost/analytics/dashboard?filter=month"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_patients": 150,
      "appointments_today": 12,
      "revenue_today": 2500000,
      "monthly_revenue": 75000000,
      "active_doctors": 8
    },
    "widgets": {
      "top_medicines": [
        {"label": "Aspirin", "value": 45},
        {"label": "Amoxicillin", "value": 38}
      ],
      "appointment_trends": [
        {"label": "2024-01-01", "value": 10, "metric": "appointments"}
      ],
      "patient_growth": [
        {"label": "2024-01-01", "value": 2, "metric": "patients"}
      ],
      "revenue_trend": [
        {"label": "2024-01-01", "value": 1500000}
      ]
    },
    "charts": {
      "line": {...},
      "bar": {...},
      "pie": {...}
    },
    "generated_at": "2024-01-01T10:30:00+00:00"
  }
}
```

### 2. Revenue Analytics
**Endpoint:** `GET /analytics/revenue`
**Description:** Detailed revenue breakdown

**Example Request:**
```bash
curl "http://localhost/analytics/revenue"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 75000000,
    "today": 2500000,
    "monthly": [
      {"label": "2024-01", "value": 30000000},
      {"label": "2024-02", "value": 45000000}
    ],
    "trend": [
      {"label": "2024-01-01", "value": 1500000}
    ]
  }
}
```

### 3. Patient Analytics
**Endpoint:** `GET /analytics/patients`
**Description:** Patient metrics and growth trends

**Example Request:**
```bash
curl "http://localhost/analytics/patients"
```

### 4. Appointment Analytics
**Endpoint:** `GET /analytics/appointments`
**Description:** Appointment statistics and trends

**Example Request:**
```bash
curl "http://localhost/analytics/appointments"
```

### 5. Pharmacy Analytics
**Endpoint:** `GET /analytics/pharmacy`
**Description:** Top medicines and prescription analytics

**Example Request:**
```bash
curl "http://localhost/analytics/pharmacy"
```

### 6. Doctor Analytics
**Endpoint:** `GET /analytics/doctors`
**Description:** Active doctors and specialty distribution

**Example Request:**
```bash
curl "http://localhost/analytics/doctors"
```

### 7. Trends Analytics
**Endpoint:** `GET /analytics/trends`
**Description:** Combined trends across all metrics

**Example Request:**
```bash
curl "http://localhost/analytics/trends"
```

### 8. KPIs Analytics
**Endpoint:** `GET /analytics/kpis`
**Description:** Key Performance Indicators summary

**Example Request:**
```bash
curl "http://localhost/analytics/kpis"
```

---

## Statistics Service Endpoints

### 1. Averages Statistics
**Endpoint:** `GET /statistics/averages`
**Description:** Average values for revenue and appointments

**Example Request:**
```bash
curl "http://localhost/statistics/averages"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "revenue_average": 2500000,
    "appointments_average": 8.5,
    "revenue_moving_average": [2400000, 2450000, 2500000],
    "appointments_moving_average": [8.2, 8.4, 8.5]
  }
}
```

### 2. Distributions Statistics
**Endpoint:** `GET /statistics/distributions`
**Description:** Distribution of appointments by hour and status

**Example Request:**
```bash
curl "http://localhost/statistics/distributions"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "appointment_hours": [
      {"label": "08", "value": 12},
      {"label": "09", "value": 15},
      {"label": "10", "value": 18}
    ],
    "peak_hour": "10",
    "status_distribution": [
      {"label": "Confirmed", "value": 25},
      {"label": "Completed", "value": 30},
      {"label": "Cancelled", "value": 5}
    ]
  }
}
```

### 3. Trends Statistics
**Endpoint:** `GET /statistics/trends`
**Description:** Growth rates and monthly trends

**Example Request:**
```bash
curl "http://localhost/statistics/trends"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "monthly_revenue": [
      {"label": "2024-01", "value": 30000000},
      {"label": "2024-02", "value": 32000000}
    ],
    "monthly_appointments": [
      {"label": "2024-01", "value": 250},
      {"label": "2024-02", "value": 270}
    ],
    "revenue_growth_rate": 6.67,
    "appointment_growth_rate": 8.0
  }
}
```

### 4. Forecast Statistics
**Endpoint:** `GET /statistics/forecast`
**Description:** 7-day revenue and appointment forecasts

**Example Request:**
```bash
curl "http://localhost/statistics/forecast"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "revenue_prediction": [
      {"label": "2024-02-01", "value": 2600000},
      {"label": "2024-02-02", "value": 2650000},
      {"label": "2024-02-03", "value": 2700000}
    ],
    "appointment_forecast": [
      {"label": "2024-02-01", "value": 9},
      {"label": "2024-02-02", "value": 9},
      {"label": "2024-02-03", "value": 10}
    ],
    "method": "simple linear regression over daily service API aggregates"
  }
}
```

### 5. Anomalies Statistics
**Endpoint:** `GET /statistics/anomalies`
**Description:** Detect anomalous days using standard deviation

**Example Request:**
```bash
curl "http://localhost/statistics/anomalies"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "baseline": {
      "average": 2500000,
      "standard_deviation": 500000
    },
    "candidates": [
      {"label": "2024-01-15", "value": 4500000},
      {"label": "2024-01-25", "value": 500000}
    ]
  }
}
```

### 6. Time Series Statistics
**Endpoint:** `GET /statistics/timeseries`
**Description:** Complete daily time series data

**Example Request:**
```bash
curl "http://localhost/statistics/timeseries"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "revenue": [
      {"label": "2024-01-01", "value": 1500000},
      {"label": "2024-01-02", "value": 2000000}
    ],
    "appointments": [
      {"label": "2024-01-01", "value": 8},
      {"label": "2024-01-02", "value": 10}
    ],
    "patients": [
      {"label": "2024-01-01", "value": 2},
      {"label": "2024-01-02", "value": 3}
    ]
  }
}
```

---

## Frontend Features

### AnalyticsPage Features
- **KPI Cards**: Display 4 key metrics (total patients, appointments today, revenue today, active doctors)
- **Revenue Trend Chart**: Area chart showing revenue over time
- **Appointment Trend Chart**: Line chart showing appointment trends
- **Top Medicines Chart**: Pie chart of most used medicines
- **Patient Growth Chart**: Bar chart showing patient growth
- **Monthly Revenue Chart**: Bar chart aggregating monthly revenue
- **Date Range Filter**: Quick filters (Today, Week, Month) and custom date range picker

### StatisticsPage Features
- **KPI Cards**: Revenue average, appointments average, peak hour, growth rate
- **Overview Tab**:
  - Revenue timeseries
  - Appointments timeseries
  - Growth rate metrics
- **Forecast Tab**:
  - 7-day revenue forecast
  - 7-day appointment forecast
  - Forecast methodology info
- **Anomalies Tab**:
  - Baseline statistics
  - Anomaly detection results
  - List of anomalous days
- **Distributions Tab**:
  - Appointment distribution by hour
  - Peak hour indicator
  - Status distribution chart

---

## Testing Checklist

### Manual Testing
- [ ] Load Analytics page and verify all charts render
- [ ] Load Statistics page and verify all tabs work
- [ ] Test date range filter on Analytics page
- [ ] Test date range filter on Statistics page
- [ ] Verify KPI cards display correct values
- [ ] Check that forecasts show realistic data
- [ ] Verify anomalies detection works

### API Testing
- [ ] Test `/analytics/dashboard` endpoint
- [ ] Test `/analytics/revenue` endpoint
- [ ] Test `/statistics/averages` endpoint
- [ ] Test `/statistics/forecast` endpoint
- [ ] Test `/statistics/anomalies` endpoint
- [ ] Verify all endpoints return proper JSON format
- [ ] Test with date range parameters

### Performance Testing
- [ ] Measure page load time for Analytics
- [ ] Measure page load time for Statistics
- [ ] Check cache behavior
- [ ] Monitor API response times

---

## Sample Data

To properly test the analytics and statistics features, ensure your database has:
- Multiple patients (at least 50)
- Multiple appointments (at least 100) spread across different dates and hours
- Multiple paid billings with various amounts
- Multiple prescriptions with different medicines
- Multiple staff members with different roles

---

## Troubleshooting

### Issue: Charts not rendering
- Check browser console for errors
- Verify recharts library is properly installed
- Check API response format matches expected structure

### Issue: No data displayed
- Verify database has sample data
- Check API endpoints are returning data
- Check date range parameters are correct

### Issue: Forecast showing unrealistic values
- Check data quality in database
- Verify linear regression calculation in StatisticsComputationService
- Ensure enough historical data exists

---

## Performance Optimization

- Analytics and Statistics pages implement data caching (300 seconds TTL)
- Use date filters to limit data returned
- Consider implementing pagination for large datasets
- Monitor Redis/cache usage for optimal performance

