import { useState, useEffect, useRef } from 'react';
import { normalizeImageUrl } from '../utils/imageUtils';

/**
 * Component tối ưu hóa load ảnh với các tính năng:
 * - Lazy loading với Intersection Observer
 * - Placeholder/skeleton loading
 * - Error handling với retry
 * - Image caching
 * - Progressive loading
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  loading = 'lazy', // 'lazy' | 'eager'
  onLoad,
  onError,
  fallbackSrc,
  placeholder = true, // Hiển thị placeholder khi loading
  retryCount = 2, // Số lần retry khi load lỗi
  retryDelay = 1000, // Delay giữa các lần retry (ms)
  threshold = 0.1, // Threshold cho Intersection Observer
  objectFit = 'cover', // 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(loading === 'eager');
  const [retryAttempts, setRetryAttempts] = useState(0);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const imageCache = useRef(new Map()); // Cache để lưu ảnh đã load

  // Normalize image URL
  const normalizedSrc = src ? normalizeImageUrl(src) : null;
  const normalizedFallback = fallbackSrc ? normalizeImageUrl(fallbackSrc) : null;

  // Intersection Observer để lazy load
  useEffect(() => {
    if (loading !== 'lazy' || !normalizedSrc || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Load trước khi vào viewport 50px
        threshold: threshold,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, normalizedSrc, isInView, threshold]);

  // Load image
  useEffect(() => {
    if (!normalizedSrc || !isInView) {
      if (!normalizedSrc) {
        setIsLoading(false);
      }
      return;
    }

    // Kiểm tra cache trước
    if (imageCache.current.has(normalizedSrc)) {
      const cachedImage = imageCache.current.get(normalizedSrc);
      if (cachedImage.loaded) {
        setImageSrc(normalizedSrc);
        setIsLoading(false);
        setHasError(false);
        if (onLoad) onLoad();
        return;
      }
    }

    // Reset states
    setIsLoading(true);
    setHasError(false);
    setRetryAttempts(0);

    const loadImage = (url, attempt = 0) => {
      return new Promise((resolve, reject) => {
        // Kiểm tra cache lại
        if (imageCache.current.has(url) && imageCache.current.get(url).loaded) {
          resolve(url);
          return;
        }

        const img = new Image();
        
        img.onload = () => {
          // Lưu vào cache
          imageCache.current.set(url, { loaded: true, timestamp: Date.now() });
          resolve(url);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        // Thêm timestamp để tránh cache browser
        const cacheBuster = attempt > 0 ? `?retry=${attempt}&t=${Date.now()}` : '';
        img.src = url + cacheBuster;
      });
    };

    const attemptLoad = async (attempt = 0) => {
      try {
        const loadedUrl = await loadImage(normalizedSrc, attempt);
        setImageSrc(loadedUrl);
        setIsLoading(false);
        setHasError(false);
        if (onLoad) onLoad();
      } catch (error) {
        if (attempt < retryCount) {
          // Retry sau một khoảng delay
          setTimeout(() => {
            setRetryAttempts(attempt + 1);
            attemptLoad(attempt + 1);
          }, retryDelay);
        } else {
          // Hết số lần retry, dùng fallback
          setHasError(true);
          setIsLoading(false);
          if (normalizedFallback) {
            try {
              const fallbackUrl = await loadImage(normalizedFallback, 0);
              setImageSrc(fallbackUrl);
              setHasError(false);
            } catch (fallbackError) {
              // Fallback cũng lỗi
              if (onError) onError();
            }
          } else {
            if (onError) onError();
          }
        }
      }
    };

    attemptLoad(0);
  }, [normalizedSrc, normalizedFallback, isInView, retryCount, retryDelay, onLoad, onError]);

  // Determine aspect ratio box if width/height provided
  const aspectRatioStyle = width && height 
    ? { aspectRatio: `${width}/${height}` }
    : {};

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={aspectRatioStyle}
    >
      {/* Placeholder/Skeleton */}
      {isLoading && placeholder && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
          <div 
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      )}

      {/* Image */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          loading={loading}
          width={width}
          height={height}
          style={{
            ...aspectRatioStyle,
            objectFit: objectFit,
          }}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            if (normalizedFallback && imageSrc !== normalizedFallback) {
              setImageSrc(normalizedFallback);
              setIsLoading(true);
            } else {
              setHasError(true);
              setIsLoading(false);
              if (onError) onError();
            }
          }}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && !imageSrc && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-sm">
          <span className="material-symbols-outlined mb-2" style={{ fontSize: '2rem' }}>
            broken_image
          </span>
          <span>{alt || 'Không thể tải ảnh'}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

