import aboutUsImage from "../assets/Aboutus_session1.png";

const AboutUsSession1 = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden" style={{ background: '#F9F6F1' }}>
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, #C9A870 0%, transparent 70%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 overflow-visible">
            <div>
              <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
                Về chúng tôi
              </span>
              <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 overflow-visible" style={{ 
                color: '#2D2D2D', 
                fontFamily: "'Playfair Display', serif",
                lineHeight: '1.2',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem'
              }}>
                Xuân Hoa<br/>
                <span 
                  className="inline-block"
                  style={{
                    background: 'linear-gradient(90deg, #C9A870 0%, #F5E6C8 50%, #C9A870 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'goldShine 3s linear infinite'
                  }}
                >
                  Luxury Living
                </span>
              </h1>
              <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold to-transparent mt-6"></div>
            </div>
            
            <p className="text-xl leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              Nơi mỗi ngày đều là một trải nghiệm đẳng cấp, 
              nơi tình yêu thương và sự chăm sóc chuyên nghiệp 
              hòa quyện trong từng khoảnh khắc.
            </p>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={aboutUsImage} 
                alt="Về chúng tôi" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div className="absolute -inset-4 border-2 rounded-3xl -z-10"
                 style={{ borderColor: '#E8D7B7' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession1;
