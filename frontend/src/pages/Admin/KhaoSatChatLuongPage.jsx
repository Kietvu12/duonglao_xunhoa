import React, { useEffect, useMemo, useState } from 'react';
import { khaoSatChatLuongAPI } from '../../services/api';
import { downloadWorkbook, exportKhaoSatToExcel } from '../../services/khaoSatChatLuongExport';
const ROOM_STATUS_OPTIONS = [
  { value: '', label: 'Trắng - Chưa khảo sát' },
  { value: 'tot', label: '✓ Tốt' },
  { value: 'co_van_de', label: '✗ Có vấn đề' },
  { value: 'khong_co', label: '○ Không có' },
];

const roomRowsToaA = [
  { stt: 1, phong: 'Phòng Sáng Lọc', tang: 'Tầng 1' },
  { stt: 2, phong: 'Phòng Giám Đốc', tang: 'Tầng 1' },
  { stt: 3, phong: 'Phòng 03', tang: 'Tầng 1' },
  { stt: 4, phong: 'Phòng 04', tang: 'Tầng 1' },
  { stt: 5, phong: 'Phòng 05', tang: 'Tầng 1' },
  { stt: 6, phong: 'Phòng 06', tang: 'Tầng 1' },
  { stt: 7, phong: 'Mẫu Đơn 201', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 8, phong: 'Mẫu Đơn 202', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 9, phong: 'Mẫu Đơn 203', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 10, phong: 'Mẫu Đơn 205', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 11, phong: 'Mẫu Đơn 206', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 12, phong: 'Mẫu Đơn 208', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 13, phong: 'Mẫu Đơn 209', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 14, phong: 'Mẫu Đơn 210', tang: 'Tầng 2 - Mẫu Đơn' },
  { stt: 15, phong: 'Hội Trường', tang: 'Tầng 3 - Sen' },
  { stt: 16, phong: 'Sen 301', tang: 'Tầng 3 - Sen' },
  { stt: 17, phong: 'Sen 302', tang: 'Tầng 3 - Sen' },
  { stt: 18, phong: 'Sen 303', tang: 'Tầng 3 - Sen' },
];

const roomRowsToaB = [
  { stt: 1, phong: 'Mai 101', tang: 'Tầng 1 - Mai' },
  { stt: 2, phong: 'Mai 102', tang: 'Tầng 1 - Mai' },
  { stt: 3, phong: 'Mai 103', tang: 'Tầng 1 - Mai' },
  { stt: 4, phong: 'Mai 105', tang: 'Tầng 1 - Mai' },
  { stt: 5, phong: 'Mai 106', tang: 'Tầng 1 - Mai' },
  { stt: 6, phong: 'Mai 108', tang: 'Tầng 1 - Mai' },
  { stt: 7, phong: 'Mai 109', tang: 'Tầng 1 - Mai' },
  { stt: 8, phong: 'Mai 110', tang: 'Tầng 1 - Mai' },
  { stt: 9, phong: 'Hoa Hồng 201', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 10, phong: 'Hoa Hồng 202', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 11, phong: 'Hoa Hồng 203', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 12, phong: 'Hoa Hồng 205', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 13, phong: 'Hoa Hồng 206', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 14, phong: 'Hoa Hồng 208', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 15, phong: 'Hoa Hồng 209', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 16, phong: 'Hoa Hồng 210', tang: 'Tầng 2 - Hoa Hồng' },
  { stt: 17, phong: 'Lavender 301', tang: 'Tầng 3 - Lavender' },
  { stt: 18, phong: 'Lavender 302', tang: 'Tầng 3 - Lavender' },
  { stt: 19, phong: 'Lavender 303', tang: 'Tầng 3 - Lavender' },
  { stt: 20, phong: 'Lavender 305', tang: 'Tầng 3 - Lavender' },
  { stt: 21, phong: 'Lavender 306', tang: 'Tầng 3 - Lavender' },
  { stt: 22, phong: 'Lavender 308', tang: 'Tầng 3 - Lavender' },
  { stt: 23, phong: 'Lavender 309', tang: 'Tầng 3 - Lavender' },
  { stt: 24, phong: 'Lavender 310', tang: 'Tầng 3 - Lavender' },
];

const defaultRoomData = (rows) => rows.map((row) => ({
  ...row,
  giuong: '',
  tu: '',
  tu_lanh: '',
  dieu_hoa: '',
  chan_ga_goi: '',
  den: '',
  o_cam: '',
  nha_ve_sinh: '',
  khoa_cua: '',
  khan_tam: '',
  hoan_thanh: '',
  so_van_de: '',
  ghi_chu: '',
}));

