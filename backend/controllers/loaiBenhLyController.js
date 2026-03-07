import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy danh sách loại bệnh lý
export const getAllLoaiBenhLy = async (req, res, next) => {
  try {
    const [loaiBenhLys] = await pool.execute(
      'SELECT * FROM loai_benh_ly ORDER BY ten_loai_benh_ly ASC'
    );

    res.json({
      success: true,
      data: loaiBenhLys
    });
  } catch (error) {
    next(error);
  }
};

// Lấy loại bệnh lý theo ID
export const getLoaiBenhLyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [loaiBenhLys] = await pool.execute(
      'SELECT * FROM loai_benh_ly WHERE id = ?',
      [id]
    );

    if (loaiBenhLys.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy loại bệnh lý'
      });
    }

    res.json({
      success: true,
      data: loaiBenhLys[0]
    });
  } catch (error) {
    next(error);
  }
};

// Tạo loại bệnh lý mới
export const createLoaiBenhLy = async (req, res, next) => {
  try {
    const { ten_loai_benh_ly, mo_ta } = req.body;

    if (!ten_loai_benh_ly || ten_loai_benh_ly.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên loại bệnh lý'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO loai_benh_ly (ten_loai_benh_ly, mo_ta, ngay_tao) VALUES (?, ?, ?)',
      [ten_loai_benh_ly.trim(), mo_ta || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo loại bệnh lý thành công',
      data: { id: result.insertId, ten_loai_benh_ly: ten_loai_benh_ly.trim(), mo_ta: mo_ta || null }
    });
  } catch (error) {
    next(error);
  }
};

