import meal1 from "../assets/meal1.png";
import meal2 from "../assets/meal2.png";
import meal3 from "../assets/meal3.png";

const ServiceSession3 = () => {
  const mealPlans = [
    {
      id: 1,
      image: meal1,
      title: "Dinh Dưỡng Tiêu Chuẩn",
      description: "Thực đơn cân bằng, dễ tiêu hóa, ít dầu mỡ và giàu chất xơ. Cung cấp đầy đủ năng lượng, vitamin và khoáng chất.",
      features: [
        "3 bữa chính + 2 bữa phụ",
        "Thực đơn đa dạng hàng tuần",
        "Nguyên liệu tươi sạch"
      ],
    },
    {
      id: 2,
      image: meal2,
      title: "Dinh Dưỡng Theo Yêu Cầu",
      description: "Chế độ ăn được thiết kế riêng cho từng nhu cầu: tiểu đường, cao huyết áp, giảm muối, ít đường theo chỉ định bác sĩ.",
      features: [
        "Tư vấn chuyên gia dinh dưỡng",
        "Thực đơn cá nhân hóa 100%",
        "Theo dõi chặt chẽ chỉ số"
      ],
      featured: true,
    },
    {
      id: 3,
      image: meal3,
      title: "Dinh Dưỡng Cao Cấp",
      description: "Thực đơn phong phú với nguyên liệu tươi ngon cao cấp, mang đến trải nghiệm ăn uống đẳng cấp và hấp dẫn hơn.",
      features: [
        "Nguyên liệu organic cao cấp",
        "Đầu bếp chuyên nghiệp",
        "Phục vụ theo yêu cầu"
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Chế độ dinh dưỡng
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
            Dinh Dưỡng<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Cá Nhân Hóa</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg px-4 sm:px-0 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Chế độ ăn được thiết kế bởi chuyên gia dinh dưỡng hàng đầu, 
            đảm bảo đầy đủ dưỡng chất và phù hợp với từng nhu cầu sức khỏe.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {mealPlans.map((meal) => (
            <div key={meal.id} className="relative flex flex-col h-full">
              {/* Featured Badge - Outside card to avoid overflow clipping */}
              {meal.featured && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-burgundy to-primary-rose text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wider uppercase z-20 shadow-lg whitespace-nowrap"
                     style={{
                       background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)'
                     }}>
                  Phổ biến nhất
                </div>
              )}
              
              <div
                className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-500 relative group hover:shadow-2xl hover:-translate-y-2.5 overflow-hidden flex flex-col h-full ${
                  meal.featured 
                    ? 'border-accent-gold pt-12 sm:pt-14 lg:pt-16 px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10' 
                    : 'border-accent-gold/20 p-6 sm:p-8 lg:p-10'
                }`}
                style={{ 
                  borderColor: meal.featured ? '#C9A870' : 'rgba(201, 168, 112, 0.2)'
                }}
              >
                {/* Top border animation */}
                <div 
                  className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transition-transform duration-500 origin-left ${
                    meal.featured ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{
                    background: 'linear-gradient(90deg, #C9A870, #A90046)',
                    zIndex: 1
                  }}
                ></div>
              
              <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4 leading-tight flex-shrink-0" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {meal.title}
              </h3>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mb-4 sm:mb-6 flex-shrink-0"></div>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed text-justify flex-1" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {meal.description}
              </p>
              
              <ul className="space-y-3 sm:space-y-4 mt-auto">
                {meal.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A870' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <span className="text-sm sm:text-base" style={{ color: '#2D2D2D' }}>{feature}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession3;
