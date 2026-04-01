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
      LEFT JOIN nguoi_than_benh_nhan ntb2 ON ntb.id_tai_khoan = ntb2.id_tai_khoan AND ntb2.id_tai_khoan IS NOT NULL AND ntb2.is_delete = 0
      WHERE ntb.is_delete = 0
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
      'SELECT * FROM nguoi_than_benh_nhan WHERE id = ? AND is_delete = 0',
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
      id_benh_nhan, id_tai_khoan, ho_ten, moi_quan_he, so_dien_thoai, email,
      la_nguoi_lien_he_chinh, avatar
    } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_benh_nhan'
      });
    }

    // Sanitize values - convert undefined to null for optional fields
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };
    const normalizePhone = (value) => String(value || '').replace(/\D/g, '');
    const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

    let normalizedHoTen = String(ho_ten || '').trim();
    let normalizedSoDienThoai = String(so_dien_thoai || '').trim();
    let normalizedEmail = email ? String(email).trim().toLowerCase() : null;
    let normalizedSoDienThoaiDigits = normalizePhone(normalizedSoDienThoai);

    let taiKhoanId = null;
    let taiKhoanDuocTaoMoi = false;

    // Nếu đã chọn tài khoản người thân có sẵn thì liên kết trực tiếp, không tạo mới
    if (id_tai_khoan !== undefined && id_tai_khoan !== null && id_tai_khoan !== '') {
      const [selectedAccounts] = await pool.execute(
        'SELECT id, ho_ten, so_dien_thoai, email FROM tai_khoan WHERE id = ? AND da_xoa = 0',
        [id_tai_khoan]
      );

      if (selectedAccounts.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Tài khoản người thân không tồn tại hoặc đã bị xóa'
        });
      }

      const selectedAccount = selectedAccounts[0];
      taiKhoanId = selectedAccount.id;
      normalizedHoTen = normalizedHoTen || String(selectedAccount.ho_ten || '').trim();
      normalizedSoDienThoai = normalizedSoDienThoai || String(selectedAccount.so_dien_thoai || '').trim();
      normalizedEmail = normalizedEmail || (selectedAccount.email ? String(selectedAccount.email).trim().toLowerCase() : null);
      normalizedSoDienThoaiDigits = normalizePhone(normalizedSoDienThoai);
    } else {
      // Tìm tài khoản trùng theo từng trường để tránh case:
      // SĐT thuộc tài khoản A, email thuộc tài khoản B nhưng vẫn bị coi là hợp lệ.
      const [accountCandidates] = await pool.execute(
        `SELECT id, vai_tro, da_xoa, so_dien_thoai, email
         FROM tai_khoan
         WHERE so_dien_thoai IS NOT NULL OR email IS NOT NULL`
      );

      const accountByPhone = accountCandidates.find(
        (row) =>
          normalizePhone(row.so_dien_thoai) !== '' &&
          normalizePhone(row.so_dien_thoai) === normalizedSoDienThoaiDigits
      ) || null;

      const accountByEmail = normalizedEmail
        ? (
            accountCandidates.find(
              (row) => row.email && normalizeEmail(row.email) === normalizedEmail
            ) || null
          )
        : null;

      // Nếu SĐT và email map sang 2 tài khoản khác nhau => dữ liệu xung đột, không cho tạo
      if (accountByPhone && accountByEmail && accountByPhone.id !== accountByEmail.id) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại và email đang thuộc về hai tài khoản khác nhau'
        });
      }

      const matchedAccount = accountByPhone || accountByEmail;

      // Rule mới theo yêu cầu: email/SĐT đã được sử dụng thì chặn luôn
      if (matchedAccount) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại hoặc email đã được sử dụng'
        });
      }

      // Tạo tài khoản mới với mật khẩu mặc định 123456
      const defaultPassword = '123456';
      // Sử dụng cryptoHelper thay vì hashPassword
      const encryptedPassword = passwordEncrypt(defaultPassword, ENCRYPTION_KEY);
      
      const ngayTaoTaiKhoanVN = getNowForDB();
      const [accountResult] = await pool.execute(
        `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, ngay_tao)
         VALUES (?, ?, ?, ?, 'nguoi_nha', 'inactive', ?)`,
        [normalizedHoTen, normalizedSoDienThoai, sanitizeValue(normalizedEmail), encryptedPassword, ngayTaoTaiKhoanVN]
      );
      taiKhoanId = accountResult.insertId;
      taiKhoanDuocTaoMoi = true;
    }

    if (!normalizedHoTen || !normalizedSoDienThoai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // If this is set as main contact, unset others for this patient
    if (la_nguoi_lien_he_chinh) {
      await pool.execute(
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ?',
        [id_benh_nhan]
      );
    }

    // Chặn tạo trùng người thân đang còn hiệu lực trong cùng bệnh nhân
    const [activeNguoiThanByPatient] = await pool.execute(
      `SELECT id, id_tai_khoan, so_dien_thoai, email
       FROM nguoi_than_benh_nhan
       WHERE id_benh_nhan = ? AND is_delete = 0`,
      [id_benh_nhan]
    );

    const hasDuplicateNguoiThan = activeNguoiThanByPatient.some((row) => {
      const sameAccount = row.id_tai_khoan && taiKhoanId && Number(row.id_tai_khoan) === Number(taiKhoanId);
      const samePhone =
        normalizePhone(row.so_dien_thoai) !== '' &&
        normalizePhone(row.so_dien_thoai) === normalizedSoDienThoaiDigits;
      const sameEmail =
        normalizedEmail &&
        row.email &&
        normalizeEmail(row.email) === normalizedEmail;
      return sameAccount || samePhone || sameEmail;
    });

    if (hasDuplicateNguoiThan) {
      return res.status(400).json({
        success: false,
        message: 'Người thân với số điện thoại hoặc email này đã tồn tại trong danh sách của bệnh nhân'
      });
    }

    // Tạo quan hệ người nhà - bệnh nhân
    // Cho phép 1 người nhà có thể thêm nhiều bệnh nhân
    const ngayTaoQuanHeVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO nguoi_than_benh_nhan 
       (id_benh_nhan, id_tai_khoan, ho_ten, moi_quan_he, so_dien_thoai, email, la_nguoi_lien_he_chinh, avatar, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        taiKhoanId,
        normalizedHoTen, 
        sanitizeValue(moi_quan_he), 
        normalizedSoDienThoai, 
        sanitizeValue(normalizedEmail), 
        la_nguoi_lien_he_chinh || 0, 
        sanitizeValue(avatar),
        ngayTaoQuanHeVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm người thân thành công',
      data: {
        id: result.insertId,
        tai_khoan_id: taiKhoanId,
        tai_khoan_duoc_tao_moi: taiKhoanDuocTaoMoi
      }
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
      'SELECT id_benh_nhan FROM nguoi_than_benh_nhan WHERE id = ? AND is_delete = 0',
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
        'UPDATE nguoi_than_benh_nhan SET la_nguoi_lien_he_chinh = 0 WHERE id_benh_nhan = ? AND id != ? AND is_delete = 0',
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
      `UPDATE nguoi_than_benh_nhan SET ${updateFields.join(', ')} WHERE id = ? AND is_delete = 0`,
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
    const ngayCapNhatVN = getNowForDB();

    const [result] = await pool.execute(
      'UPDATE nguoi_than_benh_nhan SET is_delete = 1, la_nguoi_lien_he_chinh = 0, ngay_cap_nhat = ? WHERE id = ? AND is_delete = 0',
      [ngayCapNhatVN, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người thân'
      });
    }

    res.json({
      success: true,
      message: 'Xóa người thân thành công'
    });
  } catch (error) {
    next(error);
  }
};

