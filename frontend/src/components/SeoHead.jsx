import { useEffect } from 'react';

export const SITE_ORIGIN = 'https://duonglaoxuanhoa.net';
export const SITE_NAME = 'Trung tâm trường thọ Xuân Hoa';
export const DEFAULT_DESCRIPTION =
  'Trung tâm trường thọ Xuân Hoa – chăm sóc người cao tuổi toàn diện, môi trường sống an lành và đội ngũ y bác sĩ, điều dưỡng chuyên nghiệp.';

function upsertMetaByName(name, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property, content) {
  if (content == null || content === '') return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Cập nhật title, meta description, canonical và thẻ Open Graph cho SPA.
 */
export default function SeoHead({ title, description, canonicalPath, imageUrl }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = pageTitle;

    const desc = description || DEFAULT_DESCRIPTION;
    upsertMetaByName('description', desc);

    const rawPath =
      canonicalPath != null
        ? canonicalPath
        : `${window.location.pathname}${window.location.search}`;
    const pathOnly = rawPath.startsWith('http') ? rawPath : rawPath.split('?')[0];
    const canonicalUrl = pathOnly.startsWith('http')
      ? pathOnly
      : `${SITE_ORIGIN}${pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`}`;

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);

    upsertMetaByProperty('og:type', 'website');
    upsertMetaByProperty('og:site_name', SITE_NAME);
    upsertMetaByProperty('og:title', pageTitle);
    upsertMetaByProperty('og:description', desc);
    upsertMetaByProperty('og:url', canonicalUrl);
    if (imageUrl) {
      upsertMetaByProperty('og:image', imageUrl);
    }

    upsertMetaByName('twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    upsertMetaByName('twitter:title', pageTitle);
    upsertMetaByName('twitter:description', desc);
    if (imageUrl) {
      upsertMetaByName('twitter:image', imageUrl);
    }
  }, [title, description, canonicalPath, imageUrl]);

  return null;
}
