import {motion, useScroll, useTransform} from 'framer-motion';

export function SkeletalHorse() {
  const {scrollY} = useScroll();
  
  // Head movement based on scroll
  const headRotate = useTransform(scrollY, [0, 500], [0, -20]);
  const headY = useTransform(scrollY, [0, 500], [0, -10]);
  
  // Leg movement (subtle shift)
  const legRotate = useTransform(scrollY, [0, 500], [0, 5]);

  return (
    <div className="relative w-96 h-96">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
        {/* Body */}
        <motion.path
          d="M60,100 Q80,90 120,90 T160,110 L160,160 L140,160 L140,120 L120,120 L120,160 L100,160 L100,120 Q80,120 60,130 Z"
          fill="none"
          stroke="#F0EAD6" // Paper color for bones
          strokeWidth="4"
          strokeLinecap="round"
          className="boiling-line"
        />
        
        {/* Ribs */}
        <path d="M80,100 L80,120" stroke="#F0EAD6" strokeWidth="2" />
        <path d="M90,95 L90,120" stroke="#F0EAD6" strokeWidth="2" />
        <path d="M100,95 L100,120" stroke="#F0EAD6" strokeWidth="2" />
        <path d="M110,95 L110,120" stroke="#F0EAD6" strokeWidth="2" />

        {/* Head & Neck - Reacts to Scroll */}
        <motion.g style={{rotate: headRotate, y: headY, originX: 0.8, originY: 0.8}}>
            <path
                d="M160,110 Q170,80 160,60 L180,60 L190,80 L170,110"
                fill="none"
                stroke="#F0EAD6"
                strokeWidth="4"
                strokeLinecap="round"
            />
            {/* Eye */}
            <circle cx="175" cy="70" r="2" fill="#C04000" />
        </motion.g>

        {/* Front Leg - Reacts to Scroll */}
        <motion.path
            d="M160,160 L160,190"
            stroke="#F0EAD6"
            strokeWidth="4"
            strokeLinecap="round"
            style={{rotate: legRotate, originY: 0}}
        />
         {/* Back Leg */}
         <path
            d="M60,130 L50,180"
            stroke="#F0EAD6"
            strokeWidth="4"
            strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
