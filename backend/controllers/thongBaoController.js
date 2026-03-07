import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeOffset, sanitizeLimit } from '../utils/queryHelpers.js';

/**
 * Lấy danh sách thông báo của người dùng
 */
export const getThongBaos = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { index = 0, limit = 20, da_doc, loai, id_benh_nhan } = req.query;
    
    const offset = sanitizeOffset(index);
    const limitValue = sanitizeLimit(limit, 20);

    let query = `
      SELECT 
        tb.*,
        bn.id as benh_nhan_id,
        bn.ho_ten as benh_nhan_ho_ten,
        bn.ngay_sinh as benh_nhan_ngay_sinh,
        bn.gioi_tinh as benh_nhan_gioi_tinh
      FROM thong_bao tb
      LEFT JOIN benh_nhan bn ON tb.id_benh_nhan = bn.id
      WHERE (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL)
    `;
    const params = [userId];

    if (da_doc !== undefined) {
      query += ' AND tb.da_doc = ?';
      params.push(da_doc === 'true' || da_doc === '1' ? 1 : 0);
    }

    if (loai) {
      query += ' AND tb.loai = ?';
      params.push(loai);
    }

    if (id_benh_nhan) {
      query += ' AND tb.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    query += ' ORDER BY tb.ngay_tao DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [thongBaos] = await pool.execute(query, params);

    // Đếm tổng số
    let countQuery = `
      SELECT COUNT(*) as total FROM thong_bao tb
      WHERE (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL)
    `;
    const countParams = [userId];

    if (da_doc !== undefined) {
      countQuery += ' AND tb.da_doc = ?';
      countParams.push(da_doc === 'true' || da_doc === '1' ? 1 : 0);
    }

    if (loai) {
      countQuery += ' AND tb.loai = ?';
      countParams.push(loai);
    }

    if (id_benh_nhan) {
      countQuery += ' AND tb.id_benh_nhan = ?';
      countParams.push(id_benh_nhan);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: thongBaos,
      pagination: {
        index: offset,
        limit: limitValue,
        total,
        totalPages: Math.ceil(total / limitValue)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đếm số thông báo chưa đọc
 */
export const getThongBaoChuaDoc = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const [result] = await pool.execute(
      `SELECT COUNT(*) as total FROM thong_bao tb
       WHERE (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL) 
       AND tb.da_doc = 0`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        so_luong_chua_doc: result[0].total
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đánh dấu thông báo là đã đọc
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await pool.execute(
      `UPDATE thong_bao tb
       SET tb.da_doc = 1 
       WHERE tb.id = ? AND (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL)`,
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Đã đánh dấu là đã đọc'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    await pool.execute(
      `UPDATE thong_bao tb
       SET tb.da_doc = 1 
       WHERE (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL) AND tb.da_doc = 0`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Đã đánh dấu tất cả là đã đọc'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa thông báo
 */
export const deleteThongBao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    await pool.execute(
      `DELETE FROM thong_bao tb
       WHERE tb.id = ? AND (tb.id_nguoi_nhan = ? OR tb.id_nguoi_nhan IS NULL)`,
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Đã xóa thông báo'
    });
  } catch (error) {
    next(error);
  }
};

