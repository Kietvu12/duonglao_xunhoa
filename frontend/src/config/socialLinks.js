// Kênh mạng xã hội chính thức của Trung tâm trường thọ Xuân Hoa.
// Chỉ khai báo kênh đã có thật: kênh nào không có URL hợp lệ sẽ không được hiển thị ở UI,
// tránh trường hợp icon bấm vào không tới đâu (href="#").
export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    title: 'Facebook chính thức của Trung tâm trường thọ Xuân Hoa',
    href: 'https://www.facebook.com/duonglaoxuanhoa',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    title: 'Kênh YouTube chính thức của Trung tâm trường thọ Xuân Hoa',
    href: 'https://www.youtube.com/@duonglaoxuanhoa',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    title: 'Kênh TikTok chính thức của Trung tâm trường thọ Xuân Hoa',
    href: 'https://www.tiktok.com/@duonglaoxuanhoa',
  },
];

// Lọc bỏ kênh chưa có URL thật (để trống hoặc vẫn là "#") trước khi render icon.
export const getActiveSocialLinks = () =>
  SOCIAL_LINKS.filter(
    (item) => typeof item.href === 'string' && /^https?:\/\/.+/i.test(item.href)
  );

export default SOCIAL_LINKS;
