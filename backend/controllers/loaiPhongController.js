import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllLoaiPhong = async (req, res, next) => {
  try {
    const [loaiPhongs] = await pool.execute(
      'SELECT * FROM loai_phong ORDER BY ngay_tao DESC'
    );

    res.json({
      success: true,
      data: loaiPhongs
    });
  } catch (error) {
    next(error);
  }
};

export const getLoaiPhongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [loaiPhongs] = await pool.execute(
      'SELECT * FROM loai_phong WHERE id = ?',
      [id]
    );

    if (loaiPhongs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại phòng'
      });
    }

    res.json({
      success: true,
      data: loaiPhongs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createLoaiPhong = async (req, res, next) => {
  try {
    const { ten, mo_ta, anh_mau } = req.body;

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO loai_phong (ten, mo_ta, anh_mau, ngay_tao) VALUES (?, ?, ?, ?)',
      [ten || null, mo_ta || null, anh_mau || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm loại phòng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLoaiPhong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten, mo_ta, anh_mau } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten !== undefined) {
      updateFields.push('ten = ?');
      updateValues.push(ten === '' ? null : ten);
    }

    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta === '' ? null : mo_ta);
    }

    if (anh_mau !== undefined) {
      updateFields.push('anh_mau = ?');
      updateValues.push(anh_mau === '' ? null : anh_mau);
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
      `UPDATE loai_phong SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật loại phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLoaiPhong = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có phòng nào đang dùng loại này không
    const [phongs] = await pool.execute(
      'SELECT COUNT(*) as count FROM phong WHERE id_loai_phong = ?',
      [id]
    );

    if (phongs[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa loại phòng đang được sử dụng'
      });
    }

    await pool.execute('DELETE FROM loai_phong WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa loại phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

