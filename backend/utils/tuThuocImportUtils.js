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

// Tên cột đã bỏ dấu, viết thường. Hỗ trợ cả file mẫu và sổ "BẢNG THEO DÕI NHẬP - XUẤT THUỐC".
const HEADER_ALIASES = {
  stt: ['stt'],
  ten_thuoc: ['ten_thuoc', 'ten thuoc', 'ten thuoc/vat tu'],
  ten_phan_loai: ['ten_phan_loai', 'ten phan loai', 'phan loai (ten)', 'phan loai', 'loai thuoc'],
  don_vi_tinh: ['don_vi_tinh', 'don vi tinh', 'dvt'],
  so_luong_ton: ['so_luong_ton', 'so luong ton', 'so luong ton kho', 'ton cuoi ky'],
  so_luong_toi_thieu: ['so_luong_toi_thieu', 'so luong toi thieu', 'nguong canh bao'],
  han_su_dung: ['han_su_dung', 'han su dung', 'han su dung (yyyy-mm-dd)'],
  chi_dinh: ['chi_dinh', 'chi dinh'],
  ghi_chu: ['ghi_chu', 'ghi chu'],
  // Các cột chỉ có trong sổ nhập - xuất
  ngay_chung_tu: ['ngay thang chung tu', 'ngay chung tu', 'ngay nhap'],
  ton_dau_ky: ['ton dau ky'],
  so_luong_nhap: ['so luong nhap'],
  don_gia: ['don gia'],
  nha_cung_cap: ['nha cung cap'],
  ngay_xuat: ['ngay xuat'],
  so_luong_xuat: ['xuat (so luong)', 'so luong xuat'],
  xuat_cho_ai: ['xuat cho ai'],
};

const HEADER_SCAN_ROWS = 20;
const DATE_FIELDS = ['han_su_dung', 'ngay_chung_tu', 'ngay_xuat'];
// Các field có dữ liệu thì dòng mới được tính là một mục (ĐVT, phân loại thường được điền sẵn ở dòng trống)
const CONTENT_FIELDS = [
  'ten_thuoc', 'so_luong_ton', 'so_luong_toi_thieu', 'han_su_dung', 'chi_dinh', 'ghi_chu',
  'ngay_chung_tu', 'ton_dau_ky', 'so_luong_nhap', 'don_gia', 'nha_cung_cap',
  'ngay_xuat', 'so_luong_xuat', 'xuat_cho_ai',
];

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeKey = (value) => normalizeText(value).toLowerCase();

const removeDiacritics = (value) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

const normalizeHeaderText = (header) =>
  removeDiacritics(normalizeKey(header))
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();

const HEADER_LOOKUP = new Map(
  Object.entries(HEADER_ALIASES).flatMap(([field, aliases]) => aliases.map((alias) => [alias, field]))
);

const headerToField = (header) => HEADER_LOOKUP.get(normalizeHeaderText(header)) || null;

const pad2 = (n) => String(n).padStart(2, '0');

const lastDayOfMonth = (year, month) => new Date(year, month, 0).getDate();

const buildDate = (year, month, day) => {
  if (month < 1 || month > 12 || day < 1 || day > lastDayOfMonth(year, month)) return null;
  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const formatDateVi = (isoDate) => {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
};

// Ngày dạng DD/MM/YYYY, YYYY-MM-DD, serial Excel. Với hạn sử dụng còn chấp nhận MM/YYYY và YYYY (lấy ngày cuối kỳ).
const parseDateValue = (value, { allowPartial = false } = {}) => {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return parseExcelDate(value);
  }

  if (typeof value === 'number') {
    if (allowPartial && Number.isInteger(value) && value >= 1900 && value <= 2200) {
      return `${value}-12-31`;
    }
    return parseExcelDate(value);
  }

  const str = normalizeText(value);

  const dmy = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (dmy) return buildDate(Number(dmy[3]), Number(dmy[2]), Number(dmy[1]));

  if (allowPartial) {
    const my = str.match(/^(\d{1,2})[/\-.](\d{4})$/);
    if (my) {
      const year = Number(my[2]);
      const month = Number(my[1]);
      return buildDate(year, month, month >= 1 && month <= 12 ? lastDayOfMonth(year, month) : 1);
    }
    if (/^\d{4}$/.test(str)) return `${str}-12-31`;
  }

  const iso = str.split('T')[0].split(' ')[0].match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return buildDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  return null;
};

const buildSheet = (columns, dataRows = []) => {
  const headerRow = columns.map((c) => c.label);
  const bodyRows = dataRows.map((data) => columns.map((c) => data[c.key] ?? ''));
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...bodyRows]);
  ws['!cols'] = columns.map((c) => ({ wch: c.width || 15 }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };
  return ws;
};

// Chấp nhận số kiểu Việt Nam: "2.500" (phân cách nghìn), "7,5" (thập phân)
const parseNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '') return defaultValue;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  let str = normalizeText(value).replace(/\s+/g, '');
  if (str === '') return defaultValue;
  if (/^-?\d{1,3}(\.\d{3})+$/.test(str)) str = str.replace(/\./g, '');
  else if (/^-?\d{1,3}(,\d{3})+$/.test(str)) str = str.replace(/,/g, '');
  else if (/^-?\d+,\d+$/.test(str)) str = str.replace(',', '.');
  const num = Number(str);
  return Number.isFinite(num) ? num : NaN;
};

