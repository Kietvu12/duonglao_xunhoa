import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotificationForAdmins, createNotificationForDieuDuong } from '../services/notificationService.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllTrieuChungBenhNhan = async (req, res, next) => {
  try {
    const { page = 1, limit = 100, id_benh_nhan, id_trieu_chung, start_date, end_date } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 100);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT tcbn.id, tcbn.id_trieu_chung, tcbn.id_benh_nhan, tcbn.ghi_chu,
             tcbn.ngay_tao, tcbn.ngay_cap_nhat,
             dstc.ten_trieu_chung,
             bn.ho_ten as ten_benh_nhan
      FROM trieu_chung_benh_nhan tcbn
      JOIN danh_sach_trieu_chung dstc ON tcbn.id_trieu_chung = dstc.id
      JOIN benh_nhan bn ON tcbn.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND tcbn.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_trieu_chung) {
      query += ' AND tcbn.id_trieu_chung = ?';
      params.push(id_trieu_chung);
    }

    if (start_date && end_date) {
      query += ' AND DATE(tcbn.ngay_tao) BETWEEN DATE(?) AND DATE(?)';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND DATE(tcbn.ngay_tao) >= DATE(?)';
      params.push(start_date);
    } else if (end_date) {
      query += ' AND DATE(tcbn.ngay_tao) <= DATE(?)';
      params.push(end_date);
    }

    query += ' ORDER BY tcbn.ngay_tao DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [trieuChungs] = await pool.execute(query, params);

    // Format datetime fields để đảm bảo trả về đúng định dạng
    const formattedTrieuChungs = trieuChungs.map(tc => ({
      ...tc,
      ngay_tao: tc.ngay_tao ? new Date(tc.ngay_tao).toISOString() : null,
      ngay_cap_nhat: tc.ngay_cap_nhat ? new Date(tc.ngay_cap_nhat).toISOString() : null
    }));

    res.json({
      success: true,
      data: formattedTrieuChungs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrieuChungBenhNhanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [trieuChungs] = await pool.execute(
      `SELECT tcbn.id, tcbn.id_trieu_chung, tcbn.id_benh_nhan, tcbn.ghi_chu,
              tcbn.ngay_tao, tcbn.ngay_cap_nhat,
              dstc.ten_trieu_chung,
              bn.ho_ten as ten_benh_nhan
       FROM trieu_chung_benh_nhan tcbn
       JOIN danh_sach_trieu_chung dstc ON tcbn.id_trieu_chung = dstc.id
       JOIN benh_nhan bn ON tcbn.id_benh_nhan = bn.id
       WHERE tcbn.id = ?`,
      [id]
    );

    if (trieuChungs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy triệu chứng bệnh nhân'
      });
    }

    // Format datetime fields
    const trieuChung = {
      ...trieuChungs[0],
      ngay_tao: trieuChungs[0].ngay_tao ? new Date(trieuChungs[0].ngay_tao).toISOString() : null,
      ngay_cap_nhat: trieuChungs[0].ngay_cap_nhat ? new Date(trieuChungs[0].ngay_cap_nhat).toISOString() : null
    };

    res.json({
      success: true,
      data: trieuChung
    });
  } catch (error) {
    next(error);
  }
};

export const createTrieuChungBenhNhan = async (req, res, next) => {
  try {
    const { id_trieu_chung, id_benh_nhan } = req.body;

    if (!id_trieu_chung || !id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Lấy thời gian VN hiện tại để lưu vào ngay_tao
    const ngayTaoVN = getNowForDB();
    
    const [result] = await pool.execute(
      `INSERT INTO trieu_chung_benh_nhan (id_trieu_chung, id_benh_nhan, ngay_tao)
       VALUES (?, ?, ?)`,
      [id_trieu_chung, id_benh_nhan, ngayTaoVN]
    );

    // Gửi thông báo cho admin và điều dưỡng (không block response nếu có lỗi)
    pool.execute('SELECT ho_ten FROM benh_nhan WHERE id = ?', [id_benh_nhan])
      .then(([benhNhans]) => {
        if (benhNhans.length > 0) {
          const tenBenhNhan = benhNhans[0].ho_ten;
          
          // Lấy tên triệu chứng
          return pool.execute(
            'SELECT ten_trieu_chung FROM danh_sach_trieu_chung WHERE id = ?',
            [id_trieu_chung]
          ).then(([trieuChungs]) => {
            const tenTrieuChung = trieuChungs.length > 0 
              ? trieuChungs[0].ten_trieu_chung 
              : 'Triệu chứng';
            
            // Format ngày giờ
            let ngayGioHienThi = '';
            const ngayGio = new Date(); // sử dụng thời gian tạo (ngay_tao)
            try {
              const date = new Date(ngayGio);
              ngayGioHienThi = date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            } catch (err) {
              ngayGioHienThi = ngayGio.toString();
            }

            const noiDung = `Bệnh nhân "${tenBenhNhan}" có triệu chứng "${tenTrieuChung}"${ngayGioHienThi ? ` vào ${ngayGioHienThi}` : ''}. Cần theo dõi.`;

            createNotificationForAdmins({
              loai: 'canh_bao',
              tieu_de: 'Triệu chứng mới',
              noi_dung: noiDung,
              link: `/admin/benh-nhan/${id_benh_nhan}`
            }).catch(err => console.error('Error sending notification to admins:', err));

            createNotificationForDieuDuong({
              loai: 'canh_bao',
              tieu_de: 'Triệu chứng mới',
              noi_dung: noiDung,
              link: `/admin/benh-nhan/${id_benh_nhan}`
            }).catch(err => console.error('Error sending notification to dieu duong:', err));
          });
        }
      })
      .catch(err => console.error('Error fetching data for notification:', err));

    res.status(201).json({
      success: true,
      message: 'Thêm triệu chứng bệnh nhân thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrieuChungBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_trieu_chung, id_benh_nhan } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_trieu_chung !== undefined) {
      updateFields.push('id_trieu_chung = ?');
      updateValues.push(id_trieu_chung);
    }

    if (id_benh_nhan !== undefined) {
      updateFields.push('id_benh_nhan = ?');
      updateValues.push(id_benh_nhan);
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
      `UPDATE trieu_chung_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật triệu chứng bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrieuChungBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM trieu_chung_benh_nhan WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa triệu chứng bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

