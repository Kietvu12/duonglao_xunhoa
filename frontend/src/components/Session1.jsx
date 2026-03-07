import { Link } from "react-router-dom";
import session1Image from "../assets/session1.jpg";

const Session1 = () => {
  return (
    <section className="pt-20 sm:pt-32 pb-12 sm:pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden" style={{ background: '#F9F6F1' }}>
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 sm:w-64 sm:h-64 rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, #C9A870 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, #A90046 0%, transparent 70%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div>
              <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-widest uppercase mb-4 sm:mb-6 font-semibold"
                    style={{
                      background: '#E8D7B7',
                      color: '#8B0A3D',
                      border: '1px solid #C9A870',
                      letterSpacing: '0.15em'
                    }}>
                Chăm sóc trọn tình thương
              </span>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <h1 className="font-serif font-bold" style={{ 
                color: '#2D2D2D',
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                lineHeight: '1.3',
                fontFamily: "'Playfair Display', serif"
              }}>
                <span className="block mb-1 sm:mb-1.5">Chăm Sóc</span>
                <span className="block mb-1 sm:mb-1.5">Bằng Cả</span>
                <span 
                  className="inline-block"
                  style={{
                    background: 'linear-gradient(90deg, #C9A870 0%, #F5E6C8 30%,rgb(177, 152, 11) 50%, #F5E6C8 70%, #C9A870 100%)',
                    backgroundSize: '300% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'goldShine 8s linear infinite',
                    backgroundPosition: '200% center'
                  }}
                >
                  Trái Tim
                </span>
              </h1>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent"></div>
            </div>
            
            <p className="text-base sm:text-lg leading-relaxed text-justify" style={{ color: '#2D2D2D', maxWidth: '500px', textAlign: 'justify' }}>
              Tại Xuân Hoa, chúng tôi mang đến không chỉ dịch vụ chăm sóc chuyên nghiệp 
              cao cấp mà còn là tình yêu thương và sự tận tâm trong từng khoảnh khắc quý giá.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link
                to="/dich-vu"
                className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-full font-serif font-semibold text-xs sm:text-sm text-white transition-all duration-400 relative overflow-hidden text-center"
                style={{ 
                  background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: 'white',
                  fontFamily: "'Playfair Display', serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 10, 61, 0.4)';
                  // Hiệu ứng màu bạc chạy qua
                  const shine = e.currentTarget.querySelector('.btn-shine');
                  if (shine) {
                    shine.style.left = '100%';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  const shine = e.currentTarget.querySelector('.btn-shine');
                  if (shine) {
                    shine.style.left = '-100%';
                  }
                }}
              >
                <span className="relative z-10">Liên lạc với chúng tôi</span>
                <span 
                  className="btn-shine absolute top-0 left-[-100%] w-full h-full transition-all duration-600"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.6s ease'
                  }}
                ></span>
              </Link>
              <Link
                to="/lien-he"
                className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-full font-serif font-semibold text-xs sm:text-sm transition-all duration-400 text-center"
                style={{ 
                  border: '2px solid #C9A870',
                  color: '#C9A870',
                  background: 'transparent',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontFamily: "'Playfair Display', serif"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#C9A870';
                  e.currentTarget.style.color = '#2D2D2D';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(201, 168, 112, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#C9A870';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Khám phá thêm
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pt-6 sm:pt-10">
              <div className="text-center lg:text-left">
                <div className="font-serif font-light mb-1 sm:mb-2" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                  background: 'linear-gradient(135deg, #8B0A3D, #C9A870)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.1',
                  fontFamily: "'Playfair Display', serif",
                }}>15+</div>
                <div className="text-[10px] sm:text-xs tracking-wider mt-1 sm:mt-2 uppercase leading-tight" style={{ color: '#2D2D2D' }}>
                  Năm<br className="hidden sm:block"/>kinh nghiệm
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-serif font-light mb-1 sm:mb-2" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                  background: 'linear-gradient(135deg, #8B0A3D, #C9A870)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.1',
                  fontFamily: "'Playfair Display', serif",
                }}>500+</div>
                <div className="text-[10px] sm:text-xs tracking-wider mt-1 sm:mt-2 uppercase leading-tight" style={{ color: '#2D2D2D' }}>
                  Cư dân<br className="hidden sm:block"/>hài lòng
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-serif font-light mb-1 sm:mb-2" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 4rem)',
                  background: 'linear-gradient(135deg, #8B0A3D, #C9A870)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.1',
                  fontFamily: "'Playfair Display', serif",
                }}>98%</div>
                <div className="text-[10px] sm:text-xs tracking-wider mt-1 sm:mt-2 uppercase leading-tight" style={{ color: '#2D2D2D' }}>
                  Đánh giá<br className="hidden sm:block"/>tích cực
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
                 style={{
                   position: 'relative'
                 }}>
              <div 
                className="absolute inset-0 z-10"
                
              ></div>
              <img 
                src={session1Image} 
                alt="Chăm sóc người cao tuổi" 
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover"
              />
            </div>
            
            {/* Floating Badge */}
            <div 
              className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-[200px] sm:max-w-sm"
              style={{
                animation: 'float 6s ease-in-out infinite'
              }}
            >
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-serif font-semibold text-sm sm:text-base lg:text-xl mb-1 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                    Chứng nhận ISO 9001
                  </div>
                  <div className="text-xs sm:text-sm leading-tight" style={{ color: '#2D2D2D' }}>
                    Chất lượng dịch vụ quốc tế
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session1;
