import pool from '../config/database.js';
import { getNowForDB, getTodayVN } from '../utils/dateUtils.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import {
  DANH_MUC_VAT_TU_NGOAI_KHO,
  LOAI_BAN_GIAO,
  TRANG_THAI_TIEU_HAO,
  TRANG_THAI_TON,
  computeTrangThaiTon,
  isTrangThaiActiveStock
} from '../utils/tuThuocUtils.js';

const BASE_SELECT = `
  SELECT vt.*,
         bn.ho_ten as ten_benh_nhan,
         tk.ho_ten as ten_nguoi_ban_giao,
         nt.ho_ten as ten_nguoi_nha_gui,
         tk_nv.ho_ten as ten_dieu_duong_nhan,
         CASE
           WHEN vt.loai_ban_giao = 'nguoi_nha_to_dieu_duong' THEN nt.ho_ten
           ELSE tk.ho_ten
         END as ten_nguoi_gui,
         CASE
           WHEN vt.loai_ban_giao = 'nguoi_nha_to_dieu_duong' THEN tk_nv.ho_ten
           ELSE bn.ho_ten
         END as ten_nguoi_nhan,
         tt.ten_thuoc as ten_tu_thuoc,
         tt.don_vi_tinh as don_vi_tu_thuoc,
         plt.ten_loai as ten_phan_loai_tu_thuoc
  FROM vat_tu_tieu_hao vt
  LEFT JOIN benh_nhan bn ON vt.id_benh_nhan = bn.id
  LEFT JOIN ho_so_nhan_vien hsnv ON vt.id_nguoi_gui = hsnv.id
  LEFT JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
  LEFT JOIN nguoi_than_benh_nhan nt ON vt.id_nguoi_gui_nguoi_than = nt.id
  LEFT JOIN ho_so_nhan_vien hsnv_nhan ON vt.id_nguoi_nhan = hsnv_nhan.id
  LEFT JOIN tai_khoan tk_nv ON hsnv_nhan.id_tai_khoan = tk_nv.id
  LEFT JOIN tu_thuoc tt ON vt.id_tu_thuoc = tt.id
  LEFT JOIN phan_loai_thuoc plt ON tt.id_phan_loai = plt.id
`;

const getNhanVienIdFromUser = async (userId, connection) => {
  const [rows] = await connection.execute(
    'SELECT id FROM ho_so_nhan_vien WHERE id_tai_khoan = ?',
    [userId]
  );
  return rows[0]?.id || null;
};

const updateTuThuocStock = async (connection, tuThuocId, delta) => {
  const [rows] = await connection.execute(
    `SELECT id, ten_thuoc, don_vi_tinh, so_luong_ton, so_luong_toi_thieu, han_su_dung
     FROM tu_thuoc
     WHERE id = ? AND da_xoa = 0
     FOR UPDATE`,
    [tuThuocId]
  );

  if (rows.length === 0) {
    const error = new Error('Không tìm thấy thuốc/vật tư trong tủ thuốc');
    error.status = 404;
    throw error;
  }

  const item = rows[0];
  const currentTon = Number(item.so_luong_ton) || 0;
  const newTon = currentTon + delta;

  if (newTon < 0) {
    const error = new Error(
      `Tồn kho không đủ: ${item.ten_thuoc || 'vật tư'} chỉ còn ${currentTon} ${item.don_vi_tinh || ''}`.trim()
    );
    error.status = 400;
    throw error;
  }

  const trangThai = computeTrangThaiTon(
    newTon,
    item.so_luong_toi_thieu,
    item.han_su_dung
  );

  await connection.execute(
    `UPDATE tu_thuoc
     SET so_luong_ton = ?, trang_thai = ?, ngay_cap_nhat = ?
     WHERE id = ?`,
    [newTon, trangThai, getNowForDB(), tuThuocId]
  );

  return { ...item, so_luong_ton: newTon, trang_thai: trangThai };
};

const validateTuThuocForExport = (item, soLuong) => {
  const trangThai = computeTrangThaiTon(
    item.so_luong_ton,
    item.so_luong_toi_thieu,
    item.han_su_dung
  );

  if (trangThai === TRANG_THAI_TON.HET_HAN) {
    const error = new Error('Không xuất được vật tư đã quá hạn sử dụng');
    error.status = 400;
    throw error;
  }

  if (trangThai === TRANG_THAI_TON.HET_HANG || Number(item.so_luong_ton) < soLuong) {
    const error = new Error(
      `Tồn kho không đủ: ${item.ten_thuoc} chỉ còn ${item.so_luong_ton} ${item.don_vi_tinh || ''}`.trim()
    );
    error.status = 400;
    throw error;
  }
};

export const getDanhMucNgoaiKho = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: DANH_MUC_VAT_TU_NGOAI_KHO
    });
  } catch (error) {
    next(error);
  }
};

