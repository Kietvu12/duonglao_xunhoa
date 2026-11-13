import { Link } from 'react-router-dom';
import logoWhite from '../assets/logowhite.png';
import zaloIcon from '../assets/zalo.svg';
import { CONTACT, MAPS, SOCIAL } from '../config/siteInfo';

const socialLinks = [
  {
    label: 'Facebook',
    href: SOCIAL.facebook,
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: SOCIAL.tiktok,
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
  },
  {
    label: 'Zalo',
    href: SOCIAL.zalo,
    icon: <img src={zaloIcon} alt="" className="w-6 h-6" aria-hidden="true" />,
  },
];

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/ve-chung-toi', label: 'Về chúng tôi' },
    { path: '/dich-vu', label: 'Dịch vụ' },
    { path: '/tien-ich', label: 'Tiện ích' },
    { path: '/blog', label: 'Blog' },
    { path: '/lien-he', label: 'Đặt lịch tham quan' },
  ];

  const supportLinks = [
    { path: '/huong-dan-su-dung', label: 'Hướng dẫn sử dụng' },
    { path: '/lien-he', label: 'Liên hệ' },
  ];

  return (
    <footer id="contact" className="py-20" style={{ background: '#2D2D2D' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <Link to="/" className="flex items-center space-x-4">
                <img
                  src={logoWhite}
                  alt="Xuân Hoa Logo"
                  className="h-16 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <div className="font-serif font-semibold text-2xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Xuân Hoa</div>
                  <div className="text-xs tracking-wider text-white">
                    LUXURY SENIOR LIVING
                  </div>
                </div>
              </Link>
            </div>
            <p className="text-white mb-8 max-w-md leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chăm sóc người cao tuổi với tiêu chuẩn đẳng cấp quốc tế. 
              Mang đến cuộc sống sang trọng và hạnh phúc cho người thân quý giá của bạn.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  style={{ textDecoration: 'none' }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Liên kết</h3>
            <ul className="space-y-3 text-white text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-serif text-lg font-semibold text-white mb-6 mt-8" style={{ fontFamily: "'Playfair Display', serif" }}>Hỗ trợ</h3>
            <ul className="space-y-3 text-white text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
              {supportLinks.map((link) => (
                <li key={`${link.path}-${link.label}`}>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Liên hệ</h3>
            <ul className="space-y-4 text-sm text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <li>
                <a
                  href={MAPS.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:underline"
                  style={{ textDecoration: 'none' }}
                >
                  Trung tâm trường thọ Xuân Hoa
                  <br />
                  {CONTACT.address.display}
                </a>
              </li>
              <li>
                Hotline / Zalo:{' '}
                <a
                  href={CONTACT.hotline.tel}
                  className="text-white font-semibold hover:underline"
                  style={{ textDecoration: 'none' }}
                >
                  {CONTACT.hotline.display}
                </a>
              </li>
              <li>
                Email:{' '}
                <a
                  href={CONTACT.email.href}
                  className="text-white hover:underline break-all"
                  style={{ textDecoration: 'none' }}
                >
                  {CONTACT.email.display}
                </a>
              </li>
              <li>{CONTACT.workingHours}</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            <p>© {new Date().getFullYear()} Trung tâm trường thọ Xuân Hoa. Bảo lưu mọi quyền.</p>
            <div className="flex gap-8">
              <Link to="/dieu-khoan-su-dung" className="hover:underline" style={{ textDecoration: 'none', color: 'inherit' }}>Điều khoản sử dụng</Link>
              <Link to="/chinh-sach-bao-mat" className="hover:underline" style={{ textDecoration: 'none', color: 'inherit' }}>Chính sách bảo mật</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
