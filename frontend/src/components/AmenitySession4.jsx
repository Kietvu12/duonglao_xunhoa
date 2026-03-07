import home1 from "../assets/Home1.png";
import home2 from "../assets/Home2.png";

const AmenitySession4 = () => {
  const commonAreas = [
    {
      id: 1,
      image: home1,
      title: "Phòng Sinh Hoạt Chung",
      subtitle: "Living room sang trọng như khách sạn",
      description: "Phòng sinh hoạt rộng rãi, đầy đủ tiện nghi cao cấp là nơi cư dân thư giãn, trò chuyện và tham gia các hoạt động tập thể. Không gian ấm cúng, gần gũi giúp kết nối cộng đồng.",
      features: [
        "Sofa và ghế bành cao cấp",
        "Smart TV & hệ thống âm thanh",
        "Không gian ấm cúng, gần gũi"
      ],
    },
    {
      id: 2,
      image: home2,
      title: "Khu Vực Giao Lưu",
      subtitle: "Event space đa năng cao cấp",
      description: "Khu vực giao lưu đa năng, phù hợp cho các buổi sinh hoạt nhóm, xem phim hoặc sự kiện cộng đồng. Thiết kế mở, ánh sáng tự nhiên và nội thất tiện nghi cao cấp.",
      features: [
        "Không gian đa năng linh hoạt",
        "Projector & màn hình lớn",
        "Phù hợp cho events & tiệc"
      ],
    },
  ];

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Khu sinh hoạt
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            Khu Sinh Hoạt <span style={{ color: '#A90046' }}>Chung</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-8"></div>
          <p className="text-lg text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Không gian giao lưu, kết nối cộng đồng với thiết kế 
            hiện đại và đầy đủ tiện nghi cao cấp.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {commonAreas.map((area) => (
            <div
              key={area.id}
              className="bg-white rounded-3xl overflow-hidden border border-accent-gold/20 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2.5 relative"
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
              <div className="relative h-80 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="font-serif text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {area.title}
                  </h3>
                  <p className="text-sm opacity-90">
                    {area.subtitle}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-lg mb-6 leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                  {area.description}
                </p>
                <ul className="space-y-3">
                  {area.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A870' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                      </svg>
                      <span style={{ color: '#2D2D2D' }}>{feature}</span>
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

export default AmenitySession4;
