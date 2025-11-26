import {useEffect, useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';

export function FieldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollY} = useScroll();
  
  // Parallax effects
  // Skeleton moves slower (background)
  const ySkeleton = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Single Hero Layer - Horse sits ON TOP of the border (z-40 vs z-30) */}
      <motion.div 
        style={{y: ySkeleton}}
        className="absolute inset-0 flex items-center justify-center z-40 pb-48"
      >
        <img 
          src="/assets/horse homepage.png" 
          alt="The Reclaimed World" 
          className="max-h-[80vh] w-auto object-contain"
        />
      </motion.div>

      {/* Hero Text Overlay */}
      <div className="absolute bottom-56 left-1/2 -translate-x-1/2 z-20 text-center pt-8">
        <h2 className="font-heading text-4xl md:text-6xl text-dark-green tracking-widest mb-4">
          THE RECLAIMED WORLD
        </h2>
        <p className="font-body text-[#c04e01] text-lg tracking-widest uppercase">
          Figure 1.A: Equus Ferus Caballus
        </p>
      </div>


      {/* Divider at the bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-48 z-30 pointer-events-none"
        style={{
            backgroundImage: "url('/assets/divider_ornamental_vine.png')",
            backgroundSize: 'auto 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom center'
        }}
      />
    </section>
  );
}
