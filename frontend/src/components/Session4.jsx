import { useState, useEffect } from "react";
import avatarImage from "../assets/avatar_session4.png";

const Session4 = () => {
  const testimonials = [
    {
      id: 0,
      quote: "Viện dưỡng lão mang đến một môi trường sống ấm áp, an toàn và tràn đầy yêu thương. Nhân viên chăm sóc tận tâm, luôn quan tâm đến sức khỏe và cảm xúc của từng cư dân.",
      name: "Nguyễn Hữu Minh",
      company: "Con trai cư dân",
    },
    {
      id: 1,
      quote: "Dịch vụ chăm sóc tại đây thực sự xuất sắc. Đội ngũ nhân viên chuyên nghiệp, luôn hỗ trợ mọi nhu cầu của người cao tuổi. Tôi rất yên tâm khi cha mẹ mình sinh sống tại đây.",
      name: "Nguyễn Văn An",
      company: "Gia đình cư dân",
    },
    {
      id: 2,
      quote: "Viện dưỡng lão có cơ sở vật chất hiện đại, môi trường thoải mái và an toàn. Các hoạt động giải trí, rèn luyện sức khỏe và chế độ dinh dưỡng khoa học giúp người cao tuổi luôn vui vẻ và khỏe mạnh.",
      name: "Trần Thị Bình",
      company: "Gia đình cư dân",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const currentTestimonial = testimonials[currentIndex];

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }
    if (isRightSwipe) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Trải nghiệm khách hàng
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
            Câu Chuyện<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Từ Khách Hàng</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mt-4 sm:mt-6"></div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border-l-4"
              style={{
                background: 'linear-gradient(135deg, white 0%, #F9F6F1 100%)',
                borderLeftColor: '#C9A870'
              }}
            >
              <div className="flex items-center mb-4 sm:mb-6">
                <img 
                  src={avatarImage} 
                  alt={testimonial.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 flex-shrink-0"
                  style={{ borderColor: '#C9A870' }}
                />
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <div className="font-serif font-semibold text-base sm:text-lg leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                    {testimonial.name}
                  </div>
                  <div className="text-xs sm:text-sm" style={{ color: '#2D2D2D' }}>{testimonial.company}</div>
                </div>
              </div>
              <div className="flex mb-4 sm:mb-6" style={{ color: '#C9A870', fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                ★★★★★
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {index === 0 ? 'Sự an tâm tuyệt đối' : index === 1 ? 'Tận hưởng niềm vui' : 'Đẳng cấp 5 sao'}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {testimonial.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Session4;
