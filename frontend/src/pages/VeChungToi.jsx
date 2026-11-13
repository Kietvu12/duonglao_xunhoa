import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import AnimatedSection from '../components/AnimatedSection';
import BookingCtaButton from '../components/BookingCtaButton';
import { CONTACT, SITE_NAME } from '../config/siteInfo';

// 4 giá trị cốt lõi — luôn xếp lưới 2×2 cho cân đối.
const giaTriCotLoi = [
  {
    id: 'cham-soc-tan-tam',
    icon: '♥',
    title: 'Chăm sóc tận tâm',
    description:
      'Mỗi cư dân có kế hoạch chăm sóc riêng do điều dưỡng và bác sĩ xây dựng, theo dõi hằng ngày và điều chỉnh khi sức khỏe thay đổi.',
  },
  {
    id: 'an-toan',
    icon: '⛨',
    title: 'Môi trường an toàn',
    description:
      'Không gian không bậc, tay vịn liên tục, camera hành lang và quy trình trực 24/7 giúp hạn chế tối đa té ngã và xử lý sự cố kịp thời.',
  },
  {
    id: 'dinh-duong',
    icon: '❖',
    title: 'Dinh dưỡng cá nhân hóa',
    description:
      'Thực đơn tính theo bệnh lý, răng miệng và khẩu vị từng cụ; bữa ăn mềm, ít muối, ít đường cho người tăng huyết áp hoặc đái tháo đường.',
  },
  {
    id: 'ket-noi-gia-dinh',
    icon: '✉',
    title: 'Kết nối gia đình',
    description:
      'Người nhà theo dõi chỉ số sức khỏe, nhật ký chăm sóc và đặt lịch thăm qua ứng dụng; đội ngũ phản hồi trực tiếp khi gia đình cần trao đổi.',
  },
];

const camKet = [
  'Đội ngũ điều dưỡng được đào tạo chuyên môn và kiểm tra tay nghề định kỳ.',
  'Hồ sơ sức khỏe của cư dân được bảo mật, chỉ nhân sự được phân quyền truy cập.',
  'Minh bạch hợp đồng, chi phí và phạm vi dịch vụ trước khi gia đình quyết định.',
  'Gia đình được tham gia các hoạt động, sự kiện và buổi trao đổi cùng đội ngũ chăm sóc.',
];

