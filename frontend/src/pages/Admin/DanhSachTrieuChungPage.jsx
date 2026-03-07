import { useEffect, useState } from 'react';
import { danhSachTrieuChungAPI } from '../../services/api';

export default function DanhSachTrieuChungPage() {
  const [trieuChungs, setTrieuChungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    ten_trieu_chung: '',
    loai: 'khac',
  });
  const [search, setSearch] = useState('');
  const [filterLoai, setFilterLoai] = useState('');

  const loaiOptions = [
    { value: 'khan_cap', label: 'Khẩn cấp' },
    { value: 'ho_hap', label: 'Hô hấp' },
    { value: 'tim_mach', label: 'Tim mạch' },
    { value: 'tieu_hoa', label: 'Tiêu hóa' },
    { value: 'tiet_nieu', label: 'Tiết niệu' },
    { value: 'than_kinh', label: 'Thần kinh' },
    { value: 'da_lieu', label: 'Da liễu' },
    { value: 'co_xuong', label: 'Cơ xương' },
    { value: 'toan_than', label: 'Toàn thân' },
    { value: 'khac', label: 'Khác' },
  ];

  useEffect(() => {
    loadTrieuChungs();
  }, [search, filterLoai]);

  const loadTrieuChungs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filterLoai) params.loai = filterLoai;

      const response = await danhSachTrieuChungAPI.getAll(params);
      setTrieuChungs(response.data || []);
    } catch (error) {
      console.error('Error loading trieu chungs:', error);
      alert('Lỗi khi tải danh sách triệu chứng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.ten_trieu_chung || formData.ten_trieu_chung.trim() === '') {
        alert('Vui lòng nhập tên triệu chứng');
        return;
      }

      if (editing) {
        await danhSachTrieuChungAPI.update(editing.id, formData);
        alert('Cập nhật triệu chứng thành công');
      } else {
        await danhSachTrieuChungAPI.create(formData);
        alert('Thêm triệu chứng thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      loadTrieuChungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (tc) => {
    setEditing(tc);
    setFormData({
      ten_trieu_chung: tc.ten_trieu_chung || '',
      loai: tc.loai || 'khac',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa triệu chứng này?')) return;
    try {
      await danhSachTrieuChungAPI.delete(id);
      alert('Xóa triệu chứng thành công');
      loadTrieuChungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      ten_trieu_chung: '',
      loai: 'khac',
    });
  };

  const getLoaiLabel = (loai) => {
    const option = loaiOptions.find(opt => opt.value === loai);
    return option ? option.label : loai;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh sách Triệu chứng</h1>
        <button
          onClick={() => {
            setEditing(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Thêm triệu chứng
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm triệu chứng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          />
          <select
            value={filterLoai}
            onChange={(e) => setFilterLoai(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          >
            <option value="">Tất cả loại</option>
            {loaiOptions.map(opt => (
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên triệu chứng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trieuChungs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    trieuChungs.map((tc) => (
                      <tr key={tc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{tc.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tc.ten_trieu_chung}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {getLoaiLabel(tc.loai)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tc)}
                              className="text-[#4A90E2] hover:text-[#357ABD] p-1"
                              title="Sửa"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(tc.id)}
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
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Sửa triệu chứng' : 'Thêm triệu chứng mới'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên triệu chứng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ten_trieu_chung}
                    onChange={(e) => setFormData({ ...formData, ten_trieu_chung: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                    placeholder="Nhập tên triệu chứng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại triệu chứng <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.loai}
                    onChange={(e) => setFormData({ ...formData, loai: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  >
                    {loaiOptions.map(opt => (
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
    </div>
  );
}

