import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getMediaHoSoNhanVien = async (req, res, next) => {
  try {
    const { id_nhan_vien } = req.query;

    let query = `
      SELECT mhsnv.*, hsnv.id_tai_khoan, tk.ho_ten as ten_nhan_vien
      FROM media_ho_so_nhan_vien mhsnv
      JOIN ho_so_nhan_vien hsnv ON mhsnv.id_nhan_vien = hsnv.id
      LEFT JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
      WHERE 1=1
    `;
    const params = [];

    if (id_nhan_vien) {
      query += ' AND mhsnv.id_nhan_vien = ?';
      params.push(id_nhan_vien);
    }

    query += ' ORDER BY mhsnv.ngay_tao DESC';

    const [medias] = await pool.execute(query, params);

    res.json({
      success: true,
      data: medias
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaHoSoNhanVienById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [medias] = await pool.execute(
      `SELECT mhsnv.*, hsnv.id_tai_khoan, tk.ho_ten as ten_nhan_vien
       FROM media_ho_so_nhan_vien mhsnv
       JOIN ho_so_nhan_vien hsnv ON mhsnv.id_nhan_vien = hsnv.id
       LEFT JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE mhsnv.id = ?`,
      [id]
    );

    if (medias.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy media hồ sơ nhân viên'
      });
    }

    res.json({
      success: true,
      data: medias[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createMediaHoSoNhanVien = async (req, res, next) => {
  try {
    const { id_nhan_vien, anh_cccd, anh_bangdh, anh_bhyt, anh_cv } = req.body;

    if (!id_nhan_vien) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền ID nhân viên'
      });
    }

    // Kiểm tra xem đã có media cho nhân viên này chưa
    const [existing] = await pool.execute(
      'SELECT id FROM media_ho_so_nhan_vien WHERE id_nhan_vien = ?',
      [id_nhan_vien]
    );

    let result;
    if (existing.length > 0) {
      // Cập nhật nếu đã tồn tại
      const updateFields = [];
      const updateValues = [];

      if (anh_cccd !== undefined) {
        updateFields.push('anh_cccd = ?');
        updateValues.push(anh_cccd || null);
      }
      if (anh_bangdh !== undefined) {
        updateFields.push('anh_bangdh = ?');
        updateValues.push(anh_bangdh || null);
      }
      if (anh_bhyt !== undefined) {
        updateFields.push('anh_bhyt = ?');
        updateValues.push(anh_bhyt || null);
      }
      if (anh_cv !== undefined) {
        updateFields.push('anh_cv = ?');
        updateValues.push(anh_cv || null);
      }

      if (updateFields.length > 0) {
        const ngayCapNhatVN = getNowForDB();
        updateFields.push('ngay_cap_nhat = ?');
        updateValues.push(ngayCapNhatVN);
        updateValues.push(existing[0].id);
        await pool.execute(
          `UPDATE media_ho_so_nhan_vien SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
        result = { insertId: existing[0].id };
      } else {
        result = { insertId: existing[0].id };
      }
    } else {
      // Tạo mới
      const ngayTaoVN = getNowForDB();
      [result] = await pool.execute(
        `INSERT INTO media_ho_so_nhan_vien (id_nhan_vien, anh_cccd, anh_bangdh, anh_bhyt, anh_cv, ngay_tao)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id_nhan_vien,
          anh_cccd || null,
          anh_bangdh || null,
          anh_bhyt || null,
          anh_cv || null,
          ngayTaoVN
        ]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Thêm/cập nhật media hồ sơ nhân viên thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMediaHoSoNhanVien = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_nhan_vien, anh_cccd, anh_bangdh, anh_bhyt, anh_cv } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_nhan_vien !== undefined) {
      updateFields.push('id_nhan_vien = ?');
      updateValues.push(id_nhan_vien);
    }

    if (anh_cccd !== undefined) {
      updateFields.push('anh_cccd = ?');
      updateValues.push(anh_cccd === '' ? null : anh_cccd);
    }

    if (anh_bangdh !== undefined) {
      updateFields.push('anh_bangdh = ?');
      updateValues.push(anh_bangdh === '' ? null : anh_bangdh);
    }

    if (anh_bhyt !== undefined) {
      updateFields.push('anh_bhyt = ?');
      updateValues.push(anh_bhyt === '' ? null : anh_bhyt);
    }

    if (anh_cv !== undefined) {
      updateFields.push('anh_cv = ?');
      updateValues.push(anh_cv === '' ? null : anh_cv);
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
      `UPDATE media_ho_so_nhan_vien SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật media hồ sơ nhân viên thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaHoSoNhanVien = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM media_ho_so_nhan_vien WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa media hồ sơ nhân viên thành công'
    });
  } catch (error) {
    next(error);
  }
};

