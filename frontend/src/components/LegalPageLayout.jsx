import { Link } from 'react-router-dom';
import SeoHead from './SeoHead';

/**
 * Khung trình bày chung cho các trang pháp lý (Điều khoản, Chính sách bảo mật).
 * sections: [{ heading: string, content: ReactNode }]
 */
const LegalPageLayout = ({ title, description, canonicalPath, updatedAt, intro, sections }) => (
  <div className="min-h-screen bg-white">
    <SeoHead title={title} description={description} canonicalPath={canonicalPath} />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 lg:pt-36 pb-20">
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="text-gray-500 hover:text-primary" style={{ textDecoration: 'none' }}>Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{title}</span>
      </nav>

      <h1
        className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight"
        style={{ color: '#2D2D2D', fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h1>
      <p className="text-sm text-gray-500 mb-8">Cập nhật lần cuối: {updatedAt}</p>

      {intro && <div className="text-base md:text-lg text-gray-700 leading-relaxed mb-10">{intro}</div>}

      <div className="space-y-10">
        {sections.map((section, index) => (
          <section key={section.heading} aria-labelledby={`legal-section-${index}`}>
            <h2
              id={`legal-section-${index}`}
              className="text-xl md:text-2xl font-bold mb-3"
              style={{ color: '#8B0A3D' }}
            >
              {index + 1}. {section.heading}
            </h2>
            <div className="text-base text-gray-700 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
);

export default LegalPageLayout;
