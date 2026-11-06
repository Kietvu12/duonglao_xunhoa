import { useState } from 'react';
import zaloIcon from '../assets/zalo.svg';
import messengerIcon from '../assets/messenger.svg';
import { CONTACT, SOCIAL } from '../config/siteInfo';

const MESSENGER_LINK = SOCIAL.messenger;
const ZALO_LINK = SOCIAL.zalo;

const ContactFloatingButtons = () => {
  const [hovered, setHovered] = useState(null);

  const buttonBase =
    'group relative w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center p-0 border-0 overflow-hidden';

  const iconSize = 'w-7 h-7 md:w-8 md:h-8';

  return (
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-6 z-50 flex flex-col gap-3">
      {/* Điện thoại - gọi thẳng hotline chính thức */}
      <a
        href={CONTACT.hotline.tel}
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
        aria-label={`Gọi hotline ${CONTACT.hotline.display}`}
        title={`Hotline ${CONTACT.hotline.display}`}
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
      </a>

      {/* Zalo */}
      <a
        href={ZALO_LINK}
        target="_blank"
        rel="noopener noreferrer"
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
        aria-label={`Nhắn tin Zalo ${CONTACT.hotline.display}`}
        title={`Zalo ${CONTACT.hotline.display}`}
      >
        <img src={zaloIcon} alt="" aria-hidden="true" className={iconSize} />
      </a>

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
        <img src={messengerIcon} alt="" aria-hidden="true" className={iconSize} />
      </a>
    </div>
  );
};

export default ContactFloatingButtons;
