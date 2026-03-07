import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy danh sách tâm lý giao tiếp của bệnh nhân
export const getTamLyGiaoTiepByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const { limit = 30 } = req.query;

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    // Đảm bảo là số nguyên dương
    limitValue = Math.max(1, Math.floor(limitValue));

    // Nhúng trực tiếp limitValue vào query sau khi đã validate để tránh lỗi với prepared statements
    const [tamLyGiaoTiep] = await pool.execute(
      `SELECT * FROM tam_ly_giao_tiep 
       WHERE id_benh_nhan = ?
       ORDER BY thoi_gian DESC, ngay_tao DESC
       LIMIT ${limitValue}`,
      [id_benh_nhan]
    );

    res.json({
      success: true,
      data: tamLyGiaoTiep
    });
  } catch (error) {
    next(error);
  }
};

// Tạo tâm lý giao tiếp mới
export const createTamLyGiaoTiep = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const {
      trang_thai_tinh_than,
      nhan_thuc_nguoi_than,
      nhan_thuc_dieu_duong,
      biet_thoi_gian,
      muc_do_tuong_tac,
      ghi_chu,
      thoi_gian
    } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_benh_nhan'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO tam_ly_giao_tiep 
       (id_benh_nhan, trang_thai_tinh_than, nhan_thuc_nguoi_than, 
        nhan_thuc_dieu_duong, biet_thoi_gian, muc_do_tuong_tac, ghi_chu, thoi_gian, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        trang_thai_tinh_than || null,
        nhan_thuc_nguoi_than !== undefined ? nhan_thuc_nguoi_than : null,
        nhan_thuc_dieu_duong !== undefined ? nhan_thuc_dieu_duong : null,
        biet_thoi_gian !== undefined ? biet_thoi_gian : null,
        muc_do_tuong_tac || null,
        ghi_chu || null,
        thoi_gian || ngayTaoVN,
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm tâm lý giao tiếp thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật tâm lý giao tiếp
export const updateTamLyGiaoTiep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      trang_thai_tinh_than,
      nhan_thuc_nguoi_than,
      nhan_thuc_dieu_duong,
      biet_thoi_gian,
      muc_do_tuong_tac,
      ghi_chu,
      thoi_gian
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM tam_ly_giao_tiep WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tâm lý giao tiếp'
      });
    }

    const ngayCapNhatVN = getNowForDB();
    await pool.execute(
      `UPDATE tam_ly_giao_tiep 
       SET trang_thai_tinh_than = ?, nhan_thuc_nguoi_than = ?, 
           nhan_thuc_dieu_duong = ?, biet_thoi_gian = ?, 
           muc_do_tuong_tac = ?, ghi_chu = ?, thoi_gian = ?, ngay_cap_nhat = ?
       WHERE id = ?`,
      [
        trang_thai_tinh_than || null,
        nhan_thuc_nguoi_than !== undefined ? nhan_thuc_nguoi_than : null,
        nhan_thuc_dieu_duong !== undefined ? nhan_thuc_dieu_duong : null,
        biet_thoi_gian !== undefined ? biet_thoi_gian : null,
        muc_do_tuong_tac || null,
        ghi_chu || null,
        thoi_gian || null,
        ngayCapNhatVN,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Cập nhật tâm lý giao tiếp thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tâm lý giao tiếp
export const deleteTamLyGiaoTiep = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM tam_ly_giao_tiep WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa tâm lý giao tiếp thành công'
    });
  } catch (error) {
    next(error);
  }
};

