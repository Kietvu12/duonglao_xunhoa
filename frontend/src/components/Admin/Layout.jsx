import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatbotButton from './ChatbotButton';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Thêm class vào body khi ở admin route và xóa khi unmount
  useEffect(() => {
    document.body.classList.add('admin-route');
    return () => {
      document.body.classList.remove('admin-route');
    };
  }, []);

  // Đóng sidebar khi resize về desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Overlay cho mobile/tablet */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <div className="flex-1 lg:ml-64 flex flex-col overflow-hidden transition-all duration-300">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto pt-16">
          <Outlet />
        </main>
      </div>
      
      {/* Chatbot Button - Draggable */}
      <ChatbotButton />
    </div>
  );
}