const hasContent = (value) => {
  const text = normalizeText(value);
  return text !== '' && text !== '0';
};

const isRomanNumeral = (value) => /^[IVXLC]+\.?$/i.test(normalizeText(value));

// Dòng "TỔNG" / "CỘNG" cuối bảng
const isTotalRow = (cells) =>
  cells.some((cell) => /^(tong|cong)\b/.test(removeDiacritics(normalizeKey(cell))));

// Ô ngày được Excel tự đổi sang serial theo kiểu tháng/ngày (VD gõ 11/2/2028 thành 2/11/2028),
// trong khi người dùng đọc theo chuỗi hiển thị dạng ngày/tháng -> ưu tiên chuỗi hiển thị.
const readDateCell = (worksheet, rowIndex, colIndex, fallback) => {
  const cell = worksheet[XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })];
  if (cell?.t === 'n' && typeof cell.w === 'string' && /^\d{1,2}[/\-.]\d{1,2}([/\-.]\d{4})?$|^\d{1,2}[/\-.]\d{4}$/.test(cell.w.trim())) {
    return cell.w.trim();
  }
  return fallback;
};

const toSentenceCase = (value) => {
  const lower = normalizeText(value).toLocaleLowerCase('vi');
  return lower.charAt(0).toLocaleUpperCase('vi') + lower.slice(1);
};

const findTuThuocSheet = (workbook) => {
  const preferred = workbook.SheetNames.find((name) => normalizeKey(name).includes('tu_thuoc') || normalizeKey(name).includes('tu thuoc'));
  return preferred || workbook.SheetNames[0];
};

// Dòng tiêu đề không nhất thiết ở dòng 1 (sổ nhập - xuất có tiêu đề bảng ở trên)
const findHeaderRowIndex = (aoa) => {
  const limit = Math.min(aoa.length, HEADER_SCAN_ROWS);
  for (let i = 0; i < limit; i += 1) {
    if ((aoa[i] || []).some((cell) => headerToField(cell) === 'ten_thuoc')) return i;
  }
  return -1;
};

// Cột trùng tên (VD: "Đơn giá" nhập và "Đơn Giá" xuất) chỉ lấy cột đầu tiên
const buildColumnMap = (headerRow) => {
  const columns = new Map();
  headerRow.forEach((cell, colIndex) => {
    const field = headerToField(cell);
    if (field && !columns.has(field)) columns.set(field, colIndex);
  });
  return columns;
};

const sheetToRows = (worksheet) => {
  if (!worksheet['!ref']) return { rows: [], headerFound: false };
  const { s: rangeStart } = XLSX.utils.decode_range(worksheet['!ref']);
  const startRow = rangeStart.r;
  const aoa = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: true, blankrows: true });

  const headerIndex = findHeaderRowIndex(aoa);
  if (headerIndex === -1) return { rows: [], headerFound: false };

  const columns = buildColumnMap(aoa[headerIndex]);
  const rows = [];
  let currentSection = '';

  for (let i = headerIndex + 1; i < aoa.length; i += 1) {
    const cells = aoa[i] || [];
    const row = { row: startRow + i + 1 };
    for (const [field, colIndex] of columns) {
      row[field] = cells[colIndex] ?? '';
      if (DATE_FIELDS.includes(field)) {
        row[field] = readDateCell(worksheet, startRow + i, rangeStart.c + colIndex, row[field]);
      }
    }

    // Dòng nhóm, VD: "I | THUỐC UỐNG" -> làm phân loại cho các dòng bên dưới.
    // Tiêu đề nhóm có thể nằm ở bất kỳ cột nào (ô gộp), kể cả cột tên thuốc.
    const sttIndex = columns.get('stt');
    if (sttIndex !== undefined && isRomanNumeral(cells[sttIndex])) {
      const title = cells.find((cell, colIndex) => colIndex !== sttIndex && normalizeText(cell) !== '');
      if (title) currentSection = toSentenceCase(title);
      continue;
    }

    if (!hasContent(row.ten_thuoc)) {
      if (isTotalRow(cells)) continue;
      if (!CONTENT_FIELDS.some((field) => hasContent(row[field]))) continue;
    }

    if (!normalizeText(row.ten_phan_loai) && currentSection) {
      row.ten_phan_loai = currentSection;
    }
    rows.push(row);
  }

  return { rows, headerFound: true };
};

const buildPhanLoaiMap = (phanLoais = []) => {
  const map = new Map();
  for (const pl of phanLoais) {
    map.set(normalizeKey(pl.ten_loai), pl);
  }
  return map;
};

const formatMoney = (value) => new Intl.NumberFormat('vi-VN').format(value);

