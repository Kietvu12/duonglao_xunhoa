import pool from '../config/database.js';
import { getNowForDB } from '../utils/dateUtils.js';
import { createNotification } from '../services/notificationService.js';
import {
  buildPhanCaTemplate,
  buildCongViecTemplate,
  buildPhanCaTemplateForNhanVien,
  buildCongViecTemplateForNhanVien,
  buildCongViecTemplateForBenhNhan,
  buildNhanVienDanhMucWorkbook,
  buildBenhNhanDanhMucWorkbook,
  getMonthRange,
  parseLichThangWorkbook,
  parseWorkbookFromBuffer,
  workbookToBuffer
} from '../utils/lichThangImportUtils.js';

const loadReferenceData = async () => {
  const [nhanViens] = await pool.execute(
    `SELECT hsnv.id, tk.id as id_tai_khoan, tk.ho_ten, tk.vai_tro
     FROM ho_so_nhan_vien hsnv
     INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
     WHERE tk.da_xoa = 0`
  );

  const [benhNhans] = await pool.execute(
    `SELECT id, ho_ten FROM benh_nhan WHERE da_xoa = 0 ORDER BY ho_ten ASC`
  );

  return { nhanViens, benhNhans };
};

const loadNhanVienByHoSoId = async (idHoSo) => {
  const [rows] = await pool.execute(
    `SELECT hsnv.id, tk.id as id_tai_khoan, tk.ho_ten, tk.vai_tro
     FROM ho_so_nhan_vien hsnv
     INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
     WHERE hsnv.id = ? AND tk.da_xoa = 0`,
    [idHoSo]
  );
  return rows[0] || null;
};

const loadBenhNhanById = async (idBenhNhan) => {
  const [rows] = await pool.execute(
    `SELECT id, ho_ten FROM benh_nhan WHERE id = ? AND da_xoa = 0`,
    [idBenhNhan]
  );
  return rows[0] || null;
};

const loadBenhNhanPhuTrach = async (idHoSo) => {
  const [rows] = await pool.execute(
    `SELECT b.id, b.ho_ten
     FROM dieu_duong_benh_nhan ddbn
     INNER JOIN benh_nhan b ON ddbn.id_benh_nhan = b.id
     WHERE ddbn.id_dieu_duong = ? AND b.da_xoa = 0 AND ddbn.trang_thai = 'dang_quan_ly'
     ORDER BY b.ho_ten ASC`,
    [idHoSo]
  );
  return rows;
};

const loadDieuDuongPhuTrach = async (idBenhNhan) => {
  const [rows] = await pool.execute(
    `SELECT hsnv.id, tk.id as id_tai_khoan, tk.ho_ten, tk.vai_tro
     FROM dieu_duong_benh_nhan ddbn
     INNER JOIN ho_so_nhan_vien hsnv ON ddbn.id_dieu_duong = hsnv.id
     INNER JOIN tai_khoan tk ON hsnv.id_tai_khoan = tk.id
     WHERE ddbn.id_benh_nhan = ? AND tk.da_xoa = 0 AND ddbn.trang_thai = 'dang_quan_ly'
     ORDER BY tk.ho_ten ASC`,
    [idBenhNhan]
  );
  return rows;
};

const buildScopeForNhanVienPhanCa = (nhanVien) => ({
  type: 'nhan_vien_phan_ca',
  id_ho_so: nhanVien.id,
  id_tai_khoan: nhanVien.id_tai_khoan,
  ho_ten: nhanVien.ho_ten,
});

const buildScopeForNhanVienCongViec = (nhanVien, benhNhans) => ({
  type: 'nhan_vien_cong_viec',
  id_ho_so: nhanVien.id,
  ho_ten: nhanVien.ho_ten,
  allowedBenhNhanIds: new Set(benhNhans.map((bn) => String(bn.id))),
});

const buildScopeForBenhNhanCongViec = (benhNhan, nhanViens) => ({
  type: 'benh_nhan_cong_viec',
  id_benh_nhan: benhNhan.id,
  ho_ten: benhNhan.ho_ten,
  allowedDieuDuongIds: new Set(nhanViens.map((nv) => String(nv.id))),
});

