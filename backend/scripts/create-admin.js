import pool from '../config/database.js';
import { hashPassword } from '../utils/bcrypt.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    const adminData = {
      ho_ten: 'Super Admin',
      so_dien_thoai: '0123456789',
      email: 'admin@vienduonglao.com',
      mat_khau: 'Admin@123',
      vai_tro: 'super_admin'
    };

    // Check if admin already exists
    const [existing] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE so_dien_thoai = ? OR email = ?',
      [adminData.so_dien_thoai, adminData.email]
    );

    if (existing.length > 0) {
      console.log('⚠️  Tài khoản admin đã tồn tại!');
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(adminData.mat_khau);

    // Create admin account
    const [result] = await pool.execute(
      `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [adminData.ho_ten, adminData.so_dien_thoai, adminData.email, hashedPassword, adminData.vai_tro]
    );

    console.log('✅ Tạo tài khoản admin thành công!');
    console.log('📋 Thông tin đăng nhập:');
    console.log('   Số điện thoại:', adminData.so_dien_thoai);
    console.log('   Email:', adminData.email);
    console.log('   Mật khẩu:', adminData.mat_khau);
    console.log('   Vai trò:', adminData.vai_tro);
    console.log('   ID:', result.insertId);

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi tạo tài khoản admin:', error.message);
    process.exit(1);
  }
};

createAdmin();

