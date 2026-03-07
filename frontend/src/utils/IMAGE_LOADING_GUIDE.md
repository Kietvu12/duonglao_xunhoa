# Hướng dẫn sử dụng hàm xử lý load ảnh

## Tổng quan

Hệ thống xử lý load ảnh được tối ưu hóa với các tính năng:
- ✅ Lazy loading với Intersection Observer
- ✅ Image caching để tránh load lại
- ✅ Retry mechanism khi load lỗi
- ✅ Placeholder/skeleton loading
- ✅ Preload ảnh quan trọng
- ✅ Progressive loading với fade-in effect

## 1. Component OptimizedImage

Component React để hiển thị ảnh với tối ưu hóa tự động.

### Cách sử dụng cơ bản:

```jsx
import OptimizedImage from '../components/OptimizedImage';

// Sử dụng đơn giản
<OptimizedImage 
  src="/uploads/image.jpg"
  alt="Mô tả ảnh"
  className="w-full h-64"
/>

// Với các tùy chọn
<OptimizedImage 
  src={imageUrl}
  alt="Ảnh sản phẩm"
  className="rounded-lg"
  width={800}
  height={600}
  loading="lazy" // 'lazy' | 'eager'
  fallbackSrc="/assets/default-image.jpg"
  placeholder={true}
  retryCount={3}
  retryDelay={1000}
  objectFit="cover" // 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad={() => console.log('Ảnh đã load xong')}
  onError={() => console.log('Lỗi load ảnh')}
/>
```

### Props:

- `src` (string, required): URL ảnh cần hiển thị
- `alt` (string): Text mô tả ảnh
- `className` (string): CSS classes
- `width` (number): Chiều rộng ảnh
- `height` (number): Chiều cao ảnh
- `loading` ('lazy' | 'eager'): Lazy load hay load ngay (default: 'lazy')
- `fallbackSrc` (string): URL ảnh dự phòng khi load lỗi
- `placeholder` (boolean): Hiển thị placeholder khi loading (default: true)
- `retryCount` (number): Số lần retry khi load lỗi (default: 2)
- `retryDelay` (number): Delay giữa các lần retry (ms, default: 1000)
- `threshold` (number): Threshold cho Intersection Observer (default: 0.1)
- `objectFit` (string): CSS object-fit (default: 'cover')
- `onLoad` (function): Callback khi ảnh load xong
- `onError` (function): Callback khi load lỗi

## 2. Hook useImageLoader

Hook để quản lý việc load ảnh trong component.

### Cách sử dụng:

```jsx
import { useImageLoader } from '../hooks/useImageLoader';

function MyComponent() {
  const { imageSrc, isLoading, hasError, retry, containerRef } = useImageLoader(
    imageUrl,
    {
      lazy: true,
      fallbackSrc: '/assets/default.jpg',
      retryCount: 2,
      retryDelay: 1000,
      threshold: 0.1,
      rootMargin: '50px',
    }
  );

  return (
    <div ref={containerRef}>
      {isLoading && <div>Đang tải...</div>}
      {hasError && (
        <div>
          Lỗi load ảnh
          <button onClick={retry}>Thử lại</button>
        </div>
      )}
      {imageSrc && <img src={imageSrc} alt="Ảnh" />}
    </div>
  );
}
```

### Return values:

- `imageSrc` (string | null): URL ảnh đã load
- `isLoading` (boolean): Đang load hay không
- `hasError` (boolean): Có lỗi hay không
- `retry` (function): Hàm để retry load ảnh
- `retryAttempts` (number): Số lần đã retry
- `containerRef` (ref): Ref để attach Intersection Observer

## 3. Hook useImagePreloader

Hook để preload nhiều ảnh trước khi cần dùng.

### Cách sử dụng:

