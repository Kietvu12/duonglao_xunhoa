import { useEffect, useState } from 'react';
import { nhanVienAPI, benhNhanAPI } from '../../services/api';

export default function NhanVienPage() {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [hoTenError, setHoTenError] = useState('');
  const [soDienThoaiError, setSoDienThoaiError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cccdError, setCccdError] = useState('');
  const [soBhytError, setSoBhytError] = useState('');

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

  // Validation function for email
  const validateEmail = (value) => {
    if (!value || value.trim() === '') {
      return 'Email không được để trống';
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

  // Validation function for CCCD (optional)
  const validateCCCD = (value) => {
    // CCCD là optional, chỉ validate nếu có giá trị
    if (!value || value.trim() === '') {
      return ''; // Không bắt buộc
    }
    const trimmed = value.trim();
    // CCCD mới: 12 số, CMND cũ: 9 số
    const cccdRegex = /^[0-9]{9}$|^[0-9]{12}$/;
    if (!cccdRegex.test(trimmed)) {
      return 'CCCD/CMND phải là 9 số (CMND) hoặc 12 số (CCCD)';
    }
    return '';
  };

  // Validation function for BHYT (optional)
  const validateBHYT = (value) => {
    // BHYT là optional, chỉ validate nếu có giá trị
    if (!value || value.trim() === '') {
      return ''; // Không bắt buộc
    }
    const trimmed = value.trim();
    // BHYT thường là số, độ dài từ 10-15 số
    const bhytRegex = /^[0-9]{10,15}$/;
    if (!bhytRegex.test(trimmed)) {
      return 'Số BHYT phải là số và có độ dài từ 10 đến 15 ký tự';
    }
    return '';
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showPhanCaModal, setShowPhanCaModal] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [lichPhanCa, setLichPhanCa] = useState([]);
  const [showPhanCaForm, setShowPhanCaForm] = useState(false);
  const [editingPhanCa, setEditingPhanCa] = useState(null);
  const [phanCaForm, setPhanCaForm] = useState({
    id_tai_khoan: '',
    ca: 'sang',
    ngay: '',
    gio_bat_dau: '',
    gio_ket_thuc: '',
    trang_thai: 'du_kien'
  });
  const [showChuyenCaModal, setShowChuyenCaModal] = useState(false);
  const [caCanChuyen, setCaCanChuyen] = useState(null);
  const [selectedNhanVienMoi, setSelectedNhanVienMoi] = useState('');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allLichPhanCa, setAllLichPhanCa] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [phanCaByDate, setPhanCaByDate] = useState([]);
  // Filter states for phan ca modal
  const [filterPhanCaNgay, setFilterPhanCaNgay] = useState('');
  const [filterPhanCaCa, setFilterPhanCaCa] = useState('');
  const [filterPhanCaTrangThai, setFilterPhanCaTrangThai] = useState('');
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: '',
    vai_tro: 'dieu_duong',
    chuc_vu: '',
    bang_cap: '',
    luong_co_ban: '',
    cccd: '',
    so_bhyt: '',
    dia_chi: '',
    chuyen_mon: '',
    so_nam_kinh_nghiem: '',
    danh_gia: '',
    so_benh_nhan_da_dieu_tri: '',
    noi_cong_tac: '',
    lich_lam_viec: '',
  });
  // Filter states
  const [search, setSearch] = useState('');
  const [filterVaiTro, setFilterVaiTro] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  // Quản lý bệnh nhân cho điều dưỡng
  const [showQuanLyBenhNhanModal, setShowQuanLyBenhNhanModal] = useState(false);
  const [benhNhansQuanLy, setBenhNhansQuanLy] = useState([]);
  const [loadingBenhNhans, setLoadingBenhNhans] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [allBenhNhans, setAllBenhNhans] = useState([]);
  const [assignForm, setAssignForm] = useState({
    id_benh_nhan: '',
    ngay_bat_dau: new Date().toISOString().split('T')[0],
    ghi_chu: ''
  });
  const [benhNhanSearchInput, setBenhNhanSearchInput] = useState('');
  const [showBenhNhanDropdown, setShowBenhNhanDropdown] = useState(false);
  const [filterTrangThaiQuanLy, setFilterTrangThaiQuanLy] = useState('');
  const [searchBenhNhan, setSearchBenhNhan] = useState('');
  // Media hồ sơ nhân viên
  const [mediaHoSo, setMediaHoSo] = useState({
    anh_cccd: '',
    anh_bangdh: '',
    anh_bhyt: '',
    anh_cv: ''
  });
  const [uploadingMedia, setUploadingMedia] = useState({
    anh_cccd: false,
    anh_bangdh: false,
    anh_bhyt: false,
    anh_cv: false
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi search hoặc filters thay đổi
  }, [search, filterVaiTro]);

  useEffect(() => {
    loadNhanViens();
  }, [currentPage, itemsPerPage, search, filterVaiTro]);

  useEffect(() => {
    if (showCalendarModal) {
      // Mặc định chọn ngày hôm nay khi mở modal
      const today = new Date();
      setSelectedDate(today);
      loadAllLichPhanCa();
    }
  }, [showCalendarModal, currentMonth]);

  useEffect(() => {
    if (showQuanLyBenhNhanModal && selectedNhanVien) {
      // Sử dụng id_ho_so_nhan_vien nếu có, nếu không thì dùng id (tai_khoan.id) - controller sẽ tự tìm
      const idDieuDuong = selectedNhanVien.id_ho_so_nhan_vien || selectedNhanVien.id;
      loadBenhNhansQuanLy(idDieuDuong);
    }
  }, [filterTrangThaiQuanLy, searchBenhNhan, showQuanLyBenhNhanModal]);

  useEffect(() => {
    if (showCalendarModal && allLichPhanCa.length >= 0 && selectedDate) {
      const dateStr = formatDateForComparison(selectedDate);
      const phanCaOfDate = allLichPhanCa.filter(ca => {
        const caDate = normalizeDateFromDB(ca.ngay);
        return caDate === dateStr;
      });
      // Sắp xếp từ mới nhất đến cũ nhất (theo id giảm dần)
      phanCaOfDate.sort((a, b) => (b.id || 0) - (a.id || 0));
      setPhanCaByDate(phanCaOfDate);
    }
  }, [allLichPhanCa, selectedDate, showCalendarModal]);

  const loadNhanViens = async () => {
    try {
      setLoading(true);
      // Tính index từ currentPage: index = (currentPage - 1) * itemsPerPage
      const index = (currentPage - 1) * itemsPerPage;
      const params = {
        index: index,
        limit: itemsPerPage,
        ...(search ? { search } : {}),
        ...(filterVaiTro ? { vai_tro: filterVaiTro } : {})
      };
      const response = await nhanVienAPI.getAll(params);
      
      // Xử lý response với pagination info
      if (response.pagination) {
        setNhanViens(response.data || []);
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.total || 0);
      } else {
        // Fallback nếu API không trả về pagination
        setNhanViens(response.data || []);
        setTotalPages(1);
        setTotalItems(response.data?.length || 0);
      }
    } catch (error) {
      console.error('Error loading nhan viens:', error);
      alert('Lỗi khi tải danh sách nhân viên: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMediaHoSo = async (idHoSoNhanVien, idTaiKhoan = null) => {
    try {
      const pickLatestMedia = (rows = []) =>
        rows.find(
          (row) => row?.anh_cccd || row?.anh_bangdh || row?.anh_bhyt || row?.anh_cv
        ) || null;

      let mediaRecord = null;

      if (idHoSoNhanVien) {
        const responseByHoSoId = await nhanVienAPI.getMediaHoSo({ id_nhan_vien: idHoSoNhanVien });
        mediaRecord = pickLatestMedia(responseByHoSoId.data || []);
      }

      // Fallback cho dữ liệu cũ từng lưu theo id_tai_khoan
      if (!mediaRecord && idTaiKhoan) {
        const responseByTaiKhoanId = await nhanVienAPI.getMediaHoSo({ id_nhan_vien: idTaiKhoan });
        mediaRecord = pickLatestMedia(responseByTaiKhoanId.data || []);
      }

      if (mediaRecord) {
        setMediaHoSo({
          anh_cccd: mediaRecord.anh_cccd || '',
          anh_bangdh: mediaRecord.anh_bangdh || '',
          anh_bhyt: mediaRecord.anh_bhyt || '',
          anh_cv: mediaRecord.anh_cv || ''
        });
      } else {
        setMediaHoSo({
          anh_cccd: '',
          anh_bangdh: '',
          anh_bhyt: '',
          anh_cv: ''
        });
      }
    } catch (error) {
      console.error('Error loading media ho so:', error);
      // Reset nếu có lỗi
      setMediaHoSo({
        anh_cccd: '',
        anh_bangdh: '',
        anh_bhyt: '',
        anh_cv: ''
      });
    }
  };

  const handleUploadMedia = async (file, type) => {
    try {
      setUploadingMedia(prev => ({ ...prev, [type]: true }));
      const response = await nhanVienAPI.uploadMediaHoSo(file);
      if (response.success && response.data?.url) {
        setMediaHoSo(prev => ({ ...prev, [type]: response.data.url }));
        alert('Upload thành công');
      }
    } catch (error) {
      alert('Lỗi upload: ' + error.message);
    } finally {
      setUploadingMedia(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate ho_ten
    const hoTenValidation = validateHoTen(formData.ho_ten);
    if (hoTenValidation) {
      setHoTenError(hoTenValidation);
      return;
    }
    setHoTenError('');

    // Validate so_dien_thoai
    const soDienThoaiValidation = validateSoDienThoai(formData.so_dien_thoai);
    if (soDienThoaiValidation) {
      setSoDienThoaiError(soDienThoaiValidation);
      return;
    }
    setSoDienThoaiError('');

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }
    setEmailError('');

    // Validate CCCD (optional)
    const cccdValidation = validateCCCD(formData.cccd);
    if (cccdValidation) {
      setCccdError(cccdValidation);
      return;
    }
    setCccdError('');

    // Validate BHYT (optional)
    const soBhytValidation = validateBHYT(formData.so_bhyt);
    if (soBhytValidation) {
      setSoBhytError(soBhytValidation);
      return;
    }
    setSoBhytError('');
    
    try {
      // Xử lý dữ liệu: chuyển các trường không bắt buộc từ chuỗi rỗng thành null/undefined
      const processedData = { ...formData };
      
      // Các trường number: chuyển chuỗi rỗng thành null
      if (processedData.luong_co_ban === '' || processedData.luong_co_ban === null) {
        processedData.luong_co_ban = null;
      } else {
        processedData.luong_co_ban = Number(processedData.luong_co_ban);
      }
      
      if (processedData.so_nam_kinh_nghiem === '' || processedData.so_nam_kinh_nghiem === null) {
        processedData.so_nam_kinh_nghiem = null;
      } else {
        processedData.so_nam_kinh_nghiem = Number(processedData.so_nam_kinh_nghiem);
      }
      
      if (processedData.so_benh_nhan_da_dieu_tri === '' || processedData.so_benh_nhan_da_dieu_tri === null) {
        processedData.so_benh_nhan_da_dieu_tri = null;
      } else {
        processedData.so_benh_nhan_da_dieu_tri = Number(processedData.so_benh_nhan_da_dieu_tri);
      }
      
      // Các trường text: chuyển chuỗi rỗng thành null hoặc undefined
      const optionalTextFields = ['chuc_vu', 'bang_cap', 'cccd', 'so_bhyt', 'dia_chi', 'chuyen_mon', 'noi_cong_tac', 'danh_gia', 'lich_lam_viec'];
      optionalTextFields.forEach(field => {
        if (processedData[field] === '') {
          processedData[field] = null;
        }
      });
      
      let nhanVienId;
      if (editing) {
        const { mat_khau, ...updateData } = processedData;
        await nhanVienAPI.update(editing.id, updateData);
        nhanVienId = editing.id;
        alert('Cập nhật nhân viên thành công');
      } else {
        const response = await nhanVienAPI.create(processedData);
        nhanVienId = response.data?.id;
        alert('Thêm nhân viên thành công');
      }

      // Lưu media hồ sơ nếu có
      if (nhanVienId && (mediaHoSo.anh_cccd || mediaHoSo.anh_bangdh || mediaHoSo.anh_bhyt || mediaHoSo.anh_cv)) {
        try {
          // Lấy id_nhan_vien từ ho_so_nhan_vien (id trong response là id của ho_so_nhan_vien)
          const detailResponse = await nhanVienAPI.getById(nhanVienId);
          if (detailResponse.data) {
            // id trong detailResponse.data là id của ho_so_nhan_vien
            const idNhanVien = detailResponse.data.id;
            if (idNhanVien) {
              await nhanVienAPI.createMediaHoSo({
                id_nhan_vien: idNhanVien,
                ...mediaHoSo
              });
            }
          }
        } catch (error) {
          console.error('Error saving media:', error);
          // Không báo lỗi vì đây là phần phụ
        }
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      // Reload trang hiện tại sau khi thêm/sửa
      loadNhanViens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (nv) => {
    setEditing(nv);
    setFormData({
      ho_ten: nv.ho_ten || '',
      so_dien_thoai: nv.so_dien_thoai || '',
      email: nv.email || '',
      mat_khau: '',
      vai_tro: nv.vai_tro || 'dieu_duong',
      chuc_vu: nv.chuc_vu || '',
      bang_cap: nv.bang_cap || '',
      luong_co_ban: nv.luong_co_ban || '',
      cccd: nv.cccd || '',
      so_bhyt: nv.so_bhyt || '',
      dia_chi: nv.dia_chi || '',
      chuyen_mon: nv.chuyen_mon || '',
      so_nam_kinh_nghiem: nv.so_nam_kinh_nghiem || '',
      danh_gia: nv.danh_gia || '',
      so_benh_nhan_da_dieu_tri: nv.so_benh_nhan_da_dieu_tri || '',
      noi_cong_tac: nv.noi_cong_tac || '',
      lich_lam_viec: nv.lich_lam_viec || '',
    });
    setShowModal(true);
    // Load media hồ sơ
    await loadMediaHoSo(nv.id, nv.id_tai_khoan);
  };

  const resetForm = () => {
    setFormData({
      ho_ten: '',
      so_dien_thoai: '',
      email: '',
      mat_khau: '',
      vai_tro: 'dieu_duong',
      chuc_vu: '',
      bang_cap: '',
      luong_co_ban: '',
      cccd: '',
      so_bhyt: '',
      dia_chi: '',
      chuyen_mon: '',
      so_nam_kinh_nghiem: '',
      danh_gia: '',
      so_benh_nhan_da_dieu_tri: '',
      noi_cong_tac: '',
      lich_lam_viec: '',
    });
    setMediaHoSo({
      anh_cccd: '',
      anh_bangdh: '',
      anh_bhyt: '',
      anh_cv: ''
    });
    setHoTenError('');
    setSoDienThoaiError('');
    setEmailError('');
    setCccdError('');
    setSoBhytError('');
    setShowPassword(false);
  };

  // Phân ca functions
  const handleOpenPhanCa = async (nv) => {
    setSelectedNhanVien(nv);
    setShowPhanCaModal(true);
    await loadLichPhanCa(nv.id);
  };

  // Quản lý bệnh nhân functions
  const handleOpenQuanLyBenhNhan = async (nv) => {
    // Chỉ cho phép với điều dưỡng
    if (nv.vai_tro !== 'dieu_duong' && nv.vai_tro !== 'dieu_duong_truong') {
      alert('Chức năng này chỉ dành cho điều dưỡng');
      return;
    }
    setSelectedNhanVien(nv);
    setShowQuanLyBenhNhanModal(true);
    // id giờ đã là ho_so_nhan_vien.id
    const idDieuDuong = nv.id;
    // Load danh sách bệnh nhân đang quản lý trước
    // loadAllBenhNhans sẽ được gọi tự động trong loadBenhNhansQuanLy
    await loadBenhNhansQuanLy(idDieuDuong);
  };

  const loadBenhNhansQuanLy = async (idDieuDuong) => {
    try {
      setLoadingBenhNhans(true);
      const params = {
        ...(filterTrangThaiQuanLy ? { trang_thai: filterTrangThaiQuanLy } : {}),
        ...(searchBenhNhan ? { search: searchBenhNhan } : {})
      };
      const response = await benhNhanAPI.getBenhNhanByDieuDuong(idDieuDuong, params);
      
      // Parse response - API trả về { success: true, data: { dieu_duong: {...}, benh_nhan: [...] } }
      const benhNhans = response.data?.benh_nhan || response.benh_nhan || [];
      setBenhNhansQuanLy(benhNhans);
      
      // Sau khi load xong benhNhansQuanLy, reload allBenhNhans để cập nhật filter
      // Truyền benhNhans trực tiếp để tránh race condition với state
      // (chỉ reload nếu đang mở modal quản lý bệnh nhân)
      if (showQuanLyBenhNhanModal) {
        await loadAllBenhNhans(benhNhans);
      }
    } catch (error) {
      console.error('Error loading benh nhans:', error);
      alert('Lỗi khi tải danh sách bệnh nhân: ' + error.message);
    } finally {
      setLoadingBenhNhans(false);
    }
  };

  const loadAllBenhNhans = async (benhNhansQuanLyToFilter = null) => {
    try {
      // Lấy tất cả bệnh nhân (không filter chua_duoc_gan vì có thể backend chưa hỗ trợ)
      // Sẽ filter ở frontend sau
      const response = await benhNhanAPI.getAll({ 
        limit: -1  // Lấy tất cả bệnh nhân
      });
      
      // Xử lý response - có thể có pagination info hoặc chỉ có data
      let allBenhNhans = [];
      if (response.pagination) {
        // Nếu API trả về pagination info
        allBenhNhans = response.data || [];
      } else if (Array.isArray(response)) {
        // Nếu API trả về trực tiếp array
        allBenhNhans = response;
      } else if (response.data) {
        // Nếu API trả về object có data
        allBenhNhans = Array.isArray(response.data) ? response.data : [];
      } else {
        allBenhNhans = [];
      }
      
      console.log('loadAllBenhNhans - Response:', response);
      console.log('loadAllBenhNhans - All benh nhans:', allBenhNhans);
      console.log('loadAllBenhNhans - Count:', allBenhNhans.length);
      
      // Sử dụng tham số hoặc state hiện tại
      const benhNhansQuanLyData = benhNhansQuanLyToFilter || benhNhansQuanLy;
      console.log('loadAllBenhNhans - BenhNhansQuanLy:', benhNhansQuanLyData);
      
      // Filter những bệnh nhân chưa được gán cho điều dưỡng nào
      // (bệnh nhân không có trong danh sách benhNhansQuanLy)
      // benhNhansQuanLy có thể có cấu trúc: { id_quan_ly, id_benh_nhan, ho_ten, ... }
      const benhNhanIdsQuanLy = new Set(
        benhNhansQuanLyData.map(bn => {
          // Lấy id_benh_nhan nếu có, nếu không thì lấy id
          return bn.id_benh_nhan || bn.id;
        }).filter(id => id != null) // Loại bỏ null/undefined
      );
      
      console.log('loadAllBenhNhans - BenhNhanIdsQuanLy:', Array.from(benhNhanIdsQuanLy));
      
      const benhNhansChuaGan = allBenhNhans.filter(bn => {
        const benhNhanId = bn.id;
        const isQuanLy = benhNhanIdsQuanLy.has(benhNhanId);
        if (isQuanLy) {
          console.log(`Benh nhan ${benhNhanId} (${bn.ho_ten}) đã được gán`);
        }
        return !isQuanLy;
      });
      
      console.log('loadAllBenhNhans - Benh nhans chua gan:', benhNhansChuaGan);
      console.log('loadAllBenhNhans - Chua gan count:', benhNhansChuaGan.length);
      
      setAllBenhNhans(benhNhansChuaGan);
    } catch (error) {
      console.error('Error loading all benh nhans:', error);
      alert('Lỗi khi tải danh sách bệnh nhân: ' + error.message);
      setAllBenhNhans([]);
    }
  };

  const handleAssignBenhNhan = async (e) => {
    e.preventDefault();
    if (!assignForm.id_benh_nhan) {
      alert('Vui lòng chọn bệnh nhân');
      return;
    }
    try {
      // Sử dụng id_ho_so_nhan_vien nếu có, nếu không thì dùng id (tai_khoan.id) - controller sẽ tự tìm
      const idDieuDuong = selectedNhanVien.id_ho_so_nhan_vien || selectedNhanVien.id;
      await benhNhanAPI.assignBenhNhanToDieuDuong({
        id_dieu_duong: idDieuDuong,
        id_benh_nhan: assignForm.id_benh_nhan,
        ngay_bat_dau: assignForm.ngay_bat_dau,
        ghi_chu: assignForm.ghi_chu
      });
      alert('Gán bệnh nhân thành công');
      setShowAssignForm(false);
      setAssignForm({
        id_benh_nhan: '',
        ngay_bat_dau: new Date().toISOString().split('T')[0],
        ghi_chu: ''
      });
      setBenhNhanSearchInput('');
      setShowBenhNhanDropdown(false);
      // Reload cả 2 danh sách: bệnh nhân đang quản lý và tất cả bệnh nhân (để cập nhật filter)
      // loadAllBenhNhans sẽ được gọi tự động trong loadBenhNhansQuanLy
      await loadBenhNhansQuanLy(idDieuDuong);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleRemoveBenhNhan = async (idQuanLy) => {
    if (!confirm('Bạn có chắc muốn xóa bệnh nhân này khỏi danh sách quản lý?')) return;
    try {
      await benhNhanAPI.removeBenhNhanFromDieuDuong(idQuanLy, {
        ngay_ket_thuc: new Date().toISOString().split('T')[0]
      });
      alert('Xóa bệnh nhân khỏi danh sách quản lý thành công');
      // Sử dụng id_ho_so_nhan_vien nếu có, nếu không thì dùng id (tai_khoan.id) - controller sẽ tự tìm
      const idDieuDuong = selectedNhanVien.id_ho_so_nhan_vien || selectedNhanVien.id;
      // Reload cả 2 danh sách: bệnh nhân đang quản lý và tất cả bệnh nhân (để cập nhật filter)
      // loadAllBenhNhans sẽ được gọi tự động trong loadBenhNhansQuanLy
      await loadBenhNhansQuanLy(idDieuDuong);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getTrangThaiQuanLyLabel = (trangThai) => {
    const labels = {
      'dang_quan_ly': 'Đang quản lý',
      'ket_thuc': 'Kết thúc'
    };
    return labels[trangThai] || trangThai;
  };

  const getTrangThaiQuanLyColor = (trangThai) => {
    const colors = {
      'dang_quan_ly': 'bg-green-100 text-green-800',
      'ket_thuc': 'bg-gray-100 text-gray-800'
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  const loadLichPhanCa = async (idHoSoNhanVien) => {
    try {
      // Cần lấy id_tai_khoan từ ho_so_nhan_vien
      const detailResponse = await nhanVienAPI.getById(idHoSoNhanVien);
      if (detailResponse.data && detailResponse.data.id_tai_khoan) {
        const response = await nhanVienAPI.getLichPhanCa({ id_tai_khoan: detailResponse.data.id_tai_khoan });
        setLichPhanCa(response.data || []);
      } else {
        setLichPhanCa([]);
      }
    } catch (error) {
      console.error('Error loading lich phan ca:', error);
      alert('Lỗi khi tải lịch phân ca: ' + error.message);
    }
  };

  // Hàm lấy thời gian cố định cho từng ca
  const getCaTime = (ca) => {
    const caTimes = {
      'sang': { gio_bat_dau: '06:00', gio_ket_thuc: '14:00' },
      'chieu': { gio_bat_dau: '14:00', gio_ket_thuc: '22:00' },
      'dem': { gio_bat_dau: '22:00', gio_ket_thuc: '06:00' }
    };
    return caTimes[ca] || { gio_bat_dau: '', gio_ket_thuc: '' };
  };

  // Hàm xử lý khi thay đổi ca
  const handleCaChange = (caValue) => {
    const caTime = getCaTime(caValue);
    setPhanCaForm({
      ...phanCaForm,
      ca: caValue,
      gio_bat_dau: caTime.gio_bat_dau,
      gio_ket_thuc: caTime.gio_ket_thuc
    });
  };

  const handleOpenPhanCaForm = (ca = null) => {
    if (ca) {
      setEditingPhanCa(ca);
      setPhanCaForm({
        id_tai_khoan: ca.id_tai_khoan || '',
        ca: ca.ca || 'sang',
        ngay: ca.ngay || '',
        gio_bat_dau: ca.gio_bat_dau || '',
        gio_ket_thuc: ca.gio_ket_thuc || '',
        trang_thai: ca.trang_thai || 'du_kien'
      });
    } else {
      setEditingPhanCa(null);
      const defaultCa = 'sang';
      const defaultTime = getCaTime(defaultCa);
      setPhanCaForm({
        id_tai_khoan: selectedNhanVien?.id_tai_khoan || '',
        ca: defaultCa,
        ngay: '',
        gio_bat_dau: defaultTime.gio_bat_dau,
        gio_ket_thuc: defaultTime.gio_ket_thuc,
        trang_thai: 'du_kien'
      });
    }
    setShowPhanCaForm(true);
  };

  const handlePhanCaSubmit = async (e) => {
    e.preventDefault();
    try {
      // Debug: Log giá trị trước khi gửi
      console.log('Form data before submit:', {
        gio_bat_dau: phanCaForm.gio_bat_dau,
        gio_ket_thuc: phanCaForm.gio_ket_thuc,
        fullForm: phanCaForm
      });
      
      // Nếu chọn trạng thái "vang", hiển thị popup chuyển ca
      if (phanCaForm.trang_thai === 'vang' && editingPhanCa) {
        setCaCanChuyen(editingPhanCa);
        setShowPhanCaForm(false);
        setShowChuyenCaModal(true);
        return;
      }

      if (editingPhanCa) {
        await nhanVienAPI.updateLichPhanCa(editingPhanCa.id, phanCaForm);
        alert('Cập nhật phân ca thành công');
      } else {
        // Nếu không có selectedNhanVien (tạo từ calendar view), cần id_tai_khoan từ form
        // selectedNhanVien.id là ho_so_nhan_vien.id, nhưng selectedNhanVien.id_tai_khoan đã có sẵn từ API getAllNhanVien
        let idTaiKhoan = phanCaForm.id_tai_khoan;
        
        // Nếu có selectedNhanVien và form chưa có id_tai_khoan, lấy từ selectedNhanVien
        if (selectedNhanVien?.id_tai_khoan && !idTaiKhoan) {
          idTaiKhoan = selectedNhanVien.id_tai_khoan;
        }
        
        // Nếu vẫn chưa có id_tai_khoan, thử lấy từ API (fallback)
        if (!idTaiKhoan && selectedNhanVien?.id) {
          try {
            const detailResponse = await nhanVienAPI.getById(selectedNhanVien.id);
            if (detailResponse.data && detailResponse.data.id_tai_khoan) {
              idTaiKhoan = detailResponse.data.id_tai_khoan;
            }
          } catch (error) {
            console.error('Error getting id_tai_khoan:', error);
          }
        }
        
        if (!idTaiKhoan) {
          alert('Vui lòng chọn nhân viên');
          return;
        }
        await nhanVienAPI.createLichPhanCa({
          id_tai_khoan: idTaiKhoan,
          ...phanCaForm
        });
        alert('Tạo phân ca thành công');
      }
      setShowPhanCaForm(false);
      setEditingPhanCa(null);
      if (selectedNhanVien) {
        await loadLichPhanCa(selectedNhanVien.id);
      }
      // Reload calendar nếu đang mở
      if (showCalendarModal) {
        await loadAllLichPhanCa();
        if (selectedDate) {
          handleDateClick(selectedDate);
        }
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleChuyenCa = async () => {
    if (!selectedNhanVienMoi) {
      alert('Vui lòng chọn nhân viên để chuyển ca');
      return;
    }

    try {
      await nhanVienAPI.chuyenCa(caCanChuyen.id, {
        id_tai_khoan_moi: selectedNhanVienMoi
      });
      alert('Chuyển ca thành công');
      setShowChuyenCaModal(false);
      setCaCanChuyen(null);
      setSelectedNhanVienMoi('');
      
      // Reload danh sách phân ca của nhân viên nếu đang mở modal
      if (selectedNhanVien) {
        await loadLichPhanCa(selectedNhanVien.id);
      }
      
      // Reload calendar nếu đang mở
      if (showCalendarModal) {
        await loadAllLichPhanCa();
        // Reload danh sách của ngày được chọn
        if (selectedDate) {
          handleDateClick(selectedDate);
        }
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeletePhanCa = async (caId) => {
    if (!confirm('Bạn có chắc muốn xóa phân ca này?')) return;
    try {
      await nhanVienAPI.deleteLichPhanCa(caId);
      alert('Xóa phân ca thành công');
      await loadLichPhanCa(selectedNhanVien.id);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getCaLabel = (ca) => {
    const labels = {
      'sang': 'Ca sáng',
      'chieu': 'Ca chiều',
      'dem': 'Ca đêm'
    };
    return labels[ca] || ca;
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      'du_kien': 'Dự kiến',
      'dang_truc': 'Đang trực',
      'hoan_thanh': 'Hoàn thành',
      'vang': 'Vắng'
    };
    return labels[trangThai] || trangThai;
  };

  const getTrangThaiColor = (trangThai) => {
    const colors = {
      'du_kien': 'bg-blue-100 text-blue-800',
      'dang_truc': 'bg-yellow-100 text-yellow-800',
      'hoan_thanh': 'bg-green-100 text-green-800',
      'vang': 'bg-red-100 text-red-800'
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  // Filter lich phan ca
  const getFilteredLichPhanCa = () => {
    let filtered = [...lichPhanCa];

    if (filterPhanCaNgay) {
      const filterDate = new Date(filterPhanCaNgay).toISOString().split('T')[0];
      filtered = filtered.filter(ca => {
        const caDate = new Date(ca.ngay).toISOString().split('T')[0];
        return caDate === filterDate;
      });
    }

    if (filterPhanCaCa) {
      filtered = filtered.filter(ca => ca.ca === filterPhanCaCa);
    }

    if (filterPhanCaTrangThai) {
      filtered = filtered.filter(ca => ca.trang_thai === filterPhanCaTrangThai);
    }

    // Sắp xếp từ mới nhất đến cũ nhất (theo ngày giảm dần, nếu cùng ngày thì theo id giảm dần)
    filtered.sort((a, b) => {
      const dateA = new Date(a.ngay);
      const dateB = new Date(b.ngay);
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      // Nếu cùng ngày, sắp xếp theo id giảm dần (mới nhất trước)
      return (b.id || 0) - (a.id || 0);
    });

    return filtered;
  };

  const handleClearPhanCaFilters = () => {
    setFilterPhanCaNgay('');
    setFilterPhanCaCa('');
    setFilterPhanCaTrangThai('');
  };

  const hasActivePhanCaFilters = filterPhanCaNgay || filterPhanCaCa || filterPhanCaTrangThai;

  // Calendar functions
  const loadAllLichPhanCa = async () => {
    try {
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      // Use formatDateForComparison to avoid timezone issues
      const startDateStr = formatDateForComparison(startDate);
      const endDateStr = formatDateForComparison(endDate);
      
      const response = await nhanVienAPI.getLichPhanCa({
        start_date: startDateStr,
        end_date: endDateStr
      });
      
      console.log('Loaded lich phan ca:', response.data);
      console.log('Date range:', startDateStr, 'to', endDateStr);
      setAllLichPhanCa(response.data || []);
    } catch (error) {
      console.error('Error loading all lich phan ca:', error);
      alert('Lỗi khi tải lịch phân ca: ' + error.message);
    }
  };

  const handleDateClick = (date) => {
    const dateStr = formatDateForComparison(date);
    const phanCaOfDate = allLichPhanCa.filter(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      return caDate === dateStr;
    });
    // Sắp xếp từ mới nhất đến cũ nhất (theo id giảm dần)
    phanCaOfDate.sort((a, b) => (b.id || 0) - (a.id || 0));
    setPhanCaByDate(phanCaOfDate);
    setSelectedDate(date);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Thêm các ngày trống ở đầu tháng
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateForComparison = (date) => {
    if (!date) return '';
    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const normalizeDateFromDB = (dateValue) => {
    if (!dateValue) return '';
    // If it's already a string in YYYY-MM-DD format, use it directly
    if (typeof dateValue === 'string') {
      // Remove time part if exists (YYYY-MM-DD HH:mm:ss -> YYYY-MM-DD)
      // Also handle ISO string (YYYY-MM-DDTHH:mm:ss.sssZ -> YYYY-MM-DD)
      return dateValue.split(' ')[0].split('T')[0];
    }
    // If it's a Date object, format it using local timezone (not UTC)
    if (dateValue instanceof Date) {
      const year = dateValue.getFullYear();
      const month = String(dateValue.getMonth() + 1).padStart(2, '0');
      const day = String(dateValue.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  const hasPhanCa = (date) => {
    if (!date || allLichPhanCa.length === 0) return false;
    const dateStr = formatDateForComparison(date);
    
    return allLichPhanCa.some(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      // Debug log
      if (dateStr.includes('26') || caDate.includes('26')) {
        console.log('hasPhanCa check:', { 
          dateStr, 
          caDate, 
          caNgay: ca.ngay, 
          caNgayType: typeof ca.ngay,
          match: caDate === dateStr 
        });
      }
      return caDate === dateStr;
    });
  };

  const getPhanCaCount = (date) => {
    if (!date || allLichPhanCa.length === 0) return 0;
    const dateStr = formatDateForComparison(date);
    return allLichPhanCa.filter(ca => {
      const caDate = normalizeDateFromDB(ca.ngay);
      return caDate === dateStr;
    }).length;
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top khi đổi trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi số items per page
  };

  const handleClearFilters = () => {
    setSearch('');
    setFilterVaiTro('');
  };

  const hasActiveFilters = search || filterVaiTro;

  // Tính toán số trang hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang > 5, hiển thị một phần
      if (currentPage <= 3) {
        // Ở đầu danh sách: 1, 2, 3, 4, ... last
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Ở cuối danh sách: 1, ..., last-3, last-2, last-1, last
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa danh sách: 1, ..., current-1, current, current+1, ..., last
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

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Nhân viên</h1>
          <p className="text-gray-600 mt-2">Danh sách và thông tin nhân viên</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const today = new Date();
              setShowCalendarModal(true);
              setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(today);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calendar_month</span>
            <span>Xem lịch phân ca</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditing(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
            <span>Thêm nhân viên</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="flex-1 flex w-full items-center rounded-lg h-10 border border-gray-200 bg-gray-50 overflow-hidden">
              <div className="text-gray-600 flex items-center justify-center pl-3 pr-2 h-full">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, số điện thoại, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-full bg-transparent border-0 outline-0 text-gray-800 placeholder:text-gray-600 pl-2 pr-4 text-sm font-normal focus:ring-0"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                {showFilters ? 'filter_alt' : 'tune'}
              </span>
              <span>Bộ lọc</span>
              {hasActiveFilters && (
                <span className="bg-white text-[#4A90E2] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {[search, filterVaiTro].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Bộ lọc</h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filter: Vai trò */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  value={filterVaiTro}
                  onChange={(e) => setFilterVaiTro(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="dieu_duong">Điều dưỡng</option>
                  <option value="dieu_duong_truong">Điều dưỡng trưởng</option>
                  <option value="quan_ly_y_te">Quản lý Y tế</option>
                  <option value="quan_ly_nhan_su">Quản lý Nhân sự</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="inline-block">Đang tải...</div>
          </div>
        ) : nhanViens.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_off</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có nhân viên nào</p>
            <p className="text-gray-400 text-sm">Bấm "Thêm nhân viên" để bắt đầu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vai trò</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Chức vụ</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {nhanViens.map((nv) => (
                  <tr key={nv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {nv.ho_ten?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{nv.ho_ten}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.so_dien_thoai}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.email}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#4A90E2]/20 text-[#4A90E2] capitalize">
                        {nv.vai_tro?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{nv.chuc_vu || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(nv)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={() => handleOpenPhanCa(nv)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold"
                        >
                          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                          <span>Phân ca</span>
                        </button>
                        {(nv.vai_tro === 'dieu_duong' || nv.vai_tro === 'dieu_duong_truong') && (
                          <button
                            onClick={() => handleOpenQuanLyBenhNhan(nv)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-semibold"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>people</span>
                            <span>Quản lý BN</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && nhanViens.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 font-medium">Hiển thị:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
              >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">
                / Tổng: {totalItems} nhân viên
              </span>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={page === '...'}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors min-w-[40px] ${
                    page === '...'
                      ? 'bg-transparent text-gray-400 cursor-default'
                      : page === currentPage
                      ? 'bg-[#4A90E2] text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentPage === totalPages
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  resetForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, ho_ten: value });
                      // Validate on change
                      const error = validateHoTen(value);
                      setHoTenError(error);
                    }}
                    onBlur={(e) => {
                      // Trim và normalize khi blur
                      const trimmed = e.target.value.trim().replace(/\s+/g, ' ');
                      if (trimmed !== e.target.value) {
                        setFormData({ ...formData, ho_ten: trimmed });
                      }
                      const error = validateHoTen(trimmed);
                      setHoTenError(error);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2 text-gray-800 ${
                      hoTenError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#4A90E2]/50'
                    }`}
                    placeholder="Nhập họ và tên (chỉ chữ cái, dấu cách và dấu tiếng Việt)"
                  />
                  {hoTenError && (
                    <p className="mt-1 text-sm text-red-500">{hoTenError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.so_dien_thoai}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cho phép số, dấu + và khoảng trắng
                      const cleaned = value.replace(/[^\d+\s-]/g, '');
                      setFormData({ ...formData, so_dien_thoai: cleaned });
                      // Validate on change
                      const error = validateSoDienThoai(cleaned);
                      setSoDienThoaiError(error);
                    }}
                    onBlur={(e) => {
                      // Trim khi blur
                      const trimmed = e.target.value.trim();
                      if (trimmed !== e.target.value) {
                        setFormData({ ...formData, so_dien_thoai: trimmed });
                      }
                      const error = validateSoDienThoai(trimmed);
                      setSoDienThoaiError(error);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2 text-gray-800 ${
                      soDienThoaiError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#4A90E2]/50'
                    }`}
                    placeholder="Nhập số điện thoại (VD: 0912345678 hoặc +84912345678)"
                  />
                  {soDienThoaiError && (
                    <p className="mt-1 text-sm text-red-500">{soDienThoaiError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, email: value });
                      // Validate on change
                      const error = validateEmail(value);
                      setEmailError(error);
                    }}
                    onBlur={(e) => {
                      // Trim và lowercase khi blur
                      const trimmed = e.target.value.trim().toLowerCase();
                      if (trimmed !== e.target.value) {
                        setFormData({ ...formData, email: trimmed });
                      }
                      const error = validateEmail(trimmed);
                      setEmailError(error);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2 text-gray-800 ${
                      emailError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#4A90E2]/50'
                    }`}
                    placeholder="Nhập email (VD: example@email.com)"
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                {!editing && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mật khẩu *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required={!editing}
                        value={formData.mat_khau}
                        onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                        className="w-full px-4 py-2.5 pr-12 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        title={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                      >
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <select
                    value={formData.vai_tro}
                    onChange={(e) => setFormData({ ...formData, vai_tro: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="dieu_duong">Điều dưỡng</option>
                    <option value="dieu_duong_truong">Điều dưỡng trưởng</option>
                    <option value="quan_ly_y_te">Quản lý Y tế</option>
                    <option value="quan_ly_nhan_su">Quản lý Nhân sự</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    value={formData.chuc_vu}
                    onChange={(e) => setFormData({ ...formData, chuc_vu: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bằng cấp
                  </label>
                  <input
                    type="text"
                    value={formData.bang_cap}
                    onChange={(e) => setFormData({ ...formData, bang_cap: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lương cơ bản
                  </label>
                  <input
                    type="number"
                    value={formData.luong_co_ban}
                    onChange={(e) => setFormData({ ...formData, luong_co_ban: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CCCD/CMND
                  </label>
                  <input
                    type="text"
                    value={formData.cccd}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cho phép số
                      const cleaned = value.replace(/[^\d]/g, '');
                      setFormData({ ...formData, cccd: cleaned });
                      // Validate on change
                      const error = validateCCCD(cleaned);
                      setCccdError(error);
                    }}
                    onBlur={(e) => {
                      // Trim khi blur
                      const trimmed = e.target.value.trim();
                      if (trimmed !== e.target.value) {
                        setFormData({ ...formData, cccd: trimmed });
                      }
                      const error = validateCCCD(trimmed);
                      setCccdError(error);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2 text-gray-800 ${
                      cccdError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#4A90E2]/50'
                    }`}
                    placeholder="Nhập số CCCD/CMND (9 hoặc 12 số) - Tùy chọn"
                    maxLength={12}
                  />
                  {cccdError && (
                    <p className="mt-1 text-sm text-red-500">{cccdError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số BHYT
                  </label>
                  <input
                    type="text"
                    value={formData.so_bhyt}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Chỉ cho phép số
                      const cleaned = value.replace(/[^\d]/g, '');
                      setFormData({ ...formData, so_bhyt: cleaned });
                      // Validate on change
                      const error = validateBHYT(cleaned);
                      setSoBhytError(error);
                    }}
                    onBlur={(e) => {
                      // Trim khi blur
                      const trimmed = e.target.value.trim();
                      if (trimmed !== e.target.value) {
                        setFormData({ ...formData, so_bhyt: trimmed });
                      }
                      const error = validateBHYT(trimmed);
                      setSoBhytError(error);
                    }}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2 text-gray-800 ${
                      soBhytError ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-200 focus:ring-[#4A90E2]/50'
                    }`}
                    placeholder="Nhập số BHYT (10-15 số) - Tùy chọn"
                    maxLength={15}
                  />
                  {soBhytError && (
                    <p className="mt-1 text-sm text-red-500">{soBhytError}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <textarea
                    value={formData.dia_chi}
                    onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập địa chỉ"
                    rows={2}
                  />
                </div>
                
                {/* Chuyên môn */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chuyên môn
                  </label>
                  <textarea
                    value={formData.chuyen_mon}
                    onChange={(e) => setFormData({ ...formData, chuyen_mon: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập chuyên môn, kỹ năng..."
                    rows={3}
                  />
                </div>
                
                {/* Số năm kinh nghiệm */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số năm kinh nghiệm
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.so_nam_kinh_nghiem}
                    onChange={(e) => setFormData({ ...formData, so_nam_kinh_nghiem: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập số năm"
                  />
                </div>
                
                {/* Số bệnh nhân đã điều trị */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số bệnh nhân đã điều trị
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.so_benh_nhan_da_dieu_tri}
                    onChange={(e) => setFormData({ ...formData, so_benh_nhan_da_dieu_tri: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập số lượng"
                  />
                </div>
                
                {/* Nơi công tác */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nơi công tác
                  </label>
                  <input
                    type="text"
                    value={formData.noi_cong_tac}
                    onChange={(e) => setFormData({ ...formData, noi_cong_tac: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập nơi công tác"
                  />
                </div>
                
                {/* Đánh giá */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <textarea
                    value={formData.danh_gia}
                    onChange={(e) => setFormData({ ...formData, danh_gia: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập đánh giá về nhân viên..."
                    rows={3}
                  />
                </div>
                
                {/* Lịch làm việc */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lịch làm việc
                  </label>
                  <textarea
                    value={formData.lich_lam_viec}
                    onChange={(e) => setFormData({ ...formData, lich_lam_viec: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập lịch làm việc (ví dụ: Thứ 2-6: 8h-17h, Thứ 7: 8h-12h)"
                    rows={3}
                  />
                </div>
              </div>

              {/* Media hồ sơ nhân viên */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">Tài liệu hồ sơ</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Ảnh CCCD */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh CCCD/CMND
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleUploadMedia(file, 'anh_cccd');
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                        disabled={uploadingMedia.anh_cccd}
                      />
                      {mediaHoSo.anh_cccd && (
                        <div className="relative">
                          <a href={mediaHoSo.anh_cccd} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A90E2] hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                            Xem file
                          </a>
                          <button
                            type="button"
                            onClick={() => setMediaHoSo(prev => ({ ...prev, anh_cccd: '' }))}
                            className="absolute right-0 top-0 text-red-600 hover:text-red-700"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ảnh bằng đại học */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh bằng đại học
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleUploadMedia(file, 'anh_bangdh');
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                        disabled={uploadingMedia.anh_bangdh}
                      />
                      {mediaHoSo.anh_bangdh && (
                        <div className="relative">
                          <a href={mediaHoSo.anh_bangdh} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A90E2] hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                            Xem file
                          </a>
                          <button
                            type="button"
                            onClick={() => setMediaHoSo(prev => ({ ...prev, anh_bangdh: '' }))}
                            className="absolute right-0 top-0 text-red-600 hover:text-red-700"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ảnh BHYT */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh BHYT
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleUploadMedia(file, 'anh_bhyt');
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                        disabled={uploadingMedia.anh_bhyt}
                      />
                      {mediaHoSo.anh_bhyt && (
                        <div className="relative">
                          <a href={mediaHoSo.anh_bhyt} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A90E2] hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                            Xem file
                          </a>
                          <button
                            type="button"
                            onClick={() => setMediaHoSo(prev => ({ ...prev, anh_bhyt: '' }))}
                            className="absolute right-0 top-0 text-red-600 hover:text-red-700"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ảnh CV */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ảnh CV/Resume
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleUploadMedia(file, 'anh_cv');
                        }}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                        disabled={uploadingMedia.anh_cv}
                      />
                      {mediaHoSo.anh_cv && (
                        <div className="relative">
                          <a href={mediaHoSo.anh_cv} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4A90E2] hover:underline flex items-center gap-1">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                            Xem file
                          </a>
                          <button
                            type="button"
                            onClick={() => setMediaHoSo(prev => ({ ...prev, anh_cv: '' }))}
                            className="absolute right-0 top-0 text-red-600 hover:text-red-700"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{editing ? 'save' : 'add'}</span>
                  <span>{editing ? 'Cập nhật' : 'Thêm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Phân ca */}
      {showPhanCaModal && selectedNhanVien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  Lịch phân ca
                </h2>
                <p className="text-gray-600 mt-1">{selectedNhanVien.ho_ten}</p>
              </div>
              <button
                onClick={() => {
                  setShowPhanCaModal(false);
                  setSelectedNhanVien(null);
                  setLichPhanCa([]);
                  handleClearPhanCaFilters();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => handleOpenPhanCaForm()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Thêm phân ca</span>
                </button>
              </div>

              {/* Filters for phan ca */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Bộ lọc</h3>
                  {hasActivePhanCaFilters && (
                    <button
                      onClick={handleClearPhanCaFilters}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                      <span>Xóa bộ lọc</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Filter: Ngày */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ngày
                    </label>
                    <input
                      type="date"
                      value={filterPhanCaNgay}
                      onChange={(e) => setFilterPhanCaNgay(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    />
                  </div>

                  {/* Filter: Ca */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ca
                    </label>
                    <select
                      value={filterPhanCaCa}
                      onChange={(e) => setFilterPhanCaCa(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="sang">Ca sáng</option>
                      <option value="chieu">Ca chiều</option>
                      <option value="dem">Ca đêm</option>
                    </select>
                  </div>

                  {/* Filter: Trạng thái */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={filterPhanCaTrangThai}
                      onChange={(e) => setFilterPhanCaTrangThai(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="du_kien">Dự kiến</option>
                      <option value="dang_truc">Đang trực</option>
                      <option value="hoan_thanh">Hoàn thành</option>
                      <option value="vang">Vắng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {lichPhanCa.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                <p className="text-gray-500 text-lg mb-2">Chưa có lịch phân ca</p>
                <p className="text-gray-400 text-sm">Bấm "Thêm phân ca" để bắt đầu</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ca</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giờ bắt đầu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giờ kết thúc</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredLichPhanCa().length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center">
                            <span className="material-symbols-outlined text-4xl text-gray-300 mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search_off</span>
                            <p className="text-gray-500 text-sm">Không tìm thấy ca nào phù hợp với bộ lọc</p>
                          </td>
                        </tr>
                      ) : (
                        getFilteredLichPhanCa().map((ca) => (
                        <tr key={ca.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {new Date(ca.ngay).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{getCaLabel(ca.ca)}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{ca.gio_bat_dau}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{ca.gio_ket_thuc}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                              {getTrangThaiLabel(ca.trang_thai)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenPhanCaForm(ca)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeletePhanCa(ca.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                <span>Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Form phân ca */}
      {showPhanCaForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">
                {editingPhanCa ? 'Sửa phân ca' : 'Thêm phân ca mới'}
              </h2>
              <button
                onClick={() => {
                  setShowPhanCaForm(false);
                  setEditingPhanCa(null);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handlePhanCaSubmit} className="space-y-5">
              {/* Chọn nhân viên - chỉ hiển thị khi không có selectedNhanVien (tạo từ calendar view) */}
              {!selectedNhanVien && !editingPhanCa && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nhân viên *</label>
                  <select
                    required
                    value={phanCaForm.id_tai_khoan || ''}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, id_tai_khoan: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="">Chọn nhân viên</option>
                    {nhanViens.map((nv) => (
                      <option key={nv.id} value={nv.id}>
                        {nv.ho_ten} - {nv.vai_tro?.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày *</label>
                <input
                  type="date"
                  required
                  value={phanCaForm.ngay}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, ngay: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ca *</label>
                <select
                  required
                  value={phanCaForm.ca}
                  onChange={(e) => handleCaChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="sang">Ca sáng (06:00 - 14:00)</option>
                  <option value="chieu">Ca chiều (14:00 - 22:00)</option>
                  <option value="dem">Ca đêm (22:00 - 06:00)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_bat_dau}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_bat_dau: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Giờ kết thúc *</label>
                  <input
                    type="time"
                    required
                    value={phanCaForm.gio_ket_thuc}
                    onChange={(e) => setPhanCaForm({ ...phanCaForm, gio_ket_thuc: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={phanCaForm.trang_thai}
                  onChange={(e) => setPhanCaForm({ ...phanCaForm, trang_thai: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="du_kien">Dự kiến</option>
                  <option value="dang_truc">Đang trực</option>
                  <option value="hoan_thanh">Hoàn thành</option>
                  <option value="vang">Vắng</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanCaForm(false);
                    setEditingPhanCa(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{editingPhanCa ? 'save' : 'add'}</span>
                  <span>{editingPhanCa ? 'Cập nhật' : 'Thêm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Calendar View */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Lịch phân ca</h2>
              <button
                onClick={() => {
                  setShowCalendarModal(false);
                  setSelectedDate(null);
                  setPhanCaByDate([]);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={previousMonth}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
                    <span>Tháng trước</span>
                  </button>
                  <h3 className="text-xl font-bold text-gray-800 capitalize">
                    {formatMonthYear(currentMonth)}
                  </h3>
                  <button
                    onClick={nextMonth}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <span>Tháng sau</span>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-3 bg-gray-50 rounded-lg p-2">
                  {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square"></div>;
                    }
                    const hasCa = hasPhanCa(date);
                    const caCount = getPhanCaCount(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    
                    return (
                      <button
                        key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                        onClick={() => handleDateClick(date)}
                        className={`aspect-square border-2 rounded-lg p-2 text-sm hover:shadow-md transition-all ${
                          isSelected ? 'bg-[#4A90E2] border-[#4A90E2] text-white' : 
                          isToday ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-200' :
                          hasCa ? 'bg-green-50 border-green-300 hover:bg-green-100' :
                          'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center h-full justify-between">
                          <span className={`font-semibold ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                            {date.getDate()}
                          </span>
                          {hasCa && (
                            <span className={`text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold ${
                              isSelected ? 'bg-white text-[#4A90E2]' : 'bg-green-500 text-white'
                            }`}>
                              {caCount}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danh sách phân ca của ngày được chọn */}
              <div className="col-span-1 border-l border-gray-200 pl-6">
                {selectedDate && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">
                        {selectedDate.toLocaleDateString('vi-VN', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                    </div>
                    <div className="mb-4">
                      <button
                        onClick={() => {
                          const defaultCa = 'sang';
                          const defaultTime = getCaTime(defaultCa);
                          const selectedDateStr = formatDateForComparison(selectedDate);
                          setPhanCaForm({
                            ca: defaultCa,
                            ngay: selectedDateStr,
                            gio_bat_dau: defaultTime.gio_bat_dau,
                            gio_ket_thuc: defaultTime.gio_ket_thuc,
                            trang_thai: 'du_kien'
                          });
                          setEditingPhanCa(null);
                          setSelectedNhanVien(null); // Không cần chọn nhân viên cụ thể trong calendar view
                          setShowCalendarModal(false);
                          setShowPhanCaForm(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                        <span>Tạo lịch phân ca</span>
                      </button>
                    </div>
                    {phanCaByDate.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>event_busy</span>
                        <p className="text-gray-500 text-sm">Không có phân ca trong ngày này</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {phanCaByDate.map((ca) => (
                          <div
                            key={ca.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {ca.ho_ten?.charAt(0)?.toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm text-gray-900">{ca.ho_ten}</div>
                                <div className="text-xs text-gray-600 mt-0.5">
                                  {getCaLabel(ca.ca)}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>schedule</span>
                              <span>{ca.gio_bat_dau} - {ca.gio_ket_thuc}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(ca.trang_thai)}`}>
                                {getTrangThaiLabel(ca.trang_thai)}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const nv = nhanViens.find(n => n.id === ca.id_tai_khoan);
                                    if (nv) {
                                      setSelectedNhanVien(nv);
                                      handleOpenPhanCaForm(ca);
                                      setShowCalendarModal(false);
                                      setShowPhanCaModal(true);
                                    }
                                  }}
                                  className="flex items-center justify-center w-7 h-7 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors"
                                  title="Sửa"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('Bạn có chắc muốn xóa phân ca này?')) {
                                      try {
                                        await nhanVienAPI.deleteLichPhanCa(ca.id);
                                        alert('Xóa phân ca thành công');
                                        await loadAllLichPhanCa();
                                        if (selectedDate) {
                                          handleDateClick(selectedDate);
                                        }
                                      } catch (error) {
                                        alert('Lỗi: ' + error.message);
                                      }
                                    }
                                  }}
                                  className="flex items-center justify-center w-7 h-7 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Xóa"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
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
      )}

      {/* Modal: Chuyển ca */}
      {showChuyenCaModal && caCanChuyen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">Chuyển ca</h2>
              <button
                onClick={() => {
                  setShowChuyenCaModal(false);
                  setCaCanChuyen(null);
                  setSelectedNhanVienMoi('');
                  setShowPhanCaForm(true);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Ca cần chuyển:
              </p>
              <p className="text-sm text-gray-900 font-medium">
                {new Date(caCanChuyen.ngay).toLocaleDateString('vi-VN')} - {getCaLabel(caCanChuyen.ca)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {caCanChuyen.gio_bat_dau} - {caCanChuyen.gio_ket_thuc}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chọn nhân viên để chuyển ca *
              </label>
              <select
                value={selectedNhanVienMoi}
                onChange={(e) => setSelectedNhanVienMoi(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                required
              >
                <option value="">Chọn nhân viên</option>
                {nhanViens
                  .filter(nv => nv.id !== caCanChuyen.id_tai_khoan)
                  .map((nv) => (
                    <option key={nv.id} value={nv.id}>
                      {nv.ho_ten} - {nv.vai_tro?.replace('_', ' ')}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowChuyenCaModal(false);
                  setCaCanChuyen(null);
                  setSelectedNhanVienMoi('');
                  setShowPhanCaForm(true);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleChuyenCa}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                <span>Chuyển ca</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Quản lý bệnh nhân */}
      {showQuanLyBenhNhanModal && selectedNhanVien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-black text-gray-800">
                  Quản lý bệnh nhân
                </h2>
                <p className="text-gray-600 mt-1">{selectedNhanVien.ho_ten}</p>
              </div>
              <button
                onClick={() => {
                  setShowQuanLyBenhNhanModal(false);
                  setSelectedNhanVien(null);
                  setBenhNhansQuanLy([]);
                  setFilterTrangThaiQuanLy('');
                  setSearchBenhNhan('');
                  setShowAssignForm(false);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Gán bệnh nhân mới</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tìm kiếm
                    </label>
                    <input
                      type="text"
                      placeholder="Tìm theo tên, CCCD..."
                      value={searchBenhNhan}
                      onChange={(e) => setSearchBenhNhan(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={filterTrangThaiQuanLy}
                      onChange={(e) => setFilterTrangThaiQuanLy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="dang_quan_ly">Đang quản lý</option>
                      <option value="ket_thuc">Kết thúc</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {loadingBenhNhans ? (
              <div className="p-16 text-center text-gray-500">
                <div className="inline-block">Đang tải...</div>
              </div>
            ) : benhNhansQuanLy.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>people</span>
                <p className="text-gray-500 text-lg mb-2">Chưa có bệnh nhân nào được gán</p>
                <p className="text-gray-400 text-sm">Bấm "Gán bệnh nhân mới" để bắt đầu</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CCCD</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày bắt đầu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày kết thúc</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {benhNhansQuanLy.map((bn) => (
                        <tr key={bn.id_quan_ly} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {bn.ho_ten?.charAt(0)?.toUpperCase()}
                              </div>
                              <span className="font-semibold text-gray-900">{bn.ho_ten}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{bn.cccd || '-'}</td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {bn.ngay_bat_dau ? new Date(bn.ngay_bat_dau).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {bn.ngay_ket_thuc ? new Date(bn.ngay_ket_thuc).toLocaleDateString('vi-VN') : '-'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTrangThaiQuanLyColor(bn.trang_thai_quan_ly)}`}>
                              {getTrangThaiQuanLyLabel(bn.trang_thai_quan_ly)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            {bn.trang_thai_quan_ly === 'dang_quan_ly' && (
                              <button
                                onClick={() => handleRemoveBenhNhan(bn.id_quan_ly)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_remove</span>
                                <span>Xóa</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Form gán bệnh nhân */}
      {showAssignForm && selectedNhanVien && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-800">
                Gán bệnh nhân mới
              </h2>
              <button
                onClick={() => {
                  setShowAssignForm(false);
                  setAssignForm({
                    id_benh_nhan: '',
                    ngay_bat_dau: new Date().toISOString().split('T')[0],
                    ghi_chu: ''
                  });
                  setBenhNhanSearchInput('');
                  setShowBenhNhanDropdown(false);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleAssignBenhNhan} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bệnh nhân *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={benhNhanSearchInput}
                    onChange={(e) => {
                      setBenhNhanSearchInput(e.target.value);
                      setShowBenhNhanDropdown(true);
                      if (!e.target.value) {
                        setAssignForm({ ...assignForm, id_benh_nhan: '' });
                      }
                    }}
                    onFocus={() => setShowBenhNhanDropdown(true)}
                    onBlur={() => {
                      // Delay để cho phép click vào dropdown item
                      setTimeout(() => setShowBenhNhanDropdown(false), 200);
                    }}
                    placeholder="Tìm kiếm bệnh nhân..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                  {showBenhNhanDropdown && allBenhNhans.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {(benhNhanSearchInput
                        ? allBenhNhans.filter(bn => 
                            bn.ho_ten?.toLowerCase().includes(benhNhanSearchInput.toLowerCase()) ||
                            bn.cccd?.includes(benhNhanSearchInput)
                          )
                        : allBenhNhans.slice(0, 5)
                      ).map((bn) => (
                        <div
                          key={bn.id}
                          onClick={() => {
                            setAssignForm({ ...assignForm, id_benh_nhan: bn.id });
                            setBenhNhanSearchInput(`${bn.ho_ten}${bn.cccd ? ` - ${bn.cccd}` : ''}`);
                            setShowBenhNhanDropdown(false);
                          }}
                          className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-semibold text-gray-900">{bn.ho_ten}</div>
                          {bn.cccd && (
                            <div className="text-sm text-gray-500">CCCD: {bn.cccd}</div>
                          )}
                        </div>
                      ))}
                      {benhNhanSearchInput && allBenhNhans.filter(bn => 
                        bn.ho_ten?.toLowerCase().includes(benhNhanSearchInput.toLowerCase()) ||
                        bn.cccd?.includes(benhNhanSearchInput)
                      ).length === 0 && (
                        <div className="px-4 py-2.5 text-gray-500 text-sm">
                          Không tìm thấy bệnh nhân
                        </div>
                      )}
                    </div>
                  )}
                  {showBenhNhanDropdown && allBenhNhans.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="px-4 py-2.5 text-gray-500 text-sm">
                        Tất cả bệnh nhân đã được gán
                      </div>
                    </div>
                  )}
                </div>
                {assignForm.id_benh_nhan && (
                  <input type="hidden" value={assignForm.id_benh_nhan} required />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày bắt đầu *</label>
                <input
                  type="date"
                  required
                  value={assignForm.ngay_bat_dau}
                  onChange={(e) => setAssignForm({ ...assignForm, ngay_bat_dau: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={assignForm.ghi_chu}
                  onChange={(e) => setAssignForm({ ...assignForm, ghi_chu: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Nhập ghi chú (nếu có)"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignForm(false);
                    setAssignForm({
                      id_benh_nhan: '',
                      ngay_bat_dau: new Date().toISOString().split('T')[0],
                      ghi_chu: ''
                    });
                    setBenhNhanSearchInput('');
                    setShowBenhNhanDropdown(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                  <span>Gán bệnh nhân</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

