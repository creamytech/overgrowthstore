import {useState, useEffect, useRef} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export function ResurrectionIntro({onComplete}: {onComplete: () => void}) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      if (isHolding && !isComplete) {
        setProgress((prev) => {
          const newProgress = prev + 1; // Adjust speed here
          if (newProgress >= 100) {
            setIsComplete(true);
            return 100;
          }
          return newProgress;
        });
        requestRef.current = requestAnimationFrame(animate);
      } else if (!isHolding && !isComplete && progress > 0) {
        setProgress((prev) => Math.max(0, prev - 2)); // Decay speed
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [isHolding, isComplete, progress]);

  useEffect(() => {
    if (isComplete) {
      setTimeout(onComplete, 2000); // Wait for bloom animation
    }
  }, [isComplete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void text-bone select-none"
      initial={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 1}}}
    >
      <div
        className="relative cursor-pointer"
        onMouseDown={() => setIsHolding(true)}
        onMouseUp={() => setIsHolding(false)}
        onTouchStart={() => setIsHolding(true)}
        onTouchEnd={() => setIsHolding(false)}
      >
        {/* Wireframe / Skeleton SVG */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          className="stroke-bone fill-none"
          style={{strokeWidth: 1}}
        >
          {/* Ribcage Abstract */}
          <motion.path
            d="M100 20 Q150 50 150 100 Q150 150 100 180 Q50 150 50 100 Q50 50 100 20"
            initial={{pathLength: 0, opacity: 0.2}}
            animate={{pathLength: 1, opacity: 0.5}}
            transition={{duration: 2, ease: 'easeInOut'}}
          />
          <motion.path
            d="M100 20 V180"
            initial={{pathLength: 0}}
            animate={{pathLength: 1}}
            transition={{duration: 1.5, delay: 0.5}}
          />
          {/* Ribs */}
          {[1, 2, 3, 4].map((i) => (
            <motion.path
              key={i}
              d={`M100 ${40 + i * 25} H${140 - i * 5}`}
              initial={{pathLength: 0}}
              animate={{pathLength: 1}}
              transition={{duration: 1, delay: 1 + i * 0.2}}
            />
          ))}
          {[1, 2, 3, 4].map((i) => (
            <motion.path
              key={`l-${i}`}
              d={`M100 ${40 + i * 25} H${60 + i * 5}`}
              initial={{pathLength: 0}}
              animate={{pathLength: 1}}
              transition={{duration: 1, delay: 1 + i * 0.2}}
            />
          ))}

          {/* Growth / Vines (Overlay) */}
          {isComplete && (
            <>
              <motion.path
                d="M100 180 Q130 130 100 80 Q70 130 100 180"
                className="stroke-moss fill-moss/20"
                initial={{pathLength: 0, opacity: 0}}
                animate={{pathLength: 1, opacity: 1}}
                transition={{duration: 1.5}}
              />
              <motion.circle
                cx="100"
                cy="50"
                r="0"
                className="fill-contrast"
                animate={{r: 10}}
                transition={{delay: 1.5, type: 'spring'}}
              />
            </>
          )}
        </svg>

        {/* Progress Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-moss blur-3xl"
          style={{opacity: progress / 200}}
        />
      </div>

      <div className="mt-12 text-center font-serif tracking-widest uppercase text-sm">
        {isComplete ? (
          <motion.span
            initial={{opacity: 0, y: 10}}
            animate={{opacity: 1, y: 0}}
            className="text-moss"
          >
            Resurrection Complete
          </motion.span>
        ) : (
          <span className="opacity-50">Hold to Resurrect</span>
        )}
      </div>

      {/* Progress Bar (Subtle) */}
      {!isComplete && (
        <div className="mt-4 w-32 h-1 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-moss"
            style={{width: `${progress}%`}}
          />
        </div>
      )}
    </motion.div>
  );
}
