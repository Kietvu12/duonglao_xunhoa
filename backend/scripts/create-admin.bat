@echo off
REM Script tạo tài khoản admin bằng curl (Windows)

set API_URL=http://localhost:3000/api

echo Đang tạo tài khoản admin...

curl -X POST "%API_URL%/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"ho_ten\": \"Super Admin\", \"so_dien_thoai\": \"0123456789\", \"email\": \"admin@vienduonglao.com\", \"mat_khau\": \"Admin@123\", \"vai_tro\": \"super_admin\"}"

echo.
echo Hoan tat!

