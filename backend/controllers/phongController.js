import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';

export const getAllPhong = async (req, res, next) => {
  try {
    const { id_phong, id_benh_nhan } = req.query;

    let query = `
      SELECT pobn.*, bn.ho_ten, p.ten_phong, p.so_phong, pk.ten_khu as ten_khu_phan_khu,
             p.so_phong as so_phong_thuc_te
      FROM phong_o_benh_nhan pobn
      JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
      LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
      LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
      WHERE bn.da_xoa = 0
    `;
    const params = [];

    // Nếu filter theo id_benh_nhan, lấy tất cả phòng (bao gồm cả đã kết thúc)
    // Nếu không, chỉ lấy phòng đang ở (chưa kết thúc hoặc sẽ kết thúc trong tương lai)
    if (id_benh_nhan) {
      query += ' AND pobn.id_benh_nhan = ?';
      params.push(id_benh_nhan);
    } else {
      query += ' AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())';
    }

    if (id_phong) {
      query += ' AND pobn.id_phong = ?';
      params.push(id_phong);
    }

    query += ' ORDER BY pobn.ngay_bat_dau_o DESC';

    const [phongs] = await pool.execute(query, params);

    // Format dữ liệu để tương thích với frontend
    const formattedPhongs = phongs.map(p => ({
      id: p.id,
      id_benh_nhan: p.id_benh_nhan,
      id_phong: p.id_phong,
      khu: p.ten_khu_phan_khu || p.ten_khu || '',
      phong: p.so_phong_thuc_te || p.so_phong || p.ten_phong || '',
      ten_phong: p.ten_phong || '',
      so_phong: p.so_phong_thuc_te || p.so_phong || '',
      so_phong_thuc_te: p.so_phong_thuc_te || p.so_phong || '',
      ten_khu_phan_khu: p.ten_khu_phan_khu || p.ten_khu || '',
      ngay_bat_dau_o: p.ngay_bat_dau_o,
      ngay_ket_thuc_o: p.ngay_ket_thuc_o,
      display: `${p.ten_khu_phan_khu || p.ten_khu || ''}-${p.so_phong_thuc_te || p.so_phong || p.ten_phong || ''}`
    }));

    res.json({
      success: true,
      data: formattedPhongs
    });
  } catch (error) {
    next(error);
  }
};

