 const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://duonglaoxuanhoa.net/api_quanlyduonglao/api';
// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4545/api';

// Helper function to get auth token
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers,
  };

  // Don't set Content-Type for FormData, let browser set it with boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log('=== apiCall START ===');
    console.log('apiCall - Endpoint:', endpoint);
    console.log('apiCall - Full URL:', `${API_BASE_URL}${endpoint}`);
    console.log('apiCall - Options:', options);
    console.log('apiCall - Headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('apiCall - Response status:', response.status);
    console.log('apiCall - Response ok:', response.ok);
    console.log('apiCall - Response URL:', response.url);

    const data = await response.json();
    console.log('apiCall - Response data:', data);
    console.log('=== apiCall END ===');

    if (!response.ok) {
      console.error('apiCall - Response not ok:', data);
      throw new Error(data.message || 'Có lỗi xảy ra');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    console.error('API Error details:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Auth APIs
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  getProfile: () => apiCall('/auth/profile'),
  updateProfile: (data) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  changePassword: (data) => apiCall('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Bệnh nhân APIs
export const benhNhanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan?${queryString}`);
  },
  getById: (id) => apiCall(`/benh-nhan/${id}`),
  create: (data, file) => {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      return apiCall('/benh-nhan', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });
    }
    return apiCall('/benh-nhan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update: (id, data, file) => {
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      return apiCall(`/benh-nhan/${id}`, {
        method: 'PUT',
        body: formData,
        isFormData: true,
      });
    }
    return apiCall(`/benh-nhan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete: (id) => apiCall(`/benh-nhan/${id}`, {
    method: 'DELETE',
  }),
  // Huyet ap
  getHuyetAp: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/huyet-ap?${queryString}`);
  },
  createHuyetAp: (id, data) => apiCall(`/benh-nhan/${id}/huyet-ap`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHuyetAp: (id, huyetApId, data) => apiCall(`/benh-nhan/${id}/huyet-ap/${huyetApId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHuyetAp: (id, huyetApId) => apiCall(`/benh-nhan/${id}/huyet-ap/${huyetApId}`, {
    method: 'DELETE',
  }),
  // Nhip tim
  getNhipTim: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/nhip-tim?${queryString}`);
  },
  createNhipTim: (id, data) => apiCall(`/benh-nhan/${id}/nhip-tim`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateNhipTim: (id, nhipTimId, data) => apiCall(`/benh-nhan/${id}/nhip-tim/${nhipTimId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteNhipTim: (id, nhipTimId) => apiCall(`/benh-nhan/${id}/nhip-tim/${nhipTimId}`, {
    method: 'DELETE',
  }),
  // Duong huyet
  getDuongHuyet: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/duong-huyet?${queryString}`);
  },
  createDuongHuyet: (id, data) => apiCall(`/benh-nhan/${id}/duong-huyet`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDuongHuyet: (id, duongHuyetId, data) => apiCall(`/benh-nhan/${id}/duong-huyet/${duongHuyetId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDuongHuyet: (id, duongHuyetId) => apiCall(`/benh-nhan/${id}/duong-huyet/${duongHuyetId}`, {
    method: 'DELETE',
  }),
  // SpO2
  getSpo2: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/spo2?${queryString}`);
  },
  createSpo2: (id, data) => apiCall(`/benh-nhan/${id}/spo2`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSpo2: (id, spo2Id, data) => apiCall(`/benh-nhan/${id}/spo2/${spo2Id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteSpo2: (id, spo2Id) => apiCall(`/benh-nhan/${id}/spo2/${spo2Id}`, {
    method: 'DELETE',
  }),
  // Nhiet do
  getNhietDo: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/nhiet-do?${queryString}`);
  },
  createNhietDo: (id, data) => apiCall(`/benh-nhan/${id}/nhiet-do`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateNhietDo: (id, nhietDoId, data) => apiCall(`/benh-nhan/${id}/nhiet-do/${nhietDoId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteNhietDo: (id, nhietDoId) => apiCall(`/benh-nhan/${id}/nhiet-do/${nhietDoId}`, {
    method: 'DELETE',
  }),
  // Hoạt động sinh hoạt
  getHoatDongSinhHoat: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat?${queryString}`);
  },
  createHoatDongSinhHoat: (id, data) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHoatDongSinhHoat: (id, hoatDongId, data) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat/${hoatDongId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHoatDongSinhHoat: (id, hoatDongId) => apiCall(`/benh-nhan/${id}/hoat-dong-sinh-hoat/${hoatDongId}`, {
    method: 'DELETE',
  }),
  // Tâm lý giao tiếp
  getTamLyGiaoTiep: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/tam-ly-giao-tiep?${queryString}`);
  },
  createTamLyGiaoTiep: (id, data) => apiCall(`/benh-nhan/${id}/tam-ly-giao-tiep`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTamLyGiaoTiep: (tamLyId, data) => apiCall(`/benh-nhan/tam-ly-giao-tiep/${tamLyId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTamLyGiaoTiep: (tamLyId) => apiCall(`/benh-nhan/tam-ly-giao-tiep/${tamLyId}`, {
    method: 'DELETE',
  }),
  // Vận động phục hồi
  getVanDongPhucHoi: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/van-dong-phuc-hoi?${queryString}`);
  },
  createVanDongPhucHoi: (id, data) => apiCall(`/benh-nhan/${id}/van-dong-phuc-hoi`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateVanDongPhucHoi: (vanDongId, data) => apiCall(`/benh-nhan/van-dong-phuc-hoi/${vanDongId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteVanDongPhucHoi: (vanDongId) => apiCall(`/benh-nhan/van-dong-phuc-hoi/${vanDongId}`, {
    method: 'DELETE',
  }),
  // Bệnh hiện tại
  getBenhHienTai: (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan/${id}/benh-hien-tai?${queryString}`);
  },
  createBenhHienTai: (id, data) => apiCall(`/benh-nhan/${id}/benh-hien-tai`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateBenhHienTai: (benhId, data) => apiCall(`/benh-nhan/benh-hien-tai/${benhId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteBenhHienTai: (benhId) => apiCall(`/benh-nhan/benh-hien-tai/${benhId}`, {
    method: 'DELETE',
  }),
  // Hồ sơ y tế
  getHoSoYTe: (id) => apiCall(`/benh-nhan/${id}/ho-so-y-te`),
  createOrUpdateHoSoYTe: (id, data) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateHoSoYTe: (id, data) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteHoSoYTe: (id) => apiCall(`/benh-nhan/${id}/ho-so-y-te`, {
    method: 'DELETE',
  }),
  // Quản lý bệnh nhân cho điều dưỡng
  // Trả về tất cả danh sách bệnh nhân mà điều dưỡng quản lý (không phân trang)
  // params: { trang_thai?: string, search?: string }
  // - trang_thai: 'dang_quan_ly' | 'ket_thuc' (optional)
  // - search: Tìm kiếm theo tên hoặc CCCD (optional)
  getBenhNhanByDieuDuong: (idDieuDuong, params = {}) => {
    // Chỉ lấy các params hợp lệ (trang_thai và search)
    const validParams = {};
    if (params.trang_thai) {
      validParams.trang_thai = params.trang_thai;
    }
    if (params.search) {
      validParams.search = params.search;
    }
    
    const queryString = new URLSearchParams(validParams).toString();
    const endpoint = `/benh-nhan/dieu-duong/${idDieuDuong}${queryString ? `?${queryString}` : ''}`;
    return apiCall(endpoint);
  },
  assignBenhNhanToDieuDuong: (data) => apiCall('/benh-nhan/dieu-duong/assign', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  removeBenhNhanFromDieuDuong: (idQuanLy, data = {}) => apiCall(`/benh-nhan/dieu-duong/remove/${idQuanLy}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  // QR Code
  getQRCode: (id) => apiCall(`/benh-nhan/${id}/qr-code`),
  createQRCode: (id) => apiCall(`/benh-nhan/${id}/qr-code`, {
    method: 'POST',
  }),
  regenerateQRCode: (id) => apiCall(`/benh-nhan/${id}/qr-code/regenerate`, {
    method: 'POST',
  }),
  // Media
  getMedia: (id) => apiCall(`/benh-nhan/${id}/media`),
  addMedia: (id, formData) => apiCall(`/benh-nhan/${id}/media`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),
  deleteMedia: (id, mediaId) => apiCall(`/benh-nhan/${id}/media/${mediaId}`, {
    method: 'DELETE',
  }),
};

// Nhân viên APIs
export const nhanVienAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nhan-vien?${queryString}`);
  },
  getById: (id) => apiCall(`/nhan-vien/${id}`),
  create: (data) => apiCall('/nhan-vien', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/nhan-vien/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getLichPhanCa: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nhan-vien/lich-phan-ca/all?${queryString}`);
  },
  createLichPhanCa: (data) => apiCall('/nhan-vien/lich-phan-ca', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateLichPhanCa: (id, data) => apiCall(`/nhan-vien/lich-phan-ca/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteLichPhanCa: (id) => apiCall(`/nhan-vien/lich-phan-ca/${id}`, {
    method: 'DELETE',
  }),
  chuyenCa: (id, data) => apiCall(`/nhan-vien/lich-phan-ca/${id}/chuyen-ca`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  createKPI: (data) => apiCall('/nhan-vien/kpi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  // Media hồ sơ nhân viên
  getMediaHoSo: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nhan-vien/media-ho-so?${queryString}`);
  },
  getMediaHoSoById: (id) => apiCall(`/nhan-vien/media-ho-so/${id}`),
  uploadMediaHoSo: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiCall('/nhan-vien/media-ho-so/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type with boundary
    });
  },
  createMediaHoSo: (data) => apiCall('/nhan-vien/media-ho-so', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMediaHoSo: (id, data) => apiCall(`/nhan-vien/media-ho-so/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMediaHoSo: (id) => apiCall(`/nhan-vien/media-ho-so/${id}`, {
    method: 'DELETE',
  }),
};

// Lịch khám APIs
export const lichKhamAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/lich-kham?${queryString}`);
  },
  getById: (id) => apiCall(`/lich-kham/${id}`),
  create: (data) => apiCall('/lich-kham', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/lich-kham/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/lich-kham/${id}`, {
    method: 'DELETE',
  }),
  getAllLichHenTuVan: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/lich-kham/tu-van/all?${queryString}`);
  },
  updateLichHenTuVan: (id, data) => apiCall(`/lich-kham/tu-van/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Lịch hẹn tư vấn APIs (Public - không cần auth)
export const lichHenTuVanAPI = {
  create: (data) => {
    // Public endpoint - không gửi token
    const headers = {
      'Content-Type': 'application/json',
    };
    
    return fetch(`${API_BASE_URL}/lich-kham/tu-van`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
      return data;
    });
  },
};

// Lịch thăm bệnh APIs
export const lichThamBenhAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/lich-tham-benh?${queryString}`);
  },
  getById: (id) => apiCall(`/lich-tham-benh/${id}`),
  create: (data) => apiCall('/lich-tham-benh', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/lich-tham-benh/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/lich-tham-benh/${id}`, {
    method: 'DELETE',
  }),
};

// Dịch vụ APIs
// Bệnh nhân - Dịch vụ APIs
export const benhNhanDichVuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/benh-nhan-dich-vu?${queryString}`);
  },
  getById: (id) => apiCall(`/benh-nhan-dich-vu/${id}`),
  create: (data) => apiCall('/benh-nhan-dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/benh-nhan-dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/benh-nhan-dich-vu/${id}`, {
    method: 'DELETE',
  }),
  thanhToan: (id, data) => apiCall(`/benh-nhan-dich-vu/${id}/thanh-toan`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Loại dịch vụ APIs
export const loaiDichVuAPI = {
  getAll: () => apiCall('/loai-dich-vu'),
  getById: (id) => apiCall(`/loai-dich-vu/${id}`),
  create: (data) => apiCall('/loai-dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/loai-dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/loai-dich-vu/${id}`, {
    method: 'DELETE',
  }),
};

