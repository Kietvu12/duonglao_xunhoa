import XLSX from 'xlsx';

const CA_VALUES = ['sang', 'chieu', 'dem'];
const MUC_UU_TIEN_VALUES = ['thap', 'trung_binh', 'cao'];
const TRANG_THAI_CA_VALUES = ['du_kien', 'dang_truc', 'hoan_thanh', 'vang'];

const PHAN_CA_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ngay', label: 'Ngày (YYYY-MM-DD)', width: 16 },
  { key: 'id_tai_khoan', label: 'ID tài khoản', width: 14 },
  { key: 'ho_ten_nhan_vien', label: 'Họ tên nhân viên', width: 28 },
  { key: 'ca', label: 'Ca (sang/chieu/dem)', width: 20 },
  { key: 'gio_bat_dau', label: 'Giờ bắt đầu (HH:mm)', width: 18 },
  { key: 'gio_ket_thuc', label: 'Giờ kết thúc (HH:mm)', width: 18 },
  { key: 'trang_thai', label: 'Trạng thái (du_kien/dang_truc/hoan_thanh/vang)', width: 36 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const CONG_VIEC_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ngay', label: 'Ngày (YYYY-MM-DD)', width: 16 },
  { key: 'gio', label: 'Giờ (HH:mm)', width: 14 },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 32 },
  { key: 'mo_ta', label: 'Mô tả', width: 36 },
  { key: 'muc_uu_tien', label: 'Mức ưu tiên (thap/trung_binh/cao)', width: 28 },
  { key: 'id_dieu_duong', label: 'ID hồ sơ điều dưỡng', width: 18 },
  { key: 'ho_ten_dieu_duong', label: 'Họ tên điều dưỡng', width: 28 },
  { key: 'id_benh_nhan', label: 'ID bệnh nhân', width: 14 },
  { key: 'ho_ten_benh_nhan', label: 'Họ tên bệnh nhân', width: 28 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const PHAN_CA_NV_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ngay', label: 'Ngày (YYYY-MM-DD)', width: 16 },
  { key: 'ca', label: 'Ca (sang/chieu/dem)', width: 20 },
  { key: 'gio_bat_dau', label: 'Giờ bắt đầu (HH:mm)', width: 18 },
  { key: 'gio_ket_thuc', label: 'Giờ kết thúc (HH:mm)', width: 18 },
  { key: 'trang_thai', label: 'Trạng thái (du_kien/dang_truc/hoan_thanh/vang)', width: 36 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const CONG_VIEC_NV_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ngay', label: 'Ngày (YYYY-MM-DD)', width: 16 },
  { key: 'gio', label: 'Giờ (HH:mm)', width: 14 },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 32 },
  { key: 'mo_ta', label: 'Mô tả', width: 36 },
  { key: 'muc_uu_tien', label: 'Mức ưu tiên (thap/trung_binh/cao)', width: 28 },
  { key: 'id_benh_nhan', label: 'ID bệnh nhân', width: 14 },
  { key: 'ho_ten_benh_nhan', label: 'Họ tên bệnh nhân', width: 28 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const CONG_VIEC_BN_COLUMNS = [
  { key: 'stt', label: 'STT', width: 6 },
  { key: 'ngay', label: 'Ngày (YYYY-MM-DD)', width: 16 },
  { key: 'gio', label: 'Giờ (HH:mm)', width: 14 },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 32 },
  { key: 'mo_ta', label: 'Mô tả', width: 36 },
  { key: 'muc_uu_tien', label: 'Mức ưu tiên (thap/trung_binh/cao)', width: 28 },
  { key: 'id_dieu_duong', label: 'ID hồ sơ điều dưỡng', width: 18 },
  { key: 'ho_ten_dieu_duong', label: 'Họ tên điều dưỡng', width: 28 },
  { key: 'ghi_chu', label: 'Ghi chú', width: 30 },
];

const HEADER_ALIASES = {
  stt: ['stt'],
  ngay: ['ngay', 'ngày', 'ngay (yyyy-mm-dd)', 'ngày (yyyy-mm-dd)'],
  id_tai_khoan: ['id_tai_khoan', 'id tai khoan', 'id tài khoản'],
  ho_ten_nhan_vien: ['ho_ten_nhan_vien', 'ho ten nhan vien', 'họ tên nhân viên', 'ho ten nhan vien'],
  ca: ['ca', 'ca (sang/chieu/dem)', 'ca (sang/chieu/dem)'],
  gio_bat_dau: ['gio_bat_dau', 'gio bat dau', 'giờ bắt đầu (hh:mm)', 'gio bat dau (hh:mm)'],
  gio_ket_thuc: ['gio_ket_thuc', 'gio ket thuc', 'giờ kết thúc (hh:mm)', 'gio ket thuc (hh:mm)'],
  trang_thai: ['trang_thai', 'trang thai', 'trạng thái', 'trạng thái (du_kien/dang_truc/hoan_thanh/vang)'],
  ghi_chu: ['ghi_chu', 'ghi chu', 'ghichu', 'ghi chú'],
  gio: ['gio', 'giờ', 'giờ (hh:mm)', 'gio (hh:mm)'],
  ten_cong_viec: ['ten_cong_viec', 'ten cong viec', 'tên công việc'],
  mo_ta: ['mo_ta', 'mo ta', 'mô tả'],
  muc_uu_tien: ['muc_uu_tien', 'muc uu tien', 'mức ưu tiên', 'mức ưu tiên (thap/trung_binh/cao)'],
  id_dieu_duong: ['id_dieu_duong', 'id dieu duong', 'id hồ sơ điều dưỡng', 'id ho so dieu duong'],
  ho_ten_dieu_duong: ['ho_ten_dieu_duong', 'ho ten dieu duong', 'họ tên điều dưỡng'],
  id_benh_nhan: ['id_benh_nhan', 'id benh nhan', 'id bệnh nhân'],
  ho_ten_benh_nhan: ['ho_ten_benh_nhan', 'ho ten benh nhan', 'họ tên bệnh nhân'],
  id_ho_so: ['id_ho_so', 'id ho so', 'id hồ sơ nv'],
  ho_ten: ['ho_ten', 'ho ten', 'họ tên'],
  vai_tro: ['vai_tro', 'vai tro', 'vai trò'],
  id_benh_nhan_dm: ['id_benh_nhan', 'id benh nhan', 'id bệnh nhân'],
};

const normalizeHeaderKey = (header) => {
  const k = normalizeKey(header);
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(k) || k === field) return field;
  }
  return k.replace(/\s+/g, '_');
};