// Thông tin nhập - xuất chưa có cột riêng trong tủ thuốc -> ghi vào ghi chú để không mất
const buildLedgerNote = (row) => {
  const parts = [];
  const ncc = normalizeText(row.nha_cung_cap);
  if (ncc) parts.push(`NCC: ${ncc}`);

  const donGia = parseNumber(row.don_gia, 0);
  if (donGia > 0) parts.push(`Đơn giá: ${formatMoney(donGia)}`);

  const ngayNhap = parseDateValue(row.ngay_chung_tu);
  if (ngayNhap) parts.push(`Ngày nhập: ${formatDateVi(ngayNhap)}`);

  const slXuat = parseNumber(row.so_luong_xuat, 0);
  const ngayXuat = parseDateValue(row.ngay_xuat);
  const xuatChoAi = normalizeText(row.xuat_cho_ai);
  if (slXuat > 0 || xuatChoAi) {
    let text = 'Đã xuất';
    if (slXuat > 0) text += ` ${slXuat}`;
    if (ngayXuat) text += ` ngày ${formatDateVi(ngayXuat)}`;
    if (xuatChoAi) text += ` cho ${xuatChoAi}`;
    parts.push(text);
  }

  return parts.join('; ');
};

const resolveSoLuongTon = (row) => {
  if (normalizeText(row.so_luong_ton) !== '') return parseNumber(row.so_luong_ton, 0);
  const hasLedgerQty = ['ton_dau_ky', 'so_luong_nhap', 'so_luong_xuat'].some((f) => normalizeText(row[f]) !== '');
  if (!hasLedgerQty) return 0;
  return parseNumber(row.ton_dau_ky, 0) + parseNumber(row.so_luong_nhap, 0) - parseNumber(row.so_luong_xuat, 0);
};

export const validateTuThuocRow = (row, phanLoaiMap) => {
  const errors = [];
  const tenThuoc = normalizeText(row.ten_thuoc);

  if (!tenThuoc) {
    errors.push('Thiếu tên thuốc/vật tư');
  }

  const ton = resolveSoLuongTon(row);
  if (Number.isNaN(ton) || ton < 0 || !Number.isInteger(ton)) {
    errors.push('Số lượng tồn phải là số nguyên ≥ 0');
  }

  const nguong = parseNumber(row.so_luong_toi_thieu, 0);
  if (Number.isNaN(nguong) || nguong < 0 || !Number.isInteger(nguong)) {
    errors.push('Ngưỡng cảnh báo phải là số nguyên ≥ 0');
  }

  const hanSuDungRaw = row.han_su_dung;
  let hanSuDung = null;
  if (normalizeText(hanSuDungRaw) !== '') {
    hanSuDung = parseDateValue(hanSuDungRaw, { allowPartial: true });
    if (!hanSuDung) {
      errors.push('Hạn sử dụng không hợp lệ (dùng DD/MM/YYYY, MM/YYYY hoặc YYYY-MM-DD)');
    }
  }

  // Phân loại chưa có sẽ được tạo mới khi import
  const tenPhanLoai = normalizeText(row.ten_phan_loai);
  const matched = tenPhanLoai ? phanLoaiMap.get(normalizeKey(tenPhanLoai)) : null;

  const ghiChu = [normalizeText(row.ghi_chu), buildLedgerNote(row)].filter(Boolean).join('; ');

  return {
    row: row.row,
    ten_thuoc: tenThuoc,
    ten_phan_loai: matched?.ten_loai || tenPhanLoai,
    id_phan_loai: matched?.id || null,
    phan_loai_moi: Boolean(tenPhanLoai && !matched),
    don_vi_tinh: normalizeText(row.don_vi_tinh) || null,
    so_luong_ton: Number.isNaN(ton) ? 0 : ton,
    so_luong_toi_thieu: Number.isNaN(nguong) ? 0 : nguong,
    han_su_dung: hanSuDung,
    chi_dinh: normalizeText(row.chi_dinh) || null,
    ghi_chu: ghiChu || null,
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
      summary: { tong_muc: 0, hop_le: 0, tong_loi: 1, sheet: null },
    };
  }

  const { rows: rawRows, headerFound } = sheetToRows(worksheet);
  if (!headerFound) {
    return {
      items: [],
      errors: [{ row: 0, messages: [`Sheet "${sheetName}" không có cột "Tên thuốc"`] }],
      summary: { tong_muc: 0, hop_le: 0, tong_loi: 1, sheet: sheetName },
    };
  }

  const phanLoaiMap = buildPhanLoaiMap(phanLoais);
  const items = [];
  const errors = [];

  for (const rawRow of rawRows) {
    const validated = validateTuThuocRow(rawRow, phanLoaiMap);
    items.push(validated);
    if (!validated.valid) {
      errors.push({ row: validated.row, messages: validated.errors });
    }
  }

  const hopLe = items.filter((item) => item.valid).length;
  const phanLoaiMoi = [...new Set(items.filter((item) => item.phan_loai_moi).map((item) => item.ten_phan_loai))];

  return {
    items,
    errors,
    summary: {
      tong_muc: items.length,
      hop_le: hopLe,
      tong_loi: errors.length,
      sheet: sheetName,
      phan_loai_moi: phanLoaiMoi,
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
