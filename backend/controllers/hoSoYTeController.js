import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy hồ sơ y tế của bệnh nhân
export const getHoSoYTeByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;

    const [hoSoYTe] = await pool.execute(
      `SELECT hsy.*, lb.ten_loai_benh_ly
       FROM ho_so_y_te_benh_nhan hsy
       LEFT JOIN loai_benh_ly lb ON hsy.id_loai_benh_ly = lb.id
       WHERE hsy.id_benh_nhan = ?`,
      [id_benh_nhan]
    );

    if (hoSoYTe.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: hoSoYTe[0]
    });
  } catch (error) {
    next(error);
  }
};

// Tạo hoặc cập nhật hồ sơ y tế
export const createOrUpdateHoSoYTe = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;
    const {
      id_loai_benh_ly,
      tien_su_benh,
      di_ung_thuoc,
      lich_su_phau_thuat,
      benh_ly_hien_tai,
      ghi_chu_dac_biet
    } = req.body;

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_benh_nhan'
      });
    }

    // Validate id_loai_benh_ly nếu có
    let finalIdLoaiBenhLy = null;
    if (id_loai_benh_ly && id_loai_benh_ly !== '' && !isNaN(id_loai_benh_ly)) {
      const idLoaiBenhLyNum = parseInt(id_loai_benh_ly);
      // Kiểm tra xem id_loai_benh_ly có tồn tại không
      const [loaiBenhLyCheck] = await pool.execute(
        'SELECT id FROM loai_benh_ly WHERE id = ?',
        [idLoaiBenhLyNum]
      );
      if (loaiBenhLyCheck.length > 0) {
        finalIdLoaiBenhLy = idLoaiBenhLyNum;
      }
    }

    // Kiểm tra xem đã có hồ sơ y tế chưa
    const [existing] = await pool.execute(
      'SELECT id FROM ho_so_y_te_benh_nhan WHERE id_benh_nhan = ?',
      [id_benh_nhan]
    );

    if (existing.length > 0) {
      // Cập nhật
      const ngayCapNhatVN = getNowForDB();
      await pool.execute(
        `UPDATE ho_so_y_te_benh_nhan 
         SET id_loai_benh_ly = ?, tien_su_benh = ?, di_ung_thuoc = ?, 
             lich_su_phau_thuat = ?, benh_ly_hien_tai = ?, ghi_chu_dac_biet = ?, ngay_cap_nhat = ?
         WHERE id_benh_nhan = ?`,
        [
          finalIdLoaiBenhLy,
          tien_su_benh || null,
          di_ung_thuoc || null,
          lich_su_phau_thuat || null,
          benh_ly_hien_tai || null,
          ghi_chu_dac_biet || null,
          ngayCapNhatVN,
          id_benh_nhan
        ]
      );

      res.json({
        success: true,
        message: 'Cập nhật hồ sơ y tế thành công',
        data: { id: existing[0].id }
      });
    } else {
      // Tạo mới
      const ngayTaoVN = getNowForDB();
      const [result] = await pool.execute(
        `INSERT INTO ho_so_y_te_benh_nhan 
         (id_benh_nhan, id_loai_benh_ly, tien_su_benh, di_ung_thuoc, 
          lich_su_phau_thuat, benh_ly_hien_tai, ghi_chu_dac_biet, ngay_tao)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id_benh_nhan,
          finalIdLoaiBenhLy,
          tien_su_benh || null,
          di_ung_thuoc || null,
          lich_su_phau_thuat || null,
          benh_ly_hien_tai || null,
          ghi_chu_dac_biet || null,
          ngayTaoVN
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Tạo hồ sơ y tế thành công',
        data: { id: result.insertId }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Xóa hồ sơ y tế
export const deleteHoSoYTe = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;

    await pool.execute(
      'DELETE FROM ho_so_y_te_benh_nhan WHERE id_benh_nhan = ?',
      [id_benh_nhan]
    );

    res.json({
      success: true,
      message: 'Xóa hồ sơ y tế thành công'
    });
  } catch (error) {
    next(error);
  }
};

