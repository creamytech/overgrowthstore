import {motion} from 'framer-motion';

export function OrganicVideo() {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-32 px-4">
      <div className="relative aspect-video">
        {/* SVG Mask Definition */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="organic-mask" clipPathUnits="objectBoundingBox">
              <path d="M0.1,0.1 Q0.4,0 0.6,0.1 T0.9,0.2 T1,0.5 T0.9,0.8 T0.6,0.9 T0.2,0.8 T0,0.5 T0.1,0.1" />
            </clipPath>
          </defs>
        </svg>

        <motion.div
          className="w-full h-full bg-void border border-moss/30 flex items-center justify-center overflow-hidden"
          style={{clipPath: 'url(#organic-mask)'}}
          initial={{scale: 0.9, opacity: 0.8}}
          whileInView={{scale: 1, opacity: 1}}
          transition={{duration: 1}}
        >
          {/* Placeholder for actual video - using a gradient/animation for now */}
          <div className="absolute inset-0 bg-gradient-to-br from-void via-moss/20 to-void animate-pulse" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-serif text-bone mb-2">The Overgrowth</h2>
            <p className="text-moss font-mono text-sm">WATCH THE ORIGIN</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
