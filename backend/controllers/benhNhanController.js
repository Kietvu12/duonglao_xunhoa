import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeOffset, sanitizeLimit } from '../utils/queryHelpers.js';
import { evaluateChiSo } from '../utils/chiSoEvaluator.js';
import { getTodayVN, getNowForDB, formatDateTimeForDB } from '../utils/dateUtils.js';
import crypto from 'crypto';
import path from 'path';
import { createNotificationForAdmins, createNotificationForDieuDuong } from '../services/notificationService.js';

export const getAllBenhNhan = async (req, res, next) => {
  try {
    // Nhận index (vị trí bắt đầu) và limit (mặc định 1000, -1 để lấy tất cả)
    const { 
      index = 0, 
      limit = 1000, 
      search, 
      tinh_trang,
      gioi_tinh,
      id_phan_khu,
      id_phong,
      id_dich_vu,
      kha_nang_sinh_hoat,
      chua_duoc_gan // Filter bệnh nhân chưa được gán cho điều dưỡng nào
    } = req.query;

    const offset = sanitizeOffset(index);
    // Nếu limit = -1, không áp dụng LIMIT (lấy tất cả)
    const limitValue = limit === '-1' || limit === -1 ? null : sanitizeLimit(limit, 1000);

    let query = `
      SELECT DISTINCT b.*, 
             COUNT(DISTINCT nt.id) as so_nguoi_than,
             COUNT(DISTINCT pc.id) as so_dieu_duong,
             (SELECT url FROM media_benh_nhan WHERE id_benh_nhan = b.id AND loai = 'anh' ORDER BY thu_tu ASC, ngay_upload ASC LIMIT 1) as avatar_url
      FROM benh_nhan b
      LEFT JOIN nguoi_than_benh_nhan nt ON b.id = nt.id_benh_nhan
      LEFT JOIN phan_cong_cong_viec pc ON b.id = pc.id_benh_nhan
      LEFT JOIN phong_o_benh_nhan pobn ON b.id = pobn.id_benh_nhan
      LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
      LEFT JOIN benh_nhan_dich_vu bndv ON b.id = bndv.id_benh_nhan AND bndv.trang_thai = 'dang_su_dung'
      WHERE b.da_xoa = 0
    `;
    const params = [];

    // Filter bệnh nhân chưa được gán cho điều dưỡng nào
    if (chua_duoc_gan === 'true' || chua_duoc_gan === '1') {
      query += ` AND b.id NOT IN (
        SELECT DISTINCT id_benh_nhan 
        FROM dieu_duong_benh_nhan 
        WHERE trang_thai = 'dang_quan_ly'
      )`;
    }

    if (search) {
      query += ' AND (b.ho_ten LIKE ? OR b.cccd LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (tinh_trang) {
      query += ' AND b.tinh_trang_hien_tai = ?';
      params.push(tinh_trang);
    }

    if (gioi_tinh) {
      query += ' AND b.gioi_tinh = ?';
      params.push(gioi_tinh);
    }

    if (id_phan_khu) {
      query += ' AND p.id_phan_khu = ?';
      params.push(id_phan_khu);
    }

    if (id_phong) {
      query += ' AND pobn.id_phong = ? AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())';
      params.push(id_phong);
    }

    if (id_dich_vu) {
      query += ' AND bndv.id_dich_vu = ?';
      params.push(id_dich_vu);
    }

    if (kha_nang_sinh_hoat) {
      query += ' AND b.kha_nang_sinh_hoat = ?';
      params.push(kha_nang_sinh_hoat);
    }

    query += ' GROUP BY b.id ORDER BY b.ngay_tao DESC';
    // Nếu limitValue là null (limit = -1), không áp dụng LIMIT
    if (limitValue !== null) {
      query += buildLimitOffsetClause(limitValue, offset);
    } else {
      // Chỉ áp dụng OFFSET nếu có
      if (offset > 0) {
        query += ` OFFSET ${offset}`;
      }
    }

    const [benhNhans] = await pool.execute(query, params);

    // Lấy thông tin phòng chi tiết và dịch vụ đang sử dụng cho mỗi bệnh nhân
    for (let benhNhan of benhNhans) {
      const [phongInfo] = await pool.execute(
        `SELECT pobn.*, 
                p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
                pk.ten_khu as ten_khu_phan_khu
         FROM phong_o_benh_nhan pobn
         LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
         LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pobn.id_benh_nhan = ?
         ORDER BY pobn.ngay_bat_dau_o DESC`,
        [benhNhan.id]
      );
      
      // Format thông tin phòng
      benhNhan.phongs = phongInfo.map(p => ({
        id: p.id,
        id_phong: p.id_phong,
        khu: p.ten_khu_phan_khu || '',
        phong: p.so_phong_thuc_te || p.ten_phong || '',
        ten_phong: p.ten_phong || '',
        so_phong: p.so_phong_thuc_te || '',
        ngay_bat_dau_o: p.ngay_bat_dau_o,
        ngay_ket_thuc_o: p.ngay_ket_thuc_o,
        display: `${p.ten_khu_phan_khu || ''}-${p.so_phong_thuc_te || p.ten_phong || ''}`
      }));

      // Lấy dịch vụ đang sử dụng
      const [dichVuInfo] = await pool.execute(
        `SELECT bndv.*, dv.ten_dich_vu
         FROM benh_nhan_dich_vu bndv
         LEFT JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
         WHERE bndv.id_benh_nhan = ? 
           AND bndv.trang_thai = 'dang_su_dung'
         ORDER BY bndv.ngay_bat_dau DESC
         LIMIT 1`,
        [benhNhan.id]
      );

      if (dichVuInfo.length > 0) {
        benhNhan.dich_vu_dang_su_dung = {
          id: dichVuInfo[0].id,
          ten_dich_vu: dichVuInfo[0].ten_dich_vu,
          hinh_thuc_thanh_toan: dichVuInfo[0].hinh_thuc_thanh_toan,
          thanh_tien: dichVuInfo[0].thanh_tien,
          cong_no_con_lai: dichVuInfo[0].cong_no_con_lai
        };
      } else {
        benhNhan.dich_vu_dang_su_dung = null;
      }
    }

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT b.id) as total 
      FROM benh_nhan b
      LEFT JOIN phong_o_benh_nhan pobn ON b.id = pobn.id_benh_nhan
      LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
      LEFT JOIN benh_nhan_dich_vu bndv ON b.id = bndv.id_benh_nhan AND bndv.trang_thai = 'dang_su_dung'
      WHERE b.da_xoa = 0
    `;
    const countParams = [];

    // Filter bệnh nhân chưa được gán cho điều dưỡng nào
    if (chua_duoc_gan === 'true' || chua_duoc_gan === '1') {
      countQuery += ` AND b.id NOT IN (
        SELECT DISTINCT id_benh_nhan 
        FROM dieu_duong_benh_nhan 
        WHERE trang_thai = 'dang_quan_ly'
      )`;
    }

    if (search) {
      countQuery += ' AND (b.ho_ten LIKE ? OR b.cccd LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    if (tinh_trang) {
      countQuery += ' AND b.tinh_trang_hien_tai = ?';
      countParams.push(tinh_trang);
    }

    if (gioi_tinh) {
      countQuery += ' AND b.gioi_tinh = ?';
      countParams.push(gioi_tinh);
    }

    if (id_phan_khu) {
      countQuery += ' AND p.id_phan_khu = ?';
      countParams.push(id_phan_khu);
    }

    if (id_phong) {
      countQuery += ' AND pobn.id_phong = ? AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())';
      countParams.push(id_phong);
    }

    if (id_dich_vu) {
      countQuery += ' AND bndv.id_dich_vu = ?';
      countParams.push(id_dich_vu);
    }

    if (kha_nang_sinh_hoat) {
      countQuery += ' AND b.kha_nang_sinh_hoat = ?';
      countParams.push(kha_nang_sinh_hoat);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Tính toán page từ index để hiển thị (page = index / limit + 1)
    // Nếu limitValue là null (lấy tất cả), chỉ có 1 trang
    const currentPage = limitValue !== null ? Math.floor(offset / limitValue) + 1 : 1;
    const totalPages = limitValue !== null ? Math.ceil(total / limitValue) : 1;

    res.json({
      success: true,
      data: benhNhans,
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

export const getBenhNhanById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [benhNhans] = await pool.execute(
      `SELECT b.*, 
              (SELECT url FROM media_benh_nhan WHERE id_benh_nhan = b.id AND loai = 'anh' ORDER BY thu_tu ASC, ngay_upload ASC LIMIT 1) as avatar_url
       FROM benh_nhan b
       WHERE b.id = ? AND b.da_xoa = 0`,
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Get related data
    const [nguoiThan] = await pool.execute(
      'SELECT * FROM nguoi_than_benh_nhan WHERE id_benh_nhan = ? AND is_delete = 0',
      [id]
    );

    const [hoSoYTe] = await pool.execute(
      'SELECT * FROM ho_so_y_te_benh_nhan WHERE id_benh_nhan = ?',
      [id]
    );

    const [benhHienTai] = await pool.execute(
      `SELECT bh.*, tb.ten_benh 
       FROM benh_hien_tai bh
       JOIN thong_tin_benh tb ON bh.id_thong_tin_benh = tb.id
       WHERE bh.id_benh_nhan = ?`,
      [id]
    );


    const [phongInfo] = await pool.execute(
      `SELECT pobn.*, 
              p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
              pk.ten_khu as ten_khu_phan_khu
       FROM phong_o_benh_nhan pobn
       LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
       LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
       WHERE pobn.id_benh_nhan = ?
       ORDER BY pobn.ngay_bat_dau_o DESC`,
      [id]
    );
    
    // Format thông tin phòng
    const phongs = phongInfo.map(p => ({
      id: p.id,
      id_phong: p.id_phong,
      khu: p.ten_khu_phan_khu || '',
      phong: p.so_phong_thuc_te || p.ten_phong || '',
      ten_phong: p.ten_phong || '',
      so_phong: p.so_phong_thuc_te || '',
      so_phong_thuc_te: p.so_phong_thuc_te || '',
      ten_khu_phan_khu: p.ten_khu_phan_khu || '',
      ngay_bat_dau_o: p.ngay_bat_dau_o,
      ngay_ket_thuc_o: p.ngay_ket_thuc_o,
      display: `${p.ten_khu_phan_khu || ''}-${p.so_phong_thuc_te || p.ten_phong || ''}`
    }));

    // Lấy QR code của bệnh nhân (nếu có)
    const [qrCodes] = await pool.execute(
      `SELECT * FROM qr_benh_nhan 
       WHERE id_benh_nhan = ? 
       ORDER BY ngay_tao DESC 
       LIMIT 1`,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...benhNhans[0],
        nguoi_than: nguoiThan,
        ho_so_y_te: hoSoYTe[0] || null,
        benh_hien_tai: benhHienTai,
        phongs: phongs,
        qr_code: qrCodes.length > 0 ? qrCodes[0] : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createBenhNhan = async (req, res, next) => {
  try {
    const {
      ho_ten, ngay_sinh, gioi_tinh, cccd, dia_chi, nhom_mau, bhyt,
      phong, tinh_trang_hien_tai, kha_nang_sinh_hoat
    } = req.body;

    if (!ho_ten || !ngay_sinh || !gioi_tinh) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Convert empty strings and undefined to null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    // Set mặc định tinh_trang_hien_tai là "Đang điều trị" nếu không có giá trị
    const finalTinhTrang = tinh_trang_hien_tai && tinh_trang_hien_tai.trim() !== '' 
      ? tinh_trang_hien_tai 
      : 'Đang điều trị';

    const ngayTaoVN = getNowForDB();
    const ngayNhapVienVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO benh_nhan 
       (ho_ten, ngay_sinh, gioi_tinh, cccd, dia_chi, nhom_mau, bhyt, phong, 
        tinh_trang_hien_tai, kha_nang_sinh_hoat, ngay_nhap_vien, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ho_ten, 
        ngay_sinh, 
        gioi_tinh, 
        sanitizeValue(cccd), 
        sanitizeValue(dia_chi), 
        sanitizeValue(nhom_mau), 
        sanitizeValue(bhyt), 
        sanitizeValue(phong),
        finalTinhTrang, 
        sanitizeValue(kha_nang_sinh_hoat),
        ngayNhapVienVN,
        ngayTaoVN
      ]
    );

    const benhNhanId = result.insertId;

    // Xử lý upload ảnh avatar nếu có
    if (req.file) {
      try {
        let baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
          const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
          const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
          
          if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
            baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
          } else {
            baseUrl = `${protocol}://${host}`;
            if (baseUrl.includes('/api')) {
              baseUrl = baseUrl.replace('/api', '');
            }
          }
        }
        baseUrl = baseUrl.replace(/\/api\/?$/, '');
        
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
        const loai = imageExtensions.test(fileExt) ? 'anh' : 'video';
        const url = `${baseUrl}/uploads/${req.file.filename}`;
        
        await pool.execute(
          'INSERT INTO media_benh_nhan (id_benh_nhan, loai, url, mo_ta, thu_tu) VALUES (?, ?, ?, ?, ?)',
          [benhNhanId, loai, url, 'Ảnh đại diện', 0]
        );
      } catch (mediaError) {
        console.error('Lỗi khi lưu ảnh đại diện cho bệnh nhân:', mediaError);
        // Không fail việc tạo bệnh nhân nếu lỗi upload ảnh
      }
    }

    // Tự động tạo mã QR cho bệnh nhân mới
    try {
      await createQRCodeForBenhNhan(benhNhanId);
    } catch (qrError) {
      // Log lỗi nhưng không fail việc tạo bệnh nhân
      console.error('Lỗi khi tạo QR code cho bệnh nhân:', qrError);
    }

    // Gửi thông báo cho admin và điều dưỡng (không block response nếu có lỗi)
    createNotificationForAdmins({
      loai: 'he_thong',
      tieu_de: 'Bệnh nhân mới',
      noi_dung: `Bệnh nhân mới "${ho_ten}" đã được thêm vào hệ thống`,
      link: `/admin/benh-nhan/${benhNhanId}`
    }).catch(err => console.error('Error sending notification to admins:', err));
    
    createNotificationForDieuDuong({
      loai: 'he_thong',
      tieu_de: 'Bệnh nhân mới',
      noi_dung: `Bệnh nhân mới "${ho_ten}" đã được thêm vào hệ thống`,
      link: `/admin/benh-nhan/${benhNhanId}`
    }).catch(err => console.error('Error sending notification to dieu duong:', err));

    res.status(201).json({
      success: true,
      message: 'Thêm bệnh nhân thành công',
      data: { id: benhNhanId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if patient exists
    const [benhNhans] = await pool.execute(
      'SELECT id, tinh_trang_hien_tai FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    const allowedFields = [
      'ho_ten', 'ngay_sinh', 'gioi_tinh', 'cccd', 'dia_chi', 'nhom_mau',
      'bhyt', 'phong', 'tinh_trang_hien_tai', 'kha_nang_sinh_hoat', 'anh_dai_dien', 'ngay_nhap_vien'
    ];

    const updateFields = [];
    const updateValues = [];

    // Helper to sanitize values
    const sanitizeValue = (value) => {
      if (value === undefined || value === '') {
        return null;
      }
      return value;
    };

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(sanitizeValue(updateData[field]));
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    // Xử lý upload ảnh avatar nếu có
    if (req.file) {
      try {
        let baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
          const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
          const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
          
          if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
            baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
          } else {
            baseUrl = `${protocol}://${host}`;
            if (baseUrl.includes('/api')) {
              baseUrl = baseUrl.replace('/api', '');
            }
          }
        }
        baseUrl = baseUrl.replace(/\/api\/?$/, '');
        
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
        const loai = imageExtensions.test(fileExt) ? 'anh' : 'video';
        const url = `${baseUrl}/uploads/${req.file.filename}`;
        
        // Xóa avatar cũ (nếu có) - tìm media có thu_tu = 0 và loai = 'anh'
        const [oldMedia] = await pool.execute(
          'SELECT id FROM media_benh_nhan WHERE id_benh_nhan = ? AND thu_tu = 0 AND loai = ?',
          [id, 'anh']
        );
        
        if (oldMedia.length > 0) {
          // Cập nhật media cũ
          await pool.execute(
            'UPDATE media_benh_nhan SET url = ?, mo_ta = ? WHERE id = ?',
            [url, 'Ảnh đại diện', oldMedia[0].id]
          );
        } else {
          // Tạo mới nếu chưa có
          await pool.execute(
            'INSERT INTO media_benh_nhan (id_benh_nhan, loai, url, mo_ta, thu_tu) VALUES (?, ?, ?, ?, ?)',
            [id, loai, url, 'Ảnh đại diện', 0]
          );
        }
      } catch (mediaError) {
        console.error('Lỗi khi cập nhật ảnh đại diện cho bệnh nhân:', mediaError);
        // Không fail việc update bệnh nhân nếu lỗi upload ảnh
      }
    }

    // Kiểm tra nếu tinh_trang_hien_tai thay đổi sang "đã xuất viện"
    const newTinhTrang = updateData.tinh_trang_hien_tai;
    const oldTinhTrang = benhNhans[0].tinh_trang_hien_tai;
    const isChuyenTuXuatVien = oldTinhTrang && (
      oldTinhTrang.toLowerCase().includes('xuất viện') || 
      oldTinhTrang.toLowerCase().includes('xuat vien') ||
      oldTinhTrang.toLowerCase().includes('đã xuất viện') ||
      oldTinhTrang.toLowerCase().includes('da xuat vien')
    );
    const isChuyenSangXuatVien = newTinhTrang && (
      newTinhTrang.toLowerCase().includes('xuất viện') || 
      newTinhTrang.toLowerCase().includes('xuat vien') ||
      newTinhTrang.toLowerCase().includes('đã xuất viện') ||
      newTinhTrang.toLowerCase().includes('da xuat vien')
    );

    const ngayCapNhatVN = getNowForDB();
    updateFields.push('ngay_cap_nhat = ?');
    updateValues.push(ngayCapNhatVN);
    // Thêm id vào cuối để dùng trong WHERE clause
    updateValues.push(id);

    await pool.execute(
      `UPDATE benh_nhan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Khi chuyển từ "Đã xuất viện" sang trạng thái khác (ví dụ: "Điều trị")
    // KHÔNG tự động khôi phục phòng, chỉ giữ nguyên lịch sử phòng
    // Người dùng sẽ cần phân phòng mới thủ công

    // Nếu tinh_trang_hien_tai thay đổi sang "đã xuất viện", tự động cập nhật các quan hệ liên quan
    if (isChuyenSangXuatVien) {
      const ngayKetThuc = getTodayVN();

      // 1. Cập nhật tất cả quan hệ quản lý (dieu_duong_benh_nhan) sang ket_thuc
      const [quanLyList] = await pool.execute(
        `SELECT id FROM dieu_duong_benh_nhan 
         WHERE id_benh_nhan = ? AND trang_thai = 'dang_quan_ly'`,
        [id]
      );

      if (quanLyList.length > 0) {
        await pool.execute(
          `UPDATE dieu_duong_benh_nhan 
           SET trang_thai = 'ket_thuc', 
               ngay_ket_thuc = ?
           WHERE id_benh_nhan = ? AND trang_thai = 'dang_quan_ly'`,
          [ngayKetThuc, id]
        );
      }

      // 2. Kết thúc tất cả dịch vụ đang sử dụng (benh_nhan_dich_vu)
      await pool.execute(
        `UPDATE benh_nhan_dich_vu 
         SET trang_thai = 'ket_thuc', 
             ngay_ket_thuc = ?
         WHERE id_benh_nhan = ? AND trang_thai = 'dang_su_dung'`,
        [ngayKetThuc, id]
      );

      // 3. Kết thúc phòng đang ở (phong_o_benh_nhan)
      const [phongList] = await pool.execute(
        `SELECT id, id_phong FROM phong_o_benh_nhan 
         WHERE id_benh_nhan = ? 
           AND (ngay_ket_thuc_o IS NULL OR ngay_ket_thuc_o > CURDATE())`,
        [id]
      );

      if (phongList.length > 0) {
        // Cập nhật ngày kết thúc cho tất cả phòng đang ở
        await pool.execute(
          `UPDATE phong_o_benh_nhan 
           SET ngay_ket_thuc_o = ?
           WHERE id_benh_nhan = ? 
             AND (ngay_ket_thuc_o IS NULL OR ngay_ket_thuc_o > CURDATE())`,
          [ngayKetThuc, id]
        );

        // Cập nhật trạng thái phòng cho từng phòng
        for (let phong of phongList) {
          if (phong.id_phong) {
            const [remainingPatients] = await pool.execute(
              `SELECT COUNT(*) as count 
               FROM phong_o_benh_nhan pobn
               JOIN benh_nhan bn ON pobn.id_benh_nhan = bn.id
               WHERE bn.da_xoa = 0 
                 AND pobn.id_phong = ?
                 AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())`,
              [phong.id_phong]
            );
            const remainingCount = remainingPatients[0]?.count || 0;
            const newStatus = remainingCount > 0 ? 'co_nguoi' : 'trong';
            
            await pool.execute(
              'UPDATE phong SET trang_thai = ? WHERE id = ?',
              [newStatus, phong.id_phong]
            );
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE benh_nhan SET da_xoa = 1, ngay_xoa = NOW() WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Xóa bệnh nhân thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API HUYẾT ÁP
// ============================================

export const getHuyetAp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30, page = 1, index } = req.query;

    // Xử lý pagination: nhận page hoặc tính từ index
    let pageValue = parseInt(page, 10);
    if (index !== undefined) {
      const indexValue = parseInt(index, 10);
      const limitValue = parseInt(limit, 10) || 30;
      pageValue = Math.floor(indexValue / limitValue) + 1;
    }
    if (isNaN(pageValue) || pageValue < 1) {
      pageValue = 1;
    }

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    limitValue = Math.max(1, Math.floor(limitValue));

    // Tính offset
    const offset = (pageValue - 1) * limitValue;

    // Query để đếm tổng số bản ghi
    let countQuery = `SELECT COUNT(*) as total FROM huyet_ap WHERE id_benh_nhan = ?`;
    const countParams = [id];

    if (start_date && end_date) {
      countQuery += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Query để lấy dữ liệu với pagination
    let query = `SELECT * FROM huyet_ap WHERE id_benh_nhan = ?`;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ` ORDER BY thoi_gian_do DESC LIMIT ${limitValue} OFFSET ${offset}`;

    const [data] = await pool.execute(query, params);

    // Tính toán pagination info
    const totalPages = Math.ceil(total / limitValue);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageValue,
        itemsPerPage: limitValue,
        totalItems: total,
        totalPages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createHuyetAp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tam_thu, tam_truong, thoi_gian_do, vi_tri_do, tu_the_khi_do,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao
    } = req.body;

    // Helper function để chuyển undefined và empty string thành null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      return value;
    };

    // Đánh giá tự động dựa trên cấu hình
    let evaluation = null;
    if (tam_thu !== undefined && tam_truong !== undefined) {
      evaluation = await evaluateChiSo('Huyết áp', { tam_thu, tam_truong }, id_cau_hinh_chi_so_canh_bao);
    }

    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    const finalMucDo = evaluation?.muc_do || muc_do || 'binh_thuong';
    const finalNoiDungCanhBao = evaluation?.noi_dung_canh_bao || noi_dung_canh_bao;
    const finalDanhGiaChiTiet = evaluation?.danh_gia_chi_tiet || null;
    const finalIdCauHinh = evaluation?.id_cau_hinh || id_cau_hinh_chi_so_canh_bao || null;

    // Sanitize tất cả các giá trị trước khi insert
    const sanitizedValues = [
      id,
      sanitizeValue(tam_thu),
      sanitizeValue(tam_truong),
      sanitizeValue(thoi_gian_do) || getNowForDB(),
      sanitizeValue(vi_tri_do),
      sanitizeValue(tu_the_khi_do),
      sanitizeValue(ghi_chu),
      finalMucDo,
      sanitizeValue(finalNoiDungCanhBao),
      finalIdCauHinh,
      finalDanhGiaChiTiet
    ];

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
      await pool.execute(
        `INSERT INTO huyet_ap 
         (id_benh_nhan, tam_thu, tam_truong, thoi_gian_do, vi_tri_do, tu_the_khi_do, ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, danh_gia_chi_tiet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, thử insert không có các cột đó
      if (error.message.includes('Unknown column')) {
        const sanitizedValuesFallback = [
          id,
          sanitizeValue(tam_thu),
          sanitizeValue(tam_truong),
          sanitizeValue(thoi_gian_do) || getNowForDB(),
          sanitizeValue(vi_tri_do),
          sanitizeValue(tu_the_khi_do),
          sanitizeValue(ghi_chu),
          finalMucDo,
          sanitizeValue(finalNoiDungCanhBao)
        ];
        await pool.execute(
          `INSERT INTO huyet_ap 
           (id_benh_nhan, tam_thu, tam_truong, thoi_gian_do, vi_tri_do, tu_the_khi_do, ghi_chu, muc_do, noi_dung_canh_bao)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizedValuesFallback
        );
      } else {
        throw error;
      }
    }

    // Gửi thông báo nếu chỉ số nguy hiểm (không block response nếu có lỗi)
    if (finalMucDo === 'nguy_hiem' || finalMucDo === 'canh_bao') {
      pool.execute('SELECT ho_ten FROM benh_nhan WHERE id = ?', [id])
        .then(([benhNhan]) => {
          if (benhNhan.length > 0) {
            const tenBenhNhan = benhNhan[0].ho_ten;
            const loaiThongBao = finalMucDo === 'nguy_hiem' ? 'canh_bao' : 'canh_bao';
            
            // Gửi cho admin và điều dưỡng
            createNotificationForAdmins({
              loai: loaiThongBao,
              tieu_de: finalMucDo === 'nguy_hiem' 
                ? `⚠️ Cảnh báo nguy hiểm: Huyết áp bất thường`
                : `⚠️ Cảnh báo: Huyết áp bất thường`,
              noi_dung: `Bệnh nhân "${tenBenhNhan}" có chỉ số huyết áp ${finalMucDo === 'nguy_hiem' ? 'nguy hiểm' : 'bất thường'}: ${tam_thu}/${tam_truong} mmHg. ${finalNoiDungCanhBao || ''}`,
              link: `/admin/benh-nhan/${id}`
            }).catch(err => console.error('Error sending notification to admins:', err));

            createNotificationForDieuDuong({
              loai: loaiThongBao,
              tieu_de: finalMucDo === 'nguy_hiem' 
                ? `⚠️ Cảnh báo nguy hiểm: Huyết áp bất thường`
                : `⚠️ Cảnh báo: Huyết áp bất thường`,
              noi_dung: `Bệnh nhân "${tenBenhNhan}" có chỉ số huyết áp ${finalMucDo === 'nguy_hiem' ? 'nguy hiểm' : 'bất thường'}: ${tam_thu}/${tam_truong} mmHg. ${finalNoiDungCanhBao || ''}`,
              link: `/admin/benh-nhan/${id}`
            }).catch(err => console.error('Error sending notification to dieu duong:', err));
          }
        })
        .catch(err => console.error('Error fetching benh nhan for notification:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số huyết áp thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const updateHuyetAp = async (req, res, next) => {
  try {
    const { id, huyet_ap_id } = req.params;
    const {
      tam_thu, tam_truong, thoi_gian_do, vi_tri_do, tu_the_khi_do,
      ghi_chu, muc_do, noi_dung_canh_bao
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (tam_thu !== undefined) { updateFields.push('tam_thu = ?'); updateValues.push(tam_thu); }
    if (tam_truong !== undefined) { updateFields.push('tam_truong = ?'); updateValues.push(tam_truong); }
    if (thoi_gian_do !== undefined) { updateFields.push('thoi_gian_do = ?'); updateValues.push(thoi_gian_do); }
    if (vi_tri_do !== undefined) { updateFields.push('vi_tri_do = ?'); updateValues.push(vi_tri_do); }
    if (tu_the_khi_do !== undefined) { updateFields.push('tu_the_khi_do = ?'); updateValues.push(tu_the_khi_do); }
    if (ghi_chu !== undefined) { updateFields.push('ghi_chu = ?'); updateValues.push(ghi_chu); }
    if (muc_do !== undefined) { updateFields.push('muc_do = ?'); updateValues.push(muc_do); }
    if (noi_dung_canh_bao !== undefined) { updateFields.push('noi_dung_canh_bao = ?'); updateValues.push(noi_dung_canh_bao); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    await pool.execute(
      `UPDATE huyet_ap SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, huyet_ap_id, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật chỉ số huyết áp thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHuyetAp = async (req, res, next) => {
  try {
    const { id, huyet_ap_id } = req.params;

    await pool.execute(
      'DELETE FROM huyet_ap WHERE id = ? AND id_benh_nhan = ?',
      [huyet_ap_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số huyết áp thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API NHỊP TIM
// ============================================

export const getNhipTim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30, page = 1, index } = req.query;

    // Xử lý pagination: nhận page hoặc tính từ index
    let pageValue = parseInt(page, 10);
    if (index !== undefined) {
      const indexValue = parseInt(index, 10);
      const limitValue = parseInt(limit, 10) || 30;
      pageValue = Math.floor(indexValue / limitValue) + 1;
    }
    if (isNaN(pageValue) || pageValue < 1) {
      pageValue = 1;
    }

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    limitValue = Math.max(1, Math.floor(limitValue));

    // Tính offset
    const offset = (pageValue - 1) * limitValue;

    // Query để đếm tổng số bản ghi
    let countQuery = `SELECT COUNT(*) as total FROM nhip_tim WHERE id_benh_nhan = ?`;
    const countParams = [id];

    if (start_date && end_date) {
      countQuery += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Query để lấy dữ liệu với pagination
    let query = `SELECT * FROM nhip_tim WHERE id_benh_nhan = ?`;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ` ORDER BY thoi_gian_do DESC LIMIT ${limitValue} OFFSET ${offset}`;

    const [data] = await pool.execute(query, params);

    // Tính toán pagination info
    const totalPages = Math.ceil(total / limitValue);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageValue,
        itemsPerPage: limitValue,
        totalItems: total,
        totalPages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNhipTim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      gia_tri_nhip_tim, thoi_gian_do, tinh_trang_benh_nhan_khi_do,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao
    } = req.body;

    // Helper function để chuyển undefined và empty string thành null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      return value;
    };

    // Đánh giá tự động dựa trên cấu hình
    let evaluation = null;
    if (gia_tri_nhip_tim !== undefined) {
      evaluation = await evaluateChiSo('Nhịp tim', gia_tri_nhip_tim, id_cau_hinh_chi_so_canh_bao);
    }

    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    const finalMucDo = evaluation?.muc_do || muc_do || 'binh_thuong';
    const finalNoiDungCanhBao = evaluation?.noi_dung_canh_bao || noi_dung_canh_bao;
    const finalDanhGiaChiTiet = evaluation?.danh_gia_chi_tiet || null;
    const finalIdCauHinh = evaluation?.id_cau_hinh || id_cau_hinh_chi_so_canh_bao || null;

    // Sanitize tất cả các giá trị trước khi insert
    const sanitizedValues = [
      id,
      sanitizeValue(gia_tri_nhip_tim),
      sanitizeValue(thoi_gian_do) || getNowForDB(),
      sanitizeValue(tinh_trang_benh_nhan_khi_do),
      sanitizeValue(ghi_chu),
      finalMucDo,
      sanitizeValue(finalNoiDungCanhBao),
      finalIdCauHinh,
      finalDanhGiaChiTiet
    ];

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
      await pool.execute(
        `INSERT INTO nhip_tim 
         (id_benh_nhan, gia_tri_nhip_tim, thoi_gian_do, tinh_trang_benh_nhan_khi_do, ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, danh_gia_chi_tiet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, thử insert không có các cột đó
      if (error.message.includes('Unknown column')) {
        const sanitizedValuesFallback = [
          id,
          sanitizeValue(gia_tri_nhip_tim),
          sanitizeValue(thoi_gian_do) || getNowForDB(),
          sanitizeValue(tinh_trang_benh_nhan_khi_do),
          sanitizeValue(ghi_chu),
          finalMucDo,
          sanitizeValue(finalNoiDungCanhBao)
        ];
        await pool.execute(
          `INSERT INTO nhip_tim 
           (id_benh_nhan, gia_tri_nhip_tim, thoi_gian_do, tinh_trang_benh_nhan_khi_do, ghi_chu, muc_do, noi_dung_canh_bao)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          sanitizedValuesFallback
        );
      } else {
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số nhịp tim thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const updateNhipTim = async (req, res, next) => {
  try {
    const { id, nhip_tim_id } = req.params;
    const {
      gia_tri_nhip_tim, thoi_gian_do, tinh_trang_benh_nhan_khi_do,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao
    } = req.body;

    // Nếu giá trị nhịp tim thay đổi, đánh giá lại tự động
    let evaluation = null;
    if (gia_tri_nhip_tim !== undefined) {
      evaluation = await evaluateChiSo('Nhịp tim', gia_tri_nhip_tim, id_cau_hinh_chi_so_canh_bao);
    }

    const updateFields = [];
    const updateValues = [];

    if (gia_tri_nhip_tim !== undefined) { updateFields.push('gia_tri_nhip_tim = ?'); updateValues.push(gia_tri_nhip_tim); }
    if (thoi_gian_do !== undefined) { updateFields.push('thoi_gian_do = ?'); updateValues.push(thoi_gian_do); }
    if (tinh_trang_benh_nhan_khi_do !== undefined) { updateFields.push('tinh_trang_benh_nhan_khi_do = ?'); updateValues.push(tinh_trang_benh_nhan_khi_do); }
    if (ghi_chu !== undefined) { updateFields.push('ghi_chu = ?'); updateValues.push(ghi_chu); }
    
    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    if (evaluation) {
      updateFields.push('muc_do = ?');
      updateValues.push(evaluation.muc_do);
      if (evaluation.noi_dung_canh_bao) {
        updateFields.push('noi_dung_canh_bao = ?');
        updateValues.push(evaluation.noi_dung_canh_bao);
      }
      if (evaluation.danh_gia_chi_tiet) {
        updateFields.push('danh_gia_chi_tiet = ?');
        updateValues.push(evaluation.danh_gia_chi_tiet);
      }
      if (evaluation.id_cau_hinh) {
        updateFields.push('id_cau_hinh_chi_so_canh_bao = ?');
        updateValues.push(evaluation.id_cau_hinh);
      }
    } else {
      // Nếu không có đánh giá, dùng giá trị từ body (nếu có)
    if (muc_do !== undefined) { updateFields.push('muc_do = ?'); updateValues.push(muc_do); }
    if (noi_dung_canh_bao !== undefined) { updateFields.push('noi_dung_canh_bao = ?'); updateValues.push(noi_dung_canh_bao); }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
    await pool.execute(
      `UPDATE nhip_tim SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, nhip_tim_id, id]
    );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, loại bỏ các cột đó và thử lại
      if (error.message.includes('Unknown column')) {
        const filteredFields = [];
        const filteredValues = [];
        
        updateFields.forEach((field, index) => {
          if (!field.includes('id_cau_hinh_chi_so_canh_bao') && !field.includes('danh_gia_chi_tiet')) {
            filteredFields.push(field);
            filteredValues.push(updateValues[index]);
          }
        });
        
        if (filteredFields.length > 0) {
          await pool.execute(
            `UPDATE nhip_tim SET ${filteredFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
            [...filteredValues, nhip_tim_id, id]
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật chỉ số nhịp tim thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNhipTim = async (req, res, next) => {
  try {
    const { id, nhip_tim_id } = req.params;

    await pool.execute(
      'DELETE FROM nhip_tim WHERE id = ? AND id_benh_nhan = ?',
      [nhip_tim_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số nhịp tim thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API ĐƯỜNG HUYẾT
// ============================================

export const getDuongHuyet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30, page = 1, index } = req.query;

    // Xử lý pagination: nhận page hoặc tính từ index
    let pageValue = parseInt(page, 10);
    if (index !== undefined) {
      const indexValue = parseInt(index, 10);
      const limitValue = parseInt(limit, 10) || 30;
      pageValue = Math.floor(indexValue / limitValue) + 1;
    }
    if (isNaN(pageValue) || pageValue < 1) {
      pageValue = 1;
    }

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    limitValue = Math.max(1, Math.floor(limitValue));

    // Tính offset
    const offset = (pageValue - 1) * limitValue;

    // Query để đếm tổng số bản ghi
    let countQuery = `SELECT COUNT(*) as total FROM duong_huyet WHERE id_benh_nhan = ?`;
    const countParams = [id];

    if (start_date && end_date) {
      countQuery += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Query để lấy dữ liệu với pagination
    let query = `SELECT * FROM duong_huyet WHERE id_benh_nhan = ?`;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ` ORDER BY thoi_gian_do DESC LIMIT ${limitValue} OFFSET ${offset}`;

    const [data] = await pool.execute(query, params);

    // Tính toán pagination info
    const totalPages = Math.ceil(total / limitValue);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageValue,
        itemsPerPage: limitValue,
        totalItems: total,
        totalPages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createDuongHuyet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      gia_tri_duong_huyet, thoi_gian_do, vi_tri_lay_mau, trieu_chung_kem_theo,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao
    } = req.body;

    // Helper function để chuyển undefined và empty string thành null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      return value;
    };

    // Đánh giá tự động dựa trên cấu hình
    let evaluation = null;
    if (gia_tri_duong_huyet !== undefined) {
      evaluation = await evaluateChiSo('Đường huyết', gia_tri_duong_huyet, id_cau_hinh_chi_so_canh_bao);
    }

    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    const finalMucDo = evaluation?.muc_do || muc_do || 'binh_thuong';
    const finalNoiDungCanhBao = evaluation?.noi_dung_canh_bao || noi_dung_canh_bao;
    const finalDanhGiaChiTiet = evaluation?.danh_gia_chi_tiet || null;
    const finalIdCauHinh = evaluation?.id_cau_hinh || id_cau_hinh_chi_so_canh_bao || null;

    // Sanitize tất cả các giá trị trước khi insert
    const sanitizedValues = [
      id,
      sanitizeValue(gia_tri_duong_huyet),
      sanitizeValue(thoi_gian_do) || getNowForDB(),
      sanitizeValue(vi_tri_lay_mau),
      sanitizeValue(trieu_chung_kem_theo),
      sanitizeValue(ghi_chu),
      finalMucDo,
      sanitizeValue(finalNoiDungCanhBao),
      finalIdCauHinh,
      finalDanhGiaChiTiet
    ];

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
      await pool.execute(
        `INSERT INTO duong_huyet 
         (id_benh_nhan, gia_tri_duong_huyet, thoi_gian_do, vi_tri_lay_mau, trieu_chung_kem_theo, ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, danh_gia_chi_tiet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, thử insert không có các cột đó
      if (error.message.includes('Unknown column')) {
        const sanitizedValuesFallback = [
          id,
          sanitizeValue(gia_tri_duong_huyet),
          sanitizeValue(thoi_gian_do) || getNowForDB(),
          sanitizeValue(vi_tri_lay_mau),
          sanitizeValue(trieu_chung_kem_theo),
          sanitizeValue(ghi_chu),
          finalMucDo,
          sanitizeValue(finalNoiDungCanhBao)
        ];
        await pool.execute(
          `INSERT INTO duong_huyet 
           (id_benh_nhan, gia_tri_duong_huyet, thoi_gian_do, vi_tri_lay_mau, trieu_chung_kem_theo, ghi_chu, muc_do, noi_dung_canh_bao)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizedValuesFallback
        );
      } else {
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số đường huyết thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const updateDuongHuyet = async (req, res, next) => {
  try {
    const { id, duong_huyet_id } = req.params;
    const {
      gia_tri_duong_huyet, thoi_gian_do, vi_tri_lay_mau, trieu_chung_kem_theo,
      ghi_chu, muc_do, noi_dung_canh_bao
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (gia_tri_duong_huyet !== undefined) { updateFields.push('gia_tri_duong_huyet = ?'); updateValues.push(gia_tri_duong_huyet); }
    if (thoi_gian_do !== undefined) { updateFields.push('thoi_gian_do = ?'); updateValues.push(thoi_gian_do); }
    if (vi_tri_lay_mau !== undefined) { updateFields.push('vi_tri_lay_mau = ?'); updateValues.push(vi_tri_lay_mau); }
    if (trieu_chung_kem_theo !== undefined) { updateFields.push('trieu_chung_kem_theo = ?'); updateValues.push(trieu_chung_kem_theo); }
    if (ghi_chu !== undefined) { updateFields.push('ghi_chu = ?'); updateValues.push(ghi_chu); }
    if (muc_do !== undefined) { updateFields.push('muc_do = ?'); updateValues.push(muc_do); }
    if (noi_dung_canh_bao !== undefined) { updateFields.push('noi_dung_canh_bao = ?'); updateValues.push(noi_dung_canh_bao); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    await pool.execute(
      `UPDATE duong_huyet SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, duong_huyet_id, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật chỉ số đường huyết thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDuongHuyet = async (req, res, next) => {
  try {
    const { id, duong_huyet_id } = req.params;

    await pool.execute(
      'DELETE FROM duong_huyet WHERE id = ? AND id_benh_nhan = ?',
      [duong_huyet_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số đường huyết thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API SpO2
// ============================================

export const getSpO2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30, page = 1, index } = req.query;

    // Xử lý pagination: nhận page hoặc tính từ index
    let pageValue = parseInt(page, 10);
    if (index !== undefined) {
      const indexValue = parseInt(index, 10);
      const limitValue = parseInt(limit, 10) || 30;
      pageValue = Math.floor(indexValue / limitValue) + 1;
    }
    if (isNaN(pageValue) || pageValue < 1) {
      pageValue = 1;
    }

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    limitValue = Math.max(1, Math.floor(limitValue));

    // Tính offset
    const offset = (pageValue - 1) * limitValue;

    // Query để đếm tổng số bản ghi
    let countQuery = `SELECT COUNT(*) as total FROM spo2 WHERE id_benh_nhan = ?`;
    const countParams = [id];

    if (start_date && end_date) {
      countQuery += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Query để lấy dữ liệu với pagination
    let query = `SELECT * FROM spo2 WHERE id_benh_nhan = ?`;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ` ORDER BY thoi_gian_do DESC LIMIT ${limitValue} OFFSET ${offset}`;

    const [data] = await pool.execute(query, params);

    // Tính toán pagination info
    const totalPages = Math.ceil(total / limitValue);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageValue,
        itemsPerPage: limitValue,
        totalItems: total,
        totalPages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createSpO2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      gia_tri_spo2, thoi_gian_do, vi_tri_do, tinh_trang_ho_hap,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, pi
    } = req.body;

    // Helper function để chuyển undefined và empty string thành null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      return value;
    };

    // Đánh giá tự động dựa trên cấu hình
    let evaluation = null;
    if (gia_tri_spo2 !== undefined) {
      evaluation = await evaluateChiSo('SpO2', gia_tri_spo2, id_cau_hinh_chi_so_canh_bao);
    }

    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    const finalMucDo = evaluation?.muc_do || muc_do || 'binh_thuong';
    const finalNoiDungCanhBao = evaluation?.noi_dung_canh_bao || noi_dung_canh_bao;
    const finalDanhGiaChiTiet = evaluation?.danh_gia_chi_tiet || null;
    const finalIdCauHinh = evaluation?.id_cau_hinh || id_cau_hinh_chi_so_canh_bao || null;

    // Sanitize tất cả các giá trị trước khi insert
    const sanitizedValues = [
      id,
      sanitizeValue(gia_tri_spo2),
      sanitizeValue(thoi_gian_do) || getNowForDB(),
      sanitizeValue(vi_tri_do),
      sanitizeValue(tinh_trang_ho_hap),
      sanitizeValue(ghi_chu),
      finalMucDo,
      sanitizeValue(finalNoiDungCanhBao),
      finalIdCauHinh,
      finalDanhGiaChiTiet,
      sanitizeValue(pi)
    ];

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
      await pool.execute(
        `INSERT INTO spo2 
         (id_benh_nhan, gia_tri_spo2, thoi_gian_do, vi_tri_do, tinh_trang_ho_hap, ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, danh_gia_chi_tiet, pi)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, thử insert không có các cột đó
      if (error.message.includes('Unknown column')) {
        const sanitizedValuesFallback = [
          id,
          sanitizeValue(gia_tri_spo2),
          sanitizeValue(thoi_gian_do) || getNowForDB(),
          sanitizeValue(vi_tri_do),
          sanitizeValue(tinh_trang_ho_hap),
          sanitizeValue(ghi_chu),
          finalMucDo,
          sanitizeValue(finalNoiDungCanhBao),
          sanitizeValue(pi)
        ];
        await pool.execute(
          `INSERT INTO spo2 
           (id_benh_nhan, gia_tri_spo2, thoi_gian_do, vi_tri_do, tinh_trang_ho_hap, ghi_chu, muc_do, noi_dung_canh_bao, pi)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizedValuesFallback
        );
      } else {
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số SpO2 thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const updateSpO2 = async (req, res, next) => {
  try {
    const { id, spo2_id } = req.params;
    const {
      gia_tri_spo2, thoi_gian_do, vi_tri_do, tinh_trang_ho_hap,
      ghi_chu, muc_do, noi_dung_canh_bao
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (gia_tri_spo2 !== undefined) { updateFields.push('gia_tri_spo2 = ?'); updateValues.push(gia_tri_spo2); }
    if (thoi_gian_do !== undefined) { updateFields.push('thoi_gian_do = ?'); updateValues.push(thoi_gian_do); }
    if (vi_tri_do !== undefined) { updateFields.push('vi_tri_do = ?'); updateValues.push(vi_tri_do); }
    if (tinh_trang_ho_hap !== undefined) { updateFields.push('tinh_trang_ho_hap = ?'); updateValues.push(tinh_trang_ho_hap); }
    if (ghi_chu !== undefined) { updateFields.push('ghi_chu = ?'); updateValues.push(ghi_chu); }
    if (muc_do !== undefined) { updateFields.push('muc_do = ?'); updateValues.push(muc_do); }
    if (noi_dung_canh_bao !== undefined) { updateFields.push('noi_dung_canh_bao = ?'); updateValues.push(noi_dung_canh_bao); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    await pool.execute(
      `UPDATE spo2 SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, spo2_id, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật chỉ số SpO2 thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSpO2 = async (req, res, next) => {
  try {
    const { id, spo2_id } = req.params;

    await pool.execute(
      'DELETE FROM spo2 WHERE id = ? AND id_benh_nhan = ?',
      [spo2_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số SpO2 thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API NHIỆT ĐỘ
// ============================================

export const getNhietDo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 30, page = 1, index } = req.query;

    // Xử lý pagination: nhận page hoặc tính từ index
    let pageValue = parseInt(page, 10);
    if (index !== undefined) {
      const indexValue = parseInt(index, 10);
      const limitValue = parseInt(limit, 10) || 30;
      pageValue = Math.floor(indexValue / limitValue) + 1;
    }
    if (isNaN(pageValue) || pageValue < 1) {
      pageValue = 1;
    }

    // Đảm bảo limitValue là một số nguyên dương hợp lệ
    let limitValue = parseInt(limit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      limitValue = 30;
    }
    limitValue = Math.max(1, Math.floor(limitValue));

    // Tính offset
    const offset = (pageValue - 1) * limitValue;

    // Query để đếm tổng số bản ghi
    let countQuery = `SELECT COUNT(*) as total FROM nhiet_do WHERE id_benh_nhan = ?`;
    const countParams = [id];

    if (start_date && end_date) {
      countQuery += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      countParams.push(start_date, end_date);
    }

    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    // Query để lấy dữ liệu với pagination
    let query = `SELECT * FROM nhiet_do WHERE id_benh_nhan = ?`;
    const params = [id];

    if (start_date && end_date) {
      query += ' AND DATE(thoi_gian_do) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    query += ` ORDER BY thoi_gian_do DESC LIMIT ${limitValue} OFFSET ${offset}`;

    const [data] = await pool.execute(query, params);

    // Tính toán pagination info
    const totalPages = Math.ceil(total / limitValue);

    res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageValue,
        itemsPerPage: limitValue,
        totalItems: total,
        totalPages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createNhietDo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      gia_tri_nhiet_do, thoi_gian_do, vi_tri_do, tinh_trang_luc_do,
      ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao
    } = req.body;

    // Helper function để chuyển undefined và empty string thành null
    const sanitizeValue = (value) => {
      if (value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
        return null;
      }
      return value;
    };

    // Đánh giá tự động dựa trên cấu hình
    let evaluation = null;
    if (gia_tri_nhiet_do !== undefined) {
      evaluation = await evaluateChiSo('Nhiệt độ', gia_tri_nhiet_do, id_cau_hinh_chi_so_canh_bao);
    }

    // Sử dụng kết quả đánh giá nếu có, nếu không dùng giá trị từ body
    const finalMucDo = evaluation?.muc_do || muc_do || 'binh_thuong';
    const finalNoiDungCanhBao = evaluation?.noi_dung_canh_bao || noi_dung_canh_bao;
    const finalDanhGiaChiTiet = evaluation?.danh_gia_chi_tiet || null;
    const finalIdCauHinh = evaluation?.id_cau_hinh || id_cau_hinh_chi_so_canh_bao || null;

    // Sanitize tất cả các giá trị trước khi insert
    const sanitizedValues = [
      id,
      sanitizeValue(gia_tri_nhiet_do),
      sanitizeValue(thoi_gian_do) || getNowForDB(),
      sanitizeValue(vi_tri_do),
      sanitizeValue(tinh_trang_luc_do),
      sanitizeValue(ghi_chu),
      finalMucDo,
      sanitizeValue(finalNoiDungCanhBao),
      finalIdCauHinh,
      finalDanhGiaChiTiet
    ];

    // Kiểm tra xem cột id_cau_hinh_chi_so_canh_bao và danh_gia_chi_tiet có tồn tại không
    try {
      await pool.execute(
        `INSERT INTO nhiet_do 
         (id_benh_nhan, gia_tri_nhiet_do, thoi_gian_do, vi_tri_do, tinh_trang_luc_do, ghi_chu, muc_do, noi_dung_canh_bao, id_cau_hinh_chi_so_canh_bao, danh_gia_chi_tiet)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        sanitizedValues
      );
    } catch (error) {
      // Nếu lỗi do cột không tồn tại, thử insert không có các cột đó
      if (error.message.includes('Unknown column')) {
        const sanitizedValuesFallback = [
          id,
          sanitizeValue(gia_tri_nhiet_do),
          sanitizeValue(thoi_gian_do) || getNowForDB(),
          sanitizeValue(vi_tri_do),
          sanitizeValue(tinh_trang_luc_do),
          sanitizeValue(ghi_chu),
          finalMucDo,
          sanitizeValue(finalNoiDungCanhBao)
        ];
        await pool.execute(
          `INSERT INTO nhiet_do 
           (id_benh_nhan, gia_tri_nhiet_do, thoi_gian_do, vi_tri_do, tinh_trang_luc_do, ghi_chu, muc_do, noi_dung_canh_bao)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          sanitizedValuesFallback
        );
      } else {
        throw error;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chỉ số nhiệt độ thành công',
      evaluation: evaluation
    });
  } catch (error) {
    next(error);
  }
};

export const updateNhietDo = async (req, res, next) => {
  try {
    const { id, nhiet_do_id } = req.params;
    const {
      gia_tri_nhiet_do, thoi_gian_do, vi_tri_do, tinh_trang_luc_do,
      ghi_chu, muc_do, noi_dung_canh_bao
    } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (gia_tri_nhiet_do !== undefined) { updateFields.push('gia_tri_nhiet_do = ?'); updateValues.push(gia_tri_nhiet_do); }
    if (thoi_gian_do !== undefined) { updateFields.push('thoi_gian_do = ?'); updateValues.push(thoi_gian_do); }
    if (vi_tri_do !== undefined) { updateFields.push('vi_tri_do = ?'); updateValues.push(vi_tri_do); }
    if (tinh_trang_luc_do !== undefined) { updateFields.push('tinh_trang_luc_do = ?'); updateValues.push(tinh_trang_luc_do); }
    if (ghi_chu !== undefined) { updateFields.push('ghi_chu = ?'); updateValues.push(ghi_chu); }
    if (muc_do !== undefined) { updateFields.push('muc_do = ?'); updateValues.push(muc_do); }
    if (noi_dung_canh_bao !== undefined) { updateFields.push('noi_dung_canh_bao = ?'); updateValues.push(noi_dung_canh_bao); }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật'
      });
    }

    await pool.execute(
      `UPDATE nhiet_do SET ${updateFields.join(', ')} WHERE id = ? AND id_benh_nhan = ?`,
      [...updateValues, nhiet_do_id, id]
    );

    res.json({
      success: true,
      message: 'Cập nhật chỉ số nhiệt độ thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNhietDo = async (req, res, next) => {
  try {
    const { id, nhiet_do_id } = req.params;

    await pool.execute(
      'DELETE FROM nhiet_do WHERE id = ? AND id_benh_nhan = ?',
      [nhiet_do_id, id]
    );

    res.json({
      success: true,
      message: 'Xóa chỉ số nhiệt độ thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const getBenhNhanByDieuDuong = async (req, res, next) => {
  try {
    const { id_dieu_duong } = req.params;
    const { 
      trang_thai,
      search 
    } = req.query;

    // Theo schema: dieu_duong_benh_nhan.id_dieu_duong là FOREIGN KEY tham chiếu đến ho_so_nhan_vien.id
    // Vậy id_dieu_duong trong DB PHẢI là ho_so_nhan_vien.id, không phải tai_khoan.id
    // Frontend có thể gửi:
    // 1. ho_so_nhan_vien.id (từ nv.id nếu nv là object từ ho_so_nhan_vien)
    // 2. tai_khoan.id (từ nv.id nếu nv là object từ tai_khoan)
    // Cần tìm ho_so_nhan_vien.id từ id_dieu_duong (có thể là một trong hai giá trị trên)
    
    let idHoSoNhanVien = null;
    
    // Thử tìm theo ho_so_nhan_vien.id trước
    const [hoSoCheck] = await pool.execute(
      `SELECT hsnv.id, hsnv.id_tai_khoan, tk.ho_ten, tk.email, tk.so_dien_thoai
       FROM ho_so_nhan_vien hsnv
       JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE hsnv.id = ? AND tk.da_xoa = 0`,
      [id_dieu_duong]
    );

    if (hoSoCheck.length > 0) {
      idHoSoNhanVien = hoSoCheck[0].id;
    } else {
      // Nếu không tìm thấy, thử tìm theo tai_khoan.id
      // (frontend có thể gửi tai_khoan.id)
      const [taiKhoanCheck] = await pool.execute(
        `SELECT hsnv.id, hsnv.id_tai_khoan, tk.ho_ten, tk.email, tk.so_dien_thoai
         FROM ho_so_nhan_vien hsnv
         JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
         WHERE tk.id = ? AND tk.da_xoa = 0`,
        [id_dieu_duong]
      );

      if (taiKhoanCheck.length > 0) {
        idHoSoNhanVien = taiKhoanCheck[0].id;
      }
    }

    if (!idHoSoNhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy điều dưỡng'
      });
    }
    
    console.log('🔍 [getBenhNhanByDieuDuong] Debug:', {
      id_dieu_duong_from_params: id_dieu_duong,
      idHoSoNhanVien_found: idHoSoNhanVien
    });

    // Lấy thông tin điều dưỡng
    const [dieuDuong] = await pool.execute(
      `SELECT hsnv.*, tk.ho_ten, tk.email, tk.so_dien_thoai
       FROM ho_so_nhan_vien hsnv
       JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE hsnv.id = ? AND tk.da_xoa = 0`,
      [idHoSoNhanVien]
    );

    if (dieuDuong.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy điều dưỡng'
      });
    }

    // Query để lấy danh sách bệnh nhân
    // id_dieu_duong trong dieu_duong_benh_nhan là FOREIGN KEY tham chiếu đến ho_so_nhan_vien.id
    // Vậy chỉ cần query với ho_so_nhan_vien.id
    let query = `
      SELECT DISTINCT 
        b.*,
        ddbn.id as id_quan_ly,
        ddbn.ngay_bat_dau,
        ddbn.ngay_ket_thuc,
        ddbn.trang_thai as trang_thai_quan_ly,
        ddbn.ghi_chu as ghi_chu_quan_ly,
        COUNT(DISTINCT nt.id) as so_nguoi_than
      FROM dieu_duong_benh_nhan ddbn
      INNER JOIN benh_nhan b ON ddbn.id_benh_nhan = b.id
      LEFT JOIN nguoi_than_benh_nhan nt ON b.id = nt.id_benh_nhan
      WHERE ddbn.id_dieu_duong = ? AND b.da_xoa = 0
    `;
    
    const params = [idHoSoNhanVien];
    
    console.log('🔍 [getBenhNhanByDieuDuong] Query với ho_so_nhan_vien.id:', {
      idHoSoNhanVien,
      params
    });

    // Filter theo trang_thai quan ly
    if (trang_thai) {
      query += ' AND ddbn.trang_thai = ?';
      params.push(trang_thai);
    }

    // Filter theo search
    if (search) {
      query += ' AND (b.ho_ten LIKE ? OR b.cccd LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' GROUP BY b.id, ddbn.id ORDER BY ddbn.ngay_bat_dau DESC';

    const [benhNhans] = await pool.execute(query, params);

    // Lấy thông tin phòng và dịch vụ cho mỗi bệnh nhân
    for (let benhNhan of benhNhans) {
      // Lấy thông tin phòng hiện tại
      const [phongInfo] = await pool.execute(
        `SELECT pobn.*, 
                p.ten_phong, p.so_phong as so_phong_thuc_te, p.so_giuong,
                pk.ten_khu as ten_khu_phan_khu
         FROM phong_o_benh_nhan pobn
         LEFT JOIN phong p ON pobn.id_phong = p.id AND p.da_xoa = 0
         LEFT JOIN phan_khu pk ON p.id_phan_khu = pk.id
         WHERE pobn.id_benh_nhan = ?
           AND (pobn.ngay_ket_thuc_o IS NULL OR pobn.ngay_ket_thuc_o > CURDATE())
         ORDER BY pobn.ngay_bat_dau_o DESC
         LIMIT 1`,
        [benhNhan.id]
      );

      if (phongInfo.length > 0) {
        benhNhan.phong_hien_tai = {
          id: phongInfo[0].id_phong,
          ten_phong: phongInfo[0].ten_phong || '',
          so_phong: phongInfo[0].so_phong_thuc_te || '',
          ten_khu: phongInfo[0].ten_khu_phan_khu || '',
          display: `${phongInfo[0].ten_khu_phan_khu || ''}-${phongInfo[0].so_phong_thuc_te || phongInfo[0].ten_phong || ''}`
        };
      } else {
        benhNhan.phong_hien_tai = null;
      }

      // Lấy dịch vụ đang sử dụng
      const [dichVuInfo] = await pool.execute(
        `SELECT bndv.*, dv.ten_dich_vu
         FROM benh_nhan_dich_vu bndv
         LEFT JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
         WHERE bndv.id_benh_nhan = ? 
           AND bndv.trang_thai = 'dang_su_dung'
         ORDER BY bndv.ngay_bat_dau DESC
         LIMIT 1`,
        [benhNhan.id]
      );

      if (dichVuInfo.length > 0) {
        benhNhan.dich_vu_dang_su_dung = {
          id: dichVuInfo[0].id,
          ten_dich_vu: dichVuInfo[0].ten_dich_vu,
          hinh_thuc_thanh_toan: dichVuInfo[0].hinh_thuc_thanh_toan,
          thanh_tien: dichVuInfo[0].thanh_tien,
          cong_no_con_lai: dichVuInfo[0].cong_no_con_lai
        };
      } else {
        benhNhan.dich_vu_dang_su_dung = null;
      }
    }

    res.json({
      success: true,
      data: {
        dieu_duong: dieuDuong[0],
        benh_nhan: benhNhans
      }
    });
  } catch (error) {
    next(error);
  }
};

export const assignBenhNhanToDieuDuong = async (req, res, next) => {
  try {
    const { id_dieu_duong, id_benh_nhan } = req.body;
    const { ngay_bat_dau, ghi_chu } = req.body;

    if (!id_dieu_duong || !id_benh_nhan) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_dieu_duong và id_benh_nhan'
      });
    }

    // Tìm ho_so_nhan_vien.id từ id_dieu_duong (có thể là id_tai_khoan hoặc id_ho_so_nhan_vien)
    let idHoSoNhanVien = null;
    
    // Thử tìm theo ho_so_nhan_vien.id trước
    const [hoSoCheck] = await pool.execute(
      `SELECT hsnv.id, tk.ho_ten
       FROM ho_so_nhan_vien hsnv
       JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE hsnv.id = ? AND tk.da_xoa = 0`,
      [id_dieu_duong]
    );

    if (hoSoCheck.length > 0) {
      idHoSoNhanVien = hoSoCheck[0].id;
    } else {
      // Nếu không tìm thấy, thử tìm theo tai_khoan.id
      const [taiKhoanCheck] = await pool.execute(
        `SELECT hsnv.id, tk.ho_ten
         FROM ho_so_nhan_vien hsnv
         JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
         WHERE tk.id = ? AND tk.da_xoa = 0`,
        [id_dieu_duong]
      );

      if (taiKhoanCheck.length > 0) {
        idHoSoNhanVien = taiKhoanCheck[0].id;
      }
    }

    if (!idHoSoNhanVien) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy điều dưỡng'
      });
    }

    // Kiểm tra bệnh nhân có tồn tại không
    const [benhNhan] = await pool.execute(
      'SELECT id, ho_ten FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id_benh_nhan]
    );

    if (benhNhan.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Kiểm tra xem đã có quan hệ quản lý đang hoạt động chưa
    const [existing] = await pool.execute(
      `SELECT id FROM dieu_duong_benh_nhan 
       WHERE id_dieu_duong = ? AND id_benh_nhan = ? AND trang_thai = 'dang_quan_ly'`,
      [idHoSoNhanVien, id_benh_nhan]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bệnh nhân đã được gán cho điều dưỡng này'
      });
    }

    // Tạo quan hệ quản lý mới
    const ngayBatDau = ngay_bat_dau || getTodayVN();

    const [result] = await pool.execute(
      `INSERT INTO dieu_duong_benh_nhan 
       (id_dieu_duong, id_benh_nhan, ngay_bat_dau, trang_thai, ghi_chu)
       VALUES (?, ?, ?, 'dang_quan_ly', ?)`,
      [idHoSoNhanVien, id_benh_nhan, ngayBatDau, ghi_chu || null]
    );

    res.status(201).json({
      success: true,
      message: 'Gán bệnh nhân cho điều dưỡng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API CHỈ SỐ SINH TỒN (Wrapper functions)
// ============================================


export const removeBenhNhanFromDieuDuong = async (req, res, next) => {
  try {
    const { id_quan_ly } = req.params;
    const { ngay_ket_thuc, ghi_chu } = req.body;

    if (!id_quan_ly) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_quan_ly'
      });
    }

    // Kiểm tra quan hệ quản lý có tồn tại không
    const [quanLy] = await pool.execute(
      `SELECT ddbn.*, b.ho_ten as ten_benh_nhan, tk.ho_ten as ten_dieu_duong
       FROM dieu_duong_benh_nhan ddbn
       JOIN benh_nhan b ON ddbn.id_benh_nhan = b.id
       JOIN ho_so_nhan_vien hsnv ON ddbn.id_dieu_duong = hsnv.id
       JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
       WHERE ddbn.id = ?`,
      [id_quan_ly]
    );

    if (quanLy.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy quan hệ quản lý'
      });
    }

    if (quanLy[0].trang_thai === 'ket_thuc') {
      return res.status(400).json({
        success: false,
        message: 'Bệnh nhân đã được xóa khỏi danh sách quản lý'
      });
    }

    // Cập nhật trạng thái sang ket_thuc
    const ngayKetThuc = ngay_ket_thuc || getTodayVN();

    await pool.execute(
      `UPDATE dieu_duong_benh_nhan 
       SET trang_thai = 'ket_thuc', 
           ngay_ket_thuc = ?,
           ghi_chu = COALESCE(?, ghi_chu)
       WHERE id = ?`,
      [ngayKetThuc, ghi_chu || null, id_quan_ly]
    );

    res.json({
      success: true,
      message: 'Xóa bệnh nhân khỏi danh sách quản lý thành công'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// API QR CODE BỆNH NHÂN
// ============================================

/**
 * Helper function: Tạo mã QR cho bệnh nhân
 * @param {number} idBenhNhan - ID của bệnh nhân
 * @returns {Promise<Object>} - Thông tin QR code đã tạo
 */
const createQRCodeForBenhNhan = async (idBenhNhan) => {
  // Tạo mã QR duy nhất (sử dụng ID bệnh nhân + timestamp + random)
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(4).toString('hex');
  const maQR = `BN${idBenhNhan}_${timestamp}_${randomStr}`;

  // QR code chỉ chứa ID bệnh nhân để khi quét sẽ trả về ID
  const qrContent = idBenhNhan.toString();

  // Lưu vào database
  const [result] = await pool.execute(
    `INSERT INTO qr_benh_nhan 
     (id_benh_nhan, ma_qr, url_qr)
     VALUES (?, ?, ?)`,
    [idBenhNhan, maQR, qrContent]
  );

  return {
    id: result.insertId,
    id_benh_nhan: idBenhNhan,
    ma_qr: maQR,
    url_qr: qrContent
  };
};

/**
 * Lấy thông tin QR code của bệnh nhân
 */
export const getQRCodeByBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [qrCodes] = await pool.execute(
      `SELECT * FROM qr_benh_nhan 
       WHERE id_benh_nhan = ? 
       ORDER BY ngay_tao DESC 
       LIMIT 1`,
      [id]
    );

    if (qrCodes.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'Bệnh nhân chưa có mã QR'
      });
    }

    res.json({
      success: true,
      data: qrCodes[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo mã QR mới cho bệnh nhân (nếu chưa có hoặc tạo mới)
 */
export const createQRCodeForBenhNhanAPI = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra bệnh nhân có tồn tại không
    const [benhNhans] = await pool.execute(
      'SELECT id FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Kiểm tra đã có QR code chưa
    const [existingQR] = await pool.execute(
      `SELECT * FROM qr_benh_nhan 
       WHERE id_benh_nhan = ? 
       ORDER BY ngay_tao DESC 
       LIMIT 1`,
      [id]
    );

    let qrData;
    if (existingQR.length > 0) {
      // Nếu đã có, trả về QR code hiện tại
      qrData = existingQR[0];
    } else {
      // Nếu chưa có, tạo mới
      qrData = await createQRCodeForBenhNhan(id);
    }

    res.status(201).json({
      success: true,
      message: existingQR.length > 0 
        ? 'Bệnh nhân đã có mã QR' 
        : 'Tạo mã QR thành công',
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo mã QR mới (thay thế QR cũ nếu có)
 */
export const regenerateQRCodeForBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra bệnh nhân có tồn tại không
    const [benhNhans] = await pool.execute(
      'SELECT id FROM benh_nhan WHERE id = ? AND da_xoa = 0',
      [id]
    );

    if (benhNhans.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bệnh nhân'
      });
    }

    // Tạo QR code mới (không xóa QR cũ, chỉ tạo thêm)
    const qrData = await createQRCodeForBenhNhan(id);

    res.status(201).json({
      success: true,
      message: 'Tạo mã QR mới thành công',
      data: qrData
    });
  } catch (error) {
    next(error);
  }
};

// Media management for benh nhan
export const getMediaBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params; // id của benh_nhan

    const [media] = await pool.execute(
      'SELECT * FROM media_benh_nhan WHERE id_benh_nhan = ? ORDER BY thu_tu ASC, ngay_upload ASC',
      [id]
    );

    res.json({
      success: true,
      data: media
    });
  } catch (error) {
    // If table doesn't exist, return empty array instead of error
    if (error.message.includes("doesn't exist")) {
      return res.json({
        success: true,
        data: []
      });
    }
    next(error);
  }
};

export const addMediaBenhNhan = async (req, res, next) => {
  try {
    const { id } = req.params; // id của benh_nhan
    const { mo_ta } = req.body;

    // Hỗ trợ upload nhiều file
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      // Fallback: kiểm tra nếu có URL trong body
      const { loai, url, thu_tu } = req.body;
      if (url) {
        const [result] = await pool.execute(
          'INSERT INTO media_benh_nhan (id_benh_nhan, loai, url, mo_ta, thu_tu) VALUES (?, ?, ?, ?, ?)',
          [id, loai || 'anh', url, mo_ta || null, thu_tu || 0]
        );
        return res.status(201).json({
          success: true,
          message: 'Thêm media thành công',
          data: { id: result.insertId, url, loai: loai || 'anh' }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp file hoặc URL của media'
      });
    }

    // Create URL base
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
      
      if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
        baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
      } else {
        baseUrl = `${protocol}://${host}`;
        if (baseUrl.includes('/api')) {
          baseUrl = baseUrl.replace('/api', '');
        }
      }
    }
    baseUrl = baseUrl.replace(/\/api\/?$/, '');

    // Xử lý từng file
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const videoExtensions = /\.(mp4|mov|avi|wmv|flv|webm)$/i;
    
    const uploadedMedia = [];
    let maxThuTu = 0;

    // Lấy thứ tự cao nhất hiện tại
    try {
      const [maxOrder] = await pool.execute(
        'SELECT COALESCE(MAX(thu_tu), -1) + 1 as next_order FROM media_benh_nhan WHERE id_benh_nhan = ?',
        [id]
      );
      maxThuTu = maxOrder[0]?.next_order || 0;
    } catch (error) {
      // Ignore error, use 0
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = path.extname(file.originalname).toLowerCase();
      
      let loai = 'anh';
      if (videoExtensions.test(fileExt)) {
        loai = 'video';
      } else if (imageExtensions.test(fileExt)) {
        loai = 'anh';
      }

      const url = `${baseUrl}/uploads/${file.filename}`;
      const thu_tu = maxThuTu + i;

      const [result] = await pool.execute(
        'INSERT INTO media_benh_nhan (id_benh_nhan, loai, url, mo_ta, thu_tu) VALUES (?, ?, ?, ?, ?)',
        [id, loai, url, mo_ta || null, thu_tu]
      );

      uploadedMedia.push({
        id: result.insertId,
        url,
        loai,
        thu_tu
      });
    }

    res.status(201).json({
      success: true,
      message: `Đã upload thành công ${uploadedMedia.length} file`,
      data: uploadedMedia
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaBenhNhan = async (req, res, next) => {
  try {
    const { id, mediaId } = req.params; // id là id_benh_nhan, mediaId là id của media

    await pool.execute('DELETE FROM media_benh_nhan WHERE id = ? AND id_benh_nhan = ?', [mediaId, id]);

    res.json({
      success: true,
      message: 'Xóa media thành công'
    });
  } catch (error) {
    next(error);
  }
};

