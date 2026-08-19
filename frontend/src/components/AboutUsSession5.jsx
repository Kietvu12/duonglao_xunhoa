import { aboutUsImages } from "../assets/aboutUsImages";

const AboutUsSession5 = () => {
  const philosophyItems = [
    {
      image: aboutUsImages.philosophy[0],
      title: 'Lấy người cao tuổi làm trung tâm',
      description: 'Mọi quyết định đều xuất phát từ nhu cầu và mong muốn của các cụ',
      number: 1,
    },
    {
      image: aboutUsImages.philosophy[1],
      title: 'Chăm sóc bằng sự thấu hiểu',
      description: 'Hiểu rõ tâm lý, sức khỏe và nguyện vọng của từng cá nhân',
      number: 2,
    },
    {
      image: aboutUsImages.philosophy[2],
      title: 'Kết nối gia đình – cộng đồng – khoa học',
      description: 'Xây dựng mạng lưới hỗ trợ toàn diện và bền vững',
      number: 3,
    },
    {
      image: aboutUsImages.philosophy[3],
      title: 'Cuộc sống an yên, ý nghĩa',
      description: 'Mang lại cuộc sống chất lượng cao và hạnh phúc trọn vẹn',
      number: 4,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Triết lý hoạt động
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
            Đặt Niềm Tin<br/>
            <span style={{ color: '#A90046' }}>Trao An Bình</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-8"></div>
          <p className="text-xl" style={{ color: '#2D2D2D' }}>
            Tôn trọng – Chăm sóc – Kết nối
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {philosophyItems.map((item) => (
            <div key={item.number} className="flex flex-col text-center h-full">
              <div className="relative mb-6 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center"
                       style={{ background: '#C9A870' }}>
                    <span className="font-serif font-bold text-2xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{item.number}</span>
                  </div>
                </div>
              </div>
              <h3
                className="font-serif text-xl font-bold mb-3 min-h-[5rem] flex items-center justify-center leading-snug px-2"
                style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed px-2" style={{ color: '#2D2D2D' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession5;
