import pool from '../config/database.js';
import { buildLimitOffsetClause, sanitizeLimit } from '../utils/queryHelpers.js';
import { getNowForDB } from '../utils/dateUtils.js';

/**
 * Tính điểm số cho một công việc dựa trên mức độ ưu tiên và thời gian hoàn thành
 * @param {string} mucUuTien - Mức độ ưu tiên: 'thap', 'trung_binh', 'cao'
 * @param {Date|string} thoiGianDuKien - Thời gian dự kiến hoàn thành
 * @param {Date|string|null} thoiGianHoanThanh - Thời gian thực tế hoàn thành (null nếu chưa hoàn thành)
 * @returns {Promise<{diem: number, hoanThanhDungHan: boolean}>}
 */
export const tinhDiemCongViec = async (mucUuTien, thoiGianDuKien, thoiGianHoanThanh) => {
  if (!mucUuTien || !thoiGianDuKien) {
    return { diem: 0, hoanThanhDungHan: false };
  }

  // Lấy điểm số cho mức độ ưu tiên
  const [diemConfig] = await pool.execute(
    'SELECT diem_so FROM diem_muc_uu_tien WHERE muc_uu_tien = ?',
    [mucUuTien]
  );

  if (diemConfig.length === 0) {
    // Nếu chưa có cấu hình, trả về 0 điểm
    return { diem: 0, hoanThanhDungHan: false };
  }

  const diemSo = diemConfig[0].diem_so;

  // Nếu chưa hoàn thành, trả về 0 điểm
  if (!thoiGianHoanThanh) {
    return { diem: 0, hoanThanhDungHan: false };
  }

  // So sánh thời gian hoàn thành với thời gian dự kiến
  const thoiGianDuKienDate = new Date(thoiGianDuKien);
  const thoiGianHoanThanhDate = new Date(thoiGianHoanThanh);

  // Hoàn thành đúng hạn hoặc sớm hơn
  const hoanThanhDungHan = thoiGianHoanThanhDate <= thoiGianDuKienDate;

  return {
    diem: hoanThanhDungHan ? diemSo : 0,
    hoanThanhDungHan
  };
};

/**
 * Tính KPI cho một nhân viên trong một tháng/năm cụ thể
 */
export const tinhKPI = async (idTaiKhoan, thang, nam) => {
  try {
    // Lấy tất cả công việc được phân công cho nhân viên này trong tháng/năm
    const [congViecs] = await pool.execute(`
      SELECT 
        cv.id,
        cv.muc_uu_tien,
        cv.thoi_gian_du_kien,
        pc.trang_thai,
        pc.thoi_gian_hoan_thanh
      FROM phan_cong_cong_viec pc
      INNER JOIN cong_viec cv ON pc.id_cong_viec = cv.id
      INNER JOIN ho_so_nhan_vien hsv ON pc.id_dieu_duong = hsv.id
      WHERE hsv.id_tai_khoan = ?
        AND MONTH(cv.thoi_gian_du_kien) = ?
        AND YEAR(cv.thoi_gian_du_kien) = ?
    `, [idTaiKhoan, thang, nam]);

    let tongDiemKiemDuoc = 0;
    let tongDiemCongViec = 0;
    let soCongViecDuocGiao = congViecs.length;
    let soCongViecHoanThanhDungHan = 0;
    let soCongViecHoanThanhTreHan = 0;
    let soCongViecChuaHoanThanh = 0;

    // Lấy điểm số cho mỗi mức độ ưu tiên
    const [diemConfigs] = await pool.execute(
      'SELECT muc_uu_tien, diem_so FROM diem_muc_uu_tien'
    );
    const diemMap = {};
    diemConfigs.forEach(config => {
      diemMap[config.muc_uu_tien] = config.diem_so;
    });

    // Điểm mặc định nếu chưa có cấu hình
    const diemMacDinh = {
      'thap': 1,
      'trung_binh': 2,
      'cao': 3
    };

    for (const cv of congViecs) {
      const diemSo = diemMap[cv.muc_uu_tien] || diemMacDinh[cv.muc_uu_tien] || 0;
      tongDiemCongViec += diemSo;

      if (cv.trang_thai === 'hoan_thanh' && cv.thoi_gian_hoan_thanh) {
        const { diem, hoanThanhDungHan } = await tinhDiemCongViec(
          cv.muc_uu_tien,
          cv.thoi_gian_du_kien,
          cv.thoi_gian_hoan_thanh
        );
        tongDiemKiemDuoc += diem;

        if (hoanThanhDungHan) {
          soCongViecHoanThanhDungHan++;
        } else {
          soCongViecHoanThanhTreHan++;
        }
      } else {
        soCongViecChuaHoanThanh++;
      }
    }

    // Tính tỷ lệ KPI (%)
    const tyLeKPI = tongDiemCongViec > 0 
      ? (tongDiemKiemDuoc / tongDiemCongViec) * 100 
      : 0;

    return {
      id_tai_khoan: idTaiKhoan,
      thang,
      nam,
      tong_diem_kiem_duoc: tongDiemKiemDuoc,
      tong_diem_cong_viec: tongDiemCongViec,
      ty_le_kpi: Math.round(tyLeKPI * 100) / 100, // Làm tròn 2 chữ số thập phân
      so_cong_viec_duoc_giao: soCongViecDuocGiao,
      so_cong_viec_hoan_thanh_dung_han: soCongViecHoanThanhDungHan,
      so_cong_viec_hoan_thanh_tre_han: soCongViecHoanThanhTreHan,
      so_cong_viec_chua_hoan_thanh: soCongViecChuaHoanThanh
    };
  } catch (error) {
    console.error('Error calculating KPI:', error);
    throw error;
  }
};

