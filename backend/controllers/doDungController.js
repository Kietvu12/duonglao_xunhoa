import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllDoDung = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.query;

    let query = `
      SELECT dd.*, bn.ho_ten, pldd.ten_loai as ten_phan_loai, pldd.mo_ta as mo_ta_phan_loai
      FROM do_dung_ca_nhan dd
      JOIN benh_nhan bn ON dd.id_benh_nhan = bn.id
      LEFT JOIN phan_loai_do_dung pldd ON dd.id_phan_loai = pldd.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND dd.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    query += ' ORDER BY dd.ngay_them DESC';

    const [doDungs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: doDungs
    });
  } catch (error) {
    next(error);
  }
};

export const getDoDungById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [doDungs] = await pool.execute(
      `SELECT dd.*, pldd.ten_loai as ten_phan_loai, pldd.mo_ta as mo_ta_phan_loai
       FROM do_dung_ca_nhan dd
       LEFT JOIN phan_loai_do_dung pldd ON dd.id_phan_loai = pldd.id
       WHERE dd.id = ?`,
      [id]
    );

    if (doDungs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vật dụng'
      });
    }

    res.json({
      success: true,
      data: doDungs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createDoDung = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_phan_loai, ten_vat_dung, so_luong, tinh_trang, media, ghi_chu, nguon_cung_cap } = req.body;

    if (!id_benh_nhan || !ten_vat_dung) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO do_dung_ca_nhan (id_benh_nhan, id_phan_loai, ten_vat_dung, so_luong, tinh_trang, media, ghi_chu, nguon_cung_cap, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_benh_nhan, id_phan_loai || null, ten_vat_dung, so_luong || 1, tinh_trang || 'tot', media || null, ghi_chu || null, nguon_cung_cap || 'ca_nhan', ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm vật dụng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateDoDung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_phan_loai, ten_vat_dung, so_luong, tinh_trang, media, ghi_chu, nguon_cung_cap } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_phan_loai !== undefined) {
      updateFields.push('id_phan_loai = ?');
      updateValues.push(id_phan_loai || null);
    }
    if (ten_vat_dung !== undefined) {
      updateFields.push('ten_vat_dung = ?');
      updateValues.push(ten_vat_dung);
    }
    if (so_luong !== undefined) {
      updateFields.push('so_luong = ?');
      updateValues.push(so_luong);
    }
    if (tinh_trang !== undefined) {
      updateFields.push('tinh_trang = ?');
      updateValues.push(tinh_trang);
    }
    if (media !== undefined) {
      updateFields.push('media = ?');
      updateValues.push(media || null);
    }
    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu || null);
    }
    if (nguon_cung_cap !== undefined) {
      updateFields.push('nguon_cung_cap = ?');
      updateValues.push(nguon_cung_cap);
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
      `UPDATE do_dung_ca_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật vật dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDoDung = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM do_dung_ca_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa vật dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

