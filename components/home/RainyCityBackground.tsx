export function RainyCityBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(62,214,196,0.08), transparent), linear-gradient(180deg, #05070b 0%, #0b0e14 55%, #0d1119 100%)",
        }}
      />

      {/* City skyline silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-90"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        fill="none"
      >
        <g fill="#10141d">
          <rect x="0" y="140" width="80" height="180" />
          <rect x="90" y="90" width="60" height="230" />
          <rect x="160" y="160" width="100" height="160" />
          <rect x="270" y="60" width="70" height="260" />
          <rect x="350" y="120" width="50" height="200" />
          <rect x="410" y="180" width="120" height="140" />
          <rect x="540" y="40" width="90" height="280" />
          <rect x="640" y="110" width="60" height="210" />
          <rect x="710" y="150" width="140" height="170" />
          <rect x="860" y="70" width="80" height="250" />
          <rect x="950" y="130" width="60" height="190" />
          <rect x="1020" y="170" width="130" height="150" />
          <rect x="1160" y="50" width="70" height="270" />
          <rect x="1240" y="120" width="90" height="200" />
          <rect x="1340" y="160" width="100" height="160" />
        </g>
        <g fill="#e8a33d" opacity="0.5">
          <rect x="20" y="170" width="6" height="8" />
          <rect x="40" y="200" width="6" height="8" />
          <rect x="180" y="190" width="6" height="8" />
          <rect x="290" y="100" width="6" height="8" />
          <rect x="560" y="90" width="6" height="8" />
          <rect x="580" y="140" width="6" height="8" />
          <rect x="730" y="190" width="6" height="8" />
          <rect x="880" y="120" width="6" height="8" />
          <rect x="1040" y="210" width="6" height="8" />
          <rect x="1180" y="100" width="6" height="8" />
        </g>
        <g fill="#3ed6c4" opacity="0.35">
          <rect x="640" y="140" width="6" height="10" />
          <rect x="960" y="160" width="6" height="10" />
          <rect x="1250" y="150" width="6" height="10" />
        </g>
      </svg>

      {/* Rain streaks */}
      <div className="rain-layer absolute inset-0 opacity-60" />
      <div className="rain-layer absolute inset-0 opacity-30" style={{ animationDuration: "6s", animationDirection: "reverse" }} />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 40%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
