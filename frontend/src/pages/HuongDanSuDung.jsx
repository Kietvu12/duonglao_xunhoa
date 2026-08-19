import { useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead';

import nguoiNha1 from '../assets/Ảnh Người Nhà/1.1.Hướng dẫn đăng nhập lần đầu-1.png';
import nguoiNha2 from '../assets/Ảnh Người Nhà/2.1 Tổng quan trang chủ - 1.png';
import nguoiNha3 from '../assets/Ảnh Người Nhà/3. Hướng dẫn đặt lịch thăm cho bệnh nhân -1.png';
import nguoiNha4 from '../assets/Ảnh Người Nhà/4.1.Hướng dẫn theo dõi các sự kiện của viện.png';
import nguoiNha5 from '../assets/Ảnh Người Nhà/5.Hướng dẫn theo dõi và yêu cầu thay mới đồ dùng của bệnh nhân -1.png';
import nguoiNha6 from '../assets/Ảnh Người Nhà/6.Hướng dẫn xem thông tin và liên lạc với điều dưỡng -1.png';
import nguoiNha7 from '../assets/Ảnh Người Nhà/7.Hướng dẫn quản lý và chỉnh sửa tài khoản-1.png';

import dieuDuong1 from '../assets/Ảnh điều dưỡng/1.1 Hướng dẫn đăng nhập lần đầu-1.png';
import dieuDuong2 from '../assets/Ảnh điều dưỡng/2.1 Tổng quan giao diện trang chủ.png';
import dieuDuong3 from '../assets/Ảnh điều dưỡng/2.2.Hướng dẫn quét QR để xem thông tin bệnh nhân-1.png';
import dieuDuong4 from '../assets/Ảnh điều dưỡng/3.1.Hướng dẫn nhập chỉ số sức khỏe cho bệnh nhân-1.png';
import dieuDuong5 from '../assets/Ảnh điều dưỡng/3.2.Hướng dẫn thêm các triệu chứng sức khỏe cho bệnh nhân-1.png';
import dieuDuong6 from '../assets/Ảnh điều dưỡng/4.Hướng dẫn gửi tin nhắn cho người nhà bệnh nhân -1.png';
import dieuDuong7 from '../assets/Ảnh điều dưỡng/5.2.Hướng dẫn thêm lịch thăm mới cho bệnh nhân-1.png';

const tabs = [
  {
    id: 'nguoi-nha',
    label: 'App Người Nhà',
    subtitle: 'Theo dõi, đặt lịch và liên lạc với đội ngũ chăm sóc.',
    steps: [
      { title: 'Đăng nhập lần đầu', image: nguoiNha1 },
      { title: 'Tổng quan trang chủ', image: nguoiNha2 },
      { title: 'Đặt lịch thăm', image: nguoiNha3 },
      { title: 'Theo dõi sự kiện', image: nguoiNha4 },
      { title: 'Yêu cầu thay đồ dùng', image: nguoiNha5 },
      { title: 'Xem thông tin và liên lạc', image: nguoiNha6 },
      { title: 'Quản lý tài khoản', image: nguoiNha7 },
    ],
  },
  {
    id: 'dieu-duong',
    label: 'App Điều dưỡng',
    subtitle: 'Hỗ trợ chăm sóc, cập nhật dữ liệu và liên lạc nội bộ hiệu quả.',
    steps: [
      { title: 'Đăng nhập lần đầu', image: dieuDuong1 },
      { title: 'Tổng quan giao diện', image: dieuDuong2 },
      { title: 'Quét QR bệnh nhân', image: dieuDuong3 },
      { title: 'Nhập chỉ số sức khỏe', image: dieuDuong4 },
      { title: 'Thêm triệu chứng sức khỏe', image: dieuDuong5 },
      { title: 'Gửi tin nhắn cho người nhà', image: dieuDuong6 },
      { title: 'Thêm lịch thăm mới', image: dieuDuong7 },
    ],
  },
];

const HuongDanSuDung = () => {
  const [activeTab, setActiveTab] = useState('nguoi-nha');
  const activeContent = useMemo(() => tabs.find((tab) => tab.id === activeTab) || tabs[0], [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <SeoHead
        title="Hướng dẫn sử dụng"
        description="Hướng dẫn sử dụng App Người Nhà và App Điều dưỡng với hình ảnh minh họa trực quan từng bước."
        canonicalPath="/huong-dan-su-dung"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-xs md:text-sm font-semibold tracking-[0.16em] uppercase text-primary-rose">
            Hướng dẫn sử dụng
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Tài liệu thao tác cho người nhà và điều dưỡng
          </h1>
          <p className="text-base md:text-lg text-gray-600">
            Chọn tab phù hợp để xem hướng dẫn từng bước kèm hình ảnh minh họa rõ ràng.
          </p>
        </div>

        <div className="mt-10 bg-white border border-rose-100 shadow-sm rounded-3xl overflow-hidden">
          <div className="flex flex-col md:flex-row gap-3 md:gap-0 p-4 bg-rose-50/70 border-b border-rose-100">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-2xl px-5 py-4 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-white shadow-md border border-primary-rose/20'
                      : 'bg-transparent hover:bg-white/70'
                  }`}
                >
                  <div className="text-lg font-bold" style={{ color: isActive ? '#A90046' : '#1f2937' }}>
                    {tab.label}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{tab.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{activeContent.label}</h2>
                <p className="text-gray-600 mt-1">{activeContent.subtitle}</p>
              </div>
              <div className="inline-flex items-center rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-primary-rose">
                {activeContent.steps.length} mục hướng dẫn
              </div>
            </div>

            <div className="grid gap-6 md:gap-8">
              {activeContent.steps.map((step, index) => (
                <section
                  key={step.title}
                  className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center rounded-3xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5 lg:p-6"
                >
                  <div className="order-2 lg:order-1 space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-rose text-white font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2">
                    <div className="overflow-hidden rounded-2xl border border-white shadow-lg bg-white">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuongDanSuDung;
