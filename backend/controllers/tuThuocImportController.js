import XLSX from 'xlsx';
import pool from '../config/database.js';
import { formatDateForDB, getNowForDB } from '../utils/dateUtils.js';
import { computeTrangThaiTon } from '../utils/tuThuocUtils.js';
import {
  buildTuThuocTemplate,
  buildPhanLoaiDanhMucWorkbook,
  parseTuThuocWorkbook,
} from '../utils/tuThuocImportUtils.js';
import { workbookToBuffer } from '../utils/lichThangImportUtils.js';

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
  // Không dùng cellDates: ngày được đọc dạng serial Excel để tránh lệch múi giờ
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
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

const ensurePhanLoaiIds = async (connection, items, ngayTao) => {
  const createdIds = new Map();
  for (const item of items) {
    if (!item.phan_loai_moi) continue;
    const key = item.ten_phan_loai.toLowerCase();
    if (!createdIds.has(key)) {
      const [existing] = await connection.execute(
        'SELECT id FROM phan_loai_thuoc WHERE LOWER(TRIM(ten_loai)) = LOWER(TRIM(?)) LIMIT 1',
        [item.ten_phan_loai]
      );
      if (existing[0]) {
        createdIds.set(key, existing[0].id);
      } else {
        const [insertResult] = await connection.execute(
          'INSERT INTO phan_loai_thuoc (ten_loai, ngay_tao, ngay_cap_nhat) VALUES (?, ?, ?)',
          [item.ten_phan_loai, ngayTao, ngayTao]
        );
        createdIds.set(key, insertResult.insertId);
      }
    }
    item.id_phan_loai = createdIds.get(key);
  }
  return createdIds.size;
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
    const phanLoaiCreated = await ensurePhanLoaiIds(connection, validItems, ngayTao);

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
      message: `Import thành công: ${inserted} thêm mới, ${updated} cập nhật, ${skipped} bỏ qua (trùng tên)`
        + (phanLoaiCreated > 0 ? `, ${phanLoaiCreated} phân loại mới` : ''),
      data: {
        che_do: cheDo,
        inserted,
        updated,
        skipped,
        phan_loai_created: phanLoaiCreated,
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
