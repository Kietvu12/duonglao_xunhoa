import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import BlogSession1 from '../components/BlogSession1';
import BlogSession2 from '../components/BlogSession2';
import BlogDetail from '../components/BlogDetail';
import SeoHead from '../components/SeoHead';
import { baiVietAPI, tuyenDungAPI } from '../services/api';
import {
  buildBaiVietPath,
  buildTuyenDungPath,
  parseTuyenDungParam,
  slugifyVietnamese,
} from '../utils/slugify';

/** decodeURIComponent an toàn — % lỗi không làm văng vào catch và coi như lỗi API */
function safeDecodePathSegment(segment) {
  if (segment == null || segment === '') return '';
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Lấy slug bài viết / job từ Route params; nếu thiếu thì parse pathname (dự phòng khi useMatch/useParams lệch bối cảnh).
 */
function useBlogRouteSegments() {
  const params = useParams();
  const { pathname } = useLocation();

  let articleSlug = params.slug;
  if (articleSlug === undefined || articleSlug === '') {
    const m = pathname.match(/\/blog\/bai-viet\/([^/]+)\/?$/);
    if (m) articleSlug = safeDecodePathSegment(m[1]);
  } else {
    articleSlug = safeDecodePathSegment(articleSlug);
  }

  let jobSlugParam = params.jobSlug;
  if (jobSlugParam === undefined || jobSlugParam === '') {
    const m = pathname.match(/\/blog\/tuyen-dung\/([^/]+)\/?$/);
    if (m) jobSlugParam = safeDecodePathSegment(m[1]);
  } else {
    jobSlugParam = safeDecodePathSegment(jobSlugParam);
  }

  return { articleSlug: articleSlug || undefined, jobSlugParam: jobSlugParam || undefined };
}

const Blog = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { articleSlug, jobSlugParam } = useBlogRouteSegments();
  /** Khi mở bài từ list/home, lưu id để nếu slug trên URL lệch DB thì vẫn tải được bài */
  const postIdNavFallback =
    location.state && typeof location.state === 'object' && location.state.postId != null
      ? location.state.postId
      : undefined;
  const legacyPostId = searchParams.get('post');
  const tabFromQuery = searchParams.get('tab') || 'bai-viet';
  const activeTab = articleSlug ? 'bai-viet' : jobSlugParam ? 'tuyen-dung' : tabFromQuery;

  const isDetailRoute = Boolean(articleSlug || jobSlugParam);

  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [tinTuyenDungs, setTinTuyenDungs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /** Lỗi tải chi tiết (không điều hướng về /blog để tránh nháy + mất URL debug) */
  const [detailError, setDetailError] = useState(null);

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

  const loadTinTuyenDungById = useCallback(async (id) => {
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
      navigate('/blog?tab=tuyen-dung', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const redirectLegacyBaiViet = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const response = await baiVietAPI.getById(id);
        const slug =
          response.data.slug ||
          slugifyVietnamese(response.data.tieu_de || 'bai-viet');
        navigate(`/blog/bai-viet/${encodeURIComponent(slug)}`, { replace: true });
      } catch (err) {
        console.error('Error loading post detail:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
        navigate('/blog?tab=bai-viet', { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const redirectLegacyTuyenDung = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const response = await tuyenDungAPI.getTinTuyenDungById(id);
        if (response.success && response.data) {
          navigate(buildTuyenDungPath(response.data), { replace: true });
        } else {
          throw new Error('Không tìm thấy tin tuyển dụng');
        }
      } catch (err) {
        console.error('Error loading tin tuyen dung detail:', err);
        setError('Không thể tải tin tuyển dụng. Vui lòng thử lại sau.');
        navigate('/blog?tab=tuyen-dung', { replace: true });
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (articleSlug || jobSlugParam) return;
    if (activeTab === 'bai-viet') {
      loadPosts({ limit: 100 });
    } else if (activeTab === 'tuyen-dung') {
      loadTinTuyenDungs();
    }
  }, [activeTab, articleSlug, jobSlugParam]);

  useEffect(() => {
    if (!articleSlug) return undefined;
    setSelectedPost(null);
    setDetailError(null);
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        let row = null;
        const fetchDetail = async (idOrSlug) => {
          const response = await baiVietAPI.getById(idOrSlug);
          return response?.data ?? response;
        };

        try {
          row = await fetchDetail(articleSlug);
        } catch (errBySlug) {
          if (
            postIdNavFallback != null &&
            String(postIdNavFallback) !== String(articleSlug)
          ) {
            row = await fetchDetail(postIdNavFallback);
          } else {
            /* Truy cập trực tiếp URL: slug trên link đôi khi là slugify(tiêu đề) trong khi DB lưu
               cùng gốc + hậu tố (-1, -2). Từ danh sách vẫn mở được nhờ fallback theo id trong state. */
            const listRes = await baiVietAPI.getAll({
              trang_thai: 'xuat_ban',
              limit: 500,
            });
            const items = listRes.data || [];
            const decoded = String(articleSlug).trim();

            const bySlugifyTitle = items.filter(
              (p) => slugifyVietnamese(p.tieu_de || p.title || '') === decoded
            );
            if (bySlugifyTitle.length === 1) {
              row = await fetchDetail(bySlugifyTitle[0].id);
            } else {
              const byPrefix = items.filter(
                (p) =>
                  p.slug &&
                  (String(p.slug) === decoded ||
                    String(p.slug).startsWith(`${decoded}-`))
              );
              if (byPrefix.length === 1) {
                row = await fetchDetail(byPrefix[0].id);
              } else {
                throw errBySlug;
              }
            }
          }
        }
        if (!row || (typeof row === 'object' && !row.id && !row.tieu_de)) {
          throw new Error('Dữ liệu bài viết không hợp lệ');
        }
        if (!cancelled) setSelectedPost(row);
      } catch (err) {
        console.error('Error loading post detail:', err);
        if (!cancelled) {
          setDetailError(
            err?.message || 'Không thể tải bài viết. Vui lòng thử lại sau.'
          );
          setSelectedPost(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [articleSlug, postIdNavFallback]);

  useEffect(() => {
    if (!jobSlugParam) return;
    const id = parseTuyenDungParam(jobSlugParam);
    if (id == null) {
      setError('Đường dẫn tin tuyển dụng không hợp lệ.');
      navigate('/blog?tab=tuyen-dung', { replace: true });
      return;
    }
    loadTinTuyenDungById(id);
  }, [jobSlugParam, navigate, loadTinTuyenDungById]);

  useEffect(() => {
    if (articleSlug || jobSlugParam) return;
    if (!legacyPostId) {
      setSelectedPost(null);
      return;
    }
    if (activeTab === 'bai-viet') {
      redirectLegacyBaiViet(legacyPostId);
    } else if (activeTab === 'tuyen-dung') {
      redirectLegacyTuyenDung(legacyPostId);
    }
  }, [
    legacyPostId,
    activeTab,
    articleSlug,
    jobSlugParam,
    redirectLegacyBaiViet,
    redirectLegacyTuyenDung,
  ]);

  const handlePostClick = (post) => {
    if (activeTab === 'tuyen-dung') {
      navigate(buildTuyenDungPath(post));
    } else {
      navigate(buildBaiVietPath(post), {
        state: post?.id != null ? { postId: post.id } : undefined,
      });
    }
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

  const detailLoadingView =
    isDetailRoute && loading && !selectedPost && !detailError ? (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Đang tải nội dung...</p>
          </div>
        </div>
      </section>
    ) : null;

  const detailErrorView =
    isDetailRoute && !loading && !selectedPost && detailError ? (
      <section className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-red-600">{detailError}</p>
            <button
              type="button"
              className="text-[#1e4028] underline font-semibold"
              onClick={() => {
                setDetailError(null);
                navigate('/blog?tab=bai-viet', { replace: false });
              }}
            >
              Quay lại danh sách bài viết
            </button>
          </div>
        </div>
      </section>
    ) : null;

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen">
      {!isDetailRoute && (
        <SeoHead
          title={activeTab === 'tuyen-dung' ? 'Tin tuyển dụng' : 'Blog & tin tức'}
          description={
            activeTab === 'tuyen-dung'
              ? 'Cơ hội nghề nghiệp tại Trung tâm trường thọ Xuân Hoa — ứng tuyển trực tuyến, môi trường làm việc chuyên nghiệp.'
              : 'Bài viết về sức khỏe người cao tuổi, hoạt động và tin tức từ Trung tâm trường thọ Xuân Hoa.'
          }
          canonicalPath={activeTab === 'tuyen-dung' ? '/blog?tab=tuyen-dung' : '/blog'}
        />
      )}
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
              <span>Tuyển dụng</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      {isDetailRoute ? (
        <>
          {detailLoadingView}
          {detailErrorView}
          {!loading && !detailError && selectedPost ? (
            <BlogDetail
              post={selectedPost}
              onBack={handleBack}
              isTuyenDung={activeTab === 'tuyen-dung'}
            />
          ) : null}
        </>
      ) : activeTab === 'tuyen-dung' ? (
        <section className="w-full bg-white py-16 md:py-24" data-blog-session="list">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Đang tải tin tuyển dụng...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-lg text-red-600">{error}</p>
              </div>
            ) : tinTuyenDungs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">Hiện chưa có tin tuyển dụng nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tinTuyenDungs.map((tin) => (
                  <div
                    key={tin.id}
                    className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handlePostClick(tin)}
                  >
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-[#1e4028]">
                      {tin.tieu_de}
                    </h3>
                    {tin.vi_tri && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Vị trí:</span> {tin.vi_tri}
                      </p>
                    )}
                    {tin.so_luong ? (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Số lượng:</span> {tin.so_luong}
                      </p>
                    ) : null}
                    {tin.ngay_het_han && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold">Hạn nộp:</span> {formatDate(tin.ngay_het_han)}
                      </p>
                    )}
                    {tin.mo_ta && (
                      <p className="text-sm text-gray-600 leading-relaxed mt-2 line-clamp-3">
                        {tin.mo_ta}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#1e4028]">
                      Xem chi tiết
                      <span className="ml-1">→</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <BlogSession2
          posts={posts}
          loading={loading}
          error={error}
          onPostClick={handlePostClick}
        />
      )}
    </div>
  );
};

export default Blog;