const createEmptySurvey = () => ({
  ten_file: '',
  ngay_tao: '',
  nguoi_kiem_tra: '',
  toa_a: defaultRoomData(roomRowsToaA),
  toa_b: defaultRoomData(roomRowsToaB),
  tong_hop: [],
});

const formatDateTimeForFileName = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
};

const EXTRA_ROW_KEYS = ['stt', 'phong', 'ghi_chu', 'so_van_de', 'hoan_thanh', 'tang', 'originalIndex'];

const countMarked = (row) => Object.entries(row)
  .filter(([key, value]) => !EXTRA_ROW_KEYS.includes(key) && value === 'tot')
  .length;

const countIssues = (row) => {
  const directIssues = Object.entries(row)
    .filter(([key, value]) => !EXTRA_ROW_KEYS.includes(key) && value === 'co_van_de')
    .length;

  const manualIssues = Number(row.so_van_de || 0);
  return directIssues + manualIssues;
};

const getProgress = (row) => {
  const fields = Object.entries(row).filter(([key, value]) => !EXTRA_ROW_KEYS.includes(key) && value !== undefined);
  const answered = fields.filter(([, value]) => value !== '').length;
  return Math.min(answered * 10, 100);
};

const buildSummaryRows = (toaA, toaB) => {
  const combined = [
    ...toaA.map((row) => ({ ...row, toa: 'Toa A' })),
    ...toaB.map((row) => ({ ...row, toa: 'Toa B' })),
  ];
  return combined.map((row) => ({
    toa: row.toa,
    tang: row.tang,
    phong: row.phong,
    progress: Math.min(getProgress(row), 100),
    issues: countIssues(row),
    totalMarked: countMarked(row),
    ghi_chu: row.ghi_chu || '',
  }));
};

const createSummaryState = (toaA, toaB) => buildSummaryRows(toaA, toaB);

const inferTang = (row, title) => {
  if (row.tang) return row.tang;
  if (title.includes('TOÀ A')) {
    if (row.stt <= 6) return 'Tầng 1';
    if (row.stt <= 14) return 'Tầng 2 - Mẫu Đơn';
    return 'Tầng 3 - Sen';
  }
  if (row.stt <= 8) return 'Tầng 1 - Mai';
  if (row.stt <= 16) return 'Tầng 2 - Hoa Hồng';
  return 'Tầng 3 - Lavender';
};

