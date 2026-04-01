import { useState, useEffect } from 'react';
import zaloIcon from '../assets/zalo.svg';
import messengerIcon from '../assets/messenger.svg';

const HOTLINES = ['0961799188', '0961799588'];
const MESSENGER_LINK = 'https://m.me/trungtamtruongthoxuanhoahalong';

const ContactFloatingButtons = () => {
  const [hovered, setHovered] = useState(null);
  const [phonePopupOpen, setPhonePopupOpen] = useState(false);
  const [zaloToastOpen, setZaloToastOpen] = useState(false);

  useEffect(() => {
    if (!zaloToastOpen) return;
    const t = setTimeout(() => setZaloToastOpen(false), 2500);
    return () => clearTimeout(t);
  }, [zaloToastOpen]);

  const buttonBase =
    'w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center p-0 border-0 overflow-hidden';

  const iconSize = 'w-7 h-7 md:w-8 md:h-8';

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-6 z-50 flex flex-col gap-3">
      {/* Điện thoại - Mở popup 2 số hotline */}
      <button
        type="button"
        onClick={() => setPhonePopupOpen(true)}
        className={`${buttonBase} text-white`}
        style={{
          background:
            hovered === 'phone'
              ? 'linear-gradient(135deg, #6B0820 0%, #8B0A3D 100%)'
              : 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
          boxShadow:
            hovered === 'phone'
              ? '0 12px 24px rgba(139, 10, 61, 0.4)'
              : '0 8px 16px rgba(139, 10, 61, 0.25)',
          transform: hovered === 'phone' ? 'scale(1.08)' : 'scale(1)',
        }}
        onMouseEnter={() => setHovered('phone')}
        onMouseLeave={() => setHovered(null)}
        aria-label="Hotline"
        title="Hotline"
      >
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </button>

      {/* Popup 2 số hotline */}
      {phonePopupOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={() => setPhonePopupOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed right-4 bottom-24 md:right-6 md:bottom-32 z-[61] w-64 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
            style={{ fontFamily: "'Cormorant Garamond', 'Times New Roman', serif" }}
          >
            <div
              className="px-4 py-3 border-b border-gray-100"
              style={{
                background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                color: 'white',
                fontWeight: '700',
                fontSize: '1rem',
              }}
            >
              Chọn số hotline
            </div>
            <div className="p-3 space-y-2">
              {HOTLINES.map((number) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors hover:bg-rose-50"
                  style={{ color: '#2D2D2D', fontWeight: '600' }}
                >
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #8B0A3D 0%, #A90046 100%)',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span>{number}</span>
                </a>
              ))}
            </div>
            <div className="p-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPhonePopupOpen(false)}
                className="w-full py-2 text-sm font-semibold rounded-lg transition-colors hover:bg-gray-100"
                style={{ color: '#6b7280' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </>
      )}

      {/* Zalo - Thông báo sẽ cập nhật sau */}
      <button
        type="button"
        onClick={() => setZaloToastOpen(true)}
        className={buttonBase}
        style={{
          background:
            hovered === 'zalo'
              ? 'linear-gradient(135deg, #0052cc 0%, #0068FF 100%)'
              : 'linear-gradient(135deg, #0068FF 0%, #0080ff 100%)',
          boxShadow:
            hovered === 'zalo'
              ? '0 12px 24px rgba(0, 104, 255, 0.4)'
              : '0 8px 16px rgba(0, 104, 255, 0.3)',
          transform: hovered === 'zalo' ? 'scale(1.08)' : 'scale(1)',
        }}
        onMouseEnter={() => setHovered('zalo')}
        onMouseLeave={() => setHovered(null)}
        aria-label="Zalo"
        title="Zalo"
      >
        <img src={zaloIcon} alt="Zalo" className={iconSize} />
      </button>

      {/* Toast Zalo "sẽ cập nhật sau" */}
      {zaloToastOpen && (
        <div
          className="fixed right-4 bottom-24 md:right-6 md:bottom-32 z-[61] px-4 py-3 rounded-xl bg-white shadow-lg border border-gray-200 text-sm font-semibold animate-in fade-in duration-200"
          style={{ color: '#2D2D2D', maxWidth: '240px' }}
        >
          Sẽ cập nhật sau.
        </div>
      )}

      {/* Messenger */}
      <a
        href={MESSENGER_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonBase}
        style={{
          background:
            hovered === 'messenger'
              ? 'linear-gradient(135deg, #0066cc 0%, #0084ff 100%)'
              : 'linear-gradient(135deg, #00B2FF 0%, #006AFF 100%)',
          boxShadow:
            hovered === 'messenger'
              ? '0 12px 24px rgba(0, 132, 255, 0.4)'
              : '0 8px 16px rgba(0, 132, 255, 0.3)',
          transform: hovered === 'messenger' ? 'scale(1.08)' : 'scale(1)',
        }}
        onMouseEnter={() => setHovered('messenger')}
        onMouseLeave={() => setHovered(null)}
        aria-label="Nhắn tin qua Messenger"
        title="Messenger"
      >
        <img src={messengerIcon} alt="Messenger" className={iconSize} />
      </a>
    </div>
  );
};

export default ContactFloatingButtons;
