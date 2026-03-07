import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy tất cả phòng (Public - không có thông tin bệnh nhân)
export const getAllPhongPublic = async (req, res, next) => {
  try {
    const { id_phan_khu, id_loai_phong, search, trang_thai } = req.query;
    
    console.log('getAllPhongPublic - Query params:', { id_phan_khu, id_loai_phong, search, trang_thai });

    let query = `
      SELECT p.id, p.id_loai_phong, p.id_phan_khu, p.ten_phong, p.so_phong, 
             p.so_giuong, p.so_nguoi_toi_da, p.dien_tich, p.mo_ta, 
             p.trang_thai, p.anh_1, p.anh_2, p.anh_3,
             pk.ten_khu, lp.mo_ta as mo_ta_loai_phong, lp.anh_mau, lp.ten as ten_loai_phong
      FROM phong p
      JOIN phan_khu pk ON p.id_phan_khu = pk.id
      LEFT JOIN loai_phong lp ON p.id_loai_phong = lp.id
      WHERE p.da_xoa = 0
    `;
    const params = [];

    if (id_phan_khu) {
      query += ' AND p.id_phan_khu = ?';
      params.push(id_phan_khu);
    }

    if (id_loai_phong) {
      query += ' AND p.id_loai_phong = ?';
      params.push(id_loai_phong);
    }

    if (search) {
      query += ' AND (p.ten_phong LIKE ? OR p.so_phong LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (trang_thai) {
      query += ' AND p.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY pk.ten_khu, p.so_phong, p.ten_phong';

    console.log('getAllPhongPublic - SQL Query:', query);
    console.log('getAllPhongPublic - Params:', params);

    const [phongs] = await pool.execute(query, params);
    
    console.log('getAllPhongPublic - Found phongs:', phongs.length);
    if (phongs.length > 0) {
      console.log('getAllPhongPublic - First phong:', {
        id: phongs[0].id,
        id_loai_phong: phongs[0].id_loai_phong,
        ten_phong: phongs[0].ten_phong,
        anh_1: phongs[0].anh_1,
        anh_2: phongs[0].anh_2,
        anh_3: phongs[0].anh_3
      });
    }

    res.json({
      success: true,
      data: phongs
    });
  } catch (error) {
    console.error('getAllPhongPublic - Error:', error);
    next(error);
  }
};

// Lấy tất cả phòng
export const getAllPhong = async (req, res, next) => {
  try {
    const { id_phan_khu, id_loai_phong, search, trang_thai } = req.query;

    let query = `
      SELECT p.*, pk.ten_khu, lp.mo_ta as mo_ta_loai_phong, lp.anh_mau
      FROM phong p
      JOIN phan_khu pk ON p.id_phan_khu = pk.id
      LEFT JOIN loai_phong lp ON p.id_loai_phong = lp.id
      WHERE p.da_xoa = 0
    `;
    const params = [];

    if (id_phan_khu) {
      query += ' AND p.id_phan_khu = ?';
      params.push(id_phan_khu);
    }

    if (id_loai_phong) {
      query += ' AND p.id_loai_phong = ?';
      params.push(id_loai_phong);
    }

    if (search) {
      query += ' AND (p.ten_phong LIKE ? OR p.so_phong LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (trang_thai) {
      query += ' AND p.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY pk.ten_khu, p.so_phong, p.ten_phong';

    const [phongs] = await pool.execute(query, params);

    // Lấy danh sách bệnh nhân trong mỗi phòng
    for (let phong of phongs) {
      // Tìm bệnh nhân trong phòng này dựa trên id_phong
      // Chỉ lấy những bệnh nhân chưa kết thúc hoặc sẽ kết thúc trong tương lai (không lấy những người kết thúc trong ngày hôm nay)
      const [benhNhans] = await pool.execute(
        `SELECT pobn.*, bn.ho_ten, bn.id as id_benh_nhan, bn.ngay_sinh, bn.gioi_tinh
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())
         ORDER BY pobn.ngay_bat_dau_o DESC`,
        [phong.id]
      );
      phong.benh_nhans = benhNhans || [];
    }

    res.json({
      success: true,
      data: phongs
    });
  } catch (error) {
    next(error);
  }
};

// Lấy phòng theo ID
export const getPhongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [phongs] = await pool.execute(
      `SELECT p.*, pk.ten_khu, lp.mo_ta as mo_ta_loai_phong, lp.anh_mau
       FROM phong p
       JOIN phan_khu pk ON p.id_phan_khu = pk.id
       LEFT JOIN loai_phong lp ON p.id_loai_phong = lp.id
       WHERE p.id = ? AND p.da_xoa = 0`,
      [id]
    );

    if (phongs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phòng'
      });
    }

    const phong = phongs[0];

    // Lấy danh sách bệnh nhân trong phòng này
    // Chỉ lấy những bệnh nhân chưa kết thúc hoặc sẽ kết thúc trong tương lai (không lấy những người kết thúc trong ngày hôm nay)
    const [benhNhans] = await pool.execute(
      `SELECT pobn.*, bn.ho_ten, bn.id as id_benh_nhan, bn.ngay_sinh, bn.gioi_tinh
       FROM phong_o_benh_nhan pobn
       JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
       WHERE bn.da_xoa = 0 
         AND pobn.id_phong = ?
         AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())
       ORDER BY pobn.ngay_bat_dau_o DESC`,
      [id]
    );

    // Lấy thông tin dịch vụ cho mỗi bệnh nhân
    for (let benhNhan of benhNhans) {
      const [dichVuInfo] = await pool.execute(
        `SELECT bndv.*, dv.ten_dich_vu
         FROM benh_nhan_dich_vu bndv
         LEFT JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
         WHERE bndv.id_benh_nhan = ? 
           AND bndv.trang_thai = 'dang_su_dung'
         ORDER BY bndv.ngay_bat_dau DESC
         LIMIT 1`,
        [benhNhan.id_benh_nhan]
      );

      if (dichVuInfo.length > 0) {
        // Sử dụng ten_dich_vu làm loai_dich_vu (vì bảng dich_vu không có cột loai_dich_vu)
        benhNhan.loai_dich_vu = dichVuInfo[0].ten_dich_vu || null;
      }
    }

    phong.benh_nhans = benhNhans || [];

    res.json({
      success: true,
      data: phong
    });
  } catch (error) {
    next(error);
  }
};

