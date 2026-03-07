import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy danh sách thông tin bệnh
export const getAllThongTinBenh = async (req, res, next) => {
  try {
    const [thongTinBenhs] = await pool.execute(
      'SELECT * FROM thong_tin_benh ORDER BY ten_benh ASC'
    );

    res.json({
      success: true,
      data: thongTinBenhs
    });
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin bệnh theo ID
export const getThongTinBenhById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [thongTinBenhs] = await pool.execute(
      'SELECT * FROM thong_tin_benh WHERE id = ?',
      [id]
    );

    if (thongTinBenhs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin bệnh'
      });
    }

    res.json({
      success: true,
      data: thongTinBenhs[0]
    });
  } catch (error) {
    next(error);
  }
};

// Tạo thông tin bệnh mới
export const createThongTinBenh = async (req, res, next) => {
  try {
    const { ten_benh, mo_ta } = req.body;

    if (!ten_benh || ten_benh.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên bệnh'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO thong_tin_benh (ten_benh, mo_ta, ngay_tao) VALUES (?, ?, ?)',
      [ten_benh.trim(), mo_ta || null, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo thông tin bệnh thành công',
      data: { id: result.insertId, ten_benh: ten_benh.trim(), mo_ta: mo_ta || null }
    });
  } catch (error) {
    next(error);
  }
};

