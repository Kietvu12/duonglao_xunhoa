import pool from '../config/database.js';
import { getNowForDB, formatDateForDB } from '../utils/dateUtils.js';

export const getDonThuoc = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.query;

    let query = `
      SELECT dt.*, bn.ho_ten as ten_benh_nhan
      FROM don_thuoc dt
      JOIN benh_nhan bn ON dt.id_benh_nhan = bn.id
      WHERE 1=1
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND dt.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    query += ' ORDER BY dt.ngay_ke DESC';

    const [donThuocs] = await pool.execute(query, params);

    // Get medicines for each prescription
    for (let don of donThuocs) {
      const [thuocs] = await pool.execute(
        'SELECT * FROM thuoc_trong_don WHERE id_don_thuoc = ?',
        [don.id]
      );
      don.thuoc = thuocs;
    }

    res.json({
      success: true,
      data: donThuocs
    });
  } catch (error) {
    next(error);
  }
};

export const createDonThuoc = async (req, res, next) => {
  try {
    const { id_benh_nhan, mo_ta, ngay_ke, thuoc } = req.body;

    if (!id_benh_nhan || !thuoc || !Array.isArray(thuoc) || thuoc.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    const ngayTaoVN = getNowForDB();
    const ngayKeVN = ngay_ke ? formatDateForDB(ngay_ke) : formatDateForDB(new Date());
    const [result] = await pool.execute(
      'INSERT INTO don_thuoc (id_benh_nhan, mo_ta, ngay_ke, ngay_tao) VALUES (?, ?, ?, ?)',
      [id_benh_nhan, mo_ta, ngayKeVN, ngayTaoVN]
    );

    // Insert medicines
    for (const item of thuoc) {
      await pool.execute(
        'INSERT INTO thuoc_trong_don (id_don_thuoc, ten_thuoc, lieu_luong, thoi_diem_uong, thoi_gian_uong, ghi_chu) VALUES (?, ?, ?, ?, ?, ?)',
        [result.insertId, item.ten_thuoc, item.lieu_luong, item.thoi_diem_uong, item.thoi_gian_uong || null, item.ghi_chu]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Tạo đơn thuốc thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDonThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { mo_ta, ngay_ke, thuoc } = req.body;

    if (mo_ta !== undefined || ngay_ke !== undefined) {
      const updateFields = [];
      const updateValues = [];

      if (mo_ta !== undefined) {
        updateFields.push('mo_ta = ?');
        updateValues.push(mo_ta);
      }
      if (ngay_ke !== undefined) {
        updateFields.push('ngay_ke = ?');
        updateValues.push(formatDateForDB(ngay_ke));
      }

      const ngayCapNhatVN = getNowForDB();
      updateFields.push('ngay_cap_nhat = ?');
      updateValues.push(ngayCapNhatVN);
      updateValues.push(id);
      await pool.execute(
        `UPDATE don_thuoc SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update medicines if provided
    if (thuoc && Array.isArray(thuoc)) {
      // Delete existing medicines
      await pool.execute('DELETE FROM thuoc_trong_don WHERE id_don_thuoc = ?', [id]);

      // Insert new medicines
      for (const item of thuoc) {
        await pool.execute(
          'INSERT INTO thuoc_trong_don (id_don_thuoc, ten_thuoc, lieu_luong, thoi_diem_uong, thoi_gian_uong, ghi_chu) VALUES (?, ?, ?, ?, ?, ?)',
          [id, item.ten_thuoc, item.lieu_luong, item.thoi_diem_uong, item.thoi_gian_uong || null, item.ghi_chu]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật đơn thuốc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDonThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM thuoc_trong_don WHERE id_don_thuoc = ?', [id]);
    await pool.execute('DELETE FROM don_thuoc WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa đơn thuốc thành công'
    });
  } catch (error) {
    next(error);
  }
};

