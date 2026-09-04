import * as XLSX from 'xlsx';

const PHAN_CA_HEADERS = [
  'STT',
  'Ngày (YYYY-MM-DD)',
  'ID tài khoản',
  'Họ tên nhân viên',
  'Ca (sang/chieu/dem)',
  'Giờ bắt đầu (HH:mm)',
  'Giờ kết thúc (HH:mm)',
  'Trạng thái (du_kien/dang_truc/hoan_thanh/vang)',
  'Ghi chú',
];

const CONG_VIEC_HEADERS = [
  'STT',
  'Ngày (YYYY-MM-DD)',
  'Giờ (HH:mm)',
  'Tên công việc',
  'Mô tả',
  'Mức ưu tiên (thap/trung_binh/cao)',
  'ID hồ sơ điều dưỡng',
  'Họ tên điều dưỡng',
  'ID bệnh nhân',
  'Họ tên bệnh nhân',
  'Ghi chú',
];

const workbookToFile = (workbook, fileName) => {
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new File(
    [buffer],
    fileName,
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  );
};

export const buildPhanCaFileFromRows = (rows, fileName = 'import-phan-ca.xlsx') => {
  const bodyRows = rows.map((row, index) => [
    index + 1,
    row.ngay || '',
    row.id_tai_khoan || '',
    row.ho_ten_nhan_vien || '',
    row.ca || '',
    row.gio_bat_dau?.slice?.(0, 5) || row.gio_bat_dau || '',
    row.gio_ket_thuc?.slice?.(0, 5) || row.gio_ket_thuc || '',
    row.trang_thai || 'du_kien',
    row.ghi_chu || '',
  ]);

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([PHAN_CA_HEADERS, ...bodyRows]);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Phan_ca');
  return workbookToFile(workbook, fileName);
};

export const buildCongViecFileFromRows = (rows, fileName = 'import-cong-viec.xlsx') => {
  const bodyRows = rows.map((row, index) => {
    const gio = row.gio?.slice?.(0, 5) || row.gio || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[1]?.slice(0, 5) : '');
    return [
      index + 1,
      row.ngay || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[0] : ''),
      gio,
      row.ten_cong_viec || '',
      row.mo_ta || '',
      row.muc_uu_tien || 'trung_binh',
      row.id_dieu_duong || '',
      row.ho_ten_dieu_duong || '',
      row.id_benh_nhan || '',
      row.ho_ten_benh_nhan || '',
      row.ghi_chu || '',
    ];
  });

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([CONG_VIEC_HEADERS, ...bodyRows]);
  XLSX.utils.book_append_sheet(workbook, sheet, 'Cong_viec');
  return workbookToFile(workbook, fileName);
};

export const PHAN_CA_EDIT_FIELDS = [
  { key: 'ngay', label: 'Ngày', width: 'w-32' },
  { key: 'id_tai_khoan', label: 'ID TK', width: 'w-20' },
  { key: 'ho_ten_nhan_vien', label: 'Họ tên NV', width: 'w-36' },
  { key: 'ca', label: 'Ca', width: 'w-24' },
  { key: 'gio_bat_dau', label: 'Giờ BD', width: 'w-24' },
  { key: 'gio_ket_thuc', label: 'Giờ KT', width: 'w-24' },
  { key: 'trang_thai', label: 'Trạng thái', width: 'w-28' },
];

export const CONG_VIEC_EDIT_FIELDS = [
  { key: 'ngay', label: 'Ngày', width: 'w-32' },
  { key: 'gio', label: 'Giờ', width: 'w-20' },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 'w-40' },
  { key: 'mo_ta', label: 'Mô tả', width: 'w-36' },
  { key: 'muc_uu_tien', label: 'Ưu tiên', width: 'w-24' },
  { key: 'id_dieu_duong', label: 'ID ĐD', width: 'w-20' },
  { key: 'ho_ten_dieu_duong', label: 'Họ tên ĐD', width: 'w-32' },
  { key: 'id_benh_nhan', label: 'ID BN', width: 'w-20' },
  { key: 'ho_ten_benh_nhan', label: 'Họ tên BN', width: 'w-32' },
];

const PHAN_CA_NV_HEADERS = [
  'STT', 'Ngày (YYYY-MM-DD)', 'Ca (sang/chieu/dem)',
  'Giờ bắt đầu (HH:mm)', 'Giờ kết thúc (HH:mm)',
  'Trạng thái (du_kien/dang_truc/hoan_thanh/vang)', 'Ghi chú',
];

