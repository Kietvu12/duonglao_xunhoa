# Hướng dẫn cấu hình Nginx cho WebSocket

## Vấn đề
WebSocket không hoạt động qua reverse proxy do thiếu các headers và cấu hình cần thiết.

## Giải pháp
Đã tạo 2 file cấu hình đã sửa:
- `vietdemo_fixed.conf` - Cho máy proxy (nhận request từ internet)
- `vietdemo_2_fixed.conf` - Cho máy upstream (chạy ứng dụng)

## Các thay đổi chính

### 1. Máy Proxy (vietdemo_fixed.conf)
- ✅ Thêm location riêng cho `/api_quanlyduonglao/socket.io/` **TRƯỚC** location `/api_quanlyduonglao/`
- ✅ Thêm WebSocket upgrade headers: `Upgrade` và `Connection`
- ✅ Tăng timeout lên 86400 giây (24 giờ) cho WebSocket
- ✅ Tắt buffering cho WebSocket

### 2. Máy Upstream (vietdemo_2_fixed.conf)
- ✅ Cải thiện cấu hình `/api_quanlyduonglao/socket.io/` với đầy đủ headers
- ✅ Tăng timeout cho WebSocket
- ✅ Tắt buffering
- ✅ Thêm CORS headers (nếu cần)

## Cách áp dụng

### Bước 1: Backup cấu hình hiện tại
```bash
# Trên máy proxy
sudo cp /etc/nginx/sites-available/vietdemo.conf /etc/nginx/sites-available/vietdemo.conf.backup

# Trên máy upstream
sudo cp /etc/nginx/sites-available/vietdemo_2.conf /etc/nginx/sites-available/vietdemo_2.conf.backup
```

### Bước 2: Copy file cấu hình mới
```bash
# Trên máy proxy - copy file vietdemo_fixed.conf vào
sudo cp /path/to/vietdemo_fixed.conf /etc/nginx/sites-available/vietdemo.conf

# Trên máy upstream - copy file vietdemo_2_fixed.conf vào
sudo cp /path/to/vietdemo_2_fixed.conf /etc/nginx/sites-available/vietdemo_2.conf
```

### Bước 3: Test cấu hình
```bash
# Test cấu hình nginx (cả 2 máy)
sudo nginx -t
```

### Bước 4: Reload nginx
```bash
# Reload nginx (cả 2 máy)
sudo systemctl reload nginx
# hoặc
sudo nginx -s reload
```

## Kiểm tra WebSocket

Sau khi áp dụng, kiểm tra:
1. Mở browser console
2. Xem có lỗi WebSocket không
3. Kiểm tra network tab - request đến `/api_quanlyduonglao/socket.io/` phải trả về 101 Switching Protocols

## Lưu ý quan trọng

1. **Thứ tự location**: Location `/api_quanlyduonglao/socket.io/` phải đặt **TRƯỚC** location `/api_quanlyduonglao/` để nginx match đúng
2. **Timeout**: WebSocket cần timeout dài (86400 giây) để duy trì kết nối
3. **Headers**: Phải có `Upgrade` và `Connection: upgrade` headers
4. **Buffering**: Phải tắt buffering cho WebSocket

## Troubleshooting

Nếu vẫn lỗi:
1. Kiểm tra nginx error log: `sudo tail -f /var/log/nginx/error.log`
2. Kiểm tra backend có chạy trên port 4545 không
3. Kiểm tra firewall có chặn port không
4. Kiểm tra cả 2 máy đều đã reload nginx

