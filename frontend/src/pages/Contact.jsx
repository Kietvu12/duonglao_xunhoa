import bgContact from '../assets/bg_contact.jpg';
import SeoHead from '../components/SeoHead';
import { CONTACT, MAPS } from '../config/siteInfo';

const Contact = () => {
  const contacts = [
    {
      title: 'Hotline / Zalo',
      value: CONTACT.hotline.display,
      description: 'Gọi hoặc nhắn Zalo để được tư vấn trực tiếp.',
      href: CONTACT.hotline.tel,
      linkLabel: 'Gọi ngay',
      highlight: true,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      title: 'Email',
      value: CONTACT.email.display,
      description: 'Gửi cho chúng tôi yêu cầu hoặc câu hỏi của bạn.',
      href: CONTACT.email.href,
      linkLabel: 'Gửi email',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      title: 'Địa chỉ',
      value: CONTACT.address.display,
      description: 'Đến trực tiếp hoặc đặt lịch tham quan trước.',
      href: MAPS.directionsUrl,
      linkLabel: 'Chỉ đường',
      external: true,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Giờ làm việc',
      value: CONTACT.workingHours,
      description: 'Tham quan trung tâm theo lịch hẹn – vui lòng đặt lịch trước.',
      href: null,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 249, 251, 0.88) 0%, rgba(255, 249, 251, 0.96) 40%, rgba(255, 249, 251, 0.98) 100%), url(${bgContact})`,
      }}
    >
      <SeoHead
        title="Liên hệ"
        description={`Liên hệ Trung tâm trường thọ Xuân Hoa tại Hạ Long: hotline/Zalo ${CONTACT.hotline.display}, email ${CONTACT.email.display}, địa chỉ ${CONTACT.address.display}. Tư vấn 24/7, đặt lịch tham quan.`}
        canonicalPath="/lien-he"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs md:text-sm font-raleway-semibold text-primary uppercase tracking-[0.08em]">
            Kết nối cùng XUÂN HOA
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-raleway-bold text-gray-900 leading-tight">
            Liên hệ chúng tôi
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-raleway-regular">
            Đội ngũ XUÂN HOA luôn sẵn sàng hỗ trợ và lắng nghe nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-12">
          {contacts.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-primary/10 shadow-sm hover:shadow-lg transition-shadow duration-200 p-5 md:p-6 h-full"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    item.highlight ? 'bg-primary text-white shadow-md' : 'bg-primary/10 text-primary shadow-inner'
                  }`}
                >
                  {item.icon}
                </span>
                <div className="flex flex-col gap-1 flex-1 min-h-[140px]">
                  <p className="text-xs uppercase tracking-[0.06em] text-gray-500 font-raleway-semibold">
                    {item.title}
                  </p>
                  <p className="text-base xl:text-lg font-raleway-bold text-gray-900 break-words [overflow-wrap:anywhere]">{item.value}</p>
                  <p className="text-sm text-gray-600 font-raleway-regular">{item.description}</p>
                  {item.href && (
                    <div className="mt-auto pt-2">
                      <a
                        href={item.href}
                        {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="inline-flex items-center gap-1 text-primary font-raleway-semibold text-sm hover:underline"
                      >
                        {item.linkLabel}
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h10M19 5v10M19 5l-9 9" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <div className="bg-white rounded-2xl border border-primary/10 shadow-sm p-6 md:p-8 space-y-4 flex flex-col h-full">
            <h3 className="text-2xl font-raleway-bold text-gray-900">Đến với chúng tôi</h3>
            <p className="text-gray-600 font-raleway-regular">
              Xem chỉ đường nhanh trên Google Maps hoặc đặt lịch tham quan Trung tâm trường thọ Xuân Hoa.
            </p>
            <div className="space-y-2 text-gray-700 font-raleway-regular">
              <p className="font-raleway-semibold">Địa chỉ</p>
              <p>{CONTACT.address.display}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={MAPS.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-5 py-3 bg-primary text-white rounded-tr-lg rounded-bl-lg rounded-tl-none rounded-br-none font-raleway-bold text-sm shadow-md hover:bg-primary-light transition-colors duration-200"
              >
                Mở Google Maps
              </a>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="px-5 py-3 border border-gray-200 rounded-xl font-raleway-semibold text-gray-700 hover:border-primary/50 hover:text-primary transition-colors duration-200 text-center"
              >
                Đặt lịch tham quan
              </button>
            </div>
          </div>

          <div className="relative w-full h-[320px] md:h-[420px] bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            <iframe
              title={`Bản đồ Trung tâm trường thọ Xuân Hoa – ${CONTACT.address.display}`}
              src={MAPS.embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


