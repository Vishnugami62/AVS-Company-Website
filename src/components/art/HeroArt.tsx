/**
 * Isometric navy-and-gold hero illustration (brand motif, deck slide 42).
 * Pure inline SVG so it always renders, stays crisp and loads instantly.
 */
export function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 440"
      className={className}
      role="img"
      aria-label="Isometric illustration of stacked office supply boxes being delivered"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E2BF72" />
          <stop offset="1" stopColor="#C99A3E" />
        </linearGradient>
        <linearGradient id="navyFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B336E" />
          <stop offset="1" stopColor="#13275A" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#E2BF72" stopOpacity="0.35" />
          <stop offset="1" stopColor="#E2BF72" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="260" cy="230" rx="240" ry="190" fill="url(#glow)" />

      {/* big crate */}
      <g>
        <polygon points="150,210 260,150 370,210 260,270" fill="#E2BF72" />
        <polygon points="150,210 260,270 260,370 150,310" fill="url(#navyFace)" />
        <polygon points="370,210 260,270 260,370 370,310" fill="#0E1D45" />
        <polygon points="200,238 260,204 320,238 260,272" fill="url(#goldFace)" opacity="0.9" />
      </g>

      {/* small box left */}
      <g>
        <polygon points="78,250 140,214 202,250 140,286" fill="#E2BF72" />
        <polygon points="78,250 140,286 140,348 78,312" fill="url(#navyFace)" />
        <polygon points="202,250 140,286 140,348 202,312" fill="#0E1D45" />
      </g>

      {/* small box right */}
      <g>
        <polygon points="318,250 380,214 442,250 380,286" fill="#E2BF72" />
        <polygon points="318,250 380,286 380,348 318,312" fill="url(#navyFace)" />
        <polygon points="442,250 380,286 380,348 442,312" fill="#0E1D45" />
      </g>

      {/* floating paper sheet */}
      <g className="origin-center" style={{ animation: "float 6s ease-in-out infinite" }}>
        <polygon points="250,70 330,70 330,150 250,150" fill="#FFFCF6" opacity="0.95" />
        <rect x="262" y="86" width="56" height="7" rx="3" fill="#C99A3E" />
        <rect x="262" y="102" width="44" height="6" rx="3" fill="#13275A" opacity="0.4" />
        <rect x="262" y="116" width="52" height="6" rx="3" fill="#13275A" opacity="0.4" />
        <rect x="262" y="130" width="34" height="6" rx="3" fill="#13275A" opacity="0.4" />
      </g>

      {/* check seal */}
      <g>
        <circle cx="388" cy="138" r="30" fill="url(#goldFace)" />
        <path
          d="M374 138 l9 9 l18 -19"
          fill="none"
          stroke="#0E1D45"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