export const dichVuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dich-vu?${queryString}`);
  },
  getById: (id) => apiCall(`/dich-vu/${id}`),
  create: (data) => apiCall('/dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/dich-vu/${id}`, {
    method: 'DELETE',
  }),
};

// Bài viết dịch vụ APIs
export const baiVietDichVuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet-dich-vu?${queryString}`);
  },
  getById: (id) => apiCall(`/bai-viet-dich-vu/${id}`),
  create: (data) => apiCall('/bai-viet-dich-vu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/bai-viet-dich-vu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/bai-viet-dich-vu/${id}`, {
    method: 'DELETE',
  }),
  // Media
  addMedia: (data) => apiCall('/bai-viet-dich-vu/media', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteMedia: (id) => apiCall(`/bai-viet-dich-vu/media/${id}`, {
    method: 'DELETE',
  }),
  // Comments
  getBinhLuan: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet-dich-vu/binh-luan/all?${queryString}`);
  },
  createBinhLuan: (data) => apiCall('/bai-viet-dich-vu/binh-luan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  duyetBinhLuan: (id, duyet) => apiCall(`/bai-viet-dich-vu/binh-luan/${id}/duyet`, {
    method: 'PUT',
    body: JSON.stringify({ duyet }),
  }),
  deleteBinhLuan: (id) => apiCall(`/bai-viet-dich-vu/binh-luan/${id}`, {
    method: 'DELETE',
  }),
};

// Sự kiện APIs
export const suKienAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/su-kien?${queryString}`);
  },
  getById: (id) => apiCall(`/su-kien/${id}`),
  create: (data) => apiCall('/su-kien', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/su-kien/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/su-kien/${id}`, {
    method: 'DELETE',
  }),
  // Người tham gia
  getNguoiThamGia: (id) => apiCall(`/su-kien/${id}/nguoi-tham-gia`),
  addNguoiThamGia: (id, data) => apiCall(`/su-kien/${id}/nguoi-tham-gia`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  removeNguoiThamGia: (id, participantId) => apiCall(`/su-kien/${id}/nguoi-tham-gia/${participantId}`, {
    method: 'DELETE',
  }),
  xacNhanThamGia: (id, participantId, xacNhan) => apiCall(`/su-kien/${id}/nguoi-tham-gia/${participantId}/xac-nhan`, {
    method: 'PUT',
    body: JSON.stringify({ xac_nhan: xacNhan }),
  }),
  // Phân công
  getPhanCong: (id) => apiCall(`/su-kien/${id}/phan-cong`),
  phanCongNhanVien: (id, data) => apiCall(`/su-kien/${id}/phan-cong`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updatePhanCong: (id, assignmentId, data) => apiCall(`/su-kien/${id}/phan-cong/${assignmentId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  removePhanCong: (id, assignmentId) => apiCall(`/su-kien/${id}/phan-cong/${assignmentId}`, {
    method: 'DELETE',
  }),
};

// Bài viết APIs
export const baiVietAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet?${queryString}`);
  },
  getById: (id) => apiCall(`/bai-viet/${id}`),
  create: (data) => apiCall('/bai-viet', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/bai-viet/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/bai-viet/${id}`, {
    method: 'DELETE',
  }),
  // Media APIs
  getMedia: (id) => apiCall(`/bai-viet/${id}/media`),
  addMedia: (id, data) => apiCall(`/bai-viet/${id}/media`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateMedia: (id, mediaId, data) => apiCall(`/bai-viet/${id}/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteMedia: (id, mediaId) => apiCall(`/bai-viet/${id}/media/${mediaId}`, {
    method: 'DELETE',
  }),
};

// Tài khoản APIs (chỉ super_admin)
export const taiKhoanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tai-khoan?${queryString}`);
  },
  getById: (id) => apiCall(`/tai-khoan/${id}`),
  create: (data) => apiCall('/tai-khoan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/tai-khoan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  resetPassword: (id, mat_khau_moi) => apiCall(`/tai-khoan/${id}/reset-password`, {
    method: 'PUT',
    body: JSON.stringify({ mat_khau_moi }),
  }),
  viewPassword: (id) => apiCall(`/tai-khoan/${id}/view-password`),
  delete: (id) => apiCall(`/tai-khoan/${id}`, {
    method: 'DELETE',
  }),
};

