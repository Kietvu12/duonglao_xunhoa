import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 bg-white h-16 fixed top-0 right-0 left-0 lg:left-64 z-10">
      {/* Left Section: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Hamburger Menu Button - chỉ hiện trên mobile/tablet */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center rounded-lg h-10 w-10 text-gray-600 hover:bg-gray-100 transition-colors"
          title="Mở menu"
        >
          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>menu</span>
        </button>

        {/* Search Bar - ẩn trên mobile nhỏ, hiện trên tablet+ */}
        <div className="hidden sm:flex flex-1 max-w-sm">
          
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications - ẩn trên mobile nhỏ */}
        <div className="hidden sm:block">
          <NotificationBell />
        </div>

        {/* User Profile - ẩn tên trên mobile nhỏ */}
        <div className="flex gap-2 sm:gap-3 items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 bg-[#4A90E2] flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
            {user?.ho_ten?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden md:flex flex-col text-sm">
            <h1 className="font-semibold text-gray-800">{user?.ho_ten || 'Admin'}</h1>
            <p className="text-gray-500 text-xs capitalize">{user?.vai_tro?.replace('_', ' ') || 'Administrator'}</p>
          </div>
        </div>

        {/* Logout Button - chỉ icon trên mobile */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center rounded-lg px-2 sm:px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          title="Đăng xuất"
        >
          <span className="material-symbols-outlined text-xl sm:mr-1" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>logout</span>
          <span className="hidden md:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}

