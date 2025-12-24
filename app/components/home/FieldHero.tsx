import {useRef, useState, useEffect} from 'react';
import {motion} from 'framer-motion';

export function FieldHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fallback: Show video after 3 seconds even if load events don't fire
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!videoLoaded) {
        setVideoLoaded(true);
        // Try to play the video manually
        videoRef.current?.play().catch(() => {});
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [videoLoaded]);

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

      {/* Hero Layer - Video + Text */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] md:pt-[15vh] z-40 pointer-events-none"
      >
        {/* Headline - Above Video */}
        <motion.div 
          className="text-center mb-8 pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-dark-green tracking-widest uppercase mb-2">
            Nature Always Wins
          </h1>
          <p className="font-body text-dark-green/60 text-sm md:text-base tracking-widest">
            Streetwear recovered from the world after.
          </p>
        </motion.div>

        <div className="h-[55vh] md:h-[60vh] w-auto flex flex-col items-center justify-center transition-transform duration-100 ease-out relative">
            {/* Loading Placeholder */}
            {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#f0ede6] border border-dark-green/20 p-2 md:p-4 shadow-2xl rotate-1">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-dark-green/30 border-t-dark-green rounded-full animate-spin" />
                        <span className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Loading...</span>
                    </div>
                </div>
            )}
            
            {/* Video - Privacy Policy Document Style - Interactive */}
            <motion.div 
                className={`relative bg-[#f0ede6] border border-dark-green/20 p-2 md:p-4 shadow-2xl rotate-1 w-auto h-auto max-w-[90vw] md:max-w-full cursor-pointer pointer-events-auto transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                whileHover={videoEnded && !isMobile ? { scale: 1.02, rotate: 2 } : {}}
                animate={videoEnded && isMobile ? { rotate: [1, 3, 1], scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('featured-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onTimeUpdate={(e) => {
                      if (e.currentTarget.currentTime >= 3.9) {
                        e.currentTarget.pause();
                        setVideoEnded(true);
                      }
                    }}
                    onEnded={() => setVideoEnded(true)}
                    onCanPlay={() => setVideoLoaded(true)}
                    onLoadedData={() => setVideoLoaded(true)}
                    onLoadedMetadata={() => setVideoLoaded(true)}
                    className="max-h-[55vh] md:max-h-[60vh] w-auto object-contain"
                >
                    <source src="/assets/OvergrowthHero.mp4" type="video/mp4" />
                </video>
            </motion.div>

            {/* Click/Tap hint that appears after video ends - Absolutely positioned to prevent layout shift */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: videoEnded ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-mono text-xs text-dark-green/50 uppercase tracking-widest pointer-events-none whitespace-nowrap"
            >
              {isMobile ? 'Tap to enter' : 'Click to enter'}
            </motion.p>
        </div>
      </div>
    </section>
  );
}
