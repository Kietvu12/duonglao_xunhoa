import aboutUsDoctor1 from "../assets/Aboutus_Doctor1.png";

const AboutUsSession4 = () => {
  const staffMembers = [
    {
      id: 1,
      name: "BS. Nguyễn Minh Khang",
      designation: "Giám đốc Y tế",
      description: "20+ năm kinh nghiệm chăm sóc người cao tuổi",
      image: aboutUsDoctor1,
    },
    {
      id: 2,
      name: "ThS. Trần Thị Thu Hằng",
      designation: "Trưởng khoa Điều dưỡng",
      description: "Chứng chỉ quốc tế về chăm sóc dài hạn",
      image: aboutUsDoctor1,
    },
    {
      id: 3,
      name: "ThS. Phạm Anh Tú",
      designation: "Chuyên gia Dinh dưỡng",
      description: "Thạc sĩ Dinh dưỡng lâm sàng",
      image: aboutUsDoctor1,
    },
    {
      id: 4,
      name: "ThS. Lê Quỳnh Mai",
      designation: "Trưởng bộ phận Phục hồi",
      description: "Chuyên gia vật lý trị liệu",
      image: aboutUsDoctor1,
    },
    {
      id: 5,
      name: "ThS. Hoàng Gia Bảo",
      designation: "Chuyên gia Tâm lý",
      description: "Chuyên sâu tâm lý người cao tuổi",
      image: aboutUsDoctor1,
    },
    {
      id: 6,
      name: "Võ Thị Kim Ngân",
      designation: "Quản lý Dịch vụ",
      description: "10+ năm quản lý khách sạn 5 sao",
      image: aboutUsDoctor1,
    },
    {
      id: 7,
      name: "LS. Đặng Quốc Huy",
      designation: "Cố vấn Pháp lý",
      description: "Chuyên gia pháp lý y tế",
      image: aboutUsDoctor1,
    },
    {
      id: 8,
      name: "Ngô Thảo Vy",
      designation: "Giám đốc Truyền thông",
      description: "Chuyên gia quan hệ cộng đồng",
      image: aboutUsDoctor1,
    },
  ];

  return (
    <section className="py-24 lg:py-32" style={{ background: '#F9F6F1' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Đội ngũ chuyên gia
          </span>
          <h2 className="font-serif text-5xl lg:text-6xl font-bold mb-6 overflow-visible" style={{ 
            color: '#2D2D2D', 
            fontFamily: "'Playfair Display', serif",
            lineHeight: '1.3',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem'
          }}>
            Những Người<br/>
            <span style={{ color: '#A90046' }}>Dẫn Dắt</span>
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="team-card rounded-2xl overflow-hidden shadow-lg relative group"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-80 object-cover"
              />
              
              {/* Gradient Overlay on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(139, 10, 61, 0.9) 0%, rgba(169, 0, 70, 0.9) 100%)'
                }}
              ></div>
              
              {/* Team Info - Slides up on hover */}
              <div 
                className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-10 text-white"
              >
                <h3 className="font-serif text-2xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {member.name}
                </h3>
                <p className="text-sm mb-4 opacity-90">{member.designation}</p>
                <p className="text-sm leading-relaxed opacity-80 text-justify" style={{ textAlign: 'justify' }}>
                  {member.description}
                </p>
              </div>
              
              {/* Default Info */}
              <div className="p-6 bg-white">
                <h3 className="font-serif text-lg font-bold mb-1" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                  {member.name}
                </h3>
                <p className="text-sm" style={{ color: '#2D2D2D' }}>{member.designation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSession4;
