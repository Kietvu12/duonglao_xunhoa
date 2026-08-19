import { useState, useEffect } from 'react';
import { dichVuAPI } from '../services/api';
import { serviceImages } from '../assets/serviceImages';

const formatPrice = (price) => {
  if (!price) return null;
  return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
};

const getStartingPrice = (dv) => {
  if (dv.gia_ngay) return { label: 'Ngày', value: formatPrice(dv.gia_ngay) };
  if (dv.gia_thang) return { label: 'Tháng', value: formatPrice(dv.gia_thang) };
  if (dv.gia_quy) return { label: 'Quý', value: formatPrice(dv.gia_quy) };
  if (dv.gia_nam) return { label: 'Năm', value: formatPrice(dv.gia_nam) };
  return null;
};

const ServiceSession2 = ({ onServiceClick }) => {
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const dichVuRes = await dichVuAPI.getAll({ limit: -1 });
      setDichVus(dichVuRes.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24" style={{ background: '#F9F6F1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center text-sm sm:text-base" style={{ color: '#2D2D2D' }}>
            Đang tải dịch vụ...
          </div>
        </div>
      </section>
    );
  }

  if (dichVus.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-24" style={{ background: '#F9F6F1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center text-sm sm:text-base" style={{ color: '#2D2D2D' }}>
            Chưa có dịch vụ nào.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Dịch vụ
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-relaxed"
            style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.35' }}
          >
            Danh sách dịch vụ
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.2rem' }}>
              chăm sóc toàn diện
            </span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-5" />
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#2D2D2D' }}>
            Chọn dịch vụ phù hợp để xem bảng giá và thông tin chi tiết.
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
          {dichVus.map((dichVu, index) => {
            const price = getStartingPrice(dichVu);
            const image = serviceImages[index % serviceImages.length];

            return (
              <button
                key={dichVu.id}
                type="button"
                onClick={() =>
                  onServiceClick?.({
                    ...dichVu,
                    loai_dich_vu: dichVu.ten_loai_dich_vu
                      ? { ten: dichVu.ten_loai_dich_vu }
                      : null,
                    dichVusOfType: dichVus,
                  })
                }
                className="group w-full text-left flex gap-4 sm:gap-6 bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ borderColor: 'rgba(201, 168, 112, 0.25)' }}
              >
                <div className="relative w-28 sm:w-40 md:w-48 flex-shrink-0 self-stretch min-h-[7.5rem]">
                  <img
                    src={image}
                    alt={dichVu.ten_dich_vu}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 min-w-0 py-4 pr-4 sm:py-5 sm:pr-6 flex flex-col justify-center gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {dichVu.ten_loai_dich_vu && (
                      <span
                        className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                        style={{ background: '#F9F6F1', color: '#8B0A3D' }}
                      >
                        {dichVu.ten_loai_dich_vu}
                      </span>
                    )}
                  </div>

                  <h3
                    className="font-serif text-lg sm:text-xl md:text-2xl font-bold leading-snug"
                    style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
                  >
                    {dichVu.ten_dich_vu}
                  </h3>

                  {dichVu.mo_ta_ngan && (
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: '#6B6B6B' }}
                    >
                      {dichVu.mo_ta_ngan}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {price ? (
                      <p className="text-sm">
                        <span style={{ color: '#8A8A8A' }}>Từ </span>
                        <span className="font-bold" style={{ color: '#A90046' }}>
                          {price.value}
                        </span>
                        <span style={{ color: '#8A8A8A' }}> / {price.label.toLowerCase()}</span>
                      </p>
                    ) : (
                      <p className="text-sm" style={{ color: '#8A8A8A' }}>
                        Liên hệ báo giá
                      </p>
                    )}
                    <span
                      className="text-xs sm:text-sm font-semibold tracking-wide group-hover:translate-x-0.5 transition-transform"
                      style={{ color: '#C9A870' }}
                    >
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession2;
