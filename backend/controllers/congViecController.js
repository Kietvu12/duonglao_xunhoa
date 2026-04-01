import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotification } from '../services/notificationService.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllCongViec = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, id_dieu_duong, id_benh_nhan, trang_thai, muc_uu_tien } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT cv.*, 
             tk.ho_ten as ten_dieu_duong,
             bn.ho_ten as ten_benh_nhan,
             pc.id_dieu_duong,
             pc.id_benh_nhan,
             pc.trang_thai, pc.thoi_gian_hoan_thanh
      FROM cong_viec cv
      LEFT JOIN (
        SELECT pc1.*
        FROM phan_cong_cong_viec pc1
        INNER JOIN (
          SELECT id_cong_viec, MAX(id) as max_id
          FROM phan_cong_cong_viec
          GROUP BY id_cong_viec
        ) pc2 ON pc1.id_cong_viec = pc2.id_cong_viec AND pc1.id = pc2.max_id
      ) pc ON cv.id = pc.id_cong_viec
      LEFT JOIN ho_so_nhan_vien hsv ON pc.id_dieu_duong = hsv.id
      LEFT JOIN tai_khoan tk ON hsv.id_tai_khoan = tk.id AND (tk.da_xoa = 0 OR tk.da_xoa IS NULL)
      LEFT JOIN benh_nhan bn ON pc.id_benh_nhan = bn.id AND (bn.da_xoa = 0 OR bn.da_xoa IS NULL)
      WHERE 1=1
    `;
    const params = [];

    if (id_dieu_duong) {
      query += ' AND pc.id_dieu_duong = ?';
      params.push(id_dieu_duong);
    }

    if (id_benh_nhan) {
      query += ' AND pc.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (trang_thai) {
      query += ' AND pc.trang_thai = ?';
      params.push(trang_thai);
    }

    if (muc_uu_tien) {
      query += ' AND cv.muc_uu_tien = ?';
      params.push(muc_uu_tien);
    }

    query += ' ORDER BY cv.thoi_gian_du_kien DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [congViecs] = await pool.execute(query, params);

    let countQuery = `
      SELECT COUNT(*) as total
      FROM cong_viec cv
      LEFT JOIN (
        SELECT pc1.*
        FROM phan_cong_cong_viec pc1
        INNER JOIN (
          SELECT id_cong_viec, MAX(id) as max_id
          FROM phan_cong_cong_viec
          GROUP BY id_cong_viec
        ) pc2 ON pc1.id_cong_viec = pc2.id_cong_viec AND pc1.id = pc2.max_id
      ) pc ON cv.id = pc.id_cong_viec
      WHERE 1=1
    `;
    const countParams = [];
    if (id_dieu_duong) {
      countQuery += ' AND pc.id_dieu_duong = ?';
      countParams.push(id_dieu_duong);
    }
    if (id_benh_nhan) {
      countQuery += ' AND pc.id_benh_nhan = ?';
      countParams.push(id_benh_nhan);
    }
    if (trang_thai) {
      countQuery += ' AND pc.trang_thai = ?';
      countParams.push(trang_thai);
    }
    if (muc_uu_tien) {
      countQuery += ' AND cv.muc_uu_tien = ?';
      countParams.push(muc_uu_tien);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = Number(countResult[0]?.total) || 0;
    const totalPages = total === 0 ? 0 : Math.ceil(total / limitValue);

    // Format datetime fields to MySQL format (YYYY-MM-DD HH:mm:ss)
    const formattedCongViecs = congViecs.map(cv => {
      const formatted = { ...cv };
      
      // Format thoi_gian_du_kien
      if (formatted.thoi_gian_du_kien) {
        if (formatted.thoi_gian_du_kien instanceof Date) {
          // Convert Date object to MySQL format
          const year = formatted.thoi_gian_du_kien.getFullYear();
          const month = String(formatted.thoi_gian_du_kien.getMonth() + 1).padStart(2, '0');
          const day = String(formatted.thoi_gian_du_kien.getDate()).padStart(2, '0');
          const hours = String(formatted.thoi_gian_du_kien.getHours()).padStart(2, '0');
          const minutes = String(formatted.thoi_gian_du_kien.getMinutes()).padStart(2, '0');
          const seconds = String(formatted.thoi_gian_du_kien.getSeconds()).padStart(2, '0');
          formatted.thoi_gian_du_kien = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else if (typeof formatted.thoi_gian_du_kien === 'string') {
          // If it's already a string, ensure it's in MySQL format (remove timezone if present)
          formatted.thoi_gian_du_kien = formatted.thoi_gian_du_kien.replace('T', ' ').replace(/[Zz].*$/, '').replace(/[+-]\d{2}:\d{2}.*$/, '').replace(/\.\d{3}$/, '');
        }
      }
      
      // Format thoi_gian_hoan_thanh if exists
      if (formatted.thoi_gian_hoan_thanh) {
        if (formatted.thoi_gian_hoan_thanh instanceof Date) {
          const year = formatted.thoi_gian_hoan_thanh.getFullYear();
          const month = String(formatted.thoi_gian_hoan_thanh.getMonth() + 1).padStart(2, '0');
          const day = String(formatted.thoi_gian_hoan_thanh.getDate()).padStart(2, '0');
          const hours = String(formatted.thoi_gian_hoan_thanh.getHours()).padStart(2, '0');
          const minutes = String(formatted.thoi_gian_hoan_thanh.getMinutes()).padStart(2, '0');
          const seconds = String(formatted.thoi_gian_hoan_thanh.getSeconds()).padStart(2, '0');
          formatted.thoi_gian_hoan_thanh = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else if (typeof formatted.thoi_gian_hoan_thanh === 'string') {
          formatted.thoi_gian_hoan_thanh = formatted.thoi_gian_hoan_thanh.replace('T', ' ').replace(/[Zz].*$/, '').replace(/[+-]\d{2}:\d{2}.*$/, '').replace(/\.\d{3}$/, '');
        }
      }
      
      return formatted;
    });

    res.json({
      success: true,
      data: formattedCongViecs,
      pagination: {
        page: safePage,
        limit: limitValue,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createCongViec = async (req, res, next) => {
  try {
    const { ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_dieu_duong, id_benh_nhan } = req.body;

    if (!ten_cong_viec) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên công việc'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO cong_viec (ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_nguoi_tao, ngay_tao) VALUES (?, ?, ?, ?, ?, ?)',
      [ten_cong_viec, mo_ta, muc_uu_tien || 'trung_binh', thoi_gian_du_kien, req.user.id, ngayTaoVN]
    );

    // Phân công một phần: DB cho phép NULL — chỉ cần ít nhất một trong hai (điều dưỡng / bệnh nhân)
    const dd =
      id_dieu_duong !== undefined && id_dieu_duong !== null && String(id_dieu_duong).trim() !== ''
        ? id_dieu_duong
        : null;
    const bn =
      id_benh_nhan !== undefined && id_benh_nhan !== null && String(id_benh_nhan).trim() !== ''
        ? id_benh_nhan
        : null;

    if (dd || bn) {
      let idTaiKhoan = null;
      if (dd) {
        const [hoSoNhanVien] = await pool.execute(
          'SELECT id_tai_khoan FROM ho_so_nhan_vien WHERE id = ?',
          [dd]
        );
        if (hoSoNhanVien.length > 0) {
          idTaiKhoan = hoSoNhanVien[0].id_tai_khoan;
        }
      }

      const ngayTaoPhanCong = getNowForDB();
      await pool.execute(
        'INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan, ngay_tao) VALUES (?, ?, ?, ?)',
        [result.insertId, dd, bn, ngayTaoPhanCong]
      );

      if (idTaiKhoan) {
        createNotification({
          id_nguoi_nhan: idTaiKhoan,
          loai: 'cong_viec',
          tieu_de: 'Công việc mới',
          noi_dung: `Bạn có công việc mới: "${ten_cong_viec}"`,
          link: `/admin/cong-viec`
        }).catch((err) => console.error('Error sending notification:', err));
      }
    }

    res.status(201).json({
      success: true,
      message: 'Tạo công việc thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const phanCongCongViec = async (req, res, next) => {
  try {
    const { id_cong_viec, id_dieu_duong, id_benh_nhan } = req.body;

    // Preserve "undefined" to mean "do not change this field".
    // Only convert explicit empty/null input to null for clearing.
    const dd =
      id_dieu_duong === undefined
        ? undefined
        : (id_dieu_duong === null || String(id_dieu_duong).trim() === '' ? null : id_dieu_duong);
    const bn =
      id_benh_nhan === undefined
        ? undefined
        : (id_benh_nhan === null || String(id_benh_nhan).trim() === '' ? null : id_benh_nhan);

    if (!id_cong_viec) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu id công việc'
      });
    }

    const [existingRows] = await pool.execute(
      'SELECT id, id_dieu_duong, id_benh_nhan FROM phan_cong_cong_viec WHERE id_cong_viec = ? ORDER BY id DESC LIMIT 1',
      [id_cong_viec]
    );

    const ngayVN = getNowForDB();

    if (existingRows.length > 0) {
      const mergedDd = dd !== undefined ? dd : (existingRows[0].id_dieu_duong ?? null);
      const mergedBn = bn !== undefined ? bn : (existingRows[0].id_benh_nhan ?? null);

      if (!mergedDd && !mergedBn) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn ít nhất điều dưỡng hoặc bệnh nhân'
        });
      }

      await pool.execute(
        'UPDATE phan_cong_cong_viec SET id_dieu_duong = ?, id_benh_nhan = ?, ngay_cap_nhat = ? WHERE id = ?',
        [mergedDd, mergedBn, ngayVN, existingRows[0].id]
      );
    } else {
      if (!dd && !bn) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn ít nhất điều dưỡng hoặc bệnh nhân'
        });
      }

      await pool.execute(
        'INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan, ngay_tao) VALUES (?, ?, ?, ?)',
        [id_cong_viec, dd, bn, ngayVN]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Phân công công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrangThaiCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!trang_thai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn trạng thái'
      });
    }

    const updateData = { trang_thai };
    if (trang_thai === 'hoan_thanh') {
      updateData.thoi_gian_hoan_thanh = new Date();
    }

    const updateFields = [];
    const updateValues = [];

    for (const [key, value] of Object.entries(updateData)) {
      updateFields.push(`${key} = ?`);
      updateValues.push(value);
    }

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    updateValues.push(id);

    // Update phan_cong_cong_viec using id_cong_viec (id from params is cong_viec.id)
    const [result] = await pool.execute(
      `UPDATE phan_cong_cong_viec SET ${updateFields.join(', ')} WHERE id_cong_viec = ?`,
      updateValues
    );

    // If no phan_cong record exists, create one
    if (result.affectedRows === 0) {
      // Check if cong_viec exists
      const [congViec] = await pool.execute(
        'SELECT id FROM cong_viec WHERE id = ?',
        [id]
      );

      if (congViec.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy công việc'
        });
      }

      // Create phan_cong_cong_viec record with default values
      const ngayTaoVN = getNowForDB();
      await pool.execute(
        `INSERT INTO phan_cong_cong_viec (id_cong_viec, trang_thai, ngay_tao${trang_thai === 'hoan_thanh' ? ', thoi_gian_hoan_thanh' : ''}) VALUES (?, ?, ?${trang_thai === 'hoan_thanh' ? ', ?' : ''})`,
        trang_thai === 'hoan_thanh' 
          ? [id, trang_thai, ngayTaoVN, new Date()]
          : [id, trang_thai, ngayTaoVN]
      );
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const updateCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_dieu_duong, id_benh_nhan } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_cong_viec !== undefined) {
      updateFields.push('ten_cong_viec = ?');
      updateValues.push(ten_cong_viec);
    }
    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta);
    }
    if (muc_uu_tien !== undefined) {
      updateFields.push('muc_uu_tien = ?');
      updateValues.push(muc_uu_tien);
    }
    if (thoi_gian_du_kien !== undefined) {
      updateFields.push('thoi_gian_du_kien = ?');
      updateValues.push(thoi_gian_du_kien);
    }

    if (updateFields.length === 0 && id_dieu_duong === undefined && id_benh_nhan === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    // Update cong_viec table if there are fields to update
    if (updateFields.length > 0) {
      const ngayCapNhatVN = getNowForDB();
      updateFields.push('ngay_cap_nhat = ?');
      updateValues.push(ngayCapNhatVN);
      updateValues.push(id);
      await pool.execute(
        `UPDATE cong_viec SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Handle phan_cong_cong_viec update
    if (id_dieu_duong !== undefined || id_benh_nhan !== undefined) {
      // Normalize empty strings to null
      const normalizedIdDieuDuong = (id_dieu_duong === '' || id_dieu_duong === null) ? null : id_dieu_duong;
      const normalizedIdBenhNhan = (id_benh_nhan === '' || id_benh_nhan === null) ? null : id_benh_nhan;

      // Check if there's an existing assignment
      const [existingAssignments] = await pool.execute(
        'SELECT id, id_dieu_duong, id_benh_nhan FROM phan_cong_cong_viec WHERE id_cong_viec = ?',
        [id]
      );

      const finalIdDieuDuong = normalizedIdDieuDuong !== undefined ? normalizedIdDieuDuong : (existingAssignments[0]?.id_dieu_duong ?? null);
      const finalIdBenhNhan = normalizedIdBenhNhan !== undefined ? normalizedIdBenhNhan : (existingAssignments[0]?.id_benh_nhan ?? null);

      const dd = finalIdDieuDuong || null;
      const bn = finalIdBenhNhan || null;

      if (!dd && !bn) {
        if (existingAssignments.length > 0) {
          await pool.execute('DELETE FROM phan_cong_cong_viec WHERE id_cong_viec = ?', [id]);
        }
      } else if (existingAssignments.length > 0) {
        const ngayCapNhatVN = getNowForDB();
        await pool.execute(
          'UPDATE phan_cong_cong_viec SET id_dieu_duong = ?, id_benh_nhan = ?, ngay_cap_nhat = ? WHERE id_cong_viec = ?',
          [dd, bn, ngayCapNhatVN, id]
        );
      } else {
        const ngayTaoVN = getNowForDB();
        await pool.execute(
          'INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan, ngay_tao) VALUES (?, ?, ?, ?)',
          [id, dd, bn, ngayTaoVN]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCongViec = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete assignments first
    await pool.execute('DELETE FROM phan_cong_cong_viec WHERE id_cong_viec = ?', [id]);
    // Delete the job
    await pool.execute('DELETE FROM cong_viec WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa công việc thành công'
    });
  } catch (error) {
    next(error);
  }
};

