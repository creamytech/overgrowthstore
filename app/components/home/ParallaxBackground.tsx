import {useScroll, useTransform, motion} from 'framer-motion';
import {useRef} from 'react';

export function ParallaxBackground({children}: {children: React.ReactNode}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Aging Effect: Dawn (Cool) -> Dusk (Warm/Decay)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['#0A0A0A', '#1a1a1a', '#2d2a25'] // void -> dark grey -> warm decay
  );

  const accentColor = useTransform(
    scrollYProgress,
    [0, 1],
    ['#4A5D23', '#8B9B78'] // moss -> decay
  );

  // Parallax Layers
  const yRuins = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const yVines = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);

  return (
    <motion.div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{backgroundColor}}
    >
      {/* Layer 1: Background Ruins (Fixed/Slow) */}
      <motion.div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{y: yRuins}}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern
            id="ruins-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M10 10 H20 V20 H10 Z M50 50 H60 V60 H50 Z"
              fill="currentColor"
              className="text-bone"
            />
            <path
              d="M80 10 L90 20 L80 30 Z"
              fill="currentColor"
              className="text-bone"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#ruins-pattern)" />
        </svg>
      </motion.div>

      {/* Layer 2: Midground Content */}
      <div className="relative z-10">{children}</div>

      {/* Layer 3: Foreground Vines (Fast) */}
      <motion.div
        className="fixed inset-0 z-20 pointer-events-none opacity-30"
        style={{y: yVines, color: accentColor}}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <path
            d="M-50 0 Q100 300 50 600 T150 900"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M100% 0 Q90% 400 95% 800"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
