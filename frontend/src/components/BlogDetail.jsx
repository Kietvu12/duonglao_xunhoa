import { useState, useEffect } from 'react';
import outside1 from '../assets/Outside1.png';
import outside2 from '../assets/Outside2.png';
import { baiVietAPI } from '../services/api';
import { normalizeImageUrl, normalizeHtmlContent } from '../utils/imageUtils';

const BlogDetail = ({ post, onBack }) => {
  const [postData, setPostData] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post) {
      loadPostDetail();
    }
  }, [post]);

  const loadPostDetail = async () => {
    if (!post?.id) {
      setPostData(post);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Fetch chi tiết bài viết nếu chưa có đầy đủ thông tin
      if (!post.noi_dung) {
        const response = await baiVietAPI.getById(post.id);
        setPostData(response.data);
        
        // Load media nếu có
        if (response.data.media && response.data.media.length > 0) {
          setMedia(response.data.media);
        } else {
          // Thử load media riêng
          try {
            const mediaResponse = await baiVietAPI.getMedia(post.id);
            setMedia(mediaResponse.data || []);
          } catch (err) {
            console.error('Error loading media:', err);
          }
        }
      } else {
        setPostData(post);
        // Load media riêng
        try {
          const mediaResponse = await baiVietAPI.getMedia(post.id);
          setMedia(mediaResponse.data || []);
        } catch (err) {
          console.error('Error loading media:', err);
        }
      }
    } catch (error) {
      console.error('Error loading post detail:', error);
      setPostData(post); // Fallback to provided post data
    } finally {
      setLoading(false);
    }
  };

  // Format date từ database (YYYY-MM-DD) sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Lấy URL ảnh
  const getImageUrl = (imagePath) => {
    const normalizedUrl = normalizeImageUrl(imagePath);
    return normalizedUrl || outside1;
  };

  // Lấy ảnh chính
  const getMainImage = () => {
    if (postData?.anh_dai_dien) {
      return getImageUrl(postData.anh_dai_dien);
    }
    if (media.length > 0 && media[0].url) {
      return getImageUrl(media[0].url);
    }
    return outside1;
  };

  // Lấy ảnh thumbnail
  const getThumbnail1 = () => {
    if (media.length > 1 && media[1].url) {
      return getImageUrl(media[1].url);
    }
    if (media.length > 0 && media[0].url) {
      return getImageUrl(media[0].url);
    }
    return outside2;
  };

  const getThumbnail2 = () => {
    if (media.length > 2 && media[2].url) {
      return getImageUrl(media[2].url);
    }
    if (media.length > 1 && media[1].url) {
      return getImageUrl(media[1].url);
    }
    return outside2;
  };

  // Lấy mô tả ngắn từ database hoặc tự động tạo từ nội dung
  const getShortDescription = () => {
    // Ưu tiên dùng mo_ta_ngan từ database
    if (postData?.mo_ta_ngan) {
      return postData.mo_ta_ngan;
    }
    // Fallback: tự động tạo từ nội dung
    if (!postData?.noi_dung) return '';
    const text = postData.noi_dung.replace(/<[^>]*>/g, '');
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  // Mapping category từ tiếng Anh sang tiếng Việt
  const getCategoryDisplayName = (category) => {
    const categoryMap = {
      'Activities': 'Hoạt động',
      'Health': 'Sức khỏe',
      'Guides': 'Hướng dẫn',
      'Medical News': 'Tin tức y tế',
      'Dịch vụ': 'Dịch vụ',
      'Đời sống': 'Đời sống',
      'Du lịch': 'Du lịch',
      'Khác': 'Khác'
    };
    return categoryMap[category] || category; // Nếu không có trong map, trả về giá trị gốc
  };

  // Render HTML content
  const renderContent = () => {
    if (!postData?.noi_dung) return null;
    const normalizedContent = normalizeHtmlContent(postData.noi_dung);
    return <div dangerouslySetInnerHTML={{ __html: normalizedContent }} />;
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#2D2D2D' }}>Đang tải bài viết...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!postData) {
    return (
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">Không tìm thấy bài viết</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028] hover:text-primary cursor-pointer" onClick={onBack}>
            Blog
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028] hover:text-primary cursor-pointer" onClick={onBack}>
            {getCategoryDisplayName(postData.category || 'Khác')}
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028]">{postData.tieu_de || postData.title}</span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Title, Date, Short Description */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title - Very Large */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-raleway-bold text-[#242525] leading-tight">
              {postData.tieu_de || postData.title}
            </h1>

            {/* Date */}
            <p className="text-lg md:text-xl font-raleway-light text-black">
              {formatDate(postData.ngay_dang || postData.ngay_tao || postData.date)}
            </p>

            {/* Short Description */}
            <p className="text-base md:text-lg lg:text-xl font-raleway-regular leading-relaxed text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              {getShortDescription()}
            </p>
          </div>

          {/* Right Column - Images */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Main Large Image - Vertical (2/3 width) */}
              <div className="md:col-span-3 w-full h-[400px] md:h-[500px] lg:h-[685px] rounded-lg overflow-hidden">
                <img
                  src={getMainImage()}
                  alt={postData.tieu_de || postData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = outside1;
                  }}
                />
              </div>

              {/* Two Small Images Stacked (1/3 width) */}
              <div className="md:col-span-2 flex flex-col gap-4 h-[400px] md:h-[500px] lg:h-[685px]">
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={getThumbnail1()}
                    alt={`${postData.tieu_de || postData.title} thumbnail 1`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = outside2;
                    }}
                  />
                </div>
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={getThumbnail2()}
                    alt={`${postData.tieu_de || postData.title} thumbnail 2`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = outside2;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {postData.noi_dung && (
          <div className="mt-12 md:mt-16 lg:mt-20">
            {/* Content from API */}
            <div className="max-w-7xl">
              <div 
                className="text-base md:text-lg lg:text-xl text-black font-raleway-regular leading-relaxed prose prose-lg max-w-none blog-content text-justify"
                style={{ 
                  lineHeight: '1.8',
                  wordSpacing: '0.1em',
                  textAlign: 'justify'
                }}
              >
                {renderContent()}
              </div>
              <style>{`
                .blog-content img {
                  max-width: 100% !important;
                  height: auto !important;
                  display: block !important;
                  margin: 20px auto !important;
                  border-radius: 8px !important;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
              `}</style>
            </div>

            {/* Display additional media images if available */}
            {media.length > 3 && (
              <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                {media.slice(3).map((item, index) => (
                  <div key={index} className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(item.url)}
                      alt={item.mo_ta || `Image ${index + 4}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = outside2;
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogDetail;

