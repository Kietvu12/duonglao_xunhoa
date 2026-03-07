import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy danh sách bệnh hiện tại của bệnh nhân
export const getBenhHienTaiByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;

    const [benhHienTai] = await pool.execute(
      `SELECT bh.*, tb.ten_benh 
       FROM benh_hien_tai bh
       LEFT JOIN thong_tin_benh tb ON bh.id_thong_tin_benh = tb.id
       WHERE bh.id_benh_nhan = ?
       ORDER BY bh.ngay_phat_hien DESC`,
      [id_benh_nhan]
    );

    res.json({
      success: true,
      data: benhHienTai
    });
  } catch (error) {
    next(error);
  }
};

// Tạo bệnh hiện tại mới
export const createBenhHienTai = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const {
      id_thong_tin_benh,
      ngay_phat_hien,
      tinh_trang,
      ghi_chu
    } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_benh_nhan'
      });
    }

    // Validate id_thong_tin_benh nếu có
    let finalIdThongTinBenh = null;
    if (id_thong_tin_benh && id_thong_tin_benh !== '' && !isNaN(id_thong_tin_benh)) {
      const idThongTinBenhNum = parseInt(id_thong_tin_benh);
      // Kiểm tra xem id_thong_tin_benh có tồn tại không
      const [thongTinBenhCheck] = await pool.execute(
        'SELECT id FROM thong_tin_benh WHERE id = ?',
        [idThongTinBenhNum]
      );
      if (thongTinBenhCheck.length > 0) {
        finalIdThongTinBenh = idThongTinBenhNum;
      } else {
        return res.status(400).json({
          success: false,
          message: 'ID thông tin bệnh không tồn tại trong hệ thống'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (id_thong_tin_benh)'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO benh_hien_tai 
       (id_benh_nhan, id_thong_tin_benh, ngay_phat_hien, tinh_trang, ghi_chu, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        finalIdThongTinBenh,
        ngay_phat_hien || null,
        tinh_trang || null,
        ghi_chu || null,
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm bệnh hiện tại thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật bệnh hiện tại
export const updateBenhHienTai = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_thong_tin_benh,
      ngay_phat_hien,
      tinh_trang,
      ghi_chu
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM benh_hien_tai WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh hiện tại'
      });
    }

    // Validate id_thong_tin_benh nếu có
    let finalIdThongTinBenh = null;
    if (id_thong_tin_benh && id_thong_tin_benh !== '' && !isNaN(id_thong_tin_benh)) {
      const idThongTinBenhNum = parseInt(id_thong_tin_benh);
      // Kiểm tra xem id_thong_tin_benh có tồn tại không
      const [thongTinBenhCheck] = await pool.execute(
        'SELECT id FROM thong_tin_benh WHERE id = ?',
        [idThongTinBenhNum]
      );
      if (thongTinBenhCheck.length > 0) {
        finalIdThongTinBenh = idThongTinBenhNum;
      } else {
        return res.status(400).json({
          success: false,
          message: 'ID thông tin bệnh không tồn tại trong hệ thống'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_thong_tin_benh hợp lệ'
      });
    }

    const ngayCapNhatVN = getNowForDB();
    await pool.execute(
      `UPDATE benh_hien_tai 
       SET id_thong_tin_benh = ?, ngay_phat_hien = ?, tinh_trang = ?, ghi_chu = ?, ngay_cap_nhat = ?
       WHERE id = ?`,
      [
        finalIdThongTinBenh,
        ngay_phat_hien || null,
        tinh_trang || null,
        ghi_chu || null,
        ngayCapNhatVN,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Cập nhật bệnh hiện tại thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bệnh hiện tại
export const deleteBenhHienTai = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'DELETE FROM benh_hien_tai WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa bệnh hiện tại thành công'
    });
  } catch (error) {
    next(error);
  }
};

