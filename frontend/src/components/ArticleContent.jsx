import { useMemo } from 'react';
import './ArticleContent.css';

export default function ArticleContent({ content, className = '' }) {
  // Sanitize và render HTML content
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    // Quill tạo ra HTML, nhưng để an toàn, có thể thêm sanitization
    // Ở đây chúng ta tin tưởng content từ database vì đã được tạo từ editor
    return content;
  }, [content]);

  return (
    <div 
      className={`article-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}

