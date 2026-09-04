import pool from '../config/database.js';
import { formatDateForDB, getNowForDB, getTodayVN } from '../utils/dateUtils.js';
import {
  TRANG_THAI_SORT_ORDER,
  computeTrangThaiTon,
  canSelectFromTuThuoc,
  isSapHetHan
} from '../utils/tuThuocUtils.js';

const enrichTuThuocItem = (item) => {
  const trangThai = computeTrangThaiTon(
    item.so_luong_ton,
    item.so_luong_toi_thieu,
    item.han_su_dung
  );

  return {
    ...item,
    trang_thai: trangThai,
    co_the_chon: canSelectFromTuThuoc({ ...item, trang_thai: trangThai }),
    sap_het_han: isSapHetHan(item.han_su_dung)
  };
};

const sortTuThuocItems = (items) => {
  return [...items].sort((a, b) => {
    const orderA = TRANG_THAI_SORT_ORDER[a.trang_thai] || 99;
    const orderB = TRANG_THAI_SORT_ORDER[b.trang_thai] || 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.ten_thuoc || '').localeCompare(b.ten_thuoc || '', 'vi');
  });
};

export const getThongKeTuThuoc = async (req, res, next) => {
  try {
    const today = getTodayVN();
    const [rows] = await pool.execute(
      `SELECT id, so_luong_ton, so_luong_toi_thieu, han_su_dung
       FROM tu_thuoc
       WHERE da_xoa = 0`
    );

    const thongKe = {
      tong_so_muc: rows.length,
      tong_ton: 0,
      con_hang: 0,
      sap_het: 0,
      het_hang: 0,
      het_han: 0,
      sap_het_han_30_ngay: 0,
      can_chu_y: 0
    };

    for (const row of rows) {
      const trangThai = computeTrangThaiTon(
        row.so_luong_ton,
        row.so_luong_toi_thieu,
        row.han_su_dung,
        today
      );

      thongKe.tong_ton += Number(row.so_luong_ton) || 0;
      thongKe[trangThai] = (thongKe[trangThai] || 0) + 1;

      if (isSapHetHan(row.han_su_dung, 30, today)) {
        thongKe.sap_het_han_30_ngay += 1;
      }

      if (['sap_het', 'het_hang', 'het_han'].includes(trangThai)) {
        thongKe.can_chu_y += 1;
      }
    }

    res.json({
      success: true,
      data: thongKe
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTuThuoc = async (req, res, next) => {
  try {
    const { search, id_phan_loai, trang_thai } = req.query;

    let query = `
      SELECT tt.*, plt.ten_loai as ten_phan_loai
      FROM tu_thuoc tt
      LEFT JOIN phan_loai_thuoc plt ON tt.id_phan_loai = plt.id
      WHERE tt.da_xoa = 0
    `;
    const params = [];

    if (search?.trim()) {
      query += ' AND tt.ten_thuoc LIKE ?';
      params.push(`%${search.trim()}%`);
    }

    if (id_phan_loai) {
      query += ' AND tt.id_phan_loai = ?';
      params.push(id_phan_loai);
    }

    query += ' ORDER BY tt.ten_thuoc ASC';

    const [items] = await pool.execute(query, params);
    let enriched = items.map(enrichTuThuocItem);

    if (trang_thai) {
      enriched = enriched.filter((item) => item.trang_thai === trang_thai);
    }

    enriched = sortTuThuocItems(enriched);

    res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
};

export const getTuThuocById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [items] = await pool.execute(
      `SELECT tt.*, plt.ten_loai as ten_phan_loai
       FROM tu_thuoc tt
       LEFT JOIN phan_loai_thuoc plt ON tt.id_phan_loai = plt.id
       WHERE tt.id = ? AND tt.da_xoa = 0`,
      [id]
    );

    if (items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc/vật tư trong tủ thuốc'
      });
    }

    res.json({
      success: true,
      data: enrichTuThuocItem(items[0])
    });
  } catch (error) {
    next(error);
  }
};

export const createTuThuoc = async (req, res, next) => {
  try {
    const {
      id_phan_loai,
      ten_thuoc,
      don_vi_tinh,
      so_luong_ton,
      so_luong_toi_thieu,
      han_su_dung,
      chi_dinh,
      ghi_chu
    } = req.body;

    if (!ten_thuoc?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên thuốc/vật tư'
      });
    }

    const ton = Number(so_luong_ton) || 0;
    const nguong = Number(so_luong_toi_thieu) || 0;
    const hanSuDung = han_su_dung ? formatDateForDB(han_su_dung) : null;
    const trangThai = computeTrangThaiTon(ton, nguong, hanSuDung);
    const ngayTao = getNowForDB();

    const [result] = await pool.execute(
      `INSERT INTO tu_thuoc (
        id_phan_loai, ten_thuoc, don_vi_tinh, so_luong_ton, so_luong_toi_thieu,
        han_su_dung, chi_dinh, trang_thai, ghi_chu, ngay_tao
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_phan_loai || null,
        ten_thuoc.trim(),
        don_vi_tinh || null,
        ton,
        nguong,
        hanSuDung,
        chi_dinh || null,
        trangThai,
        ghi_chu || null,
        ngayTao
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm mục vào tủ thuốc thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTuThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_phan_loai,
      ten_thuoc,
      don_vi_tinh,
      so_luong_ton,
      so_luong_toi_thieu,
      han_su_dung,
      chi_dinh,
      ghi_chu
    } = req.body;

    const [existingRows] = await pool.execute(
      'SELECT * FROM tu_thuoc WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc/vật tư trong tủ thuốc'
      });
    }

    const existing = existingRows[0];
    const updateFields = [];
    const updateValues = [];

    if (id_phan_loai !== undefined) {
      updateFields.push('id_phan_loai = ?');
      updateValues.push(id_phan_loai || null);
    }
    if (ten_thuoc !== undefined) {
      updateFields.push('ten_thuoc = ?');
      updateValues.push(ten_thuoc?.trim() || existing.ten_thuoc);
    }
    if (don_vi_tinh !== undefined) {
      updateFields.push('don_vi_tinh = ?');
      updateValues.push(don_vi_tinh || null);
    }
    if (so_luong_ton !== undefined) {
      updateFields.push('so_luong_ton = ?');
      updateValues.push(Number(so_luong_ton) || 0);
    }
    if (so_luong_toi_thieu !== undefined) {
      updateFields.push('so_luong_toi_thieu = ?');
      updateValues.push(Number(so_luong_toi_thieu) || 0);
    }
    if (han_su_dung !== undefined) {
      updateFields.push('han_su_dung = ?');
      updateValues.push(han_su_dung ? formatDateForDB(han_su_dung) : null);
    }
    if (chi_dinh !== undefined) {
      updateFields.push('chi_dinh = ?');
      updateValues.push(chi_dinh || null);
    }
    if (ghi_chu !== undefined) {
      updateFields.push('ghi_chu = ?');
      updateValues.push(ghi_chu || null);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    const merged = {
      so_luong_ton: so_luong_ton !== undefined ? Number(so_luong_ton) || 0 : existing.so_luong_ton,
      so_luong_toi_thieu: so_luong_toi_thieu !== undefined
        ? Number(so_luong_toi_thieu) || 0
        : existing.so_luong_toi_thieu,
      han_su_dung: han_su_dung !== undefined
        ? (han_su_dung ? formatDateForDB(han_su_dung) : null)
        : existing.han_su_dung
    };

    const trangThai = computeTrangThaiTon(
      merged.so_luong_ton,
      merged.so_luong_toi_thieu,
      merged.han_su_dung
    );

    updateFields.push('trang_thai = ?');
    updateValues.push(trangThai);
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(getNowForDB());
    updateValues.push(id);

    await pool.execute(
      `UPDATE tu_thuoc SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật tủ thuốc thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTuThuoc = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ngayXoa = getNowForDB();

    const [result] = await pool.execute(
      'UPDATE tu_thuoc SET da_xoa = 1, ngay_xoa = ? WHERE id = ? AND da_xoa = 0',
      [ngayXoa, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thuốc/vật tư trong tủ thuốc'
      });
    }

    res.json({
      success: true,
      message: 'Xóa mục khỏi tủ thuốc thành công'
    });
  } catch (error) {
    next(error);
  }
};
