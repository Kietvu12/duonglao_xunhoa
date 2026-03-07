import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllMediaCaNhanBenhNhan = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, id_benh_nhan, id_dieu_duong, id_nguoi_nha, start_date, end_date } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 100);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT mcn.*, 
             bn.ho_ten as ten_benh_nhan,
             tk.ho_ten as ten_dieu_duong,
             nt.ho_ten as ten_nguoi_nha
      FROM media_ca_nhan_benh_nhan mcn
      JOIN benh_nhan bn ON mcn.id_benh_nhan = bn.id
      LEFT JOIN ho_so_nhan_vien hsnv ON mcn.id_dieu_duong = hsnv.id
      LEFT JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
      LEFT JOIN nguoi_than_benh_nhan nt ON mcn.id_nguoi_nha = nt.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND mcn.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_dieu_duong) {
      query += ' AND mcn.id_dieu_duong = ?';
      params.push(id_dieu_duong);
    }

    if (id_nguoi_nha) {
      query += ' AND mcn.id_nguoi_nha = ?';
      params.push(id_nguoi_nha);
    }

    if (start_date && end_date) {
      query += ' AND DATE(mcn.ngay_gui) BETWEEN DATE(?) AND DATE(?)';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND DATE(mcn.ngay_gui) >= DATE(?)';
      params.push(start_date);
    } else if (end_date) {
      query += ' AND DATE(mcn.ngay_gui) <= DATE(?)';
      params.push(end_date);
    }

    query += ' ORDER BY mcn.ngay_gui DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [medias] = await pool.execute(query, params);

    res.json({
      success: true,
      data: medias,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaCaNhanBenhNhanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [medias] = await pool.execute(
      `SELECT mcn.*, 
              bn.ho_ten as ten_benh_nhan,
              tk.ho_ten as ten_dieu_duong,
              nt.ho_ten as ten_nguoi_nha
       FROM media_ca_nhan_benh_nhan mcn
       JOIN benh_nhan bn ON mcn.id_benh_nhan = bn.id
       LEFT JOIN ho_so_nhan_vien hsnv ON mcn.id_dieu_duong = hsnv.id
       LEFT JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       LEFT JOIN nguoi_than_benh_nhan nt ON mcn.id_nguoi_nha = nt.id
       WHERE mcn.id = ?`,
      [id]
    );

    if (medias.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy media cá nhân bệnh nhân'
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

export const createMediaCaNhanBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_nguoi_nha, duong_dan_anh, loi_nhan, ngay_gui } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền ID bệnh nhân'
      });
    }

    // Tự động lấy id_dieu_duong từ user đang đăng nhập
    let idDieuDuong = null;
    if (req.user) {
      // Tìm ho_so_nhan_vien.id từ tai_khoan.id
      const [hoSoNhanVien] = await pool.execute(
        'SELECT id FROM ho_so_nhan_vien WHERE id_tai_khoan = ?',
        [req.user.id]
      );
      if (hoSoNhanVien.length > 0) {
        idDieuDuong = hoSoNhanVien[0].id;
      }
    }

    // Chuyển đổi ngay_gui từ ISO string sang MySQL datetime format
    let ngayGuiValue = null;
    if (ngay_gui) {
      try {
        const date = new Date(ngay_gui);
        // Format: YYYY-MM-DD HH:MM:SS
        ngayGuiValue = date.toISOString().slice(0, 19).replace('T', ' ');
      } catch (error) {
        // Nếu không parse được, dùng thời gian hiện tại
        ngayGuiValue = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO media_ca_nhan_benh_nhan (id_dieu_duong, id_benh_nhan, id_nguoi_nha, duong_dan_anh, loi_nhan, ngay_gui, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idDieuDuong,
        id_benh_nhan,
        id_nguoi_nha || null,
        duong_dan_anh || null,
        loi_nhan || null,
        ngayGuiValue,
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm media cá nhân bệnh nhân thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMediaCaNhanBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_dieu_duong, id_benh_nhan, id_nguoi_nha, duong_dan_anh, loi_nhan, ngay_gui } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_dieu_duong !== undefined) {
      updateFields.push('id_dieu_duong = ?');
      updateValues.push(id_dieu_duong || null);
    }

    if (id_benh_nhan !== undefined) {
      updateFields.push('id_benh_nhan = ?');
      updateValues.push(id_benh_nhan);
    }

    if (id_nguoi_nha !== undefined) {
      updateFields.push('id_nguoi_nha = ?');
      updateValues.push(id_nguoi_nha || null);
    }

    if (duong_dan_anh !== undefined) {
      updateFields.push('duong_dan_anh = ?');
      updateValues.push(duong_dan_anh === '' ? null : duong_dan_anh);
    }

    if (loi_nhan !== undefined) {
      updateFields.push('loi_nhan = ?');
      updateValues.push(loi_nhan === '' ? null : loi_nhan);
    }

    if (ngay_gui !== undefined) {
      updateFields.push('ngay_gui = ?');
      // Chuyển đổi ngay_gui từ ISO string sang MySQL datetime format
      let ngayGuiValue = null;
      if (ngay_gui) {
        try {
          const date = new Date(ngay_gui);
          // Format: YYYY-MM-DD HH:MM:SS
          ngayGuiValue = date.toISOString().slice(0, 19).replace('T', ' ');
        } catch (error) {
          // Nếu không parse được, dùng thời gian hiện tại
          ngayGuiValue = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }
      }
      updateValues.push(ngayGuiValue);
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
      `UPDATE media_ca_nhan_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật media cá nhân bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaCaNhanBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM media_ca_nhan_benh_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa media cá nhân bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

