import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export function SporeCursor() {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [trail, setTrail] = useState<{x: number; y: number; id: number}[]>([]);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
      
      // Add trail particle occasionally
      if (Math.random() > 0.8) {
          setTrail(prev => [
              ...prev.slice(-15), // Keep last 15 particles
              {x: e.clientX, y: e.clientY, id: Date.now()}
          ]);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Main Cursor (Seed) */}
      <motion.div
        className="absolute w-4 h-4 bg-moss rounded-full border border-ink"
        style={{
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
        }}
        transition={{type: "spring", stiffness: 500, damping: 28}}
      />

      {/* Trail (Spores) */}
      <AnimatePresence>
        {trail.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{opacity: 0.8, scale: 0.5, x: particle.x, y: particle.y}}
            animate={{
                opacity: 0, 
                scale: 0, 
                y: particle.y + 20, // Fall down slightly
                x: particle.x + (Math.random() * 10 - 5) // Drift
            }}
            exit={{opacity: 0}}
            transition={{duration: 2}}
            className="absolute w-2 h-2 bg-rust/50 rounded-full"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
