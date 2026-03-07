import { useEffect, useState } from 'react';
import { lichKhamAPI } from '../../services/api';

export default function LichHenTuVanPage() {
  const [lichHens, setLichHens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    trang_thai: 'cho_xac_nhan',
    ghi_chu: ''
  });
  const [filters, setFilters] = useState({
    trang_thai: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadLichHens();
  }, [filters]);

  const loadLichHens = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        ...filters
      };
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      const response = await lichKhamAPI.getAllLichHenTuVan(params);
      setLichHens(response.data || []);
    } catch (error) {
      console.error('Error loading lich hen tu van:', error);
      alert('Lỗi khi tải danh sách lịch hẹn tư vấn: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lichHen) => {
    setEditing(lichHen);
    setFormData({
      trang_thai: lichHen.trang_thai || 'cho_xac_nhan',
      ghi_chu: lichHen.ghi_chu || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await lichKhamAPI.updateLichHenTuVan(editing.id, formData);
      alert('Cập nhật lịch hẹn thành công');
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadLichHens();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      trang_thai: 'cho_xac_nhan',
      ghi_chu: ''
    });
  };

  const getTrangThaiLabel = (trangThai) => {
    const labels = {
      'cho_xac_nhan': 'Chờ xác nhận',
      'da_xac_nhan': 'Đã xác nhận',
      'da_den': 'Đã đến',
      'huy': 'Hủy'
    };
    return labels[trangThai] || trangThai;
  };

  const getTrangThaiColor = (trangThai) => {
    const colors = {
      'cho_xac_nhan': 'bg-yellow-100 text-yellow-800',
      'da_xac_nhan': 'bg-blue-100 text-blue-800',
      'da_den': 'bg-green-100 text-green-800',
      'huy': 'bg-red-100 text-red-800'
    };
    return colors[trangThai] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý Lịch hẹn tư vấn</h1>
          <p className="text-gray-600 mt-2">Danh sách và quản lý lịch hẹn tư vấn</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
            <select
              value={filters.trang_thai}
              onChange={(e) => setFilters({ ...filters, trang_thai: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
            >
              <option value="">Tất cả</option>
              <option value="cho_xac_nhan">Chờ xác nhận</option>
              <option value="da_xac_nhan">Đã xác nhận</option>
              <option value="da_den">Đã đến</option>
              <option value="huy">Hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Từ ngày</label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Đến ngày</label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ trang_thai: '', start_date: '', end_date: '' })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>filter_alt_off</span>
              <span>Xóa bộ lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">
            <div className="inline-block">Đang tải...</div>
          </div>
        ) : lichHens.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>event_busy</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có lịch hẹn tư vấn nào</p>
            <p className="text-gray-400 text-sm">Không có dữ liệu phù hợp với bộ lọc</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Loại dịch vụ quan tâm</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày hẹn</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giờ hẹn</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lichHens.map((lh) => (
                  <tr key={lh.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {lh.ho_ten?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{lh.ho_ten}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{lh.so_dien_thoai}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{lh.email}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{lh.loai_dich_vu_quan_tam || '-'}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                      {new Date(lh.ngay_mong_muon).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">{lh.gio_mong_muon}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTrangThaiColor(lh.trang_thai)}`}>
                        {getTrangThaiLabel(lh.trang_thai)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(lh)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                        <span>Xem/Sửa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Chi tiết lịch hẹn tư vấn</h2>
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
            
            {/* Thông tin khách hàng */}
            <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Họ tên</label>
                  <p className="text-gray-900 font-medium">{editing.ho_ten}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Số điện thoại</label>
                  <p className="text-gray-900 font-medium">{editing.so_dien_thoai}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                  <p className="text-gray-900 font-medium">{editing.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Loại dịch vụ quan tâm</label>
                  <p className="text-gray-900 font-medium">{editing.loai_dich_vu_quan_tam || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Ngày hẹn</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(editing.ngay_mong_muon).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">Giờ hẹn</label>
                  <p className="text-gray-900 font-medium">{editing.gio_mong_muon}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái *
                </label>
                <select
                  required
                  value={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="cho_xac_nhan">Chờ xác nhận</option>
                  <option value="da_xac_nhan">Đã xác nhận</option>
                  <option value="da_den">Đã đến</option>
                  <option value="huy">Hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.ghi_chu}
                  onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  rows="4"
                  placeholder="Nhập ghi chú..."
                />
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
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>save</span>
                  <span>Cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

