/**
 * Tiếng nói nội bộ: HCNS, chăm sóc, Marketing, CTXH – Tâm lý, Ban lãnh đạo
 */
const TeamVoicesSection = () => {
  const blocks = [
    {
      id: "hcns",
      tag: "HCNS",
      title: "Nguyên tắc xây dựng đội ngũ",
      lines: [
        "Đằng sau một môi trường chăm sóc tốt là một đội ngũ được xây dựng bằng sự thấu hiểu và tận tâm.",
      ],
      author: "Phương Thảo",
    },
    {
      id: "nga",
      tag: "Chăm sóc",
      title: "Nhân viên chăm sóc",
      lines: [
        "Người cao tuổi cần được chăm sóc không chỉ để sống lâu, mà để sống có ý nghĩa.",
      ],
      author: "Nguyễn Nga",
    },
    {
      id: "toan",
      tag: "Chăm sóc",
      title: "Nhân viên chăm sóc",
      lines: [
        "Chăm sóc không chỉ là công việc, mà là sự yêu thương bằng hành động.",
        "Lấy sự tận tâm làm gốc, lấy an toàn làm nền tảng, và lấy nụ cười của người được chăm sóc làm giá trị lớn nhất.",
      ],
      author: "Toàn",
    },
    {
      id: "marketing",
      tag: "Marketing",
      title: "Thông điệp",
      lines: [
        "Niềm tin không đến từ quảng cáo.",
        "Mà từ những điều chúng tôi làm mỗi ngày.",
      ],
      author: null,
    },
    {
      id: "ctxh",
      tag: "CTXH – Tâm lý",
      title: "Lắng nghe & kết nối",
      lines: [
        "Được lắng nghe là một cách được yêu thương — và chúng tôi không bỏ lỡ điều đó mỗi ngày.",
        "Không ai nên già đi trong cô đơn. Chúng tôi ở đây để lắng nghe và kết nối.",
      ],
      author: null,
    },
    {
      id: "chair",
      tag: "Chủ đầu tư – Chủ tịch",
      title: "Cam kết hành trình",
      lines: [
        "Khi chọn làm điều này, chúng tôi đã lựa chọn đồng hành trách nhiệm đến cuối cùng.",
        "Chúng tôi không tạo ra một mô hình — mà kiến tạo một không gian sống, nơi tuổi già được trân trọng và nâng niu.",
        "Khi lựa chọn bắt đầu hành trình này, là lúc chúng tôi đã đồng hành với trách nhiệm đến sau cùng.",
      ],
      author: null,
    },
  ];

  return (
    <section
      className="py-16 sm:py-20 lg:py-24 xl:py-32 relative overflow-hidden"
      style={{ background: "#F9F6F1" }}
    >
      <div
        className="absolute top-10 left-0 w-40 h-40 sm:w-72 sm:h-72 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C9A870 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 relative">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-4 sm:px-6 py-2 rounded-full text-xs tracking-wide uppercase mb-4 sm:mb-6 bg-accent-gold-light text-primary-burgundy font-semibold border border-accent-gold">
            Con người Xuân Hoa
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-relaxed"
            style={{
              color: "#2D2D2D",
              fontFamily: "'Playfair Display', serif",
              lineHeight: "1.35",
            }}
          >
            Văn hóa & tiếng nói
            <span
              style={{
                color: "#A90046",
                display: "block",
                marginTop: "0.35rem",
              }}
            >
              từ đội ngũ
            </span>
          </h2>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-accent-gold via-accent-gold to-transparent mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blocks.map((b) => (
            <article
              key={b.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
              style={{ borderColor: "rgba(201, 168, 112, 0.25)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span
                  className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs tracking-wider uppercase font-semibold"
                  style={{
                    background: "#E8D7B7",
                    color: "#8B0A3D",
                    border: "1px solid #C9A870",
                  }}
                >
                  {b.tag}
                </span>
              </div>
              <h3
                className="font-serif text-lg sm:text-xl font-semibold mb-3 sm:mb-4 leading-snug"
                style={{
                  color: "#2D2D2D",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                {b.title}
              </h3>
              <div className="space-y-3 flex-1">
                {b.lines.map((line, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base leading-relaxed text-justify"
                    style={{ color: "#2D2D2D" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              {b.author && (
                <p
                  className="mt-5 pt-4 border-t text-sm font-semibold"
                  style={{
                    borderColor: "rgba(201, 168, 112, 0.35)",
                    color: "#8B0A3D",
                  }}
                >
                  — {b.author}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamVoicesSection;
