# Hướng dẫn Setup Backend

## Bước 1: Cài đặt Dependencies

```bash
cd backend
pnpm install
```

## Bước 2: Tạo file .env

Tạo file `.env` trong thư mục `backend` với nội dung:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quanlyduonglao
DB_PORT=3306

# JWT Configuration (QUAN TRỌNG!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

### Tạo JWT Secret tự động:

```bash
pnpm run generate-secret
```

Sau đó copy giá trị được tạo vào file `.env`:

```env
JWT_SECRET=<giá_trị_vừa_tạo>
```

## Bước 3: Import Database

```bash
mysql -u root -p quanlyduonglao < quanlyduonglao_final.sql
```

Hoặc sử dụng phpMyAdmin/MySQL Workbench để import file SQL.

## Bước 4: Tạo tài khoản Admin

```bash
pnpm run create-admin
```

Hoặc sử dụng API:

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

## Bước 5: Chạy Server

```bash
pnpm start
# hoặc development mode
pnpm dev
```

Server sẽ chạy tại: `http://localhost:3000`

## Kiểm tra

1. Health check: `http://localhost:3000/health`
2. API docs: Xem file `README.md`

## Lỗi thường gặp

### Lỗi: "secretOrPrivateKey must have a value"

**Nguyên nhân**: Thiếu `JWT_SECRET` trong file `.env`

**Giải pháp**:
1. Tạo file `.env` nếu chưa có
2. Thêm `JWT_SECRET` với giá trị bất kỳ (ít nhất 32 ký tự)
3. Hoặc chạy `pnpm run generate-secret` để tạo secret tự động

### Lỗi: "Database connection error"

**Nguyên nhân**: Cấu hình database không đúng

**Giải pháp**:
1. Kiểm tra MySQL đã chạy chưa
2. Kiểm tra thông tin trong `.env` (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
3. Đảm bảo database `quanlyduonglao` đã được tạo

### Lỗi: "Table doesn't exist"

**Nguyên nhân**: Chưa import database schema

**Giải pháp**: Import file `quanlyduonglao_final.sql` vào database

