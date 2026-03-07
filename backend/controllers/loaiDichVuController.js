import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllLoaiDichVu = async (req, res, next) => {
  try {
    const [loaiDichVus] = await pool.execute(
      'SELECT * FROM loai_dich_vu ORDER BY ngay_tao DESC'
    );

    res.json({
      success: true,
      data: loaiDichVus
    });
  } catch (error) {
    next(error);
  }
};

export const getLoaiDichVuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [loaiDichVus] = await pool.execute(
      'SELECT * FROM loai_dich_vu WHERE id = ?',
      [id]
    );

    if (loaiDichVus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại dịch vụ'
      });
    }

    res.json({
      success: true,
      data: loaiDichVus[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createLoaiDichVu = async (req, res, next) => {
  try {
    const { ten, mo_ta } = req.body;

    if (!ten) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền tên loại dịch vụ'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO loai_dich_vu (ten, mo_ta, ngay_tao) VALUES (?, ?, ?)',
      [ten, mo_ta || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm loại dịch vụ thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLoaiDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten, mo_ta } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten !== undefined) {
      updateFields.push('ten = ?');
      updateValues.push(ten);
    }

    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta === '' ? null : mo_ta);
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
      `UPDATE loai_dich_vu SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật loại dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLoaiDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có dịch vụ nào đang dùng loại này không
    const [dichVus] = await pool.execute(
      'SELECT COUNT(*) as count FROM dich_vu WHERE id_loai_dich_vu = ?',
      [id]
    );

    if (dichVus[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa loại dịch vụ đang được sử dụng'
      });
    }

    await pool.execute('DELETE FROM loai_dich_vu WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa loại dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

