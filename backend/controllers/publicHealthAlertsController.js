import pool from '../config/database.js';

/**
 * Lấy danh sách cảnh báo chỉ số sức khỏe công khai
 * Hiển thị các chỉ số cảnh báo - nguy hiểm ở lần cập nhật cuối cùng của mỗi chỉ số
 */
export const getPublicHealthAlerts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Lấy cảnh báo từ tất cả các chỉ số sức khỏe
    // Mỗi bệnh nhân chỉ hiển thị lần cập nhật cuối cùng của mỗi loại chỉ số có cảnh báo
    
    const alerts = [];

    // 1. Huyết áp
    const [huyetApAlerts] = await pool.execute(
      `SELECT 
        ha.id,
        ha.id_benh_nhan,
        bn.ho_ten as ten_benh_nhan,
        'huyet_ap' as loai_chi_so,
        'Huyết áp' as ten_chi_so,
        CONCAT(ha.tam_thu, '/', ha.tam_truong, ' mmHg') as gia_tri,
        ha.muc_do,
        ha.noi_dung_canh_bao,
        ha.thoi_gian_do as thoi_gian,
        ha.ngay_cap_nhat AS updated_at
      FROM huyet_ap ha
      JOIN benh_nhan bn ON ha.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
        AND ha.muc_do IN ('canh_bao', 'nguy_hiem')
        AND ha.id = (
          SELECT id FROM huyet_ap ha2
          WHERE ha2.id_benh_nhan = ha.id_benh_nhan
            AND ha2.muc_do IN ('canh_bao', 'nguy_hiem')
          ORDER BY ha2.ngay_cap_nhat DESC
          LIMIT 1
        )
      ORDER BY ha.ngay_cap_nhat DESC
      LIMIT ?`,
      [limit]
    );

    // 2. Nhịp tim
    const [nhipTimAlerts] = await pool.execute(
      `SELECT 
        nt.id,
        nt.id_benh_nhan,
        bn.ho_ten as ten_benh_nhan,
        'nhip_tim' as loai_chi_so,
        'Nhịp tim' as ten_chi_so,
        CONCAT(nt.gia_tri_nhip_tim, ' bpm') as gia_tri,
        nt.muc_do,
        nt.noi_dung_canh_bao,
        nt.thoi_gian_do as thoi_gian,
        nt.ngay_cap_nhat AS updated_at
      FROM nhip_tim nt
      JOIN benh_nhan bn ON nt.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
        AND nt.muc_do IN ('canh_bao', 'nguy_hiem')
        AND nt.id = (
          SELECT id FROM nhip_tim nt2
          WHERE nt2.id_benh_nhan = nt.id_benh_nhan
            AND nt2.muc_do IN ('canh_bao', 'nguy_hiem')
          ORDER BY nt2.ngay_cap_nhat DESC
          LIMIT 1
        )
      ORDER BY nt.ngay_cap_nhat DESC
      LIMIT ?`,
      [limit]
    );

    // 3. Đường huyết
    const [duongHuyetAlerts] = await pool.execute(
      `SELECT 
        dh.id,
        dh.id_benh_nhan,
        bn.ho_ten as ten_benh_nhan,
        'duong_huyet' as loai_chi_so,
        'Đường huyết' as ten_chi_so,
        CONCAT(dh.gia_tri_duong_huyet, ' mmol/L') as gia_tri,
        dh.muc_do,
        dh.noi_dung_canh_bao,
        dh.thoi_gian_do as thoi_gian,
        dh.ngay_cap_nhat AS updated_at
      FROM duong_huyet dh
      JOIN benh_nhan bn ON dh.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
        AND dh.muc_do IN ('canh_bao', 'nguy_hiem')
        AND dh.id = (
          SELECT id FROM duong_huyet dh2
          WHERE dh2.id_benh_nhan = dh.id_benh_nhan
            AND dh2.muc_do IN ('canh_bao', 'nguy_hiem')
          ORDER BY dh2.ngay_cap_nhat DESC
          LIMIT 1
        )
      ORDER BY dh.ngay_cap_nhat DESC
      LIMIT ?`,
      [limit]
    );

    // 4. SpO2
    const [spo2Alerts] = await pool.execute(
      `SELECT 
        sp.id,
        sp.id_benh_nhan,
        bn.ho_ten as ten_benh_nhan,
        'spo2' as loai_chi_so,
        'SpO2' as ten_chi_so,
        CONCAT(sp.gia_tri_spo2, ' %') as gia_tri,
        sp.muc_do,
        sp.noi_dung_canh_bao,
        sp.thoi_gian_do as thoi_gian,
        sp.ngay_cap_nhat AS updated_at
      FROM spo2 sp
      JOIN benh_nhan bn ON sp.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
        AND sp.muc_do IN ('canh_bao', 'nguy_hiem')
        AND sp.id = (
          SELECT id FROM spo2 sp2
          WHERE sp2.id_benh_nhan = sp.id_benh_nhan
            AND sp2.muc_do IN ('canh_bao', 'nguy_hiem')
          ORDER BY sp2.ngay_cap_nhat DESC
          LIMIT 1
        )
      ORDER BY sp.ngay_cap_nhat DESC
      LIMIT ?`,
      [limit]
    );

    // 5. Nhiệt độ
    const [nhietDoAlerts] = await pool.execute(
      `SELECT 
        nd.id,
        nd.id_benh_nhan,
        bn.ho_ten as ten_benh_nhan,
        'nhiet_do' as loai_chi_so,
        'Nhiệt độ' as ten_chi_so,
        CONCAT(nd.gia_tri_nhiet_do, ' °C') as gia_tri,
        nd.muc_do,
        nd.noi_dung_canh_bao,
        nd.thoi_gian_do as thoi_gian,
        nd.ngay_cap_nhat AS updated_at
      FROM nhiet_do nd
      JOIN benh_nhan bn ON nd.id_benh_nhan = bn.id
      WHERE bn.da_xoa = 0
        AND nd.muc_do IN ('canh_bao', 'nguy_hiem')
        AND nd.id = (
          SELECT id FROM nhiet_do nd2
          WHERE nd2.id_benh_nhan = nd.id_benh_nhan
            AND nd2.muc_do IN ('canh_bao', 'nguy_hiem')
          ORDER BY nd2.ngay_cap_nhat DESC
          LIMIT 1
        )
      ORDER BY nd.ngay_cap_nhat DESC
      LIMIT ?`,
      [limit]
    );

    // Gộp tất cả cảnh báo và sắp xếp theo thời gian cập nhật mới nhất
    const allAlerts = [
      ...huyetApAlerts,
      ...nhipTimAlerts,
      ...duongHuyetAlerts,
      ...spo2Alerts,
      ...nhietDoAlerts
    ].sort((a, b) => new Date(b.updated_at || b.thoi_gian) - new Date(a.updated_at || a.thoi_gian))
      .slice(0, limit);

    res.json({
      success: true,
      data: allAlerts,
      total: allAlerts.length
    });
  } catch (error) {
    console.error('Error getting public health alerts:', error);
    next(error);
  }
};

