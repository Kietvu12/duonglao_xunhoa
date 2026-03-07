import { useRef, useState, useEffect, useCallback } from "react";
import doctorImage from "../assets/doctor-hospital.jpg";

const ExpertTeamSection = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const featuredExpert = {
    id: 1,
    title: "Giám đốc chuyên môn",
    name: "BSCK2 – Ths. BS NT Hoàng Thị Phương Nam",
    description:
      "Bác sĩ CK2 – Ths- BSNT Hoàng Thị Phương Nam là bác sĩ chuyên ngành Nội- Lão khoa với hơn 15 năm kinh nghiệm trong khám, điều trị và chăm sóc toàn diện cho người cao tuổi. Trong quá trình công tác, bác sĩ làm việc tại nhiều chuyên khoa trọng điểm như Hồi sức tích cực, Cấp cứu, Đột quỵ, Tim mạch và Hô hấp bệnh viện Lão khoa Trung ương, giúp tích lũy kinh nghiệm sâu rộng trong xử trí các bệnh lý cấp tính và mạn tính thường gặp ở người cao tuổi.",
    positions: [
      "Giảng viên Bộ môn Lão khoa – Trường ĐHY Hà Nội",
      "Bác sĩ Bệnh viện Lão khoa Trung Ương",
      "Bác sĩ TT Y khoa Số 1 – Tôn Thất Tùng – Bệnh viện Đại học Y Hà Nội",
    ],
  };

  const experts = [
    {
      id: 2,
      title: "Bác sĩ chuyên khoa",
      name: "PGS. TS. BS CK2 Trần Nguyễn Ngọc",
      description:
        "PGS. TS. BSCKII Trần Nguyễn Ngọc là chuyên gia đầu ngành về Sức khỏe Tâm thần tại Việt Nam, hiện giữ chức Trưởng khoa Điều trị Rối loạn Cảm xúc – Viện Sức khỏe Tâm thần, Bệnh viện Bạch Mai và là Giảng viên cao cấp Đại học Y Hà Nội.",
      positions: [],
    },
    {
      id: 3,
      title: "Chuyên gia cố vấn",
      name: "PGS. TS. BS Trần Hữu Bình",
      description:
        "PGS, TS, Giảng viên cao cấp Trần Hữu Bình – Thầy thuốc Nhân dân, là bác sĩ đầu ngành chuyên khoa Tâm thần – Tâm bệnh học tại Việt Nam. Ông từng giữ nhiều vị trí lãnh đạo và học thuật quan trọng như Nguyên Viện trưởng Viện Sức khỏe Tâm thần Quốc gia (Bệnh viện Bạch Mai).",
      positions: [],
    },
    {
      id: 4,
      title: "Chuyên gia cố vấn",
      name: "PGS. BS. Phan Toàn Thắng",
      description:
        "PGS Phan Toàn Thắng là nhà khoa học tiên phong trong y học tái tạo và công nghệ tế bào gốc, là người Việt Nam đầu tiên sở hữu bằng sáng chế độc quyền công nghệ tách chiết tế bào gốc từ màng dây rốn được bảo hộ ở 80 quốc gia.",
      positions: [],
    },
  ];


  // Drag to scroll handlers
  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  }, []);

  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.userSelect = "auto";
  };

  // Ngăn chặn cuộn dọc khi scroll wheel
  const handleWheel = useCallback((e) => {
    if (!scrollContainerRef.current) return;
    // Chỉ cho phép cuộn ngang, ngăn cuộn dọc
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      e.stopPropagation();
      // Chuyển đổi cuộn dọc thành cuộn ngang
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  }, []);

  // Handle mouse move and up events globally for better drag experience
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-32 bg-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 sm:w-64 sm:h-64 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, #C9A870 0%, transparent 70%)' }}></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 sm:w-96 sm:h-96 rounded-full opacity-5"
           style={{ background: 'radial-gradient(circle, #A90046 0%, transparent 70%)' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Chuyên môn
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-relaxed" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif", lineHeight: '1.4' }}>
            Đội Ngũ<br/>
            <span style={{ color: '#A90046', display: 'block', marginTop: '0.25rem' }}>Chuyên Gia Hàng Đầu</span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-base sm:text-lg leading-relaxed px-4 sm:px-0 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
            Trung tâm trường thọ Xuân Hoa tự hào sở hữu đội ngũ nguồn nhân lực chất lượng cao, 
            được tuyển chọn kỹ lưỡng và đào tạo bài bản trong lĩnh vực chăm sóc người cao tuổi.
          </p>
        </div>

        {/* Featured Expert Card - Top Section */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-accent-gold/20 shadow-lg"
               style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
            {/* Image Section */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={doctorImage}
                  alt={featuredExpert.name}
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -inset-2 sm:-inset-4 border-2 rounded-xl sm:rounded-2xl -z-10"
                   style={{ borderColor: '#E8D7B7' }}></div>
            </div>
              
            {/* Content Section */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              {featuredExpert.title && (
                <div className="inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold mb-3 sm:mb-4"
                     style={{
                       background: '#E8D7B7',
                       color: '#8B0A3D',
                       border: '1px solid #C9A870'
                     }}>
                  {featuredExpert.title}
                </div>
              )}
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 sm:mb-6" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                {featuredExpert.name}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                {featuredExpert.description}
              </p>
              {featuredExpert.positions && featuredExpert.positions.length > 0 && (
                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t" style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
                  <div className="font-serif text-sm sm:text-base font-semibold mb-2 sm:mb-3" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                    Các vị trí công tác:
                  </div>
                  {featuredExpert.positions.map((position, posIndex) => (
                    <div
                      key={posIndex}
                      className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm leading-relaxed"
                      style={{ color: '#2D2D2D' }}
                    >
                      <span className="text-accent-gold mt-1 flex-shrink-0">•</span>
                      <span className="min-w-0">{position}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Other Experts - Horizontal Scrollable Cards */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide pb-4 scroll-smooth cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              overflowY: "hidden",
              touchAction: "pan-x",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            {experts.map((expert, index) => (
              <div
                key={expert.id}
                className="group flex-shrink-0 relative w-[280px] sm:w-[320px] md:w-[350px] lg:w-[400px]"
              >
                {/* Card Container */}
                <div className="relative w-full bg-white rounded-2xl sm:rounded-3xl border border-accent-gold/20 transition-all duration-500 group-hover:shadow-2xl"
                     style={{ borderColor: 'rgba(201, 168, 112, 0.2)' }}>
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                    <img
                      src={doctorImage}
                      alt={expert.name}
                      className="w-full h-auto object-contain rounded-t-2xl sm:rounded-t-3xl"
                    />
                  </div>

                  {/* Gradient Overlay on Hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl sm:rounded-3xl"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(139, 10, 61, 0.9) 0%, rgba(169, 0, 70, 0.9) 100%)'
                    }}
                  ></div>
                  
                  {/* Team Info - Slides up on hover */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400 z-10 text-white"
                  >
                    {expert.title && (
                      <div className="inline-block px-3 sm:px-4 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold mb-3 sm:mb-4 bg-white/20 text-white border border-white/30">
                        {expert.title}
                      </div>
                    )}
                    <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {expert.name}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 opacity-90 text-justify" style={{ textAlign: 'justify' }}>
                      {expert.description}
                    </p>
                    {expert.positions && expert.positions.length > 0 && (
                      <div className="space-y-2 pt-3 sm:pt-4 border-t border-white/20">
                        <div className="text-xs sm:text-sm md:text-base font-serif font-semibold opacity-90 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                          Các vị trí công tác:
                        </div>
                        {expert.positions.map((position, posIndex) => (
                          <div
                            key={posIndex}
                            className="text-xs md:text-sm opacity-80 flex items-start gap-2"
                          >
                            <span className="text-accent-gold mt-1 flex-shrink-0">•</span>
                            <span className="min-w-0">{position}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Default Info */}
                  <div className="p-4 sm:p-6 bg-white rounded-b-2xl sm:rounded-b-3xl opacity-100 group-hover:opacity-0 transition-opacity duration-400">
                    <h3 className="font-serif text-lg sm:text-xl font-bold mb-1 sm:mb-2" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                      {expert.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>{expert.title || 'Chuyên gia'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hide scrollbar for webkit browsers */}
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ExpertTeamSection;