const VeChungToi = () => {
  return (
    <div className="min-h-screen bg-white font-raleway">
      <SeoHead
        title="Về chúng tôi – Trung tâm trường thọ Xuân Hoa"
        description={`Giới thiệu ${SITE_NAME}: sứ mệnh, 4 giá trị cốt lõi và cam kết chăm sóc người cao tuổi tại Hạ Long. Đặt lịch tham quan miễn phí.`}
        canonicalPath="/ve-chung-toi"
      />

      {/* Hero */}
      <section
        className="pt-28 pb-14 md:pt-32 md:pb-20"
        style={{ background: 'linear-gradient(180deg, #FBF7F2 0%, #FFFFFF 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#A90046' }}>
            Về chúng tôi
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl"
            style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
          >
            Một nơi để người cao tuổi sống an nhiên, gia đình an tâm
          </h1>
          <div className="w-20 h-0.5 my-6" style={{ background: '#C9A870' }} />
          <p className="text-base md:text-lg leading-relaxed max-w-3xl text-justify" style={{ color: '#2D2D2D' }}>
            {SITE_NAME} được xây dựng với một niềm tin đơn giản: tuổi cao không có nghĩa là
            thu hẹp cuộc sống. Chúng tôi tạo ra môi trường sống an toàn, đủ đầy về chăm sóc
            sức khỏe và vẫn giữ trọn những kết nối thân thiết với gia đình.
          </p>
        </div>
      </section>

      {/* Câu chuyện */}
      <AnimatedSection delay={0}>
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2
                className="font-serif text-2xl md:text-3xl font-bold mb-4"
                style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
              >
                Hành trình của Xuân Hoa
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-justify" style={{ color: '#2D2D2D' }}>
                <p>
                  Xuân Hoa ra đời từ trăn trở của những người con từng chăm sóc cha mẹ trong
                  bệnh viện: thiếu không gian vận động, thiếu người trò chuyện và thiếu một
                  nơi để người cao tuổi được sống như chính mình.
                </p>
                <p>
                  Trung tâm được thiết kế theo hướng nhà ở hơn là cơ sở y tế: phòng ngủ nhiều
                  ánh sáng, khu vườn đi bộ, phòng sinh hoạt chung và các phòng chức năng phục
                  hồi. Đội ngũ y tế – điều dưỡng làm việc tại chỗ, theo dõi sức khỏe hằng ngày
                  và phối hợp với bệnh viện tuyến trên khi cần.
                </p>
                <p>
                  Chúng tôi tin rằng chăm sóc tốt bắt đầu từ việc lắng nghe: hiểu thói quen ăn
                  uống, giấc ngủ, sở thích và cả những điều người cao tuổi ngại nói ra. Vì vậy
                  mỗi cư dân đều có một kế hoạch chăm sóc riêng, được rà soát định kỳ cùng gia
                  đình.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border p-6 md:p-8" style={{ borderColor: 'rgba(201, 168, 112, 0.35)', background: '#FBF7F2' }}>
              <h3
                className="font-serif text-xl font-bold mb-4"
                style={{ color: '#8B0A3D', fontFamily: "'Playfair Display', serif" }}
              >
                Cam kết của chúng tôi
              </h3>
              <ul className="space-y-3">
                {camKet.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-justify" style={{ color: '#2D2D2D' }}>
                    <span className="mt-1 flex-shrink-0" style={{ color: '#C9A870' }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* 4 giá trị cốt lõi — lưới 2×2 */}
      <AnimatedSection delay={50}>
        <section className="py-12 md:py-16" style={{ background: '#FBF7F2' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
              <h2
                className="font-serif text-2xl md:text-3xl font-bold mb-3"
                style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
              >
                Giá trị cốt lõi
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#2D2D2D' }}>
                Bốn nguyên tắc định hình mọi hoạt động chăm sóc tại Xuân Hoa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {giaTriCotLoi.map((item) => (
                <div
                  key={item.id}
                  className="h-full rounded-2xl bg-white p-6 md:p-8 border transition-shadow duration-300 hover:shadow-lg"
                  style={{ borderColor: 'rgba(201, 168, 112, 0.3)' }}
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl"
                    style={{ background: '#F3E7D6', color: '#8B0A3D' }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="font-serif text-lg md:text-xl font-bold mb-2"
                    style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-justify" style={{ color: '#2D2D2D' }}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Dải CTA riêng — không còn là ô thứ 5 trong lưới */}
      <AnimatedSection delay={50}>
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
            <div
              className="rounded-3xl px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
              style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}
            >
              <div className="max-w-2xl">
                <h2
                  className="font-serif text-2xl md:text-3xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Đến thăm Xuân Hoa trong một buổi sáng
                </h2>
                <p className="text-sm md:text-base text-white/85 leading-relaxed">
                  Chọn ngày giờ thuận tiện, đội ngũ tư vấn sẽ đón tiếp và đưa bạn tham quan
                  phòng ở, khu vườn, phòng sinh hoạt và trao đổi trực tiếp về gói chăm sóc
                  phù hợp. Hoàn toàn miễn phí.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:min-w-[220px]">
                <BookingCtaButton
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5"
                  style={{ color: '#8B0A3D', fontFamily: "'Playfair Display', serif" }}
                >
                  Đặt lịch thăm
                </BookingCtaButton>
                <a
                  href={CONTACT.hotline.tel}
                  className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  Gọi {CONTACT.hotline.display}
                </a>
              </div>
            </div>

            <p className="mt-4 text-sm text-center md:text-left" style={{ color: '#5A5A5A' }}>
              Muốn xem trước các gói chăm sóc?{' '}
              <Link to="/dich-vu" className="font-semibold underline" style={{ color: '#A90046' }}>
                Xem dịch vụ của Xuân Hoa
              </Link>
              .
            </p>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default VeChungToi;
