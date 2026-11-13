import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { CONTACT, SITE_NAME } from '../config/siteInfo';
import SocialIconLinks from './SocialIconLinks';
import BookingCtaButton from './BookingCtaButton';

const quickLinks = [
  { path: '/', label: 'Trang chủ' },
  { path: '/ve-chung-toi', label: 'Về chúng tôi' },
  { path: '/dich-vu', label: 'Dịch vụ' },
  { path: '/tien-ich', label: 'Tiện ích' },
  { path: '/blog', label: 'Blog' },
];

const serviceLinks = [
  { path: '/dich-vu', label: 'Gói chăm sóc' },
  { path: '/tien-ich', label: 'Tiện ích & không gian sống' },
  { path: '/huong-dan-su-dung', label: 'Hướng dẫn sử dụng' },
];

// Hai trang nội dung chính sách đã có thật trong hệ thống — dùng Link, không dùng href="#".
const legalLinks = [
  { path: '/dieu-khoan-su-dung', label: 'Điều khoản sử dụng' },
  { path: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-raleway text-white" style={{ background: '#2D2D2D' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Thương hiệu */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={logoImage}
                alt={`${SITE_NAME} logo`}
                className="h-12 w-auto object-contain"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div
                  className="font-serif font-bold text-xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Xuân Hoa
                </div>
                <div className="text-xs font-semibold tracking-wider text-white/70">
                  LUXURY SENIOR LIVING
                </div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-white/75 mb-5">
              {SITE_NAME} – môi trường sống an toàn, chăm sóc tận tâm và kết nối gia đình
              cho người cao tuổi tại Hạ Long.
            </p>
            <SocialIconLinks />
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Dịch vụ & tiện ích
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liên hệ + CTA */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Liên hệ
            </h3>
            <ul className="space-y-2.5 text-sm text-white/75 mb-5">
              <li>
                Hotline / Zalo:{' '}
                <a href={CONTACT.hotline.tel} className="font-semibold text-white hover:underline">
                  {CONTACT.hotline.display}
                </a>
              </li>
              <li>
                Email:{' '}
                <a href={CONTACT.email.href} className="font-semibold text-white hover:underline break-all">
                  {CONTACT.email.display}
                </a>
              </li>
              <li>Địa chỉ: {CONTACT.address.display}</li>
            </ul>
            <BookingCtaButton
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                fontFamily: "'Playfair Display', serif",
                boxShadow: '0 10px 30px rgba(139, 10, 61, 0.35)',
              }}
            >
              Đặt lịch thăm
            </BookingCtaButton>
          </div>
        </div>

        {/* Dòng bản quyền + chính sách */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/60">
            © {currentYear} {SITE_NAME}. Bảo lưu mọi quyền.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/75">
            {legalLinks.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="transition-colors duration-200 hover:text-white hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
