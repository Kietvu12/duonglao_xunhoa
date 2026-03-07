import pool from '../config/database.js';

/**
 * Đánh giá chỉ số dựa trên cấu hình cảnh báo
 * @param {string} tenChiSo - Tên chỉ số (ví dụ: 'SpO2', 'Nhịp tim', 'Huyết áp', 'Đường huyết', 'Nhiệt độ')
 * @param {number|object} giaTri - Giá trị chỉ số (hoặc object cho huyết áp {tam_thu, tam_truong})
 * @param {number|null} idCauHinh - ID cấu hình chỉ số (nếu null sẽ tìm theo tên)
 * @returns {Promise<{danh_gia_chi_tiet: string, muc_do: string, noi_dung_canh_bao: string, id_cau_hinh: number|null}>}
 */
export async function evaluateChiSo(tenChiSo, giaTri, idCauHinh = null) {
  try {
    // Tìm cấu hình chỉ số
    let cauHinh = null;
    
    if (idCauHinh) {
      const [configs] = await pool.execute(
        'SELECT * FROM cau_hinh_chi_so_canh_bao WHERE id = ?',
        [idCauHinh]
      );
      if (configs.length > 0) {
        cauHinh = configs[0];
      }
    } else {
      // Tìm theo tên chỉ số
      const [configs] = await pool.execute(
        'SELECT * FROM cau_hinh_chi_so_canh_bao WHERE ten_chi_so = ?',
        [tenChiSo]
      );
      if (configs.length > 0) {
        cauHinh = configs[0];
        idCauHinh = cauHinh.id;
      }
    }

    // Nếu không có cấu hình, trả về mặc định
    if (!cauHinh || !cauHinh.gioi_han_canh_bao) {
      return {
        danh_gia_chi_tiet: 'binh_thuong',
        muc_do: 'binh_thuong',
        noi_dung_canh_bao: null,
        id_cau_hinh: null
      };
    }

    // Parse JSON cấu hình
    let gioiHan;
    try {
      gioiHan = typeof cauHinh.gioi_han_canh_bao === 'string' 
        ? JSON.parse(cauHinh.gioi_han_canh_bao) 
        : cauHinh.gioi_han_canh_bao;
    } catch (e) {
      console.error('Error parsing gioi_han_canh_bao:', e);
      return {
        danh_gia_chi_tiet: 'binh_thuong',
        muc_do: 'binh_thuong',
        noi_dung_canh_bao: null,
        id_cau_hinh: idCauHinh
      };
    }

    // Đánh giá dựa trên loại chỉ số
    if (tenChiSo === 'Huyết áp' && typeof giaTri === 'object' && giaTri.tam_thu && giaTri.tam_truong) {
      return evaluateHuyetAp(giaTri.tam_thu, giaTri.tam_truong, gioiHan, idCauHinh);
    } else {
      // Chuyển đổi giá trị sang number nếu là string hoặc bất kỳ kiểu nào
      let numericValue = giaTri;
      
      // Nếu là string, chuyển sang number
      if (typeof giaTri === 'string') {
        numericValue = parseFloat(giaTri);
      }
      
      // Nếu là null hoặc undefined, không thể đánh giá
      if (giaTri === null || giaTri === undefined) {
        return {
          danh_gia_chi_tiet: 'binh_thuong',
          muc_do: 'binh_thuong',
          noi_dung_canh_bao: null,
          id_cau_hinh: idCauHinh
        };
      }
      
      // Kiểm tra nếu là number hợp lệ (sau khi convert)
      if (typeof numericValue === 'number' && !isNaN(numericValue) && isFinite(numericValue)) {
        return evaluateSingleValue(numericValue, gioiHan, idCauHinh);
      }
    }

    // Mặc định
    return {
      danh_gia_chi_tiet: 'binh_thuong',
      muc_do: 'binh_thuong',
      noi_dung_canh_bao: null,
      id_cau_hinh: idCauHinh
    };
  } catch (error) {
    console.error('Error evaluating chi so:', error);
    return {
      danh_gia_chi_tiet: 'binh_thuong',
      muc_do: 'binh_thuong',
      noi_dung_canh_bao: null,
      id_cau_hinh: null
    };
  }
}

/**
 * Đánh giá giá trị đơn (SpO2, Nhịp tim, Đường huyết, Nhiệt độ)
 * Logic: Kiểm tra theo thứ tự Thấp -> Bình thường -> Cao
 * Nếu không thuộc bất kỳ mốc nào → Nguy hiểm
 */
