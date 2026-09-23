import XLSX from 'xlsx';
import { parseExcelDate } from './lichThangImportUtils.js';

export const TU_THUOC_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ten_thuoc', label: 'Tên thuốc/vật tư', width: 32 },
  { key: 'ten_phan_loai', label: 'Phân loại (tên)', width: 24 },
  { key: 'don_vi_tinh', label: 'Đơn vị tính', width: 14 },
  { key: 'so_luong_ton', label: 'Số lượng tồn', width: 14 },
  { key: 'so_luong_toi_thieu', label: 'Ngưỡng cảnh báo', width: 16 },
  { key: 'han_su_dung', label: 'Hạn sử dụng (YYYY-MM-DD)', width: 22 },
  { key: 'chi_dinh', label: 'Chỉ định', width: 36 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const PHAN_LOAI_DM_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'id', label: 'ID', width: 10 },
  { key: 'ten_loai', label: 'Tên phân loại', width: 28 },
  { key: 'mo_ta', label: 'Mô tả', width: 40 },
];

const HEADER_ALIASES = {
  stt: ['stt'],
  ten_thuoc: ['ten_thuoc', 'ten thuoc', 'tên thuốc/vật tư', 'tên thuốc', 'ten thuoc/vat tu'],
  ten_phan_loai: ['ten_phan_loai', 'ten phan loai', 'phân loại (tên)', 'phan loai (ten)', 'phân loại', 'phan loai'],
  don_vi_tinh: ['don_vi_tinh', 'don vi tinh', 'đơn vị tính'],
  so_luong_ton: ['so_luong_ton', 'so luong ton', 'số lượng tồn', 'so luong ton kho'],
  so_luong_toi_thieu: ['so_luong_toi_thieu', 'so luong toi thieu', 'ngưỡng cảnh báo', 'nguong canh bao'],
  han_su_dung: ['han_su_dung', 'han su dung', 'hạn sử dụng (yyyy-mm-dd)', 'hạn sử dụng', 'han su dung (yyyy-mm-dd)'],
  chi_dinh: ['chi_dinh', 'chi dinh', 'chỉ định'],
  ghi_chu: ['ghi_chu', 'ghi chu', 'ghi chú'],
};

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeKey = (value) => normalizeText(value).toLowerCase();

const normalizeHeaderKey = (header) => {
  const k = normalizeKey(header);
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(k) || k === field) return field;
  }
  return k.replace(/\s+/g, '_');
};

const buildSheet = (columns, dataRows = []) => {
  const headerRow = columns.map((c) => c.label);
  const bodyRows = dataRows.map((data) => columns.map((c) => data[c.key] ?? ''));
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...bodyRows]);
  ws['!cols'] = columns.map((c) => ({ wch: c.width || 15 }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };
  return ws;
};

const parseNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
};

const isRowEmpty = (row) => {
  const skipKeys = new Set(['stt']);
  return Object.entries(row).every(([key, value]) => {
    const field = normalizeHeaderKey(key);
    if (skipKeys.has(field)) return true;
    return normalizeText(value) === '';
  });
};

const findTuThuocSheet = (workbook) => {
  const preferred = workbook.SheetNames.find((name) => normalizeKey(name).includes('tu_thuoc') || normalizeKey(name).includes('tu thuoc'));
  return preferred || workbook.SheetNames[0];
};

const sheetToRows = (worksheet) => {
  const raw = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
  return raw.filter((row) => !isRowEmpty(row));
};

const normalizeImportRow = (row, rowIndex) => {
  const normalized = { row: rowIndex + 2 };
  for (const [header, value] of Object.entries(row)) {
    const field = normalizeHeaderKey(header);
    if (field === 'stt') continue;
    normalized[field] = value;
  }
  return normalized;
};

const buildPhanLoaiMap = (phanLoais = []) => {
  const map = new Map();
  for (const pl of phanLoais) {
    map.set(normalizeKey(pl.ten_loai), pl);
  }
  return map;
};

