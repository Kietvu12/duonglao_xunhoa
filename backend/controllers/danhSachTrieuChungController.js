import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllDanhSachTrieuChung = async (req, res, next) => {
  try {
    const { search, loai } = req.query;

    let query = 'SELECT * FROM danh_sach_trieu_chung WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND ten_trieu_chung LIKE ?';
      params.push(`%${search}%`);
    }

    if (loai) {
      query += ' AND loai = ?';
      params.push(loai);
    }

    query += ' ORDER BY ten_trieu_chung ASC';

    const [trieuChungs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: trieuChungs
    });
  } catch (error) {
    next(error);
  }
};

export const getDanhSachTrieuChungById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [trieuChungs] = await pool.execute(
      'SELECT * FROM danh_sach_trieu_chung WHERE id = ?',
      [id]
    );

    if (trieuChungs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy triệu chứng'
      });
    }

    res.json({
      success: true,
      data: trieuChungs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createDanhSachTrieuChung = async (req, res, next) => {
  try {
    const { ten_trieu_chung, loai } = req.body;

    if (!ten_trieu_chung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền tên triệu chứng'
      });
    }

    // Validate loai enum values
    const validLoaiValues = ['khan_cap', 'ho_hap', 'tim_mach', 'tieu_hoa', 'tiet_nieu', 'than_kinh', 'da_lieu', 'co_xuong', 'toan_than', 'khac'];
    const loaiValue = loai && validLoaiValues.includes(loai) ? loai : 'khac';

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO danh_sach_trieu_chung (ten_trieu_chung, loai, ngay_tao) VALUES (?, ?, ?)',
      [ten_trieu_chung, loaiValue, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm triệu chứng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDanhSachTrieuChung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_trieu_chung, loai } = req.body;

    if (!ten_trieu_chung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền tên triệu chứng'
      });
    }

    // Validate loai enum values
    const validLoaiValues = ['khan_cap', 'ho_hap', 'tim_mach', 'tieu_hoa', 'tiet_nieu', 'than_kinh', 'da_lieu', 'co_xuong', 'toan_than', 'khac'];
    const loaiValue = loai && validLoaiValues.includes(loai) ? loai : 'khac';

    const ngayCapNhatVN = getNowForDB();
    await pool.execute(
      'UPDATE danh_sach_trieu_chung SET ten_trieu_chung = ?, loai = ?, ngay_cap_nhat = ? WHERE id = ?',
      [ten_trieu_chung, loaiValue, ngayCapNhatVN, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật triệu chứng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDanhSachTrieuChung = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM danh_sach_trieu_chung WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa triệu chứng thành công'
    });
  } catch (error) {
    next(error);
  }
};

