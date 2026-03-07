import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suKienAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';

const Session5 = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Lấy tất cả sự kiện (sắp diễn ra, đang diễn ra, kết thúc)
      const response = await suKienAPI.getAll({ 
        limit: 6,
        // Có thể filter theo trang_thai nếu cần
      });
      
      if (response && response.success) {
        setEvents(response.data || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (trangThai) => {
    switch (trangThai) {
      case 'sap_dien_ra':
        return 'SỰ KIỆN';
      case 'dang_dien_ra':
        return 'ĐANG DIỄN RA';
      case 'ket_thuc':
        return 'ĐÃ KẾT THÚC';
      default:
        return 'SỰ KIỆN';
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/su-kien/${eventId}`);
  };

  return (
    <section id="news" className="py-16 sm:py-20 lg:py-24 xl:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div className="flex-1">
            <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
              Tin tức & Sự kiện
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
              Hoạt Động<br/>
              <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Nổi Bật</span>
            </h2>
          </div>
          <a href="#" className="hidden lg:inline-flex items-center font-semibold text-sm tracking-wide hover:gap-2 transition-all flex-shrink-0 ml-4" 
             style={{ color: '#C9A870' }}>
            XEM TẤT CẢ
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm sm:text-base" style={{ color: '#2D2D2D' }}>Đang tải sự kiện...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-sm sm:text-base" style={{ color: '#2D2D2D' }}>Chưa có sự kiện nào</div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Featured */}
            {events[0] && (
              <div 
                className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-accent-gold/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2.5 cursor-pointer"
                onClick={() => handleEventClick(events[0].id)}
                style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
              >
                <div className="relative">
                  {events[0].anh_dai_dien ? (
                    <img 
                      src={normalizeImageUrl(events[0].anh_dai_dien)} 
                      alt={events[0].tieu_de}
                      className="w-full h-64 sm:h-72 md:h-80 object-cover"
                    />
                  ) : events[0].media && events[0].media.length > 0 && events[0].media[0].loai === 'anh' ? (
                    <img 
                      src={normalizeImageUrl(events[0].media[0].url)} 
                      alt={events[0].tieu_de}
                      className="w-full h-64 sm:h-72 md:h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-72 md:h-80 bg-gray-200 flex items-center justify-center">
                      <span className="text-sm" style={{ color: '#2D2D2D' }}>Không có ảnh</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                    <span className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs tracking-wide uppercase bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
                      Sự kiện cao cấp
                    </span>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="text-xs sm:text-sm mb-2 sm:mb-3 tracking-wider" style={{ color: '#2D2D2D' }}>
                    {events[0].ngay ? formatDate(events[0].ngay) : 'SỰ KIỆN'}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                    {events[0].tieu_de}
                  </h3>
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                    {events[0].mo_ta || 'Không có mô tả'}
                  </p>
                  <a href="#" className="inline-flex items-center font-semibold text-xs sm:text-sm tracking-wide hover:gap-2 transition-all" 
                     style={{ color: '#C9A870' }}>
                    ĐỌC THÊM
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
            
            {/* List */}
            <div className="space-y-4 sm:space-y-6">
              {events.slice(1, 4).map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex gap-4 sm:gap-6 border border-accent-gold/20 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleEventClick(event.id)}
                  style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
                >
                  {event.anh_dai_dien ? (
                    <img 
                      src={normalizeImageUrl(event.anh_dai_dien)} 
                      alt={event.tieu_de}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl object-cover flex-shrink-0"
                    />
                  ) : event.media && event.media.length > 0 && event.media[0].loai === 'anh' ? (
                    <img 
                      src={normalizeImageUrl(event.media[0].url)} 
                      alt={event.tieu_de}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs" style={{ color: '#2D2D2D' }}>No img</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs mb-1 sm:mb-2 tracking-wider" style={{ color: '#C9A870' }}>
                      {getCategoryLabel(event.trang_thai)} • {event.ngay ? formatDate(event.ngay) : ''}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold mb-1 sm:mb-2 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                      {event.tieu_de}
                    </h3>
                    <p className="text-xs sm:text-sm line-clamp-2 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                      {event.mo_ta || 'Không có mô tả'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Session5;
