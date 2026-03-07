import aboutUsSession2Image from "../assets/Aboutus_session2.png";

const AboutUsSession2 = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Mission */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5 flex flex-col h-full"
               style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
            {/* Top border animation */}
            <div 
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{
                background: 'linear-gradient(90deg, #C9A870, #A90046)'
              }}
            ></div>
            
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full mb-4 sm:mb-6 lg:mb-8 flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #E8D7B7 0%, #C9A870 100%)' }}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
              Sứ Mệnh
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mb-4 sm:mb-5 lg:mb-6"></div>
            <p className="text-base sm:text-lg leading-relaxed text-justify flex-1" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              Mang đến môi trường chăm sóc toàn diện, an toàn và nhân văn cho người cao tuổi; 
              đáp ứng đầy đủ nhu cầu chăm sóc sức khỏe, phục hồi chức năng, dinh dưỡng, 
              tinh thần và xã hội; đồng thời xây dựng một cộng đồng ấm áp, nơi các cụ 
              được tôn trọng, yêu thương và tận hưởng cuộc sống chất lượng cao.
            </p>
          </div>
          
          {/* Vision */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 border border-accent-gold/20 transition-all duration-500 relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2.5 flex flex-col h-full"
               style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
            {/* Top border animation */}
            <div 
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
              style={{
                background: 'linear-gradient(90deg, #C9A870, #A90046)'
              }}
            ></div>
            
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full mb-4 sm:mb-6 lg:mb-8 flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #E8D7B7 0%, #C9A870 100%)' }}>
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" style={{ color: '#A90046' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
              Tầm Nhìn
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mb-4 sm:mb-5 lg:mb-6"></div>
            <p className="text-base sm:text-lg leading-relaxed text-justify flex-1" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              Trở thành viện dưỡng lão kiểu mẫu hàng đầu Việt Nam và vươn tầm khu vực, 
              dẫn đầu về chất lượng chăm sóc người cao tuổi; ứng dụng hiệu quả 
              khoa học – công nghệ trong chăm sóc dài hạn và phục hồi chức năng; 
              đồng thời đóng góp tích cực vào việc nâng cao nhận thức xã hội về 
              giá trị và vai trò của người cao tuổi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession2;
