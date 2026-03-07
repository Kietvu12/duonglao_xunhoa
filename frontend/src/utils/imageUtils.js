/**
 * Utility functions để xử lý URL ảnh
 */

/**
 * Normalize image URL - xử lý cả URL cũ (localhost) và URL mới (production)
 * @param {string} imagePath - Đường dẫn ảnh từ database hoặc API
 * @returns {string|null} - URL ảnh đã được normalize hoặc null nếu không hợp lệ
 */
export const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Kiểm tra xem đang chạy ở localhost hay production
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.')
  );
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:4545/api' : 'https://duonglaoxuanhoa.net/api_quanlyduonglao/api');
  // Fix: Xóa "/api" ở cuối để có BASE_URL đúng
  const BASE_URL = API_BASE_URL.replace(/\/api$/, '');
  
  // Nếu là URL đầy đủ
  if (imagePath.startsWith('http')) {
    // Nếu đang ở localhost, giữ nguyên localhost URL
    if (isLocalhost && (imagePath.includes('localhost') || imagePath.includes('127.0.0.1') || imagePath.includes('192.168.'))) {
      // Chỉ sửa nếu có /api trong path
      if (imagePath.includes('/api/uploads/')) {
        const normalized = imagePath.replace('/api/uploads/', '/uploads/');
        console.log('Normalized localhost URL with /api:', imagePath, '->', normalized);
        return normalized;
      }
      console.log('Using localhost URL:', imagePath);
      return imagePath;
    }
    
    // Production: Thay thế localhost/old URLs bằng production URL
    if (!isLocalhost && (imagePath.includes('localhost') || imagePath.includes('192.168.') || imagePath.includes('127.0.0.1'))) {
      // Extract path từ URL cũ
      const urlMatch = imagePath.match(/\/uploads\/.+$/);
      if (urlMatch) {
        const normalized = `${BASE_URL}${urlMatch[0]}`;
        console.log('Normalized old URL to production:', imagePath, '->', normalized);
        return normalized;
      }
    }
    
    // Fix URL nếu thiếu /api_quanlyduonglao (ví dụ: https://duonglaoxuanhoa.net/uploads/...)
    // Phải là: https://duonglaoxuanhoa.net/api_quanlyduonglao/uploads/...
    if (imagePath.includes('duonglaoxuanhoa.net') && !imagePath.includes('api_quanlyduonglao')) {
      const urlMatch = imagePath.match(/https?:\/\/vietdemo\.com(\/uploads\/.+)$/);
      if (urlMatch) {
        const normalized = `${BASE_URL}${urlMatch[1]}`;
        console.log('Fixed URL missing api_quanlyduonglao:', imagePath, '->', normalized);
        return normalized;
      }
    }
    
    // Nếu URL đã đúng format nhưng có /api trong path, loại bỏ
    if (imagePath.includes('/api/uploads/')) {
      const normalized = imagePath.replace('/api/uploads/', '/uploads/');
      console.log('Normalized URL with /api:', imagePath, '->', normalized);
      return normalized;
    }
    
    console.log('Using original URL:', imagePath);
    return imagePath;
  }
  
  // Nếu là path tương đối, thêm base URL
  // Đảm bảo path bắt đầu bằng /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const normalized = `${BASE_URL}${normalizedPath}`;
  console.log('Normalized relative path:', imagePath, '->', normalized);
  return normalized;
};

/**
 * Normalize URLs trong HTML content (thay thế localhost URLs)
 * @param {string} htmlContent - Nội dung HTML có thể chứa URLs localhost
 * @returns {string} - HTML content đã được normalize
 */
export const normalizeHtmlContent = (htmlContent) => {
  if (!htmlContent) return '';
  
  // Kiểm tra environment
  const isLocalhost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.')
  );
  
  // Nếu đang ở localhost, GIỮ NGUYÊN HTML - không normalize
  if (isLocalhost) {
    return htmlContent;
  }
  
  // Production: Normalize localhost URLs to production URLs
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://duonglaoxuanhoa.net/api_quanlyduonglao/api';
  const BASE_URL = API_BASE_URL.replace(/\/api$/, '');
  
  console.log('[normalizeHtmlContent] BASE_URL:', BASE_URL);
  
  // Thay thế các URL localhost/old trong HTML
  let normalized = htmlContent;
  
  // Pattern để tìm URLs trong src attributes
  normalized = normalized.replace(
    /(src=["'])(https?:\/\/(?:localhost|192\.168\.|127\.0\.0\.1)[^"']+)(["'])/gi,
    (match, prefix, url, suffix) => {
      console.log('[normalizeHtmlContent] Found localhost URL:', url);
      // Extract path từ URL cũ
      const urlMatch = url.match(/\/uploads\/.+$/);
      if (urlMatch) {
        const newUrl = `${BASE_URL}${urlMatch[0]}`;
        console.log('[normalizeHtmlContent] Normalized to:', newUrl);
        return `${prefix}${newUrl}${suffix}`;
      }
      return match;
    }
  );
  
  return normalized;
};

