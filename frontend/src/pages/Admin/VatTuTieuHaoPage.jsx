import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { benhNhanAPI, nguoiThanAPI, nhanVienAPI, tuThuocAPI, vatTuTieuHaoAPI } from '../../services/api';

const LOAI_BAN_GIAO_LABELS = {
  nguoi_nha_to_dieu_duong: 'Người nhà → Điều dưỡng',
  dieu_duong_to_benh_nhan: 'Điều dưỡng → Bệnh nhân',
};

const TRANG_THAI_LABELS = {
  cho_duyet: 'Chờ duyệt',
  da_duyet: 'Đã duyệt',
  da_su_dung: 'Đã dùng',
  da_huy: 'Đã hủy',
};

const TRANG_THAI_BADGE = {
  cho_duyet: 'bg-gray-100 text-gray-800',
  da_duyet: 'bg-blue-100 text-blue-800',
  da_su_dung: 'bg-green-100 text-green-800',
  da_huy: 'bg-red-100 text-red-800',
};

const emptyForm = {
  loai_ban_giao: 'dieu_duong_to_benh_nhan',
  id_benh_nhan: '',
  id_nguoi_gui_nguoi_than: '',
  id_nguoi_nhan: '',
  nguon: 'tu_thuoc',
  id_tu_thuoc: '',
  ten_vat_tu: '',
  don_vi_tinh: '',
  so_luong: 1,
  ly_do: '',
};

