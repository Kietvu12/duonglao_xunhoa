import { useState } from 'react';
import SuKienPage from './SuKienPage';
import BaiVietSuKienPage from './BaiVietSuKienPage';

export default function QuanLySuKienPage() {
  const [activeTab, setActiveTab] = useState('su-kien');

  const tabs = [
    { id: 'su-kien', label: 'Quản lý sự kiện', icon: 'celebration' },
    { id: 'bai-viet-su-kien', label: 'Bài viết sự kiện', icon: 'description' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'su-kien':
        return <SuKienPage />;
      case 'bai-viet-su-kien':
        return <BaiVietSuKienPage />;
      default:
        return <SuKienPage />;
    }
  };

  return (
    <div className="font-raleway bg-gray-50 min-h-screen">
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

      <div>{renderContent()}</div>
    </div>
  );
}
