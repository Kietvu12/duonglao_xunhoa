import { useCallback, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  buildPhanCaFileFromRows,
  buildCongViecFileFromRows,
  PHAN_CA_EDIT_FIELDS,
  CONG_VIEC_EDIT_FIELDS,
} from '../../utils/importExcelBuilder';

const THANG_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const normalizeNameKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const parseRosterDisplayName = (name) =>
  String(name || '')
    .trim()
    .replace(/^\d+\.\s*/, '');

const isNameAlignedWithDb = (fileName, dbName) => {
  const a = normalizeNameKey(parseRosterDisplayName(fileName));
  const b = normalizeNameKey(dbName);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const aParts = a.split(/\s+/).filter(Boolean);
  const bParts = b.split(/\s+/).filter(Boolean);
  if (aParts.length >= 1 && bParts.length >= 1) {
    if (aParts[aParts.length - 1] === bParts[bParts.length - 1] && aParts[0][0] === bParts[0][0]) {
      return true;
    }
  }
  return false;
};

const pickDefaultRosterSheet = (sheetNames, thang, nam) => {
  const byMonth = sheetNames.find((n) =>
    new RegExp(`th[aá]ng\\s*${Number(thang)}\\.${Number(nam)}`, 'i').test(n)
  );
  return byMonth || sheetNames[0] || '';
};

const recomputePhanCaRowMap = (row, catalog = []) => {
  const idHoSo = String(row.id_ho_so_nhan_vien || '').trim();
  const idTk = String(row.id_tai_khoan || '').trim();
  const hoTenFile = String(row.ho_ten_tren_file || row.ho_ten_nhan_vien || '').trim();

  let nv =
    catalog.find((n) => idHoSo && String(n.id) === idHoSo) ||
    catalog.find((n) => idTk && String(n.id_tai_khoan) === idTk);

  if (!nv && hoTenFile) {
    const key = normalizeNameKey(hoTenFile);
    nv = catalog.find((n) => normalizeNameKey(n.ho_ten) === key);
  }

  if (!nv) {
    return {
      ...row,
      nhan_vien_map_hop: false,
      valid: false,
    };
  }

  const mapHop = isNameAlignedWithDb(hoTenFile || nv.ho_ten, nv.ho_ten);
  return {
    ...row,
    id_ho_so_nhan_vien: nv.id,
    id_tai_khoan: nv.id_tai_khoan,
    ho_ten_nhan_vien: nv.ho_ten,
    nhan_vien_map_hop: mapHop,
    valid: row.valid !== false && mapHop,
  };
};

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

