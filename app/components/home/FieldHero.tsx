import {useRef, useState, useEffect} from 'react';
import {motion, useScroll, useTransform, useMotionValue} from 'framer-motion';
import {Link} from '@remix-run/react';


// Helper for stepped values (Moved outside to prevent hook violation)
const useSteppedTransform = (value: any, input: number[], output: number[], stepSize: number) => {
  const smooth = useTransform(value, input, output);
  return useTransform(smooth, (v) => Math.floor(v / stepSize) * stepSize);
};

export function FieldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {scrollY} = useScroll();
  const [videoEnded, setVideoEnded] = useState(false);
  
  // Scroll Parallax
  const ySkeleton = useSteppedTransform(scrollY, [0, 500], [0, 100], 20); // 20px steps
  const yText = useSteppedTransform(scrollY, [0, 500], [0, 50], 10); // 10px steps

  // Fix Hydration Error: Generate particles on client only
  const [particles, setParticles] = useState<Array<{x: string, y: string, scale: number, opacity: number, duration: number, moveY: number, moveX: number, width: number, height: number}>>([]);

  useEffect(() => {
    const newParticles = [...Array(8)].map(() => ({
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 20 + 10,
        moveY: Math.random() * -100,
        moveX: (Math.random() - 0.5) * 50,
        width: Math.random() * 6 + 2,
        height: Math.random() * 6 + 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-transparent"
    >
      {/* Floating Spores/Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {particles.map((p, i) => (
              <motion.div
                  key={i}
                  className="absolute bg-dark-green/20 rounded-full blur-[1px]"
                  initial={{
                      x: p.x,
                      y: p.y,
                      scale: p.scale,
                      opacity: p.opacity
                  }}
                  animate={{
                      y: [null, p.moveY],
                      x: [null, p.moveX],
                  }}
                  transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "linear"
                  }}
                  style={{
                      width: p.width + "px",
                      height: p.height + "px",
                  }}
              />
          ))}
      </div>

      {/* Hero Layer - Horse */}
      <motion.div 
        style={{y: ySkeleton}}
        className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none perspective-1000"
      >
        <div className="h-[55vh] w-auto flex items-center justify-center transition-transform duration-100 ease-out relative">
            {/* Video - Privacy Policy Document Style - Interactive */}
            <motion.div 
                className="relative bg-[#f0ede6] border border-dark-green/20 p-4 shadow-2xl rotate-1 h-full cursor-pointer pointer-events-auto"
                whileHover={{ scale: 1.02, rotate: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <video
                    autoPlay
                    muted
                    playsInline
                    loop={false}
                    onEnded={() => setVideoEnded(true)}
                    className="h-full w-auto object-contain"
                >
                    <source src="/assets/herovideo1.mp4" type="video/mp4" />
                </video>
            </motion.div>
        </div>
      </motion.div>

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
