/** Slug thân thiện URL, cùng logic với backend `slugifyText` */

export function slugifyVietnamese(value = '') {
  const normalized = String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return normalized || 'bai-viet';
}

/**
 * URL chi tiết bài viết: ưu tiên slug từ DB (trùng backend).
 * Không được tự slugify tiêu đề khi thiếu slug — server có thể đã thêm hậu tố (-1, -2)
 * nên slug client sẽ lệch → API 404 → bị đá về danh sách.
 */
export function buildBaiVietPath(post) {
  const s = post?.slug && String(post.slug).trim();
  if (s) {
    return `/blog/bai-viet/${encodeURIComponent(s)}`;
  }
  if (post?.id != null && post.id !== '') {
    return `/blog/bai-viet/${post.id}`;
  }
  const fallback = slugifyVietnamese(post?.tieu_de || post?.title || 'bai-viet');
  return `/blog/bai-viet/${encodeURIComponent(fallback)}`;
}

export function buildTuyenDungPath(item) {
  const base = slugifyVietnamese(item?.tieu_de || 'tuyen-dung');
  return `/blog/tuyen-dung/${encodeURIComponent(`${base}-${item.id}`)}`;
}

/** Giải mã tham số URL tin tuyển dụng dạng `tieu-de-123` hoặc chỉ `123` */
export function parseTuyenDungParam(param) {
  if (param == null || param === '') return null;
  const decoded = decodeURIComponent(param);
  const m = decoded.match(/-(\d+)$/);
  if (m) return parseInt(m[1], 10);
  if (/^\d+$/.test(decoded)) return parseInt(decoded, 10);
  return null;
}
