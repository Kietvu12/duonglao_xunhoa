import { useState, useEffect } from 'react';
import { loaiDichVuAPI, dichVuAPI } from '../services/api';
import serviceImage from '../assets/ServiceSession1.png';

const ServiceSession2 = ({ onServiceClick }) => {
  const [loaiDichVus, setLoaiDichVus] = useState([]);
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loaiDichVuRes, dichVuRes] = await Promise.all([
        loaiDichVuAPI.getAll(),
        dichVuAPI.getAll({ limit: -1 })
      ]);
      
      setLoaiDichVus(loaiDichVuRes.data || []);
      setDichVus(dichVuRes.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDichVusByLoai = (idLoaiDichVu) => {
    return dichVus.filter(dv => dv.id_loai_dich_vu === idLoaiDichVu);
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 xl:py-32" style={{ background: '#F9F6F1' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center text-sm sm:text-base" style={{ color: '#2D2D2D' }}>Đang tải dịch vụ...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="space-y-16 sm:space-y-24 lg:space-y-32">
          {loaiDichVus.map((loaiDichVu, index) => {
            const dichVusOfType = getDichVusByLoai(loaiDichVu.id);
            
            if (dichVusOfType.length === 0) return null;

            const isEven = index % 2 === 0;

            return (
              <div key={loaiDichVu.id} className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
                {/* Image - Alternate left/right */}
                <div className={isEven ? "order-2 lg:order-1" : "order-2"}>
                  <div className="relative">
                    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                      <img 
                        src={serviceImage} 
                        alt={loaiDichVu.ten}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -inset-2 sm:-inset-4 border-2 rounded-2xl sm:rounded-3xl -z-10"
                         style={{ borderColor: '#E8D7B7' }}></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className={`space-y-4 sm:space-y-6 ${isEven ? "order-1 lg:order-2" : "order-1"}`}>
                  <h2 className="font-serif font-bold leading-tight" style={{ 
                    color: '#2D2D2D',
                    fontSize: 'clamp(1.75rem, 4vw, 3.125rem)',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {loaiDichVu.ten}
                  </h2>
                  <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent"></div>
                  {loaiDichVu.mo_ta && (
                    <p className="leading-relaxed font-medium text-sm sm:text-base lg:text-lg text-justify" style={{ 
                      color: '#2D2D2D',
                      textAlign: 'justify'
                    }}>
                      {loaiDichVu.mo_ta}
                    </p>
                  )}
                  
                  <div className="space-y-2 pt-3 sm:pt-4">
                    <h3 className="font-serif font-bold mb-3 sm:mb-4 leading-tight" style={{ 
                      color: '#2D2D2D',
                      fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Hạng mục cung cấp
                    </h3>
                    <div className="space-y-2">
                      {dichVusOfType.map((dichVu) => (
                        <div 
                          key={dichVu.id}
                          className="flex items-start gap-2 sm:gap-3 py-2 sm:py-3 border-b border-accent-gold/15 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onServiceClick && onServiceClick({ ...dichVu, loai_dich_vu: loaiDichVu, dichVusOfType })}
                        >
                          <span className="leading-relaxed font-medium min-w-0" style={{ 
                            color: '#2D2D2D',
                            fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'
                          }}>
                            {dichVu.ten_dich_vu}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Day Care & Residential Care Cards */}
          {loaiDichVus.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mt-12 sm:mt-16">
              {/* Day Care Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5"
                   style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
                <div 
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, #C9A870, #A90046)'
                  }}
                ></div>
                
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6"
                     style={{ background: 'linear-gradient(135deg, #E8D7B7 0%, #C9A870 100%)' }}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="font-serif font-bold mb-3 sm:mb-4 leading-tight" style={{ 
                  color: '#2D2D2D',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Chăm Sóc Ban Ngày
                </h2>
                <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mb-4 sm:mb-6"></div>
                <p className="mb-4 sm:mb-6 leading-relaxed font-medium text-sm sm:text-base lg:text-lg text-justify" style={{ 
                  color: '#2D2D2D',
                  textAlign: 'justify'
                }}>
                  Dịch vụ phù hợp với những gia đình mong muốn người cao tuổi được chăm sóc chuyên nghiệp 
                  trong giờ hành chính nhưng vẫn sinh hoạt tại nhà vào buổi tối.
                </p>
                
                <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-semibold text-white w-full transition-all duration-400"
                        style={{
                          background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 10, 61, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                >
                  Tìm hiểu thêm
                </button>
              </div>
              
              {/* Residential Care Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5"
                   style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
                <div 
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{
                    background: 'linear-gradient(90deg, #C9A870, #A90046)'
                  }}
                ></div>
                
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6"
                     style={{ background: 'linear-gradient(135deg, #E8D7B7 0%, #C9A870 100%)' }}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="font-serif font-bold mb-3 sm:mb-4 leading-tight" style={{ 
                  color: '#2D2D2D',
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  Chăm Sóc Nội Trú
                </h2>
                <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mb-4 sm:mb-6"></div>
                <p className="mb-4 sm:mb-6 leading-relaxed font-medium text-sm sm:text-base lg:text-lg text-justify" style={{ 
                  color: '#2D2D2D',
                  textAlign: 'justify'
                }}>
                  Không gian sống ổn định và an toàn với sự hỗ trợ 24/7 từ đội ngũ chuyên nghiệp. 
                  Chăm sóc toàn diện từ sinh hoạt cá nhân đến quản lý sức khỏe lâu dài.
                </p>
                
                <button className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs font-semibold text-white w-full transition-all duration-400"
                        style={{
                          background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontFamily: "'Playfair Display', serif"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 10, 61, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession2;
