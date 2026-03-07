const BlogSession1 = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden bg-white">
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, #C9A870 0%, transparent 70%)' }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 text-center">
        <div className="overflow-visible">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Tin tức & Bài viết
          </span>
          <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 overflow-visible" style={{ 
            color: '#2D2D2D', 
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.3',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem'
          }}>
            Blog<br/>
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
              Xuân Hoa
            </span>
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-8"></div>
          <p className="text-xl max-w-3xl mx-auto text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Cập nhật tin tức, bài viết về sức khỏe, hoạt động và cuộc sống tại Xuân Hoa
          </p>
        </div>
      </div>
    </section>
  );
};

export default BlogSession1;
