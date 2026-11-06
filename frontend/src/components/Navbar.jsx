import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../assets/logo.png';
import { dichVuAPI, lichHenTuVanAPI } from '../services/api';
import { CONTACT } from '../config/siteInfo';
import {
  UNSURE_SERVICE_LABEL,
  EMAIL_REGEX,
  PHONE_REGEX,
  getServiceLabel,
  getTomorrowLocalDate,
  joinServiceInterest,
} from '../utils/dichVuUtils';

const EMPTY_BOOKING_FORM = {
  ho_ten: '',
  so_dien_thoai: '',
  email: '',
  ngay_mong_muon: '',
  gio_mong_muon: '',
  ghi_chu: ''
};

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [dichVus, setDichVus] = useState([]);
  const [dichVuLoading, setDichVuLoading] = useState(false);
  const [dichVuLoadError, setDichVuLoadError] = useState(false);
  // Danh sách nhãn gói đã chọn (nhãn đã kèm tên loại nên không trùng nhau)
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState(EMPTY_BOOKING_FORM);
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
      if (isBookingModalOpen && dichVus.length === 0) {
        setDichVuLoading(true);
        setDichVuLoadError(false);
        try {
          const response = await dichVuAPI.getAll({ limit: -1 });
          setDichVus(response.data || []);
        } catch (error) {
          console.error('Error loading services:', error);
          setDichVuLoadError(true);
        } finally {
          setDichVuLoading(false);
        }
      }
    };
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBookingModalOpen]);

  // Set default date and time when modal opens
  useEffect(() => {
    if (isBookingModalOpen) {
      setFormData(prev => ({
        ...prev,
        ngay_mong_muon: prev.ngay_mong_muon || getTomorrowLocalDate(),
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

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  const openBookingModal = () => {
    setIsMobileMenuOpen(false);
    setIsBookingModalOpen(true);
    setSelectedServices([]);
    setFormData(EMPTY_BOOKING_FORM);
    setError('');
    setSuccess(false);
  };

  useEffect(() => {
    const handleOpenBookingModal = () => {
      setIsMobileMenuOpen(false);
      setIsBookingModalOpen(true);
      setSelectedServices([]);
      setFormData(EMPTY_BOOKING_FORM);
      setError('');
      setSuccess(false);
    };

    window.addEventListener('openBookingModal', handleOpenBookingModal);
    return () => {
      window.removeEventListener('openBookingModal', handleOpenBookingModal);
    };
  }, []);

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedServices([]);
    setFormData(EMPTY_BOOKING_FORM);
    setError('');
    setSuccess(false);
  };

  // Nhóm gói theo loại để khách phân biệt các gói trùng tên ở nhiều loại
  const serviceGroups = (() => {
    const groups = new Map();
    dichVus.forEach((service) => {
      const groupName = (service.ten_loai_dich_vu || 'Dịch vụ khác').trim();
      if (!groups.has(groupName)) groups.set(groupName, []);
      const label = getServiceLabel(service, groupName);
      // Bỏ trùng lặp tuyệt đối (cùng loại, cùng tên)
      if (!groups.get(groupName).some((item) => item.label === label)) {
        groups.get(groupName).push({ id: service.id, label, ten: (service.ten_dich_vu || '').trim(), mo_ta: service.mo_ta_ngan || service.mo_ta || '' });
      }
    });
    return Array.from(groups, ([name, items]) => ({ name, items }));
  })();

  const handleServiceToggle = (label) => {
    if (error) setError('');
    setSelectedServices((prev) => {
      if (label === UNSURE_SERVICE_LABEL) {
        // "Chưa biết gói nào" loại trừ các lựa chọn khác
        return prev.includes(label) ? [] : [label];
      }
      const withoutUnsure = prev.filter((item) => item !== UNSURE_SERVICE_LABEL);
      return withoutUnsure.includes(label)
        ? withoutUnsure.filter((item) => item !== label)
        : [...withoutUnsure, label];
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

  const getTomorrowDate = getTomorrowLocalDate;

  const formatDateWithWeekday = (dateString) => {
    if (!dateString) return '';
    const date = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';

    const weekdays = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy'
    ];
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${weekdays[date.getDay()]}, ${day}/${month}/${year}`;
  };

  const formatTimeVietnamese = (timeString) => {
    if (!timeString || !timeString.includes(':')) return '';
    const [hourRaw, minuteRaw] = timeString.split(':');
    const hour = Number(hourRaw);
    if (Number.isNaN(hour)) return '';
    const minute = String(minuteRaw ?? '00').padStart(2, '0');
    const period = hour < 12 ? 'Sáng' : 'Chiều';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${period}`;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields (email không bắt buộc)
      if (!formData.ho_ten.trim() || !formData.so_dien_thoai.trim() || !formData.ngay_mong_muon || !formData.gio_mong_muon) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        setLoading(false);
        return;
      }

      // Validate phone (Vietnamese format)
      const cleanPhone = formData.so_dien_thoai.replace(/[\s.-]/g, '');
      if (!PHONE_REGEX.test(cleanPhone)) {
        setError('Số điện thoại không hợp lệ (ví dụ: 0912345678 hoặc +84912345678)');
        setLoading(false);
        return;
      }

      const cleanEmail = formData.email.trim();
      if (cleanEmail && !EMAIL_REGEX.test(cleanEmail)) {
        setError('Email không hợp lệ');
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
        ho_ten: formData.ho_ten.trim(),
        email: cleanEmail,
        so_dien_thoai: cleanPhone,
        loai_dich_vu_quan_tam: joinServiceInterest(selectedServices)
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          closeBookingModal();
        }, 3000);
      } else {
        setError(response.message || 'Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline.');
      }
    } catch (err) {
      setError(`${err.message || 'Có lỗi xảy ra khi đặt lịch.'} Vui lòng thử lại hoặc gọi hotline ${CONTACT.hotline.display}.`);
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
              className="hidden lg:inline-flex px-4 py-2 xl:px-6 xl:py-2.5 2xl:px-8 2xl:py-3 rounded-full text-xs xl:text-sm font-serif font-bold text-white transition-all duration-400 relative overflow-hidden"
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
              <span className="relative z-10">Đặt lịch tham quan</span>
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
                  className="mx-4 px-8 py-3 rounded-full text-sm font-serif font-bold text-white transition-all duration-400 relative overflow-hidden inline-flex justify-center"
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
                  <span className="relative z-10">Đặt lịch tham quan</span>
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
                  href={CONTACT.hotline.tel}
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
                      {CONTACT.hotline.display}
                    </p>
                    <p className="text-base font-medium" style={{ color: '#8A8A8A', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}>
                      Gọi ngay để được tư vấn trực tiếp
                    </p>
                  </div>
                </a>

                <a
                  href={CONTACT.email.href}
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
                    <p className="text-xl font-bold break-all" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      {CONTACT.email.display}
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
                      {CONTACT.address.display}
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
                  Đặt lịch tham quan & tư vấn
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                  Chọn gói quan tâm và để lại thông tin
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
                  <p style={{ color: '#2D2D2D' }}>
                    Chúng tôi đã nhận yêu cầu và sẽ gọi lại để xác nhận lịch sớm nhất có thể.
                    <br />
                    Cần hỗ trợ ngay? Gọi hotline{' '}
                    <a href={CONTACT.hotline.tel} className="font-bold" style={{ color: '#A90046' }}>
                      {CONTACT.hotline.display}
                    </a>
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: Service List */}
                  <div className="p-6 md:p-8 border-r border-gray-200 bg-gray-50">
                    <h4 className="text-xl font-bold mb-1" style={{ color: '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                      Gói dịch vụ quan tâm
                    </h4>
                    <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
                      Có thể chọn nhiều gói. Chưa rõ? Chọn “{UNSURE_SERVICE_LABEL}”, chúng tôi sẽ tư vấn.
                    </p>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                      {(() => {
                        const unsureSelected = selectedServices.includes(UNSURE_SERVICE_LABEL);
                        return (
                          <button
                            type="button"
                            onClick={() => handleServiceToggle(UNSURE_SERVICE_LABEL)}
                            aria-pressed={unsureSelected}
                            className={`w-full text-left p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
                              unsureSelected
                                ? 'border-primary-rose bg-white shadow-md'
                                : 'border-gray-300 bg-white hover:border-primary-rose/50 hover:shadow-sm'
                            }`}
                          >
                            <div className="font-bold text-lg" style={{ color: unsureSelected ? '#A90046' : '#2D2D2D', fontFamily: "'Cormorant Garamond', 'Times New Roman', serif", fontWeight: '700' }}>
                              {UNSURE_SERVICE_LABEL}
                            </div>
                            <p className="text-sm" style={{ color: '#8A8A8A' }}>
                              Chuyên viên sẽ tư vấn gói phù hợp với tình trạng sức khỏe của người thân.
                            </p>
                          </button>
                        );
                      })()}

                      {dichVuLoading && (
                        <p className="text-center py-4 text-sm" style={{ color: '#8A8A8A' }}>Đang tải danh sách gói dịch vụ...</p>
                      )}
                      {dichVuLoadError && (
                        <p className="text-center py-4 text-sm" style={{ color: '#8A8A8A' }}>
                          Chưa tải được danh sách gói. Bạn vẫn có thể gửi yêu cầu, chúng tôi sẽ tư vấn qua điện thoại.
                        </p>
                      )}

                      {serviceGroups.map((group) => (
                        <div key={group.name}>
                          <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#8B0A3D' }}>
                            {group.name}
                          </p>
                          <div className="space-y-2">
                            {group.items.map((item) => {
                              const isSelected = selectedServices.includes(item.label);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => handleServiceToggle(item.label)}
                                  aria-pressed={isSelected}
                                  className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                                    isSelected
                                      ? 'border-primary-rose bg-white shadow-md'
                                      : 'border-gray-200 bg-white hover:border-primary-rose/50 hover:shadow-sm'
                                  }`}
                                >
                                  <div
                                    className="font-bold text-base"
                                    style={{
                                      color: isSelected ? '#A90046' : '#2D2D2D',
                                      fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                                      fontWeight: '700'
                                    }}
                                  >
                                    {item.ten}
                                  </div>
                                  {item.mo_ta && (
                                    <p className="text-sm line-clamp-2" style={{ color: '#8A8A8A' }}>
                                      {item.mo_ta}
                                    </p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
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
                            Gói đã chọn:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedServices.map((label) => (
                              <span
                                key={label}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                                style={{
                                  backgroundColor: 'rgba(169, 0, 70, 0.08)',
                                  color: '#A90046',
                                  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
                                  fontWeight: '700'
                                }}
                              >
                                {label}
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

                      {/* Email (không bắt buộc) */}
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                          Email (tùy chọn)
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          autoComplete="email"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          placeholder="email@example.com"
                        />
                      </div>

                      {/* Ngày và giờ */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                            Ngày tham quan <span className="text-red-500">*</span>
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
                          {formData.ngay_mong_muon && (
                            <p className="mt-2 text-sm font-semibold" style={{ color: '#4A4A4A' }}>
                              {formatDateWithWeekday(formData.ngay_mong_muon)}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                            Giờ tham quan <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            name="gio_mong_muon"
                            value={formData.gio_mong_muon}
                            onChange={handleFormChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-rose focus:border-transparent"
                          />
                          {formData.gio_mong_muon && (
                            <p className="mt-2 text-sm font-semibold" style={{ color: '#4A4A4A' }}>
                              {formatTimeVietnamese(formData.gio_mong_muon)}
                            </p>
                          )}
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

                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        Bằng việc gửi yêu cầu, bạn đồng ý để Trung tâm liên hệ tư vấn theo{' '}
                        <Link to="/chinh-sach-bao-mat" onClick={closeBookingModal} className="underline" style={{ color: '#A90046' }}>
                          Chính sách bảo mật
                        </Link>
                        .
                      </p>

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
                          {loading ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
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
