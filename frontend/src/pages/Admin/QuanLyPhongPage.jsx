import { useEffect, useState } from 'react';
import { phanKhuAPI, phongNewAPI, uploadAPI, phongAPI, loaiPhongAPI } from '../../services/api';

export default function QuanLyPhongPage() {
  const [activeTab, setActiveTab] = useState('phan-khu'); // 'phan-khu' or 'phong'
  
  // Phân khu state
  const [phanKhus, setPhanKhus] = useState([]);
  const [loadingPhanKhu, setLoadingPhanKhu] = useState(true);
  const [showPhanKhuModal, setShowPhanKhuModal] = useState(false);
  const [editingPhanKhu, setEditingPhanKhu] = useState(null);
  const [phanKhuForm, setPhanKhuForm] = useState({
    ten_khu: '',
    mo_ta: '',
    so_tang: '',
    so_phong: '',
  });

  // Phòng state
  const [phongs, setPhongs] = useState([]);
  const [loadingPhong, setLoadingPhong] = useState(true);
  const [showPhongModal, setShowPhongModal] = useState(false);
  const [editingPhong, setEditingPhong] = useState(null);
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [phongForm, setPhongForm] = useState({
    id_loai_phong: '',
    id_phan_khu: '',
    ten_phong: '',
    so_phong: '',
    so_giuong: '',
    so_nguoi_toi_da: 1,
    dien_tich: '',
    mo_ta: '',
    trang_thai: 'trong',
    anh_1: '',
    anh_2: '',
    anh_3: '',
  });
  const [uploadingImages, setUploadingImages] = useState({ anh_1: false, anh_2: false, anh_3: false });
  const [selectedPhanKhu, setSelectedPhanKhu] = useState('');
  const [phongTrangThaiFilter, setPhongTrangThaiFilter] = useState('');
  const [phongSearch, setPhongSearch] = useState('');
  const [showPhongDetailModal, setShowPhongDetailModal] = useState(false);
  const [selectedPhongDetail, setSelectedPhongDetail] = useState(null);

  useEffect(() => {
    if (activeTab === 'phan-khu') {
      loadPhanKhus();
    } else {
      loadPhanKhus(); // Load phân khu để có thể chọn khi tạo/sửa phòng và filter
      loadPhongs();
      loadLoaiPhongs(); // Load loại phòng để có thể chọn khi tạo/sửa phòng
    }
  }, [activeTab]);

  // Lắng nghe sự kiện phongUpdated để reload lại danh sách phòng
  useEffect(() => {
    const handlePhongUpdated = () => {
      if (activeTab === 'phong') {
        loadPhongs(selectedPhanKhu || null, phongTrangThaiFilter || null, phongSearch || null);
      }
    };

    window.addEventListener('phongUpdated', handlePhongUpdated);
    
    return () => {
      window.removeEventListener('phongUpdated', handlePhongUpdated);
    };
  }, [activeTab, selectedPhanKhu, phongTrangThaiFilter, phongSearch]);

  // Load phân khu
  const loadPhanKhus = async () => {
    try {
      setLoadingPhanKhu(true);
      const response = await phanKhuAPI.getAll();
      setPhanKhus(response.data || []);
    } catch (error) {
      console.error('Error loading phan khus:', error);
      alert('Lỗi khi tải danh sách phân khu: ' + error.message);
    } finally {
      setLoadingPhanKhu(false);
    }
  };

  // Load phòng
  const loadPhongs = async (idPhanKhu = null, trangThai = null, search = null) => {
    try {
      setLoadingPhong(true);
      const params = {};
      if (idPhanKhu) params.id_phan_khu = idPhanKhu;
      if (trangThai) params.trang_thai = trangThai;
      if (search) params.search = search;
      const response = await phongNewAPI.getAll(params);
      setPhongs(response.data || []);
    } catch (error) {
      console.error('Error loading phongs:', error);
      alert('Lỗi khi tải danh sách phòng: ' + error.message);
    } finally {
      setLoadingPhong(false);
    }
  };

  // Load loại phòng
  const loadLoaiPhongs = async () => {
    try {
      const response = await loaiPhongAPI.getAll();
      setLoaiPhongs(response.data || []);
    } catch (error) {
      console.error('Error loading loai phongs:', error);
    }
  };

  // Phân khu handlers
  const handleSubmitPhanKhu = async (e) => {
    e.preventDefault();
    try {
      if (editingPhanKhu) {
        await phanKhuAPI.update(editingPhanKhu.id, phanKhuForm);
        alert('Cập nhật phân khu thành công');
      } else {
        await phanKhuAPI.create(phanKhuForm);
        alert('Tạo phân khu thành công');
      }
      setShowPhanKhuModal(false);
      setEditingPhanKhu(null);
      resetPhanKhuForm();
      loadPhanKhus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditPhanKhu = (pk) => {
    setEditingPhanKhu(pk);
    setPhanKhuForm({
      ten_khu: pk.ten_khu || '',
      mo_ta: pk.mo_ta || '',
      so_tang: pk.so_tang || '',
      so_phong: pk.so_phong || '',
    });
    setShowPhanKhuModal(true);
  };

  const handleDeletePhanKhu = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phân khu này?')) return;
    try {
      await phanKhuAPI.delete(id);
      alert('Xóa phân khu thành công');
      loadPhanKhus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetPhanKhuForm = () => {
    setPhanKhuForm({
      ten_khu: '',
      mo_ta: '',
      so_tang: '',
      so_phong: '',
    });
  };

  // Phòng handlers
  const handleSubmitPhong = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo so_nguoi_toi_da có giá trị hợp lệ (tối thiểu là 1)
      const soNguoiToiDa = phongForm.so_nguoi_toi_da === '' || !phongForm.so_nguoi_toi_da || parseInt(phongForm.so_nguoi_toi_da) < 1 
        ? 1 
        : parseInt(phongForm.so_nguoi_toi_da);
      
      const submitData = {
        ...phongForm,
        id_loai_phong: phongForm.id_loai_phong || null,
        so_giuong: phongForm.so_giuong ? parseInt(phongForm.so_giuong) : null,
        so_nguoi_toi_da: soNguoiToiDa,
        dien_tich: phongForm.dien_tich ? parseFloat(phongForm.dien_tich) : null,
        anh_1: phongForm.anh_1 || null,
        anh_2: phongForm.anh_2 || null,
        anh_3: phongForm.anh_3 || null,
      };

      if (editingPhong) {
        await phongNewAPI.update(editingPhong.id, submitData);
        alert('Cập nhật phòng thành công');
      } else {
        await phongNewAPI.create(submitData);
        alert('Tạo phòng thành công');
      }
      setShowPhongModal(false);
      setEditingPhong(null);
      resetPhongForm();
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEditPhong = async (p) => {
    try {
      const fullPhong = await phongNewAPI.getById(p.id);
      const phongData = fullPhong.data;
      setEditingPhong(phongData);
      setPhongForm({
        id_loai_phong: phongData.id_loai_phong || '',
        id_phan_khu: phongData.id_phan_khu || '',
        ten_phong: phongData.ten_phong || '',
        so_phong: phongData.so_phong || '',
        so_giuong: phongData.so_giuong || '',
        so_nguoi_toi_da: phongData.so_nguoi_toi_da || 1,
        dien_tich: phongData.dien_tich || '',
        mo_ta: phongData.mo_ta || '',
        trang_thai: phongData.trang_thai || 'trong',
        anh_1: phongData.anh_1 || '',
        anh_2: phongData.anh_2 || '',
        anh_3: phongData.anh_3 || '',
      });
      setShowPhongModal(true);
    } catch (error) {
      console.error('Error loading phong:', error);
      alert('Lỗi khi tải dữ liệu phòng: ' + error.message);
    }
  };

  const handleDeletePhong = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
    try {
      await phongNewAPI.delete(id);
      alert('Xóa phòng thành công');
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetPhongForm = () => {
    setPhongForm({
      id_loai_phong: '',
      id_phan_khu: '',
      ten_phong: '',
      so_phong: '',
      so_giuong: '',
      so_nguoi_toi_da: 1,
      dien_tich: '',
      mo_ta: '',
      trang_thai: 'trong',
      anh_1: '',
      anh_2: '',
      anh_3: '',
    });
  };

  // Upload ảnh
  const handleUploadImage = async (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!imageTypes.includes(file.type)) {
      alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 20MB');
      return;
    }

    try {
      setUploadingImages({ ...uploadingImages, [imageField]: true });
      const response = await uploadAPI.uploadMedia(file);
      setPhongForm({ ...phongForm, [imageField]: response.data.url });
      e.target.value = ''; // Reset input
    } catch (error) {
      alert('Lỗi khi upload ảnh: ' + error.message);
    } finally {
      setUploadingImages({ ...uploadingImages, [imageField]: false });
    }
  };

  // Xử lý đổi phòng cho bệnh nhân
  const handleDoiPhong = (bn, currentPhong) => {
    alert('Chức năng đổi phòng sẽ được triển khai. Bệnh nhân: ' + bn.ho_ten + ', Phòng hiện tại: ' + currentPhong.ten_phong);
  };

  // Xử lý xóa bệnh nhân khỏi phòng
  const handleXoaBenhNhanKhoiPhong = async (phongBenhNhanId, phongId) => {
    if (!confirm('Bạn có chắc muốn xóa bệnh nhân khỏi phòng này?')) return;
    try {
      await phongAPI.delete(phongBenhNhanId);
      alert('Xóa bệnh nhân khỏi phòng thành công');
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Phân khu & Phòng</h1>
          <p className="text-gray-600 mt-2">Quản lý phân khu và phòng với hình ảnh</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('phan-khu')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'phan-khu'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phân khu
            </button>
            <button
              onClick={() => setActiveTab('phong')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'phong'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Phòng
            </button>
          </nav>
        </div>

        {/* Phân khu Tab */}
        {activeTab === 'phan-khu' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  resetPhanKhuForm();
                  setEditingPhanKhu(null);
                  setShowPhanKhuModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                <span>Tạo phân khu</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loadingPhanKhu ? (
                <div className="p-16 text-center text-gray-500">Đang tải...</div>
              ) : phanKhus.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>domain</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có phân khu nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo phân khu" để bắt đầu</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên khu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Mô tả</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số tầng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số phòng (dự kiến)</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số phòng (thực tế)</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {phanKhus.map((pk) => (
                        <tr key={pk.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 font-semibold text-gray-900">{pk.ten_khu}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{pk.mo_ta || '-'}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{pk.so_tang || '-'}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{pk.so_phong || '-'}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{pk.so_phong_thuc_te || 0}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditPhanKhu(pk)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeletePhanKhu(pk.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
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
              )}
            </div>
          </div>
        )}

        {/* Phòng Tab */}
        {activeTab === 'phong' && (
          <div className="p-6 lg:p-8 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lọc theo Phân khu</label>
                  <select
                    value={selectedPhanKhu || ''}
                    onChange={(e) => {
                      const newPhanKhu = e.target.value || '';
                      setSelectedPhanKhu(newPhanKhu);
                      loadPhongs(newPhanKhu, phongTrangThaiFilter, phongSearch);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="">Tất cả phân khu</option>
                    {phanKhus.map((pk) => (
                      <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lọc theo Trạng thái</label>
                  <select
                    value={phongTrangThaiFilter || ''}
                    onChange={(e) => {
                      const newTrangThai = e.target.value || '';
                      setPhongTrangThaiFilter(newTrangThai);
                      loadPhongs(selectedPhanKhu, newTrangThai, phongSearch);
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="">Tất cả</option>
                    <option value="trong">Trống</option>
                    <option value="co_nguoi">Có người</option>
                    <option value="bao_tri">Bảo trì</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
                  <div className="flex w-full items-center rounded-lg h-10 border border-gray-200 bg-gray-50 overflow-hidden">
                    <div className="text-gray-600 flex items-center justify-center pl-3 pr-2 h-full">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
                    </div>
                    <input
                      type="text"
                      value={phongSearch || ''}
                      onChange={(e) => {
                        const newSearch = e.target.value || '';
                        setPhongSearch(newSearch);
                        loadPhongs(selectedPhanKhu, phongTrangThaiFilter, newSearch);
                      }}
                      className="flex-1 h-full bg-transparent border-0 outline-0 text-gray-800 placeholder:text-gray-600 pl-2 pr-4 text-sm font-normal focus:ring-0"
                      placeholder="Tên phòng, số phòng..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={async () => {
                  await loadPhanKhus(); // Đảm bảo có danh sách phân khu
                  resetPhongForm();
                  setEditingPhong(null);
                  setShowPhongModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                <span>Tạo phòng</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loadingPhong ? (
                <div className="p-16 text-center text-gray-500">Đang tải...</div>
              ) : phongs.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có phòng nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo phòng" để bắt đầu</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phân khu</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên phòng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số phòng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số giường</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Diện tích</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số người</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {phongs.map((p) => (
                        <tr 
                          key={p.id} 
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={async () => {
                            try {
                              const fullPhong = await phongNewAPI.getById(p.id);
                              setSelectedPhongDetail(fullPhong.data);
                              setShowPhongDetailModal(true);
                            } catch (error) {
                              console.error('Error loading phong detail:', error);
                              alert('Lỗi khi tải thông tin phòng: ' + error.message);
                            }
                          }}
                        >
                          <td className="px-6 py-5 text-sm text-gray-900">{p.ten_khu}</td>
                          <td className="px-6 py-5 font-semibold text-gray-900">{p.ten_phong}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{p.so_phong || '-'}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{p.so_giuong || '-'}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{p.dien_tich ? `${p.dien_tich} m²` : '-'}</td>
                          <td className="px-6 py-5">
                            <div className="text-sm">
                              <span className="font-semibold text-gray-900">
                                {p.benh_nhans?.length || 0}
                              </span>
                              <span className="text-gray-500"> / </span>
                              <span className="text-gray-600">
                                {p.so_nguoi_toi_da || 1}
                              </span>
                              {p.benh_nhans?.length >= (p.so_nguoi_toi_da || 1) && (
                                <span className="ml-2 text-xs text-red-600 font-semibold">(Đầy)</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              p.trang_thai === 'trong' ? 'bg-green-100 text-green-800' :
                              p.trang_thai === 'co_nguoi' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {p.trang_thai?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleEditPhong(p)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDeletePhong(p.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold"
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Phân khu */}
      {showPhanKhuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editingPhanKhu ? 'Sửa phân khu' : 'Tạo phân khu mới'}
              </h2>
              <button
                onClick={() => {
                  setShowPhanKhuModal(false);
                  setEditingPhanKhu(null);
                  resetPhanKhuForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitPhanKhu} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên khu *
                </label>
                <input
                  type="text"
                  required
                  value={phanKhuForm.ten_khu}
                  onChange={(e) => setPhanKhuForm({ ...phanKhuForm, ten_khu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={phanKhuForm.mo_ta}
                  onChange={(e) => setPhanKhuForm({ ...phanKhuForm, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số tầng
                  </label>
                  <input
                    type="number"
                    value={phanKhuForm.so_tang}
                    onChange={(e) => setPhanKhuForm({ ...phanKhuForm, so_tang: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số phòng (dự kiến)
                  </label>
                  <input
                    type="number"
                    value={phanKhuForm.so_phong}
                    onChange={(e) => setPhanKhuForm({ ...phanKhuForm, so_phong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhanKhuModal(false);
                    setEditingPhanKhu(null);
                    resetPhanKhuForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>{editingPhanKhu ? 'Cập nhật' : 'Tạo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Phòng */}
      {showPhongModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editingPhong ? 'Sửa phòng' : 'Tạo phòng mới'}
              </h2>
              <button
                onClick={() => {
                  setShowPhongModal(false);
                  setEditingPhong(null);
                  resetPhongForm();
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmitPhong} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phân khu *
                </label>
                <select
                  required
                  value={phongForm.id_phan_khu}
                  onChange={(e) => setPhongForm({ ...phongForm, id_phan_khu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="">Chọn phân khu</option>
                  {phanKhus.map((pk) => (
                    <option key={pk.id} value={pk.id}>{pk.ten_khu}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loại phòng
                </label>
                <select
                  value={phongForm.id_loai_phong}
                  onChange={(e) => setPhongForm({ ...phongForm, id_loai_phong: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="">Chọn loại phòng (tùy chọn)</option>
                  {loaiPhongs.map((lp) => (
                    <option key={lp.id} value={lp.id}>{lp.ten || `Loại phòng #${lp.id}`}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên phòng *
                  </label>
                  <input
                    type="text"
                    required
                    value={phongForm.ten_phong}
                    onChange={(e) => setPhongForm({ ...phongForm, ten_phong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số phòng
                  </label>
                  <input
                    type="text"
                    value={phongForm.so_phong}
                    onChange={(e) => setPhongForm({ ...phongForm, so_phong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số giường
                  </label>
                  <input
                    type="number"
                    value={phongForm.so_giuong}
                    onChange={(e) => setPhongForm({ ...phongForm, so_giuong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số người tối đa *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={phongForm.so_nguoi_toi_da === '' ? '' : phongForm.so_nguoi_toi_da}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Cho phép giá trị rỗng để người dùng có thể xóa và nhập lại
                      if (value === '') {
                        setPhongForm({ ...phongForm, so_nguoi_toi_da: '' });
                      } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue) && numValue >= 1) {
                          setPhongForm({ ...phongForm, so_nguoi_toi_da: numValue });
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // Khi blur, đảm bảo có giá trị hợp lệ (tối thiểu là 1)
                      const value = e.target.value;
                      if (value === '' || parseInt(value) < 1 || isNaN(parseInt(value))) {
                        setPhongForm({ ...phongForm, so_nguoi_toi_da: 1 });
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Số lượng tối đa bệnh nhân có thể ở trong phòng"
                  />
                  <p className="text-xs text-gray-500 mt-1">Số lượng tối đa bệnh nhân có thể ở trong phòng này</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={phongForm.dien_tich}
                    onChange={(e) => setPhongForm({ ...phongForm, dien_tich: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={phongForm.trang_thai}
                    onChange={(e) => setPhongForm({ ...phongForm, trang_thai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="trong">Trống</option>
                    <option value="co_nguoi">Có người</option>
                    <option value="bao_tri">Bảo trì</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={phongForm.mo_ta}
                  onChange={(e) => setPhongForm({ ...phongForm, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="3"
                />
              </div>

              {/* Upload 3 ảnh */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800">Hình ảnh phòng (3 ảnh)</h3>
                {[1, 2, 3].map((num) => {
                  const imageField = `anh_${num}`;
                  return (
                    <div key={num} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ảnh {num}
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(e, imageField)}
                          disabled={uploadingImages[imageField]}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A90E2]/10 file:text-[#4A90E2] hover:file:bg-[#4A90E2]/20 disabled:opacity-50"
                        />
                        {uploadingImages[imageField] && (
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sync</span>
                            Đang tải ảnh lên...
                          </p>
                        )}
                        {phongForm[imageField] && (
                          <div className="mt-2">
                            <img
                              src={phongForm[imageField]}
                              alt={`Ảnh ${num}`}
                              className="max-w-xs h-auto rounded-lg border border-gray-200 shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setPhongForm({ ...phongForm, [imageField]: '' })}
                              className="mt-2 flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                              <span>Xóa ảnh {num}</span>
                            </button>
                          </div>
                        )}
                        <input
                          type="text"
                          value={phongForm[imageField]}
                          onChange={(e) => setPhongForm({ ...phongForm, [imageField]: e.target.value })}
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                          placeholder="Hoặc nhập URL ảnh"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhongModal(false);
                    setEditingPhong(null);
                    resetPhongForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>{editingPhong ? 'Cập nhật' : 'Tạo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chi tiết phòng */}
      {showPhongDetailModal && selectedPhongDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Chi tiết phòng</h2>
              <button
                onClick={() => {
                  setShowPhongDetailModal(false);
                  setSelectedPhongDetail(null);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Thông tin phòng */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">Thông tin phòng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Phân khu</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.ten_khu || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Tên phòng</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.ten_phong || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Số phòng</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.so_phong || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Số giường</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.so_giuong || '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Diện tích</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.dien_tich ? `${selectedPhongDetail.dien_tich} m²` : '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Số người tối đa</dt>
                    <dd className="text-gray-900 font-semibold">{selectedPhongDetail.so_nguoi_toi_da || 1}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600 mb-1">Trạng thái</dt>
                    <dd>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedPhongDetail.trang_thai === 'trong' ? 'bg-green-100 text-green-800' :
                        selectedPhongDetail.trang_thai === 'co_nguoi' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPhongDetail.trang_thai?.replace('_', ' ') || '-'}
                      </span>
                    </dd>
                  </div>
                  {selectedPhongDetail.mo_ta && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-600 mb-1">Mô tả</dt>
                      <dd className="text-gray-900">{selectedPhongDetail.mo_ta}</dd>
                    </div>
                  )}
                </div>

                {/* Hình ảnh phòng */}
                {(selectedPhongDetail.anh_1 || selectedPhongDetail.anh_2 || selectedPhongDetail.anh_3) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Hình ảnh phòng</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[selectedPhongDetail.anh_1, selectedPhongDetail.anh_2, selectedPhongDetail.anh_3].map((anh, index) => (
                        anh && (
                          <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <img
                              src={anh}
                              alt={`Ảnh phòng ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Danh sách bệnh nhân */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800">
                    Danh sách bệnh nhân ({selectedPhongDetail.benh_nhans?.length || 0})
                  </h3>
                </div>
                {selectedPhongDetail.benh_nhans && selectedPhongDetail.benh_nhans.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {selectedPhongDetail.benh_nhans.map((bn) => (
                      <div key={bn.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {bn.ho_ten?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <a
                                href={`/admin/benh-nhan/${bn.id_benh_nhan}`}
                                className="text-[#4A90E2] hover:text-[#4A90E2]/80 hover:underline font-semibold text-base"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {bn.ho_ten}
                              </a>
                              <div className="flex items-center gap-3 mt-1">
                                {bn.giuong && (
                                  <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
                                    Giường {bn.giuong}
                                  </span>
                                )}
                                {bn.loai_dich_vu && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-[#4A90E2]/20 text-[#4A90E2] font-medium">
                                    {bn.loai_dich_vu.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDoiPhong(bn, selectedPhongDetail);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-semibold"
                              title="Đổi phòng"
                            >
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>swap_horiz</span>
                              <span>Đổi phòng</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleXoaBenhNhanKhoiPhong(bn.id, selectedPhongDetail.id);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                              title="Xóa khỏi phòng"
                            >
                              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                              <span>Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>person_off</span>
                    <p className="text-gray-500 text-lg mb-2">Phòng trống</p>
                    <p className="text-gray-400 text-sm">Chưa có bệnh nhân nào ở trong phòng này</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

