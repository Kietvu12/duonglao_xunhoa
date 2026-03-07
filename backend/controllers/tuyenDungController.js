import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { hashPassword } from '../utils/bcrypt.js';
import path from 'path';
import { getNowForDB, getTodayVN } from '../utils/dateUtils.js';

export const getAllTinTuyenDung = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, trang_thai } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = 'SELECT * FROM tin_tuyen_dung WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (tieu_de LIKE ? OR vi_tri LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (trang_thai) {
      query += ' AND trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY ngay_dang DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [tinTuyenDungs] = await pool.execute(query, params);

    res.json({
      success: true,
      data: tinTuyenDungs
    });
  } catch (error) {
    next(error);
  }
};

export const getTinTuyenDungById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [tinTuyenDungs] = await pool.execute(
      'SELECT * FROM tin_tuyen_dung WHERE id = ?',
      [id]
    );

    if (tinTuyenDungs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin tuyển dụng'
      });
    }

    // Get applications
    const [applications] = await pool.execute(
      'SELECT * FROM ho_so_ung_tuyen WHERE id_tin_tuyen_dung = ? ORDER BY ngay_nop DESC',
      [id]
    );
    tinTuyenDungs[0].ho_so_ung_tuyen = applications;

    // Get media (handle case where table doesn't exist yet)
    let media = [];
    try {
      const [mediaResult] = await pool.execute(
        'SELECT * FROM media_tin_tuyen_dung WHERE id_tin_tuyen_dung = ? ORDER BY thu_tu ASC, ngay_upload ASC',
        [id]
      );
      media = mediaResult;
    } catch (error) {
      // Table doesn't exist yet - return empty array
      console.warn('media_tin_tuyen_dung table not found, returning empty media array');
      media = [];
    }
    tinTuyenDungs[0].media = media;

    res.json({
      success: true,
      data: tinTuyenDungs[0]
    });
  } catch (error) {
    next(error);
  }
};

export const createTinTuyenDung = async (req, res, next) => {
  try {
    const { tieu_de, mo_ta, vi_tri, yeu_cau, so_luong, ngay_het_han, trang_thai } = req.body;

    if (!tieu_de || !vi_tri) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO tin_tuyen_dung (tieu_de, mo_ta, vi_tri, yeu_cau, so_luong, ngay_het_han, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tieu_de, mo_ta, vi_tri, yeu_cau, so_luong || 1, ngay_het_han, trang_thai || 'dang_tuyen', ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo tin tuyển dụng thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTinTuyenDung = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const allowedFields = ['tieu_de', 'mo_ta', 'vi_tri', 'yeu_cau', 'so_luong', 'ngay_het_han', 'trang_thai'];

    const updateFields = [];
    const updateValues = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(updateData[field]);
      }
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
      `UPDATE tin_tuyen_dung SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    res.json({
      success: true,
      message: 'Cập nhật tin tuyển dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTinTuyenDung = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM tin_tuyen_dung WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Xóa tin tuyển dụng thành công'
    });
  } catch (error) {
    next(error);
  }
};

// Ho so ung tuyen
export const getAllHoSoUngTuyen = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, id_tin_tuyen_dung, trang_thai } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT hs.*, tt.tieu_de as ten_tin_tuyen_dung, tt.vi_tri
      FROM ho_so_ung_tuyen hs
      JOIN tin_tuyen_dung tt ON hs.id_tin_tuyen_dung = tt.id
      WHERE 1=1
    `;
    const params = [];

    if (id_tin_tuyen_dung) {
      query += ' AND hs.id_tin_tuyen_dung = ?';
      params.push(id_tin_tuyen_dung);
    }

    if (trang_thai) {
      query += ' AND hs.trang_thai = ?';
      params.push(trang_thai);
    }

    query += ' ORDER BY hs.ngay_nop DESC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [hoSos] = await pool.execute(query, params);

    res.json({
      success: true,
      data: hoSos
    });
  } catch (error) {
    next(error);
  }
};

