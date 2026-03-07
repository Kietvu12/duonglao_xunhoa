import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotificationForAdmins, createNotificationForDieuDuong } from '../services/notificationService.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllLichThamBenh = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, search, start_date, end_date, trang_thai, id_benh_nhan, id_nguoi_than, khung_gio } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 100);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT ltb.*, 
             bn.ho_ten as ten_benh_nhan, 
             nt.ho_ten as ten_nguoi_than,
             nt.moi_quan_he
      FROM lich_tham_benh ltb
      LEFT JOIN benh_nhan bn ON ltb.id_benh_nhan = bn.id
      LEFT JOIN nguoi_than_benh_nhan nt ON ltb.id_nguoi_than = nt.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (bn.ho_ten LIKE ? OR nt.ho_ten LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (start_date && end_date) {
      if (start_date === end_date) {
        // Nếu cùng một ngày, so sánh trực tiếp với DATE()
        query += ' AND DATE(ltb.ngay) = DATE(?)';
        params.push(start_date);
      } else {
        query += ' AND DATE(ltb.ngay) BETWEEN DATE(?) AND DATE(?)';
        params.push(start_date, end_date);
      }
    } else if (start_date) {
      // Chỉ có start_date
      query += ' AND DATE(ltb.ngay) >= DATE(?)';
      params.push(start_date);
    } else if (end_date) {
      // Chỉ có end_date
      query += ' AND DATE(ltb.ngay) <= DATE(?)';
      params.push(end_date);
    }

    if (trang_thai) {
      query += ' AND ltb.trang_thai = ?';
      params.push(trang_thai);
    }

    if (id_benh_nhan) {
      query += ' AND ltb.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_nguoi_than) {
      query += ' AND ltb.id_nguoi_than = ?';
      params.push(id_nguoi_than);
    }

    if (khung_gio) {
      query += ' AND ltb.khung_gio = ?';
      params.push(khung_gio);
    }

    query += ' ORDER BY ltb.ngay DESC, ltb.khung_gio ASC';
    query += buildLimitOffsetClause(limitValue, offset);

    console.log('[Backend] Query:', query);
    console.log('[Backend] Params:', params);
    
    const [lichThamBenhs] = await pool.execute(query, params);

    console.log('[Backend] Found records:', lichThamBenhs.length);
    if (lichThamBenhs.length > 0) {
      console.log('[Backend] First record:', lichThamBenhs[0]);
    }

    res.json({
      success: true,
      data: lichThamBenhs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLichThamBenhById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lichThamBenhs] = await pool.execute(
      `SELECT ltb.*, 
              bn.ho_ten as ten_benh_nhan, 
              nt.ho_ten as ten_nguoi_than,
              nt.moi_quan_he
       FROM lich_tham_benh ltb
       LEFT JOIN benh_nhan bn ON ltb.id_benh_nhan = bn.id
       LEFT JOIN nguoi_than_benh_nhan nt ON ltb.id_nguoi_than = nt.id
       WHERE ltb.id = ?`,
      [id]
    );

    if (lichThamBenhs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch thăm khám'
      });
    }

    res.json({
      success: true,
      data: lichThamBenhs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createLichThamBenh = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_nguoi_than, ngay, khung_gio, loai, so_nguoi_di_cung, ghi_chu, trang_thai } = req.body;

    if (!id_benh_nhan || !id_nguoi_than || !ngay || !khung_gio) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Bệnh nhân, Người thân, Ngày, Khung giờ)'
      });
    }

    // Validate khung_gio
    const validKhungGio = ['6_8', '8_10', '10_12', '12_14', '14_16', '16_18', '18_20', '20_22'];
    if (!validKhungGio.includes(khung_gio)) {
      return res.status(400).json({
        success: false,
        message: 'Khung giờ không hợp lệ'
      });
    }

    // Validate loai
    const validLoai = ['gap_mat', 'goi_dien'];
    const finalLoai = loai || 'gap_mat';
    if (!validLoai.includes(finalLoai)) {
      return res.status(400).json({
        success: false,
        message: 'Loại thăm bệnh không hợp lệ'
      });
    }

    // Validate trang_thai
    const validTrangThai = ['cho_duyet', 'da_duyet', 'tu_choi'];
    const finalTrangThai = trang_thai || 'cho_duyet';
    if (!validTrangThai.includes(finalTrangThai)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO lich_tham_benh (id_benh_nhan, id_nguoi_than, ngay, khung_gio, loai, so_nguoi_di_cung, ghi_chu, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        id_nguoi_than,
        ngay,
        khung_gio,
        finalLoai,
        so_nguoi_di_cung ? parseInt(so_nguoi_di_cung) : 0,
        sanitizeValue(ghi_chu),
        finalTrangThai,
        ngayTaoVN
      ]
    );

    // Gửi thông báo (không block response nếu có lỗi)
    pool.execute('SELECT ho_ten FROM benh_nhan WHERE id = ?', [id_benh_nhan])
      .then(([benhNhan]) => {
        const tenBenhNhan = benhNhan[0]?.ho_ten || 'Bệnh nhân';
        
        createNotificationForAdmins({
          loai: 'cong_viec',
          tieu_de: 'Lịch thăm bệnh nhân mới',
          noi_dung: `Có lịch thăm bệnh nhân mới cho "${tenBenhNhan}" vào ngày ${ngay}${khung_gio ? ` - ${khung_gio}` : ''}`,
          link: `/admin/lich-tham-benh`
        }).catch(err => console.error('Error sending notification to admins:', err));
        
        createNotificationForDieuDuong({
          loai: 'cong_viec',
          tieu_de: 'Lịch thăm bệnh nhân mới',
          noi_dung: `Có lịch thăm bệnh nhân mới cho "${tenBenhNhan}" vào ngày ${ngay}${khung_gio ? ` - ${khung_gio}` : ''}`,
          link: `/admin/lich-tham-benh`
        }).catch(err => console.error('Error sending notification to dieu duong:', err));
      })
      .catch(err => console.error('Error fetching benh nhan for notification:', err));

    res.status(201).json({
      success: true,
      message: 'Tạo lịch thăm khám thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLichThamBenh = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_benh_nhan, id_nguoi_than, ngay, khung_gio, loai, so_nguoi_di_cung, ghi_chu, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_benh_nhan !== undefined) {
      updateFields.push('id_benh_nhan = ?');
      updateValues.push(id_benh_nhan);
    }

    if (id_nguoi_than !== undefined) {
      updateFields.push('id_nguoi_than = ?');
      updateValues.push(id_nguoi_than);
    }

    if (ngay !== undefined) {
      updateFields.push('ngay = ?');
      updateValues.push(ngay);
    }

    if (khung_gio !== undefined) {
      const validKhungGio = ['6_8', '8_10', '10_12', '12_14', '14_16', '16_18', '18_20', '20_22'];
      if (!validKhungGio.includes(khung_gio)) {
        return res.status(400).json({
          success: false,
          message: 'Khung giờ không hợp lệ'
        });
      }
      updateFields.push('khung_gio = ?');
      updateValues.push(khung_gio);
    }

    if (loai !== undefined) {
      const validLoai = ['gap_mat', 'goi_dien'];
      if (!validLoai.includes(loai)) {
        return res.status(400).json({
          success: false,
          message: 'Loại thăm bệnh không hợp lệ'
        });
      }
      updateFields.push('loai = ?');
      updateValues.push(loai);
    }

    if (so_nguoi_di_cung !== undefined) {
      updateFields.push('so_nguoi_di_cung = ?');
      updateValues.push(so_nguoi_di_cung ? parseInt(so_nguoi_di_cung) : 0);
    }

    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu === '' ? null : ghi_chu);
    }

    if (trang_thai !== undefined) {
      const validTrangThai = ['cho_duyet', 'da_duyet', 'tu_choi'];
      if (!validTrangThai.includes(trang_thai)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ'
        });
      }
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
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
      `UPDATE lich_tham_benh SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch thăm khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLichThamBenh = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM lich_tham_benh WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa lịch thăm khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

