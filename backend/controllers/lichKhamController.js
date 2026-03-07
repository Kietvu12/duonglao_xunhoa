import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotificationForAdmins, createNotificationForDieuDuong, createNotificationForAdminsAndMarketing } from '../services/notificationService.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllLichKham = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, start_date, end_date, loai_kham, trang_thai } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT lk.*, bn.ho_ten as ten_benh_nhan, bn.phong
      FROM lich_kham lk
      JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(lk.thoi_gian) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (loai_kham) {
      query += ' AND lk.loai_kham = ?';
      params.push(loai_kham);
    }

    if (trang_thai) {
      query += ' AND lk.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY lk.thoi_gian DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [lichKhams] = await pool.execute(query, params);

    res.json({
      success: true,
      data: lichKhams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLichKhamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [lichKhams] = await pool.execute(
      `SELECT lk.*, bn.ho_ten as ten_benh_nhan, bn.phong
       FROM lich_kham lk
       JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
       WHERE lk.id = ?`,
      [id]
    );

    if (lichKhams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch khám'
      });
    }

    res.json({
      success: true,
      data: lichKhams[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createLichKham = async (req, res, next) => {
  try {
    const { id_benh_nhan, loai_kham, bac_si, thoi_gian, ket_qua } = req.body;

    if (!id_benh_nhan || !loai_kham || !thoi_gian) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Sanitize values - convert empty strings and undefined to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO lich_kham (id_benh_nhan, loai_kham, bac_si, thoi_gian, ket_qua, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_benh_nhan, loai_kham, sanitizeValue(bac_si), thoi_gian, sanitizeValue(ket_qua), ngayTaoVN]
    );

    // Gửi thông báo (không block response nếu có lỗi)
    pool.execute('SELECT ho_ten FROM benh_nhan WHERE id = ?', [id_benh_nhan])
      .then(([benhNhan]) => {
        const tenBenhNhan = benhNhan[0]?.ho_ten || 'Bệnh nhân';
        
        createNotificationForAdmins({
          loai: 'he_thong',
          tieu_de: 'Lịch hẹn tư vấn mới',
          noi_dung: `Có lịch hẹn tư vấn mới cho bệnh nhân "${tenBenhNhan}" - ${loai_kham}`,
          link: `/admin/lich-kham`
        }).catch(err => console.error('Error sending notification to admins:', err));
        
        createNotificationForDieuDuong({
          loai: 'he_thong',
          tieu_de: 'Lịch hẹn tư vấn mới',
          noi_dung: `Có lịch hẹn tư vấn mới cho bệnh nhân "${tenBenhNhan}" - ${loai_kham}`,
          link: `/admin/lich-kham`
        }).catch(err => console.error('Error sending notification to dieu duong:', err));
      })
      .catch(err => console.error('Error fetching benh nhan for notification:', err));

    res.status(201).json({
      success: true,
      message: 'Tạo lịch khám thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLichKham = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { loai_kham, bac_si, thoi_gian, ket_qua, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (loai_kham !== undefined) {
      updateFields.push('loai_kham = ?');
      updateValues.push(loai_kham);
    }
    if (bac_si !== undefined) {
      updateFields.push('bac_si = ?');
      updateValues.push(bac_si);
    }
    if (thoi_gian !== undefined) {
      updateFields.push('thoi_gian = ?');
      updateValues.push(thoi_gian);
    }
    if (ket_qua !== undefined) {
      updateFields.push('ket_qua = ?');
      updateValues.push(ket_qua);
    }
    if (trang_thai !== undefined) {
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
      `UPDATE lich_kham SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLichKham = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM lich_kham WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa lịch khám thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Lịch hẹn tư vấn
export const createLichHenTuVan = async (req, res, next) => {
  try {
    const { ho_ten, so_dien_thoai, email, loai_dich_vu_quan_tam, ngay_mong_muon, gio_mong_muon, ghi_chu } = req.body;

    // Validate required fields
    if (!ho_ten || !so_dien_thoai || !email || !ngay_mong_muon || !gio_mong_muon) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Email, Ngày và Giờ mong muốn)'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Validate phone format (Vietnamese phone numbers)
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(so_dien_thoai.replace(/\s/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại không hợp lệ'
      });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(`${ngay_mong_muon}T${gio_mong_muon}`);
    const now = new Date();
    if (appointmentDate < now) {
      return res.status(400).json({
        success: false,
        message: 'Ngày và giờ hẹn không được ở quá khứ'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO lich_hen_tu_van (ho_ten, so_dien_thoai, email, loai_dich_vu_quan_tam, ngay_mong_muon, gio_mong_muon, ghi_chu, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'cho_xac_nhan', ?)`,
      [ho_ten, so_dien_thoai, email, loai_dich_vu_quan_tam || null, ngay_mong_muon, gio_mong_muon, ghi_chu || null, ngayTaoVN]
    );

    // Format ngày giờ đẹp hơn
    let ngayFormat = ngay_mong_muon;
    try {
      // Parse ngày từ format YYYY-MM-DD
      const dateParts = ngay_mong_muon.split('-');
      if (dateParts.length === 3) {
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        ngayFormat = date.toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (err) {
      // Nếu có lỗi, dùng format gốc
      console.warn('Error formatting date:', err);
    }
    const gioFormat = gio_mong_muon;

    // Gửi thông báo cho admin và marketing (không block response nếu có lỗi)
    createNotificationForAdminsAndMarketing({
      loai: 'cong_viec',
      tieu_de: 'Lịch hẹn tư vấn mới',
      noi_dung: `Khách hàng "${ho_ten}" (${so_dien_thoai}) đặt lịch tư vấn${loai_dich_vu_quan_tam ? ` về "${loai_dich_vu_quan_tam}"` : ''} vào ${ngayFormat} lúc ${gioFormat}`,
      link: `/admin/lich-hen-tu-van`
    }).catch(err => console.error('Error sending notification for lich hen tu van:', err));

    res.status(201).json({
      success: true,
      message: 'Đặt lịch hẹn tư vấn thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất!',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLichHenTuVan = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, trang_thai, start_date, end_date } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = 'SELECT * FROM lich_hen_tu_van WHERE 1=1';
    const params = [];

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    if (start_date && end_date) {
      query += ' AND DATE(ngay_mong_muon) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY ngay_mong_muon DESC, gio_mong_muon DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [lichHens] = await pool.execute(query, params);

    res.json({
      success: true,
      data: lichHens,
      pagination: {
        page: safePage,
        limit: limitValue
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateLichHenTuVan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai, ghi_chu } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }
    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu);
    }
    if (trang_thai === 'da_xac_nhan') {
      updateFields.push('nguoi_xac_nhan = ?');
      updateValues.push(req.user.id);
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
      `UPDATE lich_hen_tu_van SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch hẹn thành công'
    });
  } catch (error) {
    next(error);
  }
};

