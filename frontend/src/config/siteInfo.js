/**
 * Thông tin liên hệ chính thức của Trung tâm trường thọ Xuân Hoa.
 * MỌI nơi hiển thị hotline / email / địa chỉ / bản đồ / mạng xã hội trên site công khai
 * phải lấy từ file này để luôn đồng bộ (nội dung, footer, nút gọi, Zalo, trang Liên hệ...).
 */

export const SITE_NAME = 'Trung tâm trường thọ Xuân Hoa';

const HOTLINE_DIGITS = '0961799588';

export const CONTACT = {
  hotline: {
    display: '096 179 95 88',
    tel: `tel:${HOTLINE_DIGITS}`,
    digits: HOTLINE_DIGITS,
    /** Định dạng quốc tế cho dữ liệu cấu trúc (schema.org) */
    international: '+84961799588',
  },
  email: {
    display: 'Trungtamtruongthoxuanhoa@gmail.com',
    href: 'mailto:Trungtamtruongthoxuanhoa@gmail.com',
  },
  address: {
    /** Địa chỉ hiển thị cho người đọc */
    display: 'Biệt thự Đồi Thủy Sản, Hạ Long, Quảng Ninh',
    /** Chuỗi tìm kiếm trên Google Maps (giữ đúng như địa chỉ trên Google Maps) */
    mapsQuery: 'Biệt thự Đồi Thuỷ Sản, Ha Long, Vietnam',
    locality: 'Hạ Long',
    region: 'Quảng Ninh',
    country: 'VN',
  },
  workingHours: 'Tư vấn 24/7 qua hotline',
};

const encodedMapsQuery = encodeURIComponent(CONTACT.address.mapsQuery);

export const MAPS = {
  /** Mở chỉ đường trên Google Maps */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodedMapsQuery}`,
  /** Mở vị trí trên Google Maps */
  placeUrl: `https://www.google.com/maps/search/?api=1&query=${encodedMapsQuery}`,
  /** Nhúng bản đồ (không cần API key) */
  embedUrl: `https://maps.google.com/maps?q=${encodedMapsQuery}&hl=vi&z=16&output=embed`,
};

export const SOCIAL = {
  facebook: 'https://www.facebook.com/trungtamtruongthoxuanhoahalong',
  messenger: 'https://m.me/trungtamtruongthoxuanhoahalong',
  tiktok: 'https://www.tiktok.com/@duonglaoxuanhoa.official',
  zalo: `https://zalo.me/${HOTLINE_DIGITS}`,
};
