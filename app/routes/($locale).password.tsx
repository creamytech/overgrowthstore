import {useEffect, useRef, useState, useCallback} from 'react';
import {useNavigate} from '@remix-run/react';
import {motion, useAnimation, PanInfo, AnimatePresence} from 'framer-motion';

// Particle type for trailing effects
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

// Firefly type for ambient particles
interface Firefly {
  id: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
}

export default function PasswordPage() {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [error, setError] = useState(false);
  const [showVines, setShowVines] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [proximity, setProximity] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const [isNearKeyhole, setIsNearKeyhole] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  
  // Animation Controls
  const keyControls = useAnimation();
  const gateClosedControls = useAnimation();
  const gateOpenControls = useAnimation();
  const bgControls = useAnimation();

  // Hardcoded Access Code
  const ACCESS_CODE = 'OVERGROWTH';
  const RIDDLE = 'What outlasts the concrete?';

  // Initialize fireflies on mount
  useEffect(() => {
    const newFireflies: Firefly[] = [];
    for (let i = 0; i < 15; i++) {
      newFireflies.push({
        id: i,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 5,
      });
    }
    setFireflies(newFireflies);
  }, []);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect for input
  useEffect(() => {
    if (passcode.length > displayedCode.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(passcode.slice(0, displayedCode.length + 1));
      }, 50);
      return () => clearTimeout(timer);
    } else if (passcode.length < displayedCode.length) {
      setDisplayedCode(passcode);
    }
  }, [passcode, displayedCode]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(p => p.opacity > 0.1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Calculate proximity to keyhole
  const calculateProximity = useCallback((keyX: number, keyY: number) => {
    if (!dropZoneRef.current || !containerRef.current) return 0;
    
    const dropRect = dropZoneRef.current.getBoundingClientRect();
    const dropCenterX = dropRect.left + dropRect.width / 2;
    const dropCenterY = dropRect.top + dropRect.height / 2;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const absoluteKeyX = containerRect.left + containerRect.width / 2 + keyX;
    const absoluteKeyY = containerRect.top + containerRect.height / 2 + keyY;
    
    const distance = Math.sqrt(
      Math.pow(absoluteKeyX - dropCenterX, 2) + 
      Math.pow(absoluteKeyY - dropCenterY, 2)
    );
    
    return Math.max(0, 1 - distance / 250);
  }, []);

  // Add particle trail
  const addParticle = useCallback((x: number, y: number) => {
    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
      size: 4 + Math.random() * 8,
      opacity: 0.8,
    };
    setParticles(prev => [...prev.slice(-20), newParticle]);
  }, []);

  // Start key animation when code is correct
  useEffect(() => {
    if (isCodeCorrect) {
      keyControls.start({
        x: 150,
        y: 250,
        rotate: 45,
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      });
    }
  }, [isCodeCorrect, keyControls]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === ACCESS_CODE) {
      setShowVines(true);
      setError(false);
      // Delay showing key until vines animate
      setTimeout(() => {
        setIsCodeCorrect(true);
        setShowVines(false);
      }, 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  // Unlock Sequence - using timeouts for reliability
  const handleUnlock = () => {
    if (isUnlocked) return; // Prevent double-triggering
    setIsUnlocked(true);

    let targetX = 0;
    let targetY = 0;

    if (containerRef.current && dropZoneRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const dropRect = dropZoneRef.current.getBoundingClientRect();

      const cx = containerRect.width / 2;
      const cy = containerRect.height / 2;

      const dx = dropRect.left + dropRect.width / 2;
      const dy = dropRect.top + dropRect.height / 2;

      targetX = dx - containerRect.left - cx;
      targetY = dy - containerRect.top - cy;
    }

    // Step 1: Snap Key to Lock and Rotate (0-600ms)
    keyControls.start({
      x: targetX, 
      y: targetY,
      rotate: 90,
      scale: 1,
      transition: { duration: 0.5, type: "spring", bounce: 0.2 }
    });

    // Step 2: After key turns, hide key and open gate (700ms)
    setTimeout(() => {
      // Hide the key
      keyControls.start({ opacity: 0, scale: 0.5, transition: { duration: 0.3 } });
      
      // Open the gate
      gateClosedControls.start({ opacity: 0, transition: { duration: 1 } });
      gateOpenControls.start({ opacity: 1, transition: { duration: 1 } });
      bgControls.start({ 
        filter: "blur(0px)", 
        scale: 1.1, 
        transition: { duration: 1.2 } 
      });
    }, 700);

    // Step 3: Fade to white (1800ms)
    setTimeout(() => {
      setShowFade(true);
    }, 1800);

    // Step 4: Navigate to home (2600ms)
    setTimeout(() => {
      navigate('/');
    }, 2600);
  };

  const onDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isUnlocked) return;
    
    // Add particle trail while dragging
    if (Math.random() > 0.7) {
      addParticle(info.point.x, info.point.y);
    }
    
    // Calculate and update proximity
    const newProximity = calculateProximity(info.offset.x + 150, info.offset.y + 250);
    setProximity(newProximity);
    setIsNearKeyhole(newProximity > 0.3);
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isUnlocked) return;

    if (dropZoneRef.current) {
      const dropRect = dropZoneRef.current.getBoundingClientRect();
      const point = info.point;

      if (
        point.x >= dropRect.left &&
        point.x <= dropRect.right &&
        point.y >= dropRect.top &&
        point.y <= dropRect.bottom
      ) {
        handleUnlock();
      } else {
        keyControls.start({
          x: 150,
          y: 250,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        });
        setProximity(0);
        setIsNearKeyhole(false);
      }
    }
  };

  // Staggered entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } }
  };

  return (
    <motion.div 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden bg-black"
      initial="hidden"
      animate={pageLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Custom cursor near keyhole */}
      <style>{`
        @keyframes fogDrift {
          0% { transform: translateX(-100%) translateY(0) scale(1.5); opacity: 0.3; }
          50% { transform: translateX(0%) translateY(-30px) scale(1.8); opacity: 0.5; }
          100% { transform: translateX(100%) translateY(0) scale(1.5); opacity: 0.3; }
        }
        @keyframes fogDrift2 {
          0% { transform: translateX(100%) translateY(20px) scale(1.6); opacity: 0.25; }
          50% { transform: translateX(0%) translateY(-10px) scale(1.9); opacity: 0.4; }
          100% { transform: translateX(-100%) translateY(20px) scale(1.6); opacity: 0.25; }
        }
        @keyframes vineGrow {
          0% { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-30px) translateX(15px); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
        .fog-layer {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .fog-1 { animation: fogDrift 20s ease-in-out infinite; }
        .fog-2 { animation: fogDrift2 25s ease-in-out infinite; animation-delay: -10s; }
      `}</style>

      {/* Layer 0: Background with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-0"
        initial={{ filter: "blur(8px)", scale: 1.05 }}
        animate={bgControls}
        variants={itemVariants}
        style={{
          x: mousePosition.x * 15,
          y: mousePosition.y * 15,
        }}
      >
        <img 
          src="/assets/OvergrownMansion.jpg" 
          alt="Background" 
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
      </motion.div>

      {/* Fog Layers */}
      <div className="fog-layer fog-1 z-[1]" />
      <div className="fog-layer fog-2 z-[1]" />

      {/* Fireflies / Spores */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {fireflies.map((firefly) => (
          <motion.div
            key={firefly.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${firefly.startX}%`,
              top: `${firefly.startY}%`,
              background: 'radial-gradient(circle, rgba(201,180,130,0.8) 0%, rgba(201,180,130,0) 70%)',
              boxShadow: '0 0 10px rgba(201,180,130,0.5)',
            }}
            animate={{
              x: [0, 50, -30, 20, 0],
              y: [-20, 30, -40, 10, -20],
              opacity: [0, 0.8, 0.4, 0.9, 0],
              scale: [0.5, 1, 0.7, 1.2, 0.5],
            }}
            transition={{
              duration: firefly.duration,
              delay: firefly.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Layer 1: The Gate with subtle parallax */}
      <motion.div 
        className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
        variants={itemVariants}
        style={{
          x: mousePosition.x * 5,
          y: mousePosition.y * 5,
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Gate Closed */}
          <motion.img 
            src="/assets/GateClosedFinal.svg.svg" 
            alt="Gate Closed" 
            className="absolute w-full h-full object-cover drop-shadow-2xl"
            initial={{ opacity: 1 }}
            animate={gateClosedControls}
          />
          {/* Gate Open */}
          <motion.img 
            src="/assets/GateOpenFinal.svg.svg" 
            alt="Gate Open" 
            className="absolute w-full h-full object-cover drop-shadow-2xl"
            initial={{ opacity: 0 }}
            animate={gateOpenControls}
          />
        </div>
      </motion.div>

      {/* Particle Trail */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed rounded-full pointer-events-none z-30"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: 'radial-gradient(circle, rgba(145,120,80,0.9) 0%, rgba(90,75,50,0.5) 50%, transparent 70%)',
            }}
            initial={{ opacity: particle.opacity, scale: 1 }}
            animate={{ opacity: 0, scale: 0.3, y: particle.size * 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Layer 2: Interaction Layer */}
      <div className="absolute inset-0 z-20">
        {/* Drop Zone with Proximity Glow - CLICKABLE as fallback */}
        {isCodeCorrect && !isUnlocked && (
          <div 
            ref={dropZoneRef}
            onClick={() => {
              // Fallback: if key is near, clicking the lock also unlocks
              if (proximity > 0.2) {
                handleUnlock();
              }
            }}
            className="absolute top-[67%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer"
          >
            {/* Keyhole Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(201,180,130,${proximity * 0.6}) 0%, rgba(139,115,85,${proximity * 0.3}) 40%, transparent 70%)`,
                boxShadow: `0 0 ${proximity * 60}px ${proximity * 20}px rgba(201,180,130,${proximity * 0.4})`,
              }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        )}

        {/* The Key - Only visible after vine animation */}
        {isCodeCorrect && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-20 md:w-28 cursor-grab active:cursor-grabbing"
            initial={{ x: 150, y: 250, rotate: 45, opacity: 0, scale: 0.5 }}
            animate={keyControls}
            drag={!isUnlocked}
            dragConstraints={containerRef}
            dragElastic={0.15}
            dragMomentum={false}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            whileHover={{ scale: 1.1, filter: "brightness(1.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            <img 
              src="/assets/Key.png" 
              alt="Key" 
              className="w-full h-auto drop-shadow-2xl filter contrast-125"
              draggable={false}
            />
            {/* Key glow when near keyhole */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `radial-gradient(circle, rgba(201,180,130,${proximity * 0.3}) 0%, transparent 60%)`,
                filter: `blur(${proximity * 10}px)`,
              }}
            />
          </motion.div>
        )}

        {/* Vine Growing Animation Overlay */}
        <AnimatePresence>
          {showVines && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="relative w-80 h-80">
                {/* Animated vine tendrils */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-[#3d5a3d] to-[#6b8e6b] origin-bottom"
                    style={{
                      height: 100 + Math.random() * 60,
                      rotate: i * 45,
                      borderRadius: '2px',
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
                {/* Center bloom */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(107,142,107,0.9) 0%, rgba(61,90,61,0.8) 60%, transparent 100%)',
                    boxShadow: '0 0 30px rgba(107,142,107,0.6)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                  transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Entry Form */}
        {!isCodeCorrect && !showVines && (
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            variants={itemVariants}
          >
            <motion.div
              className={`bg-black/40 backdrop-blur-lg p-8 md:p-12 rounded-sm border border-white/10 text-center max-w-sm mx-4 ${error ? 'shake-animation' : ''}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Riddle */}
              <motion.p 
                className="font-heading text-[#c9b482] text-sm md:text-base tracking-[0.15em] mb-2 opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 0.8 }}
              >
                RIDDLE
              </motion.p>
              <motion.p 
                className="font-body text-[#f4f1ea] text-lg md:text-xl italic mb-8 drop-shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                "{RIDDLE}"
              </motion.p>
              
              <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-5">
                {/* Typewriter Input */}
                <div className="relative w-full">
                  <input 
                    type="text" 
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="SPEAK THE ANSWER"
                    className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500/80 text-red-200' : 'border-[#c9b482]/50 text-[#f4f1ea]'} px-4 py-3 text-center font-heading text-lg tracking-[0.3em] outline-none focus:border-[#c9b482] transition-all duration-300 placeholder:text-white/20 placeholder:tracking-[0.15em] placeholder:text-sm caret-[#c9b482]`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-400/90 text-xs tracking-wider font-body"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      The answer echoes wrong...
                    </motion.p>
                  )}
                </AnimatePresence>
                
                <motion.button 
                  type="submit"
                  className="mt-2 px-8 py-3 text-xs font-heading tracking-[0.25em] text-[#c9b482]/80 hover:text-[#f4f1ea] border border-[#c9b482]/30 hover:border-[#c9b482] hover:bg-[#c9b482]/10 transition-all duration-300 rounded-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  SUBMIT
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Hint Text - Only show when key is available */}
      <AnimatePresence>
        {isCodeCorrect && !isUnlocked && (
          <motion.div 
            className="absolute bottom-8 md:bottom-12 w-full text-center z-30 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="font-heading text-[#c9b482] text-base md:text-lg tracking-[0.25em] drop-shadow-lg">
              DRAG THE KEY TO UNLOCK
            </p>
            <motion.div 
              className="mt-3 mx-auto w-8 h-8 border-2 border-[#c9b482]/40 rounded-full flex items-center justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-4 h-4 text-[#c9b482]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Watermark */}
      <motion.div 
        className="absolute top-6 left-6 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <img 
          src="/assets/Wordmark Transparent.png" 
          alt="Overgrowth" 
          className="h-8 md:h-10 w-auto opacity-60 filter brightness-150"
        />
      </motion.div>

      {/* Fade to white overlay on unlock */}
      <AnimatePresence>
        {showFade && (
          <motion.div
            className="fixed inset-0 bg-[#f4f1ea] z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
