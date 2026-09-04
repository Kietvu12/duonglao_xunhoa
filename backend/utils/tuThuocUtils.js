import { getTodayVN } from './dateUtils.js';

export const TRANG_THAI_TON = {
  HET_HAN: 'het_han',
  HET_HANG: 'het_hang',
  SAP_HET: 'sap_het',
  CON_HANG: 'con_hang'
};

export const TRANG_THAI_TIEU_HAO = {
  CHO_DUYET: 'cho_duyet',
  DA_DUYET: 'da_duyet',
  DA_SU_DUNG: 'da_su_dung',
  DA_HUY: 'da_huy'
};

/** Thứ tự ưu tiên hiển thị: hết hàng → hết hạn → sắp hết → còn hàng */
export const TRANG_THAI_SORT_ORDER = {
  het_hang: 1,
  het_han: 2,
  sap_het: 3,
  con_hang: 4
};

/**
 * Danh mục vật tư ngoài kho — 6 nhóm A–F theo nghiệp vụ
 */
export const DANH_MUC_VAT_TU_NGOAI_KHO = [
  {
    ma: 'A',
    ten_nhom: 'Thay băng',
    vat_tu: [
      'Băng cuộn',
      'Gạc vô khuẩn',
      'Băng keo y tế',
      'Găng tay y tế',
      'Dung dịch sát khuẩn'
    ]
  },
  {
    ma: 'B',
    ten_nhom: 'Theo dõi sức khỏe',
    vat_tu: [
      'Que thử đường huyết',
      'Kim lấy máu',
      'Ống nghiệm',
      'Máy đo huyết áp (dùng tạm)',
      'Nhiệt kế'
    ]
  },
  {
    ma: 'C',
    ten_nhom: 'Chăm sóc hô hấp',
    vat_tu: [
      'Khẩu trang y tế',
      'Dây oxy',
      'Mặt nạ oxy',
      'Bình oxy mini',
      'Máy xông khí dung'
    ]
  },
  {
    ma: 'D',
    ten_nhom: 'Ăn qua sonde',
    vat_tu: [
      'Sonde dạ dày',
      'Sonde mũi',
      'Dung dịch dinh dưỡng',
      'Bơm tiêm',
      'Túi truyền dinh dưỡng'
    ]
  },
  {
    ma: 'E',
    ten_nhom: 'Cấp cứu',
    vat_tu: [
      'Băng cầm máu',
      'Thuốc cấp cứu cá nhân',
      'Kim tiêm',
      'Ống tiêm',
      'Gạc cầm máu'
    ]
  },
  {
    ma: 'F',
    ten_nhom: 'Phòng ngừa loét tỳ đè',
    vat_tu: [
      'Đệm chống loét',
      'Kem chống loét',
      'Gối kê',
      'Miếng lót chống loét',
      'Dung dịch vệ sinh da'
    ]
  }
];

/**
 * Tính trạng thái tồn kho theo quy tắc nghiệp vụ (QT-09)
 * Ưu tiên: hết hạn > hết hàng > sắp hết > còn hàng
 */
export const computeTrangThaiTon = (soLuongTon, soLuongToiThieu, hanSuDung, today = getTodayVN()) => {
  const ton = Number(soLuongTon) || 0;
  const nguong = Number(soLuongToiThieu) || 0;

  if (hanSuDung) {
    const hanStr = typeof hanSuDung === 'string'
      ? hanSuDung.split('T')[0].split(' ')[0]
      : hanSuDung;
    if (hanStr < today) {
      return TRANG_THAI_TON.HET_HAN;
    }
  }

  if (ton <= 0) {
    return TRANG_THAI_TON.HET_HANG;
  }

  if (ton <= nguong) {
    return TRANG_THAI_TON.SAP_HET;
  }

  return TRANG_THAI_TON.CON_HANG;
};

/** Kiểm tra hạn sử dụng còn trong N ngày (mặc định 30) */
export const isSapHetHan = (hanSuDung, withinDays = 30, today = getTodayVN()) => {
  if (!hanSuDung) return false;

  const hanStr = typeof hanSuDung === 'string'
    ? hanSuDung.split('T')[0].split(' ')[0]
    : hanSuDung;

  if (hanStr < today) return false;

  const hanDate = new Date(hanStr);
  const todayDate = new Date(today);
  const diffMs = hanDate.getTime() - todayDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays <= withinDays;
};

/** Có thể bàn giao từ tủ thuốc hay không */
export const canSelectFromTuThuoc = (item) => {
  const trangThai = item.trang_thai || computeTrangThaiTon(
    item.so_luong_ton,
    item.so_luong_toi_thieu,
    item.han_su_dung
  );
  return trangThai !== TRANG_THAI_TON.HET_HAN && trangThai !== TRANG_THAI_TON.HET_HANG;
};

/** Trạng thái tiêu hao có đang trừ kho hay không */
export const isTrangThaiActiveStock = (trangThai) => {
  return trangThai !== TRANG_THAI_TIEU_HAO.DA_HUY;
};