export const getPhongByBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy phòng đang ở (chưa kết thúc) với thông tin đầy đủ
    // Chỉ lấy những phòng chưa kết thúc (ngay_ket_thuc_o IS NULL) hoặc sẽ kết thúc trong tương lai (từ ngày mai trở đi)
    // KHÔNG lấy phòng đã kết thúc hôm nay (ngay_ket_thuc_o = CURDATE())
    const [phongs] = await pool.execute(
      `SELECT pobn.*, 
              p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
              pk.ten_khu as ten_khu_phan_khu
       FROM phong_o_benh_nhan pobn
       LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
       LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pobn.id_benh_nhan = ?
         AND (pobn.ngay_ket_thuc_o IS NULL OR DATE(pobn.ngay_ket_thuc_o) > CURDATE())
       ORDER BY pobn.ngay_bat_dau_o DESC
       LIMIT 1`,
      [id]
    );

    if (phongs.length === 0) {
      return res.json({
        success: true,
        data: null
      });
    }

    const phongData = phongs[0];
    
    // Format dữ liệu để tương thích với frontend
    const result = {
      id: phongData.id,
      id_benh_nhan: phongData.id_benh_nhan,
      id_phong: phongData.id_phong,
      khu: phongData.ten_khu_phan_khu || '',
      phong: phongData.so_phong_thuc_te || phongData.ten_phong || '',
      ten_phong: phongData.ten_phong || '',
      so_phong: phongData.so_phong_thuc_te || '',
      giuong: phongData.so_giuong ? `1` : '', // Có thể cải thiện sau
      ngay_bat_dau_o: phongData.ngay_bat_dau_o,
      ngay_ket_thuc_o: phongData.ngay_ket_thuc_o,
      display: `${phongData.ten_khu_phan_khu || ''}-${phongData.so_phong_thuc_te || phongData.ten_phong || ''}`
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const createPhong = async (req, res, next) => {
  try {
    const { id_benh_nhan, id_phong, ngay_bat_dau_o, ngay_ket_thuc_o } = req.body;

    if (!id_benh_nhan || !id_phong) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (id_benh_nhan, id_phong)'
      });
    }

    // Kiểm tra bệnh nhân có đang ở phòng nào chưa (chưa kết thúc)
    // Chỉ tìm những phòng chưa kết thúc hoặc sẽ kết thúc trong tương lai
    const [existing] = await pool.execute(
      `SELECT id, id_phong FROM phong_o_benh_nhan 
       WHERE id_benh_nhan = ? 
         AND (ngay_ket_thuc_o IS NULL OR ngay_ket_thuc_o > CURDATE())`,
      [id_benh_nhan]
    );

    // Nếu bệnh nhân đang có phòng, tự động kết thúc phòng cũ
    if (existing.length > 0) {
      const oldRoomId = existing[0].id;
      const oldPhongId = existing[0].id_phong;
      const ngayKetThuc = new Date().toISOString().split('T')[0];
      
      // Kết thúc phòng cũ
      await pool.execute(
        'UPDATE phong_o_benh_nhan SET ngay_ket_thuc_o = ? WHERE id = ?',
        [ngayKetThuc, oldRoomId]
      );

      // Cập nhật trạng thái phòng cũ (nếu không còn ai ở)
      // Loại trừ bệnh nhân vừa kết thúc (oldRoomId) khi đếm
      const [remainingInOldRoom] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND pobn.id != ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [oldPhongId, oldRoomId]
      );
      
      const remainingCount = remainingInOldRoom[0]?.count || 0;
      const oldRoomStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [oldRoomStatus, oldPhongId]
      );
    }

    // Kiểm tra phòng có tồn tại không
    const [phongInfo] = await pool.execute(
      'SELECT * FROM phong WHERE id = ? AND da_xoa = 0',
      [id_phong]
    );

    if (phongInfo.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Phòng không tồn tại'
      });
    }

    const phongData = phongInfo[0];

    // Đếm số bệnh nhân hiện tại trong phòng (chưa kết thúc)
    // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai (không đếm những người kết thúc trong ngày hôm nay)
    const [currentPatients] = await pool.execute(
      `SELECT COUNT(*) as count 
       FROM phong_o_benh_nhan pobn
       JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
       WHERE bn.da_xoa = 0 
         AND pobn.id_phong = ?
         AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
      [id_phong]
    );

    const currentCount = currentPatients[0]?.count || 0;
    const maxCapacity = phongData.so_nguoi_toi_da || 1;

    if (currentCount >= maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `Phòng đã đầy. Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể thêm bệnh nhân vào phòng này.`
      });
    }

    // Thêm bệnh nhân vào phòng
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      'INSERT INTO phong_o_benh_nhan (id_benh_nhan, id_phong, ngay_bat_dau_o, ngay_ket_thuc_o, ngay_tao) VALUES (?, ?, ?, ?, ?)',
      [
        id_benh_nhan, 
        id_phong, 
        ngay_bat_dau_o || new Date().toISOString().split('T')[0],
        ngay_ket_thuc_o || null,
        ngayTaoVN
      ]
    );

    // Cập nhật trạng thái phòng
    const newCount = currentCount + 1;
    const newStatus = newCount > 0 ? 'co_nguoi' : 'trong';
    
    await pool.execute(
      'UPDATE phong SET trang_thai = ? WHERE id = ?',
      [newStatus, id_phong]
    );

    res.status(201).json({
      success: true,
      message: 'Phân phòng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePhong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_phong, ngay_bat_dau_o, ngay_ket_thuc_o } = req.body;

    // Lấy thông tin phòng hiện tại
    const [currentRoom] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id = ?',
      [id]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân phòng'
      });
    }

    const oldIdPhong = currentRoom[0].id_phong;
    const newIdPhong = id_phong !== undefined ? id_phong : oldIdPhong;

    // Nếu đổi phòng, kiểm tra số người tối đa
    if (id_phong !== undefined && id_phong !== oldIdPhong) {
      // Kiểm tra phòng mới có tồn tại không
      const [phongInfo] = await pool.execute(
        'SELECT * FROM phong WHERE id = ? AND da_xoa = 0',
        [id_phong]
      );

      if (phongInfo.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Phòng không tồn tại'
        });
      }

      const phongData = phongInfo[0];
      // Đếm số bệnh nhân hiện tại trong phòng mới (không tính bệnh nhân đang đổi)
      // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai (không đếm những người kết thúc trong ngày hôm nay)
      const [currentPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id != ?
           AND pobn.id_phong = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [id, id_phong]
      );

      const currentCount = currentPatients[0]?.count || 0;
      const maxCapacity = phongData.so_nguoi_toi_da || 1;

      if (currentCount >= maxCapacity) {
        return res.status(400).json({
          success: false,
          message: `Phòng đã đầy. Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể chuyển bệnh nhân vào phòng này.`
        });
      }
    }

    const updateFields = [];
    const updateValues = [];

    if (id_phong !== undefined) {
      updateFields.push('id_phong = ?');
      updateValues.push(id_phong);
    }
    if (ngay_bat_dau_o !== undefined) {
      updateFields.push('ngay_bat_dau_o = ?');
      updateValues.push(ngay_bat_dau_o);
    }
    if (ngay_ket_thuc_o !== undefined) {
      updateFields.push('ngay_ket_thuc_o = ?');
      updateValues.push(ngay_ket_thuc_o);
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
      `UPDATE phong_o_benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Cập nhật trạng thái phòng cũ và mới
    if (id_phong !== undefined && id_phong !== oldIdPhong) {
      // Cập nhật phòng cũ
      // Loại trừ record đang được update (id) vì nó sẽ được chuyển sang phòng mới
      const [oldPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND pobn.id != ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [oldIdPhong, id]
      );
      const oldCount = oldPatients[0]?.count || 0;
      const oldStatus = oldCount > 0 ? 'co_nguoi' : 'trong';
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [oldStatus, oldIdPhong]
      );

      // Cập nhật phòng mới
      // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai (không đếm những người kết thúc trong ngày hôm nay)
      const [newPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [id_phong]
      );
      const newCount = newPatients[0]?.count || 0;
      const newStatus = newCount > 0 ? 'co_nguoi' : 'trong';
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, id_phong]
      );
    } else if (ngay_ket_thuc_o !== undefined) {
      // Nếu chỉ cập nhật ngày kết thúc (kết thúc phòng), cập nhật trạng thái phòng hiện tại
      const phongIdToUpdate = oldIdPhong;
      if (phongIdToUpdate) {
        // Đếm số bệnh nhân còn lại trong phòng (không tính bệnh nhân vừa kết thúc)
        // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai
        const [remainingPatients] = await pool.execute(
          `SELECT COUNT(*) as count 
           FROM phong_o_benh_nhan pobn
           JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
           WHERE bn.da_xoa = 0 
             AND pobn.id_phong = ?
             AND pobn.id != ?
             AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
          [phongIdToUpdate, id]
        );
        const remainingCount = remainingPatients[0]?.count || 0;
        const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
        
        await pool.execute(
          'UPDATE phong SET trang_thai = ? WHERE id = ?',
          [newStatus, phongIdToUpdate]
        );
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deletePhong = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Lấy thông tin phòng trước khi xóa
    const [currentRoom] = await pool.execute(
      'SELECT * FROM phong_o_benh_nhan WHERE id = ?',
      [id]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân phòng'
      });
    }

    const idPhong = currentRoom[0].id_phong;

    // Xóa phân phòng
    await pool.execute('DELETE FROM phong_o_benh_nhan WHERE id = ?', [id]);

    // Cập nhật trạng thái phòng
    // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai
    if (idPhong) {
      const [remainingPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [idPhong]
      );
      const remainingCount = remainingPatients[0]?.count || 0;
      const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
      
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, idPhong]
      );
    }

    res.json({
      success: true,
      message: 'Xóa bệnh nhân khỏi phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Xóa bệnh nhân khỏi phòng theo id_benh_nhan
export const deletePhongByBenhNhan = async (req, res, next) => {
  try {
    const { id_benh_nhan } = req.params;

    // Lấy thông tin phòng trước khi xóa
    // Chỉ tìm những phòng chưa kết thúc hoặc sẽ kết thúc trong tương lai
    const [currentRoom] = await pool.execute(
      `SELECT * FROM phong_o_benh_nhan 
       WHERE id_benh_nhan = ? 
         AND (ngay_ket_thuc_o IS NULL OR ngay_ket_thuc_o > CURDATE())`,
      [id_benh_nhan]
    );

    if (currentRoom.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bệnh nhân chưa có phòng được phân bổ hoặc đã kết thúc'
      });
    }

    const idPhong = currentRoom[0].id_phong;

    // Cập nhật ngày kết thúc thay vì xóa
    // Chỉ update những record chưa kết thúc hoặc sẽ kết thúc trong tương lai
    await pool.execute(
      'UPDATE phong_o_benh_nhan SET ngay_ket_thuc_o = CURDATE() WHERE id_benh_nhan = ? AND (ngay_ket_thuc_o IS NULL OR ngay_ket_thuc_o > CURDATE())',
      [id_benh_nhan]
    );

    // Cập nhật trạng thái phòng
    // Chỉ đếm những người chưa kết thúc hoặc sẽ kết thúc trong tương lai
    if (idPhong) {
      const [remainingPatients] = await pool.execute(
        `SELECT COUNT(*) as count 
         FROM phong_o_benh_nhan pobn
         JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
         WHERE bn.da_xoa = 0 
           AND pobn.id_phong = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
        [idPhong]
      );
      const remainingCount = remainingPatients[0]?.count || 0;
      const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
      
      await pool.execute(
        'UPDATE phong SET trang_thai = ? WHERE id = ?',
        [newStatus, idPhong]
      );
    }

    res.json({
      success: true,
      message: 'Kết thúc phân phòng thành công'
    });
  } catch (error) {
    next(error);
  }
};

