# API Thông báo cho App Khác

## Tổng quan

API này cho phép app khác (sử dụng chung database) trigger thông báo về hệ thống quản lý admin khi có:
- Chỉ số sức khỏe cảnh báo/nguy hiểm
- Triệu chứng mới

## Base URL

```
https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify
```

## Endpoints

### 1. Thông báo chỉ số sức khỏe cảnh báo

**POST** `/health-indicator`

Gửi thông báo khi có chỉ số sức khỏe ở mức cảnh báo hoặc nguy hiểm.

#### Request Body

```json
{
  "loai_chi_so": "huyet_ap",  // Required: 'huyet_ap', 'nhip_tim', 'duong_huyet', 'spo2', 'nhiet_do'
  "id_benh_nhan": 1,          // Required: ID bệnh nhân
  "gia_tri": {                // Required: Giá trị chỉ số
    "tam_thu": 180,           // Cho huyết áp
    "tam_truong": 120
  },
  // hoặc cho các loại khác:
  // "gia_tri": 95,           // Number cho nhịp tim, đường huyết, SpO2, nhiệt độ
  
  "id_cau_hinh_chi_so_canh_bao": 1,  // Optional: ID cấu hình chỉ số
  "muc_do": "nguy_hiem",      // Optional: 'binh_thuong', 'canh_bao', 'nguy_hiem'
  "noi_dung_canh_bao": "...", // Optional: Nội dung cảnh báo
  "record_id": 123            // Optional: ID record vừa được tạo trong database
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Đã gửi thông báo cảnh báo",
  "data": {
    "muc_do": "nguy_hiem",
    "noi_dung_canh_bao": "Huyết áp nguy hiểm! Cần can thiệp ngay."
  }
}
```

**Chỉ số bình thường (200)**
```json
{
  "success": true,
  "message": "Chỉ số bình thường, không cần gửi thông báo",
  "data": {
    "muc_do": "binh_thuong"
  }
}
```

#### Ví dụ sử dụng

**Huyết áp:**
```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator \
  -H "Content-Type: application/json" \
  -d '{
    "loai_chi_so": "huyet_ap",
    "id_benh_nhan": 1,
    "gia_tri": {
      "tam_thu": 180,
      "tam_truong": 120
    }
  }'
```

**Nhịp tim:**
```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator \
  -H "Content-Type: application/json" \
  -d '{
    "loai_chi_so": "nhip_tim",
    "id_benh_nhan": 1,
    "gia_tri": 120
  }'
```

**Đường huyết:**
```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator \
  -H "Content-Type: application/json" \
  -d '{
    "loai_chi_so": "duong_huyet",
    "id_benh_nhan": 1,
    "gia_tri": 15.5
  }'
```

**SpO2:**
```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator \
  -H "Content-Type: application/json" \
  -d '{
    "loai_chi_so": "spo2",
    "id_benh_nhan": 1,
    "gia_tri": 85
  }'
```

**Nhiệt độ:**
```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator \
  -H "Content-Type: application/json" \
  -d '{
    "loai_chi_so": "nhiet_do",
    "id_benh_nhan": 1,
    "gia_tri": 39.5
  }'
```

---

### 2. Thông báo triệu chứng mới

**POST** `/symptom`

Gửi thông báo khi có triệu chứng mới được tạo.

#### Request Body

```json
{
  "id_benh_nhan": 1,          // Required: ID bệnh nhân
  "id_trieu_chung": 5,       // Required: ID triệu chứng
  "ten_trieu_chung": "...",  // Optional: Tên triệu chứng (nếu không có sẽ query từ DB)
  "ngay_gio_xay_ra": "2024-01-15 14:30:00",  // Optional: Ngày giờ xảy ra
  "record_id": 123            // Optional: ID record vừa được tạo trong database
}
```

#### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Đã gửi thông báo triệu chứng"
}
```

#### Ví dụ sử dụng

```bash
curl -X POST https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/symptom \
  -H "Content-Type: application/json" \
  -d '{
    "id_benh_nhan": 1,
    "id_trieu_chung": 5,
    "ngay_gio_xay_ra": "2024-01-15 14:30:00"
  }'
```

---

## Cách tích hợp vào App khác

### Sau khi INSERT vào database

Sau khi app khác INSERT dữ liệu vào database, gọi API này để trigger thông báo:

```javascript
// Ví dụ: Sau khi insert huyết áp
async function insertHuyetAp(data) {
  // 1. Insert vào database
  const result = await db.execute(
    'INSERT INTO huyet_ap (id_benh_nhan, tam_thu, tam_truong, ...) VALUES (?, ?, ?, ...)',
    [data.id_benh_nhan, data.tam_thu, data.tam_truong, ...]
  );
  
  // 2. Gọi API để trigger notification
  try {
    await fetch('https://duonglaoxuanhoa.net/api_quanlyduonglao/api/external/notify/health-indicator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loai_chi_so: 'huyet_ap',
        id_benh_nhan: data.id_benh_nhan,
        gia_tri: {
          tam_thu: data.tam_thu,
          tam_truong: data.tam_truong
        },
        record_id: result.insertId
      })
    });
  } catch (error) {
    // Log lỗi nhưng không block quá trình insert
    console.error('Error sending notification:', error);
  }
  
  return result;
}
```

### Lưu ý

1. **Không block**: Nếu API notification lỗi, không nên block quá trình insert vào database
2. **Async**: Nên gọi API notification bất đồng bộ (async/await hoặc fire-and-forget)
3. **Error handling**: Luôn có error handling để không ảnh hưởng đến flow chính

---

## Xác thực (Tùy chọn)

Hiện tại API không yêu cầu authentication. Nếu cần bảo mật, có thể:

1. Thêm API key authentication
2. Thêm IP whitelist
3. Thêm JWT token

Liên hệ admin để cấu hình nếu cần.

---

## Lưu ý quan trọng

- API chỉ gửi thông báo nếu mức độ là `canh_bao` hoặc `nguy_hiem`
- Nếu không cung cấp `muc_do`, hệ thống sẽ tự động đánh giá dựa trên cấu hình
- Thông báo sẽ được gửi cho tất cả admin và điều dưỡng đang online
- Thông báo sẽ hiển thị real-time qua WebSocket

