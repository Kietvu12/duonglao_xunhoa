import { useState, useEffect } from 'react';
import VRView from './VRView';
import { phongNewAPI, baiVietPhongAPI } from '../services/api';
import { normalizeImageUrl } from '../utils/imageUtils';

const RoomDetail = ({ room, onBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVRView, setShowVRView] = useState(false);
  const [phongs, setPhongs] = useState([]);
  const [images, setImages] = useState([]);
  const [baiViet, setBaiViet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('RoomDetail useEffect - room object:', room);
    console.log('RoomDetail useEffect - room?.id:', room?.id);
    // Kiểm tra !== undefined thay vì truthy để chấp nhận id = 0
    if (room?.id !== undefined && room?.id !== null) {
      console.log('RoomDetail - Starting loadPhongsAndBaiViet for room id:', room.id);
      loadPhongsAndBaiViet();
    } else {
      console.warn('RoomDetail - No room.id found, resetting state');
      // Nếu không có room, reset state
      setLoading(false);
      setPhongs([]);
      setImages([]);
      setBaiViet(null);
    }
  }, [room?.id]); // Chỉ phụ thuộc vào room.id thay vì toàn bộ room object

  const loadPhongsAndBaiViet = async () => {
    // Kiểm tra !== undefined thay vì truthy để chấp nhận id = 0
    if (room?.id === undefined || room?.id === null) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setPhongs([]);
      setImages([]);
      setBaiViet(null);
      
      // Load danh sách phòng có id_loai_phong tương ứng (sử dụng public route)
      console.log('=== RoomDetail: Loading phongs ===');
      console.log('Room object:', room);
      console.log('Room id:', room.id);
      console.log('Room id type:', typeof room.id);
      const phongResponse = await phongNewAPI.getAll({ id_loai_phong: room.id }, true);
      console.log('=== Phong API Response ===');
      console.log('Phong response:', JSON.stringify(phongResponse, null, 2));
      console.log('Phong response success:', phongResponse?.success);
      console.log('Phong response data type:', Array.isArray(phongResponse?.data) ? 'Array' : typeof phongResponse?.data);
      console.log('Phong response data length:', phongResponse?.data?.length);
      if (phongResponse?.data && phongResponse.data.length > 0) {
        console.log('First item keys:', Object.keys(phongResponse.data[0]));
        console.log('First item has anh_1?', 'anh_1' in phongResponse.data[0]);
        console.log('First item has ten_phong?', 'ten_phong' in phongResponse.data[0]);
        console.log('First item has ten?', 'ten' in phongResponse.data[0]);
      }
      
      if (phongResponse && phongResponse.success) {
        const phongList = phongResponse.data || [];
        console.log('Phong list length:', phongList.length);
        console.log('Phong list:', phongList);
        setPhongs(phongList);
        
        // Lấy 3 ảnh từ phòng đầu tiên (anh_1, anh_2, anh_3)
        // Ảnh đầu tiên (anh_1) luôn là ảnh panorama để view VR
        const imageList = [];
        if (phongList.length > 0) {
          const firstPhong = phongList[0];
          console.log('First phong:', firstPhong);
          console.log('First phong anh_1:', firstPhong.anh_1);
          console.log('First phong anh_2:', firstPhong.anh_2);
          console.log('First phong anh_3:', firstPhong.anh_3);
          
          // Luôn thêm 3 ảnh theo thứ tự: anh_1 (panorama/VR), anh_2, anh_3
          // Kiểm tra cả null và empty string
          if (firstPhong.anh_1 && firstPhong.anh_1.trim() !== '') {
            imageList.push(firstPhong.anh_1); // Ảnh panorama/VR
          }
          if (firstPhong.anh_2 && firstPhong.anh_2.trim() !== '') {
            imageList.push(firstPhong.anh_2);
          }
          if (firstPhong.anh_3 && firstPhong.anh_3.trim() !== '') {
            imageList.push(firstPhong.anh_3);
          }
        } else {
          console.warn('No phong found for loai_phong id:', room.id);
        }
        setImages(imageList);
        console.log('Images loaded from first room:', imageList);
        console.log('Images count:', imageList.length);
      } else {
        console.warn('Phong response not successful:', phongResponse);
        console.warn('Response error:', phongResponse?.message || phongResponse?.error);
      }

      // Load bài viết phòng có id_loai_phong tương ứng
      try {
        const baiVietResponse = await baiVietPhongAPI.getAll({ 
          id_loai_phong: room.id,
          trang_thai: 'xuat_ban',
          limit: 1
        });
        console.log('Bai viet response:', baiVietResponse);
        
        if (baiVietResponse && baiVietResponse.success && baiVietResponse.data && baiVietResponse.data.length > 0) {
          const baiVietId = baiVietResponse.data[0].id;
          const baiVietDetail = await baiVietPhongAPI.getById(baiVietId);
          if (baiVietDetail && baiVietDetail.success) {
            setBaiViet(baiVietDetail.data);
            console.log('Bai viet loaded:', baiVietDetail.data);
          }
        }
      } catch (baiVietError) {
        console.error('Error loading bai viet:', baiVietError);
        // Không throw error, chỉ log để không ảnh hưởng đến việc hiển thị phòng
      }
    } catch (error) {
      console.error('Error loading phongs and bai viet:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      // Không hiển thị alert, chỉ log để không làm gián đoạn UI
      // alert('Lỗi khi tải thông tin phòng: ' + (error.message || 'Vui lòng thử lại sau'));
    } finally {
      setLoading(false);
      console.log('Loading completed. Images count:', images.length);
    }
  };


  return (
    <>
      {showVRView && <VRView onClose={() => setShowVRView(false)} />}
      <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <span className="hover:text-primary cursor-pointer" onClick={onBack}>
              Tiện ích
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{room.ten || 'Chi tiết phòng'}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-raleway-bold text-gray-800">
            {room.ten || 'Chi tiết phòng'}
          </h1>
        </div>

        {/* Images Section - 3 ảnh từ phòng đầu tiên */}
        {loading ? (
          <div className="mb-8 md:mb-12 text-center py-12">
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : images.length > 0 ? (
          <div className="mb-8 md:mb-12 space-y-4">
            {/* Main Image - Ảnh đầu tiên (panorama/VR) */}
            <div className="relative w-full rounded-lg flex justify-center items-center bg-gray-100 min-h-[400px]">
              {images[0] ? (
                <>
                  <img
                    src={normalizeImageUrl(images[0])}
                    alt="Ảnh panorama phòng"
                    className="w-full h-auto object-contain rounded-lg max-h-[600px]"
                  />
                  {/* Nút VR - luôn hiển thị ở ảnh đầu tiên (panorama) */}
                  <button
                    onClick={() => setShowVRView(true)}
                    className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-black/70 transition-colors z-10"
                    aria-label="Xem VR 360 độ"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-gray-400">Không có ảnh panorama</div>
              )}
            </div>

            {/* Thumbnail Images - Ảnh 2 và 3 */}
            {images.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {images.slice(1).map((image, index) => (
                  <div
                    key={index + 1}
                    className="w-full h-48 md:h-64 overflow-hidden rounded-lg border-2 border-gray-200"
                  >
                    <img
                      src={normalizeImageUrl(image)}
                      alt={`Ảnh phòng ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 md:mb-12 text-center py-12 bg-gray-100 rounded-lg">
            <p className="text-gray-600">Chưa có ảnh phòng. Vui lòng thêm ảnh cho phòng đầu tiên thuộc loại phòng này.</p>
          </div>
        )}

        {/* Content Section - Description and Article */}
        <div className="space-y-6">
          {/* Description from loai_phong */}
          {room.mo_ta && (
            <div className="space-y-4 text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed">
              <p>{room.mo_ta}</p>
            </div>
          )}

          {/* Bài viết phòng */}
          {baiViet && (
            <div className="mt-8 space-y-4">
              
              {baiViet.noi_dung && (
                <div 
                  className="text-base md:text-lg text-gray-600 font-raleway-regular leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: baiViet.noi_dung }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
};

export default RoomDetail;
