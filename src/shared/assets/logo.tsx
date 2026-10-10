export const Logo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 312 96" width="100%" height="100%">
      <defs>
        <linearGradient id="netflixRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2E38" />
          <stop offset="100%" stopColor="#E50914" />
        </linearGradient>

        <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="100%" stopColor="#E50914" />
        </linearGradient>

        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#E50914" floodOpacity="0.4" />
        </filter>
      </defs>

      <rect width="312" height="96" rx="16" fill="#0B0C10" />

      <g filter="url(#glow)">
        <rect x="16" y="16" width="64" height="64" rx="15" fill="url(#playGradient)" />
        <polygon points="41,35 62,48 41,61" fill="#FFFFFF" />
      </g>

      <g transform="translate(96, 68)" fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontWeight="900" fontSize="56" letterSpacing="-1">
        <text x="0" y="0" fill="#FFFFFF">You</text>
        <text x="108" y="0" fill="url(#netflixRed)">Flix</text>
      </g>
    </svg>
  )
}
