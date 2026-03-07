/**
 * VÍ DỤ: Cách sử dụng OptimizedImage trong các component
 * 
 * File này chỉ là ví dụ, không được import vào project
 */

import OptimizedImage from './OptimizedImage';
import { useImageLoader, useImagePreloader } from '../hooks/useImageLoader';
import { preloadImage, loadImageWithRetry } from '../utils/imageUtils';
import { useEffect } from 'react';

// ============================================
// VÍ DỤ 1: Thay thế thẻ <img> đơn giản
// ============================================
export function Example1_SimpleReplacement() {
  const imageUrl = '/uploads/example.jpg';
  
  // TRƯỚC (chậm, không tối ưu):
  // return <img src={imageUrl} alt="Example" className="w-full h-64" />;
  
  // SAU (tối ưu):
  return (
    <OptimizedImage 
      src={imageUrl}
      alt="Example"
      className="w-full h-64 rounded-lg"
      loading="lazy"
    />
  );
}

// ============================================
// VÍ DỤ 2: Với fallback và error handling
// ============================================
export function Example2_WithFallback() {
  const imageUrl = '/uploads/user-avatar.jpg';
  const defaultAvatar = '/assets/default-avatar.png';
  
  return (
    <OptimizedImage 
      src={imageUrl}
      alt="User avatar"
      className="w-32 h-32 rounded-full"
      fallbackSrc={defaultAvatar}
      onLoad={() => console.log('Avatar loaded')}
      onError={() => console.log('Failed to load avatar')}
    />
  );
}

// ============================================
// VÍ DỤ 3: Trong danh sách ảnh (gallery)
// ============================================
export function Example3_ImageGallery({ images = [] }) {
  // Preload ảnh đầu tiên (ảnh quan trọng)
  useEffect(() => {
    if (images.length > 0) {
      preloadImage(images[0]);
    }
  }, [images]);
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((imageUrl, index) => (
        <OptimizedImage
          key={index}
          src={imageUrl}
          alt={`Gallery image ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg"
          loading={index < 3 ? 'eager' : 'lazy'} // 3 ảnh đầu load ngay
          placeholder={true}
        />
      ))}
    </div>
  );
}

// ============================================
// VÍ DỤ 4: Sử dụng hook useImageLoader
// ============================================
export function Example4_WithHook() {
  const imageUrl = '/uploads/product.jpg';
  
  const { 
    imageSrc, 
    isLoading, 
    hasError, 
    retry,
    containerRef 
  } = useImageLoader(imageUrl, {
    lazy: true,
    fallbackSrc: '/assets/default-product.jpg',
    retryCount: 3,
  });
  
  return (
    <div ref={containerRef} className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      
      {hasError && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">Không thể tải ảnh</p>
          <button 
            onClick={retry}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Thử lại
          </button>
        </div>
      )}
      
      {imageSrc && (
        <img 
          src={imageSrc} 
          alt="Product"
          className="w-full h-64 object-cover rounded-lg"
        />
      )}
    </div>
  );
}

// ============================================
// VÍ DỤ 5: Preload nhiều ảnh
// ============================================
export function Example5_PreloadMultiple() {
  const imageUrls = [
    '/uploads/hero1.jpg',
    '/uploads/hero2.jpg',
    '/uploads/hero3.jpg',
  ];
  
  const { 
    preload, 
    isPreloading, 
    preloadedCount, 
    totalCount 
  } = useImagePreloader(imageUrls, { immediate: false });
  
  return (
    <div>
      <button 
        onClick={preload}
        disabled={isPreloading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isPreloading 
          ? `Đang preload... (${preloadedCount}/${totalCount})`
          : 'Preload ảnh'
        }
      </button>
    </div>
  );
}

// ============================================
// VÍ DỤ 6: Blog post với ảnh đại diện
// ============================================
export function Example6_BlogPost({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <OptimizedImage
        src={post.anh_dai_dien}
        alt={post.tieu_de}
        className="w-full h-48 object-cover"
        loading="lazy"
        fallbackSrc="/assets/default-blog.jpg"
        placeholder={true}
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{post.tieu_de}</h2>
        <p className="text-gray-600">{post.mo_ta_ngan}</p>
      </div>
    </article>
  );
}

// ============================================
// VÍ DỤ 7: User avatar với kích thước cố định
// ============================================
export function Example7_UserAvatar({ user }) {
  return (
    <OptimizedImage
      src={user.avatar}
      alt={user.name}
      className="rounded-full"
      width={100}
      height={100}
      objectFit="cover"
      fallbackSrc="/assets/default-avatar.png"
      loading="eager" // Avatar nên load ngay
    />
  );
}

// ============================================
// VÍ DỤ 8: Product card với nhiều ảnh
// ============================================
export function Example8_ProductCard({ product }) {
  // Preload ảnh chính khi hover
  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      preloadImage(product.images[1]);
    }
  };
  
  return (
    <div 
      className="product-card"
      onMouseEnter={handleMouseEnter}
    >
      <OptimizedImage
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded-t-lg"
        loading="lazy"
        fallbackSrc="/assets/default-product.jpg"
      />
      <div className="p-4">
        <h3>{product.name}</h3>
        <p className="text-gray-600">{product.price}</p>
      </div>
    </div>
  );
}

// ============================================
// VÍ DỤ 9: Background image với aspect ratio
// ============================================
export function Example9_HeroSection() {
  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      <OptimizedImage
        src="/uploads/hero-banner.jpg"
        alt="Hero banner"
        className="absolute inset-0 w-full h-full"
        objectFit="cover"
        loading="eager" // Hero image nên load ngay
        placeholder={true}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Welcome</h1>
      </div>
    </div>
  );
}

// ============================================
// VÍ DỤ 10: Sử dụng loadImageWithRetry trực tiếp
// ============================================
export function Example10_ManualLoad() {
  const handleLoadImage = async () => {
    try {
      const imageUrl = await loadImageWithRetry('/uploads/image.jpg', {
        retryCount: 3,
        retryDelay: 1000,
      });
      console.log('Ảnh đã load:', imageUrl);
      // Sử dụng imageUrl ở đây
    } catch (error) {
      console.error('Lỗi load ảnh:', error);
    }
  };
  
  return (
    <button onClick={handleLoadImage}>
      Load ảnh
    </button>
  );
}