function evaluateSingleValue(giaTri, gioiHan, idCauHinh) {
  // Đảm bảo giá trị là number
  const numericValue = typeof giaTri === 'number' ? giaTri : parseFloat(giaTri);
  
  // Kiểm tra nếu giá trị không hợp lệ
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    return {
      danh_gia_chi_tiet: 'binh_thuong',
      muc_do: 'binh_thuong',
      noi_dung_canh_bao: null,
      id_cau_hinh: idCauHinh
    };
  }
  
  // Kiểm tra theo thứ tự: Thấp -> Bình thường -> Cao -> Nguy hiểm
  
  // Thấp: giá trị trong khoảng [min, max]
  if (gioiHan.thap && gioiHan.thap.min !== undefined && gioiHan.thap.max !== undefined) {
    if (numericValue >= gioiHan.thap.min && numericValue <= gioiHan.thap.max) {
      return {
        danh_gia_chi_tiet: 'thap',
        muc_do: 'canh_bao',
        noi_dung_canh_bao: gioiHan.thap.message || 'Giá trị thấp, cần theo dõi.',
        id_cau_hinh: idCauHinh
      };
    }
  }

  // Bình thường: giá trị trong khoảng [min, max]
  if (gioiHan.binh_thuong && gioiHan.binh_thuong.min !== undefined && gioiHan.binh_thuong.max !== undefined) {
    if (numericValue >= gioiHan.binh_thuong.min && numericValue <= gioiHan.binh_thuong.max) {
      return {
        danh_gia_chi_tiet: 'binh_thuong',
        muc_do: 'binh_thuong',
        noi_dung_canh_bao: gioiHan.binh_thuong.message || null,
        id_cau_hinh: idCauHinh
      };
    }
  }

  // Cao: giá trị trong khoảng [min, max]
  if (gioiHan.cao && gioiHan.cao.min !== undefined && gioiHan.cao.max !== undefined) {
    if (numericValue >= gioiHan.cao.min && numericValue <= gioiHan.cao.max) {
      return {
        danh_gia_chi_tiet: 'cao',
        muc_do: 'canh_bao',
        noi_dung_canh_bao: gioiHan.cao.message || 'Giá trị cao, cần theo dõi.',
        id_cau_hinh: idCauHinh
      };
    }
  }

  // Nguy hiểm: Nếu giá trị không thuộc bất kỳ mốc nào (Thấp, Bình thường, Cao) → Nguy hiểm
  // Đây là trường hợp giá trị ngoài tất cả các khoảng đã định nghĩa
  let nguyHiemMessage = 'Giá trị nguy hiểm! Cần can thiệp ngay.';
  if (gioiHan.nguy_hiem && gioiHan.nguy_hiem.message) {
    nguyHiemMessage = gioiHan.nguy_hiem.message;
  }
  
  return {
    danh_gia_chi_tiet: 'nguy_hiem',
    muc_do: 'nguy_hiem',
    noi_dung_canh_bao: nguyHiemMessage,
    id_cau_hinh: idCauHinh
  };
}

/**
 * Đánh giá huyết áp (có 2 giá trị: tâm thu và tâm trương)
 * Logic: Xác định khoảng của từng giá trị, sau đó xử lý các trường hợp:
 * - Cùng khoảng → trả về khoảng đó
 * - Khác khoảng → ưu tiên mức độ nghiêm trọng hơn (Nguy hiểm > Cao/Thấp > Bình thường)
 */
function evaluateHuyetAp(tamThu, tamTruong, gioiHan, idCauHinh) {
  // Xác định khoảng của tâm thu và tâm trương
  const khoangTamThu = xacDinhKhoangHuyetAp(tamThu, gioiHan, 'tam_thu');
  const khoangTamTruong = xacDinhKhoangHuyetAp(tamTruong, gioiHan, 'tam_truong');
  
  // Nếu cả hai cùng khoảng → trả về khoảng đó
  if (khoangTamThu === khoangTamTruong) {
    return taoKetQuaHuyetAp(khoangTamThu, gioiHan, idCauHinh);
  }
  
  // Xử lý trường hợp khác khoảng: ưu tiên mức độ nghiêm trọng hơn
  // Thứ tự ưu tiên: nguy_hiem > cao > thap > binh_thuong
  const mucDoUuTien = {
    'nguy_hiem': 4,
    'cao': 3,
    'thap': 2,
    'binh_thuong': 1
  };
  
  const mucDoTamThu = mucDoUuTien[khoangTamThu] || 0;
  const mucDoTamTruong = mucDoUuTien[khoangTamTruong] || 0;
  
  // Chọn mức độ nghiêm trọng hơn
  const khoangKetQua = mucDoTamThu > mucDoTamTruong ? khoangTamThu : khoangTamTruong;
  
  // Tạo thông báo chi tiết khi khác khoảng
  let thongBao = taoKetQuaHuyetAp(khoangKetQua, gioiHan, idCauHinh);
  
  // Thêm thông tin chi tiết nếu cần
  if (khoangTamThu !== khoangTamTruong && khoangKetQua !== 'binh_thuong') {
    const chiTiet = `Tâm thu: ${khoangTamThu === 'binh_thuong' ? 'bình thường' : khoangTamThu}, ` +
                     `Tâm trương: ${khoangTamTruong === 'binh_thuong' ? 'bình thường' : khoangTamTruong}. ` +
                     `Cần theo dõi chặt chẽ.`;
    
    if (thongBao.noi_dung_canh_bao) {
      thongBao.noi_dung_canh_bao += ' ' + chiTiet;
    } else {
      thongBao.noi_dung_canh_bao = chiTiet;
    }
  }
  
  return thongBao;
}

