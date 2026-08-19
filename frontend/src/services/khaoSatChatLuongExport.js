import * as XLSX from 'xlsx';

const normalizeJson = (value, fallback) => {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const safeSheetName = (name, fallback) => {
  const fallbackName = fallback || 'Sheet';
  const cleaned = String(name || fallbackName)
    .replace(/[\\/?*\[\]:]/g, ' ')
    .trim();
  return cleaned.slice(0, 31) || fallbackName;
};

export const exportKhaoSatToExcel = (survey) => {
  const workbook = XLSX.utils.book_new();
  const chatLuong = normalizeJson(survey && survey.chat_luong, {});
  const media = normalizeJson(survey && survey.media, []);

  const metaSheet = XLSX.utils.json_to_sheet([
    {
      'Tên file': (survey && survey.ten_file) || '',
      'Ngày tạo': (survey && survey.ngay_tao) || '',
      'Số ảnh': Array.isArray(media) ? media.length : 0,
      'Ghi chú': 'Xuất từ hệ thống khảo sát chất lượng',
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, metaSheet, safeSheetName('Thông tin', 'Thông tin'));

  const chatLuongRows = Object.entries(chatLuong).map(([key, value]) => ({
    'Tiêu chí': key,
    'Giá trị': typeof value === 'object' ? JSON.stringify(value) : String(value == null ? '' : value),
  }));
  const chatLuongSheet = XLSX.utils.json_to_sheet(
    chatLuongRows.length > 0 ? chatLuongRows : [{ 'Tiêu chí': '', 'Giá trị': '' }]
  );
  XLSX.utils.book_append_sheet(workbook, chatLuongSheet, safeSheetName('Chất lượng', 'Chất lượng'));

  const mediaRows = Array.isArray(media)
    ? media.map((item, index) => ({
        STT: index + 1,
        'Tên ảnh': (item && (item.ten || item.ten_file || item.title)) || '',
        URL: (item && item.url) || '',
        'Mô tả': (item && item.mo_ta) || '',
      }))
    : [];

  const mediaSheet = XLSX.utils.json_to_sheet(
    mediaRows.length > 0 ? mediaRows : [{ STT: '', 'Tên ảnh': '', URL: '', 'Mô tả': '' }]
  );
  XLSX.utils.book_append_sheet(workbook, mediaSheet, safeSheetName('Media', 'Media'));

  return workbook;
};

export const downloadWorkbook = (workbook, fileName) => {
  const outputName = fileName && String(fileName).endsWith('.xlsx') ? fileName : `${fileName || 'khao-sat'}.xlsx`;
  XLSX.writeFile(workbook, outputName);
};
