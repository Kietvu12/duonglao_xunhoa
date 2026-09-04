import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllPhanLoaiThuoc = async (req, res, next) => {
  try {
    const [phanLoais] = await pool.execute(
      'SELECT * FROM phan_loai_thuoc ORDER BY ten_loai ASC'
    );

    res.json({
      success: true,
      data: phanLoais
    });
  } catch (error) {
    next(error);
  }
};

export const getPhanLoaiThuocById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [phanLoais] = await pool.execute(
      'SELECT * FROM phan_loai_thuoc WHERE id = ?',
      [id]
    );

    if (phanLoais.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân loại thuốc/vật tư'
      });
    }

    res.json({
      success: true,
      data: phanLoais[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createPhanLoaiThuoc = async (req, res, next) => {
  try {
    const { ten_loai, mo_ta } = req.body;

    if (!ten_loai?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên phân loại'
      });
    }

    const ngayTao = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO phan_loai_thuoc (ten_loai, mo_ta, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?)',
      [ten_loai.trim(), mo_ta || null, ngayTao, ngayTao]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo phân loại thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhanLoaiThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_loai, mo_ta } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_loai !== undefined) {
      updateFields.push('ten_loai = ?');
      updateValues.push(ten_loai?.trim() || null);
    }
    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(getNowForDB());
    updateValues.push(id);

    const [result] = await pool.execute(
      `UPDATE phan_loai_thuoc SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân loại thuốc/vật tư'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật phân loại thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhanLoaiThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [items] = await pool.execute(
      'SELECT COUNT(*) as count FROM tu_thuoc WHERE id_phan_loai = ? AND da_xoa = 0',
      [id]
    );

    if (items[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa phân loại này vì đang có mục trong tủ thuốc'
      });
    }

    const [result] = await pool.execute(
      'DELETE FROM phan_loai_thuoc WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân loại thuốc/vật tư'
      });
    }

    res.json({
      success: true,
      message: 'Xóa phân loại thành công'
    });
  } catch (error) {
    next(error);
  }
};
