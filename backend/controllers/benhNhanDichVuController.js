import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy tất cả dịch vụ của bệnh nhân
export const getAllBenhNhanDichVu = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_dich_vu, trang_thai } = req.query;

    let query = `
      SELECT bndv.*, 
             bn.ho_ten as ten_benh_nhan,
             dv.ten_dich_vu,
             dv.mo_ta_ngan,
             bgd.gia_thang, bgd.gia_quy, bgd.gia_nam
      FROM benh_nhan_dich_vu bndv
      JOIN benh_nhan bn ON bndv.id_benh_nhan = bn.id
      JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
      LEFT JOIN bang_gia_dich_vu bgd ON dv.id = bgd.id_dich_vu
      WHERE bn.da_xoa = 0 AND dv.da_xoa = 0
    `;
    const params = [];

    if (id_benh_nhan) {
      query += ' AND bndv.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    }

    if (id_dich_vu) {
      query += ' AND bndv.id_dich_vu = ?';
      params.push(id_dich_vu);
    }

    if (trang_thai) {
      query += ' AND bndv.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY bndv.ngay_bat_dau DESC, bndv.ngay_tao DESC';

    const [dichVus] = await pool.execute(query, params);

    res.json({
      success: true,
      data: dichVus
    });
  } catch (error) {
    next(error);
  }
};

// Lấy dịch vụ theo ID
export const getBenhNhanDichVuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [dichVus] = await pool.execute(
      `SELECT bndv.*, 
              bn.ho_ten as ten_benh_nhan,
              dv.ten_dich_vu,
              dv.mo_ta_ngan,
              dv.mo_ta_day_du,
              bgd.gia_thang, bgd.gia_quy, bgd.gia_nam
       FROM benh_nhan_dich_vu bndv
       JOIN benh_nhan bn ON bndv.id_benh_nhan = bn.id
       JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
       LEFT JOIN bang_gia_dich_vu bgd ON dv.id = bgd.id_dich_vu
       WHERE bndv.id = ?`,
      [id]
    );

    if (dichVus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.json({
      success: true,
      data: dichVus[0]
    });
  } catch (error) {
    next(error);
  }
};