const normalizeImportRow = (row) => {
  const normalized = {};
  for (const [header, value] of Object.entries(row)) {
    const field = normalizeHeaderKey(header);
    if (field === 'stt' || field === 'ghi_chu') continue;
    normalized[field] = value;
  }
  return normalized;
};

const isRowEmpty = (row) => {
  const skipKeys = new Set(['stt', 'ghi_chu']);
  return Object.entries(row).every(([key, value]) => {
    const field = normalizeHeaderKey(key);
    if (skipKeys.has(field)) return true;
    return normalizeText(value) === '';
  });
};

const buildTemplateSheet = (columns, dataRows = []) => {
  const headerRow = columns.map((c) => c.label);
  const bodyRows = dataRows.map((data) => columns.map((c) => data[c.key] ?? ''));
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...bodyRows]);
  ws['!cols'] = columns.map((c) => ({ wch: c.width || 15 }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1, topLeftCell: 'A2', activePane: 'bottomLeft', state: 'frozen' };
  return ws;
};

const getDaysInMonth = (thang, nam) => {
  const { month, year } = getMonthRange(thang, nam);
  const lastDay = new Date(year, month, 0).getDate();
  const days = [];
  for (let d = 1; d <= lastDay; d += 1) {
    days.push(`${year}-${pad2(month)}-${pad2(d)}`);
  }
  return days;
};

const buildPhanCaSampleRows = ({ thang, nam, nhanViens = [] }) => {
  const days = getDaysInMonth(thang, nam);
  const nv1 = nhanViens[0];
  const nv2 = nhanViens[1] || nhanViens[0];
  const rows = [];
  let stt = 1;

  const examples = [
    {
      ngay: days[0],
      id_tai_khoan: nv1?.id_tai_khoan || '',
      ho_ten_nhan_vien: nv1?.ho_ten || '',
      ca: 'sang',
      gio_bat_dau: '06:00',
      gio_ket_thuc: '14:00',
      trang_thai: 'du_kien',
      ghi_chu: 'Ví dụ ca sáng — xóa dòng mẫu nếu không dùng',
    },
    {
      ngay: days[0],
      id_tai_khoan: nv1?.id_tai_khoan || '',
      ho_ten_nhan_vien: nv1?.ho_ten || '',
      ca: 'chieu',
      gio_bat_dau: '14:00',
      gio_ket_thuc: '22:00',
      trang_thai: 'du_kien',
      ghi_chu: 'Ví dụ ca chiều',
    },
    {
      ngay: days[0],
      id_tai_khoan: nv2?.id_tai_khoan || '',
      ho_ten_nhan_vien: nv2?.ho_ten || '',
      ca: 'dem',
      gio_bat_dau: '22:00',
      gio_ket_thuc: '06:00',
      trang_thai: 'du_kien',
      ghi_chu: 'Ví dụ ca đêm',
    },
  ];

  for (const ex of examples) {
    rows.push({ stt: stt++, ...ex });
  }

  for (const ngay of days) {
    rows.push({
      stt: stt++,
      ngay,
      id_tai_khoan: '',
      ho_ten_nhan_vien: '',
      ca: '',
      gio_bat_dau: '',
      gio_ket_thuc: '',
      trang_thai: 'du_kien',
      ghi_chu: '',
    });
  }

  return rows;
};

const buildCongViecSampleRows = ({ thang, nam, nhanViens = [], benhNhans = [] }) => {
  const days = getDaysInMonth(thang, nam);
  const nv = nhanViens[0];
  const bn = benhNhans[0];
  const rows = [];
  let stt = 1;

  const examples = [
    {
      ngay: days[0],
      gio: '07:00',
      ten_cong_viec: 'Đo huyết áp buổi sáng',
      mo_ta: 'Đo và ghi nhận chỉ số huyết áp',
      muc_uu_tien: 'trung_binh',
      id_dieu_duong: nv?.id || '',
      ho_ten_dieu_duong: nv?.ho_ten || '',
      id_benh_nhan: bn?.id || '',
      ho_ten_benh_nhan: bn?.ho_ten || '',
      ghi_chu: 'Ví dụ — xóa dòng mẫu nếu không dùng',
    },
    {
      ngay: days[0],
      gio: '09:00',
      ten_cong_viec: 'Hỗ trợ ăn uống',
      mo_ta: 'Theo dõi quá trình ăn uống',
      muc_uu_tien: 'cao',
      id_dieu_duong: nv?.id || '',
      ho_ten_dieu_duong: nv?.ho_ten || '',
      id_benh_nhan: bn?.id || '',
      ho_ten_benh_nhan: bn?.ho_ten || '',
      ghi_chu: 'Ví dụ công việc ưu tiên cao',
    },
    {
      ngay: days[Math.min(1, days.length - 1)],
      gio: '14:00',
      ten_cong_viec: 'Vệ sinh cá nhân',
      mo_ta: '',
      muc_uu_tien: 'thap',
      id_dieu_duong: nv?.id || '',
      ho_ten_dieu_duong: nv?.ho_ten || '',
      id_benh_nhan: '',
      ho_ten_benh_nhan: '',
      ghi_chu: 'Có thể chỉ gán điều dưỡng, không bắt buộc bệnh nhân',
    },
  ];

  for (const ex of examples) {
    rows.push({ stt: stt++, ...ex });
  }

  for (const ngay of days) {
    rows.push({
      stt: stt++,
      ngay,
      gio: '',
      ten_cong_viec: '',
      mo_ta: '',
      muc_uu_tien: 'trung_binh',
      id_dieu_duong: '',
      ho_ten_dieu_duong: '',
      id_benh_nhan: '',
      ho_ten_benh_nhan: '',
      ghi_chu: '',
    });
  }

  return rows;
};