export const getVatTuTieuHaoHomNay = async (req, res, next) => {
  try {
    const { search } = req.query;
    const today = getTodayVN();

    let query = `${BASE_SELECT} WHERE vt.da_xoa = 0 AND DATE(vt.ngay_tao) = ?`;
    const params = [today];

    if (search?.trim()) {
      query += ' AND (vt.ten_vat_tu LIKE ? OR bn.ho_ten LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword);
    }

    query += ' ORDER BY vt.ngay_tao DESC';

    const [records] = await pool.execute(query, params);

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVatTuTieuHao = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      id_benh_nhan,
      id_tu_thuoc,
      trang_thai,
      loai_ban_giao,
      ngay,
      start_date,
      end_date,
      search
    } = req.query;

    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 50);
    const offset = (safePage - 1) * limitValue;

    let query = `${BASE_SELECT} WHERE vt.da_xoa = 0`;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND vt.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_tu_thuoc) {
      query += ' AND vt.id_tu_thuoc = ?';
      params.push(id_tu_thuoc);
    }

    if (trang_thai) {
      query += ' AND vt.trang_thai = ?';
      params.push(trang_thai);
    }

    if (loai_ban_giao) {
      query += ' AND vt.loai_ban_giao = ?';
      params.push(loai_ban_giao);
    }

    if (ngay) {
      query += ' AND DATE(vt.ngay_tao) = ?';
      params.push(ngay);
    } else if (start_date && end_date) {
      query += ' AND DATE(vt.ngay_tao) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    } else if (start_date) {
      query += ' AND DATE(vt.ngay_tao) >= ?';
      params.push(start_date);
    } else if (end_date) {
      query += ' AND DATE(vt.ngay_tao) <= ?';
      params.push(end_date);
    }

    if (search?.trim()) {
      query += ' AND (vt.ten_vat_tu LIKE ? OR bn.ho_ten LIKE ? OR tk.ho_ten LIKE ? OR nt.ho_ten LIKE ? OR tk_nv.ho_ten LIKE ?)';
      const keyword = `%${search.trim()}%`;
      params.push(keyword, keyword, keyword, keyword, keyword);
    }

    query += ' ORDER BY vt.ngay_tao DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [records] = await pool.execute(query, params);

    res.json({
      success: true,
      data: records,
      pagination: {
        page: safePage,
        limit: limitValue
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getVatTuTieuHaoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [records] = await pool.execute(
      `${BASE_SELECT} WHERE vt.id = ? AND vt.da_xoa = 0`,
      [id]
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi vật tư tiêu hao'
      });
    }

    res.json({
      success: true,
      data: records[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createVatTuTieuHao = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const {
      id_benh_nhan,
      loai_ban_giao = LOAI_BAN_GIAO.DIEU_DUONG_TO_BENH_NHAN,
      id_nguoi_gui_nguoi_than,
      id_nguoi_nhan,
      id_tu_thuoc,
      ten_vat_tu,
      so_luong,
      don_vi_tinh,
      ly_do
    } = req.body;

    const allowedLoai = Object.values(LOAI_BAN_GIAO);
    if (!allowedLoai.includes(loai_ban_giao)) {
      return res.status(400).json({
        success: false,
        message: 'Loại bàn giao không hợp lệ'
      });
    }

    if (!id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn người cao tuổi (NCT)'
      });
    }

    const soLuong = Number(so_luong);
    if (!Number.isFinite(soLuong) || soLuong <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng bàn giao phải lớn hơn 0'
      });
    }

    if (!id_tu_thuoc && !ten_vat_tu?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phải chọn vật tư từ tủ thuốc hoặc nhập tên vật tư'
      });
    }

    const [benhNhanRows] = await connection.execute(
      'SELECT id FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id_benh_nhan]
    );

    if (benhNhanRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người cao tuổi'
      });
    }

    let idNguoiGui = null;
    let idNguoiGuiNguoiThan = null;
    let idNguoiNhan = null;

    if (loai_ban_giao === LOAI_BAN_GIAO.NGUOI_NHA_TO_DIEU_DUONG) {
      if (!id_nguoi_gui_nguoi_than) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn người nhà bàn giao'
        });
      }
      if (!id_nguoi_nhan) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn điều dưỡng nhận'
        });
      }
      if (id_tu_thuoc) {
        return res.status(400).json({
          success: false,
          message: 'Bàn giao từ người nhà chỉ áp dụng cho vật tư ngoài kho'
        });
      }

      const [nguoiThanRows] = await connection.execute(
        'SELECT id FROM nguoi_than_benh_nhan WHERE id = ? AND id_benh_nhan = ? AND is_delete = 0',
        [id_nguoi_gui_nguoi_than, id_benh_nhan]
      );
      if (nguoiThanRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Người nhà không thuộc bệnh nhân đã chọn'
        });
      }

      const [nhanVienNhanRows] = await connection.execute(
        `SELECT hsnv.id
         FROM ho_so_nhan_vien hsnv
         INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
         WHERE hsnv.id = ? AND tk.da_xoa = 0
           AND tk.vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te')`,
        [id_nguoi_nhan]
      );
      if (nhanVienNhanRows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Điều dưỡng nhận không hợp lệ'
        });
      }

      idNguoiGuiNguoiThan = id_nguoi_gui_nguoi_than;
      idNguoiNhan = id_nguoi_nhan;
    } else {
      idNguoiGui = await getNhanVienIdFromUser(req.user.id, connection);
      if (!idNguoiGui) {
        return res.status(400).json({
          success: false,
          message: 'Tài khoản chưa liên kết hồ sơ nhân viên, không thể bàn giao vật tư'
        });
      }
    }

    let finalTenVatTu = ten_vat_tu?.trim() || null;
    let finalDonViTinh = don_vi_tinh?.trim() || null;
    let finalIdTuThuoc = id_tu_thuoc || null;

    await connection.beginTransaction();

    if (id_tu_thuoc) {
      const [tuThuocRows] = await connection.execute(
        `SELECT tt.*
         FROM tu_thuoc tt
         WHERE tt.id = ? AND tt.da_xoa = 0
         FOR UPDATE`,
        [id_tu_thuoc]
      );

      if (tuThuocRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thuốc/vật tư trong tủ thuốc'
        });
      }

      const tuThuoc = tuThuocRows[0];
      validateTuThuocForExport(tuThuoc, soLuong);

      finalTenVatTu = tuThuoc.ten_thuoc;
      finalDonViTinh = tuThuoc.don_vi_tinh;
      finalIdTuThuoc = tuThuoc.id;

      await updateTuThuocStock(connection, tuThuoc.id, -soLuong);
    } else {
      if (!finalDonViTinh) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập đơn vị tính cho vật tư ngoài kho'
        });
      }
    }

    const ngayTao = getNowForDB();
    const [result] = await connection.execute(
      `INSERT INTO vat_tu_tieu_hao (
        id_benh_nhan, loai_ban_giao, id_nguoi_gui, id_nguoi_gui_nguoi_than, id_nguoi_nhan,
        id_tu_thuoc, ten_vat_tu, so_luong, don_vi_tinh, ly_do, trang_thai, ngay_tao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        loai_ban_giao,
        idNguoiGui,
        idNguoiGuiNguoiThan,
        idNguoiNhan,
        finalIdTuThuoc,
        finalTenVatTu,
        soLuong,
        finalDonViTinh,
        ly_do || null,
        TRANG_THAI_TIEU_HAO.DA_SU_DUNG,
        ngayTao
      ]
    );

    await connection.commit();

    const [createdRows] = await pool.execute(
      `${BASE_SELECT} WHERE vt.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Bàn giao vật tư thành công',
      data: createdRows[0]
    });
  } catch (error) {
    await connection.rollback();
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  } finally {
    connection.release();
  }
};

