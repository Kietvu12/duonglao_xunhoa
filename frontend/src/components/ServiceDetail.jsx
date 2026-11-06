import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { baiVietDichVuAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import { buildCategoryPath, buildServicePath, getServiceLabel } from '../utils/dichVuUtils';
import BookingModal from './BookingModal';

const pickDefaultPaymentType = (dv) => {
  // Ưu tiên chọn mức giá có sẵn: ngày → tháng → quý → năm
  if (dv?.gia_ngay) return 'ngay';
  if (dv?.gia_thang) return 'thang';
  if (dv?.gia_quy) return 'quy';
  if (dv?.gia_nam) return 'nam';
  return 'thang';
};

const ServiceDetail = ({ service, category }) => {
  const selectedService = service;
  const [baiViet, setBaiViet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState(() => pickDefaultPaymentType(service));
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSelectedPaymentType(pickDefaultPaymentType(service));
    setBaiViet(null);

    const loadBaiViet = async () => {
      try {
        setLoading(true);
        // Load bài viết dịch vụ có trạng thái xuất bản
        const response = await baiVietDichVuAPI.getAll({
          id_dich_vu: service.id,
          trang_thai: 'xuat_ban',
          limit: 1
        });

        if (response && response.success && response.data && response.data.length > 0) {
          const baiVietDetail = await baiVietDichVuAPI.getById(response.data[0].id);
          if (!cancelled && baiVietDetail && baiVietDetail.success) {
            setBaiViet(baiVietDetail.data);
          }
        }
      } catch (error) {
        console.error('Error loading bai viet:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadBaiViet();
    return () => {
      cancelled = true;
    };
  }, [service]);

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const getDisplayPrice = () => {
    switch (selectedPaymentType) {
      case 'ngay':
        return formatPrice(selectedService.gia_ngay);
      case 'thang':
        return formatPrice(selectedService.gia_thang);
      case 'quy':
        return formatPrice(selectedService.gia_quy);
      case 'nam':
        return formatPrice(selectedService.gia_nam);
      default:
        return formatPrice(selectedService.gia_thang);
    }
  };

  const getPaymentLabel = () => {
    switch (selectedPaymentType) {
      case 'ngay':
        return 'Thanh toán theo ngày';
      case 'thang':
        return 'Thanh toán theo tháng';
      case 'quy':
        return 'Thanh toán theo quý';
      case 'nam':
        return 'Thanh toán theo năm';
      default:
        return 'Thanh toán theo tháng';
    }
  };

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
            <Link to="/dich-vu" className="text-gray-600 hover:text-primary" style={{ textDecoration: 'none' }}>
              Dịch vụ
            </Link>
            {category?.ten && (
              <>
                <span className="mx-2">/</span>
                <Link to={buildCategoryPath(category)} className="text-gray-800 hover:text-primary" style={{ textDecoration: 'none' }}>
                  {category.ten}
                </Link>
              </>
            )}
            {selectedService.ten_dich_vu && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800">{selectedService.ten_dich_vu}</span>
              </>
            )}
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Các gói cùng loại */}
            {category?.dichVus?.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-4">
                  Các gói trong “{category.ten}”
                </h2>
                <ul className="space-y-2">
                  {category.dichVus.map((dichVu) => (
                    <li key={dichVu.id}>
                      <Link
                        to={buildServicePath(category, dichVu)}
                        aria-current={selectedService.id === dichVu.id ? 'page' : undefined}
                        className={`block text-sm md:text-base font-raleway-regular p-2 rounded transition-colors ${
                          selectedService.id === dichVu.id
                            ? 'bg-[#FFF9FB] text-gray-800 font-semibold'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {dichVu.ten_dich_vu}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing Box */}
            <div className="border-2 border-primary rounded-lg p-6 space-y-4">
              {/* Tiêu đề bảng giá */}
              <h2 className="w-full py-2 bg-gray-100 text-gray-800 font-raleway-bold text-sm rounded text-center tracking-wider">
                BẢNG GIÁ
              </h2>

              {/* Price */}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-raleway-bold text-gray-800 mb-2">
                  {getDisplayPrice()}
                </div>
                <div className="text-sm text-gray-600 font-raleway-regular">
                  {getPaymentLabel()}
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                {selectedService.gia_ngay && (
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        value="ngay"
                        checked={selectedPaymentType === 'ngay'}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm md:text-base font-raleway-regular text-gray-800">
                        Theo ngày
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-raleway-bold text-gray-800">
                      {formatPrice(selectedService.gia_ngay)}
                    </span>
                  </label>
                )}

                {selectedService.gia_thang && (
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        value="thang"
                        checked={selectedPaymentType === 'thang'}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm md:text-base font-raleway-regular text-gray-800">
                        Theo tháng
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-raleway-bold text-gray-800">
                      {formatPrice(selectedService.gia_thang)}
                    </span>
                  </label>
                )}
                
                {selectedService.gia_quy && (
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        value="quy"
                        checked={selectedPaymentType === 'quy'}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm md:text-base font-raleway-regular text-gray-800">
                        Theo quý
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-raleway-bold text-gray-800">
                      {formatPrice(selectedService.gia_quy)}
                    </span>
                  </label>
                )}

                {selectedService.gia_nam && (
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        value="nam"
                        checked={selectedPaymentType === 'nam'}
                        onChange={(e) => setSelectedPaymentType(e.target.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm md:text-base font-raleway-regular text-gray-800">
                        Theo năm
                      </span>
                    </div>
                    <span className="text-sm md:text-base font-raleway-bold text-gray-800">
                      {formatPrice(selectedService.gia_nam)}
                    </span>
                  </label>
                )}
              </div>

              {/* Book Button */}
              <button 
                onClick={() => setShowBookingModal(true)}
                className="w-full py-3 bg-gray-900 text-white font-raleway-bold text-sm md:text-base rounded hover:bg-gray-800 transition-colors"
              >
                ĐẶT LỊCH THAM QUAN – TƯ VẤN GÓI NÀY
              </button>

              <p className="text-xs text-gray-500 text-center">
                Đặt lịch tham quan miễn phí – không cần thanh toán trước.
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-12 text-gray-600">Đang tải bài viết...</div>
            ) : baiViet ? (
              <>
                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
                  {baiViet.tieu_de || selectedService.ten_dich_vu}
                </h1>

                {/* Short Description */}
                {baiViet.mo_ta_ngan && (
                  <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
                    {baiViet.mo_ta_ngan}
                  </p>
                )}

                {/* Content */}
                {baiViet.noi_dung && (
                  <div 
                    className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: baiViet.noi_dung }}
                  />
                )}

                {/* Ảnh đại diện */}
                {baiViet.anh_dai_dien && (
                  <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
                    <img
                      src={normalizeImageUrl(baiViet.anh_dai_dien)}
                      alt={baiViet.tieu_de}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Fallback nếu không có bài viết */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 leading-tight">
                  {selectedService.ten_dich_vu}
                </h1>
                
                {selectedService.mo_ta_ngan && (
                  <p className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
                    {selectedService.mo_ta_ngan}
                  </p>
                )}

                {selectedService.mo_ta_day_du && (
                  <div className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
                    <p>{selectedService.mo_ta_day_du}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        serviceName={getServiceLabel(selectedService, category?.ten)}
      />
    </section>
  );
};

export default ServiceDetail;
