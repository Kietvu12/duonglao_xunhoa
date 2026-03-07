import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.da_doc) {
      markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getLoaiIcon = (loai) => {
    switch (loai) {
      case 'canh_bao':
        return 'warning';
      case 'cong_viec':
        return 'work';
      case 'su_kien':
        return 'event';
      case 'tin_nhan':
        return 'message';
      case 'he_thong':
        return 'info';
      default:
        return 'notifications';
    }
  };

  const getLoaiColor = (loai) => {
    switch (loai) {
      case 'canh_bao':
        return 'text-red-600 bg-red-50';
      case 'cong_viec':
        return 'text-blue-600 bg-blue-50';
      case 'su_kien':
        return 'text-purple-600 bg-purple-50';
      case 'tin_nhan':
        return 'text-green-600 bg-green-50';
      case 'he_thong':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-full size-10 hover:bg-gray-100 text-gray-600 transition-colors"
        title="Thông báo"
      >
        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
          notifications
        </span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 sm:w-[500px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Thông báo</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  notifications_none
                </span>
                <p>Không có thông báo</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => {
                  const isExpanded = expandedIds.has(notification.id);
                  const hasLongContent = notification.noi_dung && notification.noi_dung.length > 150;
                  
                  return (
                    <div
                      key={notification.id}
                      className={`transition-colors ${
                        !notification.da_doc ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'bg-white'
                      }`}
                    >
                      <div
                        onClick={() => handleNotificationClick(notification)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getLoaiColor(notification.loai)}`}>
                            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                              {getLoaiIcon(notification.loai)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`text-base font-semibold flex-1 ${!notification.da_doc ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.tieu_de}
                              </h4>
                              {!notification.da_doc && (
                                <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 animate-pulse"></span>
                              )}
                            </div>
                            {/* Hiển thị thông tin bệnh nhân nếu có */}
                            {notification.id_benh_nhan && notification.benh_nhan_ho_ten && (
                              <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <span className="material-symbols-outlined text-blue-600 text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                    person
                                  </span>
                                  <span className="text-sm font-medium text-blue-900">
                                    Bệnh nhân: {notification.benh_nhan_ho_ten}
                                  </span>
                                </div>
                              </div>
                            )}
                            {notification.noi_dung && (
                              <div className="mt-2">
                                <p className={`text-sm text-gray-700 leading-relaxed ${
                                  isExpanded ? '' : 'line-clamp-3'
                                }`}>
                                  {/* Highlight tên bệnh nhân nếu có trong nội dung */}
                                  {notification.noi_dung.includes('Bệnh nhân "') ? (
                                    notification.noi_dung.split(/(Bệnh nhân "[^"]+")/).map((part, idx) => {
                                      if (part.match(/^Bệnh nhân "[^"]+"$/)) {
                                        return (
                                          <span key={idx} className="font-semibold text-blue-700">
                                            {part}
                                          </span>
                                        );
                                      }
                                      return <span key={idx}>{part}</span>;
                                    })
                                  ) : (
                                    notification.noi_dung
                                  )}
                                </p>
                                {hasLongContent && (
                                  <button
                                    onClick={(e) => toggleExpand(notification.id, e)}
                                    className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                          expand_less
                                        </span>
                                        Thu gọn
                                      </>
                                    ) : (
                                      <>
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                          expand_more
                                        </span>
                                        Xem thêm
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                  schedule
                                </span>
                                {formatTime(notification.ngay_tao)}
                              </p>
                              {notification.link && (
                                <span className="text-xs text-blue-600 flex items-center gap-1">
                                  Xem chi tiết
                                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                                    arrow_forward
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                            title="Xóa thông báo"
                          >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                              close
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

