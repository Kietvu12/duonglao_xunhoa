import { useEffect, useState } from 'react';
import { taiKhoanAPI, uploadAPI } from '../../services/api';

const vaiTroOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'quan_ly_y_te', label: 'Quản lý Y tế' },
  { value: 'quan_ly_nhan_su', label: 'Quản lý Nhân sự' },
  { value: 'dieu_duong_truong', label: 'Điều dưỡng trưởng' },
  { value: 'dieu_duong', label: 'Điều dưỡng' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'nguoi_nha', label: 'Người nhà' },
];

const trangThaiOptions = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
  { value: 'locked', label: 'Đã khóa' },
];

export default function TaiKhoanPage() {
  const [taiKhoans, setTaiKhoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showViewPasswordModal, setShowViewPasswordModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [viewedPassword, setViewedPassword] = useState('');
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    mat_khau: '',
    vai_tro: 'dieu_duong',
    trang_thai: 'active',
    avatar: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [passwordData, setPasswordData] = useState({
    mat_khau_moi: '',
    mat_khau_moi_confirm: '',
  });
  const [search, setSearch] = useState('');
  const [filterVaiTro, setFilterVaiTro] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadTaiKhoans();
  }, [currentPage, search, filterVaiTro, filterTrangThai]);

  const loadTaiKhoans = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (search) params.search = search;
      if (filterVaiTro) params.vai_tro = filterVaiTro;
      if (filterTrangThai) params.trang_thai = filterTrangThai;

      const response = await taiKhoanAPI.getAll(params);
      setTaiKhoans(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.total || 0);
    } catch (error) {
      console.error('Error loading tai khoans:', error);
      alert('Lỗi khi tải danh sách tài khoản: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editing && !formData.mat_khau) {
        alert('Vui lòng nhập mật khẩu cho tài khoản mới');
        return;
      }

      const submitData = { ...formData };

      // Upload avatar if there's a new file
      if (avatarFile) {
        try {
          setUploadingAvatar(true);
          const uploadResponse = await uploadAPI.uploadMedia(avatarFile);
          if (uploadResponse.success && uploadResponse.data?.url) {
            submitData.avatar = uploadResponse.data.url;
          }
        } catch (uploadError) {
          alert('Lỗi khi upload avatar: ' + uploadError.message);
          setUploadingAvatar(false);
          return;
        } finally {
          setUploadingAvatar(false);
        }
      }

      if (editing) {
        // Không gửi mật khẩu khi update (dùng modal riêng)
        delete submitData.mat_khau;
        await taiKhoanAPI.update(editing.id, submitData);
        alert('Cập nhật tài khoản thành công');
      } else {
        await taiKhoanAPI.create(submitData);
        alert('Tạo tài khoản thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadTaiKhoans();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (tk) => {
    try {
      const response = await taiKhoanAPI.getById(tk.id);
      const data = response.data;
      setEditing(data);
      setFormData({
        ho_ten: data.ho_ten || '',
        so_dien_thoai: data.so_dien_thoai || '',
        email: data.email || '',
        mat_khau: '', // Không hiển thị mật khẩu
        vai_tro: data.vai_tro || 'dieu_duong',
        trang_thai: data.trang_thai || 'active',
        avatar: data.avatar || '',
      });
      // Set avatar preview if exists
      if (data.avatar) {
        setAvatarPreview(data.avatar);
      } else {
        setAvatarPreview(null);
      }
      setAvatarFile(null);
      setShowModal(true);
    } catch (error) {
      alert('Lỗi khi tải dữ liệu tài khoản: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tài khoản này?')) return;
    try {
      await taiKhoanAPI.delete(id);
      alert('Xóa tài khoản thành công');
      loadTaiKhoans();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.mat_khau_moi !== passwordData.mat_khau_moi_confirm) {
        alert('Mật khẩu xác nhận không khớp');
        return;
      }
      if (passwordData.mat_khau_moi.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      await taiKhoanAPI.resetPassword(selectedId, passwordData.mat_khau_moi);
      alert('Đổi mật khẩu thành công');
      setShowPasswordModal(false);
      setSelectedId(null);
      setPasswordData({ mat_khau_moi: '', mat_khau_moi_confirm: '' });
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ho_ten: '',
      so_dien_thoai: '',
      email: '',
      mat_khau: '',
      vai_tro: 'dieu_duong',
      trang_thai: 'active',
      avatar: '',
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const openPasswordModal = (id) => {
    setSelectedId(id);
    setPasswordData({ mat_khau_moi: '', mat_khau_moi_confirm: '' });
    setShowPasswordModal(true);
  };

  const handleViewPassword = async (id) => {
    try {
      const response = await taiKhoanAPI.viewPassword(id);
      setViewedPassword(response.data.password);
      setSelectedId(id);
      setShowViewPasswordModal(true);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getVaiTroLabel = (vaiTro) => {
    return vaiTroOptions.find(opt => opt.value === vaiTro)?.label || vaiTro;
  };

  const getTrangThaiLabel = (trangThai) => {
    return trangThaiOptions.find(opt => opt.value === trangThai)?.label || trangThai;
  };

  const getTrangThaiColor = (trangThai) => {
    switch (trangThai) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'locked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Tài khoản</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Thêm tài khoản
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm (tên, SĐT, email)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          />
          <select
            value={filterVaiTro}
            onChange={(e) => {
              setFilterVaiTro(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          >
            <option value="">Tất cả vai trò</option>
            {vaiTroOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filterTrangThai}
            onChange={(e) => {
              setFilterTrangThai(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            {trangThaiOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Avatar</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Họ tên</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số điện thoại</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vai trò</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày tạo</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {taiKhoans.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    taiKhoans.map((tk) => (
                      <tr key={tk.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{tk.id}</td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            {tk.avatar ? (
                              <img 
                                src={tk.avatar} 
                                alt={tk.ho_ten}
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentElement.querySelector('.avatar-fallback');
                                  if (fallback) {
                                    fallback.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-10 h-10 rounded-full bg-[#4A90E2] flex items-center justify-center text-white font-semibold text-sm avatar-fallback ${tk.avatar ? 'hidden' : 'flex'}`}
                            >
                              {tk.ho_ten?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tk.ho_ten}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{tk.so_dien_thoai}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{tk.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{getVaiTroLabel(tk.vai_tro)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(tk.trang_thai)}`}>
                            {getTrangThaiLabel(tk.trang_thai)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {tk.ngay_tao ? new Date(tk.ngay_tao).toLocaleDateString('vi-VN') : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tk)}
                              className="text-[#4A90E2] hover:text-[#357ABD] p-1"
                              title="Sửa"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              onClick={() => handleViewPassword(tk.id)}
                              className="text-purple-600 hover:text-purple-700 p-1"
                              title="Xem mật khẩu"
                            >
                              <span className="material-symbols-outlined text-xl">visibility</span>
                            </button>
                            <button
                              onClick={() => openPasswordModal(tk.id)}
                              className="text-orange-600 hover:text-orange-700 p-1"
                              title="Đổi mật khẩu"
                            >
                              <span className="material-symbols-outlined text-xl">lock_reset</span>
                            </button>
                            <button
                              onClick={() => handleDelete(tk.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Xóa"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} / {totalItems}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Sửa tài khoản' : 'Thêm tài khoản mới'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                          <span className="material-symbols-outlined text-3xl text-gray-400">person</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none text-sm"
                        disabled={uploadingAvatar}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Chọn file ảnh (JPG, PNG, GIF) - Tối đa 5MB
                      </p>
                      {uploadingAvatar && (
                        <p className="text-xs text-blue-600 mt-1">Đang upload...</p>
                      )}
                      {avatarFile && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreview(editing?.avatar || null);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 mt-1"
                        >
                          Xóa ảnh đã chọn
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  />
                </div>

                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required={!editing}
                      value={formData.mat_khau}
                      onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.vai_tro}
                    onChange={(e) => setFormData({ ...formData, vai_tro: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  >
                    {vaiTroOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.trang_thai}
                    onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  >
                    {trangThaiOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditing(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]"
                  >
                    {editing ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setSelectedId(null);
                    setPasswordData({ mat_khau_moi: '', mat_khau_moi_confirm: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.mat_khau_moi}
                    onChange={(e) => setPasswordData({ ...passwordData, mat_khau_moi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.mat_khau_moi_confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, mat_khau_moi_confirm: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setSelectedId(null);
                      setPasswordData({ mat_khau_moi: '', mat_khau_moi_confirm: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Password Modal */}
      {showViewPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Mật khẩu tài khoản</h2>
                <button
                  onClick={() => {
                    setShowViewPasswordModal(false);
                    setSelectedId(null);
                    setViewedPassword('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={viewedPassword}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(viewedPassword);
                        alert('Đã sao chép mật khẩu');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                      title="Sao chép"
                    >
                      <span className="material-symbols-outlined text-lg">content_copy</span>
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <p className="font-medium mb-1">⚠️ Lưu ý:</p>
                  <p>Mật khẩu này được hiển thị để quản lý. Vui lòng bảo mật thông tin này.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowViewPasswordModal(false);
                      setSelectedId(null);
                      setViewedPassword('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

