import { useCallback, useRef, useState } from 'react';
import {
  buildPhanCaFileFromRows,
  buildCongViecFileFromRows,
  PHAN_CA_EDIT_FIELDS,
  CONG_VIEC_EDIT_FIELDS,
} from '../../utils/importExcelBuilder';

const THANG_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

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

function EditablePreviewTable({ fields, rows, onChange, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Xem trước & chỉnh sửa ({rows.length} dòng)</span>
        <span className="text-xs text-gray-500">Có thể sửa trực tiếp trên bảng</span>
      </div>
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm min-w-[900px]">
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
              <tr key={row._id ?? idx} className={row.valid === false ? 'bg-red-50/80' : ''}>
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
                    row.valid === true ? 'text-green-600' : row.valid === false ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {row.valid === true ? 'OK' : row.valid === false ? 'Lỗi' : '—'}
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
    return formData;
  }, [thang, nam, cheDo]);

  const applyPreviewResult = (data) => {
    const list = data[dataKey] || [];
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
    setLoading(true);
    try {
      const response = await previewImport(buildFormData(uploadFile));
      applyPreviewResult(response.data);
    } catch (error) {
      alert('Lỗi: ' + error.message);
      resetState();
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
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(null);
    setRows([]);
    await runPreview(selectedFile);
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
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value, valid: undefined } : row)));
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

      if (previewResponse.data.summary?.tong_loi > 0) {
        alert('Dữ liệu còn lỗi, vui lòng kiểm tra các dòng đỏ trước khi import');
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
  const hasErrors = preview?.summary?.tong_loi > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto shadow-2xl">
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
              onClick={() => handleDownload(downloadTemplate, `${templateFilePrefix}-${nam}-${String(thang).padStart(2, '0')}.xlsx`)}
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

          {!hasPreview && (
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
                  <p className="text-xs text-gray-500">Lỗi</p>
                  <p className={`text-lg font-bold mt-1 ${!hasErrors ? 'text-green-600' : 'text-red-600'}`}>
                    {preview.summary.tong_loi}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-500">Tháng import</p>
                  <p className="text-lg font-bold mt-1 text-gray-800">{preview.thang}/{preview.nam}</p>
                </div>
              </div>

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
