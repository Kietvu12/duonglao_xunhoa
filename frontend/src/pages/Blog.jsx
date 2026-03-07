import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BlogSession1 from '../components/BlogSession1';
import BlogSession2 from '../components/BlogSession2';
import BlogDetail from '../components/BlogDetail';
import { baiVietAPI, tuyenDungAPI } from '../services/api';

const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const postId = searchParams.get('post');
  const activeTab = searchParams.get('tab') || 'bai-viet';
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tinTuyenDungs, setTinTuyenDungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'bai-viet') {
      // Load 100 bài viết để có thể nhóm theo category với pagination
      // Đủ để hiển thị nhiều bài viết nhưng không quá tải
      loadPosts({ limit: 100 });
    } else if (activeTab === 'tuyen-dung') {
      loadTinTuyenDungs();
    }
  }, [activeTab]);

  useEffect(() => {
    // Khi postId thay đổi trong URL, load bài viết tương ứng
    if (postId) {
      if (activeTab === 'bai-viet') {
        loadPostById(postId);
      } else if (activeTab === 'tuyen-dung') {
        loadTinTuyenDungById(postId);
      }
    } else {
      setSelectedPost(null);
    }
  }, [postId, activeTab]);

  const loadPosts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      // Lấy bài viết với pagination
      const response = await baiVietAPI.getAll({ 
        trang_thai: 'xuat_ban',
        ...params
      });
      setPosts(response.data || []);
      return response; // Return response để có thể access pagination metadata
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadPostById = async (id) => {
    try {
      setLoading(true);
      const response = await baiVietAPI.getById(id);
      setSelectedPost(response.data);
    } catch (err) {
      console.error('Error loading post detail:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      // Nếu không tìm thấy bài viết, quay về danh sách
      navigate('/blog', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const loadTinTuyenDungs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tuyenDungAPI.getAllTinTuyenDung({ 
        trang_thai: 'dang_tuyen',
        limit: 100
      });
      const data = response.data || [];
      setTinTuyenDungs(data);
    } catch (err) {
      console.error('Error loading tin tuyen dung:', err);
      setError('Không thể tải danh sách tin tuyển dụng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const loadTinTuyenDungById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tuyenDungAPI.getTinTuyenDungById(id);
      if (response.success && response.data) {
        setSelectedPost(response.data);
      } else {
        throw new Error('Không tìm thấy tin tuyển dụng');
      }
    } catch (err) {
      console.error('Error loading tin tuyen dung detail:', err);
      setError('Không thể tải tin tuyển dụng. Vui lòng thử lại sau.');
      setSelectedPost(null);
      // Không navigate ngay, để user có thể thấy lỗi
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (post) => {
    // Navigate đến URL với query param post
    const tab = activeTab === 'tuyen-dung' ? 'tuyen-dung' : 'bai-viet';
    navigate(`/blog?tab=${tab}&post=${post.id}`, { replace: false });
  };

  const handleBack = () => {
    // Navigate về /blog (không có query param)
    navigate(`/blog?tab=${activeTab}`, { replace: false });
    // Scroll đến phần danh sách bài viết (sau BlogSession1) khi quay lại
    setTimeout(() => {
      // Tìm element BlogSession2 và scroll đến đó
      const blogSession2 = document.querySelector('[data-blog-session="list"]');
      if (blogSession2) {
        blogSession2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Fallback: scroll về đầu trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleTabChange = (tab) => {
    navigate(`/blog?tab=${tab}`, { replace: false });
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen">
      <BlogSession1 />
      
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => handleTabChange('bai-viet')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'bai-viet'
                  ? 'border-[#4A90E2] text-[#4A90E2]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                article
              </span>
              <span>Bài viết</span>
            </button>
            <button
              onClick={() => handleTabChange('tuyen-dung')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'tuyen-dung'
                  ? 'border-[#4A90E2] text-[#4A90E2]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                work
              </span>
              <span>Tin tuyển dụng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {selectedPost ? (
        activeTab === 'tuyen-dung' ? (
          <TuyenDungDetail tinTuyenDung={selectedPost} onBack={handleBack} />
        ) : (
          <BlogDetail post={selectedPost} onBack={handleBack} />
        )
      ) : (
        activeTab === 'tuyen-dung' ? (
          <TuyenDungList 
            tinTuyenDungs={tinTuyenDungs} 
            loading={loading} 
            error={error}
            onItemClick={handlePostClick} 
          />
        ) : (
          <BlogSession2 
            posts={posts} 
            loading={loading} 
            error={error}
            onPostClick={handlePostClick} 
          />
        )
      )}
    </div>
  );
};

// Component hiển thị danh sách tin tuyển dụng
const TuyenDungList = ({ tinTuyenDungs = [], loading = false, error = null, onItemClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Đang tải tin tuyển dụng...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (tinTuyenDungs.length === 0) {
    return (
      <section className="w-full bg-white py-16 md:py-24" data-blog-session="list">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Chưa có tin tuyển dụng nào.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-16 md:py-24" data-blog-session="list">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-raleway-bold text-gray-800 mb-12 md:mb-16 leading-tight">
          Tin tuyển dụng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {tinTuyenDungs.map((ttd) => (
            <div
              key={ttd.id}
              className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity border border-gray-200 rounded-lg p-6 hover:shadow-lg"
              onClick={() => onItemClick && onItemClick(ttd)}
            >
              <div className="flex items-center gap-3 mb-4">
               
                <div>
                  <h3 className="text-xl md:text-2xl font-raleway-bold text-gray-800">
                    {ttd.tieu_de}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(ttd.ngay_dang || ttd.ngay_tao)}
                  </p>
                </div>
              </div>

              <p className="text-base font-semibold text-gray-800 mb-2">
                Vị trí: {ttd.vi_tri}
              </p>

              {ttd.mo_ta && (
                <p className="text-sm md:text-base text-gray-600 font-raleway-regular leading-relaxed line-clamp-3">
                  {ttd.mo_ta}
                </p>
              )}

              {ttd.so_luong && (
                <p className="text-sm text-gray-500 mt-2">
                  Số lượng: {ttd.so_luong} người
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Component hiển thị chi tiết tin tuyển dụng
const TuyenDungDetail = ({ tinTuyenDung, onBack }) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    file_cv: null,
  });

  useEffect(() => {
    if (tinTuyenDung?.id) {
      loadMedia();
    } else {
      setLoading(false);
    }
  }, [tinTuyenDung]);

  const loadMedia = async () => {
    try {
      const response = await tuyenDungAPI.getMediaTinTuyenDung(tinTuyenDung.id);
      setMedia(response.data || []);
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4545';
    return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
  };

  const getMainImage = () => {
    if (media.length > 0) {
      return getImageUrl(media[0].url);
    }
    return null;
  };

  const getThumbnail1 = () => {
    if (media.length > 1) {
      return getImageUrl(media[1].url);
    }
    return null;
  };

  const getThumbnail2 = () => {
    if (media.length > 2) {
      return getImageUrl(media[2].url);
    }
    return null;
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formData.ho_ten || !formData.email || !formData.so_dien_thoai) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const submitFormData = new FormData();
      submitFormData.append('id_tin_tuyen_dung', tinTuyenDung.id);
      submitFormData.append('ho_ten', formData.ho_ten);
      submitFormData.append('email', formData.email);
      submitFormData.append('so_dien_thoai', formData.so_dien_thoai);
      if (formData.file_cv) {
        submitFormData.append('file_cv', formData.file_cv);
      }

      await tuyenDungAPI.createHoSoUngTuyen(submitFormData);
      setSubmitSuccess(true);
      setFormData({
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        file_cv: null,
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Đang tải tin tuyển dụng...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!tinTuyenDung) {
    return (
      <section className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">Không tìm thấy tin tuyển dụng</p>
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
            Tin tuyển dụng
          </span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-base md:text-lg font-raleway-semibold text-[#1e4028]">{tinTuyenDung.tieu_de}</span>
        </nav>

        {/* Main Content Grid - Giống BlogDetail - Chỉ có tiêu đề và ảnh */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Chỉ có Title và Date */}
          <div className="lg:col-span-5 space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-raleway-bold text-[#242525] leading-tight">
              {tinTuyenDung.tieu_de}
            </h1>

            <p className="text-lg md:text-xl font-raleway-light text-black">
              {formatDate(tinTuyenDung.ngay_dang || tinTuyenDung.ngay_tao)}
            </p>
          </div>

          {/* Right Column - Images - Giống BlogDetail */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Main Large Image - Vertical (2/3 width) */}
              <div className="md:col-span-3 w-full h-[400px] md:h-[500px] lg:h-[685px] rounded-lg overflow-hidden">
                <img
                  src={getMainImage() || 'https://via.placeholder.com/600x800?text=No+Image'}
                  alt={tinTuyenDung.tieu_de}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x800?text=No+Image';
                  }}
                />
              </div>

              {/* Two Small Images Stacked (1/3 width) */}
              <div className="md:col-span-2 flex flex-col gap-4 h-[400px] md:h-[500px] lg:h-[685px]">
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={getThumbnail1() || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={`${tinTuyenDung.tieu_de} thumbnail 1`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                </div>
                <div className="flex-1 w-full rounded-lg overflow-hidden">
                  <img
                    src={getThumbnail2() || 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={`${tinTuyenDung.tieu_de} thumbnail 2`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section với Form ứng tuyển bên cạnh - Giống BlogDetail */}
        <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left - Nội dung chi tiết */}
          <div className="lg:col-span-7 space-y-8">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-base md:text-lg font-semibold text-[#4A90E2]">
                  Vị trí:
                </span>
                <span className="text-base md:text-lg text-gray-800">
                  {tinTuyenDung.vi_tri}
                </span>
              </div>
              
              {tinTuyenDung.so_luong && (
                <div className="flex items-center gap-4">
                  <span className="text-base md:text-lg font-semibold text-gray-700">
                    Số lượng:
                  </span>
                  <span className="text-base md:text-lg text-gray-800">
                    {tinTuyenDung.so_luong} người
                  </span>
                </div>
              )}
              
              {tinTuyenDung.ngay_het_han && (
                <div className="flex items-center gap-4">
                  <span className="text-base md:text-lg font-semibold text-gray-700">
                    Hạn nộp hồ sơ:
                  </span>
                  <span className="text-base md:text-lg text-gray-800">
                    {formatDate(tinTuyenDung.ngay_het_han)}
                  </span>
                </div>
              )}
            </div>

            {/* Mô tả */}
            {tinTuyenDung.mo_ta && (
              <div>
                <h2 className="text-2xl md:text-3xl font-raleway-bold text-gray-800 mb-4">
                  Mô tả công việc
                </h2>
                <div className="text-base md:text-lg lg:text-xl text-[#606060] font-raleway-regular leading-relaxed whitespace-pre-line">
                  {tinTuyenDung.mo_ta}
                </div>
              </div>
            )}

            {/* Yêu cầu */}
            {tinTuyenDung.yeu_cau && (
              <div>
                <h2 className="text-2xl md:text-3xl font-raleway-bold text-gray-800 mb-4">
                  Yêu cầu
                </h2>
                <div className="text-base md:text-lg lg:text-xl text-black font-raleway-regular leading-relaxed whitespace-pre-line">
                  {tinTuyenDung.yeu_cau}
                </div>
              </div>
            )}

            {/* Display additional media images if available */}
            {media.length > 3 && (
              <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                {media.slice(3).map((item, index) => (
                  <div key={index} className="w-full h-64 md:h-80 overflow-hidden rounded-lg">
                    <img
                      src={getImageUrl(item.url)}
                      alt={item.mo_ta || `Image ${index + 4}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Form ứng tuyển */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 sticky top-24">
              <h2 className="text-2xl md:text-3xl font-raleway-bold text-gray-800 mb-6">
                Ứng tuyển ngay
              </h2>

              {submitSuccess && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  <p className="font-semibold">Nộp hồ sơ thành công!</p>
                  <p className="text-sm mt-1">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
                </div>
              )}

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload CV (PDF, DOC, DOCX)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => setFormData({ ...formData, file_cv: e.target.files[0] || null })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800 text-sm"
                  />
                  {formData.file_cv && (
                    <p className="text-xs text-gray-500 mt-1">
                      Đã chọn: {formData.file_cv.name}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        send
                      </span>
                      <span>Nộp hồ sơ</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