/**
 * Xác định khoảng của một giá trị huyết áp (tâm thu hoặc tâm trương)
 * @param {number} giaTri - Giá trị tâm thu hoặc tâm trương
 * @param {object} gioiHan - Cấu hình giới hạn
 * @param {string} loai - 'tam_thu' hoặc 'tam_truong'
 * @returns {string} - 'thap', 'binh_thuong', 'cao', hoặc 'nguy_hiem'
 */
function xacDinhKhoangHuyetAp(giaTri, gioiHan, loai) {
  const minKey = loai === 'tam_thu' ? 'tam_thu_min' : 'tam_truong_min';
  const maxKey = loai === 'tam_thu' ? 'tam_thu_max' : 'tam_truong_max';
  
  // Kiểm tra Thấp
  if (gioiHan.thap && 
      gioiHan.thap[minKey] !== undefined && gioiHan.thap[maxKey] !== undefined) {
    if (giaTri >= gioiHan.thap[minKey] && giaTri <= gioiHan.thap[maxKey]) {
      return 'thap';
    }
  }
  
  // Kiểm tra Bình thường
  if (gioiHan.binh_thuong && 
      gioiHan.binh_thuong[minKey] !== undefined && gioiHan.binh_thuong[maxKey] !== undefined) {
    if (giaTri >= gioiHan.binh_thuong[minKey] && giaTri <= gioiHan.binh_thuong[maxKey]) {
      return 'binh_thuong';
    }
  }
  
  // Kiểm tra Cao
  if (gioiHan.cao && 
      gioiHan.cao[minKey] !== undefined && gioiHan.cao[maxKey] !== undefined) {
    if (giaTri >= gioiHan.cao[minKey] && giaTri <= gioiHan.cao[maxKey]) {
      return 'cao';
    }
  }
  
  // Nếu không thuộc bất kỳ khoảng nào → Nguy hiểm
  return 'nguy_hiem';
}

/**
 * Tạo kết quả đánh giá huyết áp dựa trên khoảng
 * @param {string} khoang - 'thap', 'binh_thuong', 'cao', hoặc 'nguy_hiem'
 * @param {object} gioiHan - Cấu hình giới hạn
 * @param {number|null} idCauHinh - ID cấu hình
 * @returns {object} - Kết quả đánh giá
 */
function taoKetQuaHuyetAp(khoang, gioiHan, idCauHinh) {
  switch (khoang) {
    case 'thap':
      return {
        danh_gia_chi_tiet: 'thap',
        muc_do: 'canh_bao',
        noi_dung_canh_bao: gioiHan.thap?.message || 'Huyết áp thấp, cần theo dõi.',
        id_cau_hinh: idCauHinh
      };
    
    case 'binh_thuong':
      return {
        danh_gia_chi_tiet: 'binh_thuong',
        muc_do: 'binh_thuong',
        noi_dung_canh_bao: gioiHan.binh_thuong?.message || null,
        id_cau_hinh: idCauHinh
      };
    
    case 'cao':
      return {
        danh_gia_chi_tiet: 'cao',
        muc_do: 'canh_bao',
        noi_dung_canh_bao: gioiHan.cao?.message || 'Huyết áp cao, cần theo dõi.',
        id_cau_hinh: idCauHinh
      };
    
    case 'nguy_hiem':
    default:
      const nguyHiemMessage = gioiHan.nguy_hiem?.message || 'Huyết áp nguy hiểm! Cần can thiệp ngay.';
      return {
        danh_gia_chi_tiet: 'nguy_hiem',
        muc_do: 'nguy_hiem',
        noi_dung_canh_bao: nguyHiemMessage,
        id_cau_hinh: idCauHinh
      };
  }
}

