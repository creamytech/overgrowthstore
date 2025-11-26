import {useEffect, useState} from 'react';
import {motion, useMotionValue, useSpring} from 'framer-motion';

export function PolinatorCursor() {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = {damping: 25, stiffness: 700};
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
      cursorX.set(e.clientX - 16); // Center offset
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {/* The Bee */}
      <motion.div
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 15 : 0,
        }}
        className="relative w-8 h-8"
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-ink drop-shadow-sm">
          {/* Simple Bee Shape */}
          <path
            d="M12 4C14 4 15 6 15 6C15 6 17 5 18 6C19 7 18 9 18 9C18 9 20 10 20 12C20 14 18 15 18 15C18 15 19 17 18 18C17 19 15 18 15 18C15 18 14 20 12 20C10 20 9 18 9 18C9 18 7 19 6 18C5 17 6 15 6 15C6 15 4 14 4 12C4 10 6 9 6 9C6 9 5 7 6 6C7 5 9 6 9 6C9 6 10 4 12 4Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          {/* Stripes */}
          <path d="M9 9H15" stroke="#F0EAD6" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M9 12H15" stroke="#F0EAD6" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 15H14" stroke="#F0EAD6" strokeWidth="1.5" strokeLinecap="round"/>
          {/* Wings */}
          <path d="M15 9C17 7 20 6 21 8C22 10 20 11 18 11" stroke="currentColor" strokeWidth="1" fill="white" fillOpacity="0.5"/>
          <path d="M9 9C7 7 4 6 3 8C2 10 4 11 6 11" stroke="currentColor" strokeWidth="1" fill="white" fillOpacity="0.5"/>
        </svg>
      </motion.div>
      
      {/* Dashed Trail (Simplified for performance - just a small tail) */}
      <motion.div 
        className="absolute right-full top-1/2 w-12 h-0.5 border-t-2 border-dashed border-ink/30 origin-right"
        style={{rotate: 180}}
        animate={{
            scaleX: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.8 : 0.4
        }}
      />
    </motion.div>
  );
}
