import { useEffect, useState } from 'react';
import { dichVuAPI, loaiDichVuAPI } from '../../services/api';

export default function DichVuPage() {
  const [dichVus, setDichVus] = useState([]);
  const [loaiDichVus, setLoaiDichVus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_loai_dich_vu: '',
    ten_dich_vu: '',
    mo_ta_ngan: '',
    mo_ta_day_du: '',
    gia_thang: '',
    gia_quy: '',
    gia_nam: '',
  });

  useEffect(() => {
    loadDichVus();
    loadLoaiDichVus();
  }, []);

  const loadLoaiDichVus = async () => {
    try {
      const response = await loaiDichVuAPI.getAll();
      setLoaiDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading loai dich vus:', error);
    }
  };

  const loadDichVus = async () => {
    try {
      setLoading(true);
      // Truyền limit=-1 để lấy tất cả dịch vụ (không phân trang)
      const response = await dichVuAPI.getAll({ limit: -1 });
      setDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading dich vus:', error);
      alert('Lỗi khi tải danh sách dịch vụ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await dichVuAPI.update(editing.id, formData);
        alert('Cập nhật dịch vụ thành công');
      } else {
        await dichVuAPI.create(formData);
        alert('Thêm dịch vụ thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (dv) => {
    setEditing(dv);
    setFormData({
      id_loai_dich_vu: dv.id_loai_dich_vu || '',
      ten_dich_vu: dv.ten_dich_vu || '',
      mo_ta_ngan: dv.mo_ta_ngan || '',
      mo_ta_day_du: dv.mo_ta_day_du || '',
      gia_thang: dv.gia_thang || '',
      gia_quy: dv.gia_quy || '',
      gia_nam: dv.gia_nam || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    try {
      await dichVuAPI.delete(id);
      alert('Xóa dịch vụ thành công');
      loadDichVus();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_loai_dich_vu: '',
      ten_dich_vu: '',
      mo_ta_ngan: '',
      mo_ta_day_du: '',
      gia_thang: '',
      gia_quy: '',
      gia_nam: '',
    });
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Dịch vụ</h1>
          <p className="text-gray-600 mt-2">Danh sách dịch vụ và bảng giá</p>
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
          <span>Thêm dịch vụ</span>
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      ) : dichVus.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>medical_services</span>
          <p className="text-gray-500 text-lg mb-2">Chưa có dịch vụ nào</p>
          <p className="text-gray-400 text-sm">Bấm "Thêm dịch vụ" để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dichVus.map((dv) => (
            <div key={dv.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {dv.ten_loai_dich_vu && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mb-2">
                      {dv.ten_loai_dich_vu}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{dv.ten_dich_vu}</h3>
                  {dv.mo_ta_ngan && (
                    <p className="text-gray-600 text-sm line-clamp-2">{dv.mo_ta_ngan}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                {dv.gia_thang && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tháng:</span>
                    <span className="font-bold text-[#4A90E2]">{parseInt(dv.gia_thang).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {dv.gia_quy && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quý:</span>
                    <span className="font-bold text-[#4A90E2]">{parseInt(dv.gia_quy).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                {dv.gia_nam && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Năm:</span>
                    <span className="font-bold text-[#4A90E2]">{parseInt(dv.gia_nam).toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dv)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(dv.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">
                {editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
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
                  Loại dịch vụ
                </label>
                <select
                  value={formData.id_loai_dich_vu}
                  onChange={(e) => setFormData({ ...formData, id_loai_dich_vu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="">Chọn loại dịch vụ</option>
                  {loaiDichVus.map((loai) => (
                    <option key={loai.id} value={loai.id}>{loai.ten}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên dịch vụ *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten_dich_vu}
                  onChange={(e) => setFormData({ ...formData, ten_dich_vu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.mo_ta_ngan}
                  onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="2"
                  placeholder="Mô tả ngắn gọn về dịch vụ..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả đầy đủ
                </label>
                <textarea
                  value={formData.mo_ta_day_du}
                  onChange={(e) => setFormData({ ...formData, mo_ta_day_du: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="4"
                  placeholder="Mô tả chi tiết về dịch vụ..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá tháng (đ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.gia_thang}
                    onChange={(e) => setFormData({ ...formData, gia_thang: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá quý (đ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.gia_quy}
                    onChange={(e) => setFormData({ ...formData, gia_quy: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá năm (đ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.gia_nam}
                    onChange={(e) => setFormData({ ...formData, gia_nam: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="0"
                  />
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
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
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

