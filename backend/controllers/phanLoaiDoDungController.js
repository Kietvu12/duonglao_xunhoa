import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllPhanLoaiDoDung = async (req, res, next) => {
  try {
    const [phanLoais] = await pool.execute(
      'SELECT * FROM phan_loai_do_dung ORDER BY ten_loai ASC'
    );

    res.json({
      success: true,
      data: phanLoais
    });
  } catch (error) {
    next(error);
  }
};

export const getPhanLoaiDoDungById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [phanLoais] = await pool.execute(
      'SELECT * FROM phan_loai_do_dung WHERE id = ?',
      [id]
    );

    if (phanLoais.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân loại vật dụng'
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

export const createPhanLoaiDoDung = async (req, res, next) => {
  try {
    const { ten_loai, mo_ta } = req.body;

    if (!ten_loai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên loại'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO phan_loai_do_dung (ten_loai, mo_ta, ngay_tao) VALUES (?, ?, ?)',
      [ten_loai, mo_ta || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo phân loại vật dụng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhanLoaiDoDung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_loai, mo_ta } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_loai !== undefined) {
      updateFields.push('ten_loai = ?');
      updateValues.push(ten_loai);
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

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    updateValues.push(id);

    await pool.execute(
      `UPDATE phan_loai_do_dung SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật phân loại vật dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhanLoaiDoDung = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có vật dụng nào đang sử dụng phân loại này không
    const [doDungs] = await pool.execute(
      'SELECT COUNT(*) as count FROM do_dung_ca_nhan WHERE id_phan_loai = ?',
      [id]
    );

    if (doDungs[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa phân loại này vì đang có vật dụng sử dụng'
      });
    }

    await pool.execute('DELETE FROM phan_loai_do_dung WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa phân loại vật dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