const buildHuongDanPhanCaSheet = (thang, nam) => {
  const rows = [
    ['HƯỚNG DẪN IMPORT PHÂN CA'],
    [`Tháng import: ${thang}/${nam}`],
    [''],
    ['1. Điền dữ liệu vào sheet "Phan_ca" — KHÔNG đổi tên các cột ở hàng đầu tiên'],
    ['2. Tra ID nhân viên tại sheet "Danh_muc_NV" (cột ID tài khoản)'],
    ['3. Ngày phải thuộc tháng/năm đang import, định dạng YYYY-MM-DD (vd: 2026-09-15)'],
    ['4. Ca: sang | chieu | dem'],
    ['5. Giờ: HH:mm (vd: 06:00, 14:00)'],
    ['6. Trạng thái: du_kien | dang_truc | hoan_thanh | vang (mặc định du_kien)'],
    ['7. Dòng trống (không có nhân viên) sẽ được bỏ qua khi import'],
    ['8. Có thể dùng ID tài khoản HOẶC họ tên nhân viên'],
    [''],
    ['CỘT BẮT BUỘC', 'GHI CHÚ'],
    ['Ngày (YYYY-MM-DD)', 'Phải thuộc tháng import'],
    ['ID tài khoản / Họ tên nhân viên', 'Ít nhất một trong hai'],
    ['Ca (sang/chieu/dem)', ''],
    ['Giờ bắt đầu (HH:mm)', ''],
    ['Giờ kết thúc (HH:mm)', ''],
    ['Trạng thái', 'Tùy chọn, mặc định du_kien'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 42 }, { wch: 50 }];
  return ws;
};

const buildHuongDanCongViecSheet = (thang, nam) => {
  const rows = [
    ['HƯỚNG DẪN IMPORT CÔNG VIỆC'],
    [`Tháng import: ${thang}/${nam}`],
    [''],
    ['1. Điền dữ liệu vào sheet "Cong_viec" — KHÔNG đổi tên các cột ở hàng đầu tiên'],
    ['2. Tra ID tại sheet "Danh_muc_NV" (ID hồ sơ) và "Danh_muc_BN" (ID bệnh nhân)'],
    ['3. Ngày + Giờ ghép thành thời gian dự kiến thực hiện công việc'],
    ['4. Mức ưu tiên: thap | trung_binh | cao'],
    ['5. Cần ít nhất điều dưỡng HOẶC bệnh nhân cho mỗi dòng'],
    ['6. Dòng trống (không có tên công việc) sẽ được bỏ qua khi import'],
    [''],
    ['CỘT BẮT BUỘC', 'GHI CHÚ'],
    ['Ngày (YYYY-MM-DD)', 'Phải thuộc tháng import'],
    ['Giờ (HH:mm)', ''],
    ['Tên công việc', ''],
    ['Mức ưu tiên', 'thap / trung_binh / cao'],
    ['ID/Họ tên điều dưỡng hoặc bệnh nhân', 'Ít nhất một loại'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 42 }, { wch: 50 }];
  return ws;
};

const normalizeText = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const normalizeKey = (value) => normalizeText(value).toLowerCase();

const pad2 = (n) => String(n).padStart(2, '0');

