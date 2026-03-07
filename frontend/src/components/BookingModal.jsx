import { useState, useEffect } from 'react';
import { lichHenTuVanAPI } from '../services/api';

const BookingModal = ({ isOpen, onClose, serviceName }) => {
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    loai_dich_vu_quan_tam: serviceName || '',
    ngay_mong_muon: '',
    gio_mong_muon: '',
    ghi_chu: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Set default date to tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Set default time to 9:00 AM
  const getDefaultTime = () => {
    return '09:00';
  };

  // Set default values when modal opens
  useEffect(() => {
    if (isOpen && !formData.ngay_mong_muon) {
      setFormData(prev => ({
        ...prev,
        ngay_mong_muon: getTomorrowDate(),
        gio_mong_muon: getDefaultTime(),
        loai_dich_vu_quan_tam: serviceName || prev.loai_dich_vu_quan_tam
      }));
    }
  }, [isOpen, serviceName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.ho_ten || !formData.so_dien_thoai || !formData.email || !formData.ngay_mong_muon || !formData.gio_mong_muon) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Email không hợp lệ');
        setLoading(false);
        return;
      }

      // Validate phone (Vietnamese format)
      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
      const cleanPhone = formData.so_dien_thoai.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        setError('Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)');
        setLoading(false);
        return;
      }

      // Validate date is not in the past
      const appointmentDateTime = new Date(`${formData.ngay_mong_muon}T${formData.gio_mong_muon}`);
      const now = new Date();
      if (appointmentDateTime < now) {
        setError('Ngày và giờ hẹn không được ở quá khứ');
        setLoading(false);
        return;
      }

      const response = await lichHenTuVanAPI.create({
        ...formData,
        so_dien_thoai: cleanPhone
      });

      if (response.success) {
        setSuccess(true);
        // Reset form
        setFormData({
          ho_ten: '',
          so_dien_thoai: '',
          email: '',
          loai_dich_vu_quan_tam: serviceName || '',
          ngay_mong_muon: '',
          gio_mong_muon: '',
          ghi_chu: ''
        });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-raleway-bold text-gray-800">
            Đặt lịch hẹn tư vấn
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-raleway-bold text-gray-800 mb-2">
                Đặt lịch thành công!
              </h3>
              <p className="text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Name (pre-filled, read-only) */}
              {serviceName && (
                <div>
                  <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                    Dịch vụ quan tâm
                  </label>
                  <input
                    type="text"
                    value={formData.loai_dich_vu_quan_tam}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Họ tên */}
              <div>
                <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ho_ten"
                  value={formData.ho_ten}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="so_dien_thoai"
                  value={formData.so_dien_thoai}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0912345678 hoặc +84912345678"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              {/* Ngày và giờ mong muốn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                    Ngày mong muốn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="ngay_mong_muon"
                    value={formData.ngay_mong_muon}
                    onChange={handleChange}
                    min={getTomorrowDate()}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                    Giờ mong muốn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="gio_mong_muon"
                    value={formData.gio_mong_muon}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-raleway-semibold text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  name="ghi_chu"
                  value={formData.ghi_chu}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Nhập thông tin bổ sung (nếu có)..."
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-raleway-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white font-raleway-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang xử lý...' : 'Đặt lịch'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