const parseImportFile = async (req, res, mode, scope = null) => {
  const thang = Number(req.body.thang || req.query.thang);
  const nam = Number(req.body.nam || req.query.nam);

  if (!thang || !nam || thang < 1 || thang > 12) {
    return {
      error: res.status(400).json({
        success: false,
        message: 'Vui lòng chọn tháng và năm hợp lệ'
      })
    };
  }

  if (!req.file?.buffer) {
    return {
      error: res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file Excel (.xlsx, .xls)'
      })
    };
  }

  let nhanViens = [];
  let benhNhans = [];

  if (scope?.type === 'nhan_vien_phan_ca' || scope?.type === 'nhan_vien_cong_viec') {
    nhanViens = [{ id: scope.id_ho_so, id_tai_khoan: scope.id_tai_khoan, ho_ten: scope.ho_ten }];
    if (scope.type === 'nhan_vien_cong_viec') {
      benhNhans = await loadBenhNhanPhuTrach(scope.id_ho_so);
    }
  } else if (scope?.type === 'benh_nhan_cong_viec') {
    benhNhans = [{ id: scope.id_benh_nhan, ho_ten: scope.ho_ten }];
    nhanViens = await loadDieuDuongPhuTrach(scope.id_benh_nhan);
  } else {
    const ref = await loadReferenceData();
    nhanViens = ref.nhanViens;
    benhNhans = ref.benhNhans;
  }

  const workbook = parseWorkbookFromBuffer(req.file.buffer);
  const parsed = parseLichThangWorkbook(workbook, { thang, nam, nhanViens, benhNhans, mode, scope });

  return { thang, nam, parsed, nhanViens, benhNhans, scope };
};

