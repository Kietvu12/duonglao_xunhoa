/**
 * Helper dùng chung cho đơn thuốc (ThuocPage, BenhNhanDetailPage)
 */

// App điều dưỡng lưu thời điểm uống dạng không dấu (Sang, Trua, Chieu, Toi)
const THOI_DIEM_UONG_LABELS = {
  sang: 'Sáng',
  trua: 'Trưa',
  chieu: 'Chiều',
  toi: 'Tối',
};

export const formatThoiDiemUong = (value) => {
  if (!value) return '';
  return THOI_DIEM_UONG_LABELS[String(value).trim().toLowerCase()] || value;
};

// "YYYY-MM-DD HH:mm:ss" (từ API) -> "YYYY-MM-DDTHH:mm" (cho input datetime-local)
export const toDateTimeLocalValue = (value) => {
  if (!value) return '';
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/);
  return match ? `${match[1]}T${match[2]}` : '';
};

export const createEmptyThuoc = () => ({
  ten_thuoc: '',
  lieu_luong: '',
  thoi_diem_uong: '',
  thoi_gian_uong: '',
  ghi_chu: '',
});

// Chuyển thuốc từ API sang state của form (giữ lại thoi_gian_uong để không bị mất khi sửa)
export const thuocToFormItem = (thuoc) => ({
  ten_thuoc: thuoc.ten_thuoc || '',
  lieu_luong: thuoc.lieu_luong || '',
  thoi_diem_uong: thuoc.thoi_diem_uong || '',
  thoi_gian_uong: toDateTimeLocalValue(thuoc.thoi_gian_uong),
  ghi_chu: thuoc.ghi_chu || '',
});
