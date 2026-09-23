import XLSX from 'xlsx';
import { parseExcelDate } from './lichThangImportUtils.js';
import { mapRosterCellToShift } from './rosterCaMapping.js';

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeKey = (value) => normalizeText(value).toLowerCase();

export const parseNameFromRosterCell = (cell) => {
  const text = normalizeText(cell);
  if (!text) return '';
  return text.replace(/^\d+\.\s*/, '').trim();
};

/** Kiểm tra tên trên roster có khớp họ tên NV trong DB (tránh map nhầm fuzzy) */
export const isRosterNameAlignedWithDb = (rosterName, dbHoTen) => {
  const a = normalizeKey(parseNameFromRosterCell(rosterName));
  const b = normalizeKey(dbHoTen);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const aParts = a.split(/\s+/).filter(Boolean);
  const bParts = b.split(/\s+/).filter(Boolean);
  if (aParts.length >= 1 && bParts.length >= 1) {
    const aLast = aParts[aParts.length - 1];
    const bLast = bParts[bParts.length - 1];
    if (aLast === bLast && aParts[0][0] === bParts[0][0]) return true;
  }
  return false;
};

const isSectionHeaderRow = (nameCell) => {
  const t = normalizeText(nameCell);
  if (!t) return true;
  if (/^(I+|II+|III+|IV+|V+)\./.test(t)) return true;
  if (t.toLowerCase().includes('thời gian làm việc')) return true;
  if (t === 'Họ và tên' || t === 'Ký hiệu' || t === 'Ý nghĩa') return true;
  return false;
};

export const findMonthSheetName = (workbook, thang, nam) => {
  const target = `${Number(thang)}.${Number(nam)}`;
  for (const name of workbook.SheetNames) {
    const m = name.match(/th[aá]ng\s*(\d{1,2})\.(\d{4})/i);
    if (m && `${Number(m[1])}.${Number(m[2])}` === target) return name;
  }
  return null;
};

const parseDateCell = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const pad = (n) => String(n).padStart(2, '0');
      return `${parsed.y}-${pad(parsed.m)}-${pad(parsed.d)}`;
    }
  }
  return parseExcelDate(value);
};

const resolveTaiKhoanByRosterName = (name, maps) => {
  const cleaned = parseNameFromRosterCell(name);
  if (!cleaned) return null;

  const key = normalizeKey(cleaned);
  if (maps.taiKhoanByName.has(key)) return maps.taiKhoanByName.get(key);

  for (const [k, nv] of maps.taiKhoanByName.entries()) {
    if (k === key) return nv;
    if (key.includes(k) || k.includes(key)) return nv;
    const keyParts = key.split(/\s+/).filter(Boolean);
    const kParts = k.split(/\s+/).filter(Boolean);
    if (keyParts.length >= 2 && kParts.length >= 2) {
      const keyLast = keyParts[keyParts.length - 1];
      const kLast = kParts[kParts.length - 1];
      if (keyLast === kLast && keyParts[0][0] === kParts[0][0]) return nv;
    }
  }
  return null;
};

/**
 * Parse sheet roster dạng ma trận (DLXH) → danh sách phân ca dài.
 */
export const parseDlxhRosterSheet = (worksheet, { thang, nam, maps, sheetName = 'Roster' }) => {
  const grid = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  const phanCa = [];
  const errors = [];
  const skippedNames = [];

  let headerRowIndex = -1;
  for (let r = 0; r < Math.min(20, grid.length); r++) {
    const c0 = normalizeKey(grid[r]?.[0]);
    if (c0 === 'họ và tên' || c0 === 'ho va ten') {
      headerRowIndex = r;
      break;
    }
  }

  if (headerRowIndex < 0) {
    return {
      phanCa: [],
      errors: [{ sheet: sheetName, row: 0, messages: ['Không tìm thấy hàng tiêu đề "Họ và tên"'] }],
    };
  }

  const dateRow = grid[headerRowIndex + 1] || [];
  const firstDayCol = 6;
  const dateByCol = [];
  for (let c = firstDayCol; c < dateRow.length; c++) {
    const ngay = parseDateCell(dateRow[c]);
    if (ngay) dateByCol[c] = ngay;
  }

  if (dateByCol.filter(Boolean).length === 0) {
    return {
      phanCa: [],
      errors: [{ sheet: sheetName, row: headerRowIndex + 2, messages: ['Không đọc được cột ngày trên roster'] }],
    };
  }

  for (let r = headerRowIndex + 2; r < grid.length; r++) {
    const row = grid[r];
    const nameCell = row?.[0];
    if (isSectionHeaderRow(nameCell)) continue;

    const hoTen = parseNameFromRosterCell(nameCell);
    if (!hoTen) continue;

    const nhanVien = resolveTaiKhoanByRosterName(hoTen, maps);
    if (!nhanVien) {
      if (!skippedNames.includes(hoTen)) skippedNames.push(hoTen);
      continue;
    }

    for (let c = firstDayCol; c < row.length; c++) {
      const ngay = dateByCol[c];
      if (!ngay) continue;

      const cellVal = row[c];
      const mapped = mapRosterCellToShift(cellVal);
      if (mapped.type === 'skip' || mapped.type === 'off') continue;

      const rowErrors = [];
      if (thang && nam) {
        const [y, m] = ngay.split('-').map(Number);
        if (y !== Number(nam) || m !== Number(thang)) {
          rowErrors.push(`Ngày ${ngay} không thuộc tháng ${thang}/${nam}`);
        }
      }

      const mapHop = isRosterNameAlignedWithDb(hoTen, nhanVien.ho_ten);
      if (!mapHop) {
        rowErrors.push(
          `Tên trên file "${hoTen}" không khớp nhân viên DB "${nhanVien.ho_ten}" (ID hồ sơ ${nhanVien.id})`
        );
      }

      phanCa.push({
        row: r + 1,
        sheet: sheetName,
        ngay,
        id_ho_so_nhan_vien: nhanVien.id,
        id_tai_khoan: nhanVien.id_tai_khoan,
        ho_ten_tren_file: hoTen,
        ho_ten_nhan_vien: nhanVien.ho_ten,
        ca: mapped.ca,
        ma_ca: mapped.ma_ca,
        hinh_thuc_lam_viec: mapped.hinh_thuc_lam_viec,
        gio_bat_dau: mapped.gio_bat_dau,
        gio_ket_thuc: mapped.gio_ket_thuc,
        trang_thai: mapped.trang_thai || 'du_kien',
        ghi_chu: mapped.ghi_chu,
        nhan_vien_map_hop: mapHop,
        valid: rowErrors.length === 0,
      });

      if (rowErrors.length) {
        errors.push({ sheet: sheetName, row: r + 1, messages: rowErrors });
      }
    }
  }

  return { phanCa, errors, skippedNames };
};

export const parseDlxhRosterWorkbook = (workbook, { thang, nam, maps, sheetName: sheetOverride = null }) => {
  const sheetName = sheetOverride || findMonthSheetName(workbook, thang, nam);
  if (!sheetName || !workbook.Sheets[sheetName]) {
    return { phanCa: [], errors: [], found: false };
  }

  const worksheet = workbook.Sheets[sheetName];
  const { phanCa, errors, skippedNames } = parseDlxhRosterSheet(worksheet, {
    thang,
    nam,
    maps,
    sheetName,
  });

  return {
    phanCa,
    errors,
    skippedNames: skippedNames || [],
    found: true,
    sheetName,
  };
};