const downloadTemplate = (mode) => async (req, res, next) => {
  try {
    const thang = Number(req.query.thang) || new Date().getMonth() + 1;
    const nam = Number(req.query.nam) || new Date().getFullYear();

    const { nhanViens, benhNhans } = await loadReferenceData();
    const workbook = mode === 'phan_ca'
      ? buildPhanCaTemplate({ thang, nam, nhanViens })
      : buildCongViecTemplate({ thang, nam, nhanViens, benhNhans });
    const buffer = workbookToBuffer(workbook);

    const prefix = mode === 'phan_ca' ? 'mau-phan-ca' : 'mau-cong-viec';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${prefix}-${nam}-${String(thang).padStart(2, '0')}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const previewImport = (mode, scope = null) => async (req, res, next) => {
  try {
    const result = await parseImportFile(req, res, mode, scope);
    if (result.error) return result.error;

    const { thang, nam, parsed } = result;

    res.json({
      success: true,
      data: {
        thang,
        nam,
        ...parsed
      }
    });
  } catch (error) {
    next(error);
  }
};

const deleteScopedData = async (connection, { mode, scope, start, end }) => {
  if (mode === 'phan_ca' && scope?.type === 'nhan_vien_phan_ca') {
    await connection.execute(
      `DELETE FROM lich_phan_ca
       WHERE id_tai_khoan = ? AND DATE(ngay) BETWEEN ? AND ?`,
      [scope.id_tai_khoan, start, end]
    );
    return;
  }

  if (mode === 'cong_viec' && scope?.type === 'nhan_vien_cong_viec') {
    const [congViecIds] = await connection.execute(
      `SELECT cv.id
       FROM cong_viec cv
       INNER JOIN phan_cong_cong_viec pc ON cv.id = pc.id_cong_viec
       WHERE pc.id_dieu_duong = ? AND DATE(cv.thoi_gian_du_kien) BETWEEN ? AND ?`,
      [scope.id_ho_so, start, end]
    );
    if (congViecIds.length > 0) {
      const ids = congViecIds.map((row) => row.id);
      const placeholders = ids.map(() => '?').join(',');
      await connection.execute(`DELETE FROM phan_cong_cong_viec WHERE id_cong_viec IN (${placeholders})`, ids);
      await connection.execute(`DELETE FROM cong_viec WHERE id IN (${placeholders})`, ids);
    }
    return;
  }

  if (mode === 'cong_viec' && scope?.type === 'benh_nhan_cong_viec') {
    const [congViecIds] = await connection.execute(
      `SELECT cv.id
       FROM cong_viec cv
       INNER JOIN phan_cong_cong_viec pc ON cv.id = pc.id_cong_viec
       WHERE pc.id_benh_nhan = ? AND DATE(cv.thoi_gian_du_kien) BETWEEN ? AND ?`,
      [scope.id_benh_nhan, start, end]
    );
    if (congViecIds.length > 0) {
      const ids = congViecIds.map((row) => row.id);
      const placeholders = ids.map(() => '?').join(',');
      await connection.execute(`DELETE FROM phan_cong_cong_viec WHERE id_cong_viec IN (${placeholders})`, ids);
      await connection.execute(`DELETE FROM cong_viec WHERE id IN (${placeholders})`, ids);
    }
    return;
  }

  if (mode === 'cong_viec') {
    const [congViecIds] = await connection.execute(
      `SELECT id FROM cong_viec WHERE DATE(thoi_gian_du_kien) BETWEEN ? AND ?`,
      [start, end]
    );
    if (congViecIds.length > 0) {
      const ids = congViecIds.map((row) => row.id);
      const placeholders = ids.map(() => '?').join(',');
      await connection.execute(`DELETE FROM phan_cong_cong_viec WHERE id_cong_viec IN (${placeholders})`, ids);
      await connection.execute(`DELETE FROM cong_viec WHERE id IN (${placeholders})`, ids);
    }
    return;
  }

  if (mode === 'phan_ca') {
    await connection.execute(
      `DELETE FROM lich_phan_ca WHERE DATE(ngay) BETWEEN ? AND ?`,
      [start, end]
    );
  }
};

const importData = (mode, scope = null) => async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const result = await parseImportFile(req, res, mode, scope);
    if (result.error) return result.error;

    const { thang, nam, parsed } = result;
    const cheDo = req.body.che_do === 'thay_the_thang' ? 'thay_the_thang' : 'bo_sung';

    if (parsed.summary.tong_loi > 0) {
      return res.status(400).json({
        success: false,
        message: 'File có lỗi, vui lòng sửa trước khi import',
        data: parsed
      });
    }

    const validPhanCa = parsed.phanCa.filter((r) => r.valid);
    const validCongViec = parsed.congViec.filter((r) => r.valid);

    if (mode === 'phan_ca' && validPhanCa.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dòng phân ca hợp lệ để import'
      });
    }

    if (mode === 'cong_viec' && validCongViec.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dòng công việc hợp lệ để import'
      });
    }

    const { start, end } = getMonthRange(thang, nam);
    const ngayTao = getNowForDB();

    await connection.beginTransaction();

    if (cheDo === 'thay_the_thang') {
      await deleteScopedData(connection, { mode, scope, start, end });
    }

    let insertedPhanCa = 0;
    let skippedPhanCa = 0;
    let insertedCongViec = 0;
    let skippedCongViec = 0;

    if (mode === 'phan_ca') {
      for (const row of validPhanCa) {
        if (cheDo === 'bo_sung') {
          const [existing] = await connection.execute(
            `SELECT id FROM lich_phan_ca
             WHERE id_tai_khoan = ? AND ngay = ? AND ca = ?
               AND gio_bat_dau = ? AND gio_ket_thuc = ?`,
            [row.id_tai_khoan, row.ngay, row.ca, row.gio_bat_dau, row.gio_ket_thuc]
          );
          if (existing.length > 0) {
            skippedPhanCa += 1;
            continue;
          }
        }

        await connection.execute(
          `INSERT INTO lich_phan_ca (id_tai_khoan, ca, ngay, gio_bat_dau, gio_ket_thuc, trang_thai, ngay_tao)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [row.id_tai_khoan, row.ca, row.ngay, row.gio_bat_dau, row.gio_ket_thuc, row.trang_thai || 'du_kien', ngayTao]
        );
        insertedPhanCa += 1;
      }
    }

    if (mode === 'cong_viec') {
      for (const row of validCongViec) {
        if (cheDo === 'bo_sung') {
          const [existing] = await connection.execute(
            `SELECT cv.id
             FROM cong_viec cv
             LEFT JOIN phan_cong_cong_viec pc ON cv.id = pc.id_cong_viec
             WHERE cv.ten_cong_viec = ?
               AND cv.thoi_gian_du_kien = ?
               AND (pc.id_dieu_duong <=> ?)
               AND (pc.id_benh_nhan <=> ?)`,
            [row.ten_cong_viec, row.thoi_gian_du_kien, row.id_dieu_duong, row.id_benh_nhan]
          );
          if (existing.length > 0) {
            skippedCongViec += 1;
            continue;
          }
        }

        const [cvResult] = await connection.execute(
          `INSERT INTO cong_viec (ten_cong_viec, mo_ta, muc_uu_tien, thoi_gian_du_kien, id_nguoi_tao, ngay_tao)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [row.ten_cong_viec, row.mo_ta, row.muc_uu_tien, row.thoi_gian_du_kien, req.user.id, ngayTao]
        );

        if (row.id_dieu_duong || row.id_benh_nhan) {
          await connection.execute(
            `INSERT INTO phan_cong_cong_viec (id_cong_viec, id_dieu_duong, id_benh_nhan, ngay_tao)
             VALUES (?, ?, ?, ?)`,
            [cvResult.insertId, row.id_dieu_duong, row.id_benh_nhan, ngayTao]
          );

          if (row.id_dieu_duong) {
            const [hoSo] = await connection.execute(
              'SELECT id_tai_khoan FROM ho_so_nhan_vien WHERE id = ?',
              [row.id_dieu_duong]
            );
            if (hoSo[0]?.id_tai_khoan) {
              createNotification({
                id_nguoi_nhan: hoSo[0].id_tai_khoan,
                loai: 'cong_viec',
                tieu_de: 'Công việc mới',
                noi_dung: `Bạn có công việc mới: "${row.ten_cong_viec}" (${row.thoi_gian_du_kien})`,
                link: '/admin/cong-viec'
              }).catch((err) => console.error('Notification error:', err));
            }
          }
        }

        insertedCongViec += 1;
      }
    }

    await connection.commit();

    const message = mode === 'phan_ca'
      ? `Import phân ca tháng ${thang}/${nam} thành công`
      : `Import công việc tháng ${thang}/${nam} thành công`;

    res.json({
      success: true,
      message,
      data: {
        che_do: cheDo,
        thang,
        nam,
        phan_ca: { inserted: insertedPhanCa, skipped: skippedPhanCa },
        cong_viec: { inserted: insertedCongViec, skipped: skippedCongViec }
      }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const resolveNhanVienScope = async (req, res) => {
  const idHoSo = Number(req.params.idHoSo);
  if (!idHoSo) {
    return { error: res.status(400).json({ success: false, message: 'ID nhân viên không hợp lệ' }) };
  }
  const nhanVien = await loadNhanVienByHoSoId(idHoSo);
  if (!nhanVien) {
    return { error: res.status(404).json({ success: false, message: 'Không tìm thấy nhân viên' }) };
  }
  return { nhanVien };
};

const resolveBenhNhanScope = async (req, res) => {
  const idBenhNhan = Number(req.params.idBenhNhan);
  if (!idBenhNhan) {
    return { error: res.status(400).json({ success: false, message: 'ID bệnh nhân không hợp lệ' }) };
  }
  const benhNhan = await loadBenhNhanById(idBenhNhan);
  if (!benhNhan) {
    return { error: res.status(404).json({ success: false, message: 'Không tìm thấy bệnh nhân' }) };
  }
  return { benhNhan };
};

// --- Global import ---
export const downloadPhanCaTemplate = downloadTemplate('phan_ca');
export const previewPhanCaImport = previewImport('phan_ca');
export const importPhanCa = importData('phan_ca');

export const downloadNhanVienDanhMuc = async (req, res, next) => {
  try {
    const { nhanViens } = await loadReferenceData();
    const buffer = workbookToBuffer(buildNhanVienDanhMucWorkbook(nhanViens));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-nhan-vien.xlsx"');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const downloadCongViecTemplate = downloadTemplate('cong_viec');
export const previewCongViecImport = previewImport('cong_viec');
export const importCongViec = importData('cong_viec');

export const downloadBenhNhanDanhMuc = async (req, res, next) => {
  try {
    const { benhNhans } = await loadReferenceData();
    const buffer = workbookToBuffer(buildBenhNhanDanhMucWorkbook(benhNhans));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-benh-nhan.xlsx"');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

// --- Nhân viên scoped ---
export const downloadPhanCaTemplateForNhanVien = async (req, res, next) => {
  try {
    const resolved = await resolveNhanVienScope(req, res);
    if (resolved.error) return resolved.error;

    const thang = Number(req.query.thang) || new Date().getMonth() + 1;
    const nam = Number(req.query.nam) || new Date().getFullYear();
    const buffer = workbookToBuffer(buildPhanCaTemplateForNhanVien({ thang, nam, nhanVien: resolved.nhanVien }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mau-phan-ca-nv-${resolved.nhanVien.id}-${nam}-${String(thang).padStart(2, '0')}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const downloadBenhNhanPhuTrachForNhanVien = async (req, res, next) => {
  try {
    const resolved = await resolveNhanVienScope(req, res);
    if (resolved.error) return resolved.error;

    const benhNhans = await loadBenhNhanPhuTrach(resolved.nhanVien.id);
    const buffer = workbookToBuffer(buildBenhNhanDanhMucWorkbook(benhNhans));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="benh-nhan-phu-trach-nv-${resolved.nhanVien.id}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const previewPhanCaImportForNhanVien = async (req, res, next) => {
  const resolved = await resolveNhanVienScope(req, res);
  if (resolved.error) return resolved.error;
  return previewImport('phan_ca', buildScopeForNhanVienPhanCa(resolved.nhanVien))(req, res, next);
};

export const importPhanCaForNhanVien = async (req, res, next) => {
  const resolved = await resolveNhanVienScope(req, res);
  if (resolved.error) return resolved.error;
  return importData('phan_ca', buildScopeForNhanVienPhanCa(resolved.nhanVien))(req, res, next);
};

export const downloadCongViecTemplateForNhanVien = async (req, res, next) => {
  try {
    const resolved = await resolveNhanVienScope(req, res);
    if (resolved.error) return resolved.error;

    const thang = Number(req.query.thang) || new Date().getMonth() + 1;
    const nam = Number(req.query.nam) || new Date().getFullYear();
    const benhNhans = await loadBenhNhanPhuTrach(resolved.nhanVien.id);
    const buffer = workbookToBuffer(buildCongViecTemplateForNhanVien({
      thang, nam, nhanVien: resolved.nhanVien, benhNhans,
    }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mau-cong-viec-nv-${resolved.nhanVien.id}-${nam}-${String(thang).padStart(2, '0')}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const previewCongViecImportForNhanVien = async (req, res, next) => {
  const resolved = await resolveNhanVienScope(req, res);
  if (resolved.error) return resolved.error;
  const benhNhans = await loadBenhNhanPhuTrach(resolved.nhanVien.id);
  return previewImport('cong_viec', buildScopeForNhanVienCongViec(resolved.nhanVien, benhNhans))(req, res, next);
};

export const importCongViecForNhanVien = async (req, res, next) => {
  const resolved = await resolveNhanVienScope(req, res);
  if (resolved.error) return resolved.error;
  const benhNhans = await loadBenhNhanPhuTrach(resolved.nhanVien.id);
  return importData('cong_viec', buildScopeForNhanVienCongViec(resolved.nhanVien, benhNhans))(req, res, next);
};

// --- Bệnh nhân scoped ---
export const downloadCongViecTemplateForBenhNhan = async (req, res, next) => {
  try {
    const resolved = await resolveBenhNhanScope(req, res);
    if (resolved.error) return resolved.error;

    const thang = Number(req.query.thang) || new Date().getMonth() + 1;
    const nam = Number(req.query.nam) || new Date().getFullYear();
    const nhanViens = await loadDieuDuongPhuTrach(resolved.benhNhan.id);
    const buffer = workbookToBuffer(buildCongViecTemplateForBenhNhan({
      thang, nam, benhNhan: resolved.benhNhan, nhanViens,
    }));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mau-cong-viec-bn-${resolved.benhNhan.id}-${nam}-${String(thang).padStart(2, '0')}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const downloadDieuDuongPhuTrachForBenhNhan = async (req, res, next) => {
  try {
    const resolved = await resolveBenhNhanScope(req, res);
    if (resolved.error) return resolved.error;

    const nhanViens = await loadDieuDuongPhuTrach(resolved.benhNhan.id);
    const buffer = workbookToBuffer(buildNhanVienDanhMucWorkbook(nhanViens));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="dieu-duong-phu-trach-bn-${resolved.benhNhan.id}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

export const previewCongViecImportForBenhNhan = async (req, res, next) => {
  const resolved = await resolveBenhNhanScope(req, res);
  if (resolved.error) return resolved.error;
  const nhanViens = await loadDieuDuongPhuTrach(resolved.benhNhan.id);
  return previewImport('cong_viec', buildScopeForBenhNhanCongViec(resolved.benhNhan, nhanViens))(req, res, next);
};

export const importCongViecForBenhNhan = async (req, res, next) => {
  const resolved = await resolveBenhNhanScope(req, res);
  if (resolved.error) return resolved.error;
  const nhanViens = await loadDieuDuongPhuTrach(resolved.benhNhan.id);
  return importData('cong_viec', buildScopeForBenhNhanCongViec(resolved.benhNhan, nhanViens))(req, res, next);
};