export default function VatTuTieuHaoPage() {
  const { user } = useAuth();
  const canManage = ['super_admin', 'admin', 'quan_ly_y_te', 'dieu_duong_truong'].includes(user?.vai_tro);

  const [records, setRecords] = useState([]);
  const [benhNhans, setBenhNhans] = useState([]);
  const [nguoiThans, setNguoiThans] = useState([]);
  const [nhanViens, setNhanViens] = useState([]);
  const [tuThuocItems, setTuThuocItems] = useState([]);
  const [danhMucNgoaiKho, setDanhMucNgoaiKho] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState('all');
  const [search, setSearch] = useState('');
  const [filterTrangThai, setFilterTrangThai] = useState('');
  const [filterLoaiBanGiao, setFilterLoaiBanGiao] = useState('');
  const [filterBenhNhan, setFilterBenhNhan] = useState('');
  const [filterNgay, setFilterNgay] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedNhom, setSelectedNhom] = useState('');

  useEffect(() => {
    loadBenhNhans();
    loadTuThuoc();
    loadDanhMucNgoaiKho();
    loadNhanViens();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [viewMode, search, filterTrangThai, filterLoaiBanGiao, filterBenhNhan, filterNgay]);

  useEffect(() => {
    if (formData.id_benh_nhan) {
      loadNguoiThans(formData.id_benh_nhan);
    } else {
      setNguoiThans([]);
    }
  }, [formData.id_benh_nhan]);

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll({ limit: -1 });
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTuThuoc = async () => {
    try {
      const response = await tuThuocAPI.getAll();
      setTuThuocItems(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDanhMucNgoaiKho = async () => {
    try {
      const response = await vatTuTieuHaoAPI.getDanhMucNgoaiKho();
      setDanhMucNgoaiKho(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll({ limit: -1 });
      setNhanViens(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadNguoiThans = async (idBenhNhan) => {
    try {
      const response = await nguoiThanAPI.getAll({ id_benh_nhan: idBenhNhan });
      setNguoiThans(response.data || []);
    } catch (error) {
      console.error(error);
      setNguoiThans([]);
    }
  };

  const loadRecords = async () => {
    try {
      setLoading(true);
      let response;

      if (viewMode === 'hom-nay') {
        const params = {};
        if (search.trim()) params.search = search.trim();
        response = await vatTuTieuHaoAPI.getHomNay(params);
      } else {
        const params = { limit: 100 };
        if (search.trim()) params.search = search.trim();
        if (filterTrangThai) params.trang_thai = filterTrangThai;
        if (filterLoaiBanGiao) params.loai_ban_giao = filterLoaiBanGiao;
        if (filterBenhNhan) params.id_benh_nhan = filterBenhNhan;
        if (filterNgay) params.ngay = filterNgay;
        response = await vatTuTieuHaoAPI.getAll(params);
      }

      setRecords(response.data || []);
    } catch (error) {
      alert('Lỗi khi tải sổ vật tư tiêu hao: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('vi-VN');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_benh_nhan) {
      alert('Vui lòng chọn người cao tuổi');
      return;
    }

    const soLuong = Number(formData.so_luong);
    if (!Number.isFinite(soLuong) || soLuong <= 0) {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    if (formData.loai_ban_giao === 'nguoi_nha_to_dieu_duong') {
      if (!formData.id_nguoi_gui_nguoi_than) {
        alert('Vui lòng chọn người nhà bàn giao');
        return;
      }
      if (!formData.id_nguoi_nhan) {
        alert('Vui lòng chọn điều dưỡng nhận');
        return;
      }
    }

    try {
      const payload = {
        loai_ban_giao: formData.loai_ban_giao,
        id_benh_nhan: formData.id_benh_nhan,
        so_luong: soLuong,
        ly_do: formData.ly_do || null,
      };

      if (formData.loai_ban_giao === 'nguoi_nha_to_dieu_duong') {
        payload.id_nguoi_gui_nguoi_than = formData.id_nguoi_gui_nguoi_than;
        payload.id_nguoi_nhan = formData.id_nguoi_nhan;
      }

      const useTuThuoc = formData.loai_ban_giao === 'dieu_duong_to_benh_nhan' && formData.nguon === 'tu_thuoc';

      if (useTuThuoc) {
        if (!formData.id_tu_thuoc) {
          alert('Vui lòng chọn vật tư từ tủ thuốc');
          return;
        }
        payload.id_tu_thuoc = formData.id_tu_thuoc;
      } else {
        if (!formData.ten_vat_tu?.trim()) {
          alert('Vui lòng nhập tên vật tư');
          return;
        }
        if (!formData.don_vi_tinh?.trim()) {
          alert('Vui lòng nhập đơn vị tính');
          return;
        }
        payload.ten_vat_tu = formData.ten_vat_tu.trim();
        payload.don_vi_tinh = formData.don_vi_tinh.trim();
      }

      await vatTuTieuHaoAPI.create(payload);
      alert('Bàn giao vật tư thành công');
      setShowModal(false);
      setFormData(emptyForm);
      setSelectedNhom('');
      loadRecords();
      loadTuThuoc();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleCancel = async (record) => {
    if (record.trang_thai === 'da_huy') {
      alert('Bản ghi đã được hủy trước đó');
      return;
    }
    if (!confirm(`Hủy bàn giao "${record.ten_vat_tu}"? ${record.id_tu_thuoc ? 'Tồn kho sẽ được hoàn lại.' : ''}`)) return;

    try {
      await vatTuTieuHaoAPI.updateTrangThai(record.id, 'da_huy');
      alert('Đã hủy bàn giao và hoàn kho (nếu có)');
      loadRecords();
      loadTuThuoc();
      if (showDetailModal) setShowDetailModal(false);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa bản ghi này? Tồn kho sẽ được hoàn lại nếu bản ghi đang active.')) return;
    try {
      await vatTuTieuHaoAPI.delete(id);
      alert('Xóa thành công');
      loadRecords();
      loadTuThuoc();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const selectedTuThuoc = tuThuocItems.find((item) => String(item.id) === String(formData.id_tu_thuoc));
  const vatTuTrongNhom = danhMucNgoaiKho.find((n) => n.ma === selectedNhom)?.vat_tu || [];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vật tư tiêu hao</h1>
          <p className="text-sm text-gray-500 mt-1">Sổ nhật ký bàn giao vật tư — truy xuất người gửi, người nhận và thời gian</p>
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setSelectedNhom('');
            setShowModal(true);
          }}
          className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">inventory_2</span>
          Bàn giao vật tư
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            viewMode === 'all' ? 'border-[#4A90E2] text-[#4A90E2]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Tất cả
        </button>
        <button
          onClick={() => setViewMode('hom-nay')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            viewMode === 'hom-nay' ? 'border-[#4A90E2] text-[#4A90E2]' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Hôm nay
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className={`grid grid-cols-1 gap-4 ${viewMode === 'all' ? 'md:grid-cols-5' : 'md:grid-cols-2'}`}>
          <input
            type="text"
            placeholder="Tìm theo tên vật tư hoặc NCT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
          />
          {viewMode === 'all' && (
            <>
              <select
                value={filterBenhNhan}
                onChange={(e) => setFilterBenhNhan(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
              >
                <option value="">Tất cả NCT</option>
                {benhNhans.map((bn) => (
                  <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>
                ))}
              </select>
              <select
                value={filterLoaiBanGiao}
                onChange={(e) => setFilterLoaiBanGiao(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
              >
                <option value="">Tất cả loại bàn giao</option>
                {Object.entries(LOAI_BAN_GIAO_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <select
                value={filterTrangThai}
                onChange={(e) => setFilterTrangThai(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.entries(TRANG_THAI_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <input
                type="date"
                value={filterNgay}
                onChange={(e) => setFilterNgay(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
              />
            </>
          )}
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thời gian</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Loại bàn giao</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vật tư</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">NCT</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Người gửi</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Người nhận</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Số lượng</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nguồn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Không có bản ghi
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{formatDateTime(record.ngay_tao)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          record.loai_ban_giao === 'nguoi_nha_to_dieu_duong'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}>
                          {LOAI_BAN_GIAO_LABELS[record.loai_ban_giao] || LOAI_BAN_GIAO_LABELS.dieu_duong_to_benh_nhan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.ten_vat_tu}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {record.id_benh_nhan ? (
                          <Link to={`/admin/benh-nhan/${record.id_benh_nhan}`} className="text-[#4A90E2] hover:underline">
                            {record.ten_benh_nhan || `#${record.id_benh_nhan}`}
                          </Link>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.ten_nguoi_gui || record.ten_nguoi_ban_giao || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.ten_nguoi_nhan || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.so_luong} {record.don_vi_tinh || ''}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${record.id_tu_thuoc ? 'bg-indigo-100 text-indigo-800' : 'bg-purple-100 text-purple-800'}`}>
                          {record.id_tu_thuoc ? 'Tủ thuốc' : 'Ngoài kho'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${TRANG_THAI_BADGE[record.trang_thai] || 'bg-gray-100 text-gray-800'}`}>
                          {TRANG_THAI_LABELS[record.trang_thai] || record.trang_thai}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => { setViewing(record); setShowDetailModal(true); }}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Chi tiết"
                          >
                            <span className="material-symbols-outlined text-xl">visibility</span>
                          </button>
                          {canManage && record.trang_thai !== 'da_huy' && (
                            <button onClick={() => handleCancel(record)} className="text-amber-600 hover:text-amber-700 p-1" title="Hủy bàn giao">
                              <span className="material-symbols-outlined text-xl">undo</span>
                            </button>
                          )}
                          {canManage && (
                            <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-700 p-1" title="Xóa">
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDetailModal && viewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết bàn giao</h2>
                <button onClick={() => { setShowDetailModal(false); setViewing(null); }} className="text-gray-500 hover:text-gray-700">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500">Loại bàn giao:</span> {LOAI_BAN_GIAO_LABELS[viewing.loai_ban_giao] || LOAI_BAN_GIAO_LABELS.dieu_duong_to_benh_nhan}</div>
                <div><span className="text-gray-500">Vật tư:</span> <span className="font-medium">{viewing.ten_vat_tu}</span></div>
                <div><span className="text-gray-500">Số lượng:</span> {viewing.so_luong} {viewing.don_vi_tinh}</div>
                <div><span className="text-gray-500">NCT:</span> {viewing.ten_benh_nhan || '—'}</div>
                <div><span className="text-gray-500">Người gửi:</span> {viewing.ten_nguoi_gui || viewing.ten_nguoi_ban_giao || '—'}</div>
                <div><span className="text-gray-500">Người nhận:</span> {viewing.ten_nguoi_nhan || '—'}</div>
                <div><span className="text-gray-500">Thời gian:</span> {formatDateTime(viewing.ngay_tao)}</div>
                <div><span className="text-gray-500">Nguồn:</span> {viewing.id_tu_thuoc ? 'Tủ thuốc' : 'Ngoài kho'}</div>
                <div><span className="text-gray-500">Lý do:</span> {viewing.ly_do || '—'}</div>
                <div>
                  <span className="text-gray-500">Trạng thái:</span>{' '}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${TRANG_THAI_BADGE[viewing.trang_thai]}`}>
                    {TRANG_THAI_LABELS[viewing.trang_thai]}
                  </span>
                </div>
              </div>
              {canManage && viewing.trang_thai !== 'da_huy' && (
                <div className="mt-6 flex justify-end">
                  <button onClick={() => handleCancel(viewing)} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                    Hủy bàn giao
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Bàn giao vật tư</h2>
                <button onClick={() => { setShowModal(false); setFormData(emptyForm); setSelectedNhom(''); }} className="text-gray-500 hover:text-gray-700">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại bàn giao <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {Object.entries(LOAI_BAN_GIAO_LABELS).map(([value, label]) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="loai_ban_giao"
                          checked={formData.loai_ban_giao === value}
                          onChange={() => setFormData({
                            ...formData,
                            loai_ban_giao: value,
                            id_nguoi_gui_nguoi_than: '',
                            id_nguoi_nhan: '',
                            ...(value === 'nguoi_nha_to_dieu_duong'
                              ? { nguon: 'ngoai_kho', id_tu_thuoc: '' }
                              : {}),
                          })}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người cao tuổi <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formData.id_benh_nhan}
                    onChange={(e) => setFormData({
                      ...formData,
                      id_benh_nhan: e.target.value,
                      id_nguoi_gui_nguoi_than: '',
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                  >
                    <option value="">— Chọn NCT —</option>
                    {benhNhans.map((bn) => <option key={bn.id} value={bn.id}>{bn.ho_ten}</option>)}
                  </select>
                </div>

                {formData.loai_ban_giao === 'nguoi_nha_to_dieu_duong' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Người nhà bàn giao <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={formData.id_nguoi_gui_nguoi_than}
                        onChange={(e) => setFormData({ ...formData, id_nguoi_gui_nguoi_than: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                        disabled={!formData.id_benh_nhan}
                      >
                        <option value="">— Chọn người nhà —</option>
                        {nguoiThans.map((nt) => (
                          <option key={nt.id} value={nt.id}>
                            {nt.ho_ten}{nt.moi_quan_he ? ` (${nt.moi_quan_he})` : ''}
                          </option>
                        ))}
                      </select>
                      {formData.id_benh_nhan && nguoiThans.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1">Bệnh nhân chưa có người nhà trong hệ thống</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Điều dưỡng nhận <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={formData.id_nguoi_nhan}
                        onChange={(e) => setFormData({ ...formData, id_nguoi_nhan: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                      >
                        <option value="">— Chọn điều dưỡng —</option>
                        {nhanViens.map((nv) => (
                          <option key={nv.id} value={nv.id}>{nv.ho_ten}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {formData.loai_ban_giao === 'dieu_duong_to_benh_nhan' && (
                  <div className="p-3 bg-sky-50 rounded-lg text-sm text-sky-800">
                    Người gửi: <strong>{user?.ho_ten || 'Điều dưỡng đang đăng nhập'}</strong> → Người nhận: bệnh nhân đã chọn
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn vật tư</label>
                  {formData.loai_ban_giao === 'nguoi_nha_to_dieu_duong' ? (
                    <p className="text-sm text-gray-600">Vật tư do người nhà mang đến (ngoài kho)</p>
                  ) : (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="nguon"
                          checked={formData.nguon === 'tu_thuoc'}
                          onChange={() => setFormData({ ...formData, nguon: 'tu_thuoc', ten_vat_tu: '', don_vi_tinh: '' })}
                        />
                        <span className="text-sm">Lấy từ tủ thuốc</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="nguon"
                          checked={formData.nguon === 'ngoai_kho'}
                          onChange={() => setFormData({ ...formData, nguon: 'ngoai_kho', id_tu_thuoc: '' })}
                        />
                        <span className="text-sm">Vật tư khác (ngoài kho)</span>
                      </label>
                    </div>
                  )}
                </div>

                {(formData.loai_ban_giao === 'nguoi_nha_to_dieu_duong' || formData.nguon === 'ngoai_kho') ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm vật tư</label>
                      <select
                        value={selectedNhom}
                        onChange={(e) => {
                          setSelectedNhom(e.target.value);
                          setFormData({ ...formData, ten_vat_tu: '' });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                      >
                        <option value="">— Chọn nhóm —</option>
                        {danhMucNgoaiKho.map((n) => <option key={n.ma} value={n.ma}>{n.ma} — {n.ten_nhom}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên vật tư <span className="text-red-500">*</span></label>
                      {vatTuTrongNhom.length > 0 ? (
                        <select
                          value={formData.ten_vat_tu}
                          onChange={(e) => setFormData({ ...formData, ten_vat_tu: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                        >
                          <option value="">— Chọn hoặc nhập bên dưới —</option>
                          {vatTuTrongNhom.map((vt) => <option key={vt} value={vt}>{vt}</option>)}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.ten_vat_tu}
                          onChange={(e) => setFormData({ ...formData, ten_vat_tu: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                          placeholder="Nhập tên vật tư"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={formData.don_vi_tinh}
                        onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })}
                        placeholder="gói, chiếc, cuộn..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                      />
                    </div>
                  </>
                ) : formData.nguon === 'tu_thuoc' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vật tư trong tủ thuốc <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={formData.id_tu_thuoc}
                      onChange={(e) => setFormData({ ...formData, id_tu_thuoc: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                    >
                      <option value="">— Chọn vật tư —</option>
                      {tuThuocItems.map((item) => (
                        <option key={item.id} value={item.id} disabled={!item.co_the_chon}>
                          {item.ten_thuoc} — còn {item.so_luong_ton} {item.don_vi_tinh || ''} {!item.co_the_chon ? '(không dùng được)' : ''}
                        </option>
                      ))}
                    </select>
                    {selectedTuThuoc && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
                        <div>Tồn: <strong>{selectedTuThuoc.so_luong_ton} {selectedTuThuoc.don_vi_tinh}</strong></div>
                        {selectedTuThuoc.han_su_dung && <div>Hạn dùng: {new Date(selectedTuThuoc.han_su_dung).toLocaleDateString('vi-VN')}</div>}
                        {selectedTuThuoc.chi_dinh && <div>Chỉ định: {selectedTuThuoc.chi_dinh}</div>}
                      </div>
                    )}
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.so_luong}
                    onChange={(e) => setFormData({ ...formData, so_luong: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                  />
                  {selectedTuThuoc && Number(formData.so_luong) > selectedTuThuoc.so_luong_ton && (
                    <p className="text-xs text-red-600 mt-1">
                      Chỉ còn {selectedTuThuoc.so_luong_ton} {selectedTuThuoc.don_vi_tinh}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lý do sử dụng</label>
                  <textarea
                    value={formData.ly_do}
                    onChange={(e) => setFormData({ ...formData, ly_do: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                    placeholder="Không bắt buộc"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); setFormData(emptyForm); setSelectedNhom(''); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]">Bàn giao</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
