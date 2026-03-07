import { useState, useEffect } from 'react';
import { publicHealthAlertsAPI } from '../services/api';
import AnimatedSection from './AnimatedSection';

export default function HealthAlertsCard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAlerts();
    
    // Reload mỗi 30 giây để cập nhật real-time
    const interval = setInterval(() => {
      loadAlerts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicHealthAlertsAPI.getAll({ limit: 6 });
      if (response.success && response.data) {
        setAlerts(response.data);
      }
    } catch (err) {
      console.error('Error loading health alerts:', err);
      setError('Không thể tải dữ liệu cảnh báo');
    } finally {
      setLoading(false);
    }
  };

  const getMucDoColor = (mucDo) => {
    if (mucDo === 'nguy_hiem') {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    return 'bg-yellow-100 border-yellow-300 text-yellow-800';
  };

  const getMucDoLabel = (mucDo) => {
    if (mucDo === 'nguy_hiem') {
      return 'Nguy hiểm';
    }
    return 'Cảnh báo';
  };

  const getChiSoIcon = (loaiChiSo) => {
    const iconMap = {
      'huyet_ap': 'favorite',
      'nhip_tim': 'favorite',
      'duong_huyet': 'bloodtype',
      'spo2': 'air',
      'nhiet_do': 'device_thermostat'
    };
    return iconMap[loaiChiSo] || 'warning';
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && alerts.length === 0) {
    return (
      <AnimatedSection delay={0}>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Đang tải dữ liệu cảnh báo...</div>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  if (error && alerts.length === 0) {
    return null; // Ẩn card nếu có lỗi và không có dữ liệu
  }

  if (alerts.length === 0) {
    return null; // Ẩn card nếu không có cảnh báo
  }

  return (
    <AnimatedSection delay={0}>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
              warning
            </span>
            Cảnh báo chỉ số sức khỏe
          </h2>
          {loading && (
            <span className="material-symbols-outlined animate-spin text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
              sync
            </span>
          )}
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={`${alert.loai_chi_so}-${alert.id}`}
              className={`p-4 rounded-lg border-2 ${getMucDoColor(alert.muc_do)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  alert.muc_do === 'nguy_hiem' ? 'bg-red-500' : 'bg-yellow-500'
                } text-white`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                    {getChiSoIcon(alert.loai_chi_so)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">
                        {alert.ten_benh_nhan}
                      </h3>
                      <p className="text-sm text-gray-700 mt-0.5">
                        {alert.ten_chi_so}: <span className="font-semibold">{alert.gia_tri}</span>
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.muc_do === 'nguy_hiem' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-yellow-600 text-white'
                    }`}>
                      {getMucDoLabel(alert.muc_do)}
                    </span>
                  </div>
                  {alert.noi_dung_canh_bao && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {alert.noi_dung_canh_bao}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                      schedule
                    </span>
                    {formatTime(alert.thoi_gian || alert.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {alerts.length >= 6 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Hiển thị 6 cảnh báo mới nhất
            </p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