// Upload APIs
export const uploadAPI = {
  uploadMedia: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi upload file');
    }

    return data;
  },
  uploadMultipleMedia: async (files) => {
    const token = getToken();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/media/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi upload files');
    }

    return data;
  },
};

// Tuyển dụng APIs
export const tuyenDungAPI = {
  getAllTinTuyenDung: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tuyen-dung/tin-tuyen-dung?${queryString}`);
  },
  getTinTuyenDungById: (id) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`),
  createTinTuyenDung: (data) => apiCall('/tuyen-dung/tin-tuyen-dung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTinTuyenDung: (id, data) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteTinTuyenDung: (id) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}`, {
    method: 'DELETE',
  }),
  getAllHoSoUngTuyen: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/tuyen-dung/ho-so-ung-tuyen?${queryString}`);
  },
  createHoSoUngTuyen: (formData) => apiCall('/tuyen-dung/ho-so-ung-tuyen', {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),
  updateHoSoUngTuyen: (id, data) => apiCall(`/tuyen-dung/ho-so-ung-tuyen/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getMediaTinTuyenDung: (id) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}/media`),
  addMediaTinTuyenDung: (id, formData) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}/media`, {
    method: 'POST',
    body: formData,
    isFormData: true,
  }),
  deleteMediaTinTuyenDung: (id, mediaId) => apiCall(`/tuyen-dung/tin-tuyen-dung/${id}/media/${mediaId}`, {
    method: 'DELETE',
  }),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => apiCall('/dashboard'),
  getBaoCao: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/dashboard/bao-cao?${queryString}`);
  },
};

// Thuốc APIs
export const thuocAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/thuoc?${queryString}`);
  },
  create: (data) => apiCall('/thuoc', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/thuoc/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/thuoc/${id}`, {
    method: 'DELETE',
  }),
};

// Phòng APIs (phong_o_benh_nhan - phân phòng cho bệnh nhân)
export const phongAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phong?${queryString}`);
  },
  getByBenhNhan: (id) => apiCall(`/phong/benh-nhan/${id}`),
  create: (data) => apiCall('/phong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phong/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phong/${id}`, {
    method: 'DELETE',
  }),
  deleteByBenhNhan: (idBenhNhan) => apiCall(`/phong/benh-nhan/${idBenhNhan}`, {
    method: 'DELETE',
  }),
};

