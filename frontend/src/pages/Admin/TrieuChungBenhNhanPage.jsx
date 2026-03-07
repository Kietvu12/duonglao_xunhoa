import { useEffect, useState } from 'react';
import { trieuChungBenhNhanAPI, danhSachTrieuChungAPI, benhNhanAPI } from '../../services/api';

export default function TrieuChungBenhNhanPage() {
  const [trieuChungs, setTrieuChungs] = useState([]);
  const [danhSachTrieuChung, setDanhSachTrieuChung] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    id_trieu_chung: '',
    id_benh_nhan: '',
    ngay_gio_xay_ra: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:mm
  });
  const [filters, setFilters] = useState({
    id_benh_nhan: '',
    id_trieu_chung: '',
    start_date: '',
    end_date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadDanhSachTrieuChung();
    loadBenhNhans();
  }, []);

  useEffect(() => {
    loadTrieuChungs();
  }, [currentPage, filters]);

  const loadDanhSachTrieuChung = async () => {
    try {
      const response = await danhSachTrieuChungAPI.getAll();
      setDanhSachTrieuChung(response.data || []);
    } catch (error) {
      console.error('Error loading danh sach trieu chung:', error);
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

  const loadTrieuChungs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      if (filters.id_benh_nhan) params.id_benh_nhan = filters.id_benh_nhan;
      if (filters.id_trieu_chung) params.id_trieu_chung = filters.id_trieu_chung;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const response = await trieuChungBenhNhanAPI.getAll(params);
      setTrieuChungs(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalItems(response.pagination?.total || 0);
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
      if (!formData.id_trieu_chung || !formData.id_benh_nhan) {
        alert('Vui lòng chọn đầy đủ thông tin');
        return;
      }

      // Convert datetime-local format to ISO string
      const ngayGioXayRa = formData.ngay_gio_xay_ra 
        ? new Date(formData.ngay_gio_xay_ra).toISOString()
        : new Date().toISOString();

      const submitData = {
        ...formData,
        ngay_gio_xay_ra: ngayGioXayRa,
      };

      if (editing) {
        await trieuChungBenhNhanAPI.update(editing.id, submitData);
        alert('Cập nhật triệu chứng thành công');
      } else {
        await trieuChungBenhNhanAPI.create(submitData);
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
    // Convert ISO string to datetime-local format
    const ngayGio = tc.ngay_gio_xay_ra 
      ? new Date(tc.ngay_gio_xay_ra).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16);
    
    setFormData({
      id_trieu_chung: tc.id_trieu_chung?.toString() || '',
      id_benh_nhan: tc.id_benh_nhan?.toString() || '',
      ngay_gio_xay_ra: ngayGio,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa triệu chứng này?')) return;
    try {
      await trieuChungBenhNhanAPI.delete(id);
      alert('Xóa triệu chứng thành công');
      loadTrieuChungs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_trieu_chung: '',
      id_benh_nhan: '',
      ngay_gio_xay_ra: new Date().toISOString().slice(0, 16),
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      id_benh_nhan: '',
      id_trieu_chung: '',
      start_date: '',
      end_date: '',
    });
    setCurrentPage(1);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Triệu chứng Bệnh nhân</h1>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            value={filters.id_benh_nhan}
            onChange={(e) => handleFilterChange('id_benh_nhan', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          >
            <option value="">Tất cả bệnh nhân</option>
            {benhNhans.map(bn => (
              <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
            ))}
          </select>
          <select
            value={filters.id_trieu_chung}
            onChange={(e) => handleFilterChange('id_trieu_chung', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          >
            <option value="">Tất cả triệu chứng</option>
            {danhSachTrieuChung.map(tc => (
              <option key={tc.id} value={tc.id}>{tc.ten_trieu_chung}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            placeholder="Từ ngày"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          />
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            placeholder="Đến ngày"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
          />
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bệnh nhân</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Triệu chứng</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày giờ xảy ra</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trieuChungs.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    trieuChungs.map((tc) => (
                      <tr key={tc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700">{tc.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tc.ten_benh_nhan || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{tc.ten_trieu_chung || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDateTime(tc.ngay_gio_xay_ra)}</td>
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Sửa triệu chứng bệnh nhân' : 'Thêm triệu chứng bệnh nhân'}
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
                    Bệnh nhân <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.id_benh_nhan}
                    onChange={(e) => setFormData({ ...formData, id_benh_nhan: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  >
                    <option value="">Chọn bệnh nhân</option>
                    {benhNhans.map(bn => (
                      <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Triệu chứng <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.id_trieu_chung}
                    onChange={(e) => setFormData({ ...formData, id_trieu_chung: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  >
                    <option value="">Chọn triệu chứng</option>
                    {danhSachTrieuChung.map(tc => (
                      <option key={tc.id} value={tc.id}>{tc.ten_trieu_chung}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày giờ xảy ra <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.ngay_gio_xay_ra}
                    onChange={(e) => setFormData({ ...formData, ngay_gio_xay_ra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
                  />
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

