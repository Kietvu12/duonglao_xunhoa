import pool from '../config/database.js';
import { formatDateForDB, getNowForDB } from '../utils/dateUtils.js';
import { computeTrangThaiTon } from '../utils/tuThuocUtils.js';
import {
  buildTuThuocTemplate,
  buildPhanLoaiDanhMucWorkbook,
  parseTuThuocWorkbook,
} from '../utils/tuThuocImportUtils.js';
import { parseWorkbookFromBuffer, workbookToBuffer } from '../utils/lichThangImportUtils.js';

const loadPhanLoais = async () => {
  const [rows] = await pool.execute(
    'SELECT id, ten_loai, mo_ta FROM phan_loai_thuoc ORDER BY ten_loai ASC'
  );
  return rows;
};

const sendWorkbook = (res, workbook, fileName) => {
  const buffer = workbookToBuffer(workbook);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.send(buffer);
};

const parseImportFile = async (req) => {
  if (!req.file?.buffer) {
    return {
      error: { status: 400, message: 'Vui lòng chọn file Excel (.xlsx, .xls)' },
    };
  }

  const phanLoais = await loadPhanLoais();
  const workbook = parseWorkbookFromBuffer(req.file.buffer);
  const parsed = parseTuThuocWorkbook(workbook, { phanLoais });

  return { parsed, phanLoais };
};

const findExistingByName = async (connection, tenThuoc) => {
  const [rows] = await connection.execute(
    `SELECT id FROM tu_thuoc
     WHERE da_xoa = 0 AND LOWER(TRIM(ten_thuoc)) = LOWER(TRIM(?))
     LIMIT 1`,
    [tenThuoc]
  );
  return rows[0]?.id || null;
};

export const downloadTuThuocTemplate = async (req, res, next) => {
  try {
    const phanLoais = await loadPhanLoais();
    const workbook = buildTuThuocTemplate({ phanLoais });
    sendWorkbook(res, workbook, 'mau-import-tu-thuoc.xlsx');
  } catch (error) {
    next(error);
  }
};

export const downloadPhanLoaiDanhMuc = async (req, res, next) => {
  try {
    const phanLoais = await loadPhanLoais();
    const workbook = buildPhanLoaiDanhMucWorkbook(phanLoais);
    sendWorkbook(res, workbook, 'danh-muc-phan-loai-thuoc.xlsx');
  } catch (error) {
    next(error);
  }
};

export const previewTuThuocImport = async (req, res, next) => {
  try {
    const result = await parseImportFile(req);
    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    res.json({
      success: true,
      data: {
        summary: result.parsed.summary,
        items: result.parsed.items,
        errors: result.parsed.errors,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const importTuThuoc = async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const cheDo = req.body.che_do === 'cap_nhat' ? 'cap_nhat' : 'bo_sung';
    const result = await parseImportFile(req);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    const validItems = result.parsed.items.filter((item) => item.valid);
    if (validItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dòng hợp lệ để import',
        data: result.parsed,
      });
    }

    await connection.beginTransaction();

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const ngayTao = getNowForDB();

    for (const item of validItems) {
      const trangThai = computeTrangThaiTon(
        item.so_luong_ton,
        item.so_luong_toi_thieu,
        item.han_su_dung
      );
      const hanSuDung = item.han_su_dung ? formatDateForDB(item.han_su_dung) : null;

      const existingId = await findExistingByName(connection, item.ten_thuoc);

      if (existingId) {
        if (cheDo === 'cap_nhat') {
          await connection.execute(
            `UPDATE tu_thuoc SET
              id_phan_loai = ?, don_vi_tinh = ?, so_luong_ton = ?, so_luong_toi_thieu = ?,
              han_su_dung = ?, chi_dinh = ?, trang_thai = ?, ghi_chu = ?, ngay_cap_nhat = ?
             WHERE id = ?`,
            [
              item.id_phan_loai,
              item.don_vi_tinh,
              item.so_luong_ton,
              item.so_luong_toi_thieu,
              hanSuDung,
              item.chi_dinh,
              trangThai,
              item.ghi_chu,
              ngayTao,
              existingId,
            ]
          );
          updated += 1;
        } else {
          skipped += 1;
        }
        continue;
      }

      await connection.execute(
        `INSERT INTO tu_thuoc (
          id_phan_loai, ten_thuoc, don_vi_tinh, so_luong_ton, so_luong_toi_thieu,
          han_su_dung, chi_dinh, trang_thai, ghi_chu, ngay_tao
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id_phan_loai,
          item.ten_thuoc,
          item.don_vi_tinh,
          item.so_luong_ton,
          item.so_luong_toi_thieu,
          hanSuDung,
          item.chi_dinh,
          trangThai,
          item.ghi_chu,
          ngayTao,
        ]
      );
      inserted += 1;
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Import thành công: ${inserted} thêm mới, ${updated} cập nhật, ${skipped} bỏ qua (trùng tên)`,
      data: {
        che_do: cheDo,
        inserted,
        updated,
        skipped,
        summary: result.parsed.summary,
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};
