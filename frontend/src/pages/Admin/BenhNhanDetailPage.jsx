import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  benhNhanAPI, thuocAPI, congViecAPI, 
  phongAPI, phanKhuAPI, phongNewAPI, nguoiThanAPI, doDungAPI, nhanVienAPI,
  benhNhanDichVuAPI, dichVuAPI, loaiBenhLyAPI, thongTinBenhAPI, phanLoaiDoDungAPI, uploadAPI,
  trieuChungBenhNhanAPI, danhSachTrieuChungAPI, taiKhoanAPI
} from '../../services/api';
import { 
  formatDateVN, formatDateTimeVN, formatDateForInput, formatDateTimeForInput,
  getTodayVN, getVNNow, toISOStringVN, toVNDate
} from '../../utils/dateUtils';

export default function BenhNhanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [benhNhan, setBenhNhan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('thong-tin');
  // States for individual vital signs
  const [huyetAp, setHuyetAp] = useState([]);
  const [nhipTim, setNhipTim] = useState([]);
  const [duongHuyet, setDuongHuyet] = useState([]);
  const [spo2, setSpo2] = useState([]);
  const [nhietDo, setNhietDo] = useState([]);
  
  // Pagination states for vital signs
  const [huyetApPagination, setHuyetApPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0 });
  const [nhipTimPagination, setNhipTimPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0 });
  const [duongHuyetPagination, setDuongHuyetPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0 });
  const [spo2Pagination, setSpo2Pagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0 });
  const [nhietDoPagination, setNhietDoPagination] = useState({ currentPage: 1, itemsPerPage: 10, totalPages: 1, totalItems: 0 });
  const [donThuocs, setDonThuocs] = useState([]);
  const [thucDons, setThucDons] = useState([]);
  const [congViecs, setCongViecs] = useState([]);
  const [phong, setPhong] = useState(null);
  const [allPhongs, setAllPhongs] = useState([]);
  const [nguoiThans, setNguoiThans] = useState([]);
  const [existingNguoiThans, setExistingNguoiThans] = useState([]);
  const [searchExistingNguoiThan, setSearchExistingNguoiThan] = useState('');
  const [existingNguoiThansPagination, setExistingNguoiThansPagination] = useState({ currentPage: 1, itemsPerPage: 12 });
  const [doDungs, setDoDungs] = useState([]);
  const [phanLoaiDoDungs, setPhanLoaiDoDungs] = useState([]);
  const [doDungFilters, setDoDungFilters] = useState({
    search: '',
    id_phan_loai: '',
    nguon_cung_cap: '',
    tinh_trang: '',
  });
  const [nhanViens, setNhanViens] = useState([]);
  const [phanKhus, setPhanKhus] = useState([]);
  const [phongs, setPhongs] = useState([]);
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [selectedPhong, setSelectedPhong] = useState(null);
  const [dichVus, setDichVus] = useState([]);
  const [benhNhanDichVus, setBenhNhanDichVus] = useState([]);
  const [allDichVus, setAllDichVus] = useState([]);
  const [hoSoYTe, setHoSoYTe] = useState(null);
  const [benhHienTai, setBenhHienTai] = useState([]);
  const [tamLyGiaoTiep, setTamLyGiaoTiep] = useState([]);
  const [vanDongPhucHoi, setVanDongPhucHoi] = useState([]);
  const [loaiBenhLys, setLoaiBenhLys] = useState([]);
  const [thongTinBenhs, setThongTinBenhs] = useState([]);
  const [showCreateLoaiBenhLy, setShowCreateLoaiBenhLy] = useState(false);
  const [showCreateThongTinBenh, setShowCreateThongTinBenh] = useState(false);
  const [newLoaiBenhLy, setNewLoaiBenhLy] = useState({ ten_loai_benh_ly: '', mo_ta: '' });
  const [newThongTinBenh, setNewThongTinBenh] = useState({ ten_benh: '', mo_ta: '' });
  const [qrCode, setQrCode] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [nguoiThanHoTenError, setNguoiThanHoTenError] = useState('');
  const [nguoiThanSoDienThoaiError, setNguoiThanSoDienThoaiError] = useState('');
  const [nguoiThanEmailError, setNguoiThanEmailError] = useState('');
  // States for trieu chung
  const [trieuChungs, setTrieuChungs] = useState([]);
  const [danhSachTrieuChung, setDanhSachTrieuChung] = useState([]);
  const [showTrieuChungModal, setShowTrieuChungModal] = useState(false);
  const [editingTrieuChung, setEditingTrieuChung] = useState(null);
  const [trieuChungForm, setTrieuChungForm] = useState({
    id_trieu_chung: '',
    ngay_gio_xay_ra: formatDateTimeForInput(new Date()),
  });
  
  // Validation function for ho_ten
  const validateHoTen = (value) => {
    if (!value || value.trim() === '') {
      return 'Họ tên không được để trống';
    }
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return 'Họ tên phải có ít nhất 2 ký tự';
    }
    if (trimmed.length > 100) {
      return 'Họ tên không được vượt quá 100 ký tự';
    }
    // Chỉ cho phép chữ cái, dấu cách, dấu tiếng Việt
    const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    if (!vietnameseNameRegex.test(trimmed)) {
      return 'Họ tên chỉ được chứa chữ cái, dấu cách và dấu tiếng Việt';
    }
    // Không cho phép nhiều khoảng trắng liên tiếp
    if (/\s{2,}/.test(trimmed)) {
      return 'Họ tên không được có nhiều khoảng trắng liên tiếp';
    }
    return '';
  };

  // Validation function for so_dien_thoai
  const validateSoDienThoai = (value) => {
    if (!value || value.trim() === '') {
      return 'Số điện thoại không được để trống';
    }
    const trimmed = value.trim();
    // Format: 10 số, bắt đầu bằng 0 hoặc +84
    // Cho phép: 0xxxxxxxxx hoặc +84xxxxxxxxx hoặc 84xxxxxxxxx
    const phoneRegex = /^(0|\+84|84)[1-9][0-9]{8,9}$/;
    // Loại bỏ khoảng trắng và dấu gạch ngang để kiểm tra
    const cleaned = trimmed.replace(/[\s-]/g, '');
    if (!phoneRegex.test(cleaned)) {
      return 'Số điện thoại không hợp lệ. Vui lòng nhập 10 số (bắt đầu bằng 0) hoặc định dạng +84';
    }
    return '';
  };

  // Validation function for email (optional field)
  const validateEmail = (value) => {
    // Email là optional, chỉ validate nếu có giá trị
    if (!value || value.trim() === '') {
      return ''; // Không bắt buộc
    }
    const trimmed = value.trim().toLowerCase();
    // Email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return 'Email không hợp lệ. Vui lòng nhập đúng định dạng email';
    }
    if (trimmed.length > 100) {
      return 'Email không được vượt quá 100 ký tự';
    }
    return '';
  };
  
  // Modal states
  const [showHuyetApModal, setShowHuyetApModal] = useState(false);
  const [showNhipTimModal, setShowNhipTimModal] = useState(false);
  const [showDuongHuyetModal, setShowDuongHuyetModal] = useState(false);
  const [showSpo2Modal, setShowSpo2Modal] = useState(false);
  const [showNhietDoModal, setShowNhietDoModal] = useState(false);
  const [showThuocModal, setShowThuocModal] = useState(false);
  const [showCongViecModal, setShowCongViecModal] = useState(false);
  const [showNguoiThanModal, setShowNguoiThanModal] = useState(false);
  const [showSelectNguoiThanModal, setShowSelectNguoiThanModal] = useState(false);
  const [showDoDungModal, setShowDoDungModal] = useState(false);
  const [showPhongModal, setShowPhongModal] = useState(false);
  const [showDichVuModal, setShowDichVuModal] = useState(false);
  const [showHoSoYTeModal, setShowHoSoYTeModal] = useState(false);
  const [showBenhHienTaiModal, setShowBenhHienTaiModal] = useState(false);
  const [showTamLyGiaoTiepModal, setShowTamLyGiaoTiepModal] = useState(false);
  const [showVanDongPhucHoiModal, setShowVanDongPhucHoiModal] = useState(false);
  
  // Form data states
  // Forms for individual vital signs
  const [huyetApForm, setHuyetApForm] = useState({
    tam_thu: '',
    tam_truong: '',
    thoi_gian_do: formatDateTimeForInput(getVNNow()),
    vi_tri_do: '',
    tu_the_khi_do: '',
    ghi_chu: '',
    muc_do: '',
    noi_dung_canh_bao: '',
  });
  const [nhipTimForm, setNhipTimForm] = useState({
    gia_tri_nhip_tim: '',
    thoi_gian_do: formatDateTimeForInput(getVNNow()),
    tinh_trang_benh_nhan_khi_do: '',
    ghi_chu: '',
    muc_do: '',
    noi_dung_canh_bao: '',
  });
  const [duongHuyetForm, setDuongHuyetForm] = useState({
    gia_tri_duong_huyet: '',
    thoi_gian_do: formatDateTimeForInput(getVNNow()),
    thoi_diem_do: '',
    vi_tri_lay_mau: '',
    trieu_chung_kem_theo: '',
    ghi_chu: '',
    muc_do: '',
    noi_dung_canh_bao: '',
  });
  const [spo2Form, setSpo2Form] = useState({
    gia_tri_spo2: '',
    pi: '',
    thoi_gian_do: formatDateTimeForInput(getVNNow()),
    vi_tri_do: '',
    tinh_trang_ho_hap: '',
    ghi_chu: '',
    muc_do: '',
    noi_dung_canh_bao: '',
  });
  const [nhietDoForm, setNhietDoForm] = useState({
    gia_tri_nhiet_do: '',
    thoi_gian_do: formatDateTimeForInput(getVNNow()),
    vi_tri_do: '',
    tinh_trang_luc_do: '',
    ghi_chu: '',
    muc_do: '',
    noi_dung_canh_bao: '',
  });
  const [thuocForm, setThuocForm] = useState({
    mo_ta: '',
    ngay_ke: getTodayVN(),
    thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
  });
  const [congViecForm, setCongViecForm] = useState({
    ten_cong_viec: '',
    mo_ta: '',
    muc_uu_tien: 'trung_binh',
    thoi_gian_du_kien: formatDateTimeForInput(getVNNow()),
    id_dieu_duong: '',
  });
  const [nguoiThanForm, setNguoiThanForm] = useState({
    ho_ten: '',
    moi_quan_he: '',
    so_dien_thoai: '',
    email: '',
    la_nguoi_lien_he_chinh: false,
  });
  const [doDungForm, setDoDungForm] = useState({
    id_phan_loai: '',
    ten_vat_dung: '',
    so_luong: 1,
    tinh_trang: 'tot',
    ghi_chu: '',
    nguon_cung_cap: 'ca_nhan',
    media: '',
  });
  const [doDungTab, setDoDungTab] = useState('ca_nhan'); // Tab hiện tại: 'ca_nhan' hoặc 'benh_vien'
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [phongForm, setPhongForm] = useState({
    id_phan_khu: '',
    id_phong: '',
    khu: '',
    phong: '',
    giuong: '',
  });
  
  const [editingHuyetAp, setEditingHuyetAp] = useState(null);
  const [editingNhipTim, setEditingNhipTim] = useState(null);
  const [editingDuongHuyet, setEditingDuongHuyet] = useState(null);
  const [editingSpo2, setEditingSpo2] = useState(null);
  const [editingNhietDo, setEditingNhietDo] = useState(null);
  const [editingThuoc, setEditingThuoc] = useState(null);
  const [editingNguoiThan, setEditingNguoiThan] = useState(null);
  const [editingDoDung, setEditingDoDung] = useState(null);
  const [editingDichVu, setEditingDichVu] = useState(null);
  const [editingBenhHienTai, setEditingBenhHienTai] = useState(null);
  const [editingTamLyGiaoTiep, setEditingTamLyGiaoTiep] = useState(null);
  const [editingVanDongPhucHoi, setEditingVanDongPhucHoi] = useState(null);
  const [dichVuForm, setDichVuForm] = useState({
    id_dich_vu: '',
    ngay_bat_dau: getTodayVN(),
    ngay_ket_thuc: '',
    hinh_thuc_thanh_toan: 'thang',
    trang_thai: 'dang_su_dung'
  });
  const [isDoiDichVu, setIsDoiDichVu] = useState(false);
  const [dichVuCuId, setDichVuCuId] = useState(null);
  
  // Form states for new features
  const [hoSoYTeForm, setHoSoYTeForm] = useState({
    id_loai_benh_ly: '',
    tien_su_benh: '',
    di_ung_thuoc: '',
    lich_su_phau_thuat: '',
    benh_ly_hien_tai: '',
    ghi_chu_dac_biet: '',
  });
  const [benhHienTaiForm, setBenhHienTaiForm] = useState({
    id_thong_tin_benh: '',
    ngay_phat_hien: getTodayVN(),
    tinh_trang: 'dang_dieu_tri',
    ghi_chu: '',
  });
  const [tamLyGiaoTiepForm, setTamLyGiaoTiepForm] = useState({
    trang_thai_tinh_than: 'binh_thuong',
    nhan_thuc_nguoi_than: false,
    nhan_thuc_dieu_duong: false,
    biet_thoi_gian: false,
    muc_do_tuong_tac: 'phan_hoi',
    ghi_chu: '',
    thoi_gian: toISOStringVN(getVNNow()),
  });
  const [vanDongPhucHoiForm, setVanDongPhucHoiForm] = useState({
    kha_nang_van_dong: 'doc_lap',
    loai_bai_tap: '',
    thoi_gian_bat_dau: formatDateTimeForInput(getVNNow()),
    thoi_luong_phut: '',
    cuong_do: 'trung_binh',
    calo_tieu_hao: '',
    ghi_chu: '',
  });

  // Nhóm tabs theo danh mục - phải khai báo trước các hooks
  const tabGroups = [
    {
      id: 'thong-tin-co-ban',
      label: 'Thông tin cơ bản',
      icon: 'person',
      tabs: [
        { id: 'thong-tin', label: 'Thông tin', icon: 'info' },
        { id: 'phong', label: 'Phòng', icon: 'bed' },
        { id: 'nguoi-than', label: 'Người thân', icon: 'group' },
        { id: 'do-dung', label: 'Vật dụng', icon: 'inventory_2' },
      ]
    },
    {
      id: 'chi-so-suc-khoe',
      label: 'Chỉ số sức khỏe',
      icon: 'monitor_heart',
      tabs: [
        { id: 'huyet-ap', label: 'Huyết áp', icon: 'favorite' },
        { id: 'nhip-tim', label: 'Nhịp tim', icon: 'favorite' },
        { id: 'duong-huyet', label: 'Đường huyết', icon: 'bloodtype' },
        { id: 'spo2', label: 'SpO2', icon: 'air' },
        { id: 'nhiet-do', label: 'Nhiệt độ', icon: 'thermostat' },
        { id: 'trieu-chung', label: 'Triệu chứng', icon: 'sick' },
      ]
    },
    {
      id: 'dieu-tri-cham-soc',
      label: 'Điều trị & Chăm sóc',
      icon: 'medical_services',
      tabs: [
        { id: 'thuoc', label: 'Đơn thuốc', icon: 'medication' },
        { id: 'cong-viec', label: 'Công việc', icon: 'task' },
        { id: 'dich-vu', label: 'Dịch vụ', icon: 'medical_services' },
      ]
    },
    {
      id: 'ho-so-y-te',
      label: 'Hồ sơ y tế',
      icon: 'folder',
      tabs: [
        { id: 'ho-so-y-te', label: 'Hồ sơ y tế', icon: 'folder' },
        { id: 'benh-hien-tai', label: 'Bệnh hiện tại', icon: 'medical_information' },
        { id: 'tam-ly', label: 'Tâm lý giao tiếp', icon: 'psychology' },
        { id: 'van-dong', label: 'Vận động phục hồi', icon: 'fitness_center' },
      ]
    }
  ];

  // Sidebar states - phải khai báo trước useEffect để tuân thủ Rules of Hooks
  const getCurrentTabGroup = () => {
    for (const group of tabGroups) {
      if (group.tabs.some(tab => tab.id === activeTab)) {
        return group.id;
      }
    }
    return 'thong-tin-co-ban';
  };

  // Hàm format giá trị đánh giá sang tiếng Việt có dấu
  const formatDanhGia = (value) => {
    if (!value) return 'Bình thường';
    const mapping = {
      'thap': 'Thấp',
      'cao': 'Cao',
      'binh_thuong': 'Bình thường',
      'canh_bao': 'Cảnh báo',
      'nguy_hiem': 'Nguy hiểm',
      'bat_on': 'Bất ổn'
    };
    return mapping[value] || value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };


  const [activeTabGroup, setActiveTabGroup] = useState(getCurrentTabGroup());
  // Sidebar mặc định mở trên desktop, đóng trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Cập nhật activeTabGroup khi activeTab thay đổi - phải khai báo trước early returns
  useEffect(() => {
    setActiveTabGroup(getCurrentTabGroup());
  }, [activeTab]);

  useEffect(() => {
    if (id) {
      loadBenhNhanDetail();
      loadHuyetAp();
      loadNhipTim();
      loadDuongHuyet();
      loadSpo2();
      loadNhietDo();
      loadDonThuocs();
      loadThucDons();
      loadCongViecs();
      loadPhong();
      loadAllPhongs();
      loadNguoiThans();
      loadDoDungs();
      loadPhanLoaiDoDungs();
      loadNhanViens();
      loadBenhNhanDichVus();
      loadAllDichVus();
      loadHoSoYTe();
      loadBenhHienTai();
      loadTamLyGiaoTiep();
      loadVanDongPhucHoi();
      loadLoaiBenhLys();
      loadThongTinBenhs();
      loadQRCode();
      loadTrieuChungs();
      loadDanhSachTrieuChung();
    }
  }, [id]);

  const loadBenhNhanDetail = async () => {
    try {
      const response = await benhNhanAPI.getById(id);
      setBenhNhan(response.data);
      // Nếu có phongs trong response, cập nhật allPhongs
      if (response.data && response.data.phongs) {
        setAllPhongs(response.data.phongs);
      }
      // Nếu có QR code trong response, cập nhật qrCode
      if (response.data && response.data.qr_code) {
        setQrCode(response.data.qr_code);
      }
    } catch (error) {
      console.error('Error loading benh nhan:', error);
      alert('Lỗi khi tải thông tin bệnh nhân: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load individual vital signs
  const loadHuyetAp = async (page = null, itemsPerPage = null) => {
    try {
      const currentPage = page !== null ? page : huyetApPagination.currentPage;
      const limit = itemsPerPage !== null ? itemsPerPage : huyetApPagination.itemsPerPage;
      
      const response = await benhNhanAPI.getHuyetAp(id, { page: currentPage, limit });
      const data = response.data || [];
      setHuyetAp(data);
      
      // Xử lý pagination từ backend
      if (response.pagination) {
        setHuyetApPagination({
          currentPage: response.pagination.currentPage || currentPage,
          itemsPerPage: response.pagination.itemsPerPage || limit,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || data.length
        });
      } else {
        // Fallback nếu backend không trả về pagination
        setHuyetApPagination({
          currentPage,
          itemsPerPage: limit,
          totalPages: 1,
          totalItems: data.length
        });
      }
    } catch (error) {
      console.error('Error loading huyet ap:', error);
    }
  };

  const loadNhipTim = async (page = null, itemsPerPage = null) => {
    try {
      const currentPage = page !== null ? page : nhipTimPagination.currentPage;
      const limit = itemsPerPage !== null ? itemsPerPage : nhipTimPagination.itemsPerPage;
      
      const response = await benhNhanAPI.getNhipTim(id, { page: currentPage, limit });
      const data = response.data || [];
      setNhipTim(data);
      
      // Xử lý pagination từ backend
      if (response.pagination) {
        setNhipTimPagination({
          currentPage: response.pagination.currentPage || currentPage,
          itemsPerPage: response.pagination.itemsPerPage || limit,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || data.length
        });
      } else {
        // Fallback nếu backend không trả về pagination
        setNhipTimPagination({
          currentPage,
          itemsPerPage: limit,
          totalPages: 1,
          totalItems: data.length
        });
      }
    } catch (error) {
      console.error('Error loading nhip tim:', error);
    }
  };

  const loadDuongHuyet = async (page = null, itemsPerPage = null) => {
    try {
      const currentPage = page !== null ? page : duongHuyetPagination.currentPage;
      const limit = itemsPerPage !== null ? itemsPerPage : duongHuyetPagination.itemsPerPage;
      
      const response = await benhNhanAPI.getDuongHuyet(id, { page: currentPage, limit });
      const data = response.data || [];
      setDuongHuyet(data);
      
      // Xử lý pagination từ backend
      if (response.pagination) {
        setDuongHuyetPagination({
          currentPage: response.pagination.currentPage || currentPage,
          itemsPerPage: response.pagination.itemsPerPage || limit,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || data.length
        });
      } else {
        // Fallback nếu backend không trả về pagination
        setDuongHuyetPagination({
          currentPage,
          itemsPerPage: limit,
          totalPages: 1,
          totalItems: data.length
        });
      }
    } catch (error) {
      console.error('Error loading duong huyet:', error);
    }
  };

  const loadSpo2 = async (page = null, itemsPerPage = null) => {
    try {
      const currentPage = page !== null ? page : spo2Pagination.currentPage;
      const limit = itemsPerPage !== null ? itemsPerPage : spo2Pagination.itemsPerPage;
      
      const response = await benhNhanAPI.getSpo2(id, { page: currentPage, limit });
      const data = response.data || [];
      setSpo2(data);
      
      // Xử lý pagination từ backend
      if (response.pagination) {
        setSpo2Pagination({
          currentPage: response.pagination.currentPage || currentPage,
          itemsPerPage: response.pagination.itemsPerPage || limit,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || data.length
        });
      } else {
        // Fallback nếu backend không trả về pagination
        setSpo2Pagination({
          currentPage,
          itemsPerPage: limit,
          totalPages: 1,
          totalItems: data.length
        });
      }
    } catch (error) {
      console.error('Error loading spo2:', error);
    }
  };

  const loadNhietDo = async (page = null, itemsPerPage = null) => {
    try {
      const currentPage = page !== null ? page : nhietDoPagination.currentPage;
      const limit = itemsPerPage !== null ? itemsPerPage : nhietDoPagination.itemsPerPage;
      
      const response = await benhNhanAPI.getNhietDo(id, { page: currentPage, limit });
      const data = response.data || [];
      setNhietDo(data);
      
      // Xử lý pagination từ backend
      if (response.pagination) {
        setNhietDoPagination({
          currentPage: response.pagination.currentPage || currentPage,
          itemsPerPage: response.pagination.itemsPerPage || limit,
          totalPages: response.pagination.totalPages || 1,
          totalItems: response.pagination.totalItems || data.length
        });
      } else {
        // Fallback nếu backend không trả về pagination
        setNhietDoPagination({
          currentPage,
          itemsPerPage: limit,
          totalPages: 1,
          totalItems: data.length
        });
      }
    } catch (error) {
      console.error('Error loading nhiet do:', error);
    }
  };

  // Pagination helper functions
  const getPageNumbers = (totalPages, currentPage) => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (type, page) => {
    if (page >= 1) {
      switch (type) {
        case 'huyetAp':
          if (page <= huyetApPagination.totalPages) {
            loadHuyetAp(page);
          }
          break;
        case 'nhipTim':
          if (page <= nhipTimPagination.totalPages) {
            loadNhipTim(page);
          }
          break;
        case 'duongHuyet':
          if (page <= duongHuyetPagination.totalPages) {
            loadDuongHuyet(page);
          }
          break;
        case 'spo2':
          if (page <= spo2Pagination.totalPages) {
            loadSpo2(page);
          }
          break;
        case 'nhietDo':
          if (page <= nhietDoPagination.totalPages) {
            loadNhietDo(page);
          }
          break;
      }
    }
  };

  const handleItemsPerPageChange = (type, newItemsPerPage) => {
    switch (type) {
      case 'huyetAp':
        loadHuyetAp(1, newItemsPerPage);
        break;
      case 'nhipTim':
        loadNhipTim(1, newItemsPerPage);
        break;
      case 'duongHuyet':
        loadDuongHuyet(1, newItemsPerPage);
        break;
      case 'spo2':
        loadSpo2(1, newItemsPerPage);
        break;
      case 'nhietDo':
        loadNhietDo(1, newItemsPerPage);
        break;
    }
  };

  const loadDonThuocs = async () => {
    try {
      const response = await thuocAPI.getAll({ id_benh_nhan: id });
      setDonThuocs(response.data || []);
    } catch (error) {
      console.error('Error loading don thuoc:', error);
    }
  };

  const loadThucDons = async () => {
    try {
      // Thực đơn đã bị xóa, giữ lại để tránh lỗi
      setThucDons([]);
    } catch (error) {
      console.error('Error loading thuc don:', error);
    }
  };

  const loadCongViecs = async () => {
    try {
      const response = await congViecAPI.getAll({ id_benh_nhan: id });
      setCongViecs(response.data || []);
    } catch (error) {
      console.error('Error loading cong viec:', error);
    }
  };

  const loadPhong = async () => {
    try {
      const response = await phongAPI.getByBenhNhan(id);
      setPhong(response.data);
    } catch (error) {
      console.error('Error loading phong:', error);
    }
  };

  const loadAllPhongs = async () => {
    try {
      // Luôn lấy từ API để đảm bảo dữ liệu mới nhất
      // Thử lấy từ API getAll với filter trước
      try {
        const response = await phongAPI.getAll({ id_benh_nhan: id });
        if (response.data && Array.isArray(response.data)) {
          setAllPhongs(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API getAll not available, trying alternative method');
      }
      
      // Fallback: lấy từ benhNhan detail
        const detailResponse = await benhNhanAPI.getById(id);
        if (detailResponse.data && detailResponse.data.phongs) {
          setAllPhongs(detailResponse.data.phongs);
      } else if (benhNhan && benhNhan.phongs && Array.isArray(benhNhan.phongs)) {
        // Nếu API không trả về, dùng từ state (fallback)
        setAllPhongs(benhNhan.phongs);
      }
    } catch (error) {
      console.error('Error loading all phongs:', error);
    }
  };

  const loadNguoiThans = async () => {
    try {
      const response = await nguoiThanAPI.getAll({ id_benh_nhan: id });
      setNguoiThans(response.data || []);
    } catch (error) {
      console.error('Error loading nguoi than:', error);
    }
  };

  const loadExistingNguoiThans = async () => {
    try {
      // Lấy tất cả tài khoản có vai trò là người nhà
      // Sử dụng limit lớn để lấy tất cả dữ liệu
      const taiKhoanResponse = await taiKhoanAPI.getAll({ 
        vai_tro: 'nguoi_nha', 
        limit: 10000,
        trang_thai: 'active'
      });
      const allTaiKhoans = taiKhoanResponse.data || [];
      
      console.log('Total tai khoan with vai_tro nguoi_nha:', allTaiKhoans.length);
      
      // Lấy danh sách id_tai_khoan đã liên kết với bệnh nhân hiện tại
      const currentNguoiThansResponse = await nguoiThanAPI.getAll({ id_benh_nhan: id, limit: -1 });
      const currentNguoiThans = (currentNguoiThansResponse.data || []).filter(nt => nt.id_tai_khoan);
      
      // Tạo Set các id_tai_khoan đã liên kết với bệnh nhân này
      const linkedTaiKhoanIds = new Set(
        currentNguoiThans.map(nt => String(nt.id_tai_khoan))
      );
      
      console.log('Linked tai khoan IDs:', Array.from(linkedTaiKhoanIds));
      
      // Lọc ra những tài khoản chưa liên kết với bệnh nhân này
      // Chuyển đổi từ tài khoản sang format người thân để tương thích với UI
      const availableNguoiThans = allTaiKhoans
        .filter(tk => !linkedTaiKhoanIds.has(String(tk.id)))
        .map(tk => ({
          id: null, // Chưa có id trong bảng nguoi_than_benh_nhan
          id_tai_khoan: tk.id,
          ho_ten: tk.ho_ten,
          so_dien_thoai: tk.so_dien_thoai,
          email: tk.email,
          moi_quan_he: null, // Sẽ được set khi tạo liên kết
          la_nguoi_lien_he_chinh: false
        }));
      
      console.log('Available nguoi thans (not linked):', availableNguoiThans.length);
      console.log('Sample result:', availableNguoiThans.slice(0, 5).map(nt => ({
        id_tai_khoan: nt.id_tai_khoan,
        ho_ten: nt.ho_ten,
        so_dien_thoai: nt.so_dien_thoai,
        email: nt.email
      })));
      
      setExistingNguoiThans(availableNguoiThans);
    } catch (error) {
      console.error('Error loading existing nguoi than:', error);
      setExistingNguoiThans([]);
    }
  };

  const loadDoDungs = async () => {
    try {
      const response = await doDungAPI.getAll({ id_benh_nhan: id });
      setDoDungs(response.data || []);
    } catch (error) {
      console.error('Error loading do dung:', error);
    }
  };

  const loadPhanLoaiDoDungs = async () => {
    try {
      const response = await phanLoaiDoDungAPI.getAll();
      setPhanLoaiDoDungs(response.data || []);
    } catch (error) {
      console.error('Error loading phan loai do dung:', error);
    }
  };

  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll({ limit: -1 });
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
    }
  };

  const loadPhanKhus = async () => {
    try {
      const response = await phanKhuAPI.getAll();
      setPhanKhus(response.data || []);
    } catch (error) {
      console.error('Error loading phan khus:', error);
    }
  };

  const loadPhongs = async (idPhanKhu) => {
    try {
      if (idPhanKhu) {
        const response = await phongNewAPI.getAll({ id_phan_khu: idPhanKhu });
        // Lọc chỉ các phòng còn chỗ trống (số người hiện tại < số người tối đa)
        const availablePhongs = (response.data || []).filter(p => {
          const currentCount = p.benh_nhans?.length || 0;
          const maxCapacity = p.so_nguoi_toi_da || 1;
          // Chỉ hiển thị phòng còn chỗ trống
          return currentCount < maxCapacity;
        });
        setPhongs(availablePhongs);
        console.log('Loaded available phongs:', { 
          idPhanKhu, 
          total: response.data?.length || 0,
          available: availablePhongs.length, 
          phongs: availablePhongs.map(p => ({
            id: p.id,
            ten_phong: p.ten_phong,
            current: p.benh_nhans?.length || 0,
            max: p.so_nguoi_toi_da || 1
          }))
        });
      } else {
        setPhongs([]);
      }
    } catch (error) {
      console.error('Error loading phongs:', error);
      setPhongs([]);
    }
  };

  const loadBenhNhanDichVus = async () => {
    try {
      // Load tất cả dịch vụ (không filter theo trang_thai) để hiển thị lịch sử đầy đủ
      const response = await benhNhanDichVuAPI.getAll({ id_benh_nhan: id });
      setBenhNhanDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhan dich vus:', error);
    }
  };

  const loadAllDichVus = async () => {
    try {
      // Truyền limit=-1 để lấy tất cả dịch vụ
      const response = await dichVuAPI.getAll({ limit: -1 });
      setAllDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading all dich vus:', error);
    }
  };

  const loadHoSoYTe = async () => {
    try {
      const response = await benhNhanAPI.getHoSoYTe(id);
      setHoSoYTe(response.data);
      if (response.data) {
        setHoSoYTeForm({
          id_loai_benh_ly: response.data.id_loai_benh_ly || '',
          tien_su_benh: response.data.tien_su_benh || '',
          di_ung_thuoc: response.data.di_ung_thuoc || '',
          lich_su_phau_thuat: response.data.lich_su_phau_thuat || '',
          benh_ly_hien_tai: response.data.benh_ly_hien_tai || '',
          ghi_chu_dac_biet: response.data.ghi_chu_dac_biet || '',
        });
      }
    } catch (error) {
      console.error('Error loading ho so y te:', error);
    }
  };

  const loadBenhHienTai = async () => {
    try {
      const response = await benhNhanAPI.getBenhHienTai(id);
      setBenhHienTai(response.data || []);
    } catch (error) {
      console.error('Error loading benh hien tai:', error);
    }
  };

  const loadTamLyGiaoTiep = async () => {
    try {
      const response = await benhNhanAPI.getTamLyGiaoTiep(id, { limit: 30 });
      setTamLyGiaoTiep(response.data || []);
    } catch (error) {
      console.error('Error loading tam ly giao tiep:', error);
    }
  };

  const loadVanDongPhucHoi = async () => {
    try {
      const response = await benhNhanAPI.getVanDongPhucHoi(id, { limit: 30 });
      setVanDongPhucHoi(response.data || []);
    } catch (error) {
      console.error('Error loading van dong phuc hoi:', error);
    }
  };

  const loadLoaiBenhLys = async () => {
    try {
      const response = await loaiBenhLyAPI.getAll();
      setLoaiBenhLys(response.data || []);
    } catch (error) {
      console.error('Error loading loai benh lys:', error);
    }
  };

  const loadThongTinBenhs = async () => {
    try {
      const response = await thongTinBenhAPI.getAll();
      setThongTinBenhs(response.data || []);
    } catch (error) {
      console.error('Error loading thong tin benhs:', error);
    }
  };

  const loadTrieuChungs = async () => {
    try {
      const response = await trieuChungBenhNhanAPI.getAll({ id_benh_nhan: id, limit: 100 });
      setTrieuChungs(response.data || []);
    } catch (error) {
      console.error('Error loading trieu chungs:', error);
    }
  };

  const loadDanhSachTrieuChung = async () => {
    try {
      const response = await danhSachTrieuChungAPI.getAll();
      setDanhSachTrieuChung(response.data || []);
    } catch (error) {
      console.error('Error loading danh sach trieu chung:', error);
    }
  };

  const loadQRCode = async () => {
    try {
      const response = await benhNhanAPI.getQRCode(id);
      setQrCode(response.data);
    } catch (error) {
      console.error('Error loading QR code:', error);
      setQrCode(null);
    }
  };

  const handleCreateQRCode = async () => {
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể tạo mã QR mới');
      return;
    }
    try {
      setLoadingQR(true);
      const response = await benhNhanAPI.createQRCode(id);
      setQrCode(response.data);
      alert('Tạo mã QR thành công!');
    } catch (error) {
      console.error('Error creating QR code:', error);
      alert('Lỗi khi tạo mã QR: ' + error.message);
    } finally {
      setLoadingQR(false);
    }
  };

  const handleRegenerateQRCode = async () => {
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thay đổi mã QR');
      return;
    }
    if (!confirm('Bạn có chắc muốn tạo mã QR mới? Mã QR cũ vẫn được giữ lại.')) {
      return;
    }
    try {
      setLoadingQR(true);
      const response = await benhNhanAPI.regenerateQRCode(id);
      setQrCode(response.data);
      alert('Tạo mã QR mới thành công!');
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      alert('Lỗi khi tạo mã QR mới: ' + error.message);
    } finally {
      setLoadingQR(false);
    }
  };

  // Tạo mới loại bệnh lý
  const handleCreateLoaiBenhLy = async (e) => {
    e.preventDefault();
    try {
      const response = await loaiBenhLyAPI.create(newLoaiBenhLy);
      alert('Tạo loại bệnh lý thành công');
      setShowCreateLoaiBenhLy(false);
      setNewLoaiBenhLy({ ten_loai_benh_ly: '', mo_ta: '' });
      await loadLoaiBenhLys();
      // Tự động chọn loại bệnh lý vừa tạo
      setHoSoYTeForm({ ...hoSoYTeForm, id_loai_benh_ly: String(response.data.id) });
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Tạo mới thông tin bệnh
  const handleCreateThongTinBenh = async (e) => {
    e.preventDefault();
    try {
      const response = await thongTinBenhAPI.create(newThongTinBenh);
      alert('Tạo thông tin bệnh thành công');
      setShowCreateThongTinBenh(false);
      setNewThongTinBenh({ ten_benh: '', mo_ta: '' });
      await loadThongTinBenhs();
      // Tự động chọn thông tin bệnh vừa tạo
      setBenhHienTaiForm({ ...benhHienTaiForm, id_thong_tin_benh: String(response.data.id) });
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Chi so sinh ton handlers
  // Chi so sinh ton - Đã xóa vì không còn bảng chi_so_sinh_ton

  // Helper function để chuyển undefined và empty string thành null
  const cleanFormData = (data) => {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === '') {
        cleaned[key] = null;
      } else if (typeof value === 'string' && value.trim() === '') {
        cleaned[key] = null;
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  // Huyet ap handlers
  const handleHuyetApSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingHuyetAp && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Không gửi danh_gia và muc_do lên backend, để backend tự tính
      const { danh_gia, muc_do, ...formData } = huyetApForm;
      const cleanedData = cleanFormData(formData);
      
      if (editingHuyetAp) {
        await benhNhanAPI.updateHuyetAp(id, editingHuyetAp.id, cleanedData);
        alert('Cập nhật huyết áp thành công');
      } else {
        await benhNhanAPI.createHuyetAp(id, cleanedData);
        alert('Thêm huyết áp thành công');
      }
      setShowHuyetApModal(false);
      resetHuyetApForm();
      loadHuyetAp();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditHuyetAp = (item) => {
    setEditingHuyetAp(item);
    setHuyetApForm({
      tam_thu: item.tam_thu || '',
      tam_truong: item.tam_truong || '',
      thoi_gian_do: item.thoi_gian_do ? formatDateTimeForInput(item.thoi_gian_do) : formatDateTimeForInput(getVNNow()),
      vi_tri_do: item.vi_tri_do || '',
      tu_the_khi_do: item.tu_the_khi_do || '',
      ghi_chu: item.ghi_chu || '',
      muc_do: item.muc_do || '',
      noi_dung_canh_bao: item.noi_dung_canh_bao || '',
    });
    setShowHuyetApModal(true);
  };

  const handleDeleteHuyetAp = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa chỉ số huyết áp này?')) return;
    try {
      await benhNhanAPI.deleteHuyetAp(id, itemId);
      alert('Xóa huyết áp thành công');
      loadHuyetAp();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetHuyetApForm = () => {
    setHuyetApForm({
      tam_thu: '',
      tam_truong: '',
      thoi_gian_do: formatDateTimeForInput(getVNNow()),
      vi_tri_do: '',
      tu_the_khi_do: '',
      ghi_chu: '',
      muc_do: '',
      noi_dung_canh_bao: '',
    });
    setEditingHuyetAp(null);
  };

  // Nhip tim handlers
  const handleNhipTimSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingNhipTim && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Không gửi danh_gia và muc_do lên backend, để backend tự tính
      const { danh_gia, muc_do, ...formData } = nhipTimForm;
      const cleanedData = cleanFormData(formData);
      
      if (editingNhipTim) {
        await benhNhanAPI.updateNhipTim(id, editingNhipTim.id, cleanedData);
        alert('Cập nhật nhịp tim thành công');
      } else {
        await benhNhanAPI.createNhipTim(id, cleanedData);
        alert('Thêm nhịp tim thành công');
      }
      setShowNhipTimModal(false);
      resetNhipTimForm();
      loadNhipTim();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditNhipTim = (item) => {
    setEditingNhipTim(item);
    setNhipTimForm({
      gia_tri_nhip_tim: item.gia_tri_nhip_tim || '',
      thoi_gian_do: item.thoi_gian_do ? formatDateTimeForInput(item.thoi_gian_do) : formatDateTimeForInput(getVNNow()),
      tinh_trang_benh_nhan_khi_do: item.tinh_trang_benh_nhan_khi_do || '',
      ghi_chu: item.ghi_chu || '',
      muc_do: item.muc_do || '',
      noi_dung_canh_bao: item.noi_dung_canh_bao || '',
    });
    setShowNhipTimModal(true);
  };

  const handleDeleteNhipTim = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa chỉ số nhịp tim này?')) return;
    try {
      await benhNhanAPI.deleteNhipTim(id, itemId);
      alert('Xóa nhịp tim thành công');
      loadNhipTim();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetNhipTimForm = () => {
    setNhipTimForm({
      gia_tri_nhip_tim: '',
      thoi_gian_do: formatDateTimeForInput(getVNNow()),
      tinh_trang_benh_nhan_khi_do: '',
      ghi_chu: '',
      muc_do: '',
      noi_dung_canh_bao: '',
    });
    setEditingNhipTim(null);
  };

  // Duong huyet handlers
  const handleDuongHuyetSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingDuongHuyet && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Không gửi danh_gia và muc_do lên backend, để backend tự tính
      const { danh_gia, muc_do, ...formData } = duongHuyetForm;
      const cleanedData = cleanFormData(formData);
      
      if (editingDuongHuyet) {
        await benhNhanAPI.updateDuongHuyet(id, editingDuongHuyet.id, cleanedData);
        alert('Cập nhật đường huyết thành công');
      } else {
        await benhNhanAPI.createDuongHuyet(id, cleanedData);
        alert('Thêm đường huyết thành công');
      }
      setShowDuongHuyetModal(false);
      resetDuongHuyetForm();
      loadDuongHuyet();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditDuongHuyet = (item) => {
    setEditingDuongHuyet(item);
    setDuongHuyetForm({
      gia_tri_duong_huyet: item.gia_tri_duong_huyet || '',
      thoi_gian_do: item.thoi_gian_do ? formatDateTimeForInput(item.thoi_gian_do) : formatDateTimeForInput(getVNNow()),
      thoi_diem_do: item.thoi_diem_do || '',
      vi_tri_lay_mau: item.vi_tri_lay_mau || '',
      trieu_chung_kem_theo: item.trieu_chung_kem_theo || '',
      ghi_chu: item.ghi_chu || '',
      muc_do: item.muc_do || '',
      noi_dung_canh_bao: item.noi_dung_canh_bao || '',
    });
    setShowDuongHuyetModal(true);
  };

  const handleDeleteDuongHuyet = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa chỉ số đường huyết này?')) return;
    try {
      await benhNhanAPI.deleteDuongHuyet(id, itemId);
      alert('Xóa đường huyết thành công');
      loadDuongHuyet();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetDuongHuyetForm = () => {
    setDuongHuyetForm({
      gia_tri_duong_huyet: '',
      thoi_gian_do: formatDateTimeForInput(getVNNow()),
      thoi_diem_do: '',
      vi_tri_lay_mau: '',
      trieu_chung_kem_theo: '',
      ghi_chu: '',
      muc_do: '',
      noi_dung_canh_bao: '',
    });
    setEditingDuongHuyet(null);
  };

  // SpO2 handlers
  const handleSpo2Submit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingSpo2 && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Không gửi muc_do lên backend, để backend tự tính
      const { muc_do, ...formData } = spo2Form;
      const cleanedData = cleanFormData(formData);
      
      if (editingSpo2) {
        await benhNhanAPI.updateSpo2(id, editingSpo2.id, cleanedData);
        alert('Cập nhật SpO2 thành công');
      } else {
        await benhNhanAPI.createSpo2(id, cleanedData);
        alert('Thêm SpO2 thành công');
      }
      setShowSpo2Modal(false);
      resetSpo2Form();
      loadSpo2();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditSpo2 = (item) => {
    setEditingSpo2(item);
    setSpo2Form({
      gia_tri_spo2: item.gia_tri_spo2 || '',
      pi: item.pi || '',
      thoi_gian_do: item.thoi_gian_do ? formatDateTimeForInput(item.thoi_gian_do) : formatDateTimeForInput(getVNNow()),
      vi_tri_do: item.vi_tri_do || '',
      tinh_trang_ho_hap: item.tinh_trang_ho_hap || '',
      ghi_chu: item.ghi_chu || '',
      muc_do: item.muc_do || '',
      noi_dung_canh_bao: item.noi_dung_canh_bao || '',
    });
    setShowSpo2Modal(true);
  };

  const handleDeleteSpo2 = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa chỉ số SpO2 này?')) return;
    try {
      await benhNhanAPI.deleteSpo2(id, itemId);
      alert('Xóa SpO2 thành công');
      loadSpo2();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetSpo2Form = () => {
    setSpo2Form({
      gia_tri_spo2: '',
      pi: '',
      thoi_gian_do: formatDateTimeForInput(getVNNow()),
      vi_tri_do: '',
      tinh_trang_ho_hap: '',
      ghi_chu: '',
      muc_do: '',
      noi_dung_canh_bao: '',
    });
    setEditingSpo2(null);
  };

  // Nhiet do handlers
  const handleNhietDoSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingNhietDo && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Không gửi danh_gia và muc_do lên backend, để backend tự tính
      const { danh_gia, muc_do, ...formData } = nhietDoForm;
      const cleanedData = cleanFormData(formData);
      
      if (editingNhietDo) {
        await benhNhanAPI.updateNhietDo(id, editingNhietDo.id, cleanedData);
        alert('Cập nhật nhiệt độ thành công');
      } else {
        await benhNhanAPI.createNhietDo(id, cleanedData);
        alert('Thêm nhiệt độ thành công');
      }
      setShowNhietDoModal(false);
      resetNhietDoForm();
      loadNhietDo();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditNhietDo = (item) => {
    setEditingNhietDo(item);
    setNhietDoForm({
      gia_tri_nhiet_do: item.gia_tri_nhiet_do || '',
      thoi_gian_do: item.thoi_gian_do ? formatDateTimeForInput(item.thoi_gian_do) : formatDateTimeForInput(getVNNow()),
      vi_tri_do: item.vi_tri_do || '',
      tinh_trang_luc_do: item.tinh_trang_luc_do || '',
      ghi_chu: item.ghi_chu || '',
      muc_do: item.muc_do || '',
      noi_dung_canh_bao: item.noi_dung_canh_bao || '',
    });
    setShowNhietDoModal(true);
  };

  const handleDeleteNhietDo = async (itemId) => {
    if (!confirm('Bạn có chắc muốn xóa chỉ số nhiệt độ này?')) return;
    try {
      await benhNhanAPI.deleteNhietDo(id, itemId);
      alert('Xóa nhiệt độ thành công');
      loadNhietDo();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetNhietDoForm = () => {
    setNhietDoForm({
      gia_tri_nhiet_do: '',
      thoi_gian_do: formatDateTimeForInput(getVNNow()),
      vi_tri_do: '',
      tinh_trang_luc_do: '',
      ghi_chu: '',
      muc_do: '',
      noi_dung_canh_bao: '',
    });
    setEditingNhietDo(null);
  };


  // Thuoc handlers
  const handleThuocSubmit = async (e) => {
    e.preventDefault();
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      const data = { ...thuocForm, id_benh_nhan: id };
      await thuocAPI.create(data);
      alert('Tạo đơn thuốc thành công');
      setShowThuocModal(false);
      resetThuocForm();
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleAddThuoc = () => {
    setThuocForm({
      ...thuocForm,
      thuoc: [...thuocForm.thuoc, { ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
  };

  const handleRemoveThuoc = (index) => {
    const newThuoc = thuocForm.thuoc.filter((_, i) => i !== index);
    setThuocForm({ ...thuocForm, thuoc: newThuoc });
  };

  const handleThuocChange = (index, field, value) => {
    const newThuoc = [...thuocForm.thuoc];
    newThuoc[index][field] = value;
    setThuocForm({ ...thuocForm, thuoc: newThuoc });
  };

  const resetThuocForm = () => {
    setThuocForm({
      mo_ta: '',
      ngay_ke: getTodayVN(),
      thuoc: [{ ten_thuoc: '', lieu_luong: '', thoi_diem_uong: '', ghi_chu: '' }],
    });
    setEditingThuoc(null);
  };

  // Thuc don handlers - Đã xóa vì không còn dinh dưỡng

  // Cong viec handlers
  const handleCongViecSubmit = async (e) => {
    e.preventDefault();
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Convert datetime-local format to MySQL format before submitting
      const data = {
        ...congViecForm,
        id_benh_nhan: id,
        thoi_gian_du_kien: congViecForm.thoi_gian_du_kien ? toISOStringVN(congViecForm.thoi_gian_du_kien) : '',
      };
      await congViecAPI.create(data);
      alert('Tạo công việc thành công');
      setShowCongViecModal(false);
      resetCongViecForm();
      loadCongViecs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetCongViecForm = () => {
    setCongViecForm({
      ten_cong_viec: '',
      mo_ta: '',
      muc_uu_tien: 'trung_binh',
      thoi_gian_du_kien: formatDateTimeForInput(getVNNow()),
      id_dieu_duong: '',
    });
  };

  // Nguoi than handlers
  const handleNguoiThanSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingNguoiThan && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    
    // Validate ho_ten
    const hoTenValidation = validateHoTen(nguoiThanForm.ho_ten);
    if (hoTenValidation) {
      setNguoiThanHoTenError(hoTenValidation);
      return;
    }
    setNguoiThanHoTenError('');

    // Validate so_dien_thoai
    const soDienThoaiValidation = validateSoDienThoai(nguoiThanForm.so_dien_thoai);
    if (soDienThoaiValidation) {
      setNguoiThanSoDienThoaiError(soDienThoaiValidation);
      return;
    }
    setNguoiThanSoDienThoaiError('');

    // Validate email (optional)
    const emailValidation = validateEmail(nguoiThanForm.email);
    if (emailValidation) {
      setNguoiThanEmailError(emailValidation);
      return;
    }
    setNguoiThanEmailError('');
    
    try {
      const data = { ...nguoiThanForm, id_benh_nhan: id };
      if (editingNguoiThan) {
        await nguoiThanAPI.update(editingNguoiThan.id, data);
        alert('Cập nhật người thân thành công');
      } else {
        const response = await nguoiThanAPI.create(data);
        let message = 'Thêm người thân thành công';
        if (response.data?.tai_khoan_id) {
          message += '\n\nTài khoản đã được tạo tự động với:';
          message += '\n- Email/SĐT: ' + (nguoiThanForm.email || nguoiThanForm.so_dien_thoai);
          message += '\n- Mật khẩu mặc định: 123456';
          message += '\n- Vai trò: Người nhà';
          message += '\n- Trạng thái: Không hoạt động (inactive)';
          message += '\n\nLưu ý: Tài khoản cần được kích hoạt (active) để có thể đăng nhập.';
        }
        alert(message);
      }
      setShowNguoiThanModal(false);
      resetNguoiThanForm();
      loadNguoiThans();
      loadBenhNhanDetail();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditNguoiThan = (nt) => {
    setEditingNguoiThan(nt);
    setNguoiThanForm({
      ho_ten: nt.ho_ten || '',
      moi_quan_he: nt.moi_quan_he || '',
      so_dien_thoai: nt.so_dien_thoai || '',
      email: nt.email || '',
      la_nguoi_lien_he_chinh: nt.la_nguoi_lien_he_chinh || false,
    });
    setShowNguoiThanModal(true);
  };

  const handleDeleteNguoiThan = async (ntId) => {
    if (!confirm('Bạn có chắc muốn xóa người thân này?')) return;
    try {
      await nguoiThanAPI.delete(ntId);
      alert('Xóa người thân thành công');
      loadNguoiThans();
      loadBenhNhanDetail();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetNguoiThanForm = () => {
    setNguoiThanForm({
      ho_ten: '',
      moi_quan_he: '',
      so_dien_thoai: '',
      email: '',
      la_nguoi_lien_he_chinh: false,
    });
    setEditingNguoiThan(null);
    setNguoiThanHoTenError('');
    setNguoiThanSoDienThoaiError('');
    setNguoiThanEmailError('');
  };

  const handleSelectExistingNguoiThan = async (selectedNguoiThan) => {
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Tạo quan hệ mới giữa người thân đã tồn tại và bệnh nhân hiện tại
      const data = {
        id_benh_nhan: id,
        id_tai_khoan: selectedNguoiThan.id_tai_khoan,
        ho_ten: selectedNguoiThan.ho_ten,
        moi_quan_he: '',
        so_dien_thoai: selectedNguoiThan.so_dien_thoai,
        email: selectedNguoiThan.email,
        la_nguoi_lien_he_chinh: false,
      };
      
      await nguoiThanAPI.create(data);
      alert('Thêm người thân đã tồn tại thành công');
      setShowSelectNguoiThanModal(false);
      setSearchExistingNguoiThan('');
      setExistingNguoiThansPagination({ currentPage: 1, itemsPerPage: 12 });
      loadNguoiThans();
      loadBenhNhanDetail();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Do dung handlers
  const handleDoDungSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingDoDung && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      const data = { 
        ...doDungForm, 
        id_benh_nhan: id,
        id_phan_loai: doDungForm.id_phan_loai ? parseInt(doDungForm.id_phan_loai) : null,
        nguon_cung_cap: doDungTab // Sử dụng tab hiện tại làm nguon_cung_cap
      };
      if (editingDoDung) {
        await doDungAPI.update(editingDoDung.id, data);
        alert('Cập nhật vật dụng thành công');
      } else {
        await doDungAPI.create(data);
        alert('Thêm vật dụng thành công');
      }
      setShowDoDungModal(false);
      resetDoDungForm();
      loadDoDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditDoDung = (dd) => {
    setEditingDoDung(dd);
    setDoDungForm({
      id_phan_loai: dd.id_phan_loai ? String(dd.id_phan_loai) : '',
      ten_vat_dung: dd.ten_vat_dung || '',
      so_luong: dd.so_luong || 1,
      tinh_trang: dd.tinh_trang || 'tot',
      ghi_chu: dd.ghi_chu || '',
      nguon_cung_cap: dd.nguon_cung_cap || 'ca_nhan',
      media: dd.media || '',
    });
    setDoDungTab(dd.nguon_cung_cap || 'ca_nhan'); // Set tab theo nguon_cung_cap
    setShowDoDungModal(true);
  };

  const handleDeleteDoDung = async (ddId) => {
    if (!confirm('Bạn có chắc muốn xóa vật dụng này?')) return;
    try {
      await doDungAPI.delete(ddId);
      alert('Xóa vật dụng thành công');
      loadDoDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetDoDungForm = () => {
    setDoDungForm({
      id_phan_loai: '',
      ten_vat_dung: '',
      so_luong: 1,
      tinh_trang: 'tot',
      ghi_chu: '',
      nguon_cung_cap: 'ca_nhan',
      media: '',
    });
    setDoDungTab('ca_nhan'); // Reset về tab Cá nhân
    setEditingDoDung(null);
  };

  // Dich vu handlers
  const handleDichVuSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới hoặc đổi dịch vụ và bệnh nhân đã xuất viện
    if ((!editingDichVu || isDoiDichVu) && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      const data = {
        id_benh_nhan: id,
        id_dich_vu: dichVuForm.id_dich_vu,
        ngay_bat_dau: dichVuForm.ngay_bat_dau,
        ngay_ket_thuc: dichVuForm.ngay_ket_thuc || null,
        hinh_thuc_thanh_toan: dichVuForm.hinh_thuc_thanh_toan,
        trang_thai: dichVuForm.trang_thai
      };

      if (isDoiDichVu && dichVuCuId) {
        // Đổi dịch vụ: cập nhật ngày kết thúc của dịch vụ cũ
        const ngayDoi = getTodayVN();
        await benhNhanDichVuAPI.update(dichVuCuId, {
          ngay_ket_thuc: ngayDoi,
          trang_thai: 'ket_thuc'
        });
        
        // Tạo dịch vụ mới
        data.ngay_bat_dau = ngayDoi;
        await benhNhanDichVuAPI.create(data);
        alert('Đổi dịch vụ thành công');
      } else if (editingDichVu) {
        // Sửa dịch vụ
        await benhNhanDichVuAPI.update(editingDichVu.id, data);
        alert('Cập nhật dịch vụ thành công');
      } else {
        // Thêm dịch vụ mới
        await benhNhanDichVuAPI.create(data);
        alert('Thêm dịch vụ thành công');
      }
      
      setShowDichVuModal(false);
      resetDichVuForm();
      loadBenhNhanDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditDichVu = (dv) => {
    setDichVuForm({
      id_dich_vu: dv.id_dich_vu,
      ngay_bat_dau: dv.ngay_bat_dau || getTodayVN(),
      ngay_ket_thuc: dv.ngay_ket_thuc || '',
      hinh_thuc_thanh_toan: dv.hinh_thuc_thanh_toan || 'thang',
      trang_thai: dv.trang_thai || 'dang_su_dung'
    });
    
    setEditingDichVu(dv);
    setIsDoiDichVu(false);
    setDichVuCuId(null);
    setShowDichVuModal(true);
  };

  const handleDoiDichVu = (dv) => {
    setDichVuForm({
      id_dich_vu: '',
      ngay_bat_dau: getTodayVN(),
      ngay_ket_thuc: '',
      hinh_thuc_thanh_toan: 'thang',
      trang_thai: 'dang_su_dung'
    });
    setEditingDichVu(null);
    setIsDoiDichVu(true);
    setDichVuCuId(dv.id);
    setShowDichVuModal(true);
  };

  const handleDeleteDichVu = async (dvId) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await benhNhanDichVuAPI.delete(dvId);
      alert('Xóa dịch vụ thành công');
      loadBenhNhanDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };


  const resetDichVuForm = () => {
    setDichVuForm({
      id_dich_vu: '',
      ngay_bat_dau: getTodayVN(),
      ngay_ket_thuc: '',
      hinh_thuc_thanh_toan: 'thang',
      trang_thai: 'dang_su_dung'
    });
    setEditingDichVu(null);
    setIsDoiDichVu(false);
    setDichVuCuId(null);
  };

  // Ho so y te handlers
  const handleHoSoYTeSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang tạo mới và bệnh nhân đã xuất viện
    if (!hoSoYTe && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      const data = {
        ...hoSoYTeForm,
        id_loai_benh_ly: hoSoYTeForm.id_loai_benh_ly ? parseInt(hoSoYTeForm.id_loai_benh_ly) : null,
      };
      await benhNhanAPI.createOrUpdateHoSoYTe(id, data);
      alert('Lưu hồ sơ y tế thành công');
      setShowHoSoYTeModal(false);
      loadHoSoYTe();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetHoSoYTeForm = () => {
    setHoSoYTeForm({
      id_loai_benh_ly: '',
      tien_su_benh: '',
      di_ung_thuoc: '',
      lich_su_phau_thuat: '',
      benh_ly_hien_tai: '',
      ghi_chu_dac_biet: '',
    });
  };

  // Benh hien tai handlers
  const handleBenhHienTaiSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingBenhHienTai && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      const data = {
        ...benhHienTaiForm,
        id_thong_tin_benh: benhHienTaiForm.id_thong_tin_benh ? parseInt(benhHienTaiForm.id_thong_tin_benh) : null,
      };
      if (editingBenhHienTai) {
        await benhNhanAPI.updateBenhHienTai(editingBenhHienTai.id, data);
        alert('Cập nhật bệnh hiện tại thành công');
      } else {
        await benhNhanAPI.createBenhHienTai(id, data);
        alert('Thêm bệnh hiện tại thành công');
      }
      setShowBenhHienTaiModal(false);
      resetBenhHienTaiForm();
      loadBenhHienTai();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditBenhHienTai = (bh) => {
    setEditingBenhHienTai(bh);
    setBenhHienTaiForm({
      id_thong_tin_benh: bh.id_thong_tin_benh ? String(bh.id_thong_tin_benh) : '',
      ngay_phat_hien: bh.ngay_phat_hien ? formatDateForInput(bh.ngay_phat_hien) : getTodayVN(),
      tinh_trang: bh.tinh_trang || 'dang_dieu_tri',
      ghi_chu: bh.ghi_chu || '',
    });
    setShowBenhHienTaiModal(true);
  };

  const handleDeleteBenhHienTai = async (bhId) => {
    if (!confirm('Bạn có chắc muốn xóa bệnh hiện tại này?')) return;
    try {
      await benhNhanAPI.deleteBenhHienTai(bhId);
      alert('Xóa bệnh hiện tại thành công');
      loadBenhHienTai();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetBenhHienTaiForm = () => {
    setBenhHienTaiForm({
      id_thong_tin_benh: '',
      ngay_phat_hien: getTodayVN(),
      tinh_trang: 'dang_dieu_tri',
      ghi_chu: '',
    });
    setEditingBenhHienTai(null);
  };

  // Tam ly giao tiep handlers
  const handleTamLyGiaoTiepSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingTamLyGiaoTiep && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Convert datetime-local format to MySQL format before submitting
      const submitData = {
        ...tamLyGiaoTiepForm,
        thoi_gian: tamLyGiaoTiepForm.thoi_gian ? toISOStringVN(tamLyGiaoTiepForm.thoi_gian) : '',
      };
      
      if (editingTamLyGiaoTiep) {
        await benhNhanAPI.updateTamLyGiaoTiep(editingTamLyGiaoTiep.id, submitData);
        alert('Cập nhật tâm lý giao tiếp thành công');
      } else {
        await benhNhanAPI.createTamLyGiaoTiep(id, submitData);
        alert('Thêm tâm lý giao tiếp thành công');
      }
      setShowTamLyGiaoTiepModal(false);
      resetTamLyGiaoTiepForm();
      loadTamLyGiaoTiep();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditTamLyGiaoTiep = (tlg) => {
    setEditingTamLyGiaoTiep(tlg);
    setTamLyGiaoTiepForm({
      trang_thai_tinh_than: tlg.trang_thai_tinh_than || 'binh_thuong',
      nhan_thuc_nguoi_than: tlg.nhan_thuc_nguoi_than || false,
      nhan_thuc_dieu_duong: tlg.nhan_thuc_dieu_duong || false,
      biet_thoi_gian: tlg.biet_thoi_gian || false,
      muc_do_tuong_tac: tlg.muc_do_tuong_tac || 'phan_hoi',
      ghi_chu: tlg.ghi_chu || '',
      thoi_gian: tlg.thoi_gian ? formatDateTimeForInput(tlg.thoi_gian) : formatDateTimeForInput(getVNNow()),
    });
    setShowTamLyGiaoTiepModal(true);
  };

  const handleDeleteTamLyGiaoTiep = async (tlgId) => {
    if (!confirm('Bạn có chắc muốn xóa ghi chú tâm lý này?')) return;
    try {
      await benhNhanAPI.deleteTamLyGiaoTiep(tlgId);
      alert('Xóa tâm lý giao tiếp thành công');
      loadTamLyGiaoTiep();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetTamLyGiaoTiepForm = () => {
    setTamLyGiaoTiepForm({
      trang_thai_tinh_than: 'binh_thuong',
      nhan_thuc_nguoi_than: false,
      nhan_thuc_dieu_duong: false,
      biet_thoi_gian: false,
      muc_do_tuong_tac: 'phan_hoi',
      ghi_chu: '',
      thoi_gian: formatDateTimeForInput(getVNNow()),
    });
    setEditingTamLyGiaoTiep(null);
  };

  // Van dong phuc hoi handlers
  const handleEditVanDongPhucHoi = (vdph) => {
    setEditingVanDongPhucHoi(vdph);
    setVanDongPhucHoiForm({
      kha_nang_van_dong: vdph.kha_nang_van_dong || 'doc_lap',
      loai_bai_tap: vdph.loai_bai_tap || '',
      thoi_gian_bat_dau: vdph.thoi_gian_bat_dau ? formatDateTimeForInput(vdph.thoi_gian_bat_dau) : formatDateTimeForInput(getVNNow()),
      thoi_luong_phut: vdph.thoi_luong_phut ? String(vdph.thoi_luong_phut) : '',
      cuong_do: vdph.cuong_do || 'trung_binh',
      calo_tieu_hao: vdph.calo_tieu_hao ? String(vdph.calo_tieu_hao) : '',
      ghi_chu: vdph.ghi_chu || '',
    });
    setShowVanDongPhucHoiModal(true);
  };

  const handleDeleteVanDongPhucHoi = async (vdphId) => {
    if (!confirm('Bạn có chắc muốn xóa vận động phục hồi này?')) return;
    try {
      await benhNhanAPI.deleteVanDongPhucHoi(vdphId);
      alert('Xóa vận động phục hồi thành công');
      loadVanDongPhucHoi();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetVanDongPhucHoiForm = () => {
    setVanDongPhucHoiForm({
      kha_nang_van_dong: 'doc_lap',
      loai_bai_tap: '',
      thoi_gian_bat_dau: formatDateTimeForInput(getVNNow()),
      thoi_luong_phut: '',
      cuong_do: 'trung_binh',
      calo_tieu_hao: '',
      ghi_chu: '',
    });
    setEditingVanDongPhucHoi(null);
  };

  // Handlers for Trieu chung
  const handleTrieuChungSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingTrieuChung && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      if (!trieuChungForm.id_trieu_chung) {
        alert('Vui lòng chọn triệu chứng');
        return;
      }

      const submitData = {
        id_trieu_chung: parseInt(trieuChungForm.id_trieu_chung),
        id_benh_nhan: parseInt(id),
        ngay_gio_xay_ra: toISOStringVN(trieuChungForm.ngay_gio_xay_ra),
      };

      if (editingTrieuChung) {
        await trieuChungBenhNhanAPI.update(editingTrieuChung.id, submitData);
        alert('Cập nhật triệu chứng thành công');
      } else {
        await trieuChungBenhNhanAPI.create(submitData);
        alert('Thêm triệu chứng thành công');
      }
      setShowTrieuChungModal(false);
      setEditingTrieuChung(null);
      resetTrieuChungForm();
      loadTrieuChungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditTrieuChung = (tc) => {
    setEditingTrieuChung(tc);
    setTrieuChungForm({
      id_trieu_chung: tc.id_trieu_chung?.toString() || '',
      ngay_gio_xay_ra: tc.ngay_gio_xay_ra ? formatDateTimeForInput(tc.ngay_gio_xay_ra) : formatDateTimeForInput(new Date()),
    });
    setShowTrieuChungModal(true);
  };

  const handleDeleteTrieuChung = async (tcId) => {
    if (!confirm('Bạn có chắc muốn xóa triệu chứng này?')) return;
    try {
      await trieuChungBenhNhanAPI.delete(tcId);
      alert('Xóa triệu chứng thành công');
      loadTrieuChungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetTrieuChungForm = () => {
    setTrieuChungForm({
      id_trieu_chung: '',
      ngay_gio_xay_ra: formatDateTimeForInput(new Date()),
    });
    setEditingTrieuChung(null);
  };

  const handleVanDongPhucHoiSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra nếu đang thêm mới và bệnh nhân đã xuất viện
    if (!editingVanDongPhucHoi && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể thêm dữ liệu mới');
      return;
    }
    try {
      // Convert datetime-local format to MySQL format before submitting
      const data = {
        ...vanDongPhucHoiForm,
        thoi_gian_bat_dau: vanDongPhucHoiForm.thoi_gian_bat_dau ? toISOStringVN(vanDongPhucHoiForm.thoi_gian_bat_dau) : '',
        thoi_luong_phut: vanDongPhucHoiForm.thoi_luong_phut ? parseInt(vanDongPhucHoiForm.thoi_luong_phut) : null,
        calo_tieu_hao: vanDongPhucHoiForm.calo_tieu_hao ? parseInt(vanDongPhucHoiForm.calo_tieu_hao) : null,
      };
      if (editingVanDongPhucHoi) {
        await benhNhanAPI.updateVanDongPhucHoi(editingVanDongPhucHoi.id, data);
        alert('Cập nhật vận động phục hồi thành công');
      } else {
        await benhNhanAPI.createVanDongPhucHoi(id, data);
        alert('Thêm vận động phục hồi thành công');
      }
      setShowVanDongPhucHoiModal(false);
      resetVanDongPhucHoiForm();
      loadVanDongPhucHoi();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Phong handlers
  const handlePhongSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nếu bệnh nhân đã xuất viện
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể phân phòng hoặc đổi phòng');
      return;
    }
    
    try {
      // Nếu chọn từ dropdown (id_phong), lấy thông tin từ phòng đó
      let data = { ...phongForm };
      
      if (selectedPhong) {
        // Lấy thông tin từ phòng đã chọn (so sánh type-safe)
        const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
        const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
        
        console.log('Finding phong:', { selectedPhong, phongId, phongs: phongs.length, phongInfo }); // Debug
        
        if (phongInfo) {
          // Lấy tên khu từ phanKhus nếu không có trong phongInfo
          const phanKhuInfo = phanKhus.find(pk => pk.id === selectedPhanKhu);
          
          // Đảm bảo có giá trị cho khu
          data.khu = phongInfo.ten_khu || phanKhuInfo?.ten_khu || '';
          if (!data.khu && selectedPhanKhu) {
            // Nếu vẫn không có, load lại từ API
            const pkInfo = phanKhus.find(pk => pk.id === selectedPhanKhu);
            data.khu = pkInfo?.ten_khu || '';
          }
          
          // Đảm bảo có giá trị cho phong
          data.phong = phongInfo.so_phong || phongInfo.ten_phong || String(phongInfo.id);
          if (!data.phong || data.phong.trim() === '') {
            data.phong = phongInfo.ten_phong || `Phòng ${phongInfo.id}`;
          }
          
          console.log('Preparing data:', { 
            phongInfo, 
            phanKhuInfo, 
            selectedPhanKhu,
            khu: data.khu, 
            phong: data.phong 
          }); // Debug
          
          // Kiểm tra số người tối đa
          const currentCount = phongInfo.benh_nhans?.length || 0;
          const maxCapacity = phongInfo.so_nguoi_toi_da || 1;
          
          if (currentCount >= maxCapacity) {
            alert(`Phòng đã đầy! Số người hiện tại: ${currentCount}/${maxCapacity}. Không thể thêm bệnh nhân vào phòng này.`);
            return;
          }

          // Cập nhật trạng thái phòng thành 'co_nguoi'
          try {
            await phongNewAPI.update(selectedPhong, { trang_thai: 'co_nguoi' });
          } catch (error) {
            console.error('Error updating room status:', error);
          }
        } else {
          console.error('Phong not found:', selectedPhong, phongs);
          alert('Không tìm thấy thông tin phòng. Vui lòng thử lại.');
          return;
        }
      }

      // Validation: Phải có khu và phong (không được rỗng)
      if (!data.khu || data.khu.trim() === '' || !data.phong || data.phong.trim() === '') {
        console.error('Validation failed:', { 
          khu: data.khu, 
          phong: data.phong, 
          selectedPhong, 
          phongForm,
          phongs,
          phanKhus 
        }); // Debug
        alert('Vui lòng chọn phòng từ hệ thống hoặc nhập thông tin khu và phòng đầy đủ');
        return;
      }

      // Tạo phòng mới với id_phong (backend sẽ tự động kết thúc phòng cũ nếu có)
      if (selectedPhong) {
        const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
        const createData = {
          id_benh_nhan: id,
          id_phong: phongId,
          ngay_bat_dau_o: getTodayVN(),
          ngay_ket_thuc_o: null
        };
        
        try {
          await phongAPI.create(createData);
          alert(phong ? 'Đổi phòng thành công' : 'Phân phòng thành công');
        } catch (error) {
          console.error('Error creating new room:', error);
          alert('Lỗi: ' + error.message);
          return;
        }
      } else {
        // Fallback: sử dụng cách cũ nếu không có selectedPhong
        data.id_benh_nhan = id;
        delete data.id_phan_khu;
        delete data.id_phong;
        
        if (phong && phong.id) {
          await phongAPI.update(phong.id, data);
          alert('Cập nhật phòng thành công');
        } else {
          await phongAPI.create(data);
          alert('Phân phòng thành công');
        }
      }
      setShowPhongModal(false);
      resetPhongForm();
      // Reload lại thông tin bệnh nhân để cập nhật UI
      await loadBenhNhanDetail();
      loadPhong();
      loadAllPhongs();
      // Thông báo cho các component khác (như QuanLyPhongPage) cần reload
      window.dispatchEvent(new CustomEvent('phongUpdated'));
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePhanKhuChange = (idPhanKhu) => {
    setSelectedPhanKhu(idPhanKhu);
    setPhongForm({ ...phongForm, id_phan_khu: idPhanKhu, id_phong: '' });
    setSelectedPhong(null);
    loadPhongs(idPhanKhu);
  };

  const handlePhongChange = (idPhong) => {
    const phongId = typeof idPhong === 'string' ? parseInt(idPhong) : idPhong;
    setSelectedPhong(phongId);
    
    // Tìm phòng với so sánh type-safe
    const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
    
    console.log('handlePhongChange:', { 
      idPhong, 
      phongId, 
      phongs: phongs.map(p => ({ id: p.id, ten_phong: p.ten_phong })),
      phongInfo 
    }); // Debug
    
    if (phongInfo) {
      // Lấy tên khu từ phanKhus nếu không có trong phongInfo
      const phanKhuInfo = phanKhus.find(pk => pk.id === selectedPhanKhu || pk.id === parseInt(selectedPhanKhu));
      const khuValue = phongInfo.ten_khu || phanKhuInfo?.ten_khu || '';
      const phongValue = phongInfo.so_phong || phongInfo.ten_phong || String(phongInfo.id);
      
      setPhongForm({
        ...phongForm,
        id_phong: phongId,
        id_phan_khu: selectedPhanKhu,
        khu: khuValue,
        phong: phongValue,
        giuong: phongInfo.so_giuong ? `1` : '', // Default to giuong 1 if available
      });
      
      console.log('Phong selected:', { phongInfo, khuValue, phongValue }); // Debug
    } else {
      console.error('Phong not found in phongs array:', { idPhong, phongId, phongs });
      alert('Không tìm thấy thông tin phòng. Vui lòng thử lại.');
    }
  };

  const resetPhongForm = () => {
    setPhongForm({
      id_phan_khu: '',
      id_phong: '',
      khu: '',
      phong: '',
      giuong: '',
    });
    setSelectedPhanKhu('');
    setSelectedPhong(null);
    setPhongs([]);
  };

  // Xóa phòng của bệnh nhân
  const handleXoaPhong = async () => {
    if (!phong) return;
    
    if (!confirm('Bạn có chắc chắn muốn xóa bệnh nhân khỏi phòng này?')) {
      return;
    }

    try {
      await phongAPI.delete(phong.id);
      alert('Xóa bệnh nhân khỏi phòng thành công');
      setPhong(null);
      // Reload lại thông tin bệnh nhân để cập nhật UI
      await loadBenhNhanDetail();
      loadPhong();
      loadAllPhongs();
      // Thông báo cho các component khác (như QuanLyPhongPage) cần reload
      window.dispatchEvent(new CustomEvent('phongUpdated'));
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  // Load phân khu và phòng khi mở modal
  const handleOpenPhongModal = () => {
    // Kiểm tra nếu bệnh nhân đã xuất viện
    if (benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện') {
      alert('Bệnh nhân đã xuất viện, không thể phân phòng hoặc đổi phòng');
      return;
    }
    
    loadPhanKhus();
    if (phong) {
      // Nếu đã có phòng, tìm phân khu và phòng tương ứng
      // Note: Có thể cần cải thiện logic này nếu có id_phong trong phong_o_benh_nhan
      setPhongForm({
        id_phan_khu: '',
        id_phong: '',
        khu: phong.khu || '',
        phong: phong.phong || '',
        giuong: phong.giuong || '',
      });
    }
    setShowPhongModal(true);
  };

  // Delete handlers
  const handleDeleteDonThuoc = async (donId) => {
    if (!confirm('Bạn có chắc muốn xóa đơn thuốc này?')) return;
    try {
      await thuocAPI.delete(donId);
      alert('Xóa đơn thuốc thành công');
      loadDonThuocs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };


  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  if (!benhNhan) {
    return <div className="text-center py-8 text-red-500">Không tìm thấy bệnh nhân</div>;
  }

  // Xử lý khi chọn tab - tự động mở sidebar group tương ứng
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // Tự động mở sidebar group chứa tab được chọn
    for (const group of tabGroups) {
      if (group.tabs.some(tab => tab.id === tabId)) {
        setActiveTabGroup(group.id);
        break;
      }
    }
    // Trên mobile, đóng sidebar sau khi chọn tab
    if (window.innerWidth < 1024) {
      setTimeout(() => setIsSidebarOpen(false), 300);
    }
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border font-raleway" style={{ width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
      <div className="space-y-6 p-6 lg:p-8 max-w-full" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <button
              onClick={() => navigate('/admin/benh-nhan')}
              className="flex items-center gap-2 text-[#4A90E2] hover:text-[#4A90E2]/80 mb-3 font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
              <span>Quay lại</span>
            </button>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {benhNhan.ho_ten?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">{benhNhan.ho_ten}</h1>
                <p className="text-gray-600 text-sm mt-1">Mã BN: {benhNhan.id}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {phong ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-[#4A90E2] rounded-lg font-medium text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                    Phòng: {phong.khu}-{phong.phong}-{phong.giuong}
                  </span>
                  <button
                    onClick={handleOpenPhongModal}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                    <span>Đổi phòng</span>
                  </button>
                  <button
                    onClick={handleXoaPhong}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                    <span>Xóa phòng</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenPhongModal}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Phân phòng</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex gap-4 w-full relative" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
          {/* Sidebar Toggle Button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-20 left-4 z-40 bg-[#4A90E2] text-white p-2 rounded-lg shadow-lg hover:bg-[#4A90E2]/90 transition-colors"
            title={isSidebarOpen ? 'Ẩn menu' : 'Hiện menu'}
          >
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
              {isSidebarOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Sidebar Overlay (Mobile) */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`${
            isSidebarOpen 
              ? 'w-64' 
              : 'w-0'
          } transition-all duration-300 overflow-hidden flex-shrink-0`}>
            <div className={`bg-white rounded-xl border border-gray-200 shadow-lg lg:shadow-sm overflow-y-auto ${
              isSidebarOpen 
                ? 'block fixed lg:relative top-20 lg:top-auto left-0 lg:left-auto z-40 lg:z-auto' 
                : 'hidden'
            }`} style={{ 
              maxHeight: 'calc(100vh - 200px)',
              height: 'calc(100vh - 100px)',
              width: '256px'
            }}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm">Danh mục</h3>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors lg:block hidden"
                  title={isSidebarOpen ? 'Thu gọn' : 'Mở rộng'}
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
                  </span>
                </button>
              </div>
              <nav className="p-2">
                {tabGroups.map((group) => (
                  <div key={group.id} className="mb-2">
                    <button
                      onClick={() => setActiveTabGroup(activeTabGroup === group.id ? null : group.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        activeTabGroup === group.id
                          ? 'bg-[#4A90E2]/10 text-[#4A90E2]'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                          {group.icon}
                        </span>
                        <span>{group.label}</span>
                      </div>
                      <span className="material-symbols-outlined text-base transition-transform" style={{ 
                        fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        transform: activeTabGroup === group.id ? 'rotate(90deg)' : 'rotate(0deg)'
                      }}>
                        chevron_right
                      </span>
                    </button>
                    {activeTabGroup === group.id && (
                      <div className="mt-1 ml-4 space-y-1">
                        {group.tabs.map((tab) => (
                <button
                  key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                                ? 'bg-[#4A90E2] text-white font-semibold'
                                : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {tab.icon}
                  </span>
                            <span>{tab.label}</span>
                </button>
                        ))}
                      </div>
                    )}
                  </div>
              ))}
            </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
              {/* Tab Header */}
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl text-[#4A90E2]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {tabGroups.find(g => g.tabs.some(t => t.id === activeTab))?.tabs.find(t => t.id === activeTab)?.icon || 'info'}
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {tabGroups.find(g => g.tabs.some(t => t.id === activeTab))?.tabs.find(t => t.id === activeTab)?.label || 'Thông tin'}
                  </h2>
                </div>
          </div>

        <div className="p-6 lg:p-8">
          {/* Tab: Thông tin */}
          {activeTab === 'thong-tin' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Code Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Mã QR Bệnh nhân</h3>
                {qrCode ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      {/* Hiển thị QR code - sử dụng API QR code generator hoặc hiển thị URL */}
                      <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
                        {qrCode.url_qr ? (
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode.url_qr)}`}
                            alt="QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-center text-gray-400">
                            <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                              qr_code
                            </span>
                            <p className="text-sm mt-2">QR Code</p>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 mb-1">Mã QR:</p>
                        <p className="text-xs text-gray-600 font-mono break-all">{qrCode.ma_qr}</p>
                        {qrCode.url_qr && (
                          <p className="text-xs text-gray-500 mt-2 break-all">{qrCode.url_qr}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRegenerateQRCode}
                        disabled={loadingQR || benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingQR ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>Đang tạo...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>refresh</span>
                            <span>Tạo QR mới</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (qrCode.url_qr) {
                            window.open(qrCode.url_qr, '_blank');
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>open_in_new</span>
                        <span>Mở link</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <span className="material-symbols-outlined text-6xl text-gray-400 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        qr_code_2
                      </span>
                      <p className="text-gray-600 text-sm mb-4">Bệnh nhân chưa có mã QR</p>
                    </div>
                    <button
                      onClick={handleCreateQRCode}
                      disabled={loadingQR || benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingQR ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          <span>Đang tạo...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                          <span>Tạo mã QR</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin cá nhân</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Họ tên</dt>
                    <dd className="text-gray-900 font-semibold">{benhNhan.ho_ten}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Ngày sinh</dt>
                    <dd className="text-gray-900">
                      {benhNhan.ngay_sinh ? formatDateVN(benhNhan.ngay_sinh) : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Giới tính</dt>
                    <dd className="text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                        {benhNhan.gioi_tinh}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">CCCD</dt>
                    <dd className="text-gray-900">{benhNhan.cccd || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Địa chỉ</dt>
                    <dd className="text-gray-900">{benhNhan.dia_chi || '-'}</dd>
                  </div>
                </dl>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-5 pb-3 border-b border-gray-200">Thông tin y tế</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Nhóm máu</dt>
                    <dd className="text-gray-900">{benhNhan.nhom_mau || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">BHYT</dt>
                    <dd className="text-gray-900">{benhNhan.bhyt || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Khả năng sinh hoạt</dt>
                    <dd className="text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {benhNhan.kha_nang_sinh_hoat?.replace('_', ' ')}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Ngày nhập viện</dt>
                    <dd className="text-gray-900">
                      {benhNhan.ngay_nhap_vien ? formatDateVN(benhNhan.ngay_nhap_vien) : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Tab: Huyết áp */}
          {activeTab === 'huyet-ap' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Huyết áp</h3>
                <button
                  onClick={() => {
                    resetHuyetApForm();
                    setShowHuyetApModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm huyết áp</span>
                </button>
              </div>
              {huyetAp.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu huyết áp</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm huyết áp" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tâm thu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tâm trương</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Đánh giá</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí đo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tư thế</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {huyetAp.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.thoi_gian_do ? formatDateTimeVN(item.thoi_gian_do) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.tam_thu || '-'} mmHg</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.tam_truong || '-'} mmHg</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.danh_gia_chi_tiet ? formatDanhGia(item.danh_gia_chi_tiet) : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vi_tri_do ? item.vi_tri_do.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tu_the_khi_do || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.muc_do === 'nguy_hiem' ? 'bg-red-100 text-red-800' :
                                item.muc_do === 'canh_bao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatDanhGia(item.muc_do)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditHuyetAp(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteHuyetAp(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination for Huyet Ap */}
                  {huyetApPagination.totalItems > 0 && (
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                          <select
                            value={huyetApPagination.itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange('huyetAp', parseInt(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">
                            / Tổng: {huyetApPagination.totalItems} bản ghi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange('huyetAp', huyetApPagination.currentPage - 1)}
                            disabled={huyetApPagination.currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              huyetApPagination.currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                          </button>
                          {getPageNumbers(huyetApPagination.totalPages, huyetApPagination.currentPage).map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange('huyetAp', page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : page === huyetApPagination.currentPage
                                  ? 'bg-[#4A90E2] text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange('huyetAp', huyetApPagination.currentPage + 1)}
                            disabled={huyetApPagination.currentPage === huyetApPagination.totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              huyetApPagination.currentPage === huyetApPagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab: Nhịp tim */}
          {activeTab === 'nhip-tim' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Nhịp tim</h3>
                <button
                  onClick={() => {
                    resetNhipTimForm();
                    setShowNhipTimModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm nhịp tim</span>
                </button>
              </div>
              {nhipTim.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>favorite</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu nhịp tim</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm nhịp tim" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giá trị (bpm)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Đánh giá</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tình trạng bệnh nhân</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {nhipTim.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.thoi_gian_do ? formatDateTimeVN(item.thoi_gian_do) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.gia_tri_nhip_tim || '-'} bpm</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.danh_gia_chi_tiet ? formatDanhGia(item.danh_gia_chi_tiet) : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tinh_trang_benh_nhan_khi_do ? item.tinh_trang_benh_nhan_khi_do.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.muc_do === 'nguy_hiem' ? 'bg-red-100 text-red-800' :
                                item.muc_do === 'canh_bao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatDanhGia(item.muc_do)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditNhipTim(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteNhipTim(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination for Nhip Tim */}
                  {nhipTimPagination.totalItems > 0 && (
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                          <select
                            value={nhipTimPagination.itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange('nhipTim', parseInt(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">
                            / Tổng: {nhipTimPagination.totalItems} bản ghi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange('nhipTim', nhipTimPagination.currentPage - 1)}
                            disabled={nhipTimPagination.currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              nhipTimPagination.currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                          </button>
                          {getPageNumbers(nhipTimPagination.totalPages, nhipTimPagination.currentPage).map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange('nhipTim', page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : page === nhipTimPagination.currentPage
                                  ? 'bg-[#4A90E2] text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange('nhipTim', nhipTimPagination.currentPage + 1)}
                            disabled={nhipTimPagination.currentPage === nhipTimPagination.totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              nhipTimPagination.currentPage === nhipTimPagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab: Đường huyết */}
          {activeTab === 'duong-huyet' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Đường huyết</h3>
                <button
                  onClick={() => {
                    resetDuongHuyetForm();
                    setShowDuongHuyetModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm đường huyết</span>
                </button>
              </div>
              {duongHuyet.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bloodtype</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu đường huyết</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm đường huyết" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giá trị (mmol/L)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Đánh giá</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí lấy mẫu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {duongHuyet.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.thoi_gian_do ? formatDateTimeVN(item.thoi_gian_do) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.gia_tri_duong_huyet || '-'} mmol/L</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.danh_gia_chi_tiet ? formatDanhGia(item.danh_gia_chi_tiet) : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vi_tri_lay_mau ? item.vi_tri_lay_mau.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.muc_do === 'nguy_hiem' ? 'bg-red-100 text-red-800' :
                                item.muc_do === 'canh_bao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatDanhGia(item.muc_do)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditDuongHuyet(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteDuongHuyet(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination for Duong Huyet */}
                  {duongHuyetPagination.totalItems > 0 && (
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                          <select
                            value={duongHuyetPagination.itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange('duongHuyet', parseInt(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">
                            / Tổng: {duongHuyetPagination.totalItems} bản ghi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange('duongHuyet', duongHuyetPagination.currentPage - 1)}
                            disabled={duongHuyetPagination.currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              duongHuyetPagination.currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                          </button>
                          {getPageNumbers(duongHuyetPagination.totalPages, duongHuyetPagination.currentPage).map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange('duongHuyet', page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : page === duongHuyetPagination.currentPage
                                  ? 'bg-[#4A90E2] text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange('duongHuyet', duongHuyetPagination.currentPage + 1)}
                            disabled={duongHuyetPagination.currentPage === duongHuyetPagination.totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              duongHuyetPagination.currentPage === duongHuyetPagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab: SpO2 */}
          {activeTab === 'spo2' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">SpO2</h3>
                <button
                  onClick={() => {
                    resetSpo2Form();
                    setShowSpo2Modal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm SpO2</span>
                </button>
              </div>
              {spo2.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>air</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu SpO2</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm SpO2" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giá trị (%)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí đo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tình trạng hô hấp</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {spo2.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.thoi_gian_do ? formatDateTimeVN(item.thoi_gian_do) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.gia_tri_spo2 || '-'}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vi_tri_do ? item.vi_tri_do.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tinh_trang_ho_hap ? item.tinh_trang_ho_hap.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.muc_do === 'nguy_hiem' ? 'bg-red-100 text-red-800' :
                                item.muc_do === 'canh_bao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatDanhGia(item.muc_do)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditSpo2(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteSpo2(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination for SpO2 */}
                  {spo2Pagination.totalItems > 0 && (
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                          <select
                            value={spo2Pagination.itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange('spo2', parseInt(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">
                            / Tổng: {spo2Pagination.totalItems} bản ghi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange('spo2', spo2Pagination.currentPage - 1)}
                            disabled={spo2Pagination.currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              spo2Pagination.currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                          </button>
                          {getPageNumbers(spo2Pagination.totalPages, spo2Pagination.currentPage).map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange('spo2', page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : page === spo2Pagination.currentPage
                                  ? 'bg-[#4A90E2] text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange('spo2', spo2Pagination.currentPage + 1)}
                            disabled={spo2Pagination.currentPage === spo2Pagination.totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              spo2Pagination.currentPage === spo2Pagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab: Nhiệt độ */}
          {activeTab === 'nhiet-do' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Nhiệt độ</h3>
                <button
                  onClick={() => {
                    resetNhietDoForm();
                    setShowNhietDoModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm nhiệt độ</span>
                </button>
              </div>
              {nhietDo.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>thermostat</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu nhiệt độ</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm nhiệt độ" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giá trị (°C)</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Đánh giá</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí đo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tình trạng lúc đo</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mức độ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {nhietDo.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.thoi_gian_do ? formatDateTimeVN(item.thoi_gian_do) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.gia_tri_nhiet_do || '-'}°C</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.danh_gia_chi_tiet ? formatDanhGia(item.danh_gia_chi_tiet) : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vi_tri_do ? item.vi_tri_do.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tinh_trang_luc_do ? item.tinh_trang_luc_do.replace('_', ' ') : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.muc_do === 'nguy_hiem' ? 'bg-red-100 text-red-800' :
                                item.muc_do === 'canh_bao' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatDanhGia(item.muc_do)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditNhietDo(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteNhietDo(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination for Nhiet Do */}
                  {nhietDoPagination.totalItems > 0 && (
                    <div className="bg-white border-t border-gray-200 p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                          <select
                            value={nhietDoPagination.itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange('nhietDo', parseInt(e.target.value))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                          </select>
                          <span className="text-sm text-gray-600">
                            / Tổng: {nhietDoPagination.totalItems} bản ghi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePageChange('nhietDo', nhietDoPagination.currentPage - 1)}
                            disabled={nhietDoPagination.currentPage === 1}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              nhietDoPagination.currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                          </button>
                          {getPageNumbers(nhietDoPagination.totalPages, nhietDoPagination.currentPage).map((page, index) => (
                            <button
                              key={index}
                              onClick={() => typeof page === 'number' && handlePageChange('nhietDo', page)}
                              disabled={page === '...'}
                              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                page === '...'
                                  ? 'bg-transparent text-gray-400 cursor-default'
                                  : page === nhietDoPagination.currentPage
                                  ? 'bg-[#4A90E2] text-white'
                                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange('nhietDo', nhietDoPagination.currentPage + 1)}
                            disabled={nhietDoPagination.currentPage === nhietDoPagination.totalPages}
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                              nhietDoPagination.currentPage === nhietDoPagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab: Triệu chứng */}
          {activeTab === 'trieu-chung' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Triệu chứng</h3>
                <button
                  onClick={() => {
                    resetTrieuChungForm();
                    setShowTrieuChungModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm triệu chứng</span>
                </button>
              </div>
              {trieuChungs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sick</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu triệu chứng</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm triệu chứng" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thời gian</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Triệu chứng</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {trieuChungs.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.ngay_tao ? formatDateTimeVN(item.ngay_tao) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.ten_trieu_chung || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditTrieuChung(item)}
                                  className="text-blue-600 hover:text-blue-900 text-sm"
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteTrieuChung(item.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Đơn thuốc */}
          {activeTab === 'thuoc' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Đơn thuốc</h3>
                <button
                  onClick={() => {
                    resetThuocForm();
                    setShowThuocModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm đơn thuốc</span>
                </button>
              </div>
              {donThuocs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medication</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có đơn thuốc</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm đơn thuốc" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donThuocs.map((don) => (
                    <div key={don.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900">Ngày kê: {formatDateVN(don.ngay_ke)}</p>
                          {don.mo_ta && <p className="text-sm text-gray-600 mt-1">{don.mo_ta}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteDonThuoc(don.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          <span>Xóa</span>
                        </button>
                      </div>
                      {don.thuoc && don.thuoc.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {don.thuoc.map((thuoc, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-200">
                              <span className="font-semibold text-gray-900">{thuoc.ten_thuoc}</span> - <span className="text-gray-700">{thuoc.lieu_luong}</span> - <span className="text-gray-700">{thuoc.thoi_diem_uong}</span>
                              {thuoc.ghi_chu && <span className="text-gray-600 ml-2">({thuoc.ghi_chu})</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {/* Tab: Công việc */}
          {activeTab === 'cong-viec' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Công việc chăm sóc</h3>
                <button
                  onClick={() => {
                    resetCongViecForm();
                    setShowCongViecModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Thêm công việc
                </button>
              </div>
              {congViecs.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>task</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có công việc</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm công việc" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {congViecs.map((cv) => (
                    <div key={cv.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">{cv.ten_cong_viec}</p>
                          {cv.mo_ta && <p className="text-sm text-gray-600 mt-2">{cv.mo_ta}</p>}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person</span>
                              Điều dưỡng: {cv.ten_dieu_duong || '-'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                              {cv.thoi_gian_du_kien ? formatDateTimeVN(cv.thoi_gian_du_kien) : '-'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={cv.trang_thai || 'chua_lam'}
                            onChange={(e) => {
                              const phanCongId = cv.id;
                              alert('Chức năng cập nhật trạng thái sẽ được cải thiện');
                            }}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50"
                          >
                            <option value="chua_lam">Chưa làm</option>
                            <option value="dang_lam">Đang làm</option>
                            <option value="hoan_thanh">Hoàn thành</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Phòng */}
          {activeTab === 'phong' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Phòng</h3>
                {benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                    <p className="text-sm text-yellow-800">
                      <span className="material-symbols-outlined text-base align-middle mr-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>info</span>
                      Bệnh nhân đã xuất viện, không thể phân phòng
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenPhongModal}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                  >
                    + Phân phòng mới
                  </button>
                )}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Khu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên phòng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số phòng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày bắt đầu ở</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kết thúc ở</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        // Luôn hiển thị tất cả lịch sử phòng (cả đã kết thúc và đang ở)
                        // Sắp xếp: phòng đang ở trước, sau đó là phòng đã kết thúc (theo ngày kết thúc mới nhất)
                        const today = getVNNow();
                        today.setHours(0, 0, 0, 0);
                        
                        let phongsToShow = [...allPhongs].sort((a, b) => {
                          // Phòng đang ở (ngay_ket_thuc_o là null hoặc > today) luôn đứng trước
                          const aIsDangO = !a.ngay_ket_thuc_o || (() => {
                            const ngayKetThuc = toVNDate(a.ngay_ket_thuc_o);
                            if (!ngayKetThuc) return true;
                            ngayKetThuc.setHours(0, 0, 0, 0);
                            return ngayKetThuc > today;
                          })();
                          const bIsDangO = !b.ngay_ket_thuc_o || (() => {
                            const ngayKetThuc = toVNDate(b.ngay_ket_thuc_o);
                            if (!ngayKetThuc) return true;
                            ngayKetThuc.setHours(0, 0, 0, 0);
                            return ngayKetThuc > today;
                          })();
                          
                          // Nếu một phòng đang ở và một phòng đã kết thúc, phòng đang ở đứng trước
                          if (aIsDangO && !bIsDangO) return -1;
                          if (!aIsDangO && bIsDangO) return 1;
                          
                          // Nếu cả hai đều đang ở hoặc cả hai đều đã kết thúc, sắp xếp theo ngày bắt đầu mới nhất
                          const dateA = a.ngay_bat_dau_o ? new Date(a.ngay_bat_dau_o) : new Date(0);
                          const dateB = b.ngay_bat_dau_o ? new Date(b.ngay_bat_dau_o) : new Date(0);
                          return dateB - dateA; // Mới nhất trước
                        });
                        
                        if (phongsToShow.length === 0) {
                          // Không có phòng nào, hiển thị "-"
                          return (
                            <tr>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">-</td>
                            </tr>
                          );
                        }
                        
                        // Hiển thị danh sách phòng
                        return phongsToShow.map((p) => {
                          const isDangO = !p.ngay_ket_thuc_o || (() => {
                            const ngayKetThuc = toVNDate(p.ngay_ket_thuc_o);
                            if (!ngayKetThuc) return true;
                            ngayKetThuc.setHours(0, 0, 0, 0);
                            return ngayKetThuc > today;
                          })();
                          
                          return (
                            <tr key={p.id} className={isDangO ? "bg-[#4A90E2]/5" : "bg-gray-50"}>
                              <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900">
                                {p.khu || p.ten_khu_phan_khu || '-'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                                {p.ten_phong || p.phong || '-'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                                {p.so_phong || p.so_phong_thuc_te || '-'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                                {p.ngay_bat_dau_o ? formatDateVN(p.ngay_bat_dau_o) : '-'}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                                {p.ngay_ket_thuc_o ? formatDateVN(p.ngay_ket_thuc_o) : (
                                  <span className="text-green-600 font-semibold">Đang ở</span>
                                )}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                {isDangO ? (
                                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Đang ở
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Đã kết thúc
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-5 whitespace-nowrap">
                                {benhNhan?.tinh_trang_hien_tai !== 'Đã xuất viện' && isDangO && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={handleOpenPhongModal}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                                    >
                                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                                      <span>Đổi</span>
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (!confirm('Bạn có chắc muốn kết thúc phòng này?')) return;
                                        try {
                                          const ngayKetThuc = getTodayVN();
                                          await phongAPI.update(p.id, { 
                                            ngay_ket_thuc_o: ngayKetThuc
                                          });
                                          
                                          // Cập nhật trực tiếp state allPhongs để UI cập nhật ngay lập tức
                                          setAllPhongs(prevPhongs => 
                                            prevPhongs.map(phong => 
                                              phong.id === p.id 
                                                ? { ...phong, ngay_ket_thuc_o: ngayKetThuc }
                                                : phong
                                            )
                                          );
                                          
                                          alert('Kết thúc phòng thành công');
                                          
                                          // Reload lại thông tin bệnh nhân để đồng bộ dữ liệu
                                          await loadBenhNhanDetail();
                                          loadPhong();
                                          // Thông báo cho các component khác (như QuanLyPhongPage) cần reload
                                          window.dispatchEvent(new CustomEvent('phongUpdated'));
                                        } catch (error) {
                                          alert('Lỗi: ' + error.message);
                                        }
                                      }}
                                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs font-semibold"
                                    >
                                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                                      <span>Kết thúc</span>
                                    </button>
                                  </div>
                                )}
                                {benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện' && (
                                  <span className="text-xs text-gray-500 italic">Đã xuất viện</span>
                                )}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Người thân */}
          {activeTab === 'nguoi-than' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Người thân</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetNguoiThanForm();
                      setShowNguoiThanModal(true);
                    }}
                    disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Thêm người thân
                  </button>
                  <button
                    onClick={async () => {
                      await loadExistingNguoiThans();
                      setExistingNguoiThansPagination({ currentPage: 1, itemsPerPage: 12 });
                      setSearchExistingNguoiThan('');
                      setShowSelectNguoiThanModal(true);
                    }}
                    disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Thêm người thân đã tồn tại
                  </button>
                </div>
              </div>
              {nguoiThans.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>group</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có người thân</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm người thân" để bắt đầu</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nguoiThans.map((nt) => (
                    <div key={nt.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {nt.ho_ten?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{nt.ho_ten}</p>
                              {nt.la_nguoi_lien_he_chinh && (
                                <span className="text-xs bg-[#4A90E2]/20 text-[#4A90E2] px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                                  Liên hệ chính
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNguoiThan(nt)}
                            className="flex items-center gap-1 px-2 py-1 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNguoiThan(nt.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Quan hệ:</span> {nt.moi_quan_he || '-'}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">SĐT:</span> {nt.so_dien_thoai || '-'}
                        </p>
                        {nt.email && (
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {nt.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Dịch vụ */}
          {activeTab === 'dich-vu' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Dịch vụ</h3>
                {benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                    <p className="text-sm text-yellow-800">
                      <span className="material-symbols-outlined text-base align-middle mr-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>info</span>
                      Bệnh nhân đã xuất viện, không thể thêm dịch vụ
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      resetDichVuForm();
                      setShowDichVuModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                  >
                    + Thêm dịch vụ
                  </button>
                )}
              </div>
              {benhNhanDichVus.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medical_services</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có dịch vụ nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm dịch vụ" để bắt đầu</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Dịch vụ</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày bắt đầu</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kết thúc</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Hình thức</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                        </tr>
                      </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {benhNhanDichVus.map((dv) => (
                        <tr key={dv.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">{dv.ten_dich_vu}</div>
                            {dv.mo_ta_ngan && (
                              <div className="text-xs text-gray-500 mt-1">{dv.mo_ta_ngan}</div>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {dv.ngay_bat_dau ? formatDateVN(dv.ngay_bat_dau) : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                              {dv.ngay_ket_thuc ? formatDateVN(dv.ngay_ket_thuc) : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 capitalize">
                              {dv.hinh_thuc_thanh_toan?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              dv.trang_thai === 'dang_su_dung' ? 'bg-green-100 text-green-800' :
                              dv.trang_thai === 'tam_dung' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {dv.trang_thai === 'dang_su_dung' ? 'Đang sử dụng' :
                               dv.trang_thai === 'tam_dung' ? 'Tạm dừng' : 'Kết thúc'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex gap-2 flex-wrap">
                              {dv.trang_thai === 'dang_su_dung' && (
                                <button
                                  onClick={() => handleDoiDichVu(dv)}
                                  className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs font-semibold"
                                  title="Đổi dịch vụ"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                                  <span>Đổi</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteDichVu(dv.id)}
                                className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                                title="Xóa"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Vật dụng */}
          {activeTab === 'do-dung' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Vật dụng</h3>
                <button
                  onClick={() => {
                    resetDoDungForm();
                    setShowDoDungModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Thêm vật dụng
                </button>
              </div>
              
              {/* Bộ lọc */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Tìm kiếm */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                    <input
                      type="text"
                      placeholder="Tên vật dụng..."
                      value={doDungFilters.search}
                      onChange={(e) => setDoDungFilters({ ...doDungFilters, search: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  
                  {/* Lọc theo phân loại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
                    <select
                      value={doDungFilters.id_phan_loai}
                      onChange={(e) => setDoDungFilters({ ...doDungFilters, id_phan_loai: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Tất cả</option>
                      {phanLoaiDoDungs.map((pl) => (
                        <option key={pl.id} value={pl.id}>{pl.ten_loai}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Lọc theo nguồn cung cấp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nguồn cung cấp</label>
                    <select
                      value={doDungFilters.nguon_cung_cap}
                      onChange={(e) => setDoDungFilters({ ...doDungFilters, nguon_cung_cap: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="ca_nhan">Cá nhân</option>
                      <option value="benh_vien">Bệnh viện</option>
                    </select>
                  </div>
                  
                  {/* Lọc theo tình trạng */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                    <select
                      value={doDungFilters.tinh_trang}
                      onChange={(e) => setDoDungFilters({ ...doDungFilters, tinh_trang: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="tot">Tốt</option>
                      <option value="hu_hong">Hư hỏng</option>
                      <option value="mat">Mất</option>
                    </select>
                  </div>
                </div>
                
                {/* Nút xóa bộ lọc */}
                {(doDungFilters.search || doDungFilters.id_phan_loai || doDungFilters.nguon_cung_cap || doDungFilters.tinh_trang) && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setDoDungFilters({ search: '', id_phan_loai: '', nguon_cung_cap: '', tinh_trang: '' })}
                      className="text-sm text-[#4A90E2] hover:text-[#4A90E2]/80 font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>clear</span>
                      Xóa bộ lọc
                    </button>
                  </div>
                )}
              </div>
              
              {/* Lọc danh sách */}
              {(() => {
                const filteredDoDungs = doDungs.filter((dd) => {
                  // Lọc theo tìm kiếm
                  if (doDungFilters.search && !dd.ten_vat_dung?.toLowerCase().includes(doDungFilters.search.toLowerCase())) {
                    return false;
                  }
                  // Lọc theo phân loại
                  if (doDungFilters.id_phan_loai && String(dd.id_phan_loai) !== doDungFilters.id_phan_loai) {
                    return false;
                  }
                  // Lọc theo nguồn cung cấp
                  if (doDungFilters.nguon_cung_cap && dd.nguon_cung_cap !== doDungFilters.nguon_cung_cap) {
                    return false;
                  }
                  // Lọc theo tình trạng
                  if (doDungFilters.tinh_trang && dd.tinh_trang !== doDungFilters.tinh_trang) {
                    return false;
                  }
                  return true;
                });
                
                return filteredDoDungs.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                      {doDungs.length === 0 ? 'inventory_2' : 'filter_alt'}
                    </span>
                    <p className="text-gray-500 text-lg mb-2">
                      {doDungs.length === 0 ? 'Chưa có vật dụng' : 'Không tìm thấy vật dụng phù hợp'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {doDungs.length === 0 ? 'Bấm "Thêm vật dụng" để bắt đầu' : 'Thử thay đổi bộ lọc'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-sm text-gray-600">
                      Hiển thị <span className="font-semibold">{filteredDoDungs.length}</span> / <span className="font-semibold">{doDungs.length}</span> vật dụng
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredDoDungs.map((dd) => (
                    <div key={dd.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      {/* Hình ảnh nếu có */}
                      {dd.media && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img
                            src={dd.media}
                            alt={dd.ten_vat_dung}
                            className="w-full h-40 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {dd.ten_phan_loai && (
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {dd.ten_phan_loai}
                              </span>
                            )}
                            {dd.nguon_cung_cap && (
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                dd.nguon_cung_cap === 'benh_vien' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {dd.nguon_cung_cap === 'benh_vien' ? 'Bệnh viện' : 'Cá nhân'}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-gray-900">{dd.ten_vat_dung}</p>
                          <p className="text-sm text-gray-600 mt-1">Số lượng: <span className="font-semibold">{dd.so_luong}</span></p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDoDung(dd)}
                            className="flex items-center gap-1 px-2 py-1 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs"
                            title="Sửa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDoDung(dd.id)}
                            className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                            title="Xóa"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-1">Tình trạng:</p>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          dd.tinh_trang === 'tot' ? 'bg-green-100 text-green-800' :
                          dd.tinh_trang === 'hu_hong' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {dd.tinh_trang === 'tot' ? 'Tốt' : dd.tinh_trang === 'hu_hong' ? 'Hư hỏng' : 'Mất'}
                        </span>
                      </div>
                      {dd.ghi_chu && <p className="text-sm text-gray-600 mt-3">{dd.ghi_chu}</p>}
                    </div>
                      ))}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Tab: Ho so y te */}
          {activeTab === 'ho-so-y-te' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Hồ sơ y tế</h3>
                <button
                  onClick={() => {
                    if (hoSoYTe) {
                      setHoSoYTeForm({
                        id_loai_benh_ly: hoSoYTe.id_loai_benh_ly || '',
                        tien_su_benh: hoSoYTe.tien_su_benh || '',
                        di_ung_thuoc: hoSoYTe.di_ung_thuoc || '',
                        lich_su_phau_thuat: hoSoYTe.lich_su_phau_thuat || '',
                        benh_ly_hien_tai: hoSoYTe.benh_ly_hien_tai || '',
                        ghi_chu_dac_biet: hoSoYTe.ghi_chu_dac_biet || '',
                      });
                    }
                    setShowHoSoYTeModal(true);
                  }}
                  disabled={!hoSoYTe && benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hoSoYTe ? 'Sửa hồ sơ y tế' : '+ Tạo hồ sơ y tế'}
                </button>
              </div>
              {hoSoYTe ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Loại bệnh lý</label>
                      <p className="text-gray-900">{hoSoYTe.ten_loai_benh_ly || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.tien_su_benh || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng thuốc</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.di_ung_thuoc || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lịch sử phẫu thuật</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.lich_su_phau_thuat || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh lý hiện tại</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.benh_ly_hien_tai || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
                      <p className="text-gray-900 whitespace-pre-wrap">{hoSoYTe.ghi_chu_dac_biet || '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>folder</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có hồ sơ y tế</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo hồ sơ y tế" để bắt đầu</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Benh hien tai */}
          {activeTab === 'benh-hien-tai' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Bệnh hiện tại</h3>
                <button
                  onClick={() => {
                    resetBenhHienTaiForm();
                    setShowBenhHienTaiModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Thêm bệnh hiện tại
                </button>
              </div>
              {benhHienTai.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medical_services</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có bệnh hiện tại</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm bệnh hiện tại" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {benhHienTai.map((bh) => (
                    <div key={bh.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{bh.ten_benh || 'Chưa có tên bệnh'}</p>
                          <p className="text-sm text-gray-600">
                            Ngày phát hiện: {bh.ngay_phat_hien ? formatDateVN(bh.ngay_phat_hien) : '-'}
                          </p>
                          <p className="text-sm">
                            Tình trạng: 
                            <span className={`ml-1 px-2 py-1 text-xs rounded ${
                              bh.tinh_trang === 'dang_dieu_tri' ? 'bg-yellow-100 text-yellow-800' :
                              bh.tinh_trang === 'on_dinh' ? 'bg-green-100 text-green-800' :
                              bh.tinh_trang === 'khoi' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {bh.tinh_trang === 'dang_dieu_tri' ? 'Đang điều trị' :
                               bh.tinh_trang === 'on_dinh' ? 'Ổn định' :
                               bh.tinh_trang === 'khoi' ? 'Khỏi' : 'Tái phát'}
                            </span>
                          </p>
                          {bh.ghi_chu && <p className="text-sm text-gray-600 mt-2">{bh.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBenhHienTai(bh)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteBenhHienTai(bh.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Tam ly giao tiep */}
          {activeTab === 'tam-ly' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Tâm lý giao tiếp</h3>
                <button
                  onClick={() => {
                    resetTamLyGiaoTiepForm();
                    setShowTamLyGiaoTiepModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Thêm ghi chú tâm lý
                </button>
              </div>
              {tamLyGiaoTiep.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>psychology</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có ghi chú tâm lý</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm ghi chú tâm lý" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tamLyGiaoTiep.map((tlg) => (
                    <div key={tlg.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            Thời gian: {tlg.thoi_gian ? formatDateTimeVN(tlg.thoi_gian) : '-'}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Trạng thái tinh thần: </span>
                              <span className="capitalize">{tlg.trang_thai_tinh_than?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Mức độ tương tác: </span>
                              <span className="capitalize">{tlg.muc_do_tuong_tac?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Nhận thức người thân: </span>
                              <span>{tlg.nhan_thuc_nguoi_than ? 'Có' : 'Không'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Nhận thức điều dưỡng: </span>
                              <span>{tlg.nhan_thuc_dieu_duong ? 'Có' : 'Không'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Biết thời gian: </span>
                              <span>{tlg.biet_thoi_gian ? 'Có' : 'Không'}</span>
                            </div>
                          </div>
                          {tlg.ghi_chu && <p className="text-sm text-gray-600 mt-2">{tlg.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTamLyGiaoTiep(tlg)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteTamLyGiaoTiep(tlg.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Van dong phuc hoi */}
          {activeTab === 'van-dong' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Vận động phục hồi</h3>
                <button
                  onClick={() => {
                    resetVanDongPhucHoiForm();
                    setShowVanDongPhucHoiModal(true);
                  }}
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Thêm vận động phục hồi
                </button>
              </div>
              {vanDongPhucHoi.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>fitness_center</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có vận động phục hồi</p>
                  <p className="text-gray-400 text-sm">Bấm "Thêm vận động phục hồi" để bắt đầu</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vanDongPhucHoi.map((vdph) => (
                    <div key={vdph.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{vdph.loai_bai_tap || 'Chưa có tên bài tập'}</p>
                          <p className="text-sm text-gray-600">
                            Thời gian: {vdph.thoi_gian_bat_dau ? formatDateTimeVN(vdph.thoi_gian_bat_dau) : '-'}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                            <div>
                              <span className="font-medium">Khả năng vận động: </span>
                              <span className="capitalize">{vdph.kha_nang_van_dong?.replace('_', ' ') || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Cường độ: </span>
                              <span className="capitalize">{vdph.cuong_do || '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Thời lượng: </span>
                              <span>{vdph.thoi_luong_phut ? `${vdph.thoi_luong_phut} phút` : '-'}</span>
                            </div>
                            <div>
                              <span className="font-medium">Calo tiêu hao: </span>
                              <span>{vdph.calo_tieu_hao || '-'}</span>
                            </div>
                          </div>
                          {vdph.ghi_chu && <p className="text-sm text-gray-600 mt-2">{vdph.ghi_chu}</p>}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVanDongPhucHoi(vdph)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteVanDongPhucHoi(vdph.id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
              </div>
            </div>
        </div>
        </div>
      </div>

      {/* Modal: Huyet ap */}
      {showHuyetApModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingHuyetAp ? 'Sửa huyết áp' : 'Thêm huyết áp'}</h2>
            <form onSubmit={handleHuyetApSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tâm thu (mmHg) *</label>
                  <input
                    type="number"
                    required
                    value={huyetApForm.tam_thu}
                    onChange={(e) => setHuyetApForm({ ...huyetApForm, tam_thu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tâm trương (mmHg) *</label>
                  <input
                    type="number"
                    required
                    value={huyetApForm.tam_truong}
                    onChange={(e) => setHuyetApForm({ ...huyetApForm, tam_truong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
                  <input
                    type="text"
                    readOnly
                    value={editingHuyetAp?.danh_gia_chi_tiet ? formatDanhGia(editingHuyetAp.danh_gia_chi_tiet) : 'Sẽ được tính tự động'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đo *</label>
                  <input
                    type="datetime-local"
                    required
                    value={huyetApForm.thoi_gian_do}
                    onChange={(e) => setHuyetApForm({ ...huyetApForm, thoi_gian_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí đo</label>
                  <select
                    value={huyetApForm.vi_tri_do}
                    onChange={(e) => setHuyetApForm({ ...huyetApForm, vi_tri_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn vị trí</option>
                    <option value="tay_trai">Tay trái</option>
                    <option value="tay_phai">Tay phải</option>
                    <option value="dau_goi">Đầu gối</option>
                    <option value="co_chan">Cổ chân</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tư thế khi đo</label>
                  <select
                    value={huyetApForm.tu_the_khi_do}
                    onChange={(e) => setHuyetApForm({ ...huyetApForm, tu_the_khi_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn tư thế</option>
                    <option value="nam">Nằm</option>
                    <option value="ngoi">Ngồi</option>
                    <option value="dung">Đứng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={huyetApForm.muc_do ? formatDanhGia(huyetApForm.muc_do) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              {editingHuyetAp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                    <textarea
                      value={huyetApForm.noi_dung_canh_bao}
                      onChange={(e) => setHuyetApForm({ ...huyetApForm, noi_dung_canh_bao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={huyetApForm.ghi_chu}
                      onChange={(e) => setHuyetApForm({ ...huyetApForm, ghi_chu: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowHuyetApModal(false);
                    resetHuyetApForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingHuyetAp ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nhip tim */}
      {showNhipTimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingNhipTim ? 'Sửa nhịp tim' : 'Thêm nhịp tim'}</h2>
            <form onSubmit={handleNhipTimSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị nhịp tim (bpm) *</label>
                  <input
                    type="number"
                    required
                    value={nhipTimForm.gia_tri_nhip_tim}
                    onChange={(e) => setNhipTimForm({ ...nhipTimForm, gia_tri_nhip_tim: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đo *</label>
                  <input
                    type="datetime-local"
                    required
                    value={nhipTimForm.thoi_gian_do}
                    onChange={(e) => setNhipTimForm({ ...nhipTimForm, thoi_gian_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng bệnh nhân khi đo</label>
                  <select
                    value={nhipTimForm.tinh_trang_benh_nhan_khi_do}
                    onChange={(e) => setNhipTimForm({ ...nhipTimForm, tinh_trang_benh_nhan_khi_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="nghi_ngoi">Nghỉ ngơi</option>
                    <option value="van_dong">Vận động</option>
                    <option value="ngu">Ngủ</option>
                    <option value="an">Ăn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={editingNhipTim?.danh_gia_chi_tiet ? formatDanhGia(editingNhipTim.danh_gia_chi_tiet) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={nhipTimForm.muc_do ? formatDanhGia(nhipTimForm.muc_do) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              {editingNhipTim && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                    <textarea
                      value={nhipTimForm.noi_dung_canh_bao}
                      onChange={(e) => setNhipTimForm({ ...nhipTimForm, noi_dung_canh_bao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={nhipTimForm.ghi_chu}
                      onChange={(e) => setNhipTimForm({ ...nhipTimForm, ghi_chu: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNhipTimModal(false);
                    resetNhipTimForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingNhipTim ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Duong huyet */}
      {showDuongHuyetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingDuongHuyet ? 'Sửa đường huyết' : 'Thêm đường huyết'}</h2>
            <form onSubmit={handleDuongHuyetSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đường huyết (mmol/L) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={duongHuyetForm.gia_tri_duong_huyet}
                    onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, gia_tri_duong_huyet: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đo *</label>
                  <input
                    type="datetime-local"
                    required
                    value={duongHuyetForm.thoi_gian_do}
                    onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, thoi_gian_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời điểm đo</label>
                  <select
                    value={duongHuyetForm.thoi_diem_do}
                    onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, thoi_diem_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn thời điểm</option>
                    <option value="sang">Sáng</option>
                    <option value="trua">Trưa</option>
                    <option value="toi">Tối</option>
                    <option value="truoc_an">Trước ăn</option>
                    <option value="sau_an">Sau ăn</option>
                    <option value="truoc_ngu">Trước ngủ</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={editingDuongHuyet?.danh_gia_chi_tiet ? formatDanhGia(editingDuongHuyet.danh_gia_chi_tiet) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí lấy mẫu</label>
                  <select
                    value={duongHuyetForm.vi_tri_lay_mau}
                    onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, vi_tri_lay_mau: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn vị trí</option>
                    <option value="ngon_tay">Ngón tay</option>
                    <option value="canh_tay">Cánh tay</option>
                    <option value="dui">Đùi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ</label>
                  <select
                    value={duongHuyetForm.muc_do}
                    onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, muc_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="binh_thuong">Bình thường</option>
                    <option value="canh_bao">Cảnh báo</option>
                    <option value="nguy_hiem">Nguy hiểm</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng kèm theo</label>
                <textarea
                  value={duongHuyetForm.trieu_chung_kem_theo}
                  onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, trieu_chung_kem_theo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              {editingDuongHuyet && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                    <textarea
                      value={duongHuyetForm.noi_dung_canh_bao}
                      onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, noi_dung_canh_bao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={duongHuyetForm.ghi_chu}
                      onChange={(e) => setDuongHuyetForm({ ...duongHuyetForm, ghi_chu: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDuongHuyetModal(false);
                    resetDuongHuyetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingDuongHuyet ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: SpO2 */}
      {showSpo2Modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingSpo2 ? 'Sửa SpO2' : 'Thêm SpO2'}</h2>
            <form onSubmit={handleSpo2Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị SpO2 (%) *</label>
                  <input
                    type="number"
                    required
                    value={spo2Form.gia_tri_spo2}
                    onChange={(e) => setSpo2Form({ ...spo2Form, gia_tri_spo2: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PI (Perfusion Index)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={spo2Form.pi}
                    onChange={(e) => setSpo2Form({ ...spo2Form, pi: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Chỉ số tưới máu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đo *</label>
                  <input
                    type="datetime-local"
                    required
                    value={spo2Form.thoi_gian_do}
                    onChange={(e) => setSpo2Form({ ...spo2Form, thoi_gian_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí đo</label>
                  <select
                    value={spo2Form.vi_tri_do}
                    onChange={(e) => setSpo2Form({ ...spo2Form, vi_tri_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn vị trí</option>
                    <option value="ngon_tay_cai">Ngón tay cái</option>
                    <option value="ngon_tay_tro">Ngón tay trỏ</option>
                    <option value="ngon_tay_giua">Ngón tay giữa</option>
                    <option value="ngon_tay_ut">Ngón tay út</option>
                    <option value="ngon_chan">Ngón chân</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng hô hấp</label>
                  <select
                    value={spo2Form.tinh_trang_ho_hap}
                    onChange={(e) => setSpo2Form({ ...spo2Form, tinh_trang_ho_hap: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="binh_thuong">Bình thường</option>
                    <option value="kho_tho">Khó thở</option>
                    <option value="tho_nhanh">Thở nhanh</option>
                    <option value="tho_cham">Thở chậm</option>
                    <option value="ngung_tho">Ngừng thở</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={spo2Form.muc_do ? formatDanhGia(spo2Form.muc_do) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              {editingSpo2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                    <textarea
                      value={spo2Form.noi_dung_canh_bao}
                      onChange={(e) => setSpo2Form({ ...spo2Form, noi_dung_canh_bao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={spo2Form.ghi_chu}
                      onChange={(e) => setSpo2Form({ ...spo2Form, ghi_chu: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowSpo2Modal(false);
                    resetSpo2Form();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingSpo2 ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nhiet do */}
      {showNhietDoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingNhietDo ? 'Sửa nhiệt độ' : 'Thêm nhiệt độ'}</h2>
            <form onSubmit={handleNhietDoSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị nhiệt độ (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={nhietDoForm.gia_tri_nhiet_do}
                    onChange={(e) => setNhietDoForm({ ...nhietDoForm, gia_tri_nhiet_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian đo *</label>
                  <input
                    type="datetime-local"
                    required
                    value={nhietDoForm.thoi_gian_do}
                    onChange={(e) => setNhietDoForm({ ...nhietDoForm, thoi_gian_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={editingNhietDo?.danh_gia_chi_tiet ? formatDanhGia(editingNhietDo.danh_gia_chi_tiet) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí đo</label>
                  <select
                    value={nhietDoForm.vi_tri_do}
                    onChange={(e) => setNhietDoForm({ ...nhietDoForm, vi_tri_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn vị trí</option>
                    <option value="tran">Trán</option>
                    <option value="nach">Nách</option>
                    <option value="mieng">Miệng</option>
                    <option value="tai">Tai</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng lúc đo</label>
                  <select
                    value={nhietDoForm.tinh_trang_luc_do}
                    onChange={(e) => setNhietDoForm({ ...nhietDoForm, tinh_trang_luc_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn tình trạng</option>
                    <option value="nghi_ngoi">Nghỉ ngơi</option>
                    <option value="van_dong">Vận động</option>
                    <option value="sau_an">Sau ăn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ <span className="text-xs text-gray-500">(Tự động tính)</span></label>
                  <input
                    type="text"
                    value={nhietDoForm.muc_do ? formatDanhGia(nhietDoForm.muc_do) : 'Sẽ được tính tự động'}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
              {editingNhietDo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung cảnh báo</label>
                    <textarea
                      value={nhietDoForm.noi_dung_canh_bao}
                      onChange={(e) => setNhietDoForm({ ...nhietDoForm, noi_dung_canh_bao: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea
                      value={nhietDoForm.ghi_chu}
                      onChange={(e) => setNhietDoForm({ ...nhietDoForm, ghi_chu: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      rows="2"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNhietDoModal(false);
                    resetNhietDoForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingNhietDo ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal: Don thuoc */}
      {showThuocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo đơn thuốc mới</h2>
            <form onSubmit={handleThuocSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kê *</label>
                  <input
                    type="date"
                    required
                    value={thuocForm.ngay_ke}
                    onChange={(e) => setThuocForm({ ...thuocForm, ngay_ke: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={thuocForm.mo_ta}
                    onChange={(e) => setThuocForm({ ...thuocForm, mo_ta: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Danh sách thuốc *</label>
                  <button
                    type="button"
                    onClick={handleAddThuoc}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    + Thêm thuốc
                  </button>
                </div>
                <div className="space-y-3">
                  {thuocForm.thuoc.map((thuoc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Thuốc {index + 1}</span>
                        {thuocForm.thuoc.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveThuoc(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Tên thuốc *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.ten_thuoc}
                            onChange={(e) => handleThuocChange(index, 'ten_thuoc', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Liều lượng *</label>
                          <input
                            type="text"
                            required
                            value={thuoc.lieu_luong}
                            onChange={(e) => handleThuocChange(index, 'lieu_luong', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Thời điểm uống</label>
                          <input
                            type="text"
                            value={thuoc.thoi_diem_uong}
                            onChange={(e) => handleThuocChange(index, 'thoi_diem_uong', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="VD: Sáng, Trưa, Tối"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Ghi chú</label>
                          <input
                            type="text"
                            value={thuoc.ghi_chu}
                            onChange={(e) => handleThuocChange(index, 'ghi_chu', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowThuocModal(false);
                    resetThuocForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal: Cong viec */}
      {showCongViecModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Tạo công việc mới</h2>
            <form onSubmit={handleCongViecSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên công việc *</label>
                <input
                  type="text"
                  required
                  value={congViecForm.ten_cong_viec}
                  onChange={(e) => setCongViecForm({ ...congViecForm, ten_cong_viec: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={congViecForm.mo_ta}
                  onChange={(e) => setCongViecForm({ ...congViecForm, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mức ưu tiên</label>
                  <select
                    value={congViecForm.muc_uu_tien}
                    onChange={(e) => setCongViecForm({ ...congViecForm, muc_uu_tien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thap">Thấp</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="cao">Cao</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian dự kiến</label>
                  <input
                    type="datetime-local"
                    value={congViecForm.thoi_gian_du_kien || ''}
                    onChange={(e) => setCongViecForm({ ...congViecForm, thoi_gian_du_kien: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điều dưỡng (tùy chọn)</label>
                  <select
                    value={congViecForm.id_dieu_duong}
                    onChange={(e) => setCongViecForm({ ...congViecForm, id_dieu_duong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn điều dưỡng</option>
                    {nhanViens
                      .filter(nv => nv.vai_tro === 'dieu_duong' || nv.vai_tro === 'dieu_duong_truong')
                      .map((nv) => (
                        <option key={nv.id} value={nv.id}>{nv.ho_ten}</option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCongViecModal(false);
                    resetCongViecForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nguoi than */}
      {showNguoiThanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingNguoiThan ? 'Sửa người thân' : 'Thêm người thân'}
            </h2>
            <form onSubmit={handleNguoiThanSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên *</label>
                  <input
                    type="text"
                    required
                    value={nguoiThanForm.ho_ten}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNguoiThanForm({ ...nguoiThanForm, ho_ten: value });
                      // Validate on change
                      const error = validateHoTen(value);
                      setNguoiThanHoTenError(error);
                    }}
                    onBlur={(e) => {
                      // Trim và normalize khi blur
                      const trimmed = e.target.value.trim().replace(/\s+/g, ' ');
                      if (trimmed !== e.target.value) {
                        setNguoiThanForm({ ...nguoiThanForm, ho_ten: trimmed });
                      }
                      const error = validateHoTen(trimmed);
                      setNguoiThanHoTenError(error);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      nguoiThanHoTenError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'
                    }`}
                    placeholder="Nhập họ và tên (chỉ chữ cái, dấu cách và dấu tiếng Việt)"
                  />
                  {nguoiThanHoTenError && (
                    <p className="mt-1 text-sm text-red-500">{nguoiThanHoTenError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mối quan hệ</label>
                  <input
                    type="text"
                    value={nguoiThanForm.moi_quan_he}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, moi_quan_he: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: Con, Cháu, Anh/Chị..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    required
                    value={nguoiThanForm.so_dien_thoai}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cho phép số, dấu + và khoảng trắng
                      const cleaned = value.replace(/[^\d+\s-]/g, '');
                      setNguoiThanForm({ ...nguoiThanForm, so_dien_thoai: cleaned });
                      // Validate on change
                      const error = validateSoDienThoai(cleaned);
                      setNguoiThanSoDienThoaiError(error);
                    }}
                    onBlur={(e) => {
                      // Trim khi blur
                      const trimmed = e.target.value.trim();
                      if (trimmed !== e.target.value) {
                        setNguoiThanForm({ ...nguoiThanForm, so_dien_thoai: trimmed });
                      }
                      const error = validateSoDienThoai(trimmed);
                      setNguoiThanSoDienThoaiError(error);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      nguoiThanSoDienThoaiError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'
                    }`}
                    placeholder="Nhập số điện thoại (VD: 0912345678 hoặc +84912345678)"
                  />
                  {nguoiThanSoDienThoaiError && (
                    <p className="mt-1 text-sm text-red-500">{nguoiThanSoDienThoaiError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={nguoiThanForm.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNguoiThanForm({ ...nguoiThanForm, email: value });
                      // Validate on change (optional field)
                      const error = validateEmail(value);
                      setNguoiThanEmailError(error);
                    }}
                    onBlur={(e) => {
                      // Trim và lowercase khi blur
                      const trimmed = e.target.value.trim().toLowerCase();
                      if (trimmed !== e.target.value) {
                        setNguoiThanForm({ ...nguoiThanForm, email: trimmed });
                      }
                      const error = validateEmail(trimmed);
                      setNguoiThanEmailError(error);
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      nguoiThanEmailError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'
                    }`}
                    placeholder="Nhập email (VD: example@email.com) - Tùy chọn"
                  />
                  {nguoiThanEmailError && (
                    <p className="mt-1 text-sm text-red-500">{nguoiThanEmailError}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nguoiThanForm.la_nguoi_lien_he_chinh}
                    onChange={(e) => setNguoiThanForm({ ...nguoiThanForm, la_nguoi_lien_he_chinh: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Là người liên hệ chính</span>
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNguoiThanModal(false);
                    resetNguoiThanForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingNguoiThan ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Existing Nguoi Than Modal */}
      {showSelectNguoiThanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Chọn người thân đã tồn tại</h2>
            
            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                value={searchExistingNguoiThan}
                onChange={(e) => {
                  setSearchExistingNguoiThan(e.target.value);
                  // Reset về trang 1 khi search thay đổi
                  setExistingNguoiThansPagination(prev => ({ ...prev, currentPage: 1 }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
              />
            </div>

            {/* List */}
            {(() => {
              // Filter danh sách
              const filteredNguoiThans = existingNguoiThans.filter(nt => {
                if (!searchExistingNguoiThan) return true;
                const search = searchExistingNguoiThan.toLowerCase();
                return (
                  (nt.ho_ten && nt.ho_ten.toLowerCase().includes(search)) ||
                  (nt.so_dien_thoai && nt.so_dien_thoai.includes(search)) ||
                  (nt.email && nt.email.toLowerCase().includes(search))
                );
              });

              // Tính toán pagination
              const totalItems = filteredNguoiThans.length;
              const totalPages = Math.ceil(totalItems / existingNguoiThansPagination.itemsPerPage);
              const startIndex = (existingNguoiThansPagination.currentPage - 1) * existingNguoiThansPagination.itemsPerPage;
              const endIndex = startIndex + existingNguoiThansPagination.itemsPerPage;
              const paginatedNguoiThans = filteredNguoiThans.slice(startIndex, endIndex);

              return (
                <>
                  {totalItems === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_search</span>
                      <p className="text-lg mb-2">Không có người thân đã tồn tại</p>
                      <p className="text-sm">Tất cả người thân đã được liên kết với bệnh nhân này</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {paginatedNguoiThans.map((nt, index) => (
                    <div
                      key={`${nt.id_tai_khoan}-${nt.id || index}`}
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#4A90E2] hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleSelectExistingNguoiThan(nt)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                          {nt.ho_ten?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 mb-1">{nt.ho_ten || 'Chưa có tên'}</p>
                          {nt.so_dien_thoai && (
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>phone</span>
                              {nt.so_dien_thoai}
                            </p>
                          )}
                          {nt.email && (
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="material-symbols-outlined text-sm align-middle mr-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>email</span>
                              {nt.email}
                            </p>
                          )}
                          {nt.moi_quan_he && (
                            <p className="text-xs text-gray-500 mt-1">
                              Mối quan hệ: {nt.moi_quan_he}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectExistingNguoiThan(nt);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold flex-shrink-0"
                        >
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>add</span>
                          Chọn
                        </button>
                      </div>
                    </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="bg-white border-t border-gray-200 p-4 mt-4">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
                              <select
                                value={existingNguoiThansPagination.itemsPerPage}
                                onChange={(e) => {
                                  setExistingNguoiThansPagination({
                                    ...existingNguoiThansPagination,
                                    itemsPerPage: parseInt(e.target.value),
                                    currentPage: 1
                                  });
                                }}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                              >
                                <option value={6}>6</option>
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                              </select>
                              <span className="text-sm text-gray-600">
                                / Tổng: {totalItems} người thân
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (existingNguoiThansPagination.currentPage > 1) {
                                    setExistingNguoiThansPagination({
                                      ...existingNguoiThansPagination,
                                      currentPage: existingNguoiThansPagination.currentPage - 1
                                    });
                                  }
                                }}
                                disabled={existingNguoiThansPagination.currentPage === 1}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                  existingNguoiThansPagination.currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                              </button>
                              {getPageNumbers(totalPages, existingNguoiThansPagination.currentPage).map((page, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (typeof page === 'number') {
                                      setExistingNguoiThansPagination({
                                        ...existingNguoiThansPagination,
                                        currentPage: page
                                      });
                                    }
                                  }}
                                  disabled={page === '...'}
                                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                                    page === '...'
                                      ? 'bg-transparent text-gray-400 cursor-default'
                                      : page === existingNguoiThansPagination.currentPage
                                      ? 'bg-[#4A90E2] text-white'
                                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  if (existingNguoiThansPagination.currentPage < totalPages) {
                                    setExistingNguoiThansPagination({
                                      ...existingNguoiThansPagination,
                                      currentPage: existingNguoiThansPagination.currentPage + 1
                                    });
                                  }
                                }}
                                disabled={existingNguoiThansPagination.currentPage === totalPages}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                                  existingNguoiThansPagination.currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              );
            })()}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowSelectNguoiThanModal(false);
                  setSearchExistingNguoiThan('');
                  setExistingNguoiThansPagination({ currentPage: 1, itemsPerPage: 12 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Do dung */}
      {showDoDungModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingDoDung ? 'Sửa vật dụng' : 'Thêm vật dụng'}
            </h2>
            
            {/* Tabs cho nguồn cung cấp - chỉ hiển thị khi thêm mới */}
            {!editingDoDung && (
              <div className="mb-4 border-b border-gray-200">
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => setDoDungTab('ca_nhan')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      doDungTab === 'ca_nhan'
                        ? 'border-b-2 border-[#4A90E2] text-[#4A90E2]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoDungTab('benh_vien')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      doDungTab === 'benh_vien'
                        ? 'border-b-2 border-[#4A90E2] text-[#4A90E2]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Bệnh viện
                  </button>
                </div>
              </div>
            )}
            
            {/* Hiển thị nguồn cung cấp khi đang sửa */}
            {editingDoDung && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Nguồn cung cấp: </span>
                <span className="text-sm font-semibold text-gray-800">
                  {editingDoDung.nguon_cung_cap === 'benh_vien' ? 'Bệnh viện' : 'Cá nhân'}
                </span>
              </div>
            )}
            
            <form onSubmit={handleDoDungSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
                  <select
                    value={doDungForm.id_phan_loai}
                    onChange={(e) => setDoDungForm({ ...doDungForm, id_phan_loai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn phân loại (tùy chọn)</option>
                    {phanLoaiDoDungs.map((pl) => (
                      <option key={pl.id} value={pl.id}>{pl.ten_loai}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật dụng *</label>
                  <input
                    type="text"
                    required
                    value={doDungForm.ten_vat_dung}
                    onChange={(e) => setDoDungForm({ ...doDungForm, ten_vat_dung: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={doDungForm.so_luong}
                    onChange={(e) => setDoDungForm({ ...doDungForm, so_luong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                  <select
                    value={doDungForm.tinh_trang}
                    onChange={(e) => setDoDungForm({ ...doDungForm, tinh_trang: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="tot">Tốt</option>
                    <option value="hu_hong">Hư hỏng</option>
                    <option value="mat">Mất</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={doDungForm.ghi_chu}
                  onChange={(e) => setDoDungForm({ ...doDungForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                />
              </div>
              
              {/* Upload hình ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                    if (!imageTypes.includes(file.type)) {
                      alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
                      return;
                    }

                    if (file.size > 10 * 1024 * 1024) {
                      alert('Kích thước file không được vượt quá 10MB');
                      return;
                    }

                    try {
                      setUploadingMedia(true);
                      const response = await uploadAPI.uploadMedia(file);
                      setDoDungForm({ ...doDungForm, media: response.data.url });
                      e.target.value = ''; // Reset input
                    } catch (error) {
                      alert('Lỗi khi upload ảnh: ' + error.message);
                    } finally {
                      setUploadingMedia(false);
                    }
                  }}
                  disabled={uploadingMedia}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A90E2]/10 file:text-[#4A90E2] hover:file:bg-[#4A90E2]/20 disabled:opacity-50"
                />
                {uploadingMedia && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sync</span>
                    Đang tải ảnh lên...
                  </p>
                )}
                
                {/* Preview hình ảnh */}
                {doDungForm.media && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={doDungForm.media}
                      alt="Hình ảnh vật dụng"
                      className="max-w-xs h-auto rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setDoDungForm({ ...doDungForm, media: '' })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      title="Xóa ảnh"
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDoDungModal(false);
                    resetDoDungForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingDoDung ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Phong */}
      {showPhongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {phong ? 'Sửa phòng' : 'Phân phòng'}
            </h2>
            {benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <span className="material-symbols-outlined text-base align-middle mr-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>warning</span>
                  Bệnh nhân đã xuất viện, không thể phân phòng hoặc đổi phòng
                </p>
              </div>
            ) : null}
            <form onSubmit={handlePhongSubmit} className="space-y-4">
              {/* Chọn từ dropdown hoặc nhập tay */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Chọn phòng từ hệ thống</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phân khu</label>
                    <select
                      value={selectedPhanKhu}
                      onChange={(e) => handlePhanKhuChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                    >
                      <option value="">Chọn phân khu</option>
                      {phanKhus.map((pk) => (
                        <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
                    <select
                      value={selectedPhong || ''}
                      onChange={(e) => handlePhongChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      disabled={!selectedPhanKhu || benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                    >
                      <option value="">Chọn phòng</option>
                      {phongs.map((p) => {
                        const currentCount = p.benh_nhans?.length || 0;
                        const maxCapacity = p.so_nguoi_toi_da || 1;
                        const availableSlots = maxCapacity - currentCount;
                        return (
                          <option key={p.id} value={p.id}>
                            {p.ten_phong} {p.so_phong ? `(${p.so_phong})` : ''} - Còn {availableSlots}/{maxCapacity} chỗ
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Hiển thị thông tin phòng đã chọn */}
                {selectedPhong && (() => {
                  const phongId = typeof selectedPhong === 'string' ? parseInt(selectedPhong) : selectedPhong;
                  const phongInfo = phongs.find(p => p.id === phongId || p.id === parseInt(phongId) || String(p.id) === String(phongId));
                  if (!phongInfo) {
                    console.error('Phong not found for display:', { selectedPhong, phongId, phongs });
                    return null;
                  }
                  return (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Thông tin phòng:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Tên phòng:</span> {phongInfo.ten_phong}</div>
                        <div><span className="font-medium">Số phòng:</span> {phongInfo.so_phong || '-'}</div>
                        <div><span className="font-medium">Số giường:</span> {phongInfo.so_giuong || '-'}</div>
                        <div><span className="font-medium">Diện tích:</span> {phongInfo.dien_tich ? `${phongInfo.dien_tich} m²` : '-'}</div>
                        <div><span className="font-medium">Số người:</span> 
                          <span className="ml-1">
                            {phongInfo.benh_nhans?.length || 0}/{phongInfo.so_nguoi_toi_da || 1}
                            {(() => {
                              const currentCount = phongInfo.benh_nhans?.length || 0;
                              const maxCapacity = phongInfo.so_nguoi_toi_da || 1;
                              const availableSlots = maxCapacity - currentCount;
                              return availableSlots > 0 ? (
                                <span className="ml-1 text-green-600 font-medium">(Còn {availableSlots} chỗ)</span>
                              ) : (
                                <span className="ml-1 text-red-600 font-medium">(Đầy)</span>
                              );
                            })()}
                          </span>
                        </div>
                        <div><span className="font-medium">Trạng thái:</span> 
                          <span className={`ml-1 px-2 py-1 text-xs rounded ${
                            phongInfo.trang_thai === 'trong' ? 'bg-green-100 text-green-800' :
                            phongInfo.trang_thai === 'co_nguoi' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {phongInfo.trang_thai === 'trong' ? 'Trống' : phongInfo.trang_thai === 'co_nguoi' ? 'Có người' : 'Bảo trì'}
                          </span>
                        </div>
                      </div>
                      {/* Hiển thị ảnh phòng */}
                      {(phongInfo.anh_1 || phongInfo.anh_2 || phongInfo.anh_3) && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Hình ảnh:</span>
                          <div className="flex gap-2 mt-2">
                            {phongInfo.anh_1 && (
                              <img src={phongInfo.anh_1} alt="Ảnh 1" className="w-20 h-20 object-cover rounded border" />
                            )}
                            {phongInfo.anh_2 && (
                              <img src={phongInfo.anh_2} alt="Ảnh 2" className="w-20 h-20 object-cover rounded border" />
                            )}
                            {phongInfo.anh_3 && (
                              <img src={phongInfo.anh_3} alt="Ảnh 3" className="w-20 h-20 object-cover rounded border" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Hoặc nhập tay */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc nhập thông tin thủ công</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khu</label>
                  <input
                    type="text"
                    value={phongForm.khu}
                    onChange={(e) => setPhongForm({ ...phongForm, khu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: A, B, C..."
                    disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
                  <input
                    type="text"
                    value={phongForm.phong}
                    onChange={(e) => setPhongForm({ ...phongForm, phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 101, 102..."
                    disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giường</label>
                  <input
                    type="text"
                    value={phongForm.giuong}
                    onChange={(e) => setPhongForm({ ...phongForm, giuong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 1, 2..."
                    disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <p className="font-medium mb-1">Lưu ý:</p>
                <p>Nếu chọn phòng từ hệ thống, thông tin sẽ được tự động điền. Bạn có thể chỉnh sửa giường nếu cần.</p>
                <p className="mt-1">Khi phân phòng, trạng thái phòng sẽ được cập nhật thành "Có người".</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhongModal(false);
                    resetPhongForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={benhNhan?.tinh_trang_hien_tai === 'Đã xuất viện'}
                >
                  {phong ? 'Cập nhật' : 'Phân phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Dịch vụ */}
      {showDichVuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {isDoiDichVu ? 'Đổi dịch vụ' : editingDichVu ? 'Sửa dịch vụ' : 'Thêm dịch vụ'}
            </h2>
            {isDoiDichVu && (
              <p className="text-sm text-yellow-600 mb-4 bg-yellow-50 p-2 rounded">
                Dịch vụ cũ sẽ được cập nhật ngày kết thúc và dịch vụ mới sẽ được tạo với ngày bắt đầu là ngày đổi.
              </p>
            )}
            <form onSubmit={handleDichVuSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ *</label>
                <select
                  required
                  value={dichVuForm.id_dich_vu}
                  onChange={(e) => setDichVuForm({ ...dichVuForm, id_dich_vu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  disabled={!!editingDichVu && !isDoiDichVu}
                >
                  <option value="">Chọn dịch vụ</option>
                  {allDichVus.map((dv) => (
                    <option key={dv.id} value={dv.id}>{dv.ten_dich_vu}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu *</label>
                  <input
                    type="date"
                    required
                    value={dichVuForm.ngay_bat_dau}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, ngay_bat_dau: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={dichVuForm.ngay_ket_thuc}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, ngay_ket_thuc: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức thanh toán *</label>
                  <select
                    required
                    value={dichVuForm.hinh_thuc_thanh_toan}
                  onChange={(e) => setDichVuForm({ ...dichVuForm, hinh_thuc_thanh_toan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="thang">Theo tháng</option>
                    <option value="quy">Theo quý</option>
                    <option value="nam">Theo năm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                  <select
                    required
                    value={dichVuForm.trang_thai}
                    onChange={(e) => setDichVuForm({ ...dichVuForm, trang_thai: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="dang_su_dung">Đang sử dụng</option>
                    <option value="tam_dung">Tạm dừng</option>
                    <option value="ket_thuc">Kết thúc</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDichVuModal(false);
                    resetDichVuForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingDichVu ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ho so y te */}
      {showHoSoYTeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {hoSoYTe ? 'Sửa hồ sơ y tế' : 'Tạo hồ sơ y tế'}
            </h2>
            <form onSubmit={handleHoSoYTeSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Loại bệnh lý (tùy chọn)</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateLoaiBenhLy(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Tạo mới
                  </button>
                </div>
                <select
                  value={hoSoYTeForm.id_loai_benh_ly}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, id_loai_benh_ly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn loại bệnh lý (tùy chọn)</option>
                  {loaiBenhLys.map((lb) => (
                    <option key={lb.id} value={lb.id}>{lb.ten_loai_benh_ly}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Để trống nếu không có loại bệnh lý cụ thể</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiền sử bệnh</label>
                <textarea
                  value={hoSoYTeForm.tien_su_benh}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, tien_su_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập tiền sử bệnh..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dị ứng thuốc</label>
                <textarea
                  value={hoSoYTeForm.di_ung_thuoc}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, di_ung_thuoc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập các loại thuốc dị ứng..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lịch sử phẫu thuật</label>
                <textarea
                  value={hoSoYTeForm.lich_su_phau_thuat}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, lich_su_phau_thuat: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập lịch sử phẫu thuật..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bệnh lý hiện tại</label>
                <textarea
                  value={hoSoYTeForm.benh_ly_hien_tai}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, benh_ly_hien_tai: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập bệnh lý hiện tại..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đặc biệt</label>
                <textarea
                  value={hoSoYTeForm.ghi_chu_dac_biet}
                  onChange={(e) => setHoSoYTeForm({ ...hoSoYTeForm, ghi_chu_dac_biet: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú đặc biệt..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowHoSoYTeModal(false);
                    resetHoSoYTeForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {hoSoYTe ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Benh hien tai */}
      {showBenhHienTaiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingBenhHienTai ? 'Sửa bệnh hiện tại' : 'Thêm bệnh hiện tại'}
            </h2>
            <form onSubmit={handleBenhHienTaiSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Thông tin bệnh *</label>
                  <button
                    type="button"
                    onClick={() => setShowCreateThongTinBenh(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    + Tạo mới
                  </button>
                </div>
                <select
                  required
                  value={benhHienTaiForm.id_thong_tin_benh}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, id_thong_tin_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn thông tin bệnh *</option>
                  {thongTinBenhs.map((tb) => (
                    <option key={tb.id} value={tb.id}>{tb.ten_benh}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Chọn bệnh từ danh sách hoặc tạo mới</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày phát hiện</label>
                <input
                  type="date"
                  value={benhHienTaiForm.ngay_phat_hien}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, ngay_phat_hien: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng</label>
                <select
                  value={benhHienTaiForm.tinh_trang}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, tinh_trang: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="dang_dieu_tri">Đang điều trị</option>
                  <option value="on_dinh">Ổn định</option>
                  <option value="khoi">Khỏi</option>
                  <option value="tai_phat">Tái phát</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={benhHienTaiForm.ghi_chu}
                  onChange={(e) => setBenhHienTaiForm({ ...benhHienTaiForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBenhHienTaiModal(false);
                    resetBenhHienTaiForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingBenhHienTai ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tam ly giao tiep */}
      {showTamLyGiaoTiepModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingTamLyGiaoTiep ? 'Sửa tâm lý giao tiếp' : 'Thêm tâm lý giao tiếp'}
            </h2>
            <form onSubmit={handleTamLyGiaoTiepSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                <input
                  type="datetime-local"
                  value={tamLyGiaoTiepForm.thoi_gian || ''}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, thoi_gian: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái tinh thần</label>
                <select
                  value={tamLyGiaoTiepForm.trang_thai_tinh_than}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, trang_thai_tinh_than: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="vui_ve">Vui vẻ</option>
                  <option value="binh_thuong">Bình thường</option>
                  <option value="buon_ba">Buồn bã</option>
                  <option value="lo_lang">Lo lắng</option>
                  <option value="cau_gat">Cáu gắt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ tương tác</label>
                <select
                  value={tamLyGiaoTiepForm.muc_do_tuong_tac}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, muc_do_tuong_tac: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="chu_dong">Chủ động</option>
                  <option value="phan_hoi">Phản hồi</option>
                  <option value="it_phan_hoi">Ít phản hồi</option>
                  <option value="khong_giao_tiep">Không giao tiếp</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.nhan_thuc_nguoi_than}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, nhan_thuc_nguoi_than: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Nhận thức người thân</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.nhan_thuc_dieu_duong}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, nhan_thuc_dieu_duong: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Nhận thức điều dưỡng</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={tamLyGiaoTiepForm.biet_thoi_gian}
                    onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, biet_thoi_gian: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">Biết thời gian</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={tamLyGiaoTiepForm.ghi_chu}
                  onChange={(e) => setTamLyGiaoTiepForm({ ...tamLyGiaoTiepForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTamLyGiaoTiepModal(false);
                    resetTamLyGiaoTiepForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingTamLyGiaoTiep ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Van dong phuc hoi */}
      {showVanDongPhucHoiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingVanDongPhucHoi ? 'Sửa vận động phục hồi' : 'Thêm vận động phục hồi'}
            </h2>
            <form onSubmit={handleVanDongPhucHoiSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài tập</label>
                <input
                  type="text"
                  value={vanDongPhucHoiForm.loai_bai_tap}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, loai_bai_tap: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Đi bộ, Tập tay, Tập chân..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khả năng vận động</label>
                  <select
                    value={vanDongPhucHoiForm.kha_nang_van_dong}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, kha_nang_van_dong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="doc_lap">Độc lập</option>
                    <option value="tro_giup">Trợ giúp</option>
                    <option value="nam_lien">Nằm liệt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cường độ</label>
                  <select
                    value={vanDongPhucHoiForm.cuong_do}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, cuong_do: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="nhe">Nhẹ</option>
                    <option value="trung_binh">Trung bình</option>
                    <option value="manh">Mạnh</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={vanDongPhucHoiForm.thoi_gian_bat_dau || ''}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, thoi_gian_bat_dau: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (phút)</label>
                  <input
                    type="number"
                    min="0"
                    value={vanDongPhucHoiForm.thoi_luong_phut}
                    onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, thoi_luong_phut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calo tiêu hao</label>
                <input
                  type="number"
                  min="0"
                  value={vanDongPhucHoiForm.calo_tieu_hao}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, calo_tieu_hao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: 150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={vanDongPhucHoiForm.ghi_chu}
                  onChange={(e) => setVanDongPhucHoiForm({ ...vanDongPhucHoiForm, ghi_chu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Nhập ghi chú..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVanDongPhucHoiModal(false);
                    resetVanDongPhucHoiForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingVanDongPhucHoi ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Trieu chung */}
      {showTrieuChungModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingTrieuChung ? 'Sửa triệu chứng' : 'Thêm triệu chứng'}</h2>
            <form onSubmit={handleTrieuChungSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng <span className="text-red-500">*</span></label>
                <select
                  required
                  value={trieuChungForm.id_trieu_chung}
                  onChange={(e) => setTrieuChungForm({ ...trieuChungForm, id_trieu_chung: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn triệu chứng</option>
                  {danhSachTrieuChung.map(tc => (
                    <option key={tc.id} value={tc.id}>{tc.ten_trieu_chung}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày giờ xảy ra <span className="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  required
                  value={trieuChungForm.ngay_gio_xay_ra}
                  onChange={(e) => setTrieuChungForm({ ...trieuChungForm, ngay_gio_xay_ra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTrieuChungModal(false);
                    resetTrieuChungForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  {editingTrieuChung ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tạo mới loại bệnh lý */}
      {showCreateLoaiBenhLy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo mới loại bệnh lý</h2>
            <form onSubmit={handleCreateLoaiBenhLy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại bệnh lý *</label>
                <input
                  type="text"
                  required
                  value={newLoaiBenhLy.ten_loai_benh_ly}
                  onChange={(e) => setNewLoaiBenhLy({ ...newLoaiBenhLy, ten_loai_benh_ly: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Tim mạch, Hô hấp, Tiêu hóa..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newLoaiBenhLy.mo_ta}
                  onChange={(e) => setNewLoaiBenhLy({ ...newLoaiBenhLy, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Mô tả về loại bệnh lý..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateLoaiBenhLy(false);
                    setNewLoaiBenhLy({ ten_loai_benh_ly: '', mo_ta: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tạo mới thông tin bệnh */}
      {showCreateThongTinBenh && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tạo mới thông tin bệnh</h2>
            <form onSubmit={handleCreateThongTinBenh} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bệnh *</label>
                <input
                  type="text"
                  required
                  value={newThongTinBenh.ten_benh}
                  onChange={(e) => setNewThongTinBenh({ ...newThongTinBenh, ten_benh: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: Cao huyết áp, Tiểu đường, Viêm phổi..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={newThongTinBenh.mo_ta}
                  onChange={(e) => setNewThongTinBenh({ ...newThongTinBenh, mo_ta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Mô tả về bệnh..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateThongTinBenh(false);
                    setNewThongTinBenh({ ten_benh: '', mo_ta: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
