import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { suKienAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import SeoHead from '../components/SeoHead';
import { homeImages } from '../assets/homeImages';

const EVENT_FALLBACK = homeImages.eventFallback;

const getEventImage = (event) => {
  if (event?.anh_dai_dien) {
    const url = normalizeImageUrl(event.anh_dai_dien);
    if (url) return url;
  }
  if (event?.media?.length > 0 && event.media[0].loai === 'anh') {
    const url = normalizeImageUrl(event.media[0].url);
    if (url) return url;
  }
  return EVENT_FALLBACK;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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

export default function SuKienListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await suKienAPI.getAll({ limit: -1 });
      if (response?.success) {
        setEvents(response.data || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-16" style={{ background: '#F9F6F1' }}>
      <SeoHead
        title="Tin tức & Sự kiện"
        description="Các hoạt động, sự kiện nổi bật tại Trung tâm trường thọ Xuân Hoa."
        canonicalPath="/su-kien"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="mb-10 sm:mb-12">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Tin tức & Sự kiện
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-relaxed"
            style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
          >
            Hoạt động nổi bật
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">Đang tải sự kiện...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-gray-600">Chưa có sự kiện nào</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-accent-gold/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                onClick={() => navigate(`/su-kien/${event.id}`)}
                style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getEventImage(event)}
                    alt={event.tieu_de}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = EVENT_FALLBACK;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs uppercase bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
                      {getStatusLabel(event.trang_thai)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs mb-2 tracking-wider text-gray-500">
                    {event.ngay ? formatDate(event.ngay) : 'Sự kiện'}
                  </div>
                  <h2
                    className="font-serif text-xl font-semibold mb-3 leading-tight line-clamp-2"
                    style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
                  >
                    {event.tieu_de}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 text-justify">
                    {event.mo_ta || 'Không có mô tả'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