export const updateVatTuTieuHaoTrangThai = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    const allowedStatuses = Object.values(TRANG_THAI_TIEU_HAO);
    if (!trang_thai || !allowedStatuses.includes(trang_thai)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT *
       FROM vat_tu_tieu_hao
       WHERE id = ? AND da_xoa = 0
       FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi vật tư tiêu hao'
      });
    }

    const record = rows[0];
    const oldActive = isTrangThaiActiveStock(record.trang_thai);
    const newActive = isTrangThaiActiveStock(trang_thai);

    if (record.id_tu_thuoc && oldActive && !newActive) {
      await updateTuThuocStock(connection, record.id_tu_thuoc, Number(record.so_luong) || 0);
    } else if (record.id_tu_thuoc && !oldActive && newActive) {
      const [tuThuocRows] = await connection.execute(
        `SELECT *
         FROM tu_thuoc
         WHERE id = ? AND da_xoa = 0
         FOR UPDATE`,
        [record.id_tu_thuoc]
      );

      if (tuThuocRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thuốc/vật tư trong tủ thuốc để trừ lại'
        });
      }

      validateTuThuocForExport(tuThuocRows[0], Number(record.so_luong) || 0);
      await updateTuThuocStock(connection, record.id_tu_thuoc, -(Number(record.so_luong) || 0));
    }

    await connection.execute(
      `UPDATE vat_tu_tieu_hao
       SET trang_thai = ?, ngay_cap_nhat = ?
       WHERE id = ?`,
      [trang_thai, getNowForDB(), id]
    );

    await connection.commit();

    const [updatedRows] = await pool.execute(
      `${BASE_SELECT} WHERE vt.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: updatedRows[0]
    });
  } catch (error) {
    await connection.rollback();
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  } finally {
    connection.release();
  }
};

export const deleteVatTuTieuHao = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT *
       FROM vat_tu_tieu_hao
       WHERE id = ? AND da_xoa = 0
       FOR UPDATE`,
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi vật tư tiêu hao'
      });
    }

    const record = rows[0];

    if (record.id_tu_thuoc && isTrangThaiActiveStock(record.trang_thai)) {
      await updateTuThuocStock(connection, record.id_tu_thuoc, Number(record.so_luong) || 0);
    }

    await connection.execute(
      'UPDATE vat_tu_tieu_hao SET da_xoa = 1, ngay_xoa = ? WHERE id = ?',
      [getNowForDB(), id]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Xóa bản ghi vật tư tiêu hao thành công'
    });
  } catch (error) {
    await connection.rollback();
    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  } finally {
    connection.release();
  }
};
