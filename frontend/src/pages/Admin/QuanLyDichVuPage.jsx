import { useState } from 'react';
import DichVuPage from './DichVuPage';
import LoaiDichVuPage from './LoaiDichVuPage';
import BaiVietDichVuPage from './BaiVietDichVuPage';

export default function QuanLyDichVuPage() {
  const [activeTab, setActiveTab] = useState('dich-vu');

  const tabs = [
    { id: 'dich-vu', label: 'Dịch vụ', icon: 'local_hospital' },
    { id: 'loai-dich-vu', label: 'Loại dịch vụ', icon: 'category' },
    { id: 'bai-viet-dich-vu', label: 'Bài viết dịch vụ', icon: 'description' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dich-vu':
        return <DichVuPage />;
      case 'loai-dich-vu':
        return <LoaiDichVuPage />;
      case 'bai-viet-dich-vu':
        return <BaiVietDichVuPage />;
      default:
        return <DichVuPage />;
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

