import { Link } from 'react-router-dom';
import session2ContentImage from '../assets/session2_content.png';

const Session2 = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Giá trị cốt lõi
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
            Cái Chạm Nhỏ,<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Hạnh Phúc Lớn</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg px-4 sm:px-0 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Chúng tôi tin rằng hạnh phúc đến từ những điều giản đơn nhất. 
            Mỗi nụ cười, mỗi câu chuyện, mỗi bữa ăn đều được chăm chút với tình yêu thương.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img 
                src={session2ContentImage} 
                alt="Chăm sóc người cao tuổi" 
                className="w-full"
              />
              {/* Decorative Frame */}
              <div className="absolute -inset-2 sm:-inset-4 border-2 rounded-2xl sm:rounded-3xl -z-10"
                   style={{ borderColor: '#E8D7B7' }}></div>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-8 sm:space-y-10 order-1 lg:order-2">
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full flex-shrink-0 border-2"
                   style={{ 
                     background: 'linear-gradient(135deg, #EDE8E0 0%, white 100%)',
                     borderColor: '#E8D7B7'
                   }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                  Chăm sóc cư dân
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                  Đội ngũ chuyên nghiệp với kinh nghiệm lâu năm và được đào tạo bài bản, 
                  luôn đặt sức khỏe và hạnh phúc của cư dân lên hàng đầu.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full flex-shrink-0 border-2"
                   style={{ 
                     background: 'linear-gradient(135deg, #EDE8E0 0%, white 100%)',
                     borderColor: '#E8D7B7'
                   }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                  Điều dưỡng chuyên nghiệp
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                  Đội ngũ y tá và điều dưỡng được chứng nhận quốc tế, sẵn sàng 
                  hỗ trợ 24/7 với tình yêu thương và trách nhiệm cao nhất.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full flex-shrink-0 border-2"
                   style={{ 
                     background: 'linear-gradient(135deg, #EDE8E0 0%, white 100%)',
                     borderColor: '#E8D7B7'
                   }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                  Dinh dưỡng người cao tuổi
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                  Thực đơn cao cấp được thiết kế riêng bởi chuyên gia dinh dưỡng hàng đầu, 
                  đảm bảo đầy đủ dưỡng chất và phù hợp với từng cá nhân.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session2;