export const validateTuThuocRow = (row, phanLoaiMap) => {
  const errors = [];
  const tenThuoc = normalizeText(row.ten_thuoc);

  if (!tenThuoc) {
    errors.push('Thiếu tên thuốc/vật tư');
  }

  const ton = parseNumber(row.so_luong_ton, 0);
  if (Number.isNaN(ton) || ton < 0) {
    errors.push('Số lượng tồn phải là số ≥ 0');
  }

  const nguong = parseNumber(row.so_luong_toi_thieu, 0);
  if (Number.isNaN(nguong) || nguong < 0) {
    errors.push('Ngưỡng cảnh báo phải là số ≥ 0');
  }

  const hanSuDungRaw = row.han_su_dung;
  let hanSuDung = null;
  if (normalizeText(hanSuDungRaw) !== '') {
    hanSuDung = parseExcelDate(hanSuDungRaw);
    if (!hanSuDung) {
      errors.push('Hạn sử dụng không hợp lệ (dùng YYYY-MM-DD hoặc DD/MM/YYYY)');
    }
  }

  const tenPhanLoai = normalizeText(row.ten_phan_loai);
  let idPhanLoai = null;
  let tenPhanLoaiResolved = '';
  if (tenPhanLoai) {
    const matched = phanLoaiMap.get(normalizeKey(tenPhanLoai));
    if (!matched) {
      errors.push(`Không tìm thấy phân loại "${tenPhanLoai}"`);
    } else {
      idPhanLoai = matched.id;
      tenPhanLoaiResolved = matched.ten_loai;
    }
  }

  return {
    row: row.row,
    ten_thuoc: tenThuoc,
    ten_phan_loai: tenPhanLoaiResolved || tenPhanLoai,
    id_phan_loai: idPhanLoai,
    don_vi_tinh: normalizeText(row.don_vi_tinh) || null,
    so_luong_ton: Number.isNaN(ton) ? 0 : ton,
    so_luong_toi_thieu: Number.isNaN(nguong) ? 0 : nguong,
    han_su_dung: hanSuDung,
    chi_dinh: normalizeText(row.chi_dinh) || null,
    ghi_chu: normalizeText(row.ghi_chu) || null,
    valid: errors.length === 0,
    errors,
  };
};

export const parseTuThuocWorkbook = (workbook, { phanLoais = [] } = {}) => {
  const sheetName = findTuThuocSheet(workbook);
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    return {
      items: [],
      errors: [{ row: 0, messages: ['Không tìm thấy sheet dữ liệu trong file Excel'] }],
      summary: { tong_muc: 0, hop_le: 0, tong_loi: 1 },
    };
  }

  const phanLoaiMap = buildPhanLoaiMap(phanLoais);
  const rawRows = sheetToRows(worksheet);
  const items = [];
  const errors = [];

  rawRows.forEach((rawRow, index) => {
    const normalized = normalizeImportRow(rawRow, index);
    const validated = validateTuThuocRow(normalized, phanLoaiMap);
    items.push(validated);
    if (!validated.valid) {
      errors.push({ row: validated.row, messages: validated.errors });
    }
  });

  const hopLe = items.filter((item) => item.valid).length;

  return {
    items,
    errors,
    summary: {
      tong_muc: items.length,
      hop_le: hopLe,
      tong_loi: errors.length,
    },
  };
};

export const buildTuThuocTemplate = ({ phanLoais = [] } = {}) => {
  const samplePhanLoai = phanLoais[0]?.ten_loai || 'Thuốc';
  const sampleRows = [
    {
      stt: 1,
      ten_thuoc: 'Paracetamol 500mg',
      ten_phan_loai: samplePhanLoai,
      don_vi_tinh: 'viên',
      so_luong_ton: 100,
      so_luong_toi_thieu: 20,
      han_su_dung: '2026-12-31',
      chi_dinh: 'Hạ sốt, giảm đau',
      ghi_chu: 'Ví dụ — xóa dòng mẫu nếu không dùng',
    },
    {
      stt: 2,
      ten_thuoc: 'Băng cuộn y tế',
      ten_phan_loai: phanLoais[1]?.ten_loai || samplePhanLoai,
      don_vi_tinh: 'cuộn',
      so_luong_ton: 50,
      so_luong_toi_thieu: 10,
      han_su_dung: '',
      chi_dinh: 'Thay băng vết thương',
      ghi_chu: '',
    },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildSheet(TU_THUOC_COLUMNS, sampleRows), 'Tu_thuoc');

  const phanLoaiRows = phanLoais.map((pl, index) => ({
    stt: index + 1,
    id: pl.id,
    ten_loai: pl.ten_loai,
    mo_ta: pl.mo_ta || '',
  }));
  XLSX.utils.book_append_sheet(workbook, buildSheet(PHAN_LOAI_DM_COLUMNS, phanLoaiRows), 'Danh_muc_phan_loai');

  return workbook;
};

export const buildPhanLoaiDanhMucWorkbook = (phanLoais = []) => {
  const workbook = XLSX.utils.book_new();
  const rows = phanLoais.map((pl, index) => ({
    stt: index + 1,
    id: pl.id,
    ten_loai: pl.ten_loai,
    mo_ta: pl.mo_ta || '',
  }));
  XLSX.utils.book_append_sheet(workbook, buildSheet(PHAN_LOAI_DM_COLUMNS, rows), 'Danh_muc_phan_loai');
  return workbook;
};
