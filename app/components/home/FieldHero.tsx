import {useRef, useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '@remix-run/react';

export function FieldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
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

      {/* Hero Layer - Video */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
      >
        <div className="h-[55vh] w-auto flex items-center justify-center transition-transform duration-100 ease-out relative">
            {/* Video - Privacy Policy Document Style - Interactive */}
            <motion.div 
                className="relative bg-[#f0ede6] border border-dark-green/20 p-2 md:p-4 shadow-2xl rotate-1 w-auto h-auto max-w-[90vw] md:max-w-full cursor-pointer pointer-events-auto"
                whileHover={videoEnded && !isMobile ? { scale: 1.02, rotate: 2 } : {}}
                animate={videoEnded && isMobile ? { rotate: [1, 3, 1], scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <video
                    autoPlay
                    muted
                    playsInline
                    loop={false}
                    onEnded={() => setVideoEnded(true)}
                    className="max-h-[55vh] w-auto object-contain"
                >
                    <source src="/assets/herovideofinal.mp4" type="video/mp4" />
                </video>

                {/* Mobile Interaction Hint */}
                <AnimatePresence>
                    {videoEnded && (
                        <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                opacity: { duration: 2, repeat: Infinity },
                                y: { duration: 0.5 }
                            }}
                            className="absolute -bottom-12 left-0 w-full text-center pointer-events-none z-20"
                        >
                            <span className="font-typewriter text-[10px] tracking-[0.2em] text-dark-green/60 uppercase px-3 py-1">
                                {isMobile ? "Tap to Enter" : "Click to Enter"}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
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