// Tạo phòng mới
export const createPhong = async (req, res, next) => {
  try {
    const {
      id_loai_phong,
      id_phan_khu,
      ten_phong,
      so_phong,
      so_giuong,
      so_nguoi_toi_da,
      dien_tich,
      mo_ta,
      trang_thai,
      anh_1,
      anh_2,
      anh_3
    } = req.body;

    if (!id_phan_khu || !ten_phong) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Kiểm tra phân khu có tồn tại không
    const [phanKhu] = await pool.execute(
      'SELECT id FROM phan_khu WHERE id = ? AND da_xoa = 0',
      [id_phan_khu]
    );

    if (phanKhu.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Phân khu không tồn tại'
      });
    }

    // Kiểm tra số phòng đã tồn tại trong phân khu chưa
    if (so_phong) {
      const [existing] = await pool.execute(
        'SELECT id FROM phong WHERE id_phan_khu = ? AND so_phong = ? AND da_xoa = 0',
        [id_phan_khu, so_phong]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại trong phân khu này'
        });
      }
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO phong 
       (id_loai_phong, id_phan_khu, ten_phong, so_phong, so_giuong, so_nguoi_toi_da, dien_tich, mo_ta, trang_thai, anh_1, anh_2, anh_3, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_loai_phong || null,
        id_phan_khu || null,
        ten_phong || null,
        so_phong || null,
        so_giuong || null,
        so_nguoi_toi_da || 1,
        dien_tich || null,
        mo_ta || null,
        trang_thai || 'trong',
        anh_1 || null,
        anh_2 || null,
        anh_3 || null,
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo phòng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật phòng
export const updatePhong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      id_loai_phong,
      id_phan_khu,
      ten_phong,
      so_phong,
      so_giuong,
      so_nguoi_toi_da,
      dien_tich,
      mo_ta,
      trang_thai,
      anh_1,
      anh_2,
      anh_3
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (id_loai_phong !== undefined) {
      updateFields.push('id_loai_phong = ?');
      updateValues.push(id_loai_phong || null);
    }

    if (id_phan_khu !== undefined) {
      // Kiểm tra phân khu có tồn tại không
      const [phanKhu] = await pool.execute(
        'SELECT id FROM phan_khu WHERE id = ? AND da_xoa = 0',
        [id_phan_khu]
      );

      if (phanKhu.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Phân khu không tồn tại'
        });
      }

      updateFields.push('id_phan_khu = ?');
      updateValues.push(id_phan_khu || null);
    }

    if (ten_phong !== undefined) {
      updateFields.push('ten_phong = ?');
      updateValues.push(ten_phong || null);
    }

    if (so_phong !== undefined) {
      // Kiểm tra số phòng trùng lặp (trừ chính nó)
      const [existing] = await pool.execute(
        'SELECT id FROM phong WHERE id_phan_khu = ? AND so_phong = ? AND id != ? AND da_xoa = 0',
        [id_phan_khu || req.body.id_phan_khu, so_phong, id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Số phòng đã tồn tại trong phân khu này'
        });
      }

      updateFields.push('so_phong = ?');
      updateValues.push(so_phong || null);
    }

    if (so_giuong !== undefined) {
      updateFields.push('so_giuong = ?');
      updateValues.push(so_giuong || null);
    }

    if (so_nguoi_toi_da !== undefined) {
      updateFields.push('so_nguoi_toi_da = ?');
      updateValues.push(so_nguoi_toi_da || 1);
    }

    if (dien_tich !== undefined) {
      updateFields.push('dien_tich = ?');
      updateValues.push(dien_tich || null);
    }

    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta || null);
    }

    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai || null);
    }

    if (anh_1 !== undefined) {
      updateFields.push('anh_1 = ?');
      updateValues.push(anh_1 || null);
    }

    if (anh_2 !== undefined) {
      updateFields.push('anh_2 = ?');
      updateValues.push(anh_2 || null);
    }

    if (anh_3 !== undefined) {
      updateFields.push('anh_3 = ?');
      updateValues.push(anh_3 || null);
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
      `UPDATE phong SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa phòng (soft delete)
export const deletePhong = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem phòng có đang được sử dụng không (có bệnh nhân ở không)
    // Chỉ đếm những bệnh nhân chưa kết thúc hoặc sẽ kết thúc trong tương lai
    const [phongO] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM phong_o_benh_nhan pobn
       JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
       WHERE pobn.id_phong = ? 
         AND bn.da_xoa = 0
         AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
      [id]
    );

    await pool.execute(
      'UPDATE phong SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