export const createHoSoUngTuyen = async (req, res, next) => {
  try {
    const { id_tin_tuyen_dung, ho_ten, email, so_dien_thoai } = req.body;
    let file_cv = null;

    if (!id_tin_tuyen_dung || !ho_ten || !email || !so_dien_thoai) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
      });
    }

    // Nếu có file upload
    if (req.file) {
      let baseUrl = process.env.BASE_URL;
      if (!baseUrl) {
        const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
        const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
        
        // Production: use https://duonglaoxuanhoa.net/api_quanlyduonglao
        // Development: use localhost
        if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
          baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
        } else {
          // Local development
          baseUrl = `${protocol}://${host}`;
          // Remove /api suffix if present
          if (baseUrl.includes('/api')) {
            baseUrl = baseUrl.replace('/api', '');
          }
        }
      }
      baseUrl = baseUrl.replace(/\/api\/?$/, '');
      file_cv = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO ho_so_ung_tuyen (id_tin_tuyen_dung, ho_ten, email, so_dien_thoai, file_cv, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_tin_tuyen_dung, ho_ten, email, so_dien_thoai, file_cv, ngayTaoVN]
    );

    res.status(201).json({
      success: true,
      message: 'Nộp hồ sơ ứng tuyển thành công',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

export const updateHoSoUngTuyen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { trang_thai, diem_ai } = req.body;

    // Lấy thông tin hồ sơ ứng tuyển hiện tại
    const [hoSo] = await pool.execute(
      'SELECT * FROM ho_so_ung_tuyen WHERE id = ?',
      [id]
    );

    if (hoSo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hồ sơ ứng tuyển'
      });
    }

    const hoSoData = hoSo[0];

    const updateFields = [];
    const updateValues = [];

    if (trang_thai !== undefined) {
      updateFields.push('trang_thai = ?');
      updateValues.push(trang_thai);
    }
    if (diem_ai !== undefined) {
      updateFields.push('diem_ai = ?');
      updateValues.push(diem_ai);
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

    // Kiểm tra trạng thái cũ để chỉ tạo tài khoản khi chuyển sang "trung_tuyen"
    const trangThaiCu = hoSoData.trang_thai;
    const isChuyenSangTrungTuyen = trang_thai === 'trung_tuyen' && trangThaiCu !== 'trung_tuyen';

    await pool.execute(
      `UPDATE ho_so_ung_tuyen SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Nếu chuyển sang trạng thái "trung_tuyen", tự động tạo nhân viên
    if (isChuyenSangTrungTuyen) {
      try {
        // Kiểm tra xem đã có tài khoản chưa
        const [existingAccount] = await pool.execute(
          'SELECT id FROM tai_khoan WHERE so_dien_thoai = ? OR email = ?',
          [hoSoData.so_dien_thoai, hoSoData.email]
        );

        let taiKhoanId = null;
        let isTaoMoiTaiKhoan = false;
        
        if (existingAccount.length === 0) {
          // Tạo tài khoản mới với mật khẩu mặc định 123456
          const defaultPassword = '123456';
          const hashedPassword = await hashPassword(defaultPassword);
          
          const ngayTaoTKVN = getNowForDB();
          const [accountResult] = await pool.execute(
            `INSERT INTO tai_khoan (ho_ten, so_dien_thoai, email, mat_khau, vai_tro, ngay_tao)
             VALUES (?, ?, ?, ?, 'dieu_duong', ?)`,
            [hoSoData.ho_ten, hoSoData.so_dien_thoai, hoSoData.email, hashedPassword, ngayTaoTKVN]
          );
          taiKhoanId = accountResult.insertId;
          isTaoMoiTaiKhoan = true;
          console.log('Đã tạo tài khoản mới:', taiKhoanId);
        } else {
          taiKhoanId = existingAccount[0].id;
          console.log('Sử dụng tài khoản hiện có:', taiKhoanId);
        }

        // Đảm bảo taiKhoanId không null
        if (!taiKhoanId) {
          throw new Error('Không thể tạo hoặc lấy được ID tài khoản');
        }

        // LUÔN kiểm tra và tạo ho_so_nhan_vien (bắt buộc phải có)
        const [existingHoSo] = await pool.execute(
          'SELECT id FROM ho_so_nhan_vien WHERE id_tai_khoan = ?',
          [taiKhoanId]
        );

        let hoSoNhanVienId = null;
        let isTaoMoiHoSo = false;
        
        if (existingHoSo.length === 0) {
          // Tạo hồ sơ nhân viên với chức vụ mặc định là "Điều dưỡng"
          console.log('Bắt đầu tạo hồ sơ nhân viên với taiKhoanId:', taiKhoanId);
          const ngayTaoHoSoVN = getNowForDB();
          const ngayBatDauVN = getTodayVN();
          const [hoSoResult] = await pool.execute(
            `INSERT INTO ho_so_nhan_vien (id_tai_khoan, chuc_vu, ngay_bat_dau, ngay_tao)
             VALUES (?, 'Điều dưỡng', ?, ?)`,
            [taiKhoanId, ngayBatDauVN, ngayTaoHoSoVN]
          );
          hoSoNhanVienId = hoSoResult.insertId;
          isTaoMoiHoSo = true;
          console.log('Đã tạo hồ sơ nhân viên mới thành công:', hoSoNhanVienId);
        } else {
          hoSoNhanVienId = existingHoSo[0].id;
          console.log('Sử dụng hồ sơ nhân viên hiện có:', hoSoNhanVienId);
        }

        // Đảm bảo hoSoNhanVienId không null
        if (!hoSoNhanVienId) {
          throw new Error('Không thể tạo hoặc lấy được ID hồ sơ nhân viên');
        }

        // Cập nhật CV vào media_ho_so_nhan_vien nếu có file_cv
        if (hoSoNhanVienId && hoSoData.file_cv) {
          // Kiểm tra xem đã có media_ho_so_nhan_vien chưa
          const [existingMedia] = await pool.execute(
            'SELECT id FROM media_ho_so_nhan_vien WHERE id_nhan_vien = ?',
            [hoSoNhanVienId]
          );

          if (existingMedia.length > 0) {
            // Cập nhật anh_cv
            const ngayCapNhatMediaVN = getNowForDB();
            await pool.execute(
              'UPDATE media_ho_so_nhan_vien SET anh_cv = ?, ngay_cap_nhat = ? WHERE id_nhan_vien = ?',
              [hoSoData.file_cv, ngayCapNhatMediaVN, hoSoNhanVienId]
            );
            console.log('Đã cập nhật CV vào media hồ sơ nhân viên');
          } else {
            // Tạo mới
            const ngayTaoMediaVN = getNowForDB();
            await pool.execute(
              `INSERT INTO media_ho_so_nhan_vien (id_nhan_vien, anh_cv, ngay_tao)
               VALUES (?, ?, ?)`,
              [hoSoNhanVienId, hoSoData.file_cv, ngayTaoMediaVN]
            );
            console.log('Đã tạo mới media hồ sơ nhân viên với CV');
          }
        }

        // Log để debug
        console.log('Đã tạo nhân viên từ hồ sơ ứng tuyển:', {
          hoSoUngTuyenId: id,
          taiKhoanId,
          hoSoNhanVienId,
          isTaoMoiTaiKhoan,
          isTaoMoiHoSo,
          hasCV: !!hoSoData.file_cv
        });
      } catch (error) {
        console.error('Error creating employee from application:', error);
        console.error('Error stack:', error.stack);
        // Throw error để frontend biết có lỗi
        return res.status(500).json({
          success: false,
          message: 'Cập nhật trạng thái thành công nhưng có lỗi khi tạo tài khoản nhân viên: ' + error.message
        });
      }
    }

    let message = 'Cập nhật hồ sơ ứng tuyển thành công';
    if (isChuyenSangTrungTuyen) {
      message += '. Đã tự động tạo tài khoản nhân viên với vai trò "Điều dưỡng" và mật khẩu mặc định "123456".';
    }

    res.json({
      success: true,
      message: message
    });
  } catch (error) {
    next(error);
  }
};

// Media management for tin tuyen dung
export const addMediaTinTuyenDung = async (req, res, next) => {
  try {
    // Check if table exists
    try {
      await pool.execute('SELECT 1 FROM media_tin_tuyen_dung LIMIT 1');
    } catch (error) {
      if (error.message.includes("doesn't exist")) {
        return res.status(500).json({
          success: false,
          message: 'Bảng media_tin_tuyen_dung chưa được tạo. Vui lòng chạy migration file migration_add_media_tin_tuyen_dung.sql'
        });
      }
    }

    const { id } = req.params; // id của tin_tuyen_dung
    const { mo_ta } = req.body;

    // Hỗ trợ upload nhiều file
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) {
      // Fallback: kiểm tra nếu có URL trong body (cho trường hợp upload URL thay vì file)
      const { loai, url, thu_tu } = req.body;
      if (url) {
        const ngayTaoMediaVN = getNowForDB();
        const [result] = await pool.execute(
          'INSERT INTO media_tin_tuyen_dung (id_tin_tuyen_dung, loai, url, mo_ta, thu_tu, ngay_tao) VALUES (?, ?, ?, ?, ?, ?)',
          [id, loai || 'anh', url, mo_ta || null, thu_tu || 0, ngayTaoMediaVN]
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

    // Create URL base - use production base URL
    let baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
      const host = req.get('x-forwarded-host') || req.get('host') || 'localhost:4545';
      
      // Production: use https://duonglaoxuanhoa.net/api_quanlyduonglao
      // Development: use localhost
      if (host.includes('duonglaoxuanhoa.net') || host.includes('api_quanlyduonglao')) {
        baseUrl = 'https://duonglaoxuanhoa.net/api_quanlyduonglao';
      } else {
        // Local development
        baseUrl = `${protocol}://${host}`;
        // Remove /api suffix if present
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
        'SELECT COALESCE(MAX(thu_tu), -1) + 1 as next_order FROM media_tin_tuyen_dung WHERE id_tin_tuyen_dung = ?',
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

      const ngayTaoMediaVN = getNowForDB();
      const [result] = await pool.execute(
        'INSERT INTO media_tin_tuyen_dung (id_tin_tuyen_dung, loai, url, mo_ta, thu_tu, ngay_tao) VALUES (?, ?, ?, ?, ?, ?)',
        [id, loai, url, mo_ta || null, thu_tu, ngayTaoMediaVN]
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

export const deleteMediaTinTuyenDung = async (req, res, next) => {
  try {
    const { id, mediaId } = req.params; // id là id_tin_tuyen_dung, mediaId là id của media

    await pool.execute('DELETE FROM media_tin_tuyen_dung WHERE id = ? AND id_tin_tuyen_dung = ?', [mediaId, id]);

    res.json({
      success: true,
      message: 'Xóa media thành công'
    });
  } catch (error) {
    next(error);
  }
};

export const getMediaTinTuyenDung = async (req, res, next) => {
  try {
    const { id } = req.params; // id của tin_tuyen_dung

    const [media] = await pool.execute(
      'SELECT * FROM media_tin_tuyen_dung WHERE id_tin_tuyen_dung = ? ORDER BY thu_tu ASC, ngay_upload ASC',
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

