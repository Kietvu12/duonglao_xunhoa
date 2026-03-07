import serviceImage from '../assets/ServiceSession1.png';

const ServiceSession1 = () => {
  return (
    <section className="pt-20 sm:pt-32 pb-12 sm:pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden bg-white">
      <div className="absolute top-20 right-10 w-32 h-32 sm:w-64 sm:h-64 rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, #C9A870 0%, transparent 70%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 text-center">
        <div className="relative">
          {/* Decorative border element - giống AboutUsSession1 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] sm:h-[400px] lg:h-[500px] border-2 rounded-2xl sm:rounded-3xl -z-10"
               style={{ borderColor: '#E8D7B7' }}></div>
          <div className="relative z-10 overflow-visible">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Dịch vụ cao cấp
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 overflow-visible leading-relaxed" style={{ 
            color: '#2D2D2D', 
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.4'
          }}>
            Dịch Vụ<br/>
            <span 
              className="inline-block"
              style={{
                background: 'linear-gradient(90deg, #C9A870 0%, #F5E6C8 30%, rgb(177, 152, 11) 50%, #F5E6C8 70%, #C9A870 100%)',
                backgroundSize: '300% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'goldShine 4s linear infinite',
                backgroundPosition: '200% center',
                display: 'block',
                marginTop: '0.25rem'
              }}
            >
              Đẳng Cấp
            </span>
          </h1>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 sm:px-0 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Trải nghiệm dịch vụ chăm sóc toàn diện với tiêu chuẩn quốc tế, 
            mang đến cuộc sống chất lượng cao và hạnh phúc trọn vẹn cho người thân của bạn.
          </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSession1;
