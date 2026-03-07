import { useEffect, useState } from 'react';
import { baiVietDichVuAPI, dichVuAPI, uploadAPI } from '../../services/api';
import RichTextEditor from '../../components/RichTextEditor';
import { normalizeImageUrl } from '../../utils/imageUtils';

export default function BaiVietDichVuPage() {
  const [baiViets, setBaiViets] = useState([]);
  const [dichVus, setDichVus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState([]);
  const [formData, setFormData] = useState({
    id_dich_vu: '',
    tieu_de: '',
    slug: '',
    noi_dung: '',
    anh_dai_dien: '',
    meta_title: '',
    meta_description: '',
    mo_ta_ngan: '',
    category: '',
    tags: '',
    trang_thai: 'nhap',
    ngay_dang: '',
  });
  const [mediaList, setMediaList] = useState([]);
  const [newMedia, setNewMedia] = useState({ url: '', loai: 'anh', mo_ta: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  
  // States cho searchable dropdown dịch vụ
  const [dichVuSearch, setDichVuSearch] = useState('');
  const [showDichVuDropdown, setShowDichVuDropdown] = useState(false);
  const [filteredDichVus, setFilteredDichVus] = useState([]);

  useEffect(() => {
    loadBaiViets();
    loadDichVus();
  }, []);

  const loadDichVus = async () => {
    try {
      // Truyền limit=-1 để lấy tất cả dịch vụ
      const response = await dichVuAPI.getAll({ limit: -1 });
      setDichVus(response.data || []);
      setFilteredDichVus(response.data || []);
    } catch (error) {
      console.error('Error loading dich vus:', error);
    }
  };

  // Lọc dịch vụ khi người dùng gõ
  useEffect(() => {
    if (dichVuSearch.trim() === '') {
      setFilteredDichVus(dichVus);
    } else {
      const filtered = dichVus.filter(dv => 
        dv.ten_dich_vu.toLowerCase().includes(dichVuSearch.toLowerCase())
      );
      setFilteredDichVus(filtered);
    }
  }, [dichVuSearch, dichVus]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDichVuDropdown && !event.target.closest('.dichvu-search-container')) {
        setShowDichVuDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDichVuDropdown]);

  const loadBaiViets = async () => {
    try {
      setLoading(true);
      // Truyền limit=-1 để lấy tất cả bài viết dịch vụ
      const response = await baiVietDichVuAPI.getAll({ limit: -1 });
      setBaiViets(response.data || []);
    } catch (error) {
      console.error('Error loading bai viets:', error);
      alert('Lỗi khi tải danh sách bài viết dịch vụ: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const content = formData.noi_dung || '';
      
      if (!content) {
        alert('Vui lòng nhập nội dung bài viết');
        return;
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      
      const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim();
      const hasImages = tempDiv.querySelector('img') !== null;
      const hasOtherContent = tempDiv.querySelector('h1, h2, h3, h4, h5, h6, ul, ol, blockquote') !== null;
      
      if (!textContent && !hasImages && !hasOtherContent && content.length < 20) {
        alert('Vui lòng nhập nội dung bài viết');
        return;
      }

      const submitData = {
        ...formData,
        anh_dai_dien: formData.anh_dai_dien || null,
        tags: tagList.join(', '),
        media: mediaList.length > 0 ? mediaList.map((m, index) => ({
          url: m.url,
          loai: m.loai,
          mo_ta: m.mo_ta || null,
          thu_tu: index
        })) : undefined
      };

      if (editing) {
        await baiVietDichVuAPI.update(editing.id, submitData);
        alert('Cập nhật bài viết dịch vụ thành công');
      } else {
        await baiVietDichVuAPI.create(submitData);
        alert('Tạo bài viết dịch vụ thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      setMediaList([]);
      loadBaiViets();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleEdit = async (bv) => {
    try {
      const fullArticle = await baiVietDichVuAPI.getById(bv.id);
      const articleData = fullArticle.data;
      
      setEditing(articleData);
      setFormData({
        id_dich_vu: articleData.id_dich_vu || '',
        tieu_de: articleData.tieu_de || '',
        slug: articleData.slug || '',
        noi_dung: articleData.noi_dung || '',
        anh_dai_dien: articleData.anh_dai_dien || '',
        meta_title: articleData.meta_title || '',
        meta_description: articleData.meta_description || '',
        mo_ta_ngan: articleData.mo_ta_ngan || '',
        category: articleData.category || '',
        tags: articleData.tags || '',
        trang_thai: articleData.trang_thai || 'nhap',
        ngay_dang: articleData.ngay_dang ? articleData.ngay_dang.slice(0, 16) : '',
      });
      
      // Set tên dịch vụ cho search field
      if (articleData.id_dich_vu) {
        const selectedDichVu = dichVus.find(dv => dv.id === articleData.id_dich_vu);
        if (selectedDichVu) {
          setDichVuSearch(selectedDichVu.ten_dich_vu);
        }
      }
      
      if (articleData.tags) {
        setTagList(articleData.tags.split(',').map(t => t.trim()).filter(t => t));
      } else {
        setTagList([]);
      }
      
      if (articleData.media && Array.isArray(articleData.media)) {
        setMediaList(articleData.media);
      } else {
        setMediaList([]);
      }
      
      setShowModal(true);
    } catch (error) {
      console.error('Error loading article:', error);
      alert('Lỗi khi tải dữ liệu bài viết: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    try {
      await baiVietDichVuAPI.delete(id);
      alert('Xóa bài viết dịch vụ thành công');
      loadBaiViets();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id_dich_vu: '',
      tieu_de: '',
      slug: '',
      noi_dung: '',
      anh_dai_dien: '',
      meta_title: '',
      meta_description: '',
      mo_ta_ngan: '',
      category: '',
      tags: '',
      trang_thai: 'nhap',
      ngay_dang: '',
    });
    setMediaList([]);
    setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
    setTagList([]);
    setTagInput('');
    setDichVuSearch('');
    setShowDichVuDropdown(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tagList.includes(tagInput.trim())) {
      const newTags = [...tagList, tagInput.trim()];
      setTagList(newTags);
      setFormData({ ...formData, tags: newTags.join(', ') });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tagList.filter(t => t !== tagToRemove);
    setTagList(newTags);
    setFormData({ ...formData, tags: newTags.join(', ') });
  };

  const handleSaveDraft = async () => {
    const submitData = {
      ...formData,
      trang_thai: 'nhap',
      anh_dai_dien: formData.anh_dai_dien || null,
      tags: tagList.join(', '),
    };
    
    try {
      if (editing) {
        await baiVietDichVuAPI.update(editing.id, submitData);
        alert('Đã lưu nháp thành công');
      } else {
        await baiVietDichVuAPI.create(submitData);
        alert('Đã lưu nháp thành công');
        setShowModal(false);
        resetForm();
        loadBaiViets();
      }
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handlePublish = async () => {
    const content = formData.noi_dung || '';
    if (!content) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = (tempDiv.textContent || tempDiv.innerText || '').trim();
    const hasImages = tempDiv.querySelector('img') !== null;
    const hasOtherContent = tempDiv.querySelector('h1, h2, h3, h4, h5, h6, ul, ol, blockquote') !== null;
    
    if (!textContent && !hasImages && !hasOtherContent && content.length < 20) {
      alert('Vui lòng nhập nội dung bài viết');
      return;
    }

    const submitData = {
      ...formData,
      trang_thai: 'xuat_ban',
      anh_dai_dien: formData.anh_dai_dien || null,
      tags: tagList.join(', '),
      media: mediaList.length > 0 ? mediaList.map((m, index) => ({
        url: m.url,
        loai: m.loai,
        mo_ta: m.mo_ta || null,
        thu_tu: index
      })) : undefined
    };

    try {
      if (editing) {
        await baiVietDichVuAPI.update(editing.id, submitData);
        alert('Xuất bản bài viết dịch vụ thành công');
      } else {
        await baiVietDichVuAPI.create(submitData);
        alert('Xuất bản bài viết dịch vụ thành công');
      }
      setShowModal(false);
      setEditing(null);
      resetForm();
      setMediaList([]);
      loadBaiViets();
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/webm'];
    
    if (!imageTypes.includes(file.type) && !videoTypes.includes(file.type)) {
      alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp) hoặc video (mp4, mov, avi, wmv, flv, webm)');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadAPI.uploadMedia(file);
      
      const loai = videoTypes.includes(file.type) ? 'video' : 'anh';
      
      setMediaList([...mediaList, { 
        url: response.data.url, 
        loai: loai,
        mo_ta: newMedia.mo_ta || '',
        id: Date.now() 
      }]);
      setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
      e.target.value = '';
    } catch (error) {
      alert('Lỗi khi upload file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddMedia = () => {
    if (!newMedia.url.trim()) {
      alert('Vui lòng nhập URL hoặc upload file');
      return;
    }
    setMediaList([...mediaList, { ...newMedia, id: Date.now() }]);
    setNewMedia({ url: '', loai: 'anh', mo_ta: '' });
  };

  const handleRemoveMedia = (index) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-raleway">
      {/* List View */}
      {!showModal && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Bài viết Dịch vụ</h1>
              <p className="text-gray-600 mt-2">Quản lý bài viết giới thiệu dịch vụ</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditing(null);
                setMediaList([]);
                setShowModal(true);
              }}
              className="flex min-w-[140px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4A90E2]/90 transition-colors"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
              <span className="truncate">Tạo bài viết</span>
            </button>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="text-gray-500">Đang tải...</div>
            </div>
          ) : baiViets.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>article</span>
              <p className="text-gray-500 text-lg mb-2">Chưa có bài viết dịch vụ nào</p>
              <p className="text-gray-400 text-sm">Bấm "Tạo bài viết" để bắt đầu</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baiViets.map((bv) => (
                <div
                  key={bv.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {bv.anh_dai_dien ? (
                      <img
                        src={bv.anh_dai_dien}
                        alt={bv.tieu_de}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="material-symbols-outlined text-6xl text-gray-300" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>article</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                        bv.trang_thai === 'xuat_ban' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {bv.trang_thai === 'xuat_ban' ? 'Xuất bản' : 'Nháp'}
                      </span>
                    </div>
                    {/* Service Name Badge */}
                    {bv.ten_dich_vu && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500 text-white shadow-sm">
                          {bv.ten_dich_vu}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {bv.tieu_de}
                    </h3>
                    
                    {/* Date */}
                    {bv.ngay_dang && (
                      <div className="flex items-center gap-1 mb-2">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>calendar_today</span>
                        <span className="text-xs text-gray-500">{new Date(bv.ngay_dang).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </div>
                    )}
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                        <span>{bv.luot_xem || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(bv)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg hover:bg-[#4A90E2]/20 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(bv.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Full Page Editor */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col font-raleway">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="size-6 text-[#4A90E2]">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.08c-2.03.19-3.93-1.09-4.57-3.08-.64-1.99.19-4.14 2.18-4.78 1.99-.64 4.14.19 4.78 2.18.64 1.99-.19 4.14-2.18 4.78l.41 1.34-1.54.47-.42-1.34c-.21.07-.42.13-.64.19v1.24h-1.5v-1zM13 11c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold tracking-tight">Quản lý Viện DL</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 text-gray-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300"
              >
                <span className="truncate">Lưu nháp</span>
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#4A90E2] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#4A90E2]/90"
              >
                <span className="truncate">Xuất bản</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                  resetForm();
                  setMediaList([]);
                }}
                className="flex items-center justify-center rounded-lg h-10 w-10 text-gray-600 hover:bg-gray-100"
                title="Đóng"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow overflow-y-auto p-6 lg:p-10 bg-[#F4F7F9]">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-black leading-tight tracking-tight">
                  {editing ? 'Chỉnh sửa Bài viết Dịch vụ' : 'Tạo Bài viết Dịch vụ Mới'}
                </h1>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main content area */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Service Selection */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex flex-col w-full relative dichvu-search-container">
                        <p className="text-base font-medium leading-normal pb-2">Dịch vụ liên quan</p>
                        <div className="relative">
                          <input
                            type="text"
                            value={dichVuSearch}
                            onChange={(e) => {
                              setDichVuSearch(e.target.value);
                              setShowDichVuDropdown(true);
                              // Reset id_dich_vu khi người dùng thay đổi text
                              if (formData.id_dich_vu) {
                                const selectedDichVu = dichVus.find(dv => dv.id === formData.id_dich_vu);
                                if (selectedDichVu && selectedDichVu.ten_dich_vu !== e.target.value) {
                                  setFormData({ ...formData, id_dich_vu: '' });
                                }
                              }
                            }}
                            onFocus={() => setShowDichVuDropdown(true)}
                            placeholder="Gõ để tìm kiếm dịch vụ..."
                            className="flex w-full min-w-0 flex-1 rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-12 px-3 pr-10 text-base font-normal leading-normal"
                          />
                          {dichVuSearch ? (
                            <button
                              type="button"
                              onClick={() => {
                                setDichVuSearch('');
                                setFormData({ ...formData, id_dich_vu: '' });
                                setShowDichVuDropdown(false);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                              title="Xóa lựa chọn"
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          ) : (
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                        
                        {/* Dropdown list */}
                        {showDichVuDropdown && filteredDichVus.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                            {filteredDichVus.map((dv) => (
                              <div
                                key={dv.id}
                                onClick={() => {
                                  setFormData({ ...formData, id_dich_vu: dv.id });
                                  setDichVuSearch(dv.ten_dich_vu);
                                  setShowDichVuDropdown(false);
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                  formData.id_dich_vu === dv.id ? 'bg-blue-100 font-medium' : ''
                                }`}
                              >
                                {dv.ten_dich_vu}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Hiển thị khi không tìm thấy */}
                        {showDichVuDropdown && dichVuSearch && filteredDichVus.length === 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                            <p className="text-gray-500 text-center">Không tìm thấy dịch vụ</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Article Title */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <label className="flex flex-col w-full">
                        <p className="text-base font-medium leading-normal pb-2">Tiêu đề bài viết *</p>
                        <input
                          type="text"
                          required
                          value={formData.tieu_de}
                          onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                          placeholder="Nhập tiêu đề cho bài viết"
                        />
                      </label>
                    </div>

                    {/* Short Description */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <label className="flex flex-col w-full">
                        <p className="text-base font-medium leading-normal pb-2">Mô tả ngắn</p>
                        <textarea
                          value={formData.mo_ta_ngan || ''}
                          onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
                          className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 min-h-36 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                          placeholder="Viết mô tả ngắn về bài viết..."
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.mo_ta_ngan?.length || 0}/500 ký tự
                        </p>
                      </label>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-xl border border-gray-200">
                      <div className="p-6">
                        <p className="text-base font-medium leading-normal">Nội dung chính *</p>
                      </div>
                      <div className="border-t border-gray-200">
                        <RichTextEditor
                          key={editing?.id || 'new'}
                          value={formData.noi_dung || ''}
                          onChange={(content) => {
                            setFormData({ ...formData, noi_dung: content });
                          }}
                          placeholder="Nhập nội dung bài viết..."
                        />
                      </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-base font-medium leading-normal">Ảnh đại diện</p>
                        {formData.anh_dai_dien ? (
                          <div className="relative">
                            <img
                              src={normalizeImageUrl(formData.anh_dai_dien) || formData.anh_dai_dien}
                              alt="Ảnh đại diện"
                              className="w-full h-auto rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, anh_dai_dien: '' })}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                            >
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                            </button>
                          </div>
                        ) : (
                          <div className="relative w-full border-2 border-dashed border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-[#4A90E2] transition-colors">
                            <span className="material-symbols-outlined text-4xl text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>upload_file</span>
                            <p className="mt-2 text-sm text-gray-500">
                              <span className="font-semibold text-[#4A90E2]">Click để upload</span> hoặc kéo thả
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                                if (!imageTypes.includes(file.type)) {
                                  alert('Chỉ cho phép upload file ảnh (jpg, png, gif, webp)');
                                  return;
                                }
                                if (file.size > 10 * 1024 * 1024) {
                                  alert('Kích thước file không được vượt quá 10MB');
                                  return;
                                }
                                try {
                                  setUploadingThumbnail(true);
                                  const response = await uploadAPI.uploadMedia(file);
                                  setFormData({ ...formData, anh_dai_dien: response.data.url });
                                  e.target.value = '';
                                } catch (error) {
                                  alert('Lỗi khi upload ảnh: ' + error.message);
                                } finally {
                                  setUploadingThumbnail(false);
                                }
                              }}
                              disabled={uploadingThumbnail}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sidebar */}
                  <aside className="flex flex-col gap-6">
                    {/* Publishing Box */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-bold mb-4">Xuất bản</h3>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>visibility</span>
                            <span>Hiển thị: <span className="font-semibold">Công khai</span></span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>circle</span>
                            <span>Trạng thái: <span className="font-semibold">{formData.trang_thai === 'xuat_ban' ? 'Xuất bản' : 'Nháp'}</span></span>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-base font-medium leading-normal pb-2">Hành động xuất bản</p>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2">
                              <input
                                checked={!formData.ngay_dang}
                                onChange={() => setFormData({ ...formData, ngay_dang: '' })}
                                className="form-radio text-[#4A90E2] focus:ring-[#4A90E2]/50"
                                name="publish-action"
                                type="radio"
                              />
                              <span className="text-sm">Xuất bản ngay</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                checked={!!formData.ngay_dang}
                                onChange={() => {
                                  if (!formData.ngay_dang) {
                                    const now = new Date();
                                    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                                    setFormData({ ...formData, ngay_dang: now.toISOString().slice(0, 16) });
                                  }
                                }}
                                className="form-radio text-[#4A90E2] focus:ring-[#4A90E2]/50"
                                name="publish-action"
                                type="radio"
                              />
                              <span className="text-sm">Lên lịch sau</span>
                            </label>
                            {formData.ngay_dang && (
                              <input
                                type="datetime-local"
                                value={formData.ngay_dang}
                                onChange={(e) => setFormData({ ...formData, ngay_dang: e.target.value })}
                                className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Categorization Box */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-bold mb-4">Phân loại</h3>
                      <div className="flex flex-col gap-4">
                        <label className="flex flex-col w-full">
                          <p className="text-base font-medium leading-normal pb-2">Danh mục</p>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="form-select flex w-full min-w-0 flex-1 rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-12 p-2 text-base font-normal leading-normal"
                          >
                            <option value="">Chọn danh mục</option>
                            <option value="Giới thiệu">Giới thiệu</option>
                            <option value="Hướng dẫn">Hướng dẫn</option>
                            <option value="Lợi ích">Lợi ích</option>
                          </select>
                        </label>
                        <label className="flex flex-col w-full">
                          <p className="text-base font-medium leading-normal pb-2">Tags</p>
                          <div className="relative">
                            <input
                              type="text"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 p-2 text-base font-normal leading-normal"
                              placeholder="Thêm tags..."
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4A90E2] hover:text-[#4A90E2]/80"
                            >
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>add</span>
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {tagList.map((tag, index) => (
                              <span key={index} className="inline-flex items-center gap-1 bg-[#4A90E2]/20 text-[#4A90E2] text-sm font-medium px-2 py-1 rounded-full">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="focus:outline-none hover:bg-[#4A90E2]/30 rounded-full"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                                </button>
                              </span>
                            ))}
                          </div>
                        </label>
                      </div>
                    </div>
                  
                    {/* SEO Settings Box */}
                    <details className="bg-white p-6 rounded-xl border border-gray-200 group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-lg font-bold">Cài đặt SEO</h3>
                        <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
                      </summary>
                      <div className="mt-4 flex flex-col gap-4">
                        <label className="flex flex-col w-full">
                          <p className="text-base font-medium leading-normal pb-2">Meta Title</p>
                          <input
                            type="text"
                            value={formData.meta_title}
                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                            className="form-input flex w-full rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 p-2 text-base font-normal"
                            placeholder="Nhập meta title"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <p className="text-base font-medium leading-normal pb-2">Meta Description</p>
                          <textarea
                            value={formData.meta_description}
                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                            className="form-input flex w-full rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 min-h-28 placeholder:text-gray-400 p-2 text-base font-normal"
                            placeholder="Nhập meta description"
                          />
                        </label>
                        <label className="flex flex-col w-full">
                          <p className="text-base font-medium leading-normal pb-2">URL thân thiện SEO</p>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.slug || formData.tieu_de.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                              className="form-input w-full rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 border border-gray-200 bg-gray-50 h-12 placeholder:text-gray-400 p-2 text-base font-normal pr-8"
                              placeholder="slug-bai-viet"
                            />
                            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                          </div>
                        </label>
                      </div>
                    </details>

                    {/* Media Gallery */}
                    <details className="bg-white p-6 rounded-xl border border-gray-200 group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-lg font-bold">Media Gallery</h3>
                        <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
                      </summary>
                      <div className="mt-4 space-y-4">
                        <div>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleUploadFile}
                            disabled={uploading}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#4A90E2]/10 file:text-[#4A90E2] hover:file:bg-[#4A90E2]/20 disabled:opacity-50"
                          />
                          {uploading && <p className="text-xs text-gray-500 mt-1">Đang tải lên...</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={newMedia.url}
                              onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                              placeholder="URL media"
                            />
                          </div>
                          <div>
                            <select
                              value={newMedia.loai}
                              onChange={(e) => setNewMedia({ ...newMedia, loai: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                            >
                              <option value="anh">Ảnh</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddMedia}
                          disabled={!newMedia.url.trim()}
                          className="w-full px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#4A90E2]/90 text-sm disabled:opacity-50"
                        >
                          + Thêm Media
                        </button>

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {mediaList.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Chưa có media</p>
                          ) : (
                            mediaList.map((media, index) => (
                              <div key={media.id || index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex-shrink-0">
                                  {media.loai === 'video' ? (
                                    <video src={media.url} className="w-16 h-16 object-cover rounded" controls={false} />
                                  ) : (
                                    <img src={media.url} alt={media.mo_ta || `Media ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-600 truncate">{media.url}</p>
                                  {media.mo_ta && <p className="text-xs text-gray-500">{media.mo_ta}</p>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMedia(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </details>
                  </aside>
                </div>
              </form>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