/**
 * Lưu hoặc cập nhật KPI cho nhân viên
 */
export const luuKPI = async (kpiData) => {
  const {
    id_tai_khoan,
    thang,
    nam,
    tong_diem_kiem_duoc = 0,
    tong_diem_cong_viec = 0,
    ty_le_kpi = 0,
    so_cong_viec_duoc_giao = 0,
    so_cong_viec_hoan_thanh_dung_han = 0,
    so_cong_viec_hoan_thanh_tre_han = 0,
    so_cong_viec_chua_hoan_thanh = 0,
    ghi_chu = null
  } = kpiData;

  // Kiểm tra xem đã có KPI cho tháng/năm này chưa
  const [existing] = await pool.execute(
    'SELECT id FROM kpi_nhan_vien WHERE id_tai_khoan = ? AND thang = ? AND nam = ?',
    [id_tai_khoan, thang, nam]
  );

  const ngayCapNhatVN = getNowForDB();

  if (existing.length > 0) {
    // Cập nhật
    await pool.execute(
      `UPDATE kpi_nhan_vien SET 
        tong_diem_kiem_duoc = ?,
        tong_diem_cong_viec = ?,
        ty_le_kpi = ?,
        so_cong_viec_duoc_giao = ?,
        so_cong_viec_hoan_thanh_dung_han = ?,
        so_cong_viec_hoan_thanh_tre_han = ?,
        so_cong_viec_chua_hoan_thanh = ?,
        ghi_chu = ?,
        ngay_cap_nhat = ?
      WHERE id = ?`,
      [
        tong_diem_kiem_duoc,
        tong_diem_cong_viec,
        ty_le_kpi,
        so_cong_viec_duoc_giao,
        so_cong_viec_hoan_thanh_dung_han,
        so_cong_viec_hoan_thanh_tre_han,
        so_cong_viec_chua_hoan_thanh,
        ghi_chu,
        ngayCapNhatVN,
        existing[0].id
      ]
    );
    return existing[0].id;
  } else {
    // Tạo mới
    const ngayTaoVN = getNowForDB();
    const [result] = await pool.execute(
      `INSERT INTO kpi_nhan_vien (
        id_tai_khoan, thang, nam,
        tong_diem_kiem_duoc, tong_diem_cong_viec, ty_le_kpi,
        so_cong_viec_duoc_giao, so_cong_viec_hoan_thanh_dung_han,
        so_cong_viec_hoan_thanh_tre_han, so_cong_viec_chua_hoan_thanh,
        ghi_chu, ngay_tao, ngay_cap_nhat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_tai_khoan, thang, nam,
        tong_diem_kiem_duoc, tong_diem_cong_viec, ty_le_kpi,
        so_cong_viec_duoc_giao, so_cong_viec_hoan_thanh_dung_han,
        so_cong_viec_hoan_thanh_tre_han, so_cong_viec_chua_hoan_thanh,
        ghi_chu, ngayTaoVN, ngayCapNhatVN
      ]
    );
    return result.insertId;
  }
};

/**
 * API: Tính và lưu KPI cho nhân viên
 */
export const tinhVaTaoKPI = async (req, res, next) => {
  try {
    const { id_tai_khoan, thang, nam } = req.body;

    if (!id_tai_khoan || !thang || !nam) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp id_tai_khoan, thang, và nam'
      });
    }

    // Tính KPI
    const kpiData = await tinhKPI(id_tai_khoan, thang, nam);

    // Lưu vào database
    const kpiId = await luuKPI(kpiData);

    // Lấy thông tin nhân viên
    const [nhanVien] = await pool.execute(
      `SELECT tk.id, tk.ho_ten 
       FROM tai_khoan tk
       WHERE tk.id = ?`,
      [id_tai_khoan]
    );

    res.json({
      success: true,
      message: 'Tính KPI thành công',
      data: {
        ...kpiData,
        id: kpiId,
        ho_ten: nhanVien[0]?.ho_ten || null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API: Tính và lưu KPI cho tất cả nhân viên trong một tháng/năm
 */
export const tinhVaTaoKPITatCa = async (req, res, next) => {
  try {
    const now = new Date();
    const thang = Number(req.body?.thang || now.getMonth() + 1);
    const nam = Number(req.body?.nam || now.getFullYear());

    if (!Number.isInteger(thang) || thang < 1 || thang > 12 || !Number.isInteger(nam) || nam < 2000) {
      return res.status(400).json({
        success: false,
        message: 'Tháng hoặc năm không hợp lệ'
      });
    }

    const [nhanViens] = await pool.execute(
      `SELECT DISTINCT tk.id AS id_tai_khoan
       FROM tai_khoan tk
       INNER JOIN ho_so_nhan_vien hsnv ON hsnv.id_tai_khoan = tk.id
       WHERE tk.da_xoa = 0
         AND tk.vai_tro IN ('dieu_duong', 'dieu_duong_truong', 'quan_ly_y_te', 'quan_ly_nhan_su')`
    );

    if (nhanViens.length === 0) {
      return res.json({
        success: true,
        message: 'Không có nhân viên để tính KPI',
        data: {
          thang,
          nam,
          so_nhan_vien_da_xu_ly: 0,
          so_kpi_da_tinh: 0
        }
      });
    }

    let soKpiDaTinh = 0;
    for (const nv of nhanViens) {
      const kpiData = await tinhKPI(nv.id_tai_khoan, thang, nam);
      await luuKPI(kpiData);
      soKpiDaTinh++;
    }

    res.json({
      success: true,
      message: 'Tính KPI cho tất cả nhân viên thành công',
      data: {
        thang,
        nam,
        so_nhan_vien_da_xu_ly: nhanViens.length,
        so_kpi_da_tinh: soKpiDaTinh
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API: Lấy danh sách KPI
 */
export const getAllKPI = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, id_tai_khoan, thang, nam } = req.query;
    const safePage = Math.max(1, Math.floor(Number(page) || 1));
    const limitValue = sanitizeLimit(limit, 10);
    const offset = (safePage - 1) * limitValue;

    let query = `
      SELECT 
        kpi.*,
        tk.ho_ten,
        tk.email
      FROM kpi_nhan_vien kpi
      INNER JOIN tai_khoan tk ON kpi.id_tai_khoan = tk.id
      WHERE 1=1
    `;
    const params = [];

    if (id_tai_khoan) {
      query += ' AND kpi.id_tai_khoan = ?';
      params.push(id_tai_khoan);
    }

    if (thang) {
      query += ' AND kpi.thang = ?';
      params.push(thang);
    }

    if (nam) {
      query += ' AND kpi.nam = ?';
      params.push(nam);
    }

    query += ' ORDER BY kpi.nam DESC, kpi.thang DESC, tk.ho_ten ASC';
    query += buildLimitOffsetClause(limitValue, offset);

    const [kpis] = await pool.execute(query, params);

    // Đếm tổng số
    let countQuery = `
      SELECT COUNT(*) as total
      FROM kpi_nhan_vien kpi
      WHERE 1=1
    `;
    const countParams = [];
    if (id_tai_khoan) {
      countQuery += ' AND kpi.id_tai_khoan = ?';
      countParams.push(id_tai_khoan);
    }
    if (thang) {
      countQuery += ' AND kpi.thang = ?';
      countParams.push(thang);
    }
    if (nam) {
      countQuery += ' AND kpi.nam = ?';
      countParams.push(nam);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    res.json({
      success: true,
      data: kpis,
      pagination: {
        page: safePage,
        limit: limitValue,
        total,
        totalPages: Math.ceil(total / limitValue)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API: Lấy KPI của nhân viên hiện tại
 */
export const getMyKPI = async (req, res, next) => {
  try {
    const { thang, nam } = req.query;
    const idTaiKhoan = req.user.id;

    if (!thang || !nam) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp thang và nam'
      });
    }

    const [kpi] = await pool.execute(
      `SELECT 
        kpi.*,
        tk.ho_ten,
        tk.email
      FROM kpi_nhan_vien kpi
      INNER JOIN tai_khoan tk ON kpi.id_tai_khoan = tk.id
      WHERE kpi.id_tai_khoan = ? AND kpi.thang = ? AND kpi.nam = ?`,
      [idTaiKhoan, thang, nam]
    );

    if (kpi.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'Chưa có dữ liệu KPI cho tháng/năm này'
      });
    }

    res.json({
      success: true,
      data: kpi[0]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API: Cập nhật điểm số cho mức độ ưu tiên
 */
export const updateDiemMucUuTien = async (req, res, next) => {
  try {
    const { muc_uu_tien, diem_so } = req.body;

    if (!muc_uu_tien || diem_so === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp muc_uu_tien và diem_so'
      });
    }

    if (!['thap', 'trung_binh', 'cao'].includes(muc_uu_tien)) {
      return res.status(400).json({
        success: false,
        message: 'muc_uu_tien phải là: thap, trung_binh, hoặc cao'
      });
    }

    // Kiểm tra xem đã có chưa
    const [existing] = await pool.execute(
      'SELECT id FROM diem_muc_uu_tien WHERE muc_uu_tien = ?',
      [muc_uu_tien]
    );

    if (existing.length > 0) {
      // Cập nhật
      await pool.execute(
        'UPDATE diem_muc_uu_tien SET diem_so = ?, ngay_cap_nhat = ? WHERE id = ?',
        [diem_so, getNowForDB(), existing[0].id]
      );
    } else {
      // Tạo mới
      await pool.execute(
        'INSERT INTO diem_muc_uu_tien (muc_uu_tien, diem_so, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?, ?)',
        [muc_uu_tien, diem_so, getNowForDB(), getNowForDB()]
      );
    }

    // Sau khi đổi cấu hình điểm, tính lại toàn bộ KPI đã có
    const [kpiThangNamList] = await pool.execute(
      'SELECT DISTINCT thang, nam FROM kpi_nhan_vien'
    );

    let soBanGhiDaTinhLai = 0;
    for (const item of kpiThangNamList) {
      const [taiKhoans] = await pool.execute(
        'SELECT DISTINCT id_tai_khoan FROM kpi_nhan_vien WHERE thang = ? AND nam = ?',
        [item.thang, item.nam]
      );

      for (const tk of taiKhoans) {
        const kpiData = await tinhKPI(tk.id_tai_khoan, item.thang, item.nam);
        await luuKPI(kpiData);
        soBanGhiDaTinhLai++;
      }
    }

    res.json({
      success: true,
      message: 'Cập nhật điểm số thành công và đã tính lại KPI',
      data: {
        so_ban_ghi_da_tinh_lai: soBanGhiDaTinhLai
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * API: Lấy danh sách điểm số mức độ ưu tiên
 */
export const getDiemMucUuTien = async (req, res, next) => {
  try {
    const [diemConfigs] = await pool.execute(
      `SELECT * FROM diem_muc_uu_tien ORDER BY 
        CASE muc_uu_tien 
          WHEN "thap" THEN 1 
          WHEN "trung_binh" THEN 2 
          WHEN "cao" THEN 3 
        END`
    );

    res.json({
      success: true,
      data: diemConfigs
    });
  } catch (error) {
    next(error);
  }
};

