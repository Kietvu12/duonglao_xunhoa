import { useState, useEffect } from "react";
import outside1 from "../assets/Outside1.png";
import outside2 from "../assets/Outside2.png";
import { normalizeImageUrl } from "../utils/imageUtils";
import { baiVietAPI } from "../services/api";

const BlogSession2 = ({ posts = [], loading = false, error = null, onPostClick }) => {
  // State cho filters
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // State cho expanded categories - key là category name, value là { expanded: bool, page: number }
  const [expandedCategories, setExpandedCategories] = useState({});
  // Filter posts based on search và date
  useEffect(() => {
    let filtered = [...posts];
    
    // Filter by search - chỉ tìm theo tiêu đề
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(post => {
        const tieuDe = post.tieu_de?.toLowerCase() || '';
        return tieuDe.includes(searchLower);
      });
    }
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.ngay_dang || post.ngay_tao);
        return postDate >= new Date(startDate);
      });
    }
    
    if (endDate) {
      filtered = filtered.filter(post => {
        const postDate = new Date(post.ngay_dang || post.ngay_tao);
        return postDate <= new Date(endDate);
      });
    }
    
    setFilteredPosts(filtered);
  }, [posts, search, startDate, endDate]);

  const handleToggleCategory = (category) => {
    setExpandedCategories(prev => {
      const current = prev[category] || { expanded: false, page: 1 };
      return {
        ...prev,
        [category]: {
          expanded: !current.expanded,
          page: 1 // Reset to page 1 when toggling
        }
      };
    });
  };

  const handleCategoryPageChange = (category, newPage) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        page: newPage
      }
    }));
  };

  const getCategoryPosts = (category, categoryBlocks) => {
    const categoryState = expandedCategories[category] || { expanded: false, page: 1 };
    
    if (!categoryState.expanded) {
      // Collapsed: Show 3 posts
      return {
        posts: categoryBlocks.slice(0, 3),
        totalPages: 0,
        currentPage: 1,
        hasMore: categoryBlocks.length > 3
      };
    } else {
      // Expanded: Show 9 posts per page with pagination
      const postsPerPage = 9;
      const startIndex = (categoryState.page - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const totalPages = Math.ceil(categoryBlocks.length / postsPerPage);
      
      return {
        posts: categoryBlocks.slice(startIndex, endIndex),
        totalPages,
        currentPage: categoryState.page,
        hasMore: false // Always show pagination when expanded
      };
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

  // Lấy ảnh đại diện từ bài viết
  const getPostImage = (post) => {
    if (post.anh_dai_dien) {
      const normalizedUrl = normalizeImageUrl(post.anh_dai_dien);
      if (normalizedUrl) return normalizedUrl;
    }
    // Fallback to default image
    return outside1;
  };

  // Tạo mô tả ngắn từ nội dung HTML
  const getShortDescription = (noiDung) => {
    if (!noiDung) return '';
    // Loại bỏ HTML tags
    const text = noiDung.replace(/<[^>]*>/g, '');
    // Lấy 150 ký tự đầu
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
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

  // Chuyển đổi posts từ API thành format cho component (sử dụng filteredPosts)
  const contentBlocks = filteredPosts.map(post => {
    // Xử lý category: null, empty string, hoặc chỉ có khoảng trắng -> "Khác"
    let category = post.category;
    if (!category || category.trim() === '') {
      category = 'Khác';
    }
    
    return {
      id: post.id,
      title: post.tieu_de || '',
      description: post.mo_ta_ngan || getShortDescription(post.noi_dung), // Ưu tiên dùng mo_ta_ngan từ database
      date: formatDate(post.ngay_dang || post.ngay_tao),
      category: category,
      image: getPostImage(post),
      // Giữ nguyên toàn bộ dữ liệu post để dùng khi click
      ...post
    };
  });
  

  // Tự động nhóm bài viết theo các category thực tế từ database
  const categoryMap = new Map();
  contentBlocks.forEach(block => {
    const category = block.category || 'Khác';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category).push(block);
  });

  // Tạo sections từ các category có trong database
  const sections = Array.from(categoryMap.entries()).map(([category, blocks], index) => ({
    id: index + 1,
    title: getCategoryDisplayName(category), // Hiển thị tên category đã được chuyển đổi
    category: category, // Giữ nguyên category gốc để dùng cho breadcrumb
    blocks: blocks
  }));

  // Hiển thị loading state
  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#2D2D2D' }}>Đang tải bài viết...</p>
          </div>
        </div>
      </section>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: '#A90046' }}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 lg:py-32 bg-white" data-blog-session="list">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        {/* Search and Filter Bar - Luôn hiển thị */}
        <div className="mb-12 rounded-lg p-4 md:p-6 border" style={{ 
          background: '#F9F6F1',
          borderColor: 'rgba(201, 168, 112, 0.2)'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                Tìm kiếm theo tiêu đề
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ khóa..."
                className="w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2"
                style={{ 
                  borderColor: 'rgba(201, 168, 112, 0.3)',
                  color: '#2D2D2D',
                  focusRingColor: '#C9A870'
                }}
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2"
                style={{ 
                  borderColor: 'rgba(201, 168, 112, 0.3)',
                  color: '#2D2D2D',
                  focusRingColor: '#C9A870'
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#2D2D2D' }}>
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-lg bg-white focus:outline-0 focus:ring-2"
                style={{ 
                  borderColor: 'rgba(201, 168, 112, 0.3)',
                  color: '#2D2D2D',
                  focusRingColor: '#C9A870'
                }}
              />
            </div>
          </div>
        </div>

        {/* Sections by Category */}
        {sections.map((section, sectionIndex) => {
          const categoryData = getCategoryPosts(section.category, section.blocks);
          const isExpanded = expandedCategories[section.category]?.expanded || false;
          
          return (
            <div
              key={section.id}
              className={sectionIndex > 0 ? "mt-20 md:mt-24" : ""}
            >
              {/* Section Title */}
              <div className="flex items-center justify-between mb-12 md:mb-16">
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold overflow-visible" style={{ 
                  color: '#2D2D2D', 
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: '1.3',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem'
                }}>
                  {section.title}
                </h2>
                {(categoryData.hasMore || isExpanded) && (
                  <button
                    onClick={() => handleToggleCategory(section.category)}
                    className="flex items-center gap-2 px-4 py-2 transition-colors font-semibold"
                    style={{ 
                      color: '#C9A870',
                      fontFamily: "'Playfair Display', serif"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#A90046'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#C9A870'}
                  >
                    <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                    <span className="material-symbols-outlined">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                )}
              </div>

              {/* Content Blocks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {categoryData.posts.map((block) => (
                  <div
                    key={block.id}
                    className="flex flex-col cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => onPostClick && onPostClick(block)}
                  >
                    {/* Image */}
                    <div className="w-full h-48 md:h-56 overflow-hidden rounded-lg mb-4">
                      <img
                        src={block.image}
                        alt={block.title}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = outside1}
                      />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg md:text-xl font-bold mb-2" style={{ 
                      color: '#2D2D2D', 
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {block.title}
                    </h3>

                    {/* Date */}
                    <p className="text-xs mb-2" style={{ color: '#2D2D2D' }}>{block.date}</p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed line-clamp-3 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
                      {block.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination - Chỉ hiển thị khi expanded và có nhiều hơn 9 bài */}
              {isExpanded && categoryData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => handleCategoryPageChange(section.category, categoryData.currentPage - 1)}
                    disabled={categoryData.currentPage === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ 
                      borderColor: 'rgba(201, 168, 112, 0.3)',
                      color: '#2D2D2D',
                      fontFamily: "'Playfair Display', serif"
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#F9F6F1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Trước
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(categoryData.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Hiển thị trang đầu, cuối và các trang gần current page
                      if (
                        pageNum === 1 ||
                        pageNum === categoryData.totalPages ||
                        (pageNum >= categoryData.currentPage - 2 && pageNum <= categoryData.currentPage + 2)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleCategoryPageChange(section.category, pageNum)}
                            className="px-4 py-2 border rounded-lg transition-colors"
                            style={categoryData.currentPage === pageNum ? {
                              backgroundColor: '#C9A870',
                              color: 'white',
                              borderColor: '#C9A870',
                              fontFamily: "'Playfair Display', serif"
                            } : {
                              borderColor: 'rgba(201, 168, 112, 0.3)',
                              color: '#2D2D2D',
                              fontFamily: "'Playfair Display', serif"
                            }}
                            onMouseEnter={(e) => {
                              if (categoryData.currentPage !== pageNum) {
                                e.currentTarget.style.backgroundColor = '#F9F6F1';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (categoryData.currentPage !== pageNum) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === categoryData.currentPage - 3 ||
                        pageNum === categoryData.currentPage + 3
                      ) {
                        return <span key={pageNum} className="px-2" style={{ color: '#2D2D2D' }}>...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handleCategoryPageChange(section.category, categoryData.currentPage + 1)}
                    disabled={categoryData.currentPage === categoryData.totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    style={{ 
                      borderColor: 'rgba(201, 168, 112, 0.3)',
                      color: '#2D2D2D',
                      fontFamily: "'Playfair Display', serif"
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = '#F9F6F1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State - Hiển thị khi không có bài viết nào */}
        {contentBlocks.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl mb-4" style={{ 
              fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              color: '#C9A870'
            }}>
              search_off
            </span>
            <p className="text-lg mb-2 text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              {search || startDate || endDate 
                ? 'Không tìm thấy bài viết phù hợp với bộ lọc.' 
                : 'Chưa có bài viết nào được xuất bản.'}
            </p>
            {(search || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="mt-4 px-4 py-2 text-sm font-semibold transition-colors"
                style={{ 
                  color: '#C9A870',
                  fontFamily: "'Playfair Display', serif"
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#A90046'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#C9A870'}
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-justify" style={{ color: '#2D2D2D', textAlign: 'justify' }}>
              Không có bài viết nào trong danh mục này.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default BlogSession2;
