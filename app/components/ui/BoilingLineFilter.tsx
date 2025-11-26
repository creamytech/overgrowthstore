export function BoilingLineFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter id="boiling-line">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              dur="0.5s"
              values="0.05;0.04;0.05"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        
        <filter id="static-roughness">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </defs>
    </svg>
  );
}