/**
 * Image Cache để lưu trữ ảnh đã load thành công
 */
const imageCache = new Map();
const MAX_CACHE_SIZE = 100; // Giới hạn số lượng ảnh trong cache
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 phút

/**
 * Làm sạch cache cũ
 */
const cleanCache = () => {
  const now = Date.now();
  for (const [url, data] of imageCache.entries()) {
    if (now - data.timestamp > CACHE_EXPIRY) {
      imageCache.delete(url);
    }
  }
  
  // Nếu cache vẫn quá lớn, xóa các ảnh cũ nhất
  if (imageCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(imageCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = entries.slice(0, imageCache.size - MAX_CACHE_SIZE);
    toDelete.forEach(([url]) => imageCache.delete(url));
  }
};

/**
 * Preload ảnh - Load ảnh trước khi cần dùng
 * @param {string|string[]} imageUrls - URL ảnh hoặc mảng URLs
 * @returns {Promise} - Promise resolve khi tất cả ảnh đã load
 */
export const preloadImage = (imageUrls) => {
  const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const normalizedUrls = urls.map(url => normalizeImageUrl(url)).filter(Boolean);
  
  return Promise.all(
    normalizedUrls.map(url => {
      // Kiểm tra cache trước
      if (imageCache.has(url)) {
        const cached = imageCache.get(url);
        if (cached.loaded) {
          return Promise.resolve(url);
        }
      }
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          imageCache.set(url, { loaded: true, timestamp: Date.now() });
          cleanCache();
          resolve(url);
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to preload image: ${url}`));
        };
        
        img.src = url;
      });
    })
  );
};

/**
 * Kiểm tra xem ảnh đã được cache chưa
 * @param {string} imageUrl - URL ảnh
 * @returns {boolean} - true nếu ảnh đã được cache
 */
export const isImageCached = (imageUrl) => {
  const normalizedUrl = normalizeImageUrl(imageUrl);
  if (!normalizedUrl) return false;
  
  if (imageCache.has(normalizedUrl)) {
    const cached = imageCache.get(normalizedUrl);
    const now = Date.now();
    // Kiểm tra cache còn hạn không
    if (now - cached.timestamp < CACHE_EXPIRY) {
      return cached.loaded;
    } else {
      imageCache.delete(normalizedUrl);
    }
  }
  return false;
};

/**
 * Xóa cache của một ảnh cụ thể
 * @param {string} imageUrl - URL ảnh cần xóa cache
 */
export const clearImageCache = (imageUrl) => {
  const normalizedUrl = normalizeImageUrl(imageUrl);
  if (normalizedUrl) {
    imageCache.delete(normalizedUrl);
  }
};

/**
 * Xóa toàn bộ cache
 */
export const clearAllImageCache = () => {
  imageCache.clear();
};

/**
 * Load ảnh với retry mechanism
 * @param {string} imageUrl - URL ảnh
 * @param {Object} options - Options
 * @param {number} options.retryCount - Số lần retry (default: 2)
 * @param {number} options.retryDelay - Delay giữa các lần retry (ms, default: 1000)
 * @returns {Promise<string>} - Promise resolve với URL ảnh đã load
 */
export const loadImageWithRetry = async (imageUrl, options = {}) => {
  const { retryCount = 2, retryDelay = 1000 } = options;
  const normalizedUrl = normalizeImageUrl(imageUrl);
  
  if (!normalizedUrl) {
    throw new Error('Invalid image URL');
  }
  
  // Kiểm tra cache
  if (isImageCached(normalizedUrl)) {
    return normalizedUrl;
  }
  
  const attemptLoad = async (attempt = 0) => {
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          imageCache.set(normalizedUrl, { loaded: true, timestamp: Date.now() });
          cleanCache();
          resolve(normalizedUrl);
        };
        
        img.onerror = () => {
          reject(new Error(`Failed to load image (attempt ${attempt + 1})`));
        };
        
        // Thêm cache buster cho retry
        const cacheBuster = attempt > 0 ? `?retry=${attempt}&t=${Date.now()}` : '';
        img.src = normalizedUrl + cacheBuster;
      });
    } catch (error) {
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return attemptLoad(attempt + 1);
      }
      throw error;
    }
  };
  
  return attemptLoad(0);
};

/**
 * Lấy kích thước ảnh mà không load toàn bộ
 * @param {string} imageUrl - URL ảnh
 * @returns {Promise<{width: number, height: number}>} - Kích thước ảnh
 */
export const getImageDimensions = (imageUrl) => {
  const normalizedUrl = normalizeImageUrl(imageUrl);
  
  if (!normalizedUrl) {
    return Promise.reject(new Error('Invalid image URL'));
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for dimensions'));
    };
    
    img.src = normalizedUrl;
  });
};

