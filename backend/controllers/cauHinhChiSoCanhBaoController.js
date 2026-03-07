import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllCauHinhChiSoCanhBao = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = 'SELECT * FROM cau_hinh_chi_so_canh_bao WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND ten_chi_so LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY ten_chi_so ASC';

    const [cauHinhs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: cauHinhs
    });
  } catch (error) {
    next(error);
  }
};

export const getCauHinhChiSoCanhBaoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [cauHinhs] = await pool.execute(
      'SELECT * FROM cau_hinh_chi_so_canh_bao WHERE id = ?',
      [id]
    );

    if (cauHinhs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cấu hình chỉ số cảnh báo'
      });
    }

    res.json({
      success: true,
      data: cauHinhs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createCauHinhChiSoCanhBao = async (req, res, next) => {
  try {
    const { ten_chi_so, gioi_han_canh_bao } = req.body;

    if (!ten_chi_so) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền tên chỉ số'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO cau_hinh_chi_so_canh_bao (ten_chi_so, gioi_han_canh_bao, ngay_tao) VALUES (?, ?, ?)',
      [ten_chi_so, gioi_han_canh_bao || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm cấu hình chỉ số cảnh báo thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateCauHinhChiSoCanhBao = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_chi_so, gioi_han_canh_bao } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_chi_so !== undefined) {
      updateFields.push('ten_chi_so = ?');
      updateValues.push(ten_chi_so);
    }

    if (gioi_han_canh_bao !== undefined) {
      updateFields.push('gioi_han_canh_bao = ?');
      updateValues.push(gioi_han_canh_bao === '' ? null : gioi_han_canh_bao);
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
      `UPDATE cau_hinh_chi_so_canh_bao SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật cấu hình chỉ số cảnh báo thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCauHinhChiSoCanhBao = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM cau_hinh_chi_so_canh_bao WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa cấu hình chỉ số cảnh báo thành công'
    });
  } catch (error) {
    next(error);
  }
};

