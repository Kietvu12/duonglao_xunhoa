import { useEffect, useState } from 'react';
import { tuyenDungAPI } from '../../services/api';

export default function TuyenDungPage() {
  const [tinTuyenDungs, setTinTuyenDungs] = useState([]);
  const [hoSoUngTuyens, setHoSoUngTuyens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tin-tuyen-dung');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [media, setMedia] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedHoSo, setSelectedHoSo] = useState(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    vi_tri: '',
    yeu_cau: '',
    so_luong: 1,
    ngay_het_han: '',
    trang_thai: 'dang_tuyen',
  });

  useEffect(() => {
    loadTinTuyenDungs();
    loadHoSoUngTuyens();
  }, []);

  const loadTinTuyenDungs = async () => {
    try {
      setLoading(true);
      const response = await tuyenDungAPI.getAllTinTuyenDung();
      setTinTuyenDungs(response.data || []);
    } catch (error) {
      console.error('Error loading tin tuyen dung:', error);
      alert('Lỗi khi tải danh sách tin tuyển dụng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHoSoUngTuyens = async () => {
    try {
      const response = await tuyenDungAPI.getAllHoSoUngTuyen();
      setHoSoUngTuyens(response.data || []);
    } catch (error) {
      console.error('Error loading ho so ung tuyen:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await tuyenDungAPI.updateTinTuyenDung(editing.id, formData);
        alert('Cập nhật tin tuyển dụng thành công');
      } else {
        await tuyenDungAPI.createTinTuyenDung(formData);
        alert('Tạo tin tuyển dụng thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadTinTuyenDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const loadMedia = async (id) => {
    try {
      const response = await tuyenDungAPI.getMediaTinTuyenDung(id);
      setMedia(response.data || []);
    } catch (error) {
      console.error('Error loading media:', error);
      setMedia([]);
    }
  };

  const handleUploadMedia = async (files) => {
    if (!editing?.id) {
      alert('Vui lòng lưu tin tuyển dụng trước khi upload ảnh');
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    try {
      setUploadingMedia(true);
      const formData = new FormData();
      
      // Append tất cả các file
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      const response = await tuyenDungAPI.addMediaTinTuyenDung(editing.id, formData);
      if (response.success) {
        await loadMedia(editing.id);
        alert(`Upload thành công ${response.data?.length || files.length} ảnh`);
      }
    } catch (error) {
      alert('Lỗi upload: ' + error.message);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;
    
    try {
      await tuyenDungAPI.deleteMediaTinTuyenDung(editing.id, mediaId);
      await loadMedia(editing.id);
      alert('Xóa ảnh thành công');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (ttd) => {
    setEditing(ttd);
    setFormData({
      tieu_de: ttd.tieu_de || '',
      mo_ta: ttd.mo_ta || '',
      vi_tri: ttd.vi_tri || '',
      yeu_cau: ttd.yeu_cau || '',
      so_luong: ttd.so_luong || 1,
      ngay_het_han: ttd.ngay_het_han ? ttd.ngay_het_han.slice(0, 16) : '',
      trang_thai: ttd.trang_thai || 'dang_tuyen',
    });
    setShowModal(true);
    // Load media khi edit
    if (ttd.id) {
      await loadMedia(ttd.id);
    } else {
      setMedia([]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tin tuyển dụng này?')) return;
    try {
      await tuyenDungAPI.deleteTinTuyenDung(id);
      alert('Xóa tin tuyển dụng thành công');
      loadTinTuyenDungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleUpdateHoSo = async (id, trang_thai) => {
    try {
      const response = await tuyenDungAPI.updateHoSoUngTuyen(id, { trang_thai });
      alert(response.message || 'Cập nhật trạng thái thành công');
      loadHoSoUngTuyens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleViewCV = (hoSo) => {
    setSelectedHoSo(hoSo);
    setShowCvModal(true);
  };

  const getFileUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4545';
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  const resetForm = () => {
    setFormData({
      tieu_de: '',
      mo_ta: '',
      vi_tri: '',
      yeu_cau: '',
      so_luong: 1,
      ngay_het_han: '',
      trang_thai: 'dang_tuyen',
    });
    setMedia([]);
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4545';
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Tuyển dụng</h1>
          <p className="text-gray-600 mt-2">Tin tuyển dụng và hồ sơ ứng tuyển</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
        >
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
          <span>Tạo tin tuyển dụng</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('tin-tuyen-dung')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'tin-tuyen-dung'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tin tuyển dụng
            </button>
            <button
              onClick={() => setActiveTab('ho-so-ung-tuyen')}
              className={`px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                activeTab === 'ho-so-ung-tuyen'
                  ? 'border-[#4A90E2] text-[#4A90E2] bg-[#4A90E2]/5'
                  : 'border-transparent text-gray-600 hover:text-[#4A90E2] hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              Hồ sơ ứng tuyển
            </button>
          </nav>
        </div>

        <div className="p-6 lg:p-8">
          {/* Tab: Tin tuyển dụng */}
          {activeTab === 'tin-tuyen-dung' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-16 text-center text-gray-500">Đang tải...</div>
              ) : tinTuyenDungs.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>work</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có tin tuyển dụng nào</p>
                  <p className="text-gray-400 text-sm">Bấm "Tạo tin tuyển dụng" để bắt đầu</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số lượng</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tinTuyenDungs.map((ttd) => (
                        <tr key={ttd.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 font-semibold text-gray-900">{ttd.tieu_de}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{ttd.vi_tri}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{ttd.so_luong}</td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              ttd.trang_thai === 'dang_tuyen' ? 'bg-green-100 text-green-800' :
                              ttd.trang_thai === 'tam_dung' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ttd.trang_thai?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(ttd)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                <span>Sửa</span>
                              </button>
                              <button
                                onClick={() => handleDelete(ttd.id)}
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
          )}

          {/* Tab: Hồ sơ ứng tuyển */}
          {activeTab === 'ho-so-ung-tuyen' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {hoSoUngTuyens.length === 0 ? (
                <div className="p-16 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>description</span>
                  <p className="text-gray-500 text-lg mb-2">Chưa có hồ sơ ứng tuyển nào</p>
                  <p className="text-gray-400 text-sm">Chưa có ứng viên nào nộp hồ sơ</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SĐT</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Vị trí</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">CV</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {hoSoUngTuyens.map((hs) => (
                        <tr key={hs.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {hs.ho_ten?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <span className="font-semibold text-gray-900">{hs.ho_ten}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm text-gray-900">{hs.email}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{hs.so_dien_thoai}</td>
                          <td className="px-6 py-5 text-sm text-gray-900">{hs.vi_tri}</td>
                          <td className="px-6 py-5">
                            {hs.file_cv ? (
                              <button
                                onClick={() => handleViewCV(hs)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-xs font-semibold"
                              >
                                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                  description
                                </span>
                                <span>Xem CV</span>
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">Chưa có CV</span>
                            )}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              hs.trang_thai === 'trung_tuyen' ? 'bg-green-100 text-green-800' :
                              hs.trang_thai === 'tu_choi' ? 'bg-red-100 text-red-800' :
                              hs.trang_thai === 'phong_van' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {hs.trang_thai?.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <select
                              value={hs.trang_thai}
                              onChange={(e) => handleUpdateHoSo(hs.id, e.target.value)}
                              className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
                            >
                              <option value="moi_nop">Mới nộp</option>
                              <option value="da_xem">Đã xem</option>
                              <option value="phong_van">Phỏng vấn</option>
                              <option value="trung_tuyen">Trúng tuyển</option>
                              <option value="tu_choi">Từ chối</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tieu_de}
                  onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vị trí *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vi_tri}
                  onChange={(e) => setFormData({ ...formData, vi_tri: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Ví dụ: Điều dưỡng, Bác sĩ, Kế toán..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="4"
                  placeholder="Mô tả chi tiết về vị trí tuyển dụng..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Yêu cầu
                </label>
                <textarea
                  value={formData.yeu_cau}
                  onChange={(e) => setFormData({ ...formData, yeu_cau: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="4"
                  placeholder="Yêu cầu về bằng cấp, kinh nghiệm, kỹ năng..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.so_luong}
                    onChange={(e) => setFormData({ ...formData, so_luong: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.ngay_het_han}
                    onChange={(e) => setFormData({ ...formData, ngay_het_han: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    <option value="dang_tuyen">Đang tuyển</option>
                    <option value="tam_dung">Tạm dừng</option>
                    <option value="da_dong">Đã đóng</option>
                  </select>
                </div>
              </div>
              {/* Media Gallery - chỉ hiển thị khi đang edit */}
              {editing && editing.id && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                    Ảnh tin tuyển dụng
                  </h3>
                  
                  {/* Upload button - Cho phép chọn nhiều file */}
                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          handleUploadMedia(files);
                        }
                        e.target.value = ''; // Reset input
                      }}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                      disabled={uploadingMedia}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Có thể chọn nhiều ảnh cùng lúc (Ctrl/Cmd + Click hoặc Shift + Click)
                    </p>
                    {uploadingMedia && (
                      <p className="text-sm text-gray-500 mt-2">Đang upload...</p>
                    )}
                  </div>

                  {/* Media grid */}
                  {media.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {media.map((item) => (
                        <div key={item.id} className="relative group">
                          <img
                            src={getImageUrl(item.url)}
                            alt={item.mo_ta || 'Media'}
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
                            }}
                          />
                          <button
                            onClick={() => handleDeleteMedia(item.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Xóa ảnh"
                          >
                            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                              delete
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Chưa có ảnh nào. Upload ảnh để hiển thị.
                    </p>
                  )}
                </div>
              )}

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
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>{editing ? 'Cập nhật' : 'Tạo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem CV */}
      {showCvModal && selectedHoSo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                CV của {selectedHoSo.ho_ten}
              </h2>
              <button
                onClick={() => {
                  setShowCvModal(false);
                  setSelectedHoSo(null);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Họ và tên:</p>
                  <p className="text-base text-gray-900">{selectedHoSo.ho_ten}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Email:</p>
                  <p className="text-base text-gray-900">{selectedHoSo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Số điện thoại:</p>
                  <p className="text-base text-gray-900">{selectedHoSo.so_dien_thoai}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Vị trí ứng tuyển:</p>
                  <p className="text-base text-gray-900">{selectedHoSo.vi_tri}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Ngày nộp:</p>
                  <p className="text-base text-gray-900">
                    {selectedHoSo.ngay_nop ? new Date(selectedHoSo.ngay_nop).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Trạng thái:</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                    selectedHoSo.trang_thai === 'trung_tuyen' ? 'bg-green-100 text-green-800' :
                    selectedHoSo.trang_thai === 'tu_choi' ? 'bg-red-100 text-red-800' :
                    selectedHoSo.trang_thai === 'phong_van' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedHoSo.trang_thai?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {selectedHoSo.file_cv && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">File CV</h3>
                    <a
                      href={getFileUrl(selectedHoSo.file_cv)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        download
                      </span>
                      <span>Tải xuống CV</span>
                    </a>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {selectedHoSo.file_cv.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full">
                        <iframe
                          src={getFileUrl(selectedHoSo.file_cv)}
                          className="w-full h-[600px] rounded-lg border border-gray-300"
                          title="CV PDF"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Nếu không xem được PDF, vui lòng tải xuống để xem
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mb-4">
                          <span className="material-symbol-outlined text-6xl text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            description
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">File CV: {selectedHoSo.file_cv.split('/').pop()}</p>
                        <a
                          href={getFileUrl(selectedHoSo.file_cv)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                            download
                          </span>
                          <span>Tải xuống CV</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

