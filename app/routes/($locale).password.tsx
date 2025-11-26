import {useEffect, useRef, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import {motion, useAnimation, PanInfo} from 'framer-motion';

export default function PasswordPage() {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Animation Controls
  const keyControls = useAnimation();
  const gateClosedControls = useAnimation();
  const gateOpenControls = useAnimation();
  const bgControls = useAnimation();

  // Hardcoded Access Code (for now)
  const ACCESS_CODE = 'OVERGROWTH';

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toUpperCase() === ACCESS_CODE) {
      setIsCodeCorrect(true);
      setError(false);
    } else {
      setError(true);
      // Shake animation or error feedback could go here
      setTimeout(() => setError(false), 1000);
    }
  };

  // Unlock Sequence
  const handleUnlock = async () => {
    setIsUnlocked(true);

    // Calculate target position (center of drop zone relative to screen center)
    let targetX = 0;
    let targetY = 0;

    if (containerRef.current && dropZoneRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const dropRect = dropZoneRef.current.getBoundingClientRect();

        // Center of container
        const cx = containerRect.width / 2;
        const cy = containerRect.height / 2;

        // Center of drop zone
        const dx = dropRect.left + dropRect.width / 2;
        const dy = dropRect.top + dropRect.height / 2;

        // Difference
        targetX = dx - cx;
        targetY = dy - cy;
    }

    // Step 1: Snap Key to Lock and Rotate
    await keyControls.start({
      x: targetX, 
      y: targetY,
      rotate: 90,
      scale: 1,
      transition: { duration: 0.6, type: "spring", bounce: 0.3 }
    });

    // Short pause to let the user see the key turned
    await new Promise(resolve => setTimeout(resolve, 300));

    // Step 2: Open Gate
    await Promise.all([
        keyControls.start({ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }),
        gateClosedControls.start({ opacity: 0, transition: { duration: 1.5 } }),
        gateOpenControls.start({ opacity: 1, transition: { duration: 1.5 } }),
        bgControls.start({ 
            filter: "blur(0px)", 
            scale: 1.1, 
            transition: { duration: 1.5, ease: "easeInOut" } 
        })
    ]);

    // Step 3: Enter
    setTimeout(() => {
        navigate('/');
    }, 1500);
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isUnlocked) return;

    // Check if dropped in drop zone
    if (dropZoneRef.current) {
        const dropRect = dropZoneRef.current.getBoundingClientRect();
        const point = info.point; // { x, y } absolute page coordinates

        if (
            point.x >= dropRect.left &&
            point.x <= dropRect.right &&
            point.y >= dropRect.top &&
            point.y <= dropRect.bottom
        ) {
            handleUnlock();
        } else {
            keyControls.start({
                x: 200, // Back to initial offset (approx)
                y: 200,
                transition: { type: "spring", stiffness: 300, damping: 30 }
            });
        }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
      {/* Layer 0: Background */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-0"
        initial={{ filter: "blur(8px)", scale: 1 }}
        animate={bgControls}
      >
        <img 
            src="/assets/OvergrownMansion.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dimming overlay */}
      </motion.div>

      {/* Layer 1: The Gate */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            {/* Gate Closed */}
            <motion.img 
                src="/assets/GateClosed.png" 
                alt="Gate Closed" 
                className="absolute w-full h-full object-contain"
                initial={{ opacity: 1 }}
                animate={gateClosedControls}
            />
            {/* Gate Open */}
            <motion.img 
                src="/assets/GateOpen.png" 
                alt="Gate Open" 
                className="absolute w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={gateOpenControls}
            />
        </div>
      </div>

      {/* Layer 2: Interaction Layer */}
      <div className="absolute inset-0 z-20">
          {/* Drop Zone (Invisible Trigger) - Aligned to Lock */}
          {isCodeCorrect && (
            <div 
                ref={dropZoneRef}
                className="absolute top-[63%] left-[54%] transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center"
                // Debug border removed
            >
                {/* Optional: Visual hint for the keyhole */}
            </div>
          )}

          {/* The Key - Only visible after code is correct */}
          {isCodeCorrect && (
              <motion.div
                className="absolute top-1/2 left-1/2 w-24 md:w-32 cursor-grab active:cursor-grabbing"
                // Initial position: Offset to bottom right
                initial={{ x: 150, y: 250, rotate: 45, opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
                drag
                dragConstraints={containerRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={onDragEnd}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                  <img 
                    src="/assets/Key.png" 
                    alt="Key" 
                    className="w-full h-auto drop-shadow-2xl filter contrast-125"
                    draggable={false} // Prevent native drag
                  />
              </motion.div>
          )}

          {/* Code Entry Form - Visible initially */}
          {!isCodeCorrect && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-paper/10 backdrop-blur-md p-8 rounded-sm border border-white/10 text-center"
                  >
                      <p className="font-heading text-[#f4f1ea] text-lg tracking-[0.2em] mb-6 drop-shadow-lg">
                          ENTER PASSCODE
                      </p>
                      <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-4">
                          <input 
                              type="text" 
                              value={passcode}
                              onChange={(e) => setPasscode(e.target.value)}
                              placeholder="CODE"
                              className={`bg-transparent border-b-2 ${error ? 'border-red-500 text-red-200' : 'border-white/50 text-white'} px-4 py-2 text-center font-body tracking-widest outline-none focus:border-rust transition-colors w-48 placeholder:text-white/30`}
                          />
                          <button 
                              type="submit"
                              className="mt-2 text-xs font-heading tracking-[0.2em] text-white/70 hover:text-rust transition-colors"
                          >
                              [ SUBMIT ]
                          </button>
                      </form>
                  </motion.div>
              </div>
          )}
      </div>
      
      {/* Hint Text - Only show when key is available */}
      {isCodeCorrect && (
        <motion.div 
            className="absolute bottom-12 w-full text-center z-30 pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
        >
            <p className="font-heading text-[#f4f1ea] text-xl tracking-[0.2em] drop-shadow-lg">
                UNLOCK THE GATE
            </p>
        </motion.div>
      )}
    </div>
  );
}
