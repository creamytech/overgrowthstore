export function GasStationLayer() {
  return (
    <div className="w-full h-full flex items-end justify-center pb-20">
      <svg viewBox="0 0 800 400" className="w-full max-w-4xl h-auto opacity-80">
        {/* Canopy */}
        <path
          d="M100,100 L700,100 L720,150 L80,150 Z"
          fill="#2A2A2A" // Ink
          stroke="#F0EAD6" // Paper
          strokeWidth="2"
          className="boiling-line"
        />
        {/* Columns */}
        <rect x="150" y="150" width="20" height="250" fill="#2A2A2A" stroke="#F0EAD6" strokeWidth="2" />
        <rect x="630" y="150" width="20" height="250" fill="#2A2A2A" stroke="#F0EAD6" strokeWidth="2" />
        
        {/* Pumps */}
        <rect x="250" y="300" width="40" height="80" fill="#C04000" stroke="#2A2A2A" strokeWidth="2" />
        <rect x="510" y="300" width="40" height="80" fill="#C04000" stroke="#2A2A2A" strokeWidth="2" />

        {/* Sign */}
        <g transform="translate(350, 50)">
            <rect x="0" y="0" width="100" height="40" fill="#F0EAD6" stroke="#2A2A2A" strokeWidth="2" />
            <text x="50" y="25" textAnchor="middle" className="font-serif text-xs fill-ink">GAS</text>
        </g>
      </svg>
    </div>
  );
}
