import pool from '../config/database.js';
import { passwordEncrypt, passwordDecrypt } from '../utils/cryptoHelper.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { getNowForDB, getTodayVN } from '../utils/dateUtils.js';

// Encryption key - có thể lấy từ env hoặc dùng key cố định
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'encryptionkey';

// Lấy danh sách tài khoản (chỉ admin)
export const getAllTaiKhoan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, vai_tro, trang_thai } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT id, ho_ten, so_dien_thoai, email, avatar, vai_tro, trang_thai, 
             ngay_tao, ngay_cap_nhat
      FROM tai_khoan
      WHERE da_xoa = 0
    `;
    const params = [];

    if (search) {
      query += ' AND (ho_ten LIKE ? OR so_dien_thoai LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (vai_tro) {
      query += ' AND vai_tro = ?';
      params.push(vai_tro);
    }

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY ngay_tao DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [taiKhoans] = await pool.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM tai_khoan WHERE da_xoa = 0';
    const countParams = [];
    
    if (search) {
      countQuery += ' AND (ho_ten LIKE ? OR so_dien_thoai LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    if (vai_tro) {
      countQuery += ' AND vai_tro = ?';
      countParams.push(vai_tro);
    }
    if (trang_thai) {
      countQuery += ' AND trang_thai = ?';
      countParams.push(trang_thai);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: taiKhoans,
      pagination: {
        page: safePage,
        limit: limitValue,
        total,
        totalPages: Math.ceil(total / limitValue)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin tài khoản theo ID
export const getTaiKhoanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [taiKhoans] = await pool.execute(
      `SELECT id, ho_ten, so_dien_thoai, email, avatar, vai_tro, trang_thai, 
              ngay_tao, ngay_cap_nhat
       FROM tai_khoan 
       WHERE id = ? AND da_xoa = 0`,
      [id]
    );

    if (taiKhoans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    res.json({
      success: true,
      data: taiKhoans[0]
    });
  } catch (error) {
    next(error);
  }
};

// Tạo tài khoản mới (chỉ admin)
export const createTaiKhoan = async (req, res, next) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai } = req.body;

    if (!ho_ten || !so_dien_thoai || !email || !mat_khau || !vai_tro) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if phone or email already exists với cùng vai trò (chỉ check với tài khoản chưa bị xóa)
    // Cho phép cùng số điện thoại/email nếu vai trò khác nhau
    // Sử dụng UNION thay vì OR để tối ưu hóa truy vấn với index composite
    // Sắp xếp điều kiện WHERE theo thứ tự index: (so_dien_thoai, vai_tro, da_xoa) và (email, vai_tro, da_xoa)
    // Sử dụng LIMIT 1 để dừng ngay khi tìm thấy kết quả đầu tiên
    const [existing] = await pool.execute(
      `(SELECT id FROM tai_khoan 
       WHERE so_dien_thoai = ? AND vai_tro = ? AND da_xoa = 0
       LIMIT 1)
       UNION
       (SELECT id FROM tai_khoan 
       WHERE email = ? AND vai_tro = ? AND da_xoa = 0
       LIMIT 1)`,
      [so_dien_thoai, vai_tro, email, vai_tro]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc email đã được sử dụng cho vai trò này'
      });
    }

    // Kiểm tra và cập nhật số điện thoại/email của tài khoản đã bị xóa (soft delete) 
    // với cùng số điện thoại/email VÀ cùng vai trò để tránh lỗi duplicate từ database constraint
    // Tối ưu hóa truy vấn với UNION để MySQL có thể sử dụng index riêng cho mỗi phần
    // UNION tự động loại bỏ duplicate dựa trên tất cả các cột được SELECT
    const [deletedAccounts] = await pool.execute(
      `(SELECT id, so_dien_thoai, email FROM tai_khoan 
       WHERE so_dien_thoai = ? AND vai_tro = ? AND da_xoa = 1)
       UNION
       (SELECT id, so_dien_thoai, email FROM tai_khoan 
       WHERE email = ? AND vai_tro = ? AND da_xoa = 1)`,
      [so_dien_thoai, vai_tro, email, vai_tro]
    );

    if (deletedAccounts.length > 0) {
      // Cập nhật số điện thoại/email của tài khoản đã bị soft delete thành giá trị unique
      // để giải phóng số điện thoại/email cho tài khoản mới
      // Sử dụng ID tài khoản và timestamp ngắn để tạo giá trị unique ngắn gọn
      for (const deletedAccount of deletedAccounts) {
        let newPhone = deletedAccount.so_dien_thoai;
        let newEmail = deletedAccount.email;
        
        // Tạo giá trị unique ngắn gọn: dùng ID + timestamp 8 chữ số cuối
        const uniqueSuffix = `${deletedAccount.id}_${Date.now().toString().slice(-8)}`;
        
        // Cập nhật số điện thoại nếu trùng
        if (deletedAccount.so_dien_thoai === so_dien_thoai) {
          // Tạo số điện thoại mới ngắn gọn: del_ID_timestamp
          // Giả sử số điện thoại tối đa 20 ký tự
          newPhone = `del${uniqueSuffix}`.substring(0, 20);
        }
        
        // Cập nhật email nếu trùng
        if (deletedAccount.email === email) {
          // Tạo email mới ngắn gọn: del_ID_timestamp@deleted.local
          // Giả sử email tối đa 100 ký tự
          const emailLocal = `del${uniqueSuffix}`.substring(0, 50);
          newEmail = `${emailLocal}@deleted.local`.substring(0, 100);
        }
        
        const ngayCapNhatVN = getNowForDB();
        await pool.execute(
          'UPDATE tai_khoan SET so_dien_thoai = ?, email = ?, ngay_cap_nhat = ? WHERE id = ?',
          [newPhone, newEmail, ngayCapNhatVN, deletedAccount.id]
        );
      }
    }

    // Sử dụng cryptoHelper để mã hóa mật khẩu
    const encryptedPassword = passwordEncrypt(mat_khau, ENCRYPTION_KEY);

    // Insert user
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, ngay_tao) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ho_ten, so_dien_thoai, email, encryptedPassword, vai_tro, trang_thai || 'active', ngayTaoVN]
    );

    const taiKhoanId = result.insertId;

    // Sanitize values - convert empty strings to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // Tự động tạo hồ sơ nhân viên nếu vai trò là nhân viên
    const nhanVienRoles = ['dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su'];
    if (nhanVienRoles.includes(vai_tro)) {
      // Kiểm tra xem đã có hồ sơ nhân viên chưa
      const [existingProfile] = await pool.execute(
        'SELECT id FROM ho_so_nhan_vien WHERE id_tai_khoan = ?',
        [taiKhoanId]
      );

      if (existingProfile.length === 0) {
        // Tạo hồ sơ nhân viên mặc định
        const ngayTaoHoSoVN = getNowForDB();
        const ngayBatDauVN = getTodayVN();
        await pool.execute(
          `INSERT INTO ho_so_nhan_vien (id_tai_khoan, ngay_bat_dau, ngay_tao)
           VALUES (?, ?, ?)`,
          [taiKhoanId, ngayBatDauVN, ngayTaoHoSoVN]
        );
      }
    }

    // Tự động tạo bản ghi người nhà nếu vai trò là người nhà
    if (vai_tro === 'nguoi_nha') {
      // Kiểm tra xem đã có bản ghi người thân chưa (theo id_tai_khoan)
      const [existingNguoiThan] = await pool.execute(
        'SELECT id FROM nguoi_than_benh_nhan WHERE id_tai_khoan = ? LIMIT 1',
        [taiKhoanId]
      );

      if (existingNguoiThan.length === 0) {
        // Tạo bản ghi người thân với id_benh_nhan = NULL (chưa liên kết với bệnh nhân nào)
        await pool.execute(
          `INSERT INTO nguoi_than_benh_nhan 
           (id_benh_nhan, id_tai_khoan, ho_ten, so_dien_thoai, email, la_nguoi_lien_he_chinh)
           VALUES (?, ?, ?, ?, ?, 0)`,
          [null, taiKhoanId, ho_ten, so_dien_thoai, sanitizeValue(email)]
        );
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản thành công',
      data: { id: taiKhoanId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật tài khoản
export const updateTaiKhoan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = [
      'ho_ten', 'so_dien_thoai', 'email', 'avatar', 'vai_tro', 'trang_thai'
    ];

    const updateFields = [];
    const updateValues = [];

    // Lấy vai_tro hiện tại hoặc vai_tro mới (nếu đang update)
    let vaiTroToCheck = updateData.vai_tro;
    if (!vaiTroToCheck) {
      const [currentAccount] = await pool.execute(
        'SELECT vai_tro FROM tai_khoan WHERE id = ?',
        [id]
      );
      if (currentAccount.length > 0) {
        vaiTroToCheck = currentAccount[0].vai_tro;
      }
    }

    // Check if updating phone or email, verify uniqueness với cùng vai trò (chỉ check với tài khoản chưa bị xóa)
    // Cho phép cùng số điện thoại/email nếu vai trò khác nhau
    // Tối ưu hóa: chỉ check những trường đang được update, sử dụng UNION thay vì OR
    if ((updateData.so_dien_thoai || updateData.email) && vaiTroToCheck) {
      let checkQueries = [];
      let checkParams = [];

      // Chỉ check so_dien_thoai nếu đang update
      if (updateData.so_dien_thoai) {
        checkQueries.push(
          `SELECT id FROM tai_khoan 
           WHERE so_dien_thoai = ? AND vai_tro = ? AND id != ? AND da_xoa = 0 
           LIMIT 1`
        );
        checkParams.push(updateData.so_dien_thoai, vaiTroToCheck, id);
      }

      // Chỉ check email nếu đang update
      if (updateData.email) {
        checkQueries.push(
          `SELECT id FROM tai_khoan 
           WHERE email = ? AND vai_tro = ? AND id != ? AND da_xoa = 0 
           LIMIT 1`
        );
        checkParams.push(updateData.email, vaiTroToCheck, id);
      }

      if (checkQueries.length > 0) {
        // Nếu chỉ có 1 query, không cần UNION
        // Nếu có nhiều query, dùng UNION và đặt mỗi SELECT trong ngoặc đơn để tránh lỗi với LIMIT
        let query;
        if (checkQueries.length === 1) {
          query = checkQueries[0];
        } else {
          // Đặt mỗi SELECT trong ngoặc đơn khi dùng UNION với LIMIT
          query = checkQueries.map(q => `(${q})`).join(' UNION ');
        }
        
        const [existing] = await pool.execute(query, checkParams);

        if (existing.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Số điện thoại hoặc email đã được sử dụng cho vai trò này'
          });
        }
      }
    }

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        const value = updateData[field] === undefined ? null : (updateData[field] || null);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    updateValues.push(id);

    await pool.execute(
      `UPDATE tai_khoan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật tài khoản thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Đổi mật khẩu tài khoản (admin có thể đổi mật khẩu cho user khác)