// Phân khu APIs
export const phanKhuAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phan-khu?${queryString}`);
  },
  getById: (id) => apiCall(`/phan-khu/${id}`),
  create: (data) => apiCall('/phan-khu', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phan-khu/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phan-khu/${id}`, {
    method: 'DELETE',
  }),
};

// Phòng mới APIs (quản lý phòng với 3 ảnh)
export const phongNewAPI = {
  getAll: (params = {}, usePublic = false) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = usePublic ? `/phong-moi/public?${queryString}` : `/phong-moi?${queryString}`;
    console.log('phongNewAPI.getAll - params:', params);
    console.log('phongNewAPI.getAll - usePublic:', usePublic);
    console.log('phongNewAPI.getAll - endpoint:', endpoint);
    console.log('phongNewAPI.getAll - full URL:', `${API_BASE_URL}${endpoint}`);
    return apiCall(endpoint);
  },
  getById: (id) => apiCall(`/phong-moi/${id}`),
  create: (data) => apiCall('/phong-moi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phong-moi/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phong-moi/${id}`, {
    method: 'DELETE',
  }),
};

// Loại phòng API
export const loaiPhongAPI = {
  getAll: () => apiCall('/loai-phong'),
  getById: (id) => apiCall(`/loai-phong/${id}`),
  create: (data) => apiCall('/loai-phong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/loai-phong/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/loai-phong/${id}`, {
    method: 'DELETE',
  }),
};