// Tạo dịch vụ cho bệnh nhân
export const createBenhNhanDichVu = async (req, res, next) => {
  try {
    const {
      id_benh_nhan,
      id_dich_vu,
      ngay_bat_dau,
      ngay_ket_thuc,
      hinh_thuc_thanh_toan,
      thanh_tien,
      da_thanh_toan,
      cong_no_con_lai,
      ngay_thanh_toan_lan_cuoi,
      trang_thai
    } = req.body;

    if (!id_benh_nhan || !id_dich_vu || !ngay_bat_dau) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (id_benh_nhan, id_dich_vu, ngay_bat_dau)'
      });
    }

    // Kiểm tra bệnh nhân và dịch vụ có tồn tại không
    const [benhNhan] = await pool.execute(
      'SELECT id, tinh_trang_hien_tai FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id_benh_nhan]
    );

    if (benhNhan.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bệnh nhân không tồn tại'
      });
    }

    // Kiểm tra trạng thái bệnh nhân
    if (benhNhan[0].tinh_trang_hien_tai === 'Đã xuất viện') {
      return res.status(400).json({
        success: false,
        message: 'Bệnh nhân đã xuất viện, không thể thêm dịch vụ'
      });
    }

    const [dichVu] = await pool.execute(
      'SELECT id FROM dich_vu WHERE id = ? AND da_xoa = 0',
      [id_dich_vu]
    );

    if (dichVu.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Dịch vụ không tồn tại'
      });
    }

    // Lấy giá dịch vụ từ bang_gia_dich_vu
    const [bangGia] = await pool.execute(
      'SELECT gia_thang, gia_quy, gia_nam FROM bang_gia_dich_vu WHERE id_dich_vu = ?',
      [id_dich_vu]
    );

    // Tính thành tiền dựa trên hình thức thanh toán nếu chưa có
    let finalThanhTien = thanh_tien || 0;
    if (!thanh_tien && bangGia.length > 0) {
      const gia = bangGia[0];
      if (hinh_thuc_thanh_toan === 'thang') {
        finalThanhTien = gia.gia_thang || 0;
      } else if (hinh_thuc_thanh_toan === 'quy') {
        finalThanhTien = gia.gia_quy || 0;
      } else if (hinh_thuc_thanh_toan === 'nam') {
        finalThanhTien = gia.gia_nam || 0;
      }
    }

    // Tính công nợ còn lại
    const finalDaThanhToan = da_thanh_toan || 0;
    const finalCongNo = finalThanhTien - finalDaThanhToan;

    // Convert undefined to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // Luôn cập nhật ngày thanh toán lần cuối là ngày hiện tại khi tạo mới
    // (dù chưa thanh toán, thanh toán 1 phần hay thanh toán đủ)
    const finalNgayThanhToanLanCuoi = ngay_thanh_toan_lan_cuoi 
      ? sanitizeValue(ngay_thanh_toan_lan_cuoi) 
      : new Date().toISOString().split('T')[0];

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO benh_nhan_dich_vu 
       (id_benh_nhan, id_dich_vu, ngay_bat_dau, ngay_ket_thuc, hinh_thuc_thanh_toan, 
        thanh_tien, da_thanh_toan, cong_no_con_lai, ngay_thanh_toan_lan_cuoi, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_benh_nhan,
        id_dich_vu,
        ngay_bat_dau,
        sanitizeValue(ngay_ket_thuc),
        hinh_thuc_thanh_toan || 'thang',
        finalThanhTien || 0,
        finalDaThanhToan || 0,
        finalCongNo || 0,
        finalNgayThanhToanLanCuoi,
        trang_thai || 'dang_su_dung',
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm dịch vụ cho bệnh nhân thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật dịch vụ của bệnh nhân
export const updateBenhNhanDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_benh_nhan,
      id_dich_vu,
      ngay_bat_dau,
      ngay_ket_thuc,
      hinh_thuc_thanh_toan,
      thanh_tien,
      da_thanh_toan,
      cong_no_con_lai,
      ngay_thanh_toan_lan_cuoi,
      trang_thai
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_benh_nhan !== undefined) {
      const [benhNhan] = await pool.execute(
        'SELECT id FROM benh_nhan WHERE id = ? AND da_xoa = 0',
        [id_benh_nhan]
      );

      if (benhNhan.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Bệnh nhân không tồn tại'
        });
      }

      updateFields.push('id_benh_nhan = ?');
      updateValues.push(id_benh_nhan);
    }

    if (id_dich_vu !== undefined) {
      const [dichVu] = await pool.execute(
        'SELECT id FROM dich_vu WHERE id = ? AND da_xoa = 0',
        [id_dich_vu]
      );

      if (dichVu.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Dịch vụ không tồn tại'
        });
      }

      updateFields.push('id_dich_vu = ?');
      updateValues.push(id_dich_vu);
    }

    // Helper to sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    if (ngay_bat_dau !== undefined) {
      updateFields.push('ngay_bat_dau = ?');
      updateValues.push(ngay_bat_dau);
    }

    if (ngay_ket_thuc !== undefined) {
      updateFields.push('ngay_ket_thuc = ?');
      updateValues.push(sanitizeValue(ngay_ket_thuc));
    }

    if (hinh_thuc_thanh_toan !== undefined) {
      updateFields.push('hinh_thuc_thanh_toan = ?');
      updateValues.push(hinh_thuc_thanh_toan);
    }

    if (thanh_tien !== undefined) {
      updateFields.push('thanh_tien = ?');
      updateValues.push(thanh_tien || 0);
    }

    if (da_thanh_toan !== undefined) {
      updateFields.push('da_thanh_toan = ?');
      updateValues.push(da_thanh_toan || 0);
    }

    // Tự động tính lại công nợ nếu cập nhật thành tiền hoặc đã thanh toán
    if (thanh_tien !== undefined || da_thanh_toan !== undefined) {
      const [current] = await pool.execute(
        'SELECT thanh_tien, da_thanh_toan FROM benh_nhan_dich_vu WHERE id = ?',
        [id]
      );
      const finalThanhTien = thanh_tien !== undefined ? thanh_tien : (current[0]?.thanh_tien || 0);
      const finalDaThanhToan = da_thanh_toan !== undefined ? da_thanh_toan : (current[0]?.da_thanh_toan || 0);
      updateFields.push('cong_no_con_lai = ?');
      updateValues.push(Math.max(0, finalThanhTien - finalDaThanhToan));
    } else if (cong_no_con_lai !== undefined) {
      updateFields.push('cong_no_con_lai = ?');
      updateValues.push(cong_no_con_lai);
    }

    // Luôn cập nhật ngày thanh toán lần cuối khi sửa dịch vụ
    // Nếu không được cung cấp, dùng ngày hiện tại
    if (ngay_thanh_toan_lan_cuoi !== undefined) {
      updateFields.push('ngay_thanh_toan_lan_cuoi = ?');
      const finalNgayThanhToan = ngay_thanh_toan_lan_cuoi 
        ? sanitizeValue(ngay_thanh_toan_lan_cuoi) 
        : new Date().toISOString().split('T')[0];
      updateValues.push(finalNgayThanhToan);
    } else {
      // Nếu không được cung cấp trong request, vẫn cập nhật thành ngày hiện tại
      updateFields.push('ngay_thanh_toan_lan_cuoi = ?');
      updateValues.push(new Date().toISOString().split('T')[0]);
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
      `UPDATE benh_nhan_dich_vu SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa dịch vụ của bệnh nhân
export const deleteBenhNhanDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM benh_nhan_dich_vu WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa dịch vụ thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Thanh toán dịch vụ
export const thanhToanDichVu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { so_tien, ngay_thanh_toan } = req.body;

    if (!so_tien || so_tien <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền thanh toán phải lớn hơn 0'
      });
    }

    // Lấy thông tin hiện tại
    const [current] = await pool.execute(
      'SELECT da_thanh_toan, cong_no_con_lai FROM benh_nhan_dich_vu WHERE id = ?',
      [id]
    );

    if (current.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    const newDaThanhToan = (current[0].da_thanh_toan || 0) + so_tien;
    const newCongNo = Math.max(0, (current[0].cong_no_con_lai || 0) - so_tien);

    await pool.execute(
      `UPDATE benh_nhan_dich_vu 
       SET da_thanh_toan = ?, 
           cong_no_con_lai = ?, 
           ngay_thanh_toan_lan_cuoi = ?
       WHERE id = ?`,
      [
        newDaThanhToan,
        newCongNo,
        ngay_thanh_toan || new Date().toISOString().split('T')[0],
        id
      ]
    );

    res.json({
      success: true,
      message: 'Thanh toán thành công',
      data: {
        da_thanh_toan: newDaThanhToan,
        cong_no_con_lai: newCongNo
      }
    });
  } catch (error) {
    next(error);
  }
};

