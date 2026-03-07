import image1 from "../assets/1.jpg";
import image2 from "../assets/2.jpg";
import image3 from "../assets/3.jpg";
import image4 from "../assets/4.jpg";

const AboutUsSession5 = () => {
  const philosophyItems = [
    {
      image: image1,
      text: "Lấy người cao tuổi làm trung tâm",
      number: 1,
    },
    {
      image: image2,
      text: "Chăm sóc bằng sự thấu hiểu",
      number: 2,
    },
    {
      image: image3,
      text: "Kết nối gia đình – cộng đồng – khoa học",
      number: 3,
    },
    {
      image: image4,
      text: "Cuộc sống an yên, ý nghĩa",
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {philosophyItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <img 
                  src={item.image} 
                  alt={item.text}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                       style={{ background: '#C9A870' }}>
                    <span className="font-serif font-bold text-2xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{item.number}</span>
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold mb-3" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {item.text.includes(' – ') ? (
                  <>
                    {item.text.split(' – ').map((part, i) => (
                      <span key={i}>
                        {part}
                        {i < item.text.split(' – ').length - 1 && <br />}
                      </span>
                    ))}
                  </>
                ) : (
                  item.text.split(' ').map((word, i, arr) => (
                    <span key={i}>
                      {word}
                      {i === Math.floor(arr.length / 2) - 1 && <br />}
                      {i < arr.length - 1 && ' '}
                    </span>
                  ))
                )}
              </h3>
              <p className="text-sm text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {index === 0 && "Mọi quyết định đều xuất phát từ nhu cầu và mong muốn của các cụ"}
                {index === 1 && "Hiểu rõ tâm lý, sức khỏe và nguyện vọng của từng cá nhân"}
                {index === 2 && "Xây dựng mạng lưới hỗ trợ toàn diện và bền vững"}
                {index === 3 && "Mang lại cuộc sống chất lượng cao và hạnh phúc trọn vẹn"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession5;
