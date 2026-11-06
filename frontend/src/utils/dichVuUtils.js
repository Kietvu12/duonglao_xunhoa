import { slugifyVietnamese } from './slugify';

/** Lựa chọn dành cho khách chưa biết chọn gói nào */
export const UNSURE_SERVICE_LABEL = 'Tôi chưa biết gói nào phù hợp';

/** Danh mục ảo cho dịch vụ không gắn loại */
export const UNCATEGORIZED_ID = 'uncategorized';
export const UNCATEGORIZED_SLUG = 'dich-vu-khac';
export const UNCATEGORIZED_NAME = 'Dịch vụ khác';

const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

export const getCategoryName = (loai) => clean(loai?.ten) || UNCATEGORIZED_NAME;

/**
 * Tên hiển thị duy nhất cho một gói: "Tên loại – Tên gói".
 * Nhiều loại có gói trùng tên (vd. "Sử dụng phòng 2 giường"), nên luôn kèm tên loại.
 */
export const getServiceLabel = (dichVu, categoryName) => {
  const ten = clean(dichVu?.ten_dich_vu);
  const loai = clean(categoryName ?? dichVu?.ten_loai_dich_vu);
  if (!loai) return ten;
  if (!ten) return loai;
  if (ten.toLowerCase().includes(loai.toLowerCase())) return ten;
  return `${loai} – ${ten}`;
};

/* ---------- URL riêng cho từng loại / gói dịch vụ ---------- */

/** Tham số URL dạng `ten-khong-dau-123` */
const buildParam = (name, id) => `${slugifyVietnamese(name)}-${id}`;

/** Lấy id từ tham số `ten-khong-dau-123` (hoặc chỉ `123`) */
export const parseIdParam = (param) => {
  if (!param) return null;
  const m = decodeURIComponent(param).match(/(?:^|-)(\d+)$/);
  return m ? Number(m[1]) : null;
};

export const buildCategoryPath = (loai) => {
  if (!loai || loai.id === UNCATEGORIZED_ID) return `/dich-vu/${UNCATEGORIZED_SLUG}`;
  return `/dich-vu/${buildParam(getCategoryName(loai), loai.id)}`;
};

export const buildServicePath = (loai, dichVu) =>
  `${buildCategoryPath(loai)}/${buildParam(clean(dichVu?.ten_dich_vu) || 'goi-dich-vu', dichVu.id)}`;

/**
 * Gom dịch vụ theo loại, chỉ giữ loại có dịch vụ; dịch vụ không loại vào "Dịch vụ khác".
 */
export const groupServicesByCategory = (loaiDichVus = [], dichVus = []) => {
  const map = new Map();
  dichVus.forEach((dv) => {
    const key = dv.id_loai_dich_vu ?? UNCATEGORIZED_ID;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(dv);
  });

  const knownIds = new Set(loaiDichVus.map((loai) => loai.id));
  const categories = loaiDichVus
    .map((loai) => ({ ...loai, ten: getCategoryName(loai), dichVus: map.get(loai.id) || [] }))
    .filter((loai) => loai.dichVus.length > 0);

  // Dịch vụ không có loại, hoặc trỏ tới loại không còn tồn tại
  const orphans = [];
  map.forEach((list, key) => {
    if (key === UNCATEGORIZED_ID || !knownIds.has(key)) orphans.push(...list);
  });
  if (orphans.length > 0) {
    categories.push({
      id: UNCATEGORIZED_ID,
      ten: UNCATEGORIZED_NAME,
      mo_ta: 'Các dịch vụ chăm sóc và hỗ trợ khác tại trung tâm.',
      dichVus: orphans,
    });
  }
  return categories;
};

export const findCategoryByParam = (categories, param) => {
  if (!param) return null;
  if (param === UNCATEGORIZED_SLUG) {
    return categories.find((c) => c.id === UNCATEGORIZED_ID) || null;
  }
  const id = parseIdParam(param);
  return id == null ? null : categories.find((c) => c.id === id) || null;
};

/* ---------- Form đặt lịch ---------- */

/** Ngày mai theo giờ máy người dùng, dạng YYYY-MM-DD (không lệch múi giờ như toISOString) */
export const getTomorrowLocalDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Cột loai_dich_vu_quan_tam trong DB là varchar(255) */
export const MAX_SERVICE_INTEREST_LENGTH = 255;

export const joinServiceInterest = (labels = []) => {
  const joined = labels.filter(Boolean).join('; ');
  return joined.length > MAX_SERVICE_INTEREST_LENGTH
    ? `${joined.slice(0, MAX_SERVICE_INTEREST_LENGTH - 1)}…`
    : joined;
};
