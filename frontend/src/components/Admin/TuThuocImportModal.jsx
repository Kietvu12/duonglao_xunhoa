import { useCallback, useRef, useState } from 'react';
import { buildTuThuocFileFromRows, TU_THUOC_EDIT_FIELDS } from '../../utils/importExcelBuilder';
import { tuThuocAPI } from '../../services/api';

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

function EditablePreviewTable({ rows, onChange, onDelete }) {
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
              {TU_THUOC_EDIT_FIELDS.map((f) => (
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
                {TU_THUOC_EDIT_FIELDS.map((f) => (
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

export default function TuThuocImportModal({ open, onClose, onSuccess }) {
  const [cheDo, setCheDo] = useState('bo_sung');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const dragCounter = useRef(0);

  const resetState = () => {
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
    formData.append('che_do', cheDo);
    return formData;
  }, [cheDo]);

  const applyPreviewResult = (data) => {
    const list = data.items || [];
    setPreview(data);
    setRows(list.map((row, i) => ({
      ...row,
      _id: `${row.row}-${i}`,
    })));
  };

  const runPreview = async (uploadFile) => {
    setLoading(true);
    try {
      const response = await tuThuocAPI.previewImport(buildFormData(uploadFile));
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

  const handleRevalidate = async () => {
    if (rows.length === 0) return;
    setLoading(true);
    try {
      const file = buildTuThuocFileFromRows(rows, 'import-tu-thuoc.xlsx');
      await runPreview(file);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (rows.length === 0) {
      alert('Chưa có dữ liệu để import');
      return;
    }

    const invalidCount = rows.filter((r) => r.valid === false).length;
    if (invalidCount > 0) {
      alert(`Còn ${invalidCount} dòng lỗi. Vui lòng sửa hoặc xóa trước khi import.`);
      return;
    }

    const confirmMsg = cheDo === 'cap_nhat'
      ? 'Cập nhật các mục trùng tên và thêm mục mới?'
      : 'Chỉ thêm các mục mới (bỏ qua tên đã tồn tại)?';
    if (!confirm(confirmMsg)) return;

    setImporting(true);
    try {
      const file = buildTuThuocFileFromRows(rows, 'import-tu-thuoc.xlsx');
      const response = await tuThuocAPI.importFromExcel(buildFormData(file));
      alert(response.message || 'Import thành công');
      handleClose();
      onSuccess?.();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Import danh sách thuốc / vật tư</h2>
            <p className="text-sm text-gray-500 mt-1">Tải file mẫu, điền dữ liệu và import vào tủ thuốc</p>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  const blob = await tuThuocAPI.downloadImportTemplate();
                  downloadBlob(blob, 'mau-import-tu-thuoc.xlsx');
                } catch (error) {
                  alert('Lỗi: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-semibold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">download</span>
              Tải file mẫu
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  const blob = await tuThuocAPI.downloadPhanLoaiDanhMuc();
                  downloadBlob(blob, 'danh-muc-phan-loai-thuoc.xlsx');
                } catch (error) {
                  alert('Lỗi: ' + error.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">category</span>
              Tải danh mục phân loại
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ import</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="che_do"
                  checked={cheDo === 'bo_sung'}
                  onChange={() => setCheDo('bo_sung')}
                  className="mt-1"
                />
                <span>
                  <span className="text-sm font-medium text-gray-800">Bổ sung</span>
                  <span className="block text-xs text-gray-500">Chỉ thêm mục mới, bỏ qua tên đã tồn tại</span>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="che_do"
                  checked={cheDo === 'cap_nhat'}
                  onChange={() => setCheDo('cap_nhat')}
                  className="mt-1"
                />
                <span>
                  <span className="text-sm font-medium text-gray-800">Cập nhật</span>
                  <span className="block text-xs text-gray-500">Cập nhật mục trùng tên, thêm mục mới</span>
                </span>
              </label>
            </div>
          </div>

          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !loading && document.getElementById('tu-thuoc-import-file')?.click()}
            className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragging ? 'border-[#4A90E2] bg-blue-50' : 'border-gray-300 hover:border-[#4A90E2] hover:bg-gray-50'
            } ${loading ? 'pointer-events-none opacity-80' : ''}`}
          >
            <input
              id="tu-thuoc-import-file"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
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

          {preview && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-800">{preview.summary?.tong_muc ?? 0}</div>
                  <div className="text-xs text-gray-500">Tổng dòng</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-700">{preview.summary?.hop_le ?? 0}</div>
                  <div className="text-xs text-green-600">Hợp lệ</div>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-700">{preview.summary?.tong_loi ?? 0}</div>
                  <div className="text-xs text-red-600">Lỗi</div>
                </div>
              </div>

              {preview.errors?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                  <p className="text-sm font-semibold text-red-800 mb-2">Chi tiết lỗi:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    {preview.errors.map((err, i) => (
                      <li key={i}>Dòng {err.row}: {err.messages?.join('; ')}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rows.length > 0 && (
                <EditablePreviewTable
                  rows={rows}
                  onChange={(idx, key, value) => {
                    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value, valid: undefined } : row)));
                  }}
                  onDelete={(idx) => setRows((prev) => prev.filter((_, i) => i !== idx))}
                />
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleRevalidate}
                  disabled={loading || rows.length === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-semibold disabled:opacity-50"
                >
                  Kiểm tra lại
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={importing || loading || rows.length === 0}
                  className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] text-sm font-semibold disabled:opacity-50"
                >
                  {importing ? 'Đang import...' : 'Import vào tủ thuốc'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
