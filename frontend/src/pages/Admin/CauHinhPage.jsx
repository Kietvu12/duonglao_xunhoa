import { useEffect, useState } from 'react';
import { cauHinhChiSoCanhBaoAPI } from '../../services/api';

// Danh sách các chỉ số sinh tồn mặc định
const CHI_SO_DEFAULT = [
  { ten: 'SpO2', donVi: '%', loai: 'single' },
  { ten: 'Nhịp tim', donVi: 'bpm', loai: 'single' },
  { ten: 'Huyết áp', donVi: 'mmHg', loai: 'double' },
  { ten: 'Đường huyết', donVi: 'mg/dL', loai: 'single' },
  { ten: 'Nhiệt độ', donVi: '°C', loai: 'single' },
];

export default function CauHinhPage() {
  const [cauHinhs, setCauHinhs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    loadCauHinhs();
  }, []);

  const loadCauHinhs = async () => {
    try {
      setLoading(true);
      const response = await cauHinhChiSoCanhBaoAPI.getAll();
      const data = response.data || [];
      
      // Tạo map để dễ tìm kiếm
      const cauHinhMap = {};
      data.forEach(ch => {
        cauHinhMap[ch.ten_chi_so] = ch;
      });

      // Khởi tạo form data cho từng chỉ số
      const formDataMap = {};
      CHI_SO_DEFAULT.forEach(chiSo => {
        const existing = cauHinhMap[chiSo.ten];
        if (existing && existing.gioi_han_canh_bao) {
          try {
            const parsed = JSON.parse(existing.gioi_han_canh_bao);
            formDataMap[chiSo.ten] = {
              id: existing.id,
              ...parseJSONToForm(parsed, chiSo.loai),
            };
          } catch (e) {
            formDataMap[chiSo.ten] = getDefaultForm(chiSo.loai);
          }
        } else {
          formDataMap[chiSo.ten] = getDefaultForm(chiSo.loai);
        }
      });

      setCauHinhs(formDataMap);
    } catch (error) {
      console.error('Error loading cau hinhs:', error);
      alert('Lỗi khi tải danh sách cấu hình: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultForm = (loai) => {
    if (loai === 'double') {
      return {
        id: null,
        thap_tam_thu_min: '',
        thap_tam_thu_max: '',
        thap_tam_truong_min: '',
        thap_tam_truong_max: '',
        thap_message: '',
        binh_thuong_tam_thu_min: '',
        binh_thuong_tam_thu_max: '',
        binh_thuong_tam_truong_min: '',
        binh_thuong_tam_truong_max: '',
        binh_thuong_message: '',
        cao_tam_thu_min: '',
        cao_tam_thu_max: '',
        cao_tam_truong_min: '',
        cao_tam_truong_max: '',
        cao_message: '',
        nguy_hiem_message: '',
      };
    } else {
      return {
        id: null,
        thap_min: '',
        thap_max: '',
        thap_message: '',
        binh_thuong_min: '',
        binh_thuong_max: '',
        binh_thuong_message: '',
        cao_min: '',
        cao_max: '',
        cao_message: '',
        nguy_hiem_message: '',
      };
    }
  };

  const parseJSONToForm = (json, loai) => {
    if (loai === 'double') {
      return {
        thap_tam_thu_min: json.thap?.tam_thu_min || '',
        thap_tam_thu_max: json.thap?.tam_thu_max || '',
        thap_tam_truong_min: json.thap?.tam_truong_min || '',
        thap_tam_truong_max: json.thap?.tam_truong_max || '',
        thap_message: json.thap?.message || '',
        binh_thuong_tam_thu_min: json.binh_thuong?.tam_thu_min || '',
        binh_thuong_tam_thu_max: json.binh_thuong?.tam_thu_max || '',
        binh_thuong_tam_truong_min: json.binh_thuong?.tam_truong_min || '',
        binh_thuong_tam_truong_max: json.binh_thuong?.tam_truong_max || '',
        binh_thuong_message: json.binh_thuong?.message || '',
        cao_tam_thu_min: json.cao?.tam_thu_min || '',
        cao_tam_thu_max: json.cao?.tam_thu_max || '',
        cao_tam_truong_min: json.cao?.tam_truong_min || '',
        cao_tam_truong_max: json.cao?.tam_truong_max || '',
        cao_message: json.cao?.message || '',
        nguy_hiem_message: json.nguy_hiem?.message || '',
      };
    } else {
      return {
        thap_min: json.thap?.min || '',
        thap_max: json.thap?.max || '',
        thap_message: json.thap?.message || '',
        binh_thuong_min: json.binh_thuong?.min || '',
        binh_thuong_max: json.binh_thuong?.max || '',
        binh_thuong_message: json.binh_thuong?.message || '',
        cao_min: json.cao?.min || '',
        cao_max: json.cao?.max || '',
        cao_message: json.cao?.message || '',
        nguy_hiem_message: json.nguy_hiem?.message || '',
      };
    }
  };

  const formToJSON = (formData, loai) => {
    const json = {};
    
    if (loai === 'double') {
      // Thấp: khoảng [min, max] cho cả tâm thu và tâm trương
      if (formData.thap_tam_thu_min || formData.thap_tam_thu_max || 
          formData.thap_tam_truong_min || formData.thap_tam_truong_max || formData.thap_message) {
        json.thap = {};
        if (formData.thap_tam_thu_min) json.thap.tam_thu_min = parseFloat(formData.thap_tam_thu_min);
        if (formData.thap_tam_thu_max) json.thap.tam_thu_max = parseFloat(formData.thap_tam_thu_max);
        if (formData.thap_tam_truong_min) json.thap.tam_truong_min = parseFloat(formData.thap_tam_truong_min);
        if (formData.thap_tam_truong_max) json.thap.tam_truong_max = parseFloat(formData.thap_tam_truong_max);
        if (formData.thap_message) json.thap.message = formData.thap_message;
      }
      
      // Bình thường: khoảng [min, max] cho cả tâm thu và tâm trương
      if (formData.binh_thuong_tam_thu_min || formData.binh_thuong_tam_thu_max || 
          formData.binh_thuong_tam_truong_min || formData.binh_thuong_tam_truong_max || formData.binh_thuong_message) {
        json.binh_thuong = {};
        if (formData.binh_thuong_tam_thu_min) json.binh_thuong.tam_thu_min = parseFloat(formData.binh_thuong_tam_thu_min);
        if (formData.binh_thuong_tam_thu_max) json.binh_thuong.tam_thu_max = parseFloat(formData.binh_thuong_tam_thu_max);
        if (formData.binh_thuong_tam_truong_min) json.binh_thuong.tam_truong_min = parseFloat(formData.binh_thuong_tam_truong_min);
        if (formData.binh_thuong_tam_truong_max) json.binh_thuong.tam_truong_max = parseFloat(formData.binh_thuong_tam_truong_max);
        if (formData.binh_thuong_message) json.binh_thuong.message = formData.binh_thuong_message;
      }
      
      // Cao: khoảng [min, max] cho cả tâm thu và tâm trương
      if (formData.cao_tam_thu_min || formData.cao_tam_thu_max || 
          formData.cao_tam_truong_min || formData.cao_tam_truong_max || formData.cao_message) {
        json.cao = {};
        if (formData.cao_tam_thu_min) json.cao.tam_thu_min = parseFloat(formData.cao_tam_thu_min);
        if (formData.cao_tam_thu_max) json.cao.tam_thu_max = parseFloat(formData.cao_tam_thu_max);
        if (formData.cao_tam_truong_min) json.cao.tam_truong_min = parseFloat(formData.cao_tam_truong_min);
        if (formData.cao_tam_truong_max) json.cao.tam_truong_max = parseFloat(formData.cao_tam_truong_max);
        if (formData.cao_message) json.cao.message = formData.cao_message;
      }
      
      // Nguy hiểm: chỉ có message (tự động tính từ ngoài khoảng thấp/cao)
      if (formData.nguy_hiem_message) {
        json.nguy_hiem = {};
        json.nguy_hiem.message = formData.nguy_hiem_message;
      }
    } else {
      // Thấp: khoảng [min, max]
      if (formData.thap_min || formData.thap_max || formData.thap_message) {
        json.thap = {};
        if (formData.thap_min) json.thap.min = parseFloat(formData.thap_min);
        if (formData.thap_max) json.thap.max = parseFloat(formData.thap_max);
        if (formData.thap_message) json.thap.message = formData.thap_message;
      }
      
      // Bình thường: khoảng [min, max]
      if (formData.binh_thuong_min || formData.binh_thuong_max || formData.binh_thuong_message) {
        json.binh_thuong = {};
        if (formData.binh_thuong_min) json.binh_thuong.min = parseFloat(formData.binh_thuong_min);
        if (formData.binh_thuong_max) json.binh_thuong.max = parseFloat(formData.binh_thuong_max);
        if (formData.binh_thuong_message) json.binh_thuong.message = formData.binh_thuong_message;
      }
      
      // Cao: khoảng [min, max]
      if (formData.cao_min || formData.cao_max || formData.cao_message) {
        json.cao = {};
        if (formData.cao_min) json.cao.min = parseFloat(formData.cao_min);
        if (formData.cao_max) json.cao.max = parseFloat(formData.cao_max);
        if (formData.cao_message) json.cao.message = formData.cao_message;
      }
      
      // Nguy hiểm: chỉ có message (tự động tính từ ngoài khoảng thấp/cao)
      if (formData.nguy_hiem_message) {
        json.nguy_hiem = {};
        json.nguy_hiem.message = formData.nguy_hiem_message;
      }
    }
    
    return json;
  };

  const handleSave = async (tenChiSo, loai) => {
    try {
      setSaving(prev => ({ ...prev, [tenChiSo]: true }));
      
      const formData = cauHinhs[tenChiSo];
      const json = formToJSON(formData, loai);
      
      const submitData = {
        ten_chi_so: tenChiSo,
        gioi_han_canh_bao: JSON.stringify(json),
      };

      if (formData.id) {
        await cauHinhChiSoCanhBaoAPI.update(formData.id, submitData);
        alert('Cập nhật cấu hình thành công');
      } else {
        const response = await cauHinhChiSoCanhBaoAPI.create(submitData);
        // Cập nhật ID sau khi tạo
        setCauHinhs(prev => ({
          ...prev,
          [tenChiSo]: { ...prev[tenChiSo], id: response.data?.id }
        }));
        alert('Thêm cấu hình thành công');
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSaving(prev => ({ ...prev, [tenChiSo]: false }));
    }
  };

  const handleChange = (tenChiSo, field, value) => {
    setCauHinhs(prev => ({
      ...prev,
      [tenChiSo]: {
        ...prev[tenChiSo],
        [field]: value,
      },
    }));
  };

  const renderFormSingle = (tenChiSo, donVi, formData) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Thấp */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Thấp</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.thap_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.thap_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
            <input
              type="text"
              value={formData.thap_message || ''}
              onChange={(e) => handleChange(tenChiSo, 'thap_message', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              placeholder="Thông báo"
            />
          </div>
        </div>
      </div>

      {/* Bình thường */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Bình thường</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.binh_thuong_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.binh_thuong_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
            <input
              type="text"
              value={formData.binh_thuong_message || ''}
              onChange={(e) => handleChange(tenChiSo, 'binh_thuong_message', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              placeholder="Thông báo"
            />
          </div>
        </div>
      </div>

      {/* Cao */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Cao</h4>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Min ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.cao_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Max ({donVi})</label>
              <input
                type="number"
                step="0.01"
                value={formData.cao_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
            <input
              type="text"
              value={formData.cao_message || ''}
              onChange={(e) => handleChange(tenChiSo, 'cao_message', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              placeholder="Thông báo"
            />
          </div>
        </div>
      </div>

      {/* Nguy hiểm */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Nguy hiểm</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
            <input
              type="text"
              value={formData.nguy_hiem_message || ''}
              onChange={(e) => handleChange(tenChiSo, 'nguy_hiem_message', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              placeholder="Thông báo (tự động: ngoài khoảng Thấp/Cao)"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tự động: &lt; Min(Thấp) hoặc &gt; Max(Cao)
          </p>
        </div>
      </div>
    </div>
  );

  const renderFormDouble = (tenChiSo, donVi, formData) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thấp */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Thấp</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Min ({donVi})</label>
              <input
                type="number"
                value={formData.thap_tam_thu_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_tam_thu_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Max ({donVi})</label>
              <input
                type="number"
                value={formData.thap_tam_thu_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_tam_thu_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Min ({donVi})</label>
              <input
                type="number"
                value={formData.thap_tam_truong_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_tam_truong_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Max ({donVi})</label>
              <input
                type="number"
                value={formData.thap_tam_truong_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_tam_truong_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
              <input
                type="text"
                value={formData.thap_message || ''}
                onChange={(e) => handleChange(tenChiSo, 'thap_message', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Thông báo khi huyết áp thấp"
              />
            </div>
          </div>
        </div>

        {/* Bình thường */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Bình thường</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Min ({donVi})</label>
              <input
                type="number"
                value={formData.binh_thuong_tam_thu_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_tam_thu_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Max ({donVi})</label>
              <input
                type="number"
                value={formData.binh_thuong_tam_thu_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_tam_thu_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Min ({donVi})</label>
              <input
                type="number"
                value={formData.binh_thuong_tam_truong_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_tam_truong_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Max ({donVi})</label>
              <input
                type="number"
                value={formData.binh_thuong_tam_truong_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_tam_truong_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
              <input
                type="text"
                value={formData.binh_thuong_message || ''}
                onChange={(e) => handleChange(tenChiSo, 'binh_thuong_message', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Thông báo khi huyết áp bình thường"
              />
            </div>
          </div>
        </div>

        {/* Cao */}
        <div className="border border-gray-200 rounded-lg p-3">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">Cao</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Min ({donVi})</label>
              <input
                type="number"
                value={formData.cao_tam_thu_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_tam_thu_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm thu Max ({donVi})</label>
              <input
                type="number"
                value={formData.cao_tam_thu_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_tam_thu_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Min ({donVi})</label>
              <input
                type="number"
                value={formData.cao_tam_truong_min || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_tam_truong_min', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tâm trương Max ({donVi})</label>
              <input
                type="number"
                value={formData.cao_tam_truong_max || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_tam_truong_max', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
              <input
                type="text"
                value={formData.cao_message || ''}
                onChange={(e) => handleChange(tenChiSo, 'cao_message', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Thông báo khi huyết áp cao"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nguy hiểm */}
      <div className="border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2 text-sm">Nguy hiểm</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Thông báo</label>
            <input
              type="text"
              value={formData.nguy_hiem_message || ''}
              onChange={(e) => handleChange(tenChiSo, 'nguy_hiem_message', e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
              placeholder="Thông báo (tự động: ngoài khoảng Thấp/Cao)"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tự động: &lt; Min(Thấp) hoặc &gt; Max(Cao) cho cả tâm thu và tâm trương
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 font-raleway p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Cấu hình Chỉ số Cảnh báo</h1>
          <p className="text-gray-600 mt-2">Thiết lập các mốc cảnh báo cho từng chỉ số sinh tồn</p>
        </div>
      </div>

      {/* Chi số list */}
      {loading ? (
        <div className="p-16 text-center text-gray-500">
          <div className="inline-block">Đang tải...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {CHI_SO_DEFAULT.map((chiSo) => {
            const formData = cauHinhs[chiSo.ten] || getDefaultForm(chiSo.loai);
            return (
              <div key={chiSo.ten} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold text-base">
                        {chiSo.ten.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{chiSo.ten}</h3>
                        <p className="text-xs text-gray-600">Đơn vị: {chiSo.donVi}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSave(chiSo.ten, chiSo.loai)}
                      disabled={saving[chiSo.ten]}
                      className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        {saving[chiSo.ten] ? 'hourglass_empty' : 'save'}
                      </span>
                      <span>{saving[chiSo.ten] ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {chiSo.loai === 'double' 
                    ? renderFormDouble(chiSo.ten, chiSo.donVi, formData)
                    : renderFormSingle(chiSo.ten, chiSo.donVi, formData)
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
