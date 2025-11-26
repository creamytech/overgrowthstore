import {motion} from 'framer-motion';

export function GrowthLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-paper">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 300 100" className="w-full h-full">
            {/* Text Path "OVERGROWTH" (Simplified for demo) */}
            <motion.path
                d="M20,50 L50,20 L80,50 M100,20 L100,50 L130,50 L130,20 M150,20 L150,50 L180,50 M200,20 L200,50 L230,20 L230,50"
                fill="none"
                stroke="#1c1c1c"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{pathLength: 0}}
                animate={{pathLength: 1}}
                transition={{duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1}}
            />
            
            {/* Vine Path */}
            <motion.path
                d="M10,80 Q50,10 90,80 T170,80 T250,80"
                fill="none"
                stroke="#4a5d23"
                strokeWidth="2"
                initial={{pathLength: 0}}
                animate={{pathLength: 1}}
                transition={{duration: 2.5, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatDelay: 1}}
            />
        </svg>
        <div className="text-center font-mono text-xs tracking-widest mt-4 text-ink/60 animate-pulse">
            GERMINATING...
        </div>
      </div>
    </div>
  );
}
