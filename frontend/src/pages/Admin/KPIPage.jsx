import { useEffect, useState } from 'react';
import { kpiAPI, nhanVienAPI } from '../../services/api';

// Component Modal Cấu hình điểm
function DiemConfigModal({ diemMucUuTien, onClose, onUpdate, onReload, getMucUuTienLabel }) {
  const [diemValues, setDiemValues] = useState({
    thap: 0,
    trung_binh: 0,
    cao: 0
  });

  useEffect(() => {
    const values = {};
    ['thap', 'trung_binh', 'cao'].forEach(mucUuTien => {
      const config = diemMucUuTien.find(d => d.muc_uu_tien === mucUuTien);
      values[mucUuTien] = config?.diem_so || 0;
    });
    setDiemValues(values);
  }, [diemMucUuTien]);

  const handleSave = async (mucUuTien) => {
    await onUpdate(mucUuTien, diemValues[mucUuTien]);
    onReload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
      <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-black text-gray-800">Cấu hình điểm số</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
          </button>
        </div>
        <div className="space-y-4">
          {['thap', 'trung_binh', 'cao'].map((mucUuTien) => (
            <div key={mucUuTien} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{getMucUuTienLabel(mucUuTien)}</p>
                <p className="text-xs text-gray-500">Điểm số khi hoàn thành đúng hạn</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={diemValues[mucUuTien]}
                  onChange={(e) => setDiemValues(prev => ({ ...prev, [mucUuTien]: Number(e.target.value) }))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={() => handleSave(mucUuTien)}
                  className="px-3 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 text-sm font-semibold"
                >
                  Lưu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KPIPage() {
  const [kpis, setKpis] = useState([]);
  const [nhanViens, setNhanViens] = useState([]);
  const [diemMucUuTien, setDiemMucUuTien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDiemConfigModal, setShowDiemConfigModal] = useState(false);
  const [showTinhKPIModal, setShowTinhKPIModal] = useState(false);
  const [selectedNhanVien, setSelectedNhanVien] = useState(null);
  const [selectedThang, setSelectedThang] = useState(new Date().getMonth() + 1);
  const [selectedNam, setSelectedNam] = useState(new Date().getFullYear());
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter state
  const [filterThang, setFilterThang] = useState('');
  const [filterNam, setFilterNam] = useState(new Date().getFullYear());
  const [filterNhanVien, setFilterNhanVien] = useState('');

  useEffect(() => {
    loadKPIs();
    loadNhanViens();
    loadDiemMucUuTien();
  }, [page, limit, filterThang, filterNam, filterNhanVien]);

  const loadKPIs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
      };
      if (filterThang) params.thang = filterThang;
      if (filterNam) params.nam = filterNam;
      if (filterNhanVien) params.id_tai_khoan = filterNhanVien;

      const response = await kpiAPI.getAll(params);
      setKpis(response.data || []);
      setTotal(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error) {
      console.error('Error loading KPIs:', error);
      alert('Lỗi khi tải danh sách KPI: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadNhanViens = async () => {
    try {
      const response = await nhanVienAPI.getAll({ limit: -1 });
      setNhanViens(response.data || []);
    } catch (error) {
      console.error('Error loading nhan viens:', error);
    }
  };

  const loadDiemMucUuTien = async () => {
    try {
      const response = await kpiAPI.getDiemMucUuTien();
      setDiemMucUuTien(response.data || []);
    } catch (error) {
      console.error('Error loading diem muc uu tien:', error);
    }
  };

  const handleTinhKPI = async () => {
    if (!selectedNhanVien || !selectedThang || !selectedNam) {
      alert('Vui lòng chọn đầy đủ thông tin');
      return;
    }

    try {
      await kpiAPI.tinhKPI({
        id_tai_khoan: selectedNhanVien,
        thang: selectedThang,
        nam: selectedNam,
      });
      alert('Tính KPI thành công');
      setShowTinhKPIModal(false);
      setSelectedNhanVien(null);
      loadKPIs();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleUpdateDiem = async (mucUuTien, diemSo) => {
    try {
      await kpiAPI.updateDiemMucUuTien({
        muc_uu_tien: mucUuTien,
        diem_so: diemSo,
      });
      alert('Cập nhật điểm số thành công');
      loadDiemMucUuTien();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const getDiemSo = (mucUuTien) => {
    const config = diemMucUuTien.find(d => d.muc_uu_tien === mucUuTien);
    return config?.diem_so || 0;
  };

  const getMucUuTienLabel = (mucUuTien) => {
    const labels = {
      'thap': 'Thấp',
      'trung_binh': 'Trung bình',
      'cao': 'Cao'
    };
    return labels[mucUuTien] || mucUuTien;
  };

  const getKpiColor = (tyLeKpi) => {
    if (tyLeKpi >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (tyLeKpi >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  // Tạo danh sách tháng
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // Tạo danh sách năm (5 năm gần đây)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Quản lý KPI Nhân viên</h1>
          <p className="text-gray-600 mt-2">Theo dõi và đánh giá hiệu suất làm việc</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiemConfigModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>settings</span>
            <span>Cấu hình điểm</span>
          </button>
          <button
            onClick={() => setShowTinhKPIModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calculate</span>
            <span>Tính KPI</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhân viên
            </label>
            <select
              value={filterNhanVien}
              onChange={(e) => {
                setFilterNhanVien(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
            >
              <option value="">Tất cả</option>
              {nhanViens.map((nv) => (
                <option key={nv.id_tai_khoan} value={nv.id_tai_khoan}>
                  {nv.ho_ten}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tháng
            </label>
            <select
              value={filterThang}
              onChange={(e) => {
                setFilterThang(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
            >
              <option value="">Tất cả</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Năm
            </label>
            <select
              value={filterNam}
              onChange={(e) => {
                setFilterNam(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-gray-500">Đang tải...</div>
        ) : kpis.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>bar_chart</span>
            <p className="text-gray-500 text-lg mb-2">Chưa có dữ liệu KPI</p>
            <p className="text-gray-400 text-sm">Bấm "Tính KPI" để tạo dữ liệu</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nhân viên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tháng/Năm</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tỷ lệ KPI</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Điểm kiếm được</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tổng điểm</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Công việc</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kpis.map((kpi) => (
                  <tr key={kpi.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {kpi.ho_ten?.charAt(0)?.toUpperCase() || 'N'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{kpi.ho_ten || '-'}</p>
                          <p className="text-xs text-gray-500">{kpi.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {kpi.thang}/{kpi.nam}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className={`px-3 py-1.5 rounded-lg border text-sm font-semibold inline-block ${getKpiColor(kpi.ty_le_kpi || 0)}`}>
                        {kpi.ty_le_kpi?.toFixed(2) || '0.00'}%
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-900 font-semibold">
                        {kpi.tong_diem_kiem_duoc || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        / {kpi.tong_diem_cong_viec || 0}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Tổng:</span>
                          <span className="font-semibold">{kpi.so_cong_viec_duoc_giao || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">Đúng hạn:</span>
                          <span className="font-semibold">{kpi.so_cong_viec_hoan_thanh_dung_han || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600">Trễ hạn:</span>
                          <span className="font-semibold">{kpi.so_cong_viec_hoan_thanh_tre_han || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Chưa hoàn thành:</span>
                          <span className="font-semibold">{kpi.so_cong_viec_chua_hoan_thanh || 0}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && kpis.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 font-medium">
                Hiển thị:
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-sm text-gray-800"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">/ trang</span>
            </div>

            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-semibold text-gray-900">
                {((page - 1) * limit) + 1}
              </span> - <span className="font-semibold text-gray-900">
                {Math.min(page * limit, total)}
              </span> trong tổng số <span className="font-semibold text-gray-900">{total}</span> KPI
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_left</span>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                        page === pageNum
                          ? 'bg-[#4A90E2] text-white'
                          : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cấu hình điểm */}
      {showDiemConfigModal && <DiemConfigModal 
        diemMucUuTien={diemMucUuTien}
        onClose={() => setShowDiemConfigModal(false)}
        onUpdate={handleUpdateDiem}
        onReload={loadDiemMucUuTien}
        getMucUuTienLabel={getMucUuTienLabel}
      />}

      {/* Modal Tính KPI */}
      {showTinhKPIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-raleway p-4">
          <div className="bg-white rounded-xl p-6 lg:p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-black text-gray-800">Tính KPI</h2>
              <button
                onClick={() => {
                  setShowTinhKPIModal(false);
                  setSelectedNhanVien(null);
                }}
                className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nhân viên *
                </label>
                <select
                  value={selectedNhanVien || ''}
                  onChange={(e) => setSelectedNhanVien(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                >
                  <option value="">Chọn nhân viên</option>
                  {nhanViens.map((nv) => (
                    <option key={nv.id_tai_khoan} value={nv.id_tai_khoan}>
                      {nv.ho_ten}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tháng *
                  </label>
                  <select
                    value={selectedThang}
                    onChange={(e) => setSelectedThang(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    {months.map((m) => (
                      <option key={m} value={m}>
                        Tháng {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Năm *
                  </label>
                  <select
                    value={selectedNam}
                    onChange={(e) => setSelectedNam(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowTinhKPIModal(false);
                    setSelectedNhanVien(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  Hủy
                </button>
                <button
                  onClick={handleTinhKPI}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calculate</span>
                  <span>Tính KPI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

