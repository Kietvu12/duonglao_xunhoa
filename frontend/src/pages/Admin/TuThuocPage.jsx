import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { phanLoaiThuocAPI, tuThuocAPI } from '../../services/api';

const TRANG_THAI_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'het_hang', label: 'Hết hàng' },
  { value: 'het_han', label: 'Hết hạn' },
  { value: 'sap_het', label: 'Sắp hết' },
  { value: 'con_hang', label: 'Còn hàng' },
];

const TRANG_THAI_LABELS = {
  con_hang: 'Còn hàng',
  sap_het: 'Sắp hết',
  het_hang: 'Hết hàng',
  het_han: 'Hết hạn',
};

const TRANG_THAI_BADGE = {
  con_hang: 'bg-green-100 text-green-800',
  sap_het: 'bg-yellow-100 text-yellow-800',
  het_hang: 'bg-orange-100 text-orange-800',
  het_han: 'bg-red-100 text-red-800',
};

const emptyForm = {
  id_phan_loai: '',
  ten_thuoc: '',
  don_vi_tinh: '',
  so_luong_ton: 0,
  so_luong_toi_thieu: 0,
  han_su_dung: '',
  chi_dinh: '',
  ghi_chu: '',
};

const emptyPhanLoaiForm = {
  ten_loai: '',
  mo_ta: '',
};

