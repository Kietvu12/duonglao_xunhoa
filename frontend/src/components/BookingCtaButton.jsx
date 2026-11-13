import { useCallback } from 'react';

/**
 * Nút CTA mở form "Đặt lịch tham quan & tư vấn".
 *
 * Navbar đang lắng nghe sự kiện window `openBookingModal` và mở BookingModal,
 * nên mọi CTA (trang Về chúng tôi, footer, banner…) đều dùng chung một bước đi:
 * bấm là mở form ngay, không điều hướng sang trang khác.
 */
const BookingCtaButton = ({
  children,
  className = '',
  style,
  onClick,
  ...rest
}) => {
  const handleClick = useCallback(
    (event) => {
      if (typeof onClick === 'function') {
        onClick(event);
      }
      if (event?.defaultPrevented) return;
      window.dispatchEvent(new Event('openBookingModal'));
    },
    [onClick]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
};

export default BookingCtaButton;
