const AmenitySession5 = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Lối đi an toàn",
      description: "Các lối đi, cầu thang và hành lang được thiết kế thuận tiện, an toàn với tay vịn chuyên dụng và đèn chiếu sáng tự động.",
    },
    {
      id: 2,
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Tiện nghi sinh hoạt",
      description: "Phòng nghỉ, khu sinh hoạt và các tiện ích chung được bố trí hợp lý, dễ dàng tiếp cận và sử dụng.",
    },
    {
      id: 3,
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Hỗ trợ y tế",
      description: "Trang thiết bị hỗ trợ, tay vịn, thiết bị y tế được lắp đặt khoa học, giúp cư dân sống độc lập an toàn.",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Tiện ích bổ sung
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            An Toàn &<br/>
            <span style={{ color: '#A90046' }}>Tiện Nghi</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-3xl p-10 text-center border border-accent-gold/20 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2.5 relative overflow-hidden"
              style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
            >
              {/* Top border animation */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                style={{
                  background: 'linear-gradient(90deg, #C9A870, #A90046)'
                }}
              ></div>

              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
                   style={{ background: 'linear-gradient(135deg, #E8D7B7 0%, #C9A870 100%)' }}>
                {feature.icon}
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {feature.title}
              </h3>
              <p className="mb-6 leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitySession5;
