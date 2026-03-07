import bgSession6 from '../assets/bg_session6.png';
import session6Img from '../assets/session6_img.png';

const Session6 = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}></div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full"
             style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 rounded-full"
             style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }}></div>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-16 text-center">
        <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 sm:mb-8 bg-white/20 text-white font-semibold">
          Đặt lịch tư vấn
        </span>
        
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
          Trải Nghiệm Đẳng Cấp<br/>
          <span className="text-accent-gold" style={{ display: 'block', marginTop: '0.25rem' }}>Chỉ Một Cuộc Gọi</span>
        </h2>
        
        <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-12 sm:mb-16 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0 text-justify" style={{ textAlign: 'justify' }}>
          Để chúng tôi thiết kế trải nghiệm chăm sóc hoàn hảo cho người thân quý giá của bạn
        </p>
        
        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 mb-12 sm:mb-16">
          <div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="font-serif font-light text-3xl sm:text-4xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>1</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Liên hệ</h3>
            <p className="text-sm sm:text-base text-white/80">Hotline VIP 24/7</p>
          </div>
          <div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="font-serif font-light text-3xl sm:text-4xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>2</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Tư vấn</h3>
            <p className="text-sm sm:text-base text-white/80">Chuyên gia 1-1</p>
          </div>
          <div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="font-serif font-light text-3xl sm:text-4xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>3</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Trải nghiệm</h3>
            <p className="text-sm sm:text-base text-white/80">Dịch vụ 5 sao</p>
          </div>
        </div>
        
        <button className="px-8 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-5 bg-white font-semibold text-xs sm:text-sm tracking-wider rounded-full hover:shadow-2xl transition-all" 
                style={{ color: '#8B0A3D' }}>
          ĐẶT LỊCH NGAY
        </button>
      </div>
    </section>
  );
};

export default Session6;
