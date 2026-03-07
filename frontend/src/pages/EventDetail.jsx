import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { suKienAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await suKienAPI.getById(id);
      
      if (response && response.success) {
        setEvent(response.data);
      } else {
        setError('Không tìm thấy sự kiện');
      }
    } catch (err) {
      console.error('Error loading event:', err);
      setError('Lỗi khi tải thông tin sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusLabel = (trangThai) => {
    switch (trangThai) {
      case 'sap_dien_ra':
        return 'Sắp diễn ra';
      case 'dang_dien_ra':
        return 'Đang diễn ra';
      case 'ket_thuc':
        return 'Đã kết thúc';
      default:
        return 'Sự kiện';
    }
  };

  const getStatusColor = (trangThai) => {
    switch (trangThai) {
      case 'sap_dien_ra':
        return 'bg-blue-100 text-blue-800';
      case 'dang_dien_ra':
        return 'bg-green-100 text-green-800';
      case 'ket_thuc':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy sự kiện'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <span 
              className="hover:text-primary cursor-pointer" 
              onClick={() => navigate('/')}
            >
              Trang chủ
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Sự kiện</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{event.tieu_de}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-raleway-semibold ${getStatusColor(event.trang_thai)}`}>
                  {getStatusLabel(event.trang_thai)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight mb-4">
                {event.tieu_de}
              </h1>
            </div>

            {/* Main Image */}
            {event.anh_dai_dien && (
              <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
                <img
                  src={normalizeImageUrl(event.anh_dai_dien)}
                  alt={event.tieu_de}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Video */}
            {event.video && (
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={event.video}
                  title={event.tieu_de}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Description */}
            {event.mo_ta && (
              <div className="prose max-w-none">
                <div 
                  className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed whitespace-pre-wrap"
                >
                  {event.mo_ta}
                </div>
              </div>
            )}

            {/* Media Gallery */}
            {event.media && event.media.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-raleway-bold text-gray-800 mb-6">
                  Hình ảnh sự kiện
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.media
                    .filter(m => m.loai === 'anh')
                    .map((media, index) => (
                      <div key={media.id} className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={normalizeImageUrl(media.url)}
                          alt={`${event.tieu_de} - ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#FFF9FB] rounded-lg p-6 space-y-6 sticky top-8">
              {/* Event Info */}
              <div className="space-y-4">
                <h3 className="text-xl font-raleway-bold text-gray-800">Thông tin sự kiện</h3>
                
                {/* Date */}
                {event.ngay && (
                  <div>
                    <div className="text-sm font-raleway-semibold text-gray-700 mb-1">
                      Ngày diễn ra
                    </div>
                    <div className="text-base font-raleway-regular text-gray-600">
                      {formatDate(event.ngay)}
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.dia_diem && (
                  <div>
                    <div className="text-sm font-raleway-semibold text-gray-700 mb-1">
                      Địa điểm
                    </div>
                    <div className="text-base font-raleway-regular text-gray-600">
                      {event.dia_diem}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <div className="text-sm font-raleway-semibold text-gray-700 mb-1">
                    Trạng thái
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-raleway-semibold ${getStatusColor(event.trang_thai)}`}>
                      {getStatusLabel(event.trang_thai)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 bg-gray-900 text-white font-raleway-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetail;

