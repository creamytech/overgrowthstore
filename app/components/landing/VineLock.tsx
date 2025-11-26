import {motion} from 'framer-motion';

export function VineLock({onComplete}: {onComplete: () => void}) {
  const vinePath =
    'M0,100 C100,80 200,120 300,100 S500,80 600,100 S800,120 900,100'; // Simplified vine path for demo

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        {/* Left Vine */}
        <motion.path
          d="M-50,500 Q200,400 300,250 T400,100"
          fill="none"
          stroke="#4A5D23" // Moss
          strokeWidth="12"
          strokeLinecap="round"
          initial={{pathLength: 0}}
          animate={{pathLength: 1}}
          transition={{duration: 2, ease: 'easeOut'}}
          className="drop-shadow-md"
        />
        {/* Right Vine */}
        <motion.path
          d="M1050,500 Q800,400 700,250 T600,100"
          fill="none"
          stroke="#4A5D23" // Moss
          strokeWidth="12"
          strokeLinecap="round"
          initial={{pathLength: 0}}
          animate={{pathLength: 1}}
          transition={{duration: 2, ease: 'easeOut', delay: 0.5}}
          onAnimationComplete={onComplete}
          className="drop-shadow-md"
        />
        
        {/* Thorns/Leaves (Simplified as small circles for now) */}
        <motion.circle
            cx="300" cy="250" r="8" fill="#C04000" // Rust
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 1.5}}
        />
         <motion.circle
            cx="700" cy="250" r="8" fill="#C04000" // Rust
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 2}}
        />
      </svg>
    </div>
  );
}
