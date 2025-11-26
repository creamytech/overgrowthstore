import {ReactNode} from 'react';

export function BoilingWrapper({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`boiling-line ${className}`}>
      {children}
      {/* SVG Filters for the Boiling Effect - Hidden but referenced by CSS */}
      <svg className="hidden fixed">
        <defs>
          <filter id="boil-1">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="2"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
          <filter id="boil-2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="2"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
          <filter id="boil-3">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="2"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
          <filter id="boil-4">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.025"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="2"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
