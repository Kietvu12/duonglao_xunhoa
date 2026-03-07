import outside1 from "../assets/Outside1.png";
import outside2 from "../assets/Outside2.png";

const AmenitySession3 = () => {
  const outdoorSpaces = [
    {
      id: 1,
      image: outside1,
      title: "Khuôn Viên Ngoài Trời",
      subtitle: "Lối đi dạo an toàn giữa thiên nhiên",
      description: "Khu vực đi dạo rộng rãi, thoáng mát với lối đi lát đá cao cấp, an toàn, phù hợp cho vận động nhẹ nhàng. Bao quanh bởi cây xanh và hoa theo mùa, mang lại cảm giác thư thái.",
      features: [
        "Lối đi rộng rãi, bằng phẳng",
        "Cây xanh bóng mát quanh năm",
        "Ánh sáng tự nhiên dịu nhẹ"
      ],
    },
    {
      id: 2,
      image: outside2,
      title: "Khu Vườn Thư Giãn",
      subtitle: "Thiên đường xanh giữa lòng thành phố",
      description: "Khu vườn xanh mát với ghế nghỉ cao cấp, tiểu cảnh nghệ thuật và hoa theo mùa. Nơi lý tưởng để đọc sách, trò chuyện hoặc tận hưởng không khí trong lành.",
      features: [
        "Ghế nghỉ ergonomic cao cấp",
        "Tiểu cảnh thiền Zen",
        "Vườn hoa thay đổi theo mùa"
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Khuôn viên
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 lg:mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            Khuôn Viên <span style={{ color: '#A90046' }}>Xanh</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
          <p className="text-base sm:text-lg text-justify px-2" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Không gian xanh mát, yên tĩnh giúp cư dân thư giãn 
            và tận hưởng thiên nhiên mỗi ngày.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
          {outdoorSpaces.map((space) => (
            <div
              key={space.id}
              className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-accent-gold/20 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2.5 relative flex flex-col h-full"
              style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
            >
              {/* Top border animation */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                style={{
                  background: 'linear-gradient(90deg, #C9A870, #A90046)'
                }}
              ></div>

              {/* Image */}
              <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden flex-shrink-0">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 text-white">
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {space.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {space.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                <p className="text-base sm:text-lg mb-4 sm:mb-5 lg:mb-6 leading-relaxed text-justify flex-1" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                  {space.description}
                </p>
                <ul className="space-y-2 sm:space-y-3 mt-auto">
                  {space.features.map((feature, idx) => (
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

export default AmenitySession3;
