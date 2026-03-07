import pool from '../config/database.js';

export const getDashboard = async (req, res, next) => {
  try {
    // Total patients
    const [totalPatients] = await pool.execute(
      'SELECT COUNT(*) as total FROM benh_nhan WHERE da_xoa = 0'
    );

    // Patients by service type
    const [patientsByService] = await pool.execute(
      `SELECT dv.ten_dich_vu as loai_dich_vu, COUNT(DISTINCT bndv.id_benh_nhan) as so_luong 
       FROM benh_nhan_dich_vu bndv
       JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
       JOIN benh_nhan bn ON bndv.id_benh_nhan = bn.id
       WHERE bn.da_xoa = 0 AND bndv.trang_thai = 'dang_su_dung'
       GROUP BY dv.ten_dich_vu`
    );

    // Active staff
    const [activeStaff] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM tai_khoan 
       WHERE vai_tro IN ('dieu_duong', 'dieu_duong_truong') 
       AND trang_thai = 'active' AND da_xoa = 0`
    );

    // Today's appointments
    const [todayAppointments] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM lich_kham 
       WHERE DATE(thoi_gian) = CURDATE()`
    );

    // Today's consultations
    const [todayConsultations] = await pool.execute(
      `SELECT COUNT(*) as total 
       FROM lich_hen_tu_van 
       WHERE DATE(ngay_mong_muon) = CURDATE() 
       AND trang_thai IN ('cho_xac_nhan', 'da_xac_nhan')`
    );

    // Recent vital signs alerts (abnormal values) - Đã xóa vì không còn bảng chi_so_sinh_ton
    const vitalSignsAlerts = [];

    // Upcoming events
    const [upcomingEvents] = await pool.execute(
      `SELECT * FROM su_kien 
       WHERE ngay >= CURDATE() AND da_xoa = 0 
       ORDER BY ngay ASC 
       LIMIT 5`
    );

    // Staff on duty today
    const [staffOnDuty] = await pool.execute(
      `SELECT COUNT(DISTINCT lpc.id_tai_khoan) as total 
       FROM lich_phan_ca lpc
       JOIN tai_khoan tk ON lpc.id_tai_khoan = tk.id
       WHERE DATE(lpc.ngay) = CURDATE() 
         AND lpc.trang_thai != 'vang'
         AND tk.da_xoa = 0`
    );

    // Recent activities - Get recent patients and appointments separately then combine
    const [recentBenhNhans] = await pool.execute(
      `SELECT 'benh_nhan' as type, ho_ten as title, ngay_tao as time 
       FROM benh_nhan 
       WHERE da_xoa = 0 
       ORDER BY ngay_tao DESC LIMIT 5`
    );

    const [recentLichKhams] = await pool.execute(
      `SELECT 'lich_kham' as type, CONCAT('Lịch khám - ', bn.ho_ten) as title, lk.ngay_tao as time
       FROM lich_kham lk
       JOIN benh_nhan bn ON lk.id_benh_nhan = bn.id
       ORDER BY lk.ngay_tao DESC LIMIT 5`
    );

    // Combine and sort
    const recentActivities = [...recentBenhNhans, ...recentLichKhams]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 10);

    // Số người sử dụng dịch vụ theo tháng (12 tháng gần nhất, theo từng dịch vụ)
    const [serviceUsageByMonth] = await pool.execute(
      `SELECT 
        dv.ten_dich_vu,
        DATE_FORMAT(bndv.ngay_bat_dau, '%Y-%m') as thang,
        COUNT(DISTINCT bndv.id_benh_nhan) as so_nguoi
      FROM benh_nhan_dich_vu bndv
      JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
      JOIN benh_nhan bn ON bndv.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0 
        AND bndv.ngay_bat_dau >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY dv.ten_dich_vu, DATE_FORMAT(bndv.ngay_bat_dau, '%Y-%m')
      ORDER BY dv.ten_dich_vu, thang`
    );

    // Tổng số người nhập viện theo tháng (12 tháng gần nhất)
    const [admissionsByMonth] = await pool.execute(
      `SELECT 
        DATE_FORMAT(ngay_nhap_vien, '%Y-%m') as thang,
        COUNT(*) as so_nguoi_nhap_vien
      FROM benh_nhan
      WHERE da_xoa = 0
        AND ngay_nhap_vien IS NOT NULL
        AND ngay_nhap_vien >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(ngay_nhap_vien, '%Y-%m')
      ORDER BY thang`
    );

    // Danh sách công việc hôm nay
    const [todayTasks] = await pool.execute(
      `SELECT 
        cv.id,
        cv.ten_cong_viec,
        cv.thoi_gian_du_kien,
        COALESCE(pc.trang_thai, 'chua_lam') as trang_thai,
        COALESCE(tk.ho_ten, '') as ten_nguoi_phu_trach,
        COALESCE(bn.ho_ten, '') as ten_benh_nhan
      FROM cong_viec cv
      LEFT JOIN phan_cong_cong_viec pc ON cv.id = pc.id_cong_viec
      LEFT JOIN tai_khoan tk ON pc.id_dieu_duong = tk.id AND tk.da_xoa = 0
      LEFT JOIN benh_nhan bn ON pc.id_benh_nhan = bn.id AND (bn.da_xoa = 0 OR bn.da_xoa IS NULL)
      WHERE cv.thoi_gian_du_kien IS NOT NULL
        AND DATE(cv.thoi_gian_du_kien) = CURDATE()
      ORDER BY cv.thoi_gian_du_kien ASC
      LIMIT 20`
    );

    // Danh sách nhân viên trực ca tại viện hôm nay
    // Hiển thị tất cả ca trực hôm nay (trừ những ca vắng mặt)
    const [staffOnDutyList] = await pool.execute(
      `SELECT 
        tk.id,
        tk.ho_ten,
        tk.so_dien_thoai,
        tk.email,
        lpc.ca,
        lpc.trang_thai,
        lpc.gio_bat_dau,
        lpc.gio_ket_thuc
      FROM lich_phan_ca lpc
      JOIN tai_khoan tk ON lpc.id_tai_khoan = tk.id
      WHERE DATE(lpc.ngay) = CURDATE()
        AND lpc.trang_thai != 'vang'
        AND tk.da_xoa = 0
      ORDER BY 
        CASE lpc.ca
          WHEN 'sang' THEN 1
          WHEN 'chieu' THEN 2
          WHEN 'dem' THEN 3
        END,
        tk.ho_ten`
    );

    res.json({
      success: true,
      data: {
        tong_so_benh_nhan: totalPatients[0].total,
        benh_nhan_theo_dich_vu: patientsByService,
        nhan_vien_dang_lam: activeStaff[0].total,
        nhan_vien_truc_hom_nay: staffOnDuty[0].total,
        lich_kham_hom_nay: todayAppointments[0].total,
        lich_hen_tu_van_hom_nay: todayConsultations[0].total,
        canh_bao_chi_so: vitalSignsAlerts,
        su_kien_sap_toi: upcomingEvents,
        hoat_dong_gan_day: recentActivities,
        su_dung_dich_vu_theo_thang: serviceUsageByMonth,
        nguoi_nhap_vien_theo_thang: admissionsByMonth,
        cong_viec_hom_nay: todayTasks,
        nhan_vien_truc_ca_hom_nay: staffOnDutyList
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBaoCao = async (req, res, next) => {
  try {
    const { type, start_date, end_date } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn loại báo cáo'
      });
    }

    switch (type) {
      case 'benh_nhan':
        const [benhNhanReport] = await pool.execute(
          `SELECT 
            COUNT(DISTINCT bn.id) as tong_so,
            COUNT(DISTINCT CASE WHEN bndv.trang_thai = 'dang_su_dung' AND dv.ten_dich_vu LIKE '%nội trú%' THEN bn.id END) as noi_tru,
            COUNT(DISTINCT CASE WHEN bndv.trang_thai = 'dang_su_dung' AND dv.ten_dich_vu LIKE '%bán ngày%' THEN bn.id END) as ban_ngay,
            COUNT(DISTINCT CASE WHEN bndv.trang_thai = 'dang_su_dung' AND dv.ten_dich_vu LIKE '%tại nhà%' THEN bn.id END) as tai_nha,
            COUNT(CASE WHEN bn.kha_nang_sinh_hoat = 'doc_lap' THEN 1 END) as doc_lap,
            COUNT(CASE WHEN bn.kha_nang_sinh_hoat = 'ho_tro' THEN 1 END) as ho_tro,
            COUNT(CASE WHEN bn.kha_nang_sinh_hoat = 'phu_thuoc' THEN 1 END) as phu_thuoc
           FROM benh_nhan bn
           LEFT JOIN benh_nhan_dich_vu bndv ON bn.id = bndv.id_benh_nhan AND bndv.trang_thai = 'dang_su_dung'
           LEFT JOIN dich_vu dv ON bndv.id_dich_vu = dv.id
           WHERE bn.da_xoa = 0
           ${start_date && end_date ? 'AND DATE(bn.ngay_nhap_vien) BETWEEN ? AND ?' : ''}`,
          start_date && end_date ? [start_date, end_date] : []
        );
        return res.json({
          success: true,
          data: benhNhanReport[0]
        });

      case 'nhan_vien':
        const [nhanVienReport] = await pool.execute(
          `SELECT 
            COUNT(*) as tong_so,
            COUNT(CASE WHEN vai_tro = 'dieu_duong' THEN 1 END) as dieu_duong,
            COUNT(CASE WHEN vai_tro = 'dieu_duong_truong' THEN 1 END) as dieu_duong_truong,
            COUNT(CASE WHEN trang_thai = 'active' THEN 1 END) as dang_lam,
            COUNT(CASE WHEN trang_thai = 'inactive' THEN 1 END) as nghi_viec
           FROM tai_khoan 
           WHERE vai_tro IN ('dieu_duong', 'dieu_duong_truong') AND da_xoa = 0`
        );
        return res.json({
          success: true,
          data: nhanVienReport[0]
        });

      case 'lich_kham':
        const [lichKhamReport] = await pool.execute(
          `SELECT 
            COUNT(*) as tong_so,
            COUNT(CASE WHEN loai_kham = 'tong_quat' THEN 1 END) as tong_quat,
            COUNT(CASE WHEN loai_kham = 'chuyen_khoa' THEN 1 END) as chuyen_khoa,
            COUNT(CASE WHEN loai_kham = 'xet_nghiem' THEN 1 END) as xet_nghiem,
            COUNT(CASE WHEN trang_thai = 'da_kham' THEN 1 END) as da_kham,
            COUNT(CASE WHEN trang_thai = 'cho_kham' THEN 1 END) as cho_kham
           FROM lich_kham
           ${start_date && end_date ? 'WHERE DATE(thoi_gian) BETWEEN ? AND ?' : ''}`,
          start_date && end_date ? [start_date, end_date] : []
        );
        return res.json({
          success: true,
          data: lichKhamReport[0]
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Loại báo cáo không hợp lệ'
        });
    }
  } catch (error) {
    next(error);
  }
};

