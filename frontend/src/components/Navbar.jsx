import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { dichVuAPI, lichHenTuVanAPI } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [dichVus, setDichVus] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    loai_dich_vu_quan_tam: '',
    ngay_mong_muon: '',
    gio_mong_muon: '',
    ghi_chu: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  // Load services when booking modal opens
  useEffect(() => {
    const loadServices = async () => {
      if (isBookingModalOpen) {
        try {
          const response = await dichVuAPI.getAll({ limit: -1 });
          const services = response.data || [];
          console.log('Loaded services:', services.length, services);
          setDichVus(services);
        } catch (error) {
          console.error('Error loading services:', error);
        }
      }
    };
    loadServices();
  }, [isBookingModalOpen]);

  // Set default date and time when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDate = tomorrow.toISOString().split('T')[0];
      
      setFormData(prev => ({
        ...prev,
        ngay_mong_muon: prev.ngay_mong_muon || tomorrowDate,
        gio_mong_muon: prev.gio_mong_muon || '09:00'
      }));
    }
  }, [isBookingModalOpen]);

  const navLinks = [
    { path: '/', label: 'TRANG CHỦ' },
    { path: '/ve-chung-toi', label: 'VỀ CHÚNG TÔI' },
    { path: '/dich-vu', label: 'DỊCH VỤ' },
    { path: '/tien-ich', label: 'TIỆN ÍCH' },
    { path: '/blog', label: 'BLOG' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const openContactModal = () => {
    setIsMobileMenuOpen(false);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const openBookingModal = () => {
    setIsMobileMenuOpen(false);
    setIsBookingModalOpen(true);
    setSelectedServices([]);
    setFormData({
      ho_ten: '',
      so_dien_thoai: '',
      email: '',
      loai_dich_vu_quan_tam: '',
      ngay_mong_muon: '',
      gio_mong_muon: '',
      ghi_chu: ''
    });
    setError('');
    setSuccess(false);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServices([]);
    setFormData({
      ho_ten: '',
      so_dien_thoai: '',
      email: '',
      loai_dich_vu_quan_tam: '',
      ngay_mong_muon: '',
      gio_mong_muon: '',
      ghi_chu: ''
    });
    setError('');
    setSuccess(false);
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prevSelected) => {
      const exists = prevSelected.find((item) => item.id === service.id);
      let updated;
      if (exists) {
        updated = prevSelected.filter((item) => item.id !== service.id);
      } else {
        updated = [...prevSelected, service];
      }
      const serviceNames = updated.map((item) => item.ten_dich_vu).join(', ');
      setFormData((prev) => ({
        ...prev,
        loai_dich_vu_quan_tam: serviceNames
      }));
      return updated;
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields (email không bắt buộc)
      if (!formData.ho_ten || !formData.so_dien_thoai || !formData.ngay_mong_muon || !formData.gio_mong_muon) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      // Validate email chỉ khi có nhập
      if (formData.email && formData.email.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          setError('Email không hợp lệ');
          setLoading(false);
          return;
        }
      }

      // Validate phone (Vietnamese format)
      const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
      const cleanPhone = formData.so_dien_thoai.replace(/\s/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        setError('Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)');
        setLoading(false);
        return;
      }

      // Validate date is not in the past
      const appointmentDateTime = new Date(`${formData.ngay_mong_muon}T${formData.gio_mong_muon}`);
      const now = new Date();
      if (appointmentDateTime < now) {
        setError('Ngày và giờ hẹn không được ở quá khứ');
        setLoading(false);
        return;
      }

      const response = await lichHenTuVanAPI.create({
        ...formData,
        so_dien_thoai: cleanPhone
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          closeBookingModal();
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    closeMobileMenu();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
              <Link to="/" className="flex items-center space-x-2 sm:space-x-3 md:space-x-4" onClick={scrollToTop}>
                <img
                  src={logoImage}
                  alt="Xuân Hoa Logo"
                  className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
                  loading="eager"
                  decoding="async"
                />
                <div>
                  <div className="font-serif font-bold text-lg sm:text-xl md:text-2xl" style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}>
                    Xuân Hoa
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wider" style={{ color: '#8A8A8A' }}>
                    LUXURY SENIOR LIVING
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 2xl:space-x-12">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={scrollToTop}
                    className="nav-link-luxury relative font-semibold transition-colors duration-300 text-sm lg:text-base"
                    style={{
                      color: active ? '#A90046' : '#2D2D2D',
                      letterSpacing: '0.05em',
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '600'
                    }}
                  >
                    {link.label}
                    <span 
                      className="nav-link-underline absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300"
                      style={{ 
                        background: '#C9A870',
                        bottom: '-8px',
                        width: active ? '100%' : '0%'
                      }}
                    ></span>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={openBookingModal}
              className="hidden lg:block px-4 py-2 xl:px-6 xl:py-2.5 2xl:px-8 2xl:py-3 rounded-full text-xs xl:text-sm font-serif font-bold text-white transition-all duration-400 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                fontWeight: '700',
                fontFamily: "'Playfair Display', serif"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(139, 10, 61, 0.4)';
                // Hiệu ứng màu bạc chạy qua
                const shine = e.currentTarget.querySelector('.btn-shine');
                if (shine) {
                  shine.style.left = '100%';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                const shine = e.currentTarget.querySelector('.btn-shine');
                if (shine) {
                  shine.style.left = '-100%';
                }
              }}
            >
              <span className="relative z-10">Đặt lịch tư vấn</span>
              <span 
                className="btn-shine absolute top-0 left-[-100%] w-full h-full transition-all duration-600"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.6s ease'
                }}
              ></span>
            </button>

            {/* Mobile Menu Button */}
            <div className="lg:hidden ml-2 sm:ml-4">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-primary focus:outline-none transition-colors duration-200"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={scrollToTop}
                    className={`text-base font-bold transition-colors duration-200 px-4 py-2 ${
                      isActive(link.path)
                        ? 'text-primary-rose'
                        : 'text-gray-700 hover:text-primary-rose'
                    }`}
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: '700'
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={openBookingModal}
                  className="mx-4 px-8 py-3 rounded-full text-sm font-serif font-bold text-white transition-all duration-400 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}
                  onMouseEnter={(e) => {
                    const shine = e.currentTarget.querySelector('.btn-shine');
                    if (shine) {
                      shine.style.left = '100%';
                    }
                  }}
                  onMouseLeave={(e) => {
                    const shine = e.currentTarget.querySelector('.btn-shine');
                    if (shine) {
                      shine.style.left = '-100%';
                    }
                  }}
                >
                  <span className="relative z-10">Đặt lịch tư vấn</span>
                  <span 
                    className="btn-shine absolute top-0 left-[-100%] w-full h-full transition-all duration-600"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.6s ease'
                    }}
                  ></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {isContactModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeContactModal}
          />
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-burgundy via-primary-rose to-primary-burgundy" />
            <div className="p-6 md:p-8 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary-rose uppercase tracking-wider" style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                    Thông tin liên lạc
                  </p>
                  <h3 className="text-3xl font-bold leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                    Kết nối cùng XUÂN HOA
                  </h3>
                  <p className="text-base font-medium" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}>
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeContactModal}
                  className="text-gray-500 hover:text-primary-rose transition-colors duration-200"
                  aria-label="Đóng"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:0123456789"
                  className="flex items-start gap-3 p-4 rounded-xl border hover:shadow-md transition-all duration-200"
                  style={{ borderColor: 'rgba(169, 0, 70, 0.1)', backgroundColor: 'rgba(169, 0, 70, 0.05)' }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-md"
                        style={{ background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)' }}>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Hotline
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      0123 456 789
                    </p>
                    <p className="text-base font-medium" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}>
                      Gọi ngay để được tư vấn trực tiếp
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@xuanhoa.com"
                  className="flex items-start gap-3 p-4 rounded-xl border hover:shadow-md transition-all duration-200"
                  style={{ borderColor: 'rgba(169, 0, 70, 0.1)' }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg shadow-inner"
                        style={{ backgroundColor: 'rgba(169, 0, 70, 0.1)', color: '#A90046' }}>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Email
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      info@xuanhoa.com
                    </p>
                    <p className="text-base font-medium" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}>
                      Gửi cho chúng tôi yêu cầu hoặc câu hỏi của bạn
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-4 rounded-xl border hover:shadow-md transition-all duration-200"
                     style={{ borderColor: 'rgba(169, 0, 70, 0.1)' }}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg shadow-inner"
                        style={{ backgroundColor: 'rgba(169, 0, 70, 0.1)', color: '#A90046' }}>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
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
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Địa chỉ
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      123 Đường ABC, Quận XYZ, TP.HCM
                    </p>
                    <p className="text-base font-medium" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}>
                      Đến trực tiếp hoặc đặt lịch tham quan
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/lien-he"
                  onClick={() => {
                    closeContactModal();
                    scrollToTop();
                  }}
                  className="flex-1 text-center px-5 py-3 text-white rounded-full font-bold text-base shadow-md transition-all duration-400"
                  style={{
                    background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                    fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                    fontWeight: '700'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 10, 61, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Xem trang liên hệ
                </Link>
                <button
                  type="button"
                  onClick={closeContactModal}
                  className="px-5 py-3 border rounded-xl font-bold text-base transition-colors duration-200"
                  style={{
                    borderColor: '#E0E0E0',
                    color: '#2D2D2D',
                    fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                    fontWeight: '700'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#A90046';
                    e.currentTarget.style.color = '#A90046';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E0E0E0';
                    e.currentTarget.style.color = '#2D2D2D';
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeBookingModal}
          />
          <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-primary/10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="h-1 bg-gradient-to-r from-primary-burgundy via-primary-rose to-primary-burgundy" />
            
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-200 flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary-rose uppercase tracking-wider" style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                  Đặt lịch tư vấn
                </p>
                <h3 className="text-3xl font-bold leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                  Chọn dịch vụ và điền thông tin
                </h3>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                className="text-gray-500 hover:text-primary-rose transition-colors duration-200"
                aria-label="Đóng"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content - 2 columns */}
            <div className="flex-1 overflow-y-auto">
              {success ? (
                <div className="text-center py-12 px-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                    Đặt lịch thành công!
                  </h3>
                  <p className="text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                    Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Service List */}
                  <div className="p-6 md:p-8 border-r border-gray-200 bg-gray-50">
                    <h4 className="text-xl font-bold mb-4" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Chọn dịch vụ quan tâm
                    </h4>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {dichVus.length === 0 ? (
                        <div className="text-center py-8">
                          <p style={{ color: '#8A8A8A' }}>Đang tải danh sách dịch vụ...</p>
                        </div>
                      ) : (
                        dichVus.map((service) => {
                          const isSelected = selectedServices.some((item) => item.id === service.id);
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => handleServiceToggle(service)}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-primary-rose bg-white shadow-md'
                                  : 'border-gray-200 bg-white hover:border-primary-rose/50 hover:shadow-sm'
                              }`}
                            >
                              <div
                                className="font-bold text-lg mb-1"
                                style={{
                                  color: isSelected ? '#A90046' : '#2D2D2D',
                                  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                                  fontWeight: '700'
                                }}
                              >
                                {service.ten_dich_vu}
                              </div>
                              {service.mo_ta && (
                                <p className="text-sm text-justify" style={{ color: '#8A8A8A', textAlign: 'justify' }}>
                                  {service.mo_ta.length > 100 ? `${service.mo_ta.substring(0, 100)}...` : service.mo_ta}
                                </p>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right: Booking Form */}
                  <div className="p-6 md:p-8">
                    <h4 className="text-xl font-bold mb-4" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Thông tin liên hệ
                    </h4>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      {/* Selected Service Display */}
                      {selectedServices.length > 0 && (
                        <div className="p-4 rounded-xl border-2 border-primary-rose/30 bg-primary-rose/5">
                          <p className="text-sm font-semibold mb-1" style={{ color: '#8A8A8A' }}>
                            Dịch vụ đã chọn:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map((service) => (
                              <span
                                key={service.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                  backgroundColor: 'rgba(169, 0, 70, 0.08)',
                                  color: '#A90046',
                                  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                                  fontWeight: '700'
                                }}
                              >
                                {service.ten_dich_vu}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Họ tên */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="ho_ten"
                          value={formData.ho_ten}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          placeholder="Nhập họ và tên"
                        />
                      </div>

                      {/* Số điện thoại */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="so_dien_thoai"
                          value={formData.so_dien_thoai}
                          onChange={handleFormChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          placeholder="0912345678 hoặc +84912345678"
                        />
                      </div>

                      {/* Email (tùy chọn) */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                          Email (tùy chọn)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          placeholder="example@email.com"
                        />
                      </div>

                      {/* Ngày và giờ */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                            Ngày mong muốn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="ngay_mong_muon"
                            value={formData.ngay_mong_muon}
                            onChange={handleFormChange}
                            min={getTomorrowDate()}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                            Giờ mong muốn <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            name="gio_mong_muon"
                            value={formData.gio_mong_muon}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Ghi chú */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                          Ghi chú (tùy chọn)
                        </label>
                        <textarea
                          name="ghi_chu"
                          value={formData.ghi_chu}
                          onChange={handleFormChange}
                          rows={4}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent resize-none"
                          placeholder="Nhập thông tin bổ sung (nếu có)..."
                        />
                      </div>

                      {/* Error message */}
                      {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={closeBookingModal}
                          className="flex-1 px-5 py-3 border rounded-xl font-bold text-base transition-colors duration-200"
                          style={{
                            borderColor: '#E0E0E0',
                            color: '#2D2D2D',
                            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                            fontWeight: '700'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#A90046';
                            e.currentTarget.style.color = '#A90046';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#E0E0E0';
                            e.currentTarget.style.color = '#2D2D2D';
                          }}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 text-center px-5 py-3 text-white rounded-xl font-bold text-base shadow-md transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                            fontWeight: '700'
                          }}
                          onMouseEnter={(e) => {
                            if (!loading) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 10px 30px rgba(139, 10, 61, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {loading ? 'Đang xử lý...' : 'Đặt lịch'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