// Bài viết phòng API
export const baiVietPhongAPI = {
  getAll: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet-phong${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => apiCall(`/bai-viet-phong/${id}`),
  create: (data) => apiCall('/bai-viet-phong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/bai-viet-phong/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/bai-viet-phong/${id}`, {
    method: 'DELETE',
  }),
  addMedia: (data) => apiCall('/bai-viet-phong/media', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteMedia: (id) => apiCall(`/bai-viet-phong/media/${id}`, {
    method: 'DELETE',
  }),
  getBinhLuan: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/bai-viet-phong/binh-luan/all${queryString ? `?${queryString}` : ''}`);
  },
  createBinhLuan: (data) => apiCall('/bai-viet-phong/binh-luan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  duyetBinhLuan: (id, duyet) => apiCall(`/bai-viet-phong/binh-luan/${id}/duyet`, {
    method: 'PUT',
    body: JSON.stringify({ duyet }),
  }),
  deleteBinhLuan: (id) => apiCall(`/bai-viet-phong/binh-luan/${id}`, {
    method: 'DELETE',
  }),
};

// Người thân APIs
export const nguoiThanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/nguoi-than?${queryString}`);
  },
  getById: (id) => apiCall(`/nguoi-than/${id}`),
  create: (data) => apiCall('/nguoi-than', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/nguoi-than/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/nguoi-than/${id}`, {
    method: 'DELETE',
  }),
};

// Vật dụng APIs
export const doDungAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/do-dung?${queryString}`);
  },
  getById: (id) => apiCall(`/do-dung/${id}`),
  create: (data) => apiCall('/do-dung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/do-dung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/do-dung/${id}`, {
    method: 'DELETE',
  }),
};

// Phân loại vật dụng APIs
export const phanLoaiDoDungAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/phan-loai-do-dung?${queryString}`);
  },
  getById: (id) => apiCall(`/phan-loai-do-dung/${id}`),
  create: (data) => apiCall('/phan-loai-do-dung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/phan-loai-do-dung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/phan-loai-do-dung/${id}`, {
    method: 'DELETE',
  }),
};


