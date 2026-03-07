import { useState, useEffect } from 'react';
import { baiVietDichVuAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';
import BookingModal from './BookingModal';

const ServiceDetail = ({ service, onBack }) => {
  const [selectedService, setSelectedService] = useState(service);
  const [baiViet, setBaiViet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState('thang');
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    setSelectedService(service);
    loadBaiViet(service.id);
  }, [service]);

  const loadBaiViet = async (idDichVu) => {
    try {
      setLoading(true);
      // Load bài viết dịch vụ có trạng thái xuất bản
      const response = await baiVietDichVuAPI.getAll({
        id_dich_vu: idDichVu,
        trang_thai: 'xuat_ban',
        limit: 1
      });
      
      if (response && response.success && response.data && response.data.length > 0) {
        const baiVietId = response.data[0].id;
        const baiVietDetail = await baiVietDichVuAPI.getById(baiVietId);
        if (baiVietDetail && baiVietDetail.success) {
          setBaiViet(baiVietDetail.data);
        }
      } else {
        setBaiViet(null);
      }
    } catch (error) {
      console.error('Error loading bai viet:', error);
      setBaiViet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (dichVu) => {
    setSelectedService(dichVu);
    loadBaiViet(dichVu.id);
  };

  const formatPrice = (price) => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const getDisplayPrice = () => {
    switch (selectedPaymentType) {
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
          <nav className="text-sm text-gray-600">
            <span className="hover:text-primary cursor-pointer" onClick={onBack}>
              Dịch vụ
            </span>
            {selectedService.loai_dich_vu?.ten && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800">{selectedService.loai_dich_vu.ten}</span>
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
            {/* Service Offerings - Danh sách dịch vụ cùng loại */}
            <div>
              <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800 mb-4">
                Service Offerings
              </h3>
              <ul className="space-y-2">
                {service.dichVusOfType && service.dichVusOfType.map((dichVu) => (
                  <li
                    key={dichVu.id}
                    className={`text-sm md:text-base font-raleway-regular p-2 rounded cursor-pointer transition-colors ${
                      selectedService.id === dichVu.id
                        ? 'bg-[#FFF9FB] text-gray-800 font-semibold'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                    onClick={() => handleServiceClick(dichVu)}
                  >
                    {dichVu.ten_dich_vu}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing Box */}
            <div className="border-2 border-primary rounded-lg p-6 space-y-4">
              {/* BẢNG GIÁ Button */}
              <button className="w-full py-2 bg-gray-200 text-gray-800 font-raleway-bold text-sm rounded hover:bg-gray-300 transition-colors">
                BẢNG GIÁ
              </button>

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
                ĐẶT LỊCH NGAY VỚI DỊCH VỤ NÀY
              </button>

              {/* No credit card required */}
              <p className="text-xs text-gray-500 text-center">
                No credit card required
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
        serviceName={selectedService?.ten_dich_vu || ''}
      />
    </section>
  );
};

export default ServiceDetail;
