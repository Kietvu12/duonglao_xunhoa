import session3Image from "../assets/session3.png";

const Session3 = () => {
  const services = [
    {
      id: 1,
      title: "Chăm Sóc Nội Trú",
      description: "Suite cao cấp với đầy đủ tiện nghi 5 sao, môi trường yên tĩnh và sang trọng. Chăm sóc toàn diện 24/7.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Chăm Sóc Ban Ngày",
      description: "Dịch vụ linh hoạt với không gian sang trọng. Các hoạt động phong phú và chương trình giải trí đa dạng.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Chăm Sóc Tại Nhà",
      description: "Đội ngũ chuyên gia đến tận nhà với dịch vụ cao cấp. Linh hoạt về thời gian và nhu cầu cá nhân.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Phục Hồi Chức Năng",
      description: "Chương trình phục hồi cá nhân hóa với thiết bị y tế hiện đại nhất và đội ngũ chuyên gia hàng đầu.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Chăm Sóc Đặc Biệt",
      description: "Chuyên sâu cho Alzheimer's và sa sút trí tuệ với không gian an toàn và đội ngũ được đào tạo chuyên biệt.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 xl:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Dịch vụ cao cấp
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
            Trải Nghiệm Đẳng Cấp<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Ở Mọi Dịch Vụ</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto"></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5"
              style={{
                borderColor: 'rgba(201, 168, 112, 0.2)'
              }}
            >
              {/* Top border animation */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{
                  background: 'linear-gradient(90deg, #C9A870, #A90046)'
                }}
              ></div>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full mb-6 sm:mb-8 border-2 group-hover:scale-110 transition-transform duration-400"
                   style={{ 
                     background: 'linear-gradient(135deg, #EDE8E0 0%, white 100%)',
                     borderColor: '#E8D7B7'
                   }}>
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  {service.icon}
                </div>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {service.title}
              </h3>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {service.description}
              </p>
              <a href="#" className="inline-flex items-center font-semibold text-xs sm:text-sm tracking-wide hover:gap-2 transition-all" 
                 style={{ color: '#C9A870' }}>
                TÌM HIỂU THÊM
                <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
          
          {/* CTA Card */}
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}>
            <div className="relative z-10">
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cần tư vấn<br/>chi tiết?
              </h3>
              <p className="text-white/90 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-justify" style={{ textAlign: 'justify' }}>
                Để chúng tôi thiết kế giải pháp chăm sóc hoàn hảo 
                cho người thân quý giá của bạn.
              </p>
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white rounded-full font-semibold text-xs sm:text-sm tracking-wide hover:shadow-2xl transition-all" 
                      style={{ color: '#8B0A3D' }}>
                LIÊN HỆ NGAY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Session3;
