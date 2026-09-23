/**
 * Ánh xạ ký hiệu trên file roster DLXH → ca (sang/chieu/dem), giờ, hình thức làm việc.
 * Ca ngày DLXH: 7:30–17:30 | Kip đêm: 17:30–7:30
 */

export const HINH_THUC_LAM_VIEC = {
  TAI_CO_SO: 'tai_co_so',
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HANH_CHINH: 'hanh_chinh',
  TRUC_DEM: 'truc_dem',
  TRUC_24H: 'truc_24h',
  DAO_TAO: 'dao_tao',
  KHAC: 'khac',
};

export const HINH_THUC_LABELS = {
  tai_co_so: 'Tại cơ sở',
  remote: 'Làm việc từ xa',
  onsite: 'Trực tại viện (ONSITE)',
  hanh_chinh: 'Hành chính (OH)',
  truc_dem: 'Trực đêm',
  truc_24h: 'Trực 24h',
  dao_tao: 'Đào tạo',
  khac: 'Khác',
};

export const MA_CA_LABELS = {
  A: 'Ca ngày (A)',
  D: 'Ca đêm (D)',
  N: 'Ca đêm (N)',
  OH: 'Office hours',
  Remote: 'Remote',
  ONSITE: 'ONSITE',
  OFF: 'Nghỉ (OFF)',
  NL: 'Nghỉ lễ',
  NB: 'Nghỉ bù',
  NP: 'Nghỉ phép',
};

export const CA_BAND_LABELS = {
  sang: 'Ca ngày / sáng',
  chieu: 'Ca chiều',
  dem: 'Ca đêm',
};

/** Giờ mặc định theo quy định roster DLXH */
export const DEFAULT_CA_TIMES = {
  sang: { gio_bat_dau: '07:30:00', gio_ket_thuc: '17:30:00' },
  chieu: { gio_bat_dau: '13:30:00', gio_ket_thuc: '17:30:00' },
  dem: { gio_bat_dau: '17:30:00', gio_ket_thuc: '07:30:00' },
  sang_legacy: { gio_bat_dau: '06:00:00', gio_ket_thuc: '14:00:00' },
  hanh_chinh: { gio_bat_dau: '08:00:00', gio_ket_thuc: '18:00:00' },
};

const normalizeCell = (value) => {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\s+/g, ' ').trim();
};

const normalizeKey = (value) => normalizeCell(value).toLowerCase();

const parseTimeRange = (text) => {
  const m = normalizeCell(text).match(/(\d{1,2})[:h](\d{2})\s*[-–]\s*(\d{1,2})[:h]?(\d{2})?/i);
  if (!m) return null;
  const pad = (n) => String(n).padStart(2, '0');
  const endMin = m[4] !== undefined ? m[4] : '00';
  return {
    gio_bat_dau: `${pad(m[1])}:${pad(m[2])}:00`,
    gio_ket_thuc: `${pad(m[3])}:${pad(endMin)}:00`,
  };
};

const buildShift = ({
  ma_ca,
  ca,
  hinh_thuc_lam_viec,
  gio_bat_dau,
  gio_ket_thuc,
  ghi_chu = null,
  trang_thai = 'du_kien',
}) => ({
  type: 'shift',
  ma_ca,
  ca,
  hinh_thuc_lam_viec,
  gio_bat_dau,
  gio_ket_thuc,
  ghi_chu,
  trang_thai,
});

