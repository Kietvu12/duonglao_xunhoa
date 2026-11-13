import { getActiveSocialLinks } from '../config/socialLinks';

const ICON_PATHS = {
  facebook:
    'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.45-4.94 8.45-9.94z',
  youtube:
    'M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81zM10 15.5v-7l6 3.5-6 3.5z',
  tiktok:
    'M16.6 5.82A5.9 5.9 0 0 0 15.4 3h-2.7v12.06a2.53 2.53 0 1 1-1.8-2.42V9.9a5.36 5.36 0 1 0 4.5 5.28V8.9a6.6 6.6 0 0 0 3.6 1.08V7.3a3.9 3.9 0 0 1-2.4-1.48z',
};

/**
 * Icon mạng xã hội của footer.
 * Chỉ render các kênh đã khai báo URL thật trong config/socialLinks.js,
 * kèm aria-label + title để người dùng biết sẽ tới đâu.
 */
const SocialIconLinks = ({ className = '', iconClassName = '' }) => {
  const links = getActiveSocialLinks();

  if (links.length === 0) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.title || item.label}
            title={item.title || item.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:bg-white/15 hover:border-white/60"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-5 w-5 ${iconClassName}`}
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d={ICON_PATHS[item.id] || ICON_PATHS.facebook} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SocialIconLinks;
