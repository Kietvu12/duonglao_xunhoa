import { useState, useEffect, useMemo } from 'react';
import { dichVuAPI, loaiDichVuAPI } from '../services/api';
import { serviceImages } from '../assets/serviceImages';
import { normalizeImageUrl } from '../utils/imageUtils';

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

const ServiceSession2 = ({ selectedCategory, onCategorySelect, onCategoryBack, onServiceClick }) => {
  const [loaiDichVus, setLoaiDichVus] = useState([]);
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loaiRes, dichVuRes] = await Promise.all([
        loaiDichVuAPI.getAll(),
        dichVuAPI.getAll({ limit: -1 }),
      ]);
      setLoaiDichVus(loaiRes.data || []);
      setDichVus(dichVuRes.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedByCategory = useMemo(() => {
    const map = new Map();
    dichVus.forEach((dv) => {
      const key = dv.id_loai_dich_vu ?? 'uncategorized';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(dv);
    });
    return map;
  }, [dichVus]);

  const categoriesWithServices = useMemo(() => {
    const fromLoai = loaiDichVus
      .map((loai) => ({
        ...loai,
        dichVus: groupedByCategory.get(loai.id) || [],
      }))
      .filter((loai) => loai.dichVus.length > 0);

    const uncategorized = groupedByCategory.get('uncategorized') || [];
    if (uncategorized.length > 0) {
      fromLoai.push({
        id: 'uncategorized',
        ten: 'Dịch vụ khác',
        mo_ta: 'Các dịch vụ chăm sóc và hỗ trợ khác tại viện.',
        dichVus: uncategorized,
      });
    }

    return fromLoai;
  }, [loaiDichVus, groupedByCategory]);

  const servicesInCategory = useMemo(() => {
    if (!selectedCategory) return [];
    if (selectedCategory.id === 'uncategorized') {
      return groupedByCategory.get('uncategorized') || [];
    }
    return groupedByCategory.get(selectedCategory.id) || [];
  }, [selectedCategory, groupedByCategory]);

  const handleServiceSelect = (dichVu) => {
    onServiceClick?.({
      ...dichVu,
      loai_dich_vu: selectedCategory
        ? { id: selectedCategory.id, ten: selectedCategory.ten }
        : dichVu.ten_loai_dich_vu
          ? { ten: dichVu.ten_loai_dich_vu }
          : null,
      dichVusOfType: servicesInCategory,
    });
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

  if (categoriesWithServices.length === 0) {
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

  const renderHeader = (title, subtitle) => (
    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 lg:mb-16">
      <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
        Dịch vụ
      </span>
      <h2
        className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-relaxed"
        style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.35' }}
      >
        {title}
        {subtitle && (
          <span style={{ color: '#A90046', display: 'block', marginTop: '0.2rem' }}>
            {subtitle}
          </span>
        )}
      </h2>
      <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-5" />
    </div>
  );

  if (selectedCategory) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 xl:py-28" style={{ background: '#F9F6F1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <button
            type="button"
            onClick={onCategoryBack}
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold tracking-wide transition-colors hover:opacity-80"
            style={{ color: '#C9A870' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh mục
          </button>

          {renderHeader(selectedCategory.ten, `${servicesInCategory.length} dịch vụ`)}

          {selectedCategory.mo_ta && (
            <p
              className="text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto mb-10 sm:mb-12"
              style={{ color: '#6B6B6B' }}
            >
              {selectedCategory.mo_ta}
            </p>
          )}

          <div className="space-y-4 sm:space-y-5 max-w-4xl mx-auto">
            {servicesInCategory.map((dichVu, index) => {
              const price = getStartingPrice(dichVu);
              const image = serviceImages[index % serviceImages.length];

              return (
                <button
                  key={dichVu.id}
                  type="button"
                  onClick={() => handleServiceSelect(dichVu)}
                  className="group w-full text-left flex gap-4 sm:gap-6 bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ borderColor: 'rgba(201, 168, 112, 0.25)' }}
                >
                  <div className="relative w-28 sm:w-40 md:w-48 flex-shrink-0 self-stretch min-h-[7.5rem]">
                    <img
                      src={normalizeImageUrl(dichVu.anh_dai_dien) || image}
                      alt={dichVu.ten_dich_vu}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = image;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0 py-4 pr-4 sm:py-5 sm:pr-6 flex flex-col justify-center gap-2">
                    <h3
                      className="font-serif text-lg sm:text-xl md:text-2xl font-bold leading-snug"
                      style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
                    >
                      {dichVu.ten_dich_vu}
                    </h3>

                    {dichVu.mo_ta_ngan && (
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#6B6B6B' }}>
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
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        {renderHeader('Danh mục dịch vụ', 'chăm sóc toàn diện')}
        <p
          className="text-sm sm:text-base leading-relaxed text-center max-w-3xl mx-auto mb-10 sm:mb-14"
          style={{ color: '#2D2D2D' }}
        >
          Chọn loại dịch vụ phù hợp để xem các gói chăm sóc và bảng giá chi tiết.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categoriesWithServices.map((loai, index) => {
            const image = serviceImages[index % serviceImages.length];

            return (
              <button
                key={loai.id}
                type="button"
                onClick={() => onCategorySelect?.(loai)}
                className="group text-left bg-white rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
              >
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={image}
                    alt={loai.ten}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-wide uppercase bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
                      {loai.dichVus.length} dịch vụ
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3
                    className="font-serif text-xl sm:text-2xl font-bold mb-3 leading-snug"
                    style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
                  >
                    {loai.ten}
                  </h3>
                  {loai.mo_ta && (
                    <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: '#6B6B6B' }}>
                      {loai.mo_ta}
                    </p>
                  )}
                  <span
                    className="inline-flex items-center text-xs sm:text-sm font-semibold tracking-wide group-hover:gap-2 transition-all"
                    style={{ color: '#C9A870' }}
                  >
                    Xem dịch vụ
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
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
