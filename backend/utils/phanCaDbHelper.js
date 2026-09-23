/**
 * Ghi lich_phan_ca — hỗ trợ cột roster (ma_ca, hinh_thuc_lam_viec, ghi_chu) khi đã migration.
 */
export const insertLichPhanCa = async (connection, row, ngayTao) => {
  if (!row.gio_bat_dau || !row.gio_ket_thuc) {
    const error = new Error('Thiếu giờ bắt đầu hoặc giờ kết thúc ca');
    error.status = 400;
    throw error;
  }
  const baseValues = [
    row.id_tai_khoan,
    row.ca,
    row.ngay,
    row.gio_bat_dau,
    row.gio_ket_thuc,
    row.trang_thai || 'du_kien',
    ngayTao,
  ];

  try {
    const [result] = await connection.execute(
      `INSERT INTO lich_phan_ca (
        id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai, ngay_tao,
        ma_ca, hinh_thuc_lam_viec, ghi_chu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ...baseValues,
        row.ma_ca || null,
        row.hinh_thuc_lam_viec || null,
        row.ghi_chu || null,
      ]
    );
    return result.insertId;
  } catch (error) {
    if (!error.message?.includes('Unknown column')) throw error;
    const [result] = await connection.execute(
      `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai, ngay_tao)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      baseValues
    );
    return result.insertId;
  }
};
