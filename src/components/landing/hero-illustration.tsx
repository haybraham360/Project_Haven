/**
 * Decorative hero artwork: a person holding three mood masks, surrounded by
 * playful geometric shapes. Purely presentational (aria-hidden).
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 520" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="hi-glow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fff4ea" />
          <stop offset="100%" stopColor="#fdeedd" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hi-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9c9b8" />
          <stop offset="100%" stopColor="#e9a7c6" />
        </linearGradient>
        <linearGradient id="hi-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fb6e3" />
          <stop offset="100%" stopColor="#3f86c4" />
        </linearGradient>
        <linearGradient id="hi-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbd660" />
          <stop offset="100%" stopColor="#dc9b16" />
        </linearGradient>
        <linearGradient id="hi-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7cc6f2" />
          <stop offset="100%" stopColor="#3a7fc1" />
        </linearGradient>
        <linearGradient id="hi-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2ae4b" />
          <stop offset="55%" stopColor="#e2704f" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="hi-tri" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b6e07a" />
          <stop offset="50%" stopColor="#5fb7e8" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <circle cx="260" cy="300" r="230" fill="url(#hi-glow)" />
      <path
        d="M330 210c70 10 120 80 105 160-12 66-60 120-140 130-60 8-70-40-40-90 26-44 20-90-10-120-34-34-10-88 85-80z"
        fill="url(#hi-blob)"
        opacity="0.75"
      />

      {/* Floating shapes */}
      <g className="motion-safe:animate-float origin-center">
        <path
          d="M118 70l52 76-92 6z"
          fill="none"
          stroke="#5fa6dd"
          strokeWidth="9"
          strokeLinejoin="round"
          transform="rotate(-14 118 110)"
        />
        <path
          d="M392 70c14-18 30 10 44-6s26-24 38-12"
          fill="none"
          stroke="#8fae4a"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
      <circle
        cx="452"
        cy="170"
        r="40"
        fill="none"
        stroke="url(#hi-ring)"
        strokeWidth="13"
      />
      <path
        d="M50 250l11 26 26 11-26 11-11 26-11-26-26-11 26-11z"
        fill="#ea7d55"
      />
      <path
        d="M470 340l8 22 22 8-22 8-8 22-8-22-22-8 22-8z"
        fill="none"
        stroke="#f2ae4b"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <circle cx="70" cy="420" r="18" fill="none" stroke="#8b5cf6" strokeWidth="9" />
      <path d="M78 520l72-96 40 96z" fill="url(#hi-tri)" opacity="0.9" />
      <circle cx="446" cy="470" r="26" fill="url(#hi-ring)" />
      <g fill="#7a4a2e">
        <circle cx="200" cy="160" r="6" />
        <circle cx="186" cy="182" r="4" />
        <circle cx="330" cy="180" r="5" />
        <circle cx="350" cy="320" r="7" />
        <circle cx="366" cy="342" r="4" />
      </g>
      {/* "?" and "!" marks */}
      <text x="150" y="232" fontSize="64" fontWeight="800" fill="#7a3b26" fontFamily="inherit">
        ?
      </text>
      <path d="M470 236l-8 34" stroke="#7a3b26" strokeWidth="14" strokeLinecap="round" />
      <circle cx="458" cy="292" r="6" fill="#7a3b26" />

      {/* Person */}
      <path
        d="M150 520c0-90 46-138 110-138s110 48 110 138z"
        fill="url(#hi-shirt)"
      />
      <path d="M236 392q24 22 48 0" fill="none" stroke="#2f6aa3" strokeWidth="6" />
      <rect x="244" y="330" width="32" height="64" rx="12" fill="#f0ad84" />
      <path
        d="M196 250c-6-60 36-96 72-90 20-18 60-6 64 30 18 12 14 46 2 60z"
        fill="#8a4b2a"
      />
      <path d="M220 172c10-14 30-20 46-14" stroke="#6b3920" strokeWidth="7" fill="none" strokeLinecap="round" />

      {/* Gold mask (centre, happy) */}
      <line x1="256" y1="350" x2="250" y2="500" stroke="#8a5a32" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="262" cy="282" rx="56" ry="68" fill="url(#hi-gold)" />
      <g fill="none" stroke="#7a4a10" strokeWidth="5" strokeLinecap="round">
        <path d="M228 268q10-12 20 0" />
        <path d="M276 268q10-12 20 0" />
        <path d="M232 302q30 30 60 0" />
      </g>
      <circle cx="226" cy="292" r="8" fill="#f08a5d" opacity="0.5" />
      <circle cx="298" cy="292" r="8" fill="#f08a5d" opacity="0.5" />
      <circle cx="250" cy="452" r="15" fill="#f0ad84" />

      {/* White mask (left, overwhelmed) */}
      <line x1="146" y1="350" x2="160" y2="500" stroke="#8a5a32" strokeWidth="7" strokeLinecap="round" />
      <g transform="rotate(-14 140 296)">
        <ellipse cx="140" cy="296" rx="44" ry="58" fill="#fbf4ec" stroke="#e8d6c4" strokeWidth="3" />
        <g fill="none" stroke="#b5483a" strokeWidth="3.5" strokeLinecap="round">
          <path d="M120 284a10 10 0 1 1 6 9a6 6 0 1 1-2-8" />
          <path d="M156 284a10 10 0 1 1 6 9a6 6 0 1 1-2-8" />
          <path d="M124 320q8-8 16 0t16 0" />
        </g>
      </g>
      <circle cx="158" cy="462" r="14" fill="#f0ad84" />

      {/* Blue mask (right, sad) */}
      <line x1="382" y1="330" x2="372" y2="490" stroke="#8a5a32" strokeWidth="7" strokeLinecap="round" />
      <g transform="rotate(10 388 270)">
        <ellipse cx="388" cy="270" rx="44" ry="58" fill="url(#hi-blue)" />
        <g fill="none" stroke="#1e3f66" strokeWidth="4.5" strokeLinecap="round">
          <path d="M366 262q8 8 16 0" />
          <path d="M396 262q8 8 16 0" />
          <path d="M370 304q18-16 36 0" />
        </g>
      </g>
      <circle cx="372" cy="446" r="14" fill="#f0ad84" />
    </svg>
  );
}
