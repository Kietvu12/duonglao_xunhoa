import act1 from "../assets/act1.png";
import act2 from "../assets/act2.png";
import act3 from "../assets/act3.png";
import act4 from "../assets/act4.png";

const ServiceSession4 = () => {
  const activities = [
    {
      id: 1,
      image: act1,
      title: "Yoga Thư Giãn",
      description: "Cải thiện sự dẻo dai và mang lại cảm giác thư thái",
    },
    {
      id: 2,
      image: act2,
      title: "Board Games",
      description: "Kích thích trí não và gắn kết cộng đồng",
    },
    {
      id: 3,
      image: act3,
      title: "Làm Vườn Thư Thái",
      description: "Trị liệu tinh thần và nâng cao tâm trạng",
    },
    {
      id: 4,
      image: act4,
      title: "Trò Chơi Trong Nhà",
      description: "Duy trì sự năng động và niềm vui",
    },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 overflow-visible">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Hoạt động giải trí
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 overflow-visible leading-relaxed" style={{ 
            color: '#2D2D2D', 
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.4'
          }}>
            Đồng Hành<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Thấu Hiểu</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg px-4 sm:px-0 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Các hoạt động được thiết kế để nâng cao sức khỏe thể chất, 
            tinh thần và tạo không khí vui vẻ, gắn kết trong cộng đồng.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-accent-gold/20 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2.5 relative"
              style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}
            >
              {/* Top border animation */}
              <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-gold to-primary-rose transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"
                style={{
                  background: 'linear-gradient(90deg, #C9A870, #A90046)'
                }}
              ></div>
              
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="font-serif text-lg sm:text-xl font-bold mb-1 sm:mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {activity.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSession4;
