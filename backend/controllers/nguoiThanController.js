import pool from '../config/database.js';
import { passwordEncrypt } from '../utils/cryptoHelper.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Encryption key - có thể lấy từ env hoặc dùng key cố định
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'encryptionkey';

export const getAllNguoiThan = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_tai_khoan } = req.query;

    let query = `
      SELECT ntb.*, 
             GROUP_CONCAT(DISTINCT ntb2.id_benh_nhan) as danh_sach_benh_nhan,
             COUNT(DISTINCT ntb2.id_benh_nhan) as so_luong_benh_nhan
      FROM nguoi_than_benh_nhan ntb
      LEFT JOIN nguoi_than_benh_nhan ntb2 ON ntb.id_tai_khoan = ntb2.id_tai_khoan AND ntb2.id_tai_khoan IS NOT NULL
      WHERE 1=1
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND ntb.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_tai_khoan) {
      query += ' AND ntb.id_tai_khoan = ?';
      params.push(id_tai_khoan);
    }

    query += ' GROUP BY ntb.id ORDER BY ntb.la_nguoi_lien_he_chinh DESC, ntb.ngay_tao DESC';

    const [nguoiThans] = await pool.execute(query, params);

    res.json({
      success: true,
      data: nguoiThans
    });
  } catch (error) {
    next(error);
  }
};

export const getNguoiThanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [nguoiThans] = await pool.execute(
      'SELECT * FROM nguoi_than_benh_nhan WHERE id = ?',
      [id]
    );

    if (nguoiThans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thân'
      });
    }

    res.json({
      success: true,
      data: nguoiThans[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createNguoiThan = async (req, res, next) => {
  try {
    const {
      id_benh_nhan, ho_ten, moi_quan_he, so_dien_thoai, email,
      la_nguoi_lien_he_chinh, avatar
    } = req.body;

    if (!id_benh_nhan || !ho_ten || !so_dien_thoai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Sanitize values - convert undefined to null for optional fields
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // Tự động tạo tài khoản cho người nhà
    // Kiểm tra xem số điện thoại hoặc email đã tồn tại chưa
    let checkQuery = 'SELECT id FROM tai_khoan WHERE so_dien_thoai = ?';
    let checkParams = [so_dien_thoai];
    
    if (email) {
      checkQuery += ' OR email = ?';
      checkParams.push(email);
    }
    
    const [existingAccount] = await pool.execute(checkQuery, checkParams);

    let taiKhoanId = null;
    if (existingAccount.length === 0) {
      // Tạo tài khoản mới với mật khẩu mặc định 123456
      const defaultPassword = '123456';
      // Sử dụng cryptoHelper thay vì hashPassword
      const encryptedPassword = passwordEncrypt(defaultPassword, ENCRYPTION_KEY);
      
      const ngayTaoVN = getNowForDB();
      const [accountResult] = await pool.execute(
        `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, ngay_tao)
         VALUES (?, ?, ?, ?, 'nguoi_nha', 'inactive', ?)`,
        [ho_ten, so_dien_thoai, sanitizeValue(email), encryptedPassword, ngayTaoVN]
      );
      taiKhoanId = accountResult.insertId;
    } else {
      taiKhoanId = existingAccount[0].id;
    }

    // If this is set as main contact, unset others for this patient
    if (la_nguoi_lien_he_chinh) {
      await pool.execute(
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ?',
        [id_benh_nhan]
      );
    }

    // Tạo quan hệ người nhà - bệnh nhân
    // Cho phép 1 người nhà có thể thêm nhiều bệnh nhân
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO nguoi_than_benh_nhan 
       (id_benh_nhan, id_tai_khoan, ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh, avatar, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        taiKhoanId,
        ho_ten, 
        sanitizeValue(moi_quan_he), 
        so_dien_thoai, 
        sanitizeValue(email), 
        la_nguoi_lien_he_chinh || 0, 
        sanitizeValue(avatar),
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm người thân thành công',
      data: { id: result.insertId, tai_khoan_id: taiKhoanId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateNguoiThan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh, avatar
    } = req.body;

    // Get current patient ID
    const [current] = await pool.execute(
      'SELECT id_benh_nhan FROM nguoi_than_benh_nhan WHERE id = ?',
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thân'
      });
    }

    // If this is set as main contact, unset others
    if (la_nguoi_lien_he_chinh) {
      await pool.execute(
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ? AND id != ?',
        [current[0].id_benh_nhan, id]
      );
    }

    const updateFields = [];
    const updateValues = [];

    if (ho_ten !== undefined) {
      updateFields.push('ho_ten = ?');
      updateValues.push(ho_ten);
    }
    // Sanitize function - convert undefined/empty to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    if (moi_quan_he !== undefined) {
      updateFields.push('moi_quan_he = ?');
      updateValues.push(sanitizeValue(moi_quan_he));
    }
    if (so_dien_thoai !== undefined) {
      updateFields.push('so_dien_thoai = ?');
      updateValues.push(sanitizeValue(so_dien_thoai));
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(sanitizeValue(email));
    }
    if (la_nguoi_lien_he_chinh !== undefined) {
      updateFields.push('la_nguoi_lien_he_chinh = ?');
      updateValues.push(la_nguoi_lien_he_chinh ? 1 : 0);
    }
    if (avatar !== undefined) {
      updateFields.push('avatar = ?');
      updateValues.push(sanitizeValue(avatar));
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
      `UPDATE nguoi_than_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật người thân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNguoiThan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM nguoi_than_benh_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa người thân thành công'
    });
  } catch (error) {
    next(error);
  }
};