export const parseExcelDate = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${pad2(value.getMonth() + 1)}-${pad2(value.getDate())}`;
  }

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      return `${parsed.y}-${pad2(parsed.m)}-${pad2(parsed.d)}`;
    }
  }

  const str = normalizeText(value);
  const datePart = str.split('T')[0].split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    return datePart;
  }

  const slashMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const [, d, m, y] = slashMatch;
    return `${y}-${pad2(m)}-${pad2(d)}`;
  }

  return null;
};

export const parseExcelTime = (value) => {
  if (value === null || value === undefined || value === '') return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${pad2(value.getHours())}:${pad2(value.getMinutes())}:00`;
  }

  if (typeof value === 'number' && value < 1) {
    const totalSeconds = Math.round(value * 24 * 60 * 60);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${pad2(hours)}:${pad2(minutes)}:00`;
  }

  let str = normalizeText(value).replace(/\s*(AM|PM)/i, '').trim();
  if (/^\d{1,2}:\d{2}$/.test(str)) {
    const [h, m] = str.split(':');
    return `${pad2(h)}:${pad2(m)}:00`;
  }
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(str)) {
    const [h, m, s] = str.split(':');
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  }

  return null;
};

export const getMonthRange = (thang, nam) => {
  const month = Number(thang);
  const year = Number(nam);
  const start = `${year}-${pad2(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${pad2(month)}-${pad2(lastDay)}`;
  return { start, end, month, year };
};

const sheetToRows = (workbook, sheetName) => {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
};

const findSheetRows = (workbook, candidates) => {
  for (const name of candidates) {
    if (workbook.SheetNames.includes(name)) {
      return sheetToRows(workbook, name);
    }
  }
  return [];
};

const buildLookupMaps = ({ nhanViens = [], benhNhans = [] }) => {
  const taiKhoanByName = new Map();
  const taiKhoanById = new Map();
  const hoSoByName = new Map();
  const hoSoById = new Map();
  const benhNhanByName = new Map();
  const benhNhanById = new Map();

  for (const nv of nhanViens) {
    if (nv.id_tai_khoan) {
      taiKhoanById.set(String(nv.id_tai_khoan), nv);
      if (nv.ho_ten) taiKhoanByName.set(normalizeKey(nv.ho_ten), nv);
    }
    if (nv.id) {
      hoSoById.set(String(nv.id), nv);
      if (nv.ho_ten) hoSoByName.set(normalizeKey(nv.ho_ten), nv);
    }
  }

  for (const bn of benhNhans) {
    if (bn.id) {
      benhNhanById.set(String(bn.id), bn);
      if (bn.ho_ten) benhNhanByName.set(normalizeKey(bn.ho_ten), bn);
    }
  }

  return { taiKhoanByName, taiKhoanById, hoSoByName, hoSoById, benhNhanByName, benhNhanById };
};

const resolveTaiKhoan = (row, maps) => {
  const id = normalizeText(row.id_tai_khoan);
  if (id && maps.taiKhoanById.has(id)) {
    return maps.taiKhoanById.get(id);
  }
  const name = normalizeKey(row.ho_ten_nhan_vien || row.ho_ten);
  if (name && maps.taiKhoanByName.has(name)) {
    return maps.taiKhoanByName.get(name);
  }
  return null;
};

const resolveHoSoNhanVien = (row, maps) => {
  const id = normalizeText(row.id_dieu_duong || row.id_ho_so_nhan_vien);
  if (id && maps.hoSoById.has(id)) {
    return maps.hoSoById.get(id);
  }
  const name = normalizeKey(row.ho_ten_dieu_duong || row.ho_ten_nhan_vien || row.ho_ten);
  if (name && maps.hoSoByName.has(name)) {
    return maps.hoSoByName.get(name);
  }
  return null;
};

const resolveBenhNhan = (row, maps) => {
  const id = normalizeText(row.id_benh_nhan);
  if (id && maps.benhNhanById.has(id)) {
    return maps.benhNhanById.get(id);
  }
  const name = normalizeKey(row.ho_ten_benh_nhan || row.ho_ten_bn);
  if (name && maps.benhNhanByName.has(name)) {
    return maps.benhNhanByName.get(name);
  }
  return null;
};

const isDateInMonth = (dateStr, thang, nam) => {
  if (!dateStr) return false;
  const [y, m] = dateStr.split('-').map(Number);
  return y === Number(nam) && m === Number(thang);
};

export const parseLichThangWorkbook = (workbook, { thang, nam, nhanViens = [], benhNhans = [], mode = 'all', scope = null }) => {
  const maps = buildLookupMaps({ nhanViens, benhNhans });
  const phanCaRows = findSheetRows(workbook, ['Phan_ca', 'Phân ca', 'PHAN_CA']);
  const congViecRows = findSheetRows(workbook, ['Cong_viec', 'Công việc', 'CONG_VIEC']);

  const phanCa = [];
  const congViec = [];
  const errors = [];
  const isScopedPhanCa = scope?.type === 'nhan_vien_phan_ca';
  const isScopedCongViecNv = scope?.type === 'nhan_vien_cong_viec';
  const isScopedCongViecBn = scope?.type === 'benh_nhan_cong_viec';

  phanCaRows.forEach((rawRow, index) => {
    if (isRowEmpty(rawRow)) return;

    const row = normalizeImportRow(rawRow);
    const hasEmployee = normalizeText(row.id_tai_khoan) || normalizeText(row.ho_ten_nhan_vien);
    const hasCa = normalizeText(row.ca);

    if (isScopedPhanCa) {
      if (!hasCa) return;
    } else if (!hasEmployee || !hasCa) {
      return;
    }

    const rowNum = index + 2;
    const ngay = parseExcelDate(row.ngay);
    const gioBatDau = parseExcelTime(row.gio_bat_dau);
    const gioKetThuc = parseExcelTime(row.gio_ket_thuc);
    const ca = normalizeKey(row.ca);
    const nhanVien = isScopedPhanCa
      ? { id: scope.id_ho_so, id_tai_khoan: scope.id_tai_khoan, ho_ten: scope.ho_ten }
      : resolveTaiKhoan(row, maps);
    const trangThai = normalizeKey(row.trang_thai) || 'du_kien';

    const rowErrors = [];
    if (!ngay) rowErrors.push('Ngày không hợp lệ');
    else if (thang && nam && !isDateInMonth(ngay, thang, nam)) {
      rowErrors.push(`Ngày ${ngay} không thuộc tháng ${thang}/${nam}`);
    }
    if (!nhanVien) rowErrors.push('Không tìm thấy nhân viên (id_tai_khoan hoặc ho_ten_nhan_vien)');
    if (isScopedPhanCa && nhanVien && String(nhanVien.id_tai_khoan) !== String(scope.id_tai_khoan)) {
      rowErrors.push('Phân ca không thuộc nhân viên đang import');
    }
    if (!CA_VALUES.includes(ca)) rowErrors.push('Ca phải là sang, chieu hoặc dem');
    if (!gioBatDau) rowErrors.push('Giờ bắt đầu không hợp lệ');
    if (!gioKetThuc) rowErrors.push('Giờ kết thúc không hợp lệ');
    if (!TRANG_THAI_CA_VALUES.includes(trangThai)) rowErrors.push('Trạng thái ca không hợp lệ');

    const item = {
      row: rowNum,
      sheet: 'Phan_ca',
      ngay,
      id_tai_khoan: nhanVien?.id_tai_khoan || null,
      ho_ten_nhan_vien: nhanVien?.ho_ten || normalizeText(row.ho_ten_nhan_vien || row.ho_ten),
      ca,
      gio_bat_dau: gioBatDau,
      gio_ket_thuc: gioKetThuc,
      trang_thai: trangThai,
      valid: rowErrors.length === 0
    };

    if (rowErrors.length) {
      errors.push({ sheet: 'Phan_ca', row: rowNum, messages: rowErrors });
    }
    phanCa.push(item);
  });

  congViecRows.forEach((rawRow, index) => {
    if (isRowEmpty(rawRow)) return;

    const row = normalizeImportRow(rawRow);
    if (!normalizeText(row.ten_cong_viec)) return;

    const rowNum = index + 2;
    const ngay = parseExcelDate(row.ngay);
    const gio = parseExcelTime(row.gio);
    const tenCongViec = normalizeText(row.ten_cong_viec);
    const mucUuTien = normalizeKey(row.muc_uu_tien) || 'trung_binh';

    let dieuDuong = null;
    let benhNhan = null;

    if (isScopedCongViecNv) {
      dieuDuong = { id: scope.id_ho_so, ho_ten: scope.ho_ten };
      benhNhan = resolveBenhNhan(row, maps);
    } else if (isScopedCongViecBn) {
      benhNhan = { id: scope.id_benh_nhan, ho_ten: scope.ho_ten };
      dieuDuong = resolveHoSoNhanVien(row, maps);
    } else {
      dieuDuong = resolveHoSoNhanVien(row, maps);
      benhNhan = resolveBenhNhan(row, maps);
    }

    const rowErrors = [];
    if (!ngay) rowErrors.push('Ngày không hợp lệ');
    else if (thang && nam && !isDateInMonth(ngay, thang, nam)) {
      rowErrors.push(`Ngày ${ngay} không thuộc tháng ${thang}/${nam}`);
    }
    if (!gio) rowErrors.push('Giờ không hợp lệ');
    if (!tenCongViec) rowErrors.push('Thiếu tên công việc');
    if (!MUC_UU_TIEN_VALUES.includes(mucUuTien)) rowErrors.push('Mức ưu tiên phải là thap, trung_binh hoặc cao');

    if (isScopedCongViecNv) {
      if (!benhNhan) rowErrors.push('Cần chọn bệnh nhân phụ trách');
      else if (scope.allowedBenhNhanIds && !scope.allowedBenhNhanIds.has(String(benhNhan.id))) {
        rowErrors.push('Bệnh nhân không thuộc danh sách phụ trách của nhân viên này');
      }
    } else if (isScopedCongViecBn) {
      if (!dieuDuong) rowErrors.push('Cần chọn điều dưỡng phụ trách');
      else if (scope.allowedDieuDuongIds && !scope.allowedDieuDuongIds.has(String(dieuDuong.id))) {
        rowErrors.push('Điều dưỡng không phụ trách bệnh nhân này');
      }
    } else if (!dieuDuong && !benhNhan) {
      rowErrors.push('Cần ít nhất điều dưỡng hoặc bệnh nhân');
    }

    const thoiGianDuKien = ngay && gio ? `${ngay} ${gio}` : null;

    const item = {
      row: rowNum,
      sheet: 'Cong_viec',
      ngay,
      gio,
      thoi_gian_du_kien: thoiGianDuKien,
      ten_cong_viec: tenCongViec,
      mo_ta: normalizeText(row.mo_ta) || null,
      muc_uu_tien: mucUuTien,
      id_dieu_duong: dieuDuong?.id || null,
      ho_ten_dieu_duong: dieuDuong?.ho_ten || normalizeText(row.ho_ten_dieu_duong),
      id_benh_nhan: benhNhan?.id || null,
      ho_ten_benh_nhan: benhNhan?.ho_ten || normalizeText(row.ho_ten_benh_nhan),
      valid: rowErrors.length === 0
    };

    if (rowErrors.length) {
      errors.push({ sheet: 'Cong_viec', row: rowNum, messages: rowErrors });
    }
    congViec.push(item);
  });

  if (mode === 'phan_ca' || mode === 'all') {
    if (phanCa.length === 0) {
      errors.push({
        sheet: 'Phan_ca',
        row: 0,
        messages: ['Sheet "Phan_ca" không có dữ liệu']
      });
    }
  }

  if (mode === 'cong_viec' || mode === 'all') {
    if (congViec.length === 0) {
      errors.push({
        sheet: 'Cong_viec',
        row: 0,
        messages: ['Sheet "Cong_viec" không có dữ liệu']
      });
    }
  }

  const summary = {
    tong_phan_ca: phanCa.length,
    phan_ca_hop_le: phanCa.filter((r) => r.valid).length,
    tong_cong_viec: congViec.length,
    cong_viec_hop_le: congViec.filter((r) => r.valid).length,
    tong_loi: errors.length
  };

  if (mode === 'phan_ca') {
    summary.tong_cong_viec = 0;
    summary.cong_viec_hop_le = 0;
  }
  if (mode === 'cong_viec') {
    summary.tong_phan_ca = 0;
    summary.phan_ca_hop_le = 0;
  }

  return {
    phanCa: mode === 'cong_viec' ? [] : phanCa,
    congViec: mode === 'phan_ca' ? [] : congViec,
    errors,
    summary
  };
};

export const buildPhanCaTemplate = ({ thang, nam, nhanViens = [] }) => {
  const sampleRows = buildPhanCaSampleRows({ thang, nam, nhanViens });

  const danhMucNVRows = nhanViens.length > 0
    ? nhanViens.map((nv, idx) => ({
      stt: idx + 1,
      id_ho_so: nv.id,
      id_tai_khoan: nv.id_tai_khoan,
      ho_ten: nv.ho_ten,
      vai_tro: nv.vai_tro,
    }))
    : [{
      stt: 1,
      id_ho_so: '',
      id_tai_khoan: '',
      ho_ten: '(Chưa có nhân viên trong hệ thống)',
      vai_tro: '',
    }];

  const danhMucColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_ho_so', label: 'ID hồ sơ NV', width: 14 },
    { key: 'id_tai_khoan', label: 'ID tài khoản', width: 14 },
    { key: 'ho_ten', label: 'Họ tên', width: 30 },
    { key: 'vai_tro', label: 'Vai trò', width: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(PHAN_CA_COLUMNS, sampleRows), 'Phan_ca');
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucColumns, danhMucNVRows), 'Danh_muc_NV');
  XLSX.utils.book_append_sheet(workbook, buildHuongDanPhanCaSheet(thang, nam), 'Huong_dan');
  return workbook;
};

export const buildCongViecTemplate = ({ thang, nam, nhanViens = [], benhNhans = [] }) => {
  const sampleRows = buildCongViecSampleRows({ thang, nam, nhanViens, benhNhans });

  const danhMucNVRows = nhanViens.length > 0
    ? nhanViens.map((nv, idx) => ({
      stt: idx + 1,
      id_ho_so: nv.id,
      id_tai_khoan: nv.id_tai_khoan,
      ho_ten: nv.ho_ten,
      vai_tro: nv.vai_tro,
    }))
    : [{
      stt: 1,
      id_ho_so: '',
      id_tai_khoan: '',
      ho_ten: '(Chưa có nhân viên trong hệ thống)',
      vai_tro: '',
    }];

  const danhMucBNRows = benhNhans.length > 0
    ? benhNhans.map((bn, idx) => ({
      stt: idx + 1,
      id_benh_nhan: bn.id,
      ho_ten: bn.ho_ten,
    }))
    : [{
      stt: 1,
      id_benh_nhan: '',
      ho_ten: '(Chưa có bệnh nhân trong hệ thống)',
    }];

  const danhMucNVColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_ho_so', label: 'ID hồ sơ NV', width: 14 },
    { key: 'id_tai_khoan', label: 'ID tài khoản', width: 14 },
    { key: 'ho_ten', label: 'Họ tên', width: 30 },
    { key: 'vai_tro', label: 'Vai trò', width: 18 },
  ];

  const danhMucBNColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_benh_nhan', label: 'ID bệnh nhân', width: 14 },
    { key: 'ho_ten', label: 'Họ tên', width: 30 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(CONG_VIEC_COLUMNS, sampleRows), 'Cong_viec');
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucNVColumns, danhMucNVRows), 'Danh_muc_NV');
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucBNColumns, danhMucBNRows), 'Danh_muc_BN');
  XLSX.utils.book_append_sheet(workbook, buildHuongDanCongViecSheet(thang, nam), 'Huong_dan');
  return workbook;
};

export const buildNhanVienDanhMucWorkbook = (nhanViens = []) => {
  const danhMucNVRows = nhanViens.length > 0
    ? nhanViens.map((nv, idx) => ({
      stt: idx + 1,
      id_ho_so: nv.id,
      id_tai_khoan: nv.id_tai_khoan,
      ho_ten: nv.ho_ten,
      vai_tro: nv.vai_tro,
    }))
    : [{
      stt: 1,
      id_ho_so: '',
      id_tai_khoan: '',
      ho_ten: '(Chưa có nhân viên trong hệ thống)',
      vai_tro: '',
    }];

  const danhMucColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_ho_so', label: 'ID hồ sơ NV', width: 14 },
    { key: 'id_tai_khoan', label: 'ID tài khoản', width: 14 },
    { key: 'ho_ten', label: 'Họ tên', width: 30 },
    { key: 'vai_tro', label: 'Vai trò', width: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucColumns, danhMucNVRows), 'Danh_muc_NV');
  return workbook;
};

export const buildBenhNhanDanhMucWorkbook = (benhNhans = []) => {
  const danhMucBNRows = benhNhans.length > 0
    ? benhNhans.map((bn, idx) => ({
      stt: idx + 1,
      id_benh_nhan: bn.id,
      ho_ten: bn.ho_ten,
    }))
    : [{
      stt: 1,
      id_benh_nhan: '',
      ho_ten: '(Chưa có bệnh nhân trong hệ thống)',
    }];

  const danhMucBNColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_benh_nhan', label: 'ID bệnh nhân', width: 14 },
    { key: 'ho_ten', label: 'Họ tên', width: 30 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucBNColumns, danhMucBNRows), 'Danh_muc_BN');
  return workbook;
};

const buildPhanCaNvSampleRows = ({ thang, nam }) => {
  const days = getDaysInMonth(thang, nam);
  const rows = [];
  let stt = 1;

  rows.push(
    { stt: stt++, ngay: days[0], ca: 'sang', gio_bat_dau: '06:00', gio_ket_thuc: '14:00', trang_thai: 'du_kien', ghi_chu: 'Ví dụ ca sáng' },
    { stt: stt++, ngay: days[0], ca: 'chieu', gio_bat_dau: '14:00', gio_ket_thuc: '22:00', trang_thai: 'du_kien', ghi_chu: 'Ví dụ ca chiều' },
  );

  for (const ngay of days) {
    rows.push({ stt: stt++, ngay, ca: '', gio_bat_dau: '', gio_ket_thuc: '', trang_thai: 'du_kien', ghi_chu: '' });
  }
  return rows;
};

const buildCongViecNvSampleRows = ({ thang, nam, benhNhans = [] }) => {
  const days = getDaysInMonth(thang, nam);
  const bn = benhNhans[0];
  const rows = [];
  let stt = 1;

  rows.push({
    stt: stt++,
    ngay: days[0],
    gio: '08:00',
    ten_cong_viec: 'Đo huyết áp buổi sáng',
    mo_ta: 'Đo và ghi nhận chỉ số',
    muc_uu_tien: 'trung_binh',
    id_benh_nhan: bn?.id || '',
    ho_ten_benh_nhan: bn?.ho_ten || '',
    ghi_chu: 'Ví dụ — chọn bệnh nhân phụ trách',
  });

  for (const ngay of days) {
    rows.push({
      stt: stt++, ngay, gio: '', ten_cong_viec: '', mo_ta: '', muc_uu_tien: 'trung_binh',
      id_benh_nhan: '', ho_ten_benh_nhan: '', ghi_chu: '',
    });
  }
  return rows;
};

const buildCongViecBnSampleRows = ({ thang, nam, nhanViens = [] }) => {
  const days = getDaysInMonth(thang, nam);
  const nv = nhanViens[0];
  const rows = [];
  let stt = 1;

  rows.push({
    stt: stt++,
    ngay: days[0],
    gio: '08:00',
    ten_cong_viec: 'Đo huyết áp buổi sáng',
    mo_ta: 'Đo và ghi nhận chỉ số',
    muc_uu_tien: 'trung_binh',
    id_dieu_duong: nv?.id || '',
    ho_ten_dieu_duong: nv?.ho_ten || '',
    ghi_chu: 'Ví dụ — chọn điều dưỡng phụ trách',
  });

  for (const ngay of days) {
    rows.push({
      stt: stt++, ngay, gio: '', ten_cong_viec: '', mo_ta: '', muc_uu_tien: 'trung_binh',
      id_dieu_duong: '', ho_ten_dieu_duong: '', ghi_chu: '',
    });
  }
  return rows;
};

const buildThongTinNhanVienSheet = (nhanVien) => {
  const rows = [
    ['THÔNG TIN NHÂN VIÊN'],
    ['ID hồ sơ', nhanVien.id],
    ['ID tài khoản', nhanVien.id_tai_khoan],
    ['Họ tên', nhanVien.ho_ten],
    ['Vai trò', nhanVien.vai_tro || ''],
    ['', ''],
    ['Lưu ý', 'File import chỉ áp dụng cho nhân viên này'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
  return ws;
};

const buildThongTinBenhNhanSheet = (benhNhan) => {
  const rows = [
    ['THÔNG TIN BỆNH NHÂN'],
    ['ID bệnh nhân', benhNhan.id],
    ['Họ tên', benhNhan.ho_ten],
    ['', ''],
    ['Lưu ý', 'File import chỉ áp dụng cho bệnh nhân này'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 20 }, { wch: 40 }];
  return ws;
};

export const buildPhanCaTemplateForNhanVien = ({ thang, nam, nhanVien }) => {
  const sampleRows = buildPhanCaNvSampleRows({ thang, nam });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(PHAN_CA_NV_COLUMNS, sampleRows), 'Phan_ca');
  XLSX.utils.book_append_sheet(workbook, buildThongTinNhanVienSheet(nhanVien), 'Thong_tin_NV');
  XLSX.utils.book_append_sheet(workbook, buildHuongDanPhanCaSheet(thang, nam), 'Huong_dan');
  return workbook;
};

export const buildCongViecTemplateForNhanVien = ({ thang, nam, nhanVien, benhNhans = [] }) => {
  const sampleRows = buildCongViecNvSampleRows({ thang, nam, benhNhans });
  const danhMucBNRows = benhNhans.length > 0
    ? benhNhans.map((bn, idx) => ({ stt: idx + 1, id_benh_nhan: bn.id, ho_ten: bn.ho_ten }))
    : [{ stt: 1, id_benh_nhan: '', ho_ten: '(Chưa có bệnh nhân phụ trách)' }];

  const danhMucBNColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_benh_nhan', label: 'ID bệnh nhân', width: 14 },
    { key: 'ho_ten', label: 'Họ tên bệnh nhân phụ trách', width: 36 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(CONG_VIEC_NV_COLUMNS, sampleRows), 'Cong_viec');
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucBNColumns, danhMucBNRows), 'Danh_muc_BN');
  XLSX.utils.book_append_sheet(workbook, buildThongTinNhanVienSheet(nhanVien), 'Thong_tin_NV');
  XLSX.utils.book_append_sheet(workbook, buildHuongDanCongViecSheet(thang, nam), 'Huong_dan');
  return workbook;
};

export const buildCongViecTemplateForBenhNhan = ({ thang, nam, benhNhan, nhanViens = [] }) => {
  const sampleRows = buildCongViecBnSampleRows({ thang, nam, nhanViens });
  const danhMucNVRows = nhanViens.length > 0
    ? nhanViens.map((nv, idx) => ({
      stt: idx + 1,
      id_ho_so: nv.id,
      id_tai_khoan: nv.id_tai_khoan,
      ho_ten: nv.ho_ten,
      vai_tro: nv.vai_tro,
    }))
    : [{ stt: 1, id_ho_so: '', id_tai_khoan: '', ho_ten: '(Chưa có điều dưỡng phụ trách)', vai_tro: '' }];

  const danhMucNVColumns = [
    { key: 'stt', label: 'STT', width: 6 },
    { key: 'id_ho_so', label: 'ID hồ sơ NV', width: 14 },
    { key: 'id_tai_khoan', label: 'ID tài khoản', width: 14 },
    { key: 'ho_ten', label: 'Họ tên điều dưỡng phụ trách', width: 36 },
    { key: 'vai_tro', label: 'Vai trò', width: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(CONG_VIEC_BN_COLUMNS, sampleRows), 'Cong_viec');
  XLSX.utils.book_append_sheet(workbook, buildTemplateSheet(danhMucNVColumns, danhMucNVRows), 'Danh_muc_NV');
  XLSX.utils.book_append_sheet(workbook, buildThongTinBenhNhanSheet(benhNhan), 'Thong_tin_BN');
  XLSX.utils.book_append_sheet(workbook, buildHuongDanCongViecSheet(thang, nam), 'Huong_dan');
  return workbook;
};

export const buildLichThangTemplate = ({ thang, nam, nhanViens = [], benhNhans = [] }) => {
  const { start } = getMonthRange(thang, nam);

  const huongDan = [
    { cot: 'ngay', mo_ta: 'Ngày (YYYY-MM-DD), phải thuộc tháng import' },
    { cot: 'id_tai_khoan', mo_ta: 'ID tài khoản nhân viên (xem sheet Danh_muc_NV)' },
    { cot: 'ho_ten_nhan_vien', mo_ta: 'Họ tên nhân viên (dùng nếu không có id_tai_khoan)' },
    { cot: 'ca', mo_ta: 'sang | chieu | dem' },
    { cot: 'gio_bat_dau', mo_ta: 'HH:mm, ví dụ 06:00' },
    { cot: 'gio_ket_thuc', mo_ta: 'HH:mm, ví dụ 14:00' },
    { cot: 'trang_thai', mo_ta: 'du_kien (mặc định) | dang_truc | hoan_thanh | vang' }
  ];

  const huongDanCv = [
    { cot: 'ngay', mo_ta: 'Ngày (YYYY-MM-DD)' },
    { cot: 'gio', mo_ta: 'HH:mm thời gian dự kiến' },
    { cot: 'ten_cong_viec', mo_ta: 'Tên công việc (bắt buộc)' },
    { cot: 'mo_ta', mo_ta: 'Mô tả (tùy chọn)' },
    { cot: 'muc_uu_tien', mo_ta: 'thap | trung_binh | cao' },
    { cot: 'id_dieu_duong', mo_ta: 'ID hồ sơ nhân viên (sheet Danh_muc_NV, cột id_ho_so)' },
    { cot: 'ho_ten_dieu_duong', mo_ta: 'Họ tên điều dưỡng' },
    { cot: 'id_benh_nhan', mo_ta: 'ID bệnh nhân (sheet Danh_muc_BN)' },
    { cot: 'ho_ten_benh_nhan', mo_ta: 'Họ tên bệnh nhân' }
  ];

  const phanCaSample = [
    {
      ngay: start,
      id_tai_khoan: nhanViens[0]?.id_tai_khoan || '',
      ho_ten_nhan_vien: nhanViens[0]?.ho_ten || '',
      ca: 'sang',
      gio_bat_dau: '06:00',
      gio_ket_thuc: '14:00',
      trang_thai: 'du_kien'
    }
  ];

  const congViecSample = [
    {
      ngay: start,
      gio: '08:00',
      ten_cong_viec: 'Đo huyết áp buổi sáng',
      mo_ta: 'Đo và ghi nhận chỉ số',
      muc_uu_tien: 'trung_binh',
      id_dieu_duong: nhanViens[0]?.id || '',
      ho_ten_dieu_duong: nhanViens[0]?.ho_ten || '',
      id_benh_nhan: benhNhans[0]?.id || '',
      ho_ten_benh_nhan: benhNhans[0]?.ho_ten || ''
    }
  ];

  const danhMucNV = nhanViens.map((nv) => ({
    id_ho_so: nv.id,
    id_tai_khoan: nv.id_tai_khoan,
    ho_ten: nv.ho_ten,
    vai_tro: nv.vai_tro
  }));

  const danhMucBN = benhNhans.map((bn) => ({
    id_benh_nhan: bn.id,
    ho_ten: bn.ho_ten
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(huongDan), 'Huong_dan_Phan_ca');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(huongDanCv), 'Huong_dan_Cong_viec');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(phanCaSample), 'Phan_ca');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(congViecSample), 'Cong_viec');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(danhMucNV), 'Danh_muc_NV');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(danhMucBN), 'Danh_muc_BN');

  return workbook;
};

export const workbookToBuffer = (workbook) => {
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};

export const parseWorkbookFromBuffer = (buffer) => {
  return XLSX.read(buffer, { type: 'buffer', cellDates: true });
};
