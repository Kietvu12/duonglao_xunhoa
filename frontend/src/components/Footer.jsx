import { Link } from 'react-router-dom';
import logoWhite from '../assets/logowhite.png';

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/ve-chung-toi', label: 'Về chúng tôi' },
    { path: '/dich-vu', label: 'Dịch vụ' },
    { path: '/tien-ich', label: 'Tiện ích' },
    { path: '/blog', label: 'Blog' },
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
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" style={{ textDecoration: 'none' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" style={{ textDecoration: 'none' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" style={{ textDecoration: 'none' }}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
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
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Liên hệ</h3>
            <ul className="space-y-4 text-sm text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              <li className="flex items-start">
                <span className="text-white">
                  Trung tâm trường thọ Xuân Hoa Halong
                  <br />
                  khu A1 - Biệt thự cao cấp đồi thủy sản - Phường Bãi Cháy - Quảng Ninh
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-white">
                  <a
                    href="tel:0961799588"
                    className="text-white hover:text-white transition-colors"
                    style={{ textDecoration: 'none' }}
                  >
                    0961799588
                  </a>
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-white">
                  <a
                    href="https://duonglaoxuanhoa.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-white transition-colors break-all"
                    style={{ textDecoration: 'none' }}
                  >
                    https://duonglaoxuanhoa.net/
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            <p>© {new Date().getFullYear()} Xuân Hoa Luxury Senior Living. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</a>
              <a href="#" className="hover:text-white transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
