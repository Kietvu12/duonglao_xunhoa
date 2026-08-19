import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

const parseJsonSafe = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeRow = (row) => ({
  ...row,
  chat_luong: parseJsonSafe(row.chat_luong, {}),
  media: parseJsonSafe(row.media, []),
});

export const getAllKhaoSatChatLuong = async (req, res, next) => {
  try {
    const { date } = req.query;
    let query = 'SELECT * FROM khao_sat_chat_luong';
    const params = [];

    if (date) {
      query += ' WHERE DATE(ngay_tao) = ?';
      params.push(date);
    }

    query += ' ORDER BY ngay_tao DESC, id DESC';
    const [rows] = await pool.execute(query, params);

    res.json({ success: true, data: rows.map(normalizeRow) });
  } catch (error) {
    next(error);
  }
};

export const getKhaoSatChatLuongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM khao_sat_chat_luong WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khảo sát' });
    }

    res.json({ success: true, data: normalizeRow(rows[0]) });
  } catch (error) {
    next(error);
  }
};

export const createKhaoSatChatLuong = async (req, res, next) => {
  try {
    const { ten_file, ngay_tao, chat_luong, media } = req.body;

    if (!ten_file) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên file' });
    }

    const ngayTao = ngay_tao || getNowForDB();
    const chatLuongValue = JSON.stringify(parseJsonSafe(chat_luong, {}));
    const mediaValue = JSON.stringify(parseJsonSafe(media, []));

    const [result] = await pool.execute(
      'INSERT INTO khao_sat_chat_luong (ten_file, ngay_tao, chat_luong, media) VALUES (?, ?, ?, ?)',
      [ten_file, ngayTao, chatLuongValue, mediaValue]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo khảo sát thành công',
      data: { id: result.insertId },
    });
  } catch (error) {
    next(error);
  }
};

export const updateKhaoSatChatLuong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_file, ngay_tao, chat_luong, media } = req.body;

    if (!ten_file) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên file' });
    }

    const chatLuongValue = JSON.stringify(parseJsonSafe(chat_luong, {}));
    const mediaValue = JSON.stringify(parseJsonSafe(media, []));

    await pool.execute(
      'UPDATE khao_sat_chat_luong SET ten_file = ?, ngay_tao = ?, chat_luong = ?, media = ? WHERE id = ?',
      [ten_file, ngay_tao || getNowForDB(), chatLuongValue, mediaValue, id]
    );

    res.json({ success: true, message: 'Cập nhật khảo sát thành công' });
  } catch (error) {
    next(error);
  }
};

export const deleteKhaoSatChatLuong = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM khao_sat_chat_luong WHERE id = ?', [id]);
    res.json({ success: true, message: 'Xóa khảo sát thành công' });
  } catch (error) {
    next(error);
  }
};
