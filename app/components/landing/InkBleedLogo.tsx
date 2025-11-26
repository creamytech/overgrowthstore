import {motion} from 'framer-motion';

export function InkBleedLogo({onComplete}: {onComplete: () => void}) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <svg className="w-full max-w-4xl h-auto" viewBox="0 0 800 200">
        <defs>
          {/* The Ink Bleed Filter */}
          <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* The Text - Animated Stroke */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-serif text-8xl font-bold fill-transparent stroke-ink"
          strokeWidth="2"
          initial={{pathLength: 0, strokeOpacity: 0}}
          animate={{pathLength: 1, strokeOpacity: 1}}
          transition={{duration: 3, ease: 'easeInOut'}}
          onAnimationComplete={() => {
            // Trigger the bleed fill after stroke is done
          }}
        >
          OVERGROWTH
        </motion.text>

        {/* The Text - Bleed Fill (Fades in after stroke) */}
        <motion.text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-serif text-8xl font-bold fill-ink stroke-none"
          style={{filter: 'url(#ink-bleed)'}}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 2.5, duration: 2}}
          onAnimationComplete={onComplete}
        >
          OVERGROWTH
        </motion.text>
      </svg>
    </div>
  );
}
