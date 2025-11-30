import {useRef} from 'react';
import {motion, useScroll, useTransform, useMotionValue} from 'framer-motion';

export function FieldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollY} = useScroll();
  
  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const {clientX, clientY} = e;
    const {innerWidth, innerHeight} = window;
    mouseX.set(clientX / innerWidth - 0.5);
    mouseY.set(clientY / innerHeight - 0.5);
  };

  // Helper for stepped values
  const useSteppedTransform = (value: any, input: number[], output: number[], stepSize: number) => {
    const smooth = useTransform(value, input, output);
    return useTransform(smooth, (v) => Math.floor(v / stepSize) * stepSize);
  };

  const xMove = useSteppedTransform(mouseX, [-0.5, 0.5], [-20, 20], 5); // 5px steps
  const yMove = useSteppedTransform(mouseY, [-0.5, 0.5], [-20, 20], 5); // 5px steps
  
  // Scroll Parallax
  const ySkeleton = useSteppedTransform(scrollY, [0, 500], [0, 100], 20); // 20px steps
  const yText = useSteppedTransform(scrollY, [0, 500], [0, 50], 10); // 10px steps

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#f4f1ea]"
      onMouseMove={handleMouseMove}
    >
      {/* Floating Spores/Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
              <motion.div
                  key={i}
                  className="absolute bg-dark-green/20 rounded-full blur-[1px]"
                  initial={{
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: Math.random() * 0.3 + 0.1
                  }}
                  animate={{
                      y: [null, Math.random() * -100],
                      x: [null, (Math.random() - 0.5) * 50],
                  }}
                  transition={{
                      duration: Math.random() * 20 + 10,
                      repeat: Infinity,
                      ease: "linear"
                  }}
                  style={{
                      width: Math.random() * 6 + 2 + "px",
                      height: Math.random() * 6 + 2 + "px",
                  }}
              />
          ))}
      </div>

      {/* Hero Layer - Horse */}
      <motion.div 
        style={{y: ySkeleton, x: xMove, rotateX: yMove, rotateY: xMove}}
        className="absolute inset-0 flex items-center justify-center z-40 pb-48 pointer-events-none perspective-1000"
      >
        <div className="h-[50vh] w-auto flex items-center justify-center transition-transform duration-100 ease-out">
            <img
                src="/assets/horseweb.png"
                alt="The Reclaimed World"
                className="h-full w-auto object-contain drop-shadow-2xl"
            />
        </div>
      </motion.div>

      {/* Hero Text Overlay */}
      <div className="absolute bottom-24 md:bottom-56 left-1/2 -translate-x-1/2 z-20 text-center pt-8 w-full pointer-events-none">
        <motion.div style={{y: yText}}>
          <h2 className="font-heading text-4xl md:text-6xl text-dark-green tracking-widest mb-4">
            THE RECLAIMED WORLD
          </h2>
          <p className="font-body text-[#c04e01] text-lg tracking-widest uppercase">
            Figure 1.A: Equus Ferus Caballus
          </p>
        </motion.div>
      </div>

      {/* Divider at the bottom */}
      <div 
        className="absolute bottom-0 left-0 w-full h-24 md:h-48 z-30 pointer-events-none"
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