function EditablePreviewTable({ fields, rows, onChange, onDelete, isRowHighlighted }) {
  const rowError = (row) =>
    isRowHighlighted ? isRowHighlighted(row) : row.valid === false || row.nhan_vien_map_hop === false;
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Xem trước & chỉnh sửa ({rows.length} dòng)</span>
        <span className="text-xs text-gray-500">Có thể sửa trực tiếp trên bảng</span>
      </div>
      <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
        <table className="w-full text-sm min-w-[1400px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 w-10">#</th>
              {fields.map((f) => (
                <th key={f.key} className={`px-2 py-2 text-left text-xs font-semibold text-gray-600 ${f.width}`}>
                  {f.label}
                </th>
              ))}
              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 w-16">TT</th>
              <th className="px-2 py-2 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row, idx) => (
              <tr key={row._id ?? idx} className={rowError(row) ? 'bg-red-100/90' : ''}>
                <td className="px-2 py-1.5 text-gray-400 text-xs">{idx + 1}</td>
                {fields.map((f) => (
                  <td key={f.key} className="px-1 py-1">
                    <input
                      type="text"
                      value={row[f.key] ?? ''}
                      onChange={(e) => onChange(idx, f.key, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-[#4A90E2] focus:border-[#4A90E2] outline-none bg-white"
                    />
                  </td>
                ))}
                <td className="px-2 py-1.5">
                  <span className={`text-xs font-semibold ${
                    rowError(row) ? 'text-red-600' : row.valid === true ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {row.nhan_vien_map_hop === false
                      ? 'Map sai'
                      : row.valid === true
                        ? 'OK'
                        : row.valid === false
                          ? 'Lỗi'
                          : '—'}
                  </span>
                </td>
                <td className="px-1 py-1.5">
                  <button
                    type="button"
                    onClick={() => onDelete(idx)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Xóa dòng"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DropZone({ dragging, loading, fileName, onDragEnter, onDragOver, onDragLeave, onDrop, onFileSelect }) {
  const inputRef = useRef(null);

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !loading && inputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
        ${dragging ? 'border-[#4A90E2] bg-blue-50' : 'border-gray-300 hover:border-[#4A90E2] hover:bg-gray-50'}
        ${loading ? 'pointer-events-none opacity-80' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelect(f);
          e.target.value = '';
        }}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-10 h-10 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-700">Đang đọc và kiểm tra file...</p>
          {fileName && <p className="text-xs text-gray-500">{fileName}</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-5xl text-gray-300">cloud_upload</span>
          <div>
            <p className="text-sm font-semibold text-gray-700">Kéo thả file Excel vào đây</p>
            <p className="text-xs text-gray-500 mt-1">hoặc bấm để chọn file (.xlsx, .xls)</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ImportExcelModal({
  open,
  onClose,
  title,
  description,
  templateFilePrefix,
  templateDownloadFileName,
  replaceConfirmText,
  supplementConfirmText,
  downloadTemplate,
  downloadStaffList,
  downloadPatientList,
  downloadCatalog,
  catalogFileName = 'danh-muc.xlsx',
  catalogLabel = 'Tải danh mục',
  editFields: editFieldsProp,
  buildFileFromRows: buildFileFromRowsProp,
  previewImport,
  importData,
  onSuccess,
  previewType = 'phan_ca',
}) {
  const now = new Date();
  const [thang, setThang] = useState(now.getMonth() + 1);
  const [nam, setNam] = useState(now.getFullYear());
  const [cheDo, setCheDo] = useState('bo_sung');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [nhanVienCatalog, setNhanVienCatalog] = useState([]);
  const dragCounter = useRef(0);

  const editFields = editFieldsProp || (previewType === 'phan_ca' ? PHAN_CA_EDIT_FIELDS : CONG_VIEC_EDIT_FIELDS);
  const buildFileFromRows = buildFileFromRowsProp || (previewType === 'phan_ca' ? buildPhanCaFileFromRows : buildCongViecFileFromRows);
  const dataKey = previewType === 'phan_ca' ? 'phanCa' : 'congViec';
  const validLabel = previewType === 'phan_ca' ? 'Phân ca hợp lệ' : 'Công việc hợp lệ';

  const resetState = () => {
    setFile(null);
    setFileName('');
    setPreview(null);
    setRows([]);
    setSheetNames([]);
    setSelectedSheet('');
    setNhanVienCatalog([]);
    setLoading(false);
    setImporting(false);
    setDragging(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const buildFormData = useCallback((uploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('thang', String(thang));
    formData.append('nam', String(nam));
    formData.append('che_do', cheDo);
    if (selectedSheet) {
      formData.append('sheet_name', selectedSheet);
    }
    return formData;
  }, [thang, nam, cheDo, selectedSheet]);

  const applyPreviewResult = (data) => {
    const list = data[dataKey] || [];
    if (data.nhan_vien_danh_muc?.length) {
      setNhanVienCatalog(data.nhan_vien_danh_muc);
    }
    if (data.sheet_name) {
      setSelectedSheet(data.sheet_name);
    } else if (data.summary?.sheet_da_chon) {
      setSelectedSheet(data.summary.sheet_da_chon);
    }
    setPreview(data);
    setRows(list.map((row, i) => ({
      ...row,
      _id: `${row.row}-${i}`,
      gio_bat_dau: row.gio_bat_dau?.slice?.(0, 5) || row.gio_bat_dau || '',
      gio_ket_thuc: row.gio_ket_thuc?.slice?.(0, 5) || row.gio_ket_thuc || '',
      gio: row.gio?.slice?.(0, 5) || row.gio || '',
    })));
  };

  const runPreview = async (uploadFile) => {
    if (!selectedSheet) {
      alert('Vui lòng chọn sheet trước khi xem trước');
      return;
    }
    setLoading(true);
    try {
      const response = await previewImport(buildFormData(uploadFile));
      applyPreviewResult(response.data);
    } catch (error) {
      alert('Lỗi: ' + error.message);
      setPreview(null);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) {
      alert('Vui lòng chọn file Excel (.xlsx, .xls)');
      return;
    }
    setPreview(null);
    setRows([]);
    setLoading(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
      const names = wb.SheetNames || [];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setSheetNames(names);
      setSelectedSheet(pickDefaultRosterSheet(names, thang, nam));
    } catch (error) {
      alert('Không đọc được file Excel: ' + error.message);
      resetState();
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleDownload = async (fetcher, name) => {
    try {
      setLoading(true);
      const blob = await fetcher(thang, nam);
      downloadBlob(blob, name);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadStaff = async () => {
    try {
      setLoading(true);
      const blob = await downloadStaffList();
      downloadBlob(blob, 'danh-sach-nhan-vien.xlsx');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCatalog = async () => {
    if (!downloadCatalog) return;
    try {
      setLoading(true);
      const blob = await downloadCatalog();
      downloadBlob(blob, catalogFileName);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPatients = async () => {
    if (!downloadPatientList) return;
    try {
      setLoading(true);
      const blob = await downloadPatientList();
      downloadBlob(blob, 'danh-sach-benh-nhan.xlsx');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowChange = (index, key, value) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        let next = { ...row, [key]: value, valid: undefined };
        if (
          previewType === 'phan_ca'
          && ['id_ho_so_nhan_vien', 'id_tai_khoan', 'ho_ten_tren_file', 'ho_ten_nhan_vien'].includes(key)
        ) {
          next = recomputePhanCaRowMap(next, nhanVienCatalog);
        }
        return next;
      })
    );
    setPreview((prev) => prev ? { ...prev, summary: { ...prev.summary, tong_loi: undefined } } : null);
  };

  const handleRowDelete = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const revalidateAndImport = async () => {
    if (rows.length === 0) {
      alert('Không có dữ liệu để import');
      return;
    }

    const confirmMsg = cheDo === 'thay_the_thang'
      ? replaceConfirmText.replace('{thang}', thang).replace('{nam}', nam)
      : supplementConfirmText.replace('{thang}', thang).replace('{nam}', nam);

    if (!confirm(confirmMsg)) return;

    setImporting(true);
    try {
      const rebuiltFile = buildFileFromRows(rows, fileName || 'import.xlsx');
      const previewResponse = await previewImport(buildFormData(rebuiltFile));
      applyPreviewResult(previewResponse.data);

      const mapLoi = previewResponse.data.summary?.phan_ca_map_loi || 0;
      if (previewResponse.data.summary?.tong_loi > 0 || mapLoi > 0) {
        alert(
          mapLoi > 0
            ? 'Còn dòng map sai nhân viên (đỏ), kiểm tra ID hồ sơ / họ tên trước khi import'
            : 'Dữ liệu còn lỗi, vui lòng kiểm tra các dòng đỏ trước khi import'
        );
        return;
      }

      const importResponse = await importData(buildFormData(rebuiltFile));
      alert(importResponse.message || 'Import thành công');
      onSuccess?.();
      handleClose();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  const validCount = preview?.summary?.[previewType === 'phan_ca' ? 'phan_ca_hop_le' : 'cong_viec_hop_le'];
  const totalCount = preview?.summary?.[previewType === 'phan_ca' ? 'tong_phan_ca' : 'tong_cong_viec'];
  const hasPreview = preview && rows.length > 0;
  const hasPreviewErrorsOnly = preview && rows.length === 0 && (preview.errors?.length > 0 || preview.summary?.tong_loi > 0);
  const mapLoiCount = preview?.summary?.phan_ca_map_loi ?? rows.filter((r) => r.nhan_vien_map_hop === false).length;
  const hasErrors = preview?.summary?.tong_loi > 0 || mapLoiCount > 0;
  const awaitingSheet = file && !hasPreview && sheetNames.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl w-full max-w-[min(1600px,98vw)] max-h-[94vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-20">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
          <button type="button" onClick={handleClose} className="flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select
                value={thang}
                onChange={(e) => { setThang(Number(e.target.value)); resetState(); }}
                disabled={loading || importing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none disabled:bg-gray-50"
              >
                {THANG_OPTIONS.map((m) => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Năm</label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={nam}
                onChange={(e) => { setNam(Number(e.target.value)); resetState(); }}
                disabled={loading || importing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chế độ import</label>
              <select
                value={cheDo}
                onChange={(e) => setCheDo(e.target.value)}
                disabled={loading || importing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none disabled:bg-gray-50"
              >
                <option value="bo_sung">Bổ sung (bỏ qua trùng)</option>
                <option value="thay_the_thang">Thay thế toàn bộ tháng</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleDownload(
                downloadTemplate,
                templateDownloadFileName || `${templateFilePrefix}-${nam}-${String(thang).padStart(2, '0')}.xlsx`
              )}
              disabled={loading || importing}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              Tải file Excel mẫu
            </button>
            {downloadCatalog && (
              <button
                type="button"
                onClick={handleDownloadCatalog}
                disabled={loading || importing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <span className="material-symbols-outlined text-lg">list_alt</span>
                {catalogLabel}
              </button>
            )}
            {downloadStaffList && !downloadCatalog && (
              <button
                type="button"
                onClick={handleDownloadStaff}
                disabled={loading || importing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <span className="material-symbols-outlined text-lg">group</span>
                Tải danh sách nhân viên
              </button>
            )}
            {downloadPatientList && (
              <button
                type="button"
                onClick={handleDownloadPatients}
                disabled={loading || importing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <span className="material-symbols-outlined text-lg">personal_injury</span>
                Tải danh sách bệnh nhân
              </button>
            )}
          </div>

          {!hasPreview && !awaitingSheet && (
            <DropZone
              dragging={dragging}
              loading={loading}
              fileName={fileName}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileSelect={handleFileSelect}
            />
          )}

          {awaitingSheet && (
            <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="material-symbols-outlined text-green-600">description</span>
                  <span className="font-medium">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="text-sm text-[#4A90E2] hover:underline font-medium"
                >
                  Chọn file khác
                </button>
              </div>
              <p className="text-sm text-gray-600">
                File có {sheetNames.length} sheet — chọn sheet roster (vd. <strong>Tháng 9.2026</strong>) rồi bấm xem trước.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sheet đọc dữ liệu *</label>
                  <select
                    value={selectedSheet}
                    onChange={(e) => setSelectedSheet(e.target.value)}
                    disabled={loading || importing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] outline-none"
                  >
                    {sheetNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => file && runPreview(file)}
                disabled={loading || importing || !selectedSheet}
                className="bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đọc sheet...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">preview</span>
                    Xem trước sheet đã chọn
                  </>
                )}
              </button>
            </div>
          )}

          {hasPreviewErrorsOnly && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-red-800">Không trích xuất được ca từ sheet đã chọn</p>
              <ul className="text-sm text-red-700 space-y-1">
                {preview.errors?.map((err, idx) => (
                  <li key={idx}>[{err.sheet} dòng {err.row}] {err.messages?.join('; ')}</li>
                ))}
              </ul>
              <button type="button" onClick={() => { setPreview(null); setRows([]); }} className="text-sm text-[#4A90E2] font-medium">
                ← Chọn sheet khác
              </button>
            </div>
          )}

          {hasPreview && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-outlined text-green-600 text-lg">description</span>
                  <span>{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  disabled={importing}
                  className="text-sm text-[#4A90E2] hover:underline font-medium"
                >
                  Tải file khác
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">{validLabel}</p>
                  <p className={`text-lg font-bold mt-1 ${validCount === totalCount ? 'text-green-600' : 'text-red-600'}`}>
                    {validCount}/{totalCount}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">Lỗi / map sai NV</p>
                  <p className={`text-lg font-bold mt-1 ${!hasErrors ? 'text-green-600' : 'text-red-600'}`}>
                    {preview.summary.tong_loi}
                    {previewType === 'phan_ca' && mapLoiCount > 0 ? ` (+${mapLoiCount} map)` : ''}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">Tháng import</p>
                  <p className="text-lg font-bold mt-1 text-gray-800">{preview.thang}/{preview.nam}</p>
                </div>
                {previewType === 'phan_ca' && preview.summary?.roster_sheet && (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 md:col-span-3">
                    <p className="text-xs text-gray-500">Sheet roster đã đọc</p>
                    <p className="text-sm font-semibold mt-1 text-gray-800">{preview.summary.roster_sheet}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Import từ ma trận DLXH (Họ và tên × ngày). OFF/NL/… không tạo ca; bảng dưới là dữ liệu đã trích xuất.
                    </p>
                  </div>
                )}
              </div>

              {previewType === 'phan_ca' && preview.summary?.skipped_roster_names?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Tên trên roster chưa khớp nhân viên ({preview.summary.skipped_roster_names.length})
                  </h3>
                  <p className="text-xs text-amber-800 mb-2">
                    Các dòng này bị bỏ qua khi đọc sheet Tháng M.YYYY (DLXH). Kiểm tra họ tên trong danh mục nhân viên.
                  </p>
                  <ul className="text-sm text-amber-900 space-y-1 max-h-28 overflow-y-auto">
                    {preview.summary.skipped_roster_names.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {preview.errors?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-semibold text-red-800 mb-2">Danh sách lỗi</h3>
                  <ul className="text-sm text-red-700 space-y-1 max-h-28 overflow-y-auto">
                    {preview.errors.map((err, idx) => (
                      <li key={idx}>
                        [Dòng {err.row}] {err.messages.join('; ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <EditablePreviewTable
                fields={editFields}
                rows={rows}
                onChange={handleRowChange}
                onDelete={handleRowDelete}
              />

              <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={revalidateAndImport}
                  disabled={importing || rows.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {importing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang import...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">upload</span>
                      Import vào hệ thống
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={importing}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2.5 rounded-lg disabled:opacity-50"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {!hasPreview && !loading && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