const SheetTable = ({ title, subtitle, rows, onChangeCell }) => {
  const columns = [
    { key: 'stt', label: 'STT', type: 'text', readOnly: true },
    { key: 'phong', label: 'Tên phòng', type: 'text', readOnly: true },
    { key: 'giuong', label: 'Giường', type: 'select' },
    { key: 'tu', label: 'Tủ', type: 'select' },
    { key: 'tu_lanh', label: 'Tủ lạnh', type: 'select' },
    { key: 'dieu_hoa', label: 'Điều hòa', type: 'select' },
    { key: 'chan_ga_goi', label: 'Chăn ga gối', type: 'select' },
    { key: 'den', label: 'Đèn', type: 'select' },
    { key: 'o_cam', label: 'Ổ cắm', type: 'select' },
    { key: 'nha_ve_sinh', label: 'Nhà vệ sinh', type: 'select' },
    { key: 'khoa_cua', label: 'Khóa cửa', type: 'select' },
    { key: 'khan_tam', label: 'Khăn tắm', type: 'select' },
    { key: 'hoan_thanh', label: '% Hoàn thành', type: 'text', readOnly: true },
    { key: 'so_van_de', label: 'Số vấn đề', type: 'text', readOnly: true },
    { key: 'ghi_chu', label: 'Ghi chú/Ảnh', type: 'text' },
  ];

  const rowsByTang = rows.reduce((acc, row, originalIndex) => {
    const key = inferTang(row, title);
    if (!acc[key]) acc[key] = [];
    acc[key].push({ ...row, tang: key, originalIndex });
    return acc;
  }, {});

  const sortedTangKeys = Object.keys(rowsByTang).sort((a, b) => {
    const order = (value) => {
      if (value === 'Tầng 1') return 1;
      const match = value.match(/Tầng\s+(\d+)/i);
      return match ? Number(match[1]) : 99;
    };
    return order(a) - order(b) || a.localeCompare(b, 'vi');
  });

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="px-4 sm:px-5 py-4 bg-[#1E3A6D] text-white">
        <h2 className="text-lg sm:text-xl font-bold text-center leading-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-center mt-1 text-white/80">{subtitle}</p>}
      </div>
      <div className="block md:hidden p-3 space-y-3">
        {sortedTangKeys.map((tang) => (
          <div key={tang} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-3 py-2 bg-[#2F75B5] text-white font-semibold text-sm">{tang}</div>
            <div className="divide-y divide-slate-200">
              {rowsByTang[tang].map((row, rowIndex) => (
                <div key={`${row.phong}-${row.originalIndex ?? rowIndex}`} className="p-3 space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{row.stt}. {row.phong}</p>
                      <p className="text-xs text-slate-500">{tang}</p>
                    </div>
                    <div className="text-right text-xs font-semibold text-slate-700">
                      <div>{getProgress(row)}%</div>
                      <div>{countIssues(row)} vấn đề</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {columns.filter((column) => column.type === 'select' && column.key !== 'hoan_thanh' && column.key !== 'so_van_de').map((column) => {
                      const value = row[column.key] ?? '';
                      return (
                        <label key={column.key} className="flex flex-col gap-1">
                          <span className="text-[11px] font-medium text-slate-500">{column.label}</span>
                          <select
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm outline-none appearance-none"
                            style={{ backgroundImage: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                            value={value}
                            onChange={(e) => onChangeCell(row.originalIndex ?? rowIndex, column.key, e.target.value)}
                          >
                            {ROOM_STATUS_OPTIONS.map((option) => (
                              <option key={option.value || 'blank'} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </label>
                      );
                    })}
                  </div>
                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] font-medium text-slate-500">Ghi chú/Ảnh</span>
                    <input
                      type="text"
                      value={row.ghi_chu || ''}
                      onChange={(e) => onChangeCell(row.originalIndex ?? rowIndex, 'ghi_chu', e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none text-sm"
                      placeholder="Ghi chú"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1400px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#2F75B5] text-white">
              {columns.map((column) => (
                <th key={column.key} className="border border-white/30 px-3 py-2 text-center whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedTangKeys.map((tang) => (
              <React.Fragment key={tang}>
                <tr className="bg-[#2F75B5] text-white">
                  <td colSpan={columns.length} className="border border-white/30 px-3 py-2 font-bold text-left">
                    {tang}
                  </td>
                </tr>
                {rowsByTang[tang].map((row, rowIndex) => (
                  <tr key={`${row.phong}-${row.originalIndex ?? rowIndex}`} className={rowIndex % 2 === 0 ? 'bg-[#FFF8E1]' : 'bg-white'}>
                    {columns.map((column) => {
                      const value = row[column.key] ?? '';
                      if (column.key === 'hoan_thanh') {
                        return (
                          <td key={column.key} className="border px-3 py-2 text-center font-medium bg-rose-50">
                            {getProgress(row)}%
                          </td>
                        );
                      }
                      if (column.key === 'so_van_de') {
                        return (
                          <td key={column.key} className="border px-3 py-2 text-center font-medium bg-rose-50">
                            {countIssues(row)}
                          </td>
                        );
                      }
                      if (column.readOnly) {
                        return (
                          <td key={column.key} className="border px-3 py-2 text-center font-medium">
                            {value}
                          </td>
                        );
                      }

                      if (column.type === 'select') {
                        return (
                          <td key={column.key} className="border px-2 py-1">
                            <select
                              className="w-full bg-transparent outline-none text-center appearance-none"
                              style={{
                                backgroundImage: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                paddingRight: '0.5rem',
                              }}
                              value={value}
                              onChange={(e) => onChangeCell(row.originalIndex ?? rowIndex, column.key, e.target.value)}
                            >
                              {ROOM_STATUS_OPTIONS.map((option) => (
                                <option key={option.value || 'blank'} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      return (
                        <td key={column.key} className="border px-2 py-1">
                          <input
                            type={column.type}
                            value={value}
                            onChange={(e) => onChangeCell(row.originalIndex ?? rowIndex, column.key, e.target.value)}
                            className="w-full bg-transparent outline-none text-center"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function KhaoSatChatLuongPage() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeSheet, setActiveSheet] = useState('toa-a');
  const [formData, setFormData] = useState(createEmptySurvey());

  useEffect(() => {
    loadSurveys();
  }, [selectedDate]);

  const groupedByDate = useMemo(() => surveys.reduce((acc, item) => {
    const key = (item.ngay_tao || '').slice(0, 10) || 'Không rõ';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {}), [surveys]);

  const dateGroups = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDate) params.date = selectedDate;
      const response = await khaoSatChatLuongAPI.getAll(params);
      setSurveys(response.data || []);
    } catch (error) {
      alert('Lỗi khi tải khảo sát: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    const empty = createEmptySurvey();
    setFormData({
      ...empty,
      ngay_tao: new Date().toISOString().slice(0, 16),
    });
    createSummaryState(empty.toa_a, empty.toa_b);
    setActiveSheet('toa-a');
    setShowEditor(true);
  };

  const openEdit = (item) => {
    const chatLuong = item.chat_luong || {};
    setEditing(item);
    const toaA = Array.isArray(chatLuong.toa_a) ? chatLuong.toa_a : defaultRoomData(roomRowsToaA);
    const toaB = Array.isArray(chatLuong.toa_b) ? chatLuong.toa_b : defaultRoomData(roomRowsToaB);
    setFormData({
      ten_file: item.ten_file || '',
      ngay_tao: (item.ngay_tao || '').slice(0, 16),
      nguoi_kiem_tra: chatLuong.nguoi_kiem_tra || '',
      toa_a: toaA,
      toa_b: toaB,
      tong_hop: Array.isArray(chatLuong.tong_hop) ? chatLuong.tong_hop : [],
    });
    createSummaryState(toaA, toaB);
    setActiveSheet('toa-a');
    setShowEditor(true);
  };

  const resetEditor = () => {
    setFormData(createEmptySurvey());
    setEditing(null);
    setShowEditor(false);
  };

  const updateRoomCell = (sheetKey, rowIndex, key, value) => {
    setFormData((prev) => {
      const nextSheet = [...prev[sheetKey]];
      nextSheet[rowIndex] = { ...nextSheet[rowIndex], [key]: value };
      const nextSummary = buildSummaryRows(
        sheetKey === 'toa_a' ? nextSheet : prev.toa_a,
        sheetKey === 'toa_b' ? nextSheet : prev.toa_b,
      );
      // summary is derived on render
      return {
        ...prev,
        [sheetKey]: nextSheet,
        tong_hop: nextSummary,
      };
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ten_file: formData.ten_file || formatDateTimeForFileName(formData.ngay_tao) || 'khao-sat',
        ngay_tao: formData.ngay_tao || new Date().toISOString(),
        chat_luong: {
          nguoi_kiem_tra: formData.nguoi_kiem_tra,
          toa_a: formData.toa_a,
          toa_b: formData.toa_b,
          tong_hop: buildSummaryRows(formData.toa_a, formData.toa_b),
        },
        media: [],
      };

      if (editing) {
        await khaoSatChatLuongAPI.update(editing.id, payload);
      } else {
        await khaoSatChatLuongAPI.create(payload);
      }

      setShowEditor(false);
      resetEditor();
      loadSurveys();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa khảo sát này?')) return;
    await khaoSatChatLuongAPI.delete(id);
    loadSurveys();
  };

  const handleExport = (survey) => {
    const workbook = exportKhaoSatToExcel(survey);
    downloadWorkbook(workbook, survey.ten_file || `khao-sat-${survey.id}`);
  };

  const currentSheetTitle = activeSheet === 'toa-a' ? 'BẢNG KIỂM TRA PHÒNG – TOÀ A' : activeSheet === 'toa-b' ? 'BẢNG KIỂM TRA PHÒNG – TOÀ B' : 'TỔNG HỢP KIỂM TRA – TẤT CẢ TÒA NHÀ';

  return (
    <div className="relative z-0 p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Khảo sát chất lượng</h1>
          <p className="text-sm text-gray-600 mt-1">Mỗi file khảo sát là một bộ sheet dạng bảng kiểm tra, lưu JSON vào database.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            type="button"
            onClick={openCreate}
            className="relative z-10 bg-[#4A90E2] text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-[#357ABD] transition-colors"
          >
            Thêm khảo sát
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="space-y-6">
          {dateGroups.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border text-center text-gray-500">Chưa có khảo sát nào.</div>
          ) : dateGroups.map((date) => (
            <div key={date} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Ngày {date}</h2>
                <span className="text-sm text-gray-500">{groupedByDate[date].length} file</span>
              </div>
              <div className="divide-y">
                {groupedByDate[date].map((item) => (
                  <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item.ten_file}</p>
                      <p className="text-sm text-gray-500">{item.ngay_tao}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-4 py-2 border rounded-lg" onClick={() => openEdit(item)}>Sửa</button>
                      <button className="px-4 py-2 border rounded-lg" onClick={() => handleExport(item)}>Xuất Excel</button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="relative z-20 px-5 py-4 bg-[#1E3A6D] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">{currentSheetTitle}</h2>
              <p className="text-sm text-white/80">{editing ? 'Chỉnh sửa khảo sát' : 'Tạo khảo sát mới'}</p>
            </div>
            <div className="relative z-20 flex gap-2 flex-wrap">
              <button type="button" onClick={() => setActiveSheet('toa-a')} className={`px-4 py-2 rounded-lg font-semibold ${activeSheet === 'toa-a' ? 'bg-white text-[#1E3A6D]' : 'bg-white/10 text-white'}`}>Toà A</button>
              <button type="button" onClick={() => setActiveSheet('toa-b')} className={`px-4 py-2 rounded-lg font-semibold ${activeSheet === 'toa-b' ? 'bg-white text-[#1E3A6D]' : 'bg-white/10 text-white'}`}>Toà B</button>
              <button type="button" onClick={() => setActiveSheet('tong-hop')} className={`px-4 py-2 rounded-lg font-semibold ${activeSheet === 'tong-hop' ? 'bg-white text-[#1E3A6D]' : 'bg-white/10 text-white'}`}>Tổng hợp</button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Tên file</label>
                <input className="w-full border rounded-lg px-4 py-2" value={formData.ten_file} onChange={(e) => setFormData((p) => ({ ...p, ten_file: e.target.value }))} placeholder="Tự động theo ngày tạo nếu để trống" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Ngày tạo</label>
                <input type="datetime-local" className="w-full border rounded-lg px-4 py-2" value={formData.ngay_tao} onChange={(e) => setFormData((p) => ({ ...p, ngay_tao: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Người kiểm tra</label>
                <input className="w-full border rounded-lg px-4 py-2" value={formData.nguoi_kiem_tra} onChange={(e) => setFormData((p) => ({ ...p, nguoi_kiem_tra: e.target.value }))} />
              </div>
            </div>

            {activeSheet === 'toa-a' && (
              <SheetTable title="BẢNG KIỂM TRA PHÒNG – TOÀ A" subtitle="Nhập dữ liệu cho từng phòng" rows={formData.toa_a} onChangeCell={(rowIndex, key, value) => updateRoomCell('toa_a', rowIndex, key, value)} />
            )}
            {activeSheet === 'toa-b' && (
              <SheetTable title="BẢNG KIỂM TRA PHÒNG – TOÀ B" subtitle="Nhập dữ liệu cho từng phòng" rows={formData.toa_b} onChangeCell={(rowIndex, key, value) => updateRoomCell('toa_b', rowIndex, key, value)} />
            )}
            {activeSheet === 'tong-hop' && (
              <div className="bg-white rounded-2xl border overflow-hidden">
                <div className="px-5 py-4 bg-[#1E3A6D] text-white">
                  <h2 className="text-xl font-bold text-center">TỔNG HỢP KIỂM TRA – TẤT CẢ TÒA NHÀ</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-[900px] w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#2F75B5] text-white">
                        <th className="border px-3 py-2">STT</th>
                        <th className="border px-3 py-2">Toà</th>
                        <th className="border px-3 py-2">Phòng</th>
                        <th className="border px-3 py-2">% Hoàn thành</th>
                        <th className="border px-3 py-2">Tốt</th>
                        <th className="border px-3 py-2">Có vấn đề</th>
                        <th className="border px-3 py-2">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildSummaryRows(formData.toa_a, formData.toa_b).map((row, idx) => (
                        <tr key={`${row.toa}-${row.phong}-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border px-3 py-2 text-center">{idx + 1}</td>
                          <td className="border px-3 py-2">{row.toa}</td>
                          <td className="border px-3 py-2">{row.phong}</td>
                          <td className="border px-3 py-2 text-center">{row.progress}%</td>
                          <td className="border px-3 py-2 text-center">{row.totalMarked}</td>
                          <td className="border px-3 py-2 text-center">{row.issues}</td>
                          <td className="border px-3 py-2">{row.ghi_chu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={resetEditor} className="px-4 py-2 border rounded-lg">Hủy</button>
              <button type="button" onClick={handleSave} className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg font-semibold">Lưu khảo sát</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
