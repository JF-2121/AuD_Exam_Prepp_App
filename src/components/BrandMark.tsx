/**
 * The app's mark: a two-child binary tree — the most immediately "data structures" glyph that
 * still reads at 16px — on a near-black tile, in the same Sky/Action blue pair the rest of the UI
 * uses. Kept in sync with `public/favicon.svg` so the tab icon and the header logo are one mark.
 *
 * `id`s inside an inline SVG are document-global, so the gradients are namespaced.
 */
export function BrandMark({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`shrink-0 ${className}`}
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id="brandmark-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c1f" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="brandmark-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5cadff" />
          <stop offset="1" stopColor="#0066cc" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#brandmark-tile)" />
      <rect
        x="0.6"
        y="0.6"
        width="30.8"
        height="30.8"
        rx="7.4"
        fill="none"
        stroke="#2997ff"
        strokeOpacity="0.22"
        strokeWidth="1.2"
      />
      <path
        d="M16 11.5 L9.5 21.5 M16 11.5 L22.5 21.5"
        fill="none"
        stroke="#0066cc"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="16" cy="10" r="4.2" fill="url(#brandmark-node)" />
      <circle cx="9" cy="22.5" r="3.4" fill="#2997ff" />
      <circle cx="23" cy="22.5" r="3.4" fill="#0b63c4" />
    </svg>
  );
}