export const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mat_khau_moi } = req.body;

    if (!mat_khau_moi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu mới'
      });
    }

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    // Sử dụng cryptoHelper để mã hóa mật khẩu
    const encryptedPassword = passwordEncrypt(mat_khau_moi, ENCRYPTION_KEY);
    const ngayCapNhatVN = getNowForDB();

    await pool.execute(
      'UPDATE tai_khoan SET mat_khau = ?, ngay_cap_nhat = ? WHERE id = ?',
      [encryptedPassword, ngayCapNhatVN, id]
    );

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xem mật khẩu (giải mã) - chỉ admin
export const viewPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id, mat_khau FROM tai_khoan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tài khoản'
      });
    }

    const encryptedPassword = users[0].mat_khau;
    let decryptedPassword = '';

    try {
      // Kiểm tra xem mật khẩu có phải là base64 (đã mã hóa bằng cryptoHelper) không
      const isBase64 = /^[A-Za-z0-9+/=]+$/.test(encryptedPassword.trim());
      if (isBase64 && encryptedPassword) {
        decryptedPassword = passwordDecrypt(encryptedPassword, ENCRYPTION_KEY);
      } else {
        decryptedPassword = '[Mật khẩu không thể giải mã]';
      }
    } catch (err) {
      console.warn(`⚠️ Giải mã thất bại cho tài khoản ID ${id}: ${err.message}`);
      decryptedPassword = '[Lỗi giải mã]';
    }

    res.json({
      success: true,
      data: {
        password: decryptedPassword
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tài khoản (soft delete)
export const deleteTaiKhoan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản của chính mình'
      });
    }

    await pool.execute(
      'UPDATE tai_khoan SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa tài khoản thành công'
    });
  } catch (error) {
    next(error);
  }
};

