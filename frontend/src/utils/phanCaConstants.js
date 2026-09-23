export const CA_BAND_LABELS = {
  sang: 'Ca ngày / sáng',
  chieu: 'Ca chiều',
  dem: 'Ca đêm',
};

export const HINH_THUC_LABELS = {
  tai_co_so: 'Tại cơ sở',
  remote: 'Remote',
  onsite: 'ONSITE',
  hanh_chinh: 'Hành chính (OH)',
  truc_dem: 'Trực đêm',
  truc_24h: 'Trực 24h',
  dao_tao: 'Đào tạo',
  khac: 'Khác',
};

export const MA_CA_PRESETS = [
  { value: 'A', label: 'A — Ca ngày (7:30–17:30)' },
  { value: 'D', label: 'D — Ca đêm (17:30–7:30)' },
  { value: 'N', label: 'N — Ca đêm' },
  { value: 'OH', label: 'OH — Hành chính' },
  { value: 'Remote', label: 'Remote' },
  { value: 'ONSITE', label: 'ONSITE' },
  { value: 'Ca sáng', label: 'Ca sáng (6:00–14:00)' },
  { value: 'Ca chiều', label: 'Ca chiều' },
];

/** Giờ mặc định theo roster DLXH */
export const DEFAULT_CA_TIMES = {
  sang: { gio_bat_dau: '07:30', gio_ket_thuc: '17:30' },
  chieu: { gio_bat_dau: '13:30', gio_ket_thuc: '17:30' },
  dem: { gio_bat_dau: '17:30', gio_ket_thuc: '07:30' },
};

export const inferCaBandFromMa = (maCa = '') => {
  const key = (maCa || '').trim().toUpperCase();
  if (['D', 'N', 'D1', 'D2'].includes(key)) return 'dem';
  if (maCa === 'Ca chiều' || key === 'CA CHIỀU') return 'chieu';
  return 'sang';
};

export const resolveCaTimesForForm = (ca, maCa = '') => {
  const key = (maCa || '').trim().toUpperCase();
  if (key === 'A' || maCa === 'Ca ngày') return { ...DEFAULT_CA_TIMES.sang, hinh_thuc: 'tai_co_so' };
  if (['D', 'N', 'D1', 'D2'].includes(key)) return { ...DEFAULT_CA_TIMES.dem, hinh_thuc: 'truc_dem' };
  if (key === 'OH') return { gio_bat_dau: '08:00', gio_ket_thuc: '18:00', hinh_thuc: 'hanh_chinh' };
  if (key === 'REMOTE') return { ...DEFAULT_CA_TIMES.sang, hinh_thuc: 'remote' };
  if (key === 'ONSITE') return { ...DEFAULT_CA_TIMES.sang, hinh_thuc: 'onsite' };
  if (maCa === 'Ca sáng') return { gio_bat_dau: '06:00', gio_ket_thuc: '14:00', hinh_thuc: 'tai_co_so' };
  if (maCa === 'Ca chiều') return { ...DEFAULT_CA_TIMES.chieu, hinh_thuc: 'tai_co_so' };
  return { ...(DEFAULT_CA_TIMES[ca] || DEFAULT_CA_TIMES.sang), hinh_thuc: 'tai_co_so' };
};

export const formatHinhThuc = (code) => HINH_THUC_LABELS[code] || code || '—';
