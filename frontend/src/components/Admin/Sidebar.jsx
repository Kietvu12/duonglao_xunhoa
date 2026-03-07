import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { filterMenuItemsByRole } from '../../utils/permissions';

const menuItems = [
  { path: '/admin', icon: 'dashboard', label: 'Dashboard' },
  { path: '/admin/benh-nhan', icon: 'groups', label: 'Bệnh nhân' },
  { path: '/admin/nhan-vien', icon: 'badge', label: 'Nhân viên' },
  { path: '/admin/lich-kham', icon: 'calendar_month', label: 'Lịch thăm' },
  { path: '/admin/lich-hen-tu-van', icon: 'phone', label: 'Lịch hẹn tư vấn' },
  { path: '/admin/quan-ly-phong', icon: 'home', label: 'Quản lý Phòng' },
  { path: '/admin/dich-vu', icon: 'local_hospital', label: 'Quản lý Dịch vụ' },
  { path: '/admin/su-kien', icon: 'celebration', label: 'Sự kiện' },
  { path: '/admin/bai-viet', icon: 'article', label: 'Bài viết' },
  { path: '/admin/tuyen-dung', icon: 'work', label: 'Tuyển dụng' },
  { path: '/admin/thuoc', icon: 'medication', label: 'Thuốc' },
  { path: '/admin/cong-viec', icon: 'task', label: 'Công việc' },
  { path: '/admin/kpi', icon: 'bar_chart', label: 'KPI Nhân viên' },
  { path: '/admin/media-ca-nhan', icon: 'chat', label: 'Media cá nhân' },
];

const bottomMenuItems = [
  { path: '/admin/tai-khoan', icon: 'person', label: 'Tài khoản' },
  { path: '/admin/danh-sach-trieu-chung', icon: 'sick', label: 'Danh sách Triệu chứng' },
  { path: '/admin/cau-hinh', icon: 'tune', label: 'Cấu hình' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Lọc menu items dựa trên quyền của user
  const userRole = user?.vai_tro;
  const allowedMenuItems = filterMenuItemsByRole(menuItems, userRole);
  const allowedBottomMenuItems = filterMenuItemsByRole(bottomMenuItems, userRole);

  return (
    <aside
      className={`flex flex-col w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen shadow-sm z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Logo/Branding */}
      <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 h-16 bg-white">
        <div className="flex items-center gap-3">
          <div className="text-[#4A90E2] size-8 flex items-center justify-center">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-gray-800 text-lg font-bold leading-tight">Quản lý Viện DL</h2>
        </div>
        {/* Close button cho mobile/tablet */}
        <button
          onClick={onClose}
          className="lg:hidden flex items-center justify-center rounded-lg h-8 w-8 text-gray-600 hover:bg-gray-100 transition-colors"
          title="Đóng menu"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col justify-between flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col gap-1">
          {allowedMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#4A90E2] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {item.icon}
                </span>
                <p className={`text-sm leading-normal ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>

        {/* Bottom Menu Items */}
        <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-gray-200">
          {allowedBottomMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#4A90E2] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {item.icon}
                </span>
                <p className={`text-sm leading-normal ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

