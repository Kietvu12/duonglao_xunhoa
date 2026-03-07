import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllDichVu = async (req, res, next) => {
  try {
    const { page = 1, limit = 1000, search } = req.query; // Đổi mặc định từ 10 thành 1000
    
    // Debug log
    console.log('[getAllDichVu] Received params:', { page, limit, search });
    console.log('[getAllDichVu] limit type:', typeof limit, 'value:', limit);
    
    // Nếu limit = -1 hoặc 'all', lấy tất cả
    const shouldGetAll = limit === '-1' || limit === 'all' || limit === -1;
    console.log('[getAllDichVu] shouldGetAll:', shouldGetAll);
    
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = shouldGetAll ? null : sanitizeLimit(limit, 10);
    const offset = shouldGetAll ? 0 : (safePage - 1) * limitValue;

    let query = `
      SELECT dv.*, 
             bgd.gia_thang, bgd.gia_quy, bgd.gia_nam,
             ldv.ten as ten_loai_dich_vu
      FROM dich_vu dv
      LEFT JOIN bang_gia_dich_vu bgd ON dv.id = bgd.id_dich_vu
      LEFT JOIN loai_dich_vu ldv ON dv.id_loai_dich_vu = ldv.id
      WHERE dv.da_xoa = 0
    `;
    const params = [];

    if (search) {
      query += ' AND dv.ten_dich_vu LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY dv.ngay_tao DESC';
    
    // Chỉ thêm LIMIT nếu không phải lấy tất cả
    if (!shouldGetAll) {
      query += buildLimitOffsetClause(limitValue, offset);
    }

    const [dichVus] = await pool.execute(query, params);

    res.json({
      success: true,
      data: dichVus
    });
  } catch (error) {
    next(error);
  }
};

export const getDichVuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [dichVus] = await pool.execute(
      `SELECT dv.*, bgd.gia_thang, bgd.gia_quy, bgd.gia_nam,
              ldv.ten as ten_loai_dich_vu
       FROM dich_vu dv
       LEFT JOIN bang_gia_dich_vu bgd ON dv.id = bgd.id_dich_vu
       LEFT JOIN loai_dich_vu ldv ON dv.id_loai_dich_vu = ldv.id
       WHERE dv.id = ? AND dv.da_xoa = 0`,
      [id]
    );

    if (dichVus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.json({
      success: true,
      data: dichVus[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createDichVu = async (req, res, next) => {
  try {
    const { id_loai_dich_vu, ten_dich_vu, mo_ta_ngan, mo_ta_day_du, anh_dai_dien, gia_thang, gia_quy, gia_nam } = req.body;

    if (!ten_dich_vu) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên dịch vụ'
      });
    }

    // Helper to sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO dich_vu (id_loai_dich_vu, ten_dich_vu, mo_ta_ngan, mo_ta_day_du, anh_dai_dien, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sanitizeValue(id_loai_dich_vu),
        ten_dich_vu,
        sanitizeValue(mo_ta_ngan),
        sanitizeValue(mo_ta_day_du),
        sanitizeValue(anh_dai_dien),
        ngayTaoVN
      ]
    );

    // Add pricing if provided
    if (gia_thang || gia_quy || gia_nam) {
      await pool.execute(
        `INSERT INTO bang_gia_dich_vu (id_dich_vu, gia_thang, gia_quy, gia_nam)
         VALUES (?, ?, ?, ?)`,
        [
          result.insertId,
          sanitizeValue(gia_thang),
          sanitizeValue(gia_quy),
          sanitizeValue(gia_nam)
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Thêm dịch vụ thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_loai_dich_vu, ten_dich_vu, mo_ta_ngan, mo_ta_day_du, anh_dai_dien, gia_thang, gia_quy, gia_nam } = req.body;

    // Helper to sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const updateFields = [];
    const updateValues = [];

    if (id_loai_dich_vu !== undefined) {
      updateFields.push('id_loai_dich_vu = ?');
      updateValues.push(sanitizeValue(id_loai_dich_vu));
    }
    if (ten_dich_vu !== undefined) {
      updateFields.push('ten_dich_vu = ?');
      updateValues.push(ten_dich_vu);
    }
    if (mo_ta_ngan !== undefined) {
      updateFields.push('mo_ta_ngan = ?');
      updateValues.push(sanitizeValue(mo_ta_ngan));
    }
    if (mo_ta_day_du !== undefined) {
      updateFields.push('mo_ta_day_du = ?');
      updateValues.push(sanitizeValue(mo_ta_day_du));
    }
    if (anh_dai_dien !== undefined) {
      updateFields.push('anh_dai_dien = ?');
      updateValues.push(sanitizeValue(anh_dai_dien));
    }

    if (updateFields.length > 0) {
      const ngayCapNhatVN = getNowForDB();
      updateFields.push('ngay_cap_nhat = ?');
      updateValues.push(ngayCapNhatVN);
      updateValues.push(id);
      await pool.execute(
        `UPDATE dich_vu SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update pricing
    if (gia_thang !== undefined || gia_quy !== undefined || gia_nam !== undefined) {
      const [existingPrice] = await pool.execute(
        'SELECT id FROM bang_gia_dich_vu WHERE id_dich_vu = ?',
        [id]
      );

      if (existingPrice.length > 0) {
        const ngayCapNhatVN = getNowForDB();
        await pool.execute(
          'UPDATE bang_gia_dich_vu SET gia_thang = ?, gia_quy = ?, gia_nam = ?, ngay_cap_nhat = ? WHERE id_dich_vu = ?',
          [
            sanitizeValue(gia_thang),
            sanitizeValue(gia_quy),
            sanitizeValue(gia_nam),
            ngayCapNhatVN,
            id
          ]
        );
      } else {
        const ngayTaoVN = getNowForDB();
        await pool.execute(
          'INSERT INTO bang_gia_dich_vu (id_dich_vu, gia_thang, gia_quy, gia_nam, ngay_tao) VALUES (?, ?, ?, ?, ?)',
          [
            id,
            sanitizeValue(gia_thang),
            sanitizeValue(gia_quy),
            sanitizeValue(gia_nam),
            ngayTaoVN
          ]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE dich_vu SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

