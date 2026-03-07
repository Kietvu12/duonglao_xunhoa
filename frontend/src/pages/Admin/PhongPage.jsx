import { useEffect, useState } from 'react';
import { phongAPI, benhNhanAPI } from '../../services/api';

export default function PhongPage() {
  const [phongs, setPhongs] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_benh_nhan: '',
    khu: '',
    phong: '',
    giuong: '',
  });
  const [filters, setFilters] = useState({
    khu: '',
    phong: '',
  });

  useEffect(() => {
    loadPhongs();
    loadBenhNhans();
  }, [filters]);

  const loadPhongs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.khu) params.khu = filters.khu;
      if (filters.phong) params.phong = filters.phong;
      const response = await phongAPI.getAll(params);
      setPhongs(response.data || []);
    } catch (error) {
      console.error('Error loading phongs:', error);
      alert('Lỗi khi tải danh sách phòng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll({ limit: -1 });
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await phongAPI.update(editing.id, formData);
        alert('Cập nhật phòng thành công');
      } else {
        await phongAPI.create(formData);
        alert('Phân phòng thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setFormData({
      id_benh_nhan: p.id_benh_nhan,
      khu: p.khu || '',
      phong: p.phong || '',
      giuong: p.giuong || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (pId) => {
    if (!confirm('Bạn có chắc muốn xóa phân phòng này?')) return;
    try {
      await phongAPI.delete(pId);
      alert('Xóa phân phòng thành công');
      loadPhongs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_benh_nhan: '',
      khu: '',
      phong: '',
      giuong: '',
    });
  };

  // Group by khu and phong
  const groupedPhongs = phongs.reduce((acc, p) => {
    const key = `${p.khu}-${p.phong}`;
    if (!acc[key]) {
      acc[key] = {
        khu: p.khu,
        phong: p.phong,
        benhNhans: [],
      };
    }
    acc[key].benhNhans.push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý Phòng</h1>
          <p className="text-gray-600 mt-1">Phân phòng và quản lý chỗ ở bệnh nhân</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Phân phòng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo Khu</label>
            <input
              type="text"
              value={filters.khu}
              onChange={(e) => setFilters({ ...filters, khu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Nhập khu..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lọc theo Phòng</label>
            <input
              type="text"
              value={filters.phong}
              onChange={(e) => setFilters({ ...filters, phong: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Nhập phòng..."
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Đang tải...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giường</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bệnh nhân</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {phongs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                phongs.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{p.khu}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.phong}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{p.giuong || '-'}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/benh-nhan/${p.id_benh_nhan}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {p.ho_ten}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {p.loai_dich_vu?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? 'Sửa phòng' : 'Phân phòng mới'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bệnh nhân *
                  </label>
                  <select
                    required
                    value={formData.id_benh_nhan}
                    onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map((bn) => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khu *</label>
                  <input
                    type="text"
                    required
                    value={formData.khu}
                    onChange={(e) => setFormData({ ...formData, khu: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: A, B, C..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phòng *</label>
                  <input
                    type="text"
                    required
                    value={formData.phong}
                    onChange={(e) => setFormData({ ...formData, phong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 101, 102..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giường</label>
                  <input
                    type="text"
                    value={formData.giuong}
                    onChange={(e) => setFormData({ ...formData, giuong: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 1, 2..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editing ? 'Cập nhật' : 'Phân phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

