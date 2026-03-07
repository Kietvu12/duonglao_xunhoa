import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

// Lấy tất cả phân khu
export const getAllPhanKhu = async (req, res, next) => {
  try {
    const { search } = req.query;

    let query = 'SELECT * FROM phan_khu WHERE da_xoa = 0';
    const params = [];

    if (search) {
      query += ' AND ten_khu LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY ten_khu ASC';

    const [phanKhus] = await pool.execute(query, params);

    // Đếm số phòng trong mỗi phân khu
    for (let pk of phanKhus) {
      const [count] = await pool.execute(
        'SELECT COUNT(*) as total FROM phong WHERE id_phan_khu = ? AND da_xoa = 0',
        [pk.id]
      );
      pk.so_phong_thuc_te = count[0].total;
    }

    res.json({
      success: true,
      data: phanKhus
    });
  } catch (error) {
    next(error);
  }
};

// Lấy phân khu theo ID
export const getPhanKhuById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [phanKhus] = await pool.execute(
      'SELECT * FROM phan_khu WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (phanKhus.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân khu'
      });
    }

    const phanKhu = phanKhus[0];

    // Đếm số phòng
    const [count] = await pool.execute(
      'SELECT COUNT(*) as total FROM phong WHERE id_phan_khu = ? AND da_xoa = 0',
      [id]
    );
    phanKhu.so_phong_thuc_te = count[0].total;

    res.json({
      success: true,
      data: phanKhu
    });
  } catch (error) {
    next(error);
  }
};

// Tạo phân khu mới
export const createPhanKhu = async (req, res, next) => {
  try {
    const { ten_khu, mo_ta, so_tang, so_phong } = req.body;

    if (!ten_khu) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên khu'
      });
    }

    // Kiểm tra tên khu đã tồn tại chưa
    const [existing] = await pool.execute(
      'SELECT id FROM phan_khu WHERE ten_khu = ? AND da_xoa = 0',
      [ten_khu]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Tên khu đã tồn tại'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO phan_khu (ten_khu, mo_ta, so_tang, so_phong, ngay_tao)
       VALUES (?, ?, ?, ?, ?)`,
      [
        ten_khu || null,
        mo_ta || null,
        so_tang || null,
        so_phong || null,
        ngayTaoVN
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo phân khu thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật phân khu
export const updatePhanKhu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ten_khu, mo_ta, so_tang, so_phong } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ten_khu !== undefined) {
      // Kiểm tra tên khu trùng lặp (trừ chính nó)
      const [existing] = await pool.execute(
        'SELECT id FROM phan_khu WHERE ten_khu = ? AND id != ? AND da_xoa = 0',
        [ten_khu, id]
      );

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Tên khu đã tồn tại'
        });
      }

      updateFields.push('ten_khu = ?');
      updateValues.push(ten_khu || null);
    }

    if (mo_ta !== undefined) {
      updateFields.push('mo_ta = ?');
      updateValues.push(mo_ta || null);
    }

    if (so_tang !== undefined) {
      updateFields.push('so_tang = ?');
      updateValues.push(so_tang || null);
    }

    if (so_phong !== undefined) {
      updateFields.push('so_phong = ?');
      updateValues.push(so_phong || null);
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
      `UPDATE phan_khu SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật phân khu thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa phân khu (soft delete)
export const deletePhanKhu = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem có phòng nào đang sử dụng phân khu này không
    const [phongs] = await pool.execute(
      'SELECT COUNT(*) as total FROM phong WHERE id_phan_khu = ? AND da_xoa = 0',
      [id]
    );

    if (phongs[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa phân khu vì còn phòng đang sử dụng'
      });
    }

    await pool.execute(
      'UPDATE phan_khu SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa phân khu thành công'
    });
  } catch (error) {
    next(error);
  }
};