export default function TuThuocPage() {
  const { user } = useAuth();
  const canManage = ['super_admin', 'admin', 'quan_ly_y_te'].includes(user?.vai_tro);

  const [activeTab, setActiveTab] = useState('tu-thuoc');
  const [items, setItems] = useState([]);
  const [phanLoais, setPhanLoais] = useState([]);
  const [thongKe, setThongKe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterPhanLoai, setFilterPhanLoai] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [showPhanLoaiModal, setShowPhanLoaiModal] = useState(false);
  const [editingPhanLoai, setEditingPhanLoai] = useState(null);
  const [phanLoaiForm, setPhanLoaiForm] = useState(emptyPhanLoaiForm);

  useEffect(() => {
    loadPhanLoais();
  }, []);

  useEffect(() => {
    if (activeTab === 'tu-thuoc') {
      loadTuThuoc();
      loadThongKe();
    }
  }, [activeTab, search, filterPhanLoai, filterTrangThai]);

  const loadPhanLoais = async () => {
    try {
      const response = await phanLoaiThuocAPI.getAll();
      setPhanLoais(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadThongKe = async () => {
    try {
      const response = await tuThuocAPI.getThongKe();
      setThongKe(response.data || null);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTuThuoc = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filterPhanLoai) params.id_phan_loai = filterPhanLoai;
      if (filterTrangThai) params.trang_thai = filterTrangThai;

      const response = await tuThuocAPI.getAll(params);
      setItems(response.data || []);
    } catch (error) {
      alert('Lỗi khi tải tủ thuốc: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('vi-VN');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ten_thuoc?.trim()) {
      alert('Vui lòng nhập tên thuốc/vật tư');
      return;
    }

    try {
      const payload = {
        ...formData,
        id_phan_loai: formData.id_phan_loai || null,
        so_luong_ton: Number(formData.so_luong_ton) || 0,
        so_luong_toi_thieu: Number(formData.so_luong_toi_thieu) || 0,
        han_su_dung: formData.han_su_dung || null,
      };

      if (editing) {
        await tuThuocAPI.update(editing.id, payload);
        alert('Cập nhật thành công');
      } else {
        await tuThuocAPI.create(payload);
        alert('Thêm mục vào tủ thuốc thành công');
      }

      setShowModal(false);
      setEditing(null);
      setFormData(emptyForm);
      loadTuThuoc();
      loadThongKe();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      id_phan_loai: item.id_phan_loai || '',
      ten_thuoc: item.ten_thuoc || '',
      don_vi_tinh: item.don_vi_tinh || '',
      so_luong_ton: item.so_luong_ton ?? 0,
      so_luong_toi_thieu: item.so_luong_toi_thieu ?? 0,
      han_su_dung: item.han_su_dung ? item.han_su_dung.split('T')[0].split(' ')[0] : '',
      chi_dinh: item.chi_dinh || '',
      ghi_chu: item.ghi_chu || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa mục này khỏi tủ thuốc?')) return;
    try {
      await tuThuocAPI.delete(id);
      alert('Xóa thành công');
      loadTuThuoc();
      loadThongKe();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePhanLoaiSubmit = async (e) => {
    e.preventDefault();
    if (!phanLoaiForm.ten_loai?.trim()) {
      alert('Vui lòng nhập tên phân loại');
      return;
    }

    try {
      if (editingPhanLoai) {
        await phanLoaiThuocAPI.update(editingPhanLoai.id, phanLoaiForm);
        alert('Cập nhật phân loại thành công');
      } else {
        await phanLoaiThuocAPI.create(phanLoaiForm);
        alert('Thêm phân loại thành công');
      }
      setShowPhanLoaiModal(false);
      setEditingPhanLoai(null);
      setPhanLoaiForm(emptyPhanLoaiForm);
      loadPhanLoais();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDeletePhanLoai = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa phân loại này?')) return;
    try {
      await phanLoaiThuocAPI.delete(id);
      alert('Xóa phân loại thành công');
      loadPhanLoais();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tủ thuốc</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tồn kho thuốc và vật tư y tế dùng chung</p>
        </div>
        {canManage && activeTab === 'tu-thuoc' && (
          <button
            onClick={() => {
              setEditing(null);
              setFormData(emptyForm);
              setShowModal(true);
            }}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm mục
          </button>
        )}
        {canManage && activeTab === 'phan-loai' && (
          <button
            onClick={() => {
              setEditingPhanLoai(null);
              setPhanLoaiForm(emptyPhanLoaiForm);
              setShowPhanLoaiModal(true);
            }}
            className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm phân loại
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tu-thuoc')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tu-thuoc'
              ? 'border-[#4A90E2] text-[#4A90E2]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Danh sách tủ thuốc
        </button>
        <button
          onClick={() => setActiveTab('phan-loai')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'phan-loai'
              ? 'border-[#4A90E2] text-[#4A90E2]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Phân loại
        </button>
      </div>

      {activeTab === 'tu-thuoc' && (
        <>
          {thongKe && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
              {[
                { label: 'Tổng mục', value: thongKe.tong_so_muc, color: 'text-gray-800' },
                { label: 'Tổng tồn', value: thongKe.tong_ton, color: 'text-gray-800' },
                { label: 'Còn hàng', value: thongKe.con_hang, color: 'text-green-600' },
                { label: 'Sắp hết', value: thongKe.sap_het, color: 'text-yellow-600' },
                { label: 'Hết hàng', value: thongKe.het_hang, color: 'text-orange-600' },
                { label: 'Hết hạn', value: thongKe.het_han, color: 'text-red-600' },
                { label: 'Cần chú ý', value: thongKe.can_chu_y, color: 'text-[#4A90E2]' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Tìm theo tên thuốc/vật tư..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
              />
              <select
                value={filterPhanLoai}
                onChange={(e) => setFilterPhanLoai(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
              >
                <option value="">Tất cả phân loại</option>
                {phanLoais.map((pl) => (
                  <option key={pl.id} value={pl.id}>{pl.ten_loai}</option>
                ))}
              </select>
              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none"
              >
                {TRANG_THAI_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phân loại</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tồn kho</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngưỡng</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hạn dùng</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                      {canManage && (
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={canManage ? 7 : 6} className="px-4 py-8 text-center text-gray-500">
                          Tủ thuốc chưa có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${!item.co_the_chon ? 'opacity-60' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium text-gray-900">{item.ten_thuoc}</div>
                            {item.don_vi_tinh && (
                              <div className="text-xs text-gray-500">ĐVT: {item.don_vi_tinh}</div>
                            )}
                            {item.sap_het_han && item.trang_thai !== 'het_han' && (
                              <div className="text-xs text-amber-600 mt-0.5">Sắp hết hạn</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.ten_phan_loai || '—'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                            {item.so_luong_ton} {item.don_vi_tinh || ''}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{item.so_luong_toi_thieu}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{formatDate(item.han_su_dung)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${TRANG_THAI_BADGE[item.trang_thai] || 'bg-gray-100 text-gray-800'}`}>
                              {TRANG_THAI_LABELS[item.trang_thai] || item.trang_thai}
                            </span>
                          </td>
                          {canManage && (
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEdit(item)} className="text-[#4A90E2] hover:text-[#357ABD] p-1" title="Sửa">
                                  <span className="material-symbols-outlined text-xl">edit</span>
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 p-1" title="Xóa">
                                  <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'phan-loai' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tên phân loại</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mô tả</th>
                  {canManage && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {phanLoais.length === 0 ? (
                  <tr>
                    <td colSpan={canManage ? 4 : 3} className="px-4 py-8 text-center text-gray-500">
                      Chưa có phân loại
                    </td>
                  </tr>
                ) : (
                  phanLoais.map((pl) => (
                    <tr key={pl.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{pl.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{pl.ten_loai}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{pl.mo_ta || '—'}</td>
                      {canManage && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingPhanLoai(pl);
                                setPhanLoaiForm({ ten_loai: pl.ten_loai || '', mo_ta: pl.mo_ta || '' });
                                setShowPhanLoaiModal(true);
                              }}
                              className="text-[#4A90E2] hover:text-[#357ABD] p-1"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button onClick={() => handleDeletePhanLoai(pl.id)} className="text-red-600 hover:text-red-700 p-1">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? 'Sửa mục tủ thuốc' : 'Thêm mục vào tủ thuốc'}
                </h2>
                <button onClick={() => { setShowModal(false); setEditing(null); setFormData(emptyForm); }} className="text-gray-500 hover:text-gray-700">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên thuốc/vật tư <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.ten_thuoc} onChange={(e) => setFormData({ ...formData, ten_thuoc: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
                  <select value={formData.id_phan_loai} onChange={(e) => setFormData({ ...formData, id_phan_loai: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none">
                    <option value="">— Không chọn —</option>
                    {phanLoais.map((pl) => <option key={pl.id} value={pl.id}>{pl.ten_loai}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                    <input type="text" value={formData.don_vi_tinh} onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })} placeholder="gói, viên, cuộn..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hạn sử dụng</label>
                    <input type="date" value={formData.han_su_dung} onChange={(e) => setFormData({ ...formData, han_su_dung: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn</label>
                    <input type="number" min="0" value={formData.so_luong_ton} onChange={(e) => setFormData({ ...formData, so_luong_ton: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngưỡng cảnh báo</label>
                    <input type="number" min="0" value={formData.so_luong_toi_thieu} onChange={(e) => setFormData({ ...formData, so_luong_toi_thieu: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chỉ định sử dụng</label>
                  <textarea value={formData.chi_dinh} onChange={(e) => setFormData({ ...formData, chi_dinh: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea value={formData.ghi_chu} onChange={(e) => setFormData({ ...formData, ghi_chu: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setEditing(null); setFormData(emptyForm); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]">{editing ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPhanLoaiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{editingPhanLoai ? 'Sửa phân loại' : 'Thêm phân loại'}</h2>
                <button onClick={() => { setShowPhanLoaiModal(false); setEditingPhanLoai(null); setPhanLoaiForm(emptyPhanLoaiForm); }} className="text-gray-500 hover:text-gray-700">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <form onSubmit={handlePhanLoaiSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên phân loại <span className="text-red-500">*</span></label>
                  <input type="text" required value={phanLoaiForm.ten_loai} onChange={(e) => setPhanLoaiForm({ ...phanLoaiForm, ten_loai: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea value={phanLoaiForm.mo_ta} onChange={(e) => setPhanLoaiForm({ ...phanLoaiForm, mo_ta: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowPhanLoaiModal(false); setEditingPhanLoai(null); setPhanLoaiForm(emptyPhanLoaiForm); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]">{editingPhanLoai ? 'Cập nhật' : 'Thêm mới'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