```jsx
import { useImagePreloader } from '../hooks/useImageLoader';

function MyComponent() {
  const imageUrls = [
    '/uploads/image1.jpg',
    '/uploads/image2.jpg',
    '/uploads/image3.jpg',
  ];

  const { preload, isPreloading, preloadedCount, totalCount } = useImagePreloader(
    imageUrls,
    { immediate: false }
  );

  return (
    <div>
      <button onClick={preload}>
        Preload ảnh ({preloadedCount}/{totalCount})
      </button>
      {isPreloading && <div>Đang preload...</div>}
    </div>
  );
}
```

## 4. Utility Functions

### preloadImage

Preload một hoặc nhiều ảnh:

```jsx
import { preloadImage } from '../utils/imageUtils';

// Preload một ảnh
await preloadImage('/uploads/image.jpg');

// Preload nhiều ảnh
await preloadImage([
  '/uploads/image1.jpg',
  '/uploads/image2.jpg',
  '/uploads/image3.jpg',
]);
```

### loadImageWithRetry

Load ảnh với retry mechanism:

```jsx
import { loadImageWithRetry } from '../utils/imageUtils';

try {
  const imageUrl = await loadImageWithRetry('/uploads/image.jpg', {
    retryCount: 3,
    retryDelay: 1000,
  });
  console.log('Ảnh đã load:', imageUrl);
} catch (error) {
  console.error('Lỗi load ảnh:', error);
}
```

### isImageCached

Kiểm tra ảnh đã được cache chưa:

```jsx
import { isImageCached } from '../utils/imageUtils';

if (isImageCached('/uploads/image.jpg')) {
  console.log('Ảnh đã được cache');
}
```

### clearImageCache / clearAllImageCache

Xóa cache:

```jsx
import { clearImageCache, clearAllImageCache } from '../utils/imageUtils';

// Xóa cache một ảnh
clearImageCache('/uploads/image.jpg');

// Xóa toàn bộ cache
clearAllImageCache();
```

### getImageDimensions

Lấy kích thước ảnh:

```jsx
import { getImageDimensions } from '../utils/imageUtils';

const { width, height } = await getImageDimensions('/uploads/image.jpg');
console.log(`Kích thước: ${width}x${height}`);
```

## 5. Ví dụ thay thế thẻ img thông thường

### Trước (chậm):

```jsx
<img 
  src={imageUrl} 
  alt="Ảnh"
  className="w-full h-64"
  onError={(e) => e.target.src = '/default.jpg'}
/>
```

### Sau (tối ưu):

```jsx
import OptimizedImage from '../components/OptimizedImage';

<OptimizedImage 
  src={imageUrl}
  alt="Ảnh"
  className="w-full h-64"
  fallbackSrc="/default.jpg"
  loading="lazy"
/>
```

## 6. Best Practices

1. **Luôn sử dụng OptimizedImage thay vì thẻ `<img>`** cho ảnh từ server
2. **Preload ảnh quan trọng** (hero images, above-the-fold images):
   ```jsx
   useEffect(() => {
     preloadImage(['/uploads/hero.jpg']);
   }, []);
   ```
3. **Sử dụng lazy loading** cho ảnh dưới fold:
   ```jsx
   <OptimizedImage src={url} loading="lazy" />
   ```
4. **Cung cấp fallback** cho tất cả ảnh:
   ```jsx
   <OptimizedImage src={url} fallbackSrc="/default.jpg" />
   ```
5. **Tối ưu kích thước ảnh** trên server trước khi upload

## 7. Performance Tips

- Cache sẽ tự động làm sạch sau 30 phút
- Tối đa 100 ảnh trong cache
- Intersection Observer load ảnh trước 50px khi vào viewport
- Retry tự động 2 lần khi load lỗi

## 8. Troubleshooting

**Ảnh không hiển thị:**
- Kiểm tra URL có đúng không
- Kiểm tra console để xem lỗi
- Thử dùng `normalizeImageUrl` để normalize URL

**Ảnh load chậm:**
- Kiểm tra kích thước file ảnh
- Sử dụng preload cho ảnh quan trọng
- Kiểm tra network connection

**Cache không hoạt động:**
- Cache tự động làm sạch sau 30 phút
- Có thể clear cache thủ công bằng `clearAllImageCache()`