/** @returns {{ type: 'skip'|'off'|'shift', ... }} */
export const mapRosterCellToShift = (cellValue) => {
  const raw = normalizeCell(cellValue);
  if (!raw || raw === '-') return { type: 'skip' };

  const upper = raw.toUpperCase();
  const key = normalizeKey(raw);

  const offPatterns = new Set([
    'off', 'np', 'nl', 'nb', 'kl', 'nghỉ', 'nghi', 'nghỉ phép', 'nghỉ bù', 'nghỉ phep', 'nghỉ bu',
  ]);
  if (offPatterns.has(key) || key.startsWith('nghỉ ') || key.startsWith('nghi ')) {
    return { type: 'off', ma_ca: raw };
  }

  const timeRange = parseTimeRange(raw);
  if (timeRange) {
    const isNight = timeRange.gio_bat_dau >= '17:00:00' || timeRange.gio_ket_thuc <= '08:00:00';
    return buildShift({
      ma_ca: raw,
      ca: isNight ? 'dem' : 'sang',
      hinh_thuc_lam_viec: isNight ? HINH_THUC_LAM_VIEC.TRUC_DEM : HINH_THUC_LAM_VIEC.TAI_CO_SO,
      ...timeRange,
    });
  }

  if (upper === 'A' || key === 'ca ngày' || key === 'ca ngay') {
    return buildShift({
      ma_ca: 'A',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TAI_CO_SO,
      ...DEFAULT_CA_TIMES.sang,
    });
  }

  if (['D', 'D1', 'D2', 'N', 'D-OC', 'D - OC', 'D- PT', 'N- PT'].includes(upper) || key.includes('trực đêm') || key === 'truc dem') {
    return buildShift({
      ma_ca: upper.replace(/\s+/g, ''),
      ca: 'dem',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TRUC_DEM,
      ...DEFAULT_CA_TIMES.dem,
    });
  }

  if (upper === 'REMOTE') {
    return buildShift({
      ma_ca: 'Remote',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.REMOTE,
      ...DEFAULT_CA_TIMES.sang,
    });
  }

  if (upper === 'ONSITE') {
    return buildShift({
      ma_ca: 'ONSITE',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.ONSITE,
      ...DEFAULT_CA_TIMES.sang,
    });
  }

  if (upper === 'OH' || key === 'hành chính' || key === 'hanh chinh') {
    return buildShift({
      ma_ca: 'OH',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.HANH_CHINH,
      ...DEFAULT_CA_TIMES.hanh_chinh,
    });
  }

  if (key === 'ca sáng' || key === 'ca sang' || upper === 'C1') {
    return buildShift({
      ma_ca: upper || 'Ca sáng',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TAI_CO_SO,
      gio_bat_dau: '06:00:00',
      gio_ket_thuc: '14:00:00',
    });
  }

  if (key === 'ca chiều' || upper === 'C2') {
    return buildShift({
      ma_ca: upper || 'Ca chiều',
      ca: 'chieu',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TAI_CO_SO,
      ...DEFAULT_CA_TIMES.chieu,
    });
  }

  if (key.includes('trực 24') || key === 'truc 24h') {
    return buildShift({
      ma_ca: 'Trực 24h',
      ca: 'dem',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TRUC_24H,
      gio_bat_dau: '07:30:00',
      gio_ket_thuc: '07:30:00',
      ghi_chu: 'Trực 24h',
    });
  }

  if (key.includes('đào tạo') || key === 'dt' || upper === 'ĐT') {
    return buildShift({
      ma_ca: 'ĐT',
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.DAO_TAO,
      ...DEFAULT_CA_TIMES.hanh_chinh,
    });
  }

  if (key.startsWith('1/2')) {
    const base = mapRosterCellToShift(raw.replace(/^1\/2\s*/i, ''));
    if (base.type === 'shift') {
      return {
        ...base,
        ma_ca: raw,
        ghi_chu: 'Ca nửa ngày',
      };
    }
  }

  if (['G', 'KC', 'CA GÃY', 'CA GAY'].includes(upper) || key === 'ca gãy') {
    return buildShift({
      ma_ca: raw,
      ca: 'sang',
      hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.KHAC,
      ...DEFAULT_CA_TIMES.sang,
      ghi_chu: raw,
    });
  }

  return {
    type: 'shift',
    ma_ca: raw,
    ca: 'sang',
    hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.KHAC,
    ...DEFAULT_CA_TIMES.sang,
    ghi_chu: `Ký hiệu chưa chuẩn hóa: ${raw}`,
  };
};

/** Ánh xạ mã ca / ca sang giờ mặc định (form UI + import) */
export const resolveCaTimes = (ca, maCa = null) => {
  const mapped = maCa ? mapRosterCellToShift(maCa) : null;
  if (mapped?.type === 'shift') {
    return {
      gio_bat_dau: mapped.gio_bat_dau,
      gio_ket_thuc: mapped.gio_ket_thuc,
      hinh_thuc_lam_viec: mapped.hinh_thuc_lam_viec,
    };
  }
  const defaults = DEFAULT_CA_TIMES[ca] || DEFAULT_CA_TIMES.sang;
  return { ...defaults, hinh_thuc_lam_viec: HINH_THUC_LAM_VIEC.TAI_CO_SO };
};

export const listRosterCatalog = () => [
  { ma_ca: 'A', mo_ta: 'Ca ngày 7:30–17:30', ca: 'sang', hinh_thuc: 'tai_co_so' },
  { ma_ca: 'D / N', mo_ta: 'Kip đêm 17:30–7:30', ca: 'dem', hinh_thuc: 'truc_dem' },
  { ma_ca: 'OH', mo_ta: 'Hành chính 8:00–18:00', ca: 'sang', hinh_thuc: 'hanh_chinh' },
  { ma_ca: 'Remote', mo_ta: 'Làm việc từ xa (7:30–17:30)', ca: 'sang', hinh_thuc: 'remote' },
  { ma_ca: 'ONSITE', mo_ta: 'Trực tại viện', ca: 'sang', hinh_thuc: 'onsite' },
  { ma_ca: 'OFF / NL / NB / NP', mo_ta: 'Nghỉ — không tạo ca trên lịch', ca: '—', hinh_thuc: '—' },
];
