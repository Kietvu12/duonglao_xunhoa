import { useEffect, useState, useRef } from 'react';
import { mediaCaNhanBenhNhanAPI, benhNhanAPI, nguoiThanAPI } from '../../services/api';

export default function MediaCaNhanPage() {
  const [medias, setMedias] = useState({}); // { [benhNhanId_nguoiNhaId]: [] }
  const [filteredMedias, setFilteredMedias] = useState({});
  const [benhNhans, setBenhNhans] = useState([]);
  const [nguoiThansMap, setNguoiThansMap] = useState({}); // { [benhNhanId]: [] }
  const [expandedBenhNhans, setExpandedBenhNhans] = useState(new Set()); // Track which patients are expanded
  const [selectedBenhNhan, setSelectedBenhNhan] = useState(null);
  const [selectedNguoiThan, setSelectedNguoiThan] = useState(null);
  const [loading, setLoading] = useState({}); // { [key]: boolean }
  const [sending, setSending] = useState({}); // { [key]: boolean }
  const [message, setMessage] = useState({}); // { [key]: string }
  const [uploadingFile, setUploadingFile] = useState({}); // { [key]: boolean }
  const [selectedFile, setSelectedFile] = useState({}); // { [key]: File }
  const [showFilter, setShowFilter] = useState({}); // { [key]: boolean }
  const [filterDate, setFilterDate] = useState({}); // { [key]: string }
  const [filterSearch, setFilterSearch] = useState({}); // { [key]: string }
  const chatEndRefs = useRef({}); // { [key]: ref }
  const [openMenuId, setOpenMenuId] = useState(null); // Track which message menu is open
  const [editingMessageId, setEditingMessageId] = useState(null); // Track which message is being edited
  const [editMessageText, setEditMessageText] = useState(''); // Text for editing message
  const [searchBenhNhan, setSearchBenhNhan] = useState(''); // Search term for patient name

  useEffect(() => {
    loadBenhNhans();
  }, []);

  useEffect(() => {
    // Load người thân cho tất cả bệnh nhân khi mở rộng
    expandedBenhNhans.forEach(benhNhanId => {
      if (!nguoiThansMap[benhNhanId]) {
        loadNguoiThans(benhNhanId);
      }
    });
  }, [expandedBenhNhans]);

  useEffect(() => {
    if (selectedBenhNhan && selectedNguoiThan) {
      loadMedias(selectedBenhNhan.id, selectedNguoiThan.id);
    }
  }, [selectedBenhNhan, selectedNguoiThan]);

  useEffect(() => {
    applyFilters();
  }, [medias, filterDate, filterSearch]);

  useEffect(() => {
    if (selectedBenhNhan && selectedNguoiThan) {
      scrollToBottom(getChatKey(selectedBenhNhan.id, selectedNguoiThan.id));
    }
  }, [filteredMedias, selectedBenhNhan, selectedNguoiThan]);

  const getChatKey = (benhNhanId, nguoiNhaId) => {
    return `${benhNhanId}_${nguoiNhaId}`;
  };

  const scrollToBottom = (key) => {
    const ref = chatEndRefs.current[key];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const applyFilters = () => {
    const filtered = {};
    Object.keys(medias).forEach(key => {
      let filteredList = [...medias[key]];

      // Lọc theo ngày
      if (filterDate[key]) {
        filteredList = filteredList.filter(media => {
          const mediaDate = new Date(media.ngay_gui).toISOString().split('T')[0];
          return mediaDate === filterDate[key];
        });
      }

      // Lọc theo nội dung tin nhắn
      if (filterSearch[key]?.trim()) {
        const searchLower = filterSearch[key].toLowerCase();
        filteredList = filteredList.filter(media => {
          const loiNhan = (media.loi_nhan || '').toLowerCase();
          return loiNhan.includes(searchLower);
        });
      }

      // Sắp xếp theo ngày gửi tăng dần (cũ nhất trước, mới nhất sau)
      filteredList.sort((a, b) => {
        const dateA = new Date(a.ngay_gui).getTime();
        const dateB = new Date(b.ngay_gui).getTime();
        return dateA - dateB;
      });

      filtered[key] = filteredList;
    });

    setFilteredMedias(filtered);
  };

  const loadBenhNhans = async () => {
    try {
      const response = await benhNhanAPI.getAll({ limit: -1 });
      setBenhNhans(response.data || []);
    } catch (error) {
      console.error('Error loading benh nhans:', error);
    }
  };

  const loadNguoiThans = async (benhNhanId) => {
    try {
      const response = await nguoiThanAPI.getAll({ id_benh_nhan: benhNhanId });
      setNguoiThansMap(prev => ({
        ...prev,
        [benhNhanId]: response.data || []
      }));
    } catch (error) {
      console.error('Error loading nguoi thans:', error);
    }
  };

  const loadMedias = async (benhNhanId, nguoiNhaId) => {
    if (!benhNhanId || !nguoiNhaId) return;
    
    const key = getChatKey(benhNhanId, nguoiNhaId);
    
    try {
      setLoading(prev => ({ ...prev, [key]: true }));
      const params = {
        id_benh_nhan: benhNhanId,
        id_nguoi_nha: nguoiNhaId,
        limit: 1000,
      };
      const response = await mediaCaNhanBenhNhanAPI.getAll(params);
      setMedias(prev => ({
        ...prev,
        [key]: response.data || []
      }));
      setFilterDate(prev => ({ ...prev, [key]: '' }));
      setFilterSearch(prev => ({ ...prev, [key]: '' }));
    } catch (error) {
      console.error('Error loading medias:', error);
      alert('Lỗi khi tải tin nhắn: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleFileSelect = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 50MB');
        return;
      }
      setSelectedFile(prev => ({ ...prev, [key]: file }));
    }
  };

  const handleSendMessage = async (benhNhanId, nguoiNhaId) => {
    if (!benhNhanId || !nguoiNhaId) {
      alert('Vui lòng chọn bệnh nhân và người nhà');
      return;
    }

    const key = getChatKey(benhNhanId, nguoiNhaId);
    const currentMessage = message[key] || '';
    const currentFile = selectedFile[key] || null;

    if (!currentMessage.trim() && !currentFile) {
      alert('Vui lòng nhập tin nhắn hoặc chọn file');
      return;
    }

    try {
      setSending(prev => ({ ...prev, [key]: true }));
      let fileUrl = null;

      // Upload file nếu có
      if (currentFile) {
        setUploadingFile(prev => ({ ...prev, [key]: true }));
        try {
          const uploadResponse = await mediaCaNhanBenhNhanAPI.uploadFile(currentFile);
          fileUrl = uploadResponse.data?.url || uploadResponse.url;
        } catch (error) {
          alert('Lỗi khi upload file: ' + error.message);
          setUploadingFile(prev => ({ ...prev, [key]: false }));
          setSending(prev => ({ ...prev, [key]: false }));
          return;
        }
        setUploadingFile(prev => ({ ...prev, [key]: false }));
      }

      // Gửi tin nhắn
      await mediaCaNhanBenhNhanAPI.create({
        id_benh_nhan: benhNhanId,
        id_nguoi_nha: nguoiNhaId,
        duong_dan_anh: fileUrl,
        loi_nhan: currentMessage.trim() || null,
        ngay_gui: new Date().toISOString(),
      });

      setMessage(prev => ({ ...prev, [key]: '' }));
      setSelectedFile(prev => ({ ...prev, [key]: null }));
      // Reset file input
      const fileInput = document.getElementById(`file-input-${key}`);
      if (fileInput) fileInput.value = '';
      
      await loadMedias(benhNhanId, nguoiNhaId);
      
      // Scroll xuống cuối sau khi load tin nhắn mới
      setTimeout(() => {
        scrollToBottom(key);
      }, 100);
    } catch (error) {
      alert('Lỗi khi gửi tin nhắn: ' + error.message);
    } finally {
      setSending(prev => ({ ...prev, [key]: false }));
    }
  };

  const toggleBenhNhan = (benhNhanId) => {
    setExpandedBenhNhans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(benhNhanId)) {
        newSet.delete(benhNhanId);
      } else {
        newSet.add(benhNhanId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    
    // Đảm bảo cả 2 đều ở cùng timezone
    const dateTime = date.getTime();
    const nowTime = now.getTime();
    const diffMs = nowTime - dateTime;
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSecs < 10) return 'Vừa xong';
    if (diffMins < 1) return 'Vài giây trước';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isImage = (url) => {
    if (!url) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isVideo = (url) => {
    if (!url) return false;
    return /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(url);
  };

  const handleDeleteMessage = async (mediaId, chatKey) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) {
      return;
    }

    try {
      await mediaCaNhanBenhNhanAPI.delete(mediaId);
      // Reload messages
      if (selectedBenhNhan && selectedNguoiThan) {
        await loadMedias(selectedBenhNhan.id, selectedNguoiThan.id);
      }
      setOpenMenuId(null);
    } catch (error) {
      alert('Lỗi khi xóa tin nhắn: ' + error.message);
    }
  };

  const handleEditMessage = (media) => {
    setEditingMessageId(media.id);
    setEditMessageText(media.loi_nhan || '');
    setOpenMenuId(null);
  };

  const handleSaveEdit = async (mediaId, chatKey) => {
    try {
      await mediaCaNhanBenhNhanAPI.update(mediaId, {
        loi_nhan: editMessageText.trim() || null,
      });
      // Reload messages
      if (selectedBenhNhan && selectedNguoiThan) {
        await loadMedias(selectedBenhNhan.id, selectedNguoiThan.id);
      }
      setEditingMessageId(null);
      setEditMessageText('');
    } catch (error) {
      alert('Lỗi khi sửa tin nhắn: ' + error.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditMessageText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] font-raleway">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-800">Media Cá nhân Bệnh nhân</h1>
            <p className="text-gray-600 mt-2">Chat và chia sẻ media với người nhà bệnh nhân</p>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Left Sidebar - Danh sách bệnh nhân */}
        <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Danh sách bệnh nhân</h2>
            <div className="relative">
              <input
                type="text"
                value={searchBenhNhan}
                onChange={(e) => setSearchBenhNhan(e.target.value)}
                placeholder="Tìm kiếm tên bệnh nhân..."
                className="w-full px-3 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                search
              </span>
              {searchBenhNhan && (
                <button
                  onClick={() => setSearchBenhNhan('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {(() => {
              // Filter bệnh nhân theo từ khóa tìm kiếm
              const filteredBenhNhans = benhNhans.filter(bn => {
                if (!searchBenhNhan.trim()) return true;
                const searchLower = searchBenhNhan.toLowerCase();
                return (bn.ho_ten || '').toLowerCase().includes(searchLower);
              });

              if (filteredBenhNhans.length === 0) {
                return (
                  <div className="p-4 text-center text-gray-500">
                    <p>{searchBenhNhan ? 'Không tìm thấy bệnh nhân nào' : 'Chưa có bệnh nhân nào'}</p>
                  </div>
                );
              }

              return (
                <div className="p-2">
                  {filteredBenhNhans.map((bn) => {
                  const isExpanded = expandedBenhNhans.has(bn.id);
                  const nguoiThans = nguoiThansMap[bn.id] || [];
                  
                  return (
                    <div key={bn.id} className="mb-2">
                      <button
                        onClick={() => toggleBenhNhan(bn.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isExpanded
                            ? 'bg-[#4A90E2] text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold">{bn.ho_ten}</div>
                          <span className="material-symbols-outlined text-base transition-transform" style={{ 
                            fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                          }}>
                            expand_more
                          </span>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-2 ml-4 space-y-2">
                          {nguoiThans.length === 0 ? (
                            <div className="p-2 text-sm text-gray-500">Chưa có người nhà</div>
                          ) : (
                            nguoiThans.map((nt) => {
                              const chatKey = getChatKey(bn.id, nt.id);
                              const isSelected = selectedBenhNhan?.id === bn.id && selectedNguoiThan?.id === nt.id;
                              
                              return (
                                <button
                                  key={nt.id}
                                  onClick={() => {
                                    setSelectedBenhNhan(bn);
                                    setSelectedNguoiThan(nt);
                                    if (!medias[chatKey]) {
                                      loadMedias(bn.id, nt.id);
                                    }
                                  }}
                                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                                    isSelected
                                      ? 'bg-[#4A90E2]/20 text-[#4A90E2] border border-[#4A90E2]'
                                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <div className="font-medium text-sm">{nt.ho_ten}</div>
                                  <div className="text-xs text-gray-500">{nt.moi_quan_he || 'Người nhà'}</div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedBenhNhan || !selectedNguoiThan ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat_bubble_outline</span>
                <p className="text-gray-500 text-lg">Chọn bệnh nhân và người nhà để xem tin nhắn</p>
              </div>
            </div>
          ) : (() => {
            const chatKey = getChatKey(selectedBenhNhan.id, selectedNguoiThan.id);
            const currentMedias = filteredMedias[chatKey] || [];
            const currentLoading = loading[chatKey] || false;
            const currentSending = sending[chatKey] || false;
            const currentUploadingFile = uploadingFile[chatKey] || false;
            const currentMessage = message[chatKey] || '';
            const currentFile = selectedFile[chatKey] || null;
            const currentShowFilter = showFilter[chatKey] || false;
            const currentFilterDate = filterDate[chatKey] || '';
            const currentFilterSearch = filterSearch[chatKey] || '';

            return (
              <>
                {/* Chat Header với Filter */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedNguoiThan.ho_ten}</h3>
                      <p className="text-sm text-gray-500">{selectedNguoiThan.moi_quan_he || 'Người nhà'} - {selectedBenhNhan.ho_ten}</p>
                    </div>
                    <button
                      onClick={() => setShowFilter(prev => ({ ...prev, [chatKey]: !prev[chatKey] }))}
                      className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>filter_list</span>
                      Lọc
                    </button>
                  </div>
                  
                  {currentShowFilter && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Lọc theo ngày</label>
                        <input
                          type="date"
                          value={currentFilterDate}
                          onChange={(e) => setFilterDate(prev => ({ ...prev, [chatKey]: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tìm kiếm nội dung</label>
                        <input
                          type="text"
                          value={currentFilterSearch}
                          onChange={(e) => setFilterSearch(prev => ({ ...prev, [chatKey]: e.target.value }))}
                          placeholder="Nhập từ khóa..."
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50"
                        />
                      </div>
                      {(currentFilterDate || currentFilterSearch) && (
                        <div className="md:col-span-2">
                          <button
                            onClick={() => {
                              setFilterDate(prev => ({ ...prev, [chatKey]: '' }));
                              setFilterSearch(prev => ({ ...prev, [chatKey]: '' }));
                            }}
                            className="text-sm text-[#4A90E2] hover:underline"
                          >
                            Xóa bộ lọc
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {currentLoading ? (
                    <div className="text-center text-gray-500">Đang tải...</div>
                  ) : currentMedias.length === 0 ? (
                    <div className="text-center text-gray-500">
                      <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chat_bubble_outline</span>
                      <p>Chưa có tin nhắn nào</p>
                    </div>
                  ) : (
                    currentMedias.map((media) => {
                      const isFromStaff = !!media.id_dieu_duong;
                      const isEditing = editingMessageId === media.id;
                      const menuId = `menu-${media.id}`;
                      const isMenuOpen = openMenuId === menuId;
                      
                      // Debug: log để kiểm tra
                      // console.log('Media:', media.id, 'isFromStaff:', isFromStaff, 'isEditing:', isEditing);
                      
                      return (
                        <div
                          key={media.id}
                          data-media-id={media.id}
                          className={`flex ${isFromStaff ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isFromStaff ? 'order-2' : 'order-1'} relative`}>
                            <div className={`rounded-lg p-4 ${
                              isFromStaff 
                                ? 'bg-[#4A90E2] text-white' 
                                : 'bg-white border border-gray-200 text-gray-800'
                            }`}>
                              {/* Sender info */}
                              <div className="text-xs opacity-75 mb-2">
                                {isFromStaff ? (media.ten_dieu_duong || 'Nhân viên') : (media.ten_nguoi_nha || 'Người nhà')}
                              </div>

                              {/* Media */}
                              {media.duong_dan_anh && (
                                <div className="mb-2">
                                  {isImage(media.duong_dan_anh) ? (
                                    <img
                                      src={media.duong_dan_anh}
                                      alt="Media"
                                      className="max-w-full max-h-64 rounded-lg object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  ) : isVideo(media.duong_dan_anh) ? (
                                    <video
                                      src={media.duong_dan_anh}
                                      controls
                                      className="max-w-full max-h-64 rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    >
                                      Trình duyệt không hỗ trợ video
                                    </video>
                                  ) : (
                                    <a
                                      href={media.duong_dan_anh}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:underline"
                                    >
                                      Xem file
                                    </a>
                                  )}
                                </div>
                              )}

                              {/* Message - Edit mode or display mode */}
                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editMessageText}
                                    onChange={(e) => setEditMessageText(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleSaveEdit(media.id, chatKey)}
                                      className="px-3 py-1 text-sm bg-[#4A90E2] text-white rounded hover:bg-[#4A90E2]/90 transition-colors"
                                    >
                                      Lưu
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                media.loi_nhan && (
                                  <p className="whitespace-pre-wrap break-words">{media.loi_nhan}</p>
                                )
                              )}

                              {/* Time */}
                              <div className="text-xs opacity-75 mt-2">
                                {formatDate(media.ngay_gui)}
                              </div>
                            </div>
                            
                            {/* Menu button below message - Only show for staff messages */}
                            {isFromStaff && !isEditing && (
                              <div className="mt-1 flex justify-end relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(isMenuOpen ? null : menuId);
                                  }}
                                  className={`p-1.5 rounded-full transition-colors ${
                                    isMenuOpen 
                                      ? 'bg-gray-200 text-gray-700' 
                                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                                  }`}
                                  title="Tùy chọn"
                                  style={{ opacity: 0.6 }}
                                >
                                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                                    more_vert
                                  </span>
                                </button>
                                
                                {/* Dropdown menu */}
                                {isMenuOpen && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={() => setOpenMenuId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[120px]">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditMessage(media);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                      >
                                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>edit</span>
                                        Sửa
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteMessage(media.id, chatKey);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                      >
                                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>delete</span>
                                        Xóa
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={el => chatEndRefs.current[chatKey] = el} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white p-4">
                  {currentFile && (
                    <div className="mb-3 flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="material-symbols-outlined text-base text-gray-600" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>
                        {isImage(currentFile.name) ? 'image' : isVideo(currentFile.name) ? 'videocam' : 'attach_file'}
                      </span>
                      <span className="flex-1 text-sm text-gray-700 truncate">{currentFile.name}</span>
                      <button
                        onClick={() => {
                          setSelectedFile(prev => ({ ...prev, [chatKey]: null }));
                          const fileInput = document.getElementById(`file-input-${chatKey}`);
                          if (fileInput) fileInput.value = '';
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>close</span>
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <label className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors">
                      <input
                        id={`file-input-${chatKey}`}
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleFileSelect(e, chatKey)}
                        className="hidden"
                      />
                      <span className="material-symbols-outlined text-xl text-gray-600" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>attach_file</span>
                    </label>
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setMessage(prev => ({ ...prev, [chatKey]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(selectedBenhNhan.id, selectedNguoiThan.id);
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      rows={1}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg resize-none focus:outline-0 focus:ring-2 focus:ring-[#4A90E2]/50 text-gray-800"
                    />
                    <button
                      onClick={() => handleSendMessage(selectedBenhNhan.id, selectedNguoiThan.id)}
                      disabled={currentSending || currentUploadingFile || (!currentMessage.trim() && !currentFile)}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4A90E2] text-white hover:bg-[#4A90E2]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentSending || currentUploadingFile ? (
                        <span className="material-symbols-outlined text-xl animate-spin" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>hourglass_empty</span>
                      ) : (
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>send</span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