const CONG_VIEC_NV_HEADERS = [
  'STT', 'Ngày (YYYY-MM-DD)', 'Giờ (HH:mm)', 'Tên công việc', 'Mô tả',
  'Mức ưu tiên (thap/trung_binh/cao)', 'ID bệnh nhân', 'Họ tên bệnh nhân', 'Ghi chú',
];

const CONG_VIEC_BN_HEADERS = [
  'STT', 'Ngày (YYYY-MM-DD)', 'Giờ (HH:mm)', 'Tên công việc', 'Mô tả',
  'Mức ưu tiên (thap/trung_binh/cao)', 'ID hồ sơ điều dưỡng', 'Họ tên điều dưỡng', 'Ghi chú',
];

export const PHAN_CA_NV_EDIT_FIELDS = [
  { key: 'ngay', label: 'Ngày', width: 'w-32' },
  { key: 'ca', label: 'Ca', width: 'w-24' },
  { key: 'gio_bat_dau', label: 'Giờ BD', width: 'w-24' },
  { key: 'gio_ket_thuc', label: 'Giờ KT', width: 'w-24' },
  { key: 'trang_thai', label: 'Trạng thái', width: 'w-28' },
];

export const CONG_VIEC_NV_EDIT_FIELDS = [
  { key: 'ngay', label: 'Ngày', width: 'w-32' },
  { key: 'gio', label: 'Giờ', width: 'w-20' },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 'w-40' },
  { key: 'mo_ta', label: 'Mô tả', width: 'w-36' },
  { key: 'muc_uu_tien', label: 'Ưu tiên', width: 'w-24' },
  { key: 'id_benh_nhan', label: 'ID BN', width: 'w-20' },
  { key: 'ho_ten_benh_nhan', label: 'Họ tên BN', width: 'w-32' },
];

export const CONG_VIEC_BN_EDIT_FIELDS = [
  { key: 'ngay', label: 'Ngày', width: 'w-32' },
  { key: 'gio', label: 'Giờ', width: 'w-20' },
  { key: 'ten_cong_viec', label: 'Tên công việc', width: 'w-40' },
  { key: 'mo_ta', label: 'Mô tả', width: 'w-36' },
  { key: 'muc_uu_tien', label: 'Ưu tiên', width: 'w-24' },
  { key: 'id_dieu_duong', label: 'ID ĐD', width: 'w-20' },
  { key: 'ho_ten_dieu_duong', label: 'Họ tên ĐD', width: 'w-32' },
];

export const buildPhanCaNvFileFromRows = (rows, fileName = 'import-phan-ca.xlsx') => {
  const bodyRows = rows.map((row, index) => [
    index + 1,
    row.ngay || '',
    row.ca || '',
    row.gio_bat_dau?.slice?.(0, 5) || row.gio_bat_dau || '',
    row.gio_ket_thuc?.slice?.(0, 5) || row.gio_ket_thuc || '',
    row.trang_thai || 'du_kien',
    row.ghi_chu || '',
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([PHAN_CA_NV_HEADERS, ...bodyRows]), 'Phan_ca');
  return workbookToFile(workbook, fileName);
};

export const buildCongViecNvFileFromRows = (rows, fileName = 'import-cong-viec.xlsx') => {
  const bodyRows = rows.map((row, index) => {
    const gio = row.gio?.slice?.(0, 5) || row.gio || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[1]?.slice(0, 5) : '');
    return [
      index + 1,
      row.ngay || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[0] : ''),
      gio,
      row.ten_cong_viec || '',
      row.mo_ta || '',
      row.muc_uu_tien || 'trung_binh',
      row.id_benh_nhan || '',
      row.ho_ten_benh_nhan || '',
      row.ghi_chu || '',
    ];
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([CONG_VIEC_NV_HEADERS, ...bodyRows]), 'Cong_viec');
  return workbookToFile(workbook, fileName);
};

export const buildCongViecBnFileFromRows = (rows, fileName = 'import-cong-viec.xlsx') => {
  const bodyRows = rows.map((row, index) => {
    const gio = row.gio?.slice?.(0, 5) || row.gio || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[1]?.slice(0, 5) : '');
    return [
      index + 1,
      row.ngay || (row.thoi_gian_du_kien ? String(row.thoi_gian_du_kien).split(' ')[0] : ''),
      gio,
      row.ten_cong_viec || '',
      row.mo_ta || '',
      row.muc_uu_tien || 'trung_binh',
      row.id_dieu_duong || '',
      row.ho_ten_dieu_duong || '',
      row.ghi_chu || '',
    ];
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([CONG_VIEC_BN_HEADERS, ...bodyRows]), 'Cong_viec');
  return workbookToFile(workbook, fileName);
};
