import { useState, useEffect } from 'react';
import { loaiPhongAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';

const AmenitySession2 = ({ onRoomClick }) => {
  const [loaiPhongs, setLoaiPhongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoaiPhongs();
  }, []);

  const loadLoaiPhongs = async () => {
    try {
      setLoading(true);
      const response = await loaiPhongAPI.getAll();
      if (response.success) {
        setLoaiPhongs(response.data || []);
      }
    } catch (error) {
      console.error('Error loading loai phong:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Phòng nghỉ
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            Phòng <span style={{ color: '#A90046' }}>Nội Trú</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Không gian sống được thiết kế tinh tế, ấm cúng như ở nhà 
            với đầy đủ tiện nghi cao cấp và an toàn tối đa.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: '#2D2D2D' }}>Đang tải...</p>
          </div>
        ) : loaiPhongs.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: '#2D2D2D' }}>Chưa có loại phòng nào</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12">
            {loaiPhongs.map((loaiPhong) => (
              <div
                key={loaiPhong.id}
                className="bg-white rounded-3xl overflow-hidden border border-accent-gold/20 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2.5 relative"
                style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
                onClick={() => onRoomClick && onRoomClick(loaiPhong)}
              >
                {/* Top border animation */}
                <div 
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                  style={{
                    background: 'linear-gradient(90deg, #C9A870, #A90046)'
                  }}
                ></div>

                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  {loaiPhong.anh_mau ? (
                    <img
                      src={normalizeImageUrl(loaiPhong.anh_mau)}
                      alt={loaiPhong.ten || `Loại phòng #${loaiPhong.id}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="font-serif text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {loaiPhong.ten || `Loại phòng #${loaiPhong.id}`}
                    </h3>
                    {loaiPhong.mo_ta && (
                      <p className="text-sm opacity-90 line-clamp-2">
                        {loaiPhong.mo_ta}
                      </p>
                    )}
                  </div>
                </div>

                {/* Content */}
                {loaiPhong.mo_ta && (
                  <div className="p-8">
                    <p className="text-lg mb-6 leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                      {loaiPhong.mo_ta}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AmenitySession2;
