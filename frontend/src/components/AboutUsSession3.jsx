const AboutUsSession3 = () => {
  const coreValues = [
    {
      title: "Nhân ái",
      description: "Tôn trọng, thấu hiểu và đồng hành với người cao tuổi bằng sự tử tế và lòng trắc ẩn.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: "Chuyên nghiệp",
      description: "Cung cấp dịch vụ chăm sóc dựa trên tiêu chuẩn chuyên môn, quy trình chuẩn và đội ngũ nhân lực tận tâm.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      title: "An toàn & Chất lượng",
      description: "Đảm bảo mọi hoạt động chăm sóc đều hướng tới an toàn tối đa và chất lượng bền vững.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Hợp tác & Chia sẻ",
      description: "Phối hợp chặt chẽ với gia đình, cộng đồng và các tổ chức chuyên môn để nâng cao hiệu quả chăm sóc.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: "Đổi mới & Phát triển",
      description: "Không ngừng cải tiến mô hình chăm sóc, ứng dụng công nghệ và nâng cao trình độ nhân lực.",
      icon: (
        <svg className="w-10 h-10" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Giá trị cốt lõi
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            Những Giá Trị<br/>
            <span style={{ color: '#A90046' }}>Chúng Tôi Theo Đuổi</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-10 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5"
              style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
            >
              {/* Top border animation */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{
                  background: 'linear-gradient(90deg, #C9A870, #A90046)'
                }}
              ></div>
              
              <div className="w-20 h-20 flex items-center justify-center rounded-full mb-8 border-2 group-hover:scale-110 transition-transform duration-400"
                   style={{ 
                     background: 'linear-gradient(135deg, #EDE8E0 0%, white 100%)',
                     borderColor: '#E8D7B7'
                   }}>
                {value.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {value.title}
              </h3>
              <p className="leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {value.description}
              </p>
            </div>
          ))}
          
          {/* CTA Card */}
          <div className="rounded-3xl p-10 relative overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}>
            <div className="relative z-10">
              <h3 className="font-serif text-3xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Trải nghiệm<br/>giá trị này
              </h3>
              <p className="text-white/90 mb-8 leading-relaxed text-justify" style={{ textAlign: 'justify' }}>
                Đến thăm Xuân Hoa để cảm nhận trực tiếp 
                những giá trị chúng tôi mang lại.
              </p>
              <button className="px-8 py-3 bg-white rounded-full font-semibold text-sm tracking-wide hover:shadow-2xl transition-all" 
                      style={{ color: '#8B0A3D' }}>
                ĐẶT LỊCH THĂM
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession3;
