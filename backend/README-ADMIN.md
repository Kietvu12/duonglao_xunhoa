# Tạo Tài Khoản Admin

Có nhiều cách để tạo tài khoản admin cho hệ thống:

## Cách 1: Sử dụng Script Node.js (Khuyến nghị)

Chạy script tự động:

```bash
pnpm run create-admin
```

Hoặc:

```bash
node scripts/create-admin.js
```

Script sẽ tạo tài khoản với thông tin:
- **Số điện thoại**: 0123456789
- **Email**: admin@vienduonglao.com
- **Mật khẩu**: Admin@123
- **Vai trò**: super_admin

## Cách 2: Sử dụng cURL

### Windows (PowerShell hoặc CMD):
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"ho_ten\": \"Super Admin\", \"so_dien_thoai\": \"0123456789\", \"email\": \"admin@vienduonglao.com\", \"mat_khau\": \"Admin@123\", \"vai_tro\": \"super_admin\"}"
```

### Linux/Mac:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "ho_ten": "Super Admin",
    "so_dien_thoai": "0123456789",
    "email": "admin@vienduonglao.com",
    "mat_khau": "Admin@123",
    "vai_tro": "super_admin"
  }'
```

Hoặc sử dụng script có sẵn:
```bash
# Linux/Mac
bash scripts/create-admin.sh

# Windows
scripts\create-admin.bat
```

## Cách 3: Sử dụng Postman hoặc API Client

**Endpoint**: `POST http://localhost:3000/api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "ho_ten": "Super Admin",
  "so_dien_thoai": "0123456789",
  "email": "admin@vienduonglao.com",
  "mat_khau": "Admin@123",
  "vai_tro": "super_admin"
}
```

## Cách 4: Sử dụng MySQL trực tiếp

Nếu muốn tạo trực tiếp trong database:

```sql
-- Tạo tài khoản admin (mật khẩu đã hash: Admin@123)
-- Lưu ý: Cần hash mật khẩu trước khi insert
INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai)
VALUES (
  'Super Admin',
  '0123456789',
  'admin@vienduonglao.com',
  '$2a$10$YourHashedPasswordHere', -- Cần hash mật khẩu trước
  'super_admin',
  'active'
);
```

## Các vai trò có sẵn

- `super_admin` - Super Admin (Toàn quyền)
- `quan_ly_y_te` - Quản lý Y tế
- `quan_ly_nhan_su` - Quản lý Nhân sự
- `dieu_duong_truong` - Điều dưỡng trưởng
- `dieu_duong` - Điều dưỡng
- `marketing` - Marketing
- `nguoi_nha` - Người nhà (mặc định)

## Lưu ý

1. **Đảm bảo server đang chạy** trước khi tạo tài khoản
2. **Thay đổi mật khẩu** sau lần đăng nhập đầu tiên
3. **Bảo mật thông tin** tài khoản admin
4. Script sẽ kiểm tra xem tài khoản đã tồn tại chưa để tránh trùng lặp

## Đăng nhập

Sau khi tạo tài khoản, bạn có thể đăng nhập tại:
- Frontend: `http://localhost:5173/admin/login`
- API: `POST http://localhost:3000/api/auth/login`

**Request body**:
```json
{
  "so_dien_thoai": "0123456789",
  "mat_khau": "Admin@123"
}
```

Hoặc:
```json
{
  "email": "admin@vienduonglao.com",
  "mat_khau": "Admin@123"
}
```

