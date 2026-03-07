import { useEffect, useState } from 'react';
import { loaiPhongAPI, uploadAPI } from '../../services/api';
import { normalizeImageUrl } from '../../utils/imageUtils';

export default function LoaiPhongPage() {
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    ten: '',
    mo_ta: '',
    anh_mau: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadLoaiPhongs();
  }, []);

  const loadLoaiPhongs = async () => {
    try {
      setLoading(true);
      const response = await loaiPhongAPI.getAll();
      setLoaiPhongs(response.data || []);
    } catch (error) {
      console.error('Error loading loai phongs:', error);
      alert('Lỗi khi tải danh sách loại phòng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadMedia(file);
      console.log('Upload response:', response);
      // Lưu URL gốc từ backend, không normalize trước khi lưu
      // normalizeImageUrl sẽ được gọi khi hiển thị
      const imageUrl = response.data.url;
      console.log('Image URL to save:', imageUrl);
      setFormData({ ...formData, anh_mau: imageUrl });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Lỗi khi upload ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await loaiPhongAPI.update(editing.id, formData);
        alert('Cập nhật loại phòng thành công');
      } else {
        await loaiPhongAPI.create(formData);
        alert('Thêm loại phòng thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadLoaiPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (loai) => {
    setEditing(loai);
    setFormData({
      ten: loai.ten || '',
      mo_ta: loai.mo_ta || '',
      anh_mau: loai.anh_mau || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa loại phòng này?')) return;
    try {
      await loaiPhongAPI.delete(id);
      alert('Xóa loại phòng thành công');
      loadLoaiPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ten: '',
      mo_ta: '',
      anh_mau: '',
    });
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Loại Phòng</h1>
          <p className="text-gray-600 mt-2">Quản lý danh mục loại phòng</p>
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
          <span>Thêm loại phòng</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center text-gray-500">
          <div className="inline-block">Đang tải...</div>
        </div>
      ) : loaiPhongs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bed</span>
          <p className="text-gray-500 text-lg mb-2">Chưa có loại phòng nào</p>
          <p className="text-gray-400 text-sm">Bấm "Thêm loại phòng" để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loaiPhongs.map((loai) => (
            <div key={loai.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {loai.anh_mau && (
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={normalizeImageUrl(loai.anh_mau)}
                    alt={loai.mo_ta || 'Loại phòng'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', loai.anh_mau, 'Normalized:', normalizeImageUrl(loai.anh_mau));
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-sm text-gray-600 line-clamp-3">{loai.mo_ta || 'Chưa có mô tả'}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(loai.ngay_tao).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(loai)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(loai.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa loại phòng' : 'Thêm loại phòng mới'}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên loại phòng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ten}
                  onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Nhập tên loại phòng..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  placeholder="Nhập mô tả về loại phòng..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ảnh mẫu
                </label>
                {formData.anh_mau && (
                  <div className="mb-3">
                    <img
                      src={normalizeImageUrl(formData.anh_mau)}
                      alt="Ảnh mẫu"
                      className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors text-sm font-semibold">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>upload</span>
                    <span>{uploading ? 'Đang tải...' : formData.anh_mau ? 'Thay đổi ảnh' : 'Chọn ảnh'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {formData.anh_mau && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, anh_mau: '' })}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-semibold"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                      <span>Xóa ảnh</span>
                    </button>
                  )}
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
    </div>
  );
}