// Công việc APIs
export const congViecAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/cong-viec?${queryString}`);
  },
  create: (data) => apiCall('/cong-viec', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/cong-viec/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/cong-viec/${id}`, {
    method: 'DELETE',
  }),
  phanCong: (data) => apiCall('/cong-viec/phan-cong', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTrangThai: (id, data) => apiCall(`/cong-viec/${id}/trang-thai`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// KPI APIs
export const kpiAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/kpi?${queryString}`);
  },
  getMyKPI: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/kpi/my-kpi?${queryString}`);
  },
  tinhKPI: (data) => apiCall('/kpi/tinh-kpi', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  tinhKPITatCa: (data) => apiCall('/kpi/tinh-kpi-tat-ca', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getDiemMucUuTien: () => apiCall('/kpi/diem-muc-uu-tien'),
  updateDiemMucUuTien: (data) => apiCall('/kpi/diem-muc-uu-tien', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Loại bệnh lý APIs
export const loaiBenhLyAPI = {
  getAll: () => apiCall('/loai-benh-ly'),
  getById: (id) => apiCall(`/loai-benh-ly/${id}`),
  create: (data) => apiCall('/loai-benh-ly', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Thông tin bệnh APIs
export const thongTinBenhAPI = {
  getAll: () => apiCall('/thong-tin-benh'),
  getById: (id) => apiCall(`/thong-tin-benh/${id}`),
  create: (data) => apiCall('/thong-tin-benh', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Danh sách triệu chứng APIs
export const danhSachTrieuChungAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/danh-sach-trieu-chung?${queryString}`);
  },
  getById: (id) => apiCall(`/danh-sach-trieu-chung/${id}`),
  create: (data) => apiCall('/danh-sach-trieu-chung', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/danh-sach-trieu-chung/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/danh-sach-trieu-chung/${id}`, {
    method: 'DELETE',
  }),
};

// Triệu chứng bệnh nhân APIs
export const trieuChungBenhNhanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/trieu-chung-benh-nhan?${queryString}`);
  },
  getById: (id) => apiCall(`/trieu-chung-benh-nhan/${id}`),
  create: (data) => apiCall('/trieu-chung-benh-nhan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/trieu-chung-benh-nhan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/trieu-chung-benh-nhan/${id}`, {
    method: 'DELETE',
  }),
};

// Cấu hình chỉ số cảnh báo APIs
export const cauHinhChiSoCanhBaoAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/cau-hinh-chi-so-canh-bao?${queryString}`);
  },
  getById: (id) => apiCall(`/cau-hinh-chi-so-canh-bao/${id}`),
  create: (data) => apiCall('/cau-hinh-chi-so-canh-bao', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/cau-hinh-chi-so-canh-bao/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/cau-hinh-chi-so-canh-bao/${id}`, {
    method: 'DELETE',
  }),
};

// Thông báo APIs
export const thongBaoAPI = {
  getThongBaos: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/thong-bao?${queryString}`);
  },
  getThongBaoChuaDoc: () => apiCall('/thong-bao/chua-doc'),
  markAsRead: (id) => apiCall(`/thong-bao/${id}/danh-dau-doc`, {
    method: 'PUT',
  }),
  markAllAsRead: () => apiCall('/thong-bao/danh-dau-tat-ca-doc', {
    method: 'PUT',
  }),
  deleteThongBao: (id) => apiCall(`/thong-bao/${id}`, {
    method: 'DELETE',
  }),
};

// Media cá nhân bệnh nhân APIs
export const mediaCaNhanBenhNhanAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/media-ca-nhan-benh-nhan?${queryString}`);
  },
  getById: (id) => apiCall(`/media-ca-nhan-benh-nhan/${id}`),
  create: (data) => apiCall('/media-ca-nhan-benh-nhan', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiCall(`/media-ca-nhan-benh-nhan/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiCall(`/media-ca-nhan-benh-nhan/${id}`, {
    method: 'DELETE',
  }),
  uploadFile: async (file) => {
    const token = getToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/media-ca-nhan-benh-nhan/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Có lỗi xảy ra khi upload file');
    }

    return data;
  },
};

// Public Health Alerts APIs (không cần authentication)
export const publicHealthAlertsAPI = {
  getAll: (params = {}) => {
    // Public endpoint - không gửi token
    const queryString = new URLSearchParams(params).toString();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    return fetch(`${API_BASE_URL}/public/health-alerts${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers,
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
      return data;
    });
  },
};

