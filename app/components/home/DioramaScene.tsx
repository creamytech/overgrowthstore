import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function DioramaScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax Transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const midgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-paper">
      
      {/* Layer 3: Background (Slowest) - Gas Station */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 flex items-center justify-end pr-12 md:pr-32 opacity-80"
      >
        <div className="w-[80%] md:w-[60%] h-full bg-[url('/woodcut_gas_station.png')] bg-contain bg-no-repeat bg-center grayscale contrast-125 mix-blend-multiply" />
      </motion.div>

      {/* Layer 2: Midground (Subject) - Skeletal Horse */}
      <motion.div 
        style={{ y: midgroundY }}
        className="absolute inset-0 z-10 flex items-center justify-start pl-4 md:pl-24 pt-32"
      >
        <img 
            src="/woodcut_horse.png" 
            alt="Skeletal Horse" 
            className="w-[60%] md:w-[40%] h-auto drop-shadow-2xl grayscale contrast-125"
        />
      </motion.div>

      {/* Layer 1: Foreground (Fastest - Vines/Overgrowth) */}
      <motion.div 
        style={{ y: foregroundY }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
         {/* Top Vines */}
         <div className="absolute top-0 left-0 w-full h-64 bg-[url('/woodcut_vines.png')] bg-repeat-x bg-contain opacity-80 mix-blend-multiply rotate-180" />
         
         {/* Bottom Vines */}
         <div className="absolute bottom-0 left-0 w-full h-96 bg-[url('/woodcut_vines.png')] bg-repeat-x bg-contain opacity-90 mix-blend-multiply" />
      </motion.div>

      {/* Hero Text Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center pointer-events-none mix-blend-difference text-paper">
        <h1 className="font-serif text-6xl md:text-9xl tracking-tighter opacity-90">
            OVERGROWTH
        </h1>
        <p className="font-mono text-sm md:text-base tracking-[0.5em] uppercase mt-4">
            Nature Reclaims All
        </p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-px h-16 bg-ink/50" />
      </motion.div>

    </div>
  );
}
