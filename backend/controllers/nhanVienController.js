import pool from '../config/database.js';
import { passwordEncrypt } from '../utils/cryptoHelper.js';
import { buildLimitOffsetClause, sanitizeOffset, sanitizeLimit } from '../utils/queryHelpers.js';
import { createNotificationForAdmins } from '../services/notificationService.js';
import { getNowForDB, getTodayVN } from '../utils/dateUtils.js';

// Encryption key - có thể lấy từ env hoặc dùng key cố định
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'encryptionkey';

export const getAllNhanVien = async (req, res, next) => {
  try {
    // Nhận index (vị trí bắt đầu) và limit (mặc định 1000, -1 để lấy tất cả)
    const { index = 0, limit = 1000, search, vai_tro } = req.query;
    const offset = sanitizeOffset(index);
    // Nếu limit = -1, không áp dụng LIMIT (lấy tất cả)
    const limitValue = limit === '-1' || limit === -1 ? null : sanitizeLimit(limit, 1000);

    let query = `
      SELECT hsnv.id, tk.id as id_tai_khoan, tk.ho_ten, tk.email, tk.so_dien_thoai, tk.vai_tro, 
             tk.ngay_tao, tk.ngay_cap_nhat, tk.da_xoa,
             hsnv.id_tai_khoan, hsnv.chuc_vu, hsnv.bang_cap, hsnv.luong_co_ban, hsnv.gioi_thieu, 
             hsnv.chuyen_mon, hsnv.so_nam_kinh_nghiem, hsnv.danh_gia, 
             hsnv.so_benh_nhan_da_dieu_tri, hsnv.noi_cong_tac, hsnv.lich_lam_viec,
             hsnv.cccd, hsnv.so_bhyt, hsnv.dia_chi, hsnv.avatar
      FROM ho_so_nhan_vien hsnv
      INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
      WHERE tk.da_xoa = 0 AND tk.vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su')
    `;
    const params = [];

    if (search) {
      query += ' AND (tk.ho_ten LIKE ? OR tk.so_dien_thoai LIKE ? OR tk.email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (vai_tro) {
      query += ' AND tk.vai_tro = ?';
      params.push(vai_tro);
    }

    query += ' ORDER BY tk.ngay_tao DESC';
    // Nếu limitValue là null (limit = -1), không áp dụng LIMIT
    if (limitValue !== null) {
      query += buildLimitOffsetClause(limitValue, offset);
    } else {
      // Chỉ áp dụng OFFSET nếu có
      if (offset > 0) {
        query += ` OFFSET ${offset}`;
      }
    }

    const [nhanViens] = await pool.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM ho_so_nhan_vien hsnv
      INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
      WHERE tk.da_xoa = 0 AND tk.vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su')
    `;
    const countParams = [];

    if (search) {
      countQuery += ' AND (ho_ten LIKE ? OR so_dien_thoai LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (vai_tro) {
      countQuery += ' AND vai_tro = ?';
      countParams.push(vai_tro);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Tính toán page từ index để hiển thị (page = index / limit + 1)
    // Nếu limitValue là null (lấy tất cả), chỉ có 1 trang
    const currentPage = limitValue !== null ? Math.floor(offset / limitValue) + 1 : 1;
    const totalPages = limitValue !== null ? Math.ceil(total / limitValue) : 1;

    res.json({
      success: true,
      data: nhanViens,
      pagination: {
        index: offset,
        limit: limitValue || total, // Nếu limitValue là null, trả về total
        total,
        totalPages,
        currentPage
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getNhanVienById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [nhanViens] = await pool.execute(
      `SELECT hsnv.id, tk.id as id_tai_khoan, tk.ho_ten, tk.email, tk.so_dien_thoai, tk.vai_tro, 
              tk.ngay_tao, tk.ngay_cap_nhat, tk.da_xoa,
              hsnv.id_tai_khoan, hsnv.chuc_vu, hsnv.bang_cap, hsnv.luong_co_ban, hsnv.gioi_thieu, 
              hsnv.chuyen_mon, hsnv.so_nam_kinh_nghiem, hsnv.danh_gia, 
              hsnv.so_benh_nhan_da_dieu_tri, hsnv.noi_cong_tac, hsnv.lich_lam_viec,
              hsnv.cccd, hsnv.so_bhyt, hsnv.dia_chi, hsnv.avatar
       FROM ho_so_nhan_vien hsnv
       INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE hsnv.id = ? AND tk.da_xoa = 0`,
      [id]
    );

    if (nhanViens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    const nhanVien = nhanViens[0];
    const idTaiKhoan = nhanVien.id_tai_khoan;

    // Get KPI
    const [kpis] = await pool.execute(
      'SELECT * FROM kpi_nhan_vien WHERE id_tai_khoan = ? ORDER BY nam DESC, thang DESC LIMIT 12',
      [idTaiKhoan]
    );

    // Get lịch phân ca
    const [lichPhanCa] = await pool.execute(
      'SELECT * FROM lich_phan_ca WHERE id_tai_khoan = ? AND ngay >= CURDATE() ORDER BY ngay ASC LIMIT 30',
      [idTaiKhoan]
    );

    res.json({
      success: true,
      data: {
        ...nhanVien,
        kpi: kpis,
        lich_phan_ca: lichPhanCa
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNhanVien = async (req, res, next) => {
  try {
    const { ho_ten, so_dien_thoai, email, mat_khau, vai_tro, chuc_vu, bang_cap, luong_co_ban,
            gioi_thieu, chuyen_mon, so_nam_kinh_nghiem, danh_gia, so_benh_nhan_da_dieu_tri, 
            noi_cong_tac, lich_lam_viec, cccd, so_bhyt, dia_chi } = req.body;

    if (!ho_ten || !so_dien_thoai || !email || !vai_tro) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if phone or email exists
    const [existing] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE so_dien_thoai = ? OR email = ?',
      [so_dien_thoai, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại hoặc email đã được sử dụng'
      });
    }

    // Mật khẩu mặc định là 123456 nếu không được cung cấp
    const password = mat_khau || '123456';
    // Sử dụng cryptoHelper thay vì hashPassword
    const encryptedPassword = passwordEncrypt(password, ENCRYPTION_KEY);

    // Create account với trạng thái inactive
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, 'inactive', ?)`,
      [ho_ten, so_dien_thoai, email, encryptedPassword, vai_tro, ngayTaoVN]
    );

    // Create employee profile - luôn tạo hồ sơ nhân viên
    // Sanitize values - convert empty strings to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    const ngayTaoHoSoVN = getNowForDB();
    const ngayBatDauVN = getTodayVN();
    await pool.execute(
      `INSERT INTO ho_so_nhan_vien (id_tai_khoan, chuc_vu, bang_cap, luong_co_ban, gioi_thieu, 
       chuyen_mon, so_nam_kinh_nghiem, danh_gia, so_benh_nhan_da_dieu_tri, noi_cong_tac, lich_lam_viec, 
       cccd, so_bhyt, dia_chi, ngay_bat_dau, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [result.insertId, sanitizeValue(chuc_vu), sanitizeValue(bang_cap), sanitizeValue(luong_co_ban),
       sanitizeValue(gioi_thieu), sanitizeValue(chuyen_mon), so_nam_kinh_nghiem || null, 
       sanitizeValue(danh_gia), so_benh_nhan_da_dieu_tri || 0, sanitizeValue(noi_cong_tac), 
       sanitizeValue(lich_lam_viec), sanitizeValue(cccd), sanitizeValue(so_bhyt), sanitizeValue(dia_chi),
       ngayBatDauVN, ngayTaoHoSoVN]
    );

    // Gửi thông báo cho admin (không block response nếu có lỗi)
    createNotificationForAdmins({
      loai: 'he_thong',
      tieu_de: 'Nhân sự mới',
      noi_dung: `Nhân viên mới "${ho_ten}" đã được thêm vào hệ thống với vai trò ${vai_tro}`,
      link: `/admin/nhan-vien/${result.insertId}`
    }).catch(err => {
      console.error('Error sending notification (non-blocking):', err);
    });

    res.status(201).json({
      success: true,
      message: 'Thêm nhân viên thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateNhanVien = async (req, res, next) => {
  try {
    const { id } = req.params; // id là ho_so_nhan_vien.id
    const { ho_ten, email, so_dien_thoai, chuc_vu, bang_cap, luong_co_ban, trang_thai,
            gioi_thieu, chuyen_mon, so_nam_kinh_nghiem, danh_gia, so_benh_nhan_da_dieu_tri,
            noi_cong_tac, lich_lam_viec, cccd, so_bhyt, dia_chi } = req.body;

    // Lấy id_tai_khoan từ ho_so_nhan_vien
    const [hoSoNhanVien] = await pool.execute(
      'SELECT id_tai_khoan FROM ho_so_nhan_vien WHERE id = ?',
      [id]
    );

    if (hoSoNhanVien.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân viên'
      });
    }

    const idTaiKhoan = hoSoNhanVien[0].id_tai_khoan;

    // Update account
    const updateFields = [];
    const updateValues = [];

    if (ho_ten) {
      updateFields.push('ho_ten = ?');
      updateValues.push(ho_ten);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (so_dien_thoai !== undefined) {
      updateFields.push('so_dien_thoai = ?');
      updateValues.push(so_dien_thoai);
    }
    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }

    if (updateFields.length > 0) {
      const ngayCapNhatVN = getNowForDB();
      updateFields.push('ngay_cap_nhat = ?');
      updateValues.push(ngayCapNhatVN);
      updateValues.push(idTaiKhoan);
      await pool.execute(
        `UPDATE tai_khoan SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    // Update employee profile
    const [existingProfile] = await pool.execute(
      'SELECT id FROM ho_so_nhan_vien WHERE id = ?',
      [id]
    );

    const profileFields = [];
    const profileValues = [];

    if (chuc_vu !== undefined) {
      profileFields.push('chuc_vu = ?');
      profileValues.push(chuc_vu);
    }
    if (bang_cap !== undefined) {
      profileFields.push('bang_cap = ?');
      profileValues.push(bang_cap);
    }
    if (luong_co_ban !== undefined) {
      profileFields.push('luong_co_ban = ?');
      profileValues.push(luong_co_ban);
    }
    if (gioi_thieu !== undefined) {
      profileFields.push('gioi_thieu = ?');
      profileValues.push(gioi_thieu === '' ? null : gioi_thieu);
    }
    if (chuyen_mon !== undefined) {
      profileFields.push('chuyen_mon = ?');
      profileValues.push(chuyen_mon === '' ? null : chuyen_mon);
    }
    if (so_nam_kinh_nghiem !== undefined) {
      profileFields.push('so_nam_kinh_nghiem = ?');
      profileValues.push(so_nam_kinh_nghiem);
    }
    if (danh_gia !== undefined) {
      profileFields.push('danh_gia = ?');
      profileValues.push(danh_gia === '' ? null : danh_gia);
    }
    if (so_benh_nhan_da_dieu_tri !== undefined) {
      profileFields.push('so_benh_nhan_da_dieu_tri = ?');
      profileValues.push(so_benh_nhan_da_dieu_tri);
    }
    if (noi_cong_tac !== undefined) {
      profileFields.push('noi_cong_tac = ?');
      profileValues.push(noi_cong_tac === '' ? null : noi_cong_tac);
    }
    if (lich_lam_viec !== undefined) {
      profileFields.push('lich_lam_viec = ?');
      profileValues.push(lich_lam_viec === '' ? null : lich_lam_viec);
    }
    if (cccd !== undefined) {
      profileFields.push('cccd = ?');
      profileValues.push(cccd === '' ? null : cccd);
    }
    if (so_bhyt !== undefined) {
      profileFields.push('so_bhyt = ?');
      profileValues.push(so_bhyt === '' ? null : so_bhyt);
    }
    if (dia_chi !== undefined) {
      profileFields.push('dia_chi = ?');
      profileValues.push(dia_chi === '' ? null : dia_chi);
    }

    if (profileFields.length > 0) {
      if (existingProfile.length > 0) {
        const ngayCapNhatVN = getNowForDB();
        profileFields.push('ngay_cap_nhat = ?');
        profileValues.push(ngayCapNhatVN);
        profileValues.push(id);
        await pool.execute(
          `UPDATE ho_so_nhan_vien SET ${profileFields.join(', ')} WHERE id = ?`,
          profileValues
        );
      } else {
        const ngayTaoVN = getNowForDB();
        const ngayBatDauVN = getTodayVN();
        profileValues.unshift(idTaiKhoan);
        const fieldNames = profileFields.map(f => f.split(' = ')[0]);
        await pool.execute(
          `INSERT INTO ho_so_nhan_vien (id_tai_khoan, ${fieldNames.join(', ')}, ngay_bat_dau, ngay_tao)
           VALUES (?, ${profileFields.map(() => '?').join(', ')}, ?, ?)`,
          [...profileValues, ngayBatDauVN, ngayTaoVN]
        );
      }
    }

    // Lấy thông tin nhân viên để gửi thông báo
    const [nhanVien] = await pool.execute(
      'SELECT ho_ten FROM tai_khoan WHERE id = ?',
      [idTaiKhoan]
    );

    // Gửi thông báo cho admin khi có thay đổi quan trọng (không block response nếu có lỗi)
    if (nhanVien.length > 0 && (trang_thai !== undefined || luong_co_ban !== undefined || chuc_vu !== undefined)) {
      createNotificationForAdmins({
        loai: 'he_thong',
        tieu_de: 'Thay đổi thông tin nhân sự',
        noi_dung: `Thông tin nhân viên "${nhanVien[0].ho_ten}" đã được cập nhật`,
        link: `/admin/nhan-vien/${id}`
      }).catch(err => console.error('Error sending notification:', err));
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin nhân viên thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Phân ca làm việc
export const getLichPhanCa = async (req, res, next) => {
  try {
    const { start_date, end_date, ca, id_tai_khoan } = req.query;

    let query = `
      SELECT lpc.*, tk.ho_ten, tk.vai_tro
      FROM lich_phan_ca lpc
      JOIN tai_khoan tk ON lpc.id_tai_khoan = tk.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date && end_date) {
      query += ' AND DATE(lpc.ngay) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (ca) {
      query += ' AND lpc.ca = ?';
      params.push(ca);
    }

    if (id_tai_khoan) {
      query += ' AND lpc.id_tai_khoan = ?';
      params.push(id_tai_khoan);
    }

    query += ' ORDER BY lpc.ngay ASC, lpc.gio_bat_dau ASC';

    const [lichPhanCas] = await pool.execute(query, params);

    // Format dates to ensure YYYY-MM-DD format (avoid timezone issues)
    const formattedLichPhanCas = lichPhanCas.map(ca => {
      let formattedDate = ca.ngay;
      
      if (ca.ngay instanceof Date) {
        // Use local date components to avoid timezone issues
        const year = ca.ngay.getFullYear();
        const month = String(ca.ngay.getMonth() + 1).padStart(2, '0');
        const day = String(ca.ngay.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else if (typeof ca.ngay === 'string') {
        // Remove time part if exists (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
        formattedDate = ca.ngay.split(' ')[0].split('T')[0];
      }
      
      return {
        ...ca,
        ngay: formattedDate
      };
    });

    res.json({
      success: true,
      data: formattedLichPhanCas
    });
  } catch (error) {
    next(error);
  }
};

export const createLichPhanCa = async (req, res, next) => {
  try {
    const { id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai } = req.body;

    if (!id_tai_khoan || !ca || !ngay || !gio_bat_dau || !gio_ket_thuc) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin'
      });
    }

    // Validate id_tai_khoan exists
    const [taiKhoan] = await pool.execute(
      'SELECT id FROM tai_khoan WHERE id = ?',
      [id_tai_khoan]
    );

    if (taiKhoan.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'ID nhân viên không tồn tại'
      });
    }

    // Format ngay to YYYY-MM-DD if needed
    let formattedNgay = ngay;
    if (ngay instanceof Date) {
      const year = ngay.getFullYear();
      const month = String(ngay.getMonth() + 1).padStart(2, '0');
      const day = String(ngay.getDate()).padStart(2, '0');
      formattedNgay = `${year}-${month}-${day}`;
    } else if (typeof ngay === 'string') {
      // Remove time part if exists
      formattedNgay = ngay.split(' ')[0].split('T')[0];
    }

    // Format time to HH:mm:ss if needed
    // Input type="time" returns HH:mm (24h format), MySQL TIME needs HH:mm:ss
    let formattedGioBatDau = gio_bat_dau;
    let formattedGioKetThuc = gio_ket_thuc;
    
    // Ensure time format is HH:mm:ss
    if (formattedGioBatDau) {
      // Remove any AM/PM if present (shouldn't happen with type="time" but just in case)
      formattedGioBatDau = formattedGioBatDau.replace(/\s*(AM|PM)/i, '').trim();
      // If format is HH:mm, add :00
      if (formattedGioBatDau.length === 5 && formattedGioBatDau.match(/^\d{2}:\d{2}$/)) {
        formattedGioBatDau = `${formattedGioBatDau}:00`;
      }
      // If format is already HH:mm:ss, keep it
      if (formattedGioBatDau.length === 8 && formattedGioBatDau.match(/^\d{2}:\d{2}:\d{2}$/)) {
        // Already correct format
      }
    }
    
    if (formattedGioKetThuc) {
      // Remove any AM/PM if present
      formattedGioKetThuc = formattedGioKetThuc.replace(/\s*(AM|PM)/i, '').trim();
      // If format is HH:mm, add :00
      if (formattedGioKetThuc.length === 5 && formattedGioKetThuc.match(/^\d{2}:\d{2}$/)) {
        formattedGioKetThuc = `${formattedGioKetThuc}:00`;
      }
      // If format is already HH:mm:ss, keep it
      if (formattedGioKetThuc.length === 8 && formattedGioKetThuc.match(/^\d{2}:\d{2}:\d{2}$/)) {
        // Already correct format
      }
    }
    
    console.log('Time formatting:', { 
      original: { gio_bat_dau, gio_ket_thuc },
      formatted: { formattedGioBatDau, formattedGioKetThuc }
    });

    // Default trang_thai is 'du_kien' if not provided
    const finalTrangThai = trang_thai || 'du_kien';

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_tai_khoan, ca, formattedNgay, formattedGioBatDau, formattedGioKetThuc, finalTrangThai, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Phân ca thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error creating lich phan ca:', error);
    next(error);
  }
};

export const updateLichPhanCa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (ca !== undefined) {
      updateFields.push('ca = ?');
      updateValues.push(ca);
    }
    if (ngay !== undefined) {
      updateFields.push('ngay = ?');
      updateValues.push(ngay);
    }
    if (gio_bat_dau !== undefined) {
      updateFields.push('gio_bat_dau = ?');
      updateValues.push(gio_bat_dau);
    }
    if (gio_ket_thuc !== undefined) {
      updateFields.push('gio_ket_thuc = ?');
      updateValues.push(gio_ket_thuc);
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

    updateValues.push(id);

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    updateValues.push(id);

    await pool.execute(
      `UPDATE lich_phan_ca SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật lịch phân ca thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Chuyển ca sang người khác
export const chuyenCa = async (req, res, next) => {
  try {
    const { id } = req.params; // ID của phân ca cần chuyển
    const { id_tai_khoan_moi } = req.body; // ID nhân viên mới

    if (!id_tai_khoan_moi) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn nhân viên để chuyển ca'
      });
    }

    // Lấy thông tin ca cũ
    const [oldCa] = await pool.execute(
      'SELECT * FROM lich_phan_ca WHERE id = ?',
      [id]
    );

    if (oldCa.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy phân ca'
      });
    }

    const caInfo = oldCa[0];

    // Tạo phân ca mới cho nhân viên mới
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, 'du_kien', ?)`,
      [id_tai_khoan_moi, caInfo.ca, caInfo.ngay, caInfo.gio_bat_dau, caInfo.gio_ket_thuc, ngayTaoVN]
    );

    // Cập nhật ca cũ thành "vang"
    const ngayCapNhatVN = getNowForDB();
    await pool.execute(
      'UPDATE lich_phan_ca SET trang_thai = ?, ngay_cap_nhat = ? WHERE id = ?',
      ['vang', ngayCapNhatVN, id]
    );

    res.json({
      success: true,
      message: 'Chuyển ca thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLichPhanCa = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM lich_phan_ca WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch phân ca'
      });
    }

    res.json({
      success: true,
      message: 'Xóa lịch phân ca thành công'
    });
  } catch (error) {
    next(error);
  }
};

// KPI
export const createKPI = async (req, res, next) => {
  try {
    const { id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep, 
            so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu } = req.body;

    if (!id_tai_khoan || !thang || !nam) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Check if KPI already exists
    const [existing] = await pool.execute(
      'SELECT id FROM kpi_nhan_vien WHERE id_tai_khoan = ? AND thang = ? AND nam = ?',
      [id_tai_khoan, thang, nam]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'KPI cho tháng này đã tồn tại'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO kpi_nhan_vien 
       (id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep, 
        so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_tai_khoan, thang, nam, ty_le_hoan_thanh_cong_viec, so_loi_ghi_chep,
       so_lan_tre_ca, diem_danh_gia_quan_ly, ghi_chu]
    );

    res.status(201).json({
      success: true,
      message: 'Thêm KPI thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

