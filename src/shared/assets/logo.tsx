export const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 200" width="100%" height="100%">
    <defs>
      <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E50914" />
        <stop offset="100%" stopColor="#B81D24" />
      </linearGradient>
      <linearGradient id="darkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2D3137" />
        <stop offset="100%" stopColor="#1A1D20" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>
    <rect x="130" y="45" width="420" height="110" rx="18" fill="url(#darkGrad)" filter="url(#shadow)" />
    <g transform="translate(40, 30)" filter="url(#shadow)">
      <path d="M 15,10 L 55,70 L 55,130 C 55,135 50,140 45,140 L 35,140 C 30,140 25,135 25,130 L 25,85 L -5,30 C -10,20 -2,10 10,10 Z" fill="url(#redGrad)" />
      <path d="M 45,60 L 105,25 C 115,19 125,27 122,38 L 95,95 C 90,105 75,108 65,100 Z" fill="url(#redGrad)" />
      <polygon points="55,45 80,60 55,75" fill="#FFFFFF" />
    </g>
    <text x="210" y="118" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="800" fontSize="62" fill="#FFFFFF" letterSpacing="-1">You</text>
    <text x="328" y="118" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="800" fontSize="62" fill="#E50914" letterSpacing="-1">Flix</text>
  </svg>
)