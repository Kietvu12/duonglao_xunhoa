import { useState, useEffect, useRef } from 'react';
import { 
  normalizeImageUrl, 
  loadImageWithRetry, 
  isImageCached,
  preloadImage 
} from '../utils/imageUtils';

/**
 * Hook để quản lý việc load ảnh với các tính năng:
 * - Lazy loading với Intersection Observer
 * - Retry mechanism
 * - Caching
 * - Loading states
 * 
 * @param {string} src - URL ảnh
 * @param {Object} options - Options
 * @param {boolean} options.lazy - Lazy load (default: true)
 * @param {string} options.fallbackSrc - Fallback URL khi load lỗi
 * @param {number} options.retryCount - Số lần retry (default: 2)
 * @param {number} options.retryDelay - Delay giữa các lần retry (ms, default: 1000)
 * @param {number} options.threshold - Threshold cho Intersection Observer (default: 0.1)
 * @param {number} options.rootMargin - Root margin cho Intersection Observer (default: '50px')
 * @returns {Object} - { imageSrc, isLoading, hasError, retry }
 */
export const useImageLoader = (src, options = {}) => {
  const {
    lazy = true,
    fallbackSrc,
    retryCount = 2,
    retryDelay = 1000,
    threshold = 0.1,
    rootMargin = '50px',
  } = options;

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const containerRef = useRef(null);

  const normalizedSrc = src ? normalizeImageUrl(src) : null;
  const normalizedFallback = fallbackSrc ? normalizeImageUrl(fallbackSrc) : null;

  // Intersection Observer cho lazy loading
  useEffect(() => {
    if (!lazy || !normalizedSrc || isInView) return;

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
        rootMargin,
        threshold,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, normalizedSrc, isInView, threshold, rootMargin]);

  // Load image
  useEffect(() => {
    if (!normalizedSrc || !isInView) {
      if (!normalizedSrc) {
        setIsLoading(false);
      }
      return;
    }

    // Kiểm tra cache
    if (isImageCached(normalizedSrc)) {
      setImageSrc(normalizedSrc);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    // Reset states
    setIsLoading(true);
    setHasError(false);
    setRetryAttempts(0);

    const loadImage = async () => {
      try {
        const loadedUrl = await loadImageWithRetry(normalizedSrc, {
          retryCount,
          retryDelay,
        });
        setImageSrc(loadedUrl);
        setIsLoading(false);
        setHasError(false);
      } catch (error) {
        // Thử load fallback
        if (normalizedFallback) {
          try {
            const fallbackUrl = await loadImageWithRetry(normalizedFallback, {
              retryCount: 1,
              retryDelay,
            });
            setImageSrc(fallbackUrl);
            setIsLoading(false);
            setHasError(false);
          } catch (fallbackError) {
            setHasError(true);
            setIsLoading(false);
          }
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();
  }, [normalizedSrc, normalizedFallback, isInView, retryCount, retryDelay]);

  // Retry function
  const retry = () => {
    setRetryAttempts(prev => prev + 1);
    setHasError(false);
    setIsLoading(true);
    // Trigger reload bằng cách reset isInView
    setIsInView(false);
    setTimeout(() => setIsInView(true), 100);
  };

  return {
    imageSrc,
    isLoading,
    hasError,
    retry,
    retryAttempts,
    containerRef,
  };
};

/**
 * Hook để preload nhiều ảnh
 * @param {string[]} imageUrls - Mảng URLs ảnh cần preload
 * @param {Object} options - Options
 * @param {boolean} options.immediate - Preload ngay lập tức (default: false)
 * @returns {Object} - { preload, isPreloading, preloadedCount }
 */
export const useImagePreloader = (imageUrls = [], options = {}) => {
  const { immediate = false } = options;
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [preloadedUrls, setPreloadedUrls] = useState(new Set());

  const preload = async () => {
    if (!imageUrls.length) return;

    setIsPreloading(true);
    setPreloadedCount(0);

    try {
      const urls = imageUrls.filter(Boolean);
      const results = await Promise.allSettled(
        urls.map(url => preloadImage(url))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const loadedUrls = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
        .flat();

      setPreloadedCount(successful);
      setPreloadedUrls(new Set(loadedUrls));
    } catch (error) {
      console.error('Error preloading images:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  useEffect(() => {
    if (immediate && imageUrls.length > 0) {
      preload();
    }
  }, []);

  return {
    preload,
    isPreloading,
    preloadedCount,
    totalCount: imageUrls.length,
    preloadedUrls,
  };
};

