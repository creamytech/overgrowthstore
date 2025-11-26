import React from 'react';

export function WoodSignDrawerBg({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 400 800"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="woodGrain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.1" numOctaves="3" result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#d2b48c" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="roughEdge">
            <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
      </defs>

      {/* Chains */}
      <g transform="translate(50, -20)">
        <path d="M0,0 L0,100" stroke="#333" strokeWidth="8" strokeDasharray="12 4" />
        <circle cx="0" cy="100" r="8" fill="#555" />
      </g>
      <g transform="translate(350, -20)">
        <path d="M0,0 L0,100" stroke="#333" strokeWidth="8" strokeDasharray="12 4" />
        <circle cx="0" cy="100" r="8" fill="#555" />
      </g>

      {/* Main Board */}
      <path
        d="M20,80 L380,80 L390,780 L10,790 Z"
        fill="#deb887"
        stroke="#5c4033"
        strokeWidth="4"
        filter="url(#roughEdge)"
      />
      
      {/* Wood Texture Overlay */}
      <rect x="20" y="80" width="360" height="700" fill="#8b4513" opacity="0.2" filter="url(#woodGrain)" />

      {/* Planks Separation Lines */}
      <path d="M25,250 L375,240" stroke="#5c4033" strokeWidth="2" opacity="0.6" />
      <path d="M22,420 L378,430" stroke="#5c4033" strokeWidth="2" opacity="0.6" />
      <path d="M20,600 L380,590" stroke="#5c4033" strokeWidth="2" opacity="0.6" />

      {/* Nail Heads */}
      <circle cx="50" cy="120" r="6" fill="#4a3728" />
      <circle cx="350" cy="120" r="6" fill="#4a3728" />
      <circle cx="50" cy="750" r="6" fill="#4a3728" />
      <circle cx="350" cy="750" r="6" fill="#4a3728" />
    </svg>
  );
}

export function RucksackDrawerBg({className}: {className?: string}) {
  return (
    <svg
      viewBox="0 0 500 900"
      preserveAspectRatio="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="canvasTexture">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
             <feFuncA type="linear" slope="0.2" />
          </feComponentTransfer>
        </filter>
        <dropShadow id="bagShadow" dx="5" dy="5" stdDeviation="10" floodOpacity="0.5" />
      </defs>

      {/* Main Bag Body (Open) */}
      <path
        d="M50,100 C50,50 150,20 250,20 C350,20 450,50 450,100 L480,800 C480,850 400,880 250,880 C100,880 20,850 20,800 Z"
        fill="#8f8c76" // Olive drab canvas
        stroke="#4a483d"
        strokeWidth="3"
        filter="url(#bagShadow)"
      />
      
      {/* Texture Overlay */}
      <rect x="20" y="20" width="460" height="860" fill="transparent" filter="url(#canvasTexture)" opacity="0.3" />

      {/* Interior Compartment (Darker) */}
      <path
        d="M70,120 C70,120 150,100 250,100 C350,100 430,120 430,120 L440,750 C440,750 350,780 250,780 C150,780 60,750 60,750 Z"
        fill="#5c5a4a" // Darker interior
        stroke="#3d3c32"
        strokeWidth="2"
      />

      {/* Flap (Rolled Up/Back) */}
      <path
        d="M50,100 Q250,-20 450,100"
        fill="none"
        stroke="#6b5b45" // Leather trim
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Leather Straps */}
      <rect x="120" y="120" width="40" height="700" fill="#8b4513" rx="5" />
      <rect x="340" y="120" width="40" height="700" fill="#8b4513" rx="5" />
      
      {/* Stitching on Straps */}
      <path d="M125,120 L125,820" stroke="#d2b48c" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M155,120 L155,820" stroke="#d2b48c" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M345,120 L345,820" stroke="#d2b48c" strokeWidth="2" strokeDasharray="5 5" />
      <path d="M375,120 L375,820" stroke="#d2b48c" strokeWidth="2" strokeDasharray="5 5" />

      {/* Buckles */}
      <rect x="115" y="600" width="50" height="40" fill="#cd7f32" rx="2" stroke="#8b4513" strokeWidth="2" />
      <rect x="335" y="600" width="50" height="40" fill="#cd7f32" rx="2" stroke="#8b4513" strokeWidth="2" />

      {/* Side Pockets */}
      <path d="M450,400 L490,420 L490,600 L450,620 Z" fill="#7d7a66" stroke="#4a483d" strokeWidth="2" />
      <path d="M50,400 L10,420 L10,600 L50,620 Z" fill="#7d7a66" stroke="#4a483d" strokeWidth="2" />

    </svg>
  );
}
