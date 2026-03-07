import { useState } from 'react';
import QuanLyPhongPage from './QuanLyPhongPage';
import LoaiPhongPage from './LoaiPhongPage';
import BaiVietPhongPage from './BaiVietPhongPage';

export default function QuanLyPhongPageNew() {
  const [activeTab, setActiveTab] = useState('quan-ly-phong');

  const tabs = [
    { id: 'quan-ly-phong', label: 'Quản lý Phòng', icon: 'bed' },
    { id: 'loai-phong', label: 'Loại phòng', icon: 'category' },
    { id: 'bai-viet-phong', label: 'Bài viết phòng', icon: 'description' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'quan-ly-phong':
        return <QuanLyPhongPage />;
      case 'loai-phong':
        return <LoaiPhongPage />;
      case 'bai-viet-phong':
        return <BaiVietPhongPage />;
      default:
        return <QuanLyPhongPage />;
    }
  };

  return (
    <div className="font-raleway bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#4A90E2] text-[#4A90E2]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {renderContent()}
      </div>
    </div>
  );
}

