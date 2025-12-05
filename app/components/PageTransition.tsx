import {motion, AnimatePresence, type Easing} from 'framer-motion';
import {useLocation, useNavigation} from '@remix-run/react';
import {useEffect, useState} from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as Easing, // easeOut cubic-bezier
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
      ease: [0.55, 0.085, 0.68, 0.53] as Easing, // easeIn cubic-bezier
    },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({children}: PageTransitionProps) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Navigation progress bar component
export function NavigationProgress() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const isNavigating = navigation.state !== 'idle';

  useEffect(() => {
    if (isNavigating) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(timer);
    } else {
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 200);
      return () => clearTimeout(timer);
    }
  }, [isNavigating]);

  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
      <motion.div
        className="h-full bg-rust"
        initial={{width: 0}}
        animate={{width: `${progress}%`}}
        transition={{duration: 0.1, ease: 'easeOut'}}
      />
    </div>
  );
}
