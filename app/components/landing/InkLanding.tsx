import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export function InkLanding({onEnter}: {onEnter: () => void}) {
  const [step, setStep] = useState<'drawing' | 'locking' | 'ready' | 'zooming'>(
    'drawing',
  );

  const handleLogoComplete = () => {
    setStep('locking');
  };

  const handleVinesComplete = () => {
    setStep('ready');
  };

  const handleEnter = () => {
    setStep('zooming');
    setTimeout(onEnter, 1000); // Wait for zoom animation
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper overflow-hidden"
      initial={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 1}}}
    >
      {/* Background Texture Overlay (Stronger for landing) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />

      <div className="relative z-10 w-full max-w-5xl aspect-video flex items-center justify-center">
        {/* Woodcut Logo with Ink Bleed Reveal */}
        <motion.div
            initial={{opacity: 0, filter: 'blur(10px) contrast(200%)'}}
            animate={{opacity: 1, filter: 'blur(0px) contrast(100%)'}}
            transition={{duration: 3, ease: 'easeInOut'}}
            onAnimationComplete={handleLogoComplete}
            className="relative z-20 w-3/4 max-w-2xl"
        >
            <img 
                src="/assets/woodcut/logo.png" 
                alt="Overgrowth Logo" 
                className="w-full h-auto mix-blend-multiply opacity-90"
            />
        </motion.div>
        
        {/* Woodcut Vines Border */}
        {step !== 'drawing' && (
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 2, ease: 'easeOut'}}
                onAnimationComplete={handleVinesComplete}
                className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
            >
                <img 
                    src="/assets/woodcut/vines.png" 
                    alt="Vines" 
                    className="w-full h-full object-contain mix-blend-multiply opacity-60 scale-110"
                />
            </motion.div>
        )}

        {/* Click to Enter Overlay */}
        {step === 'ready' && (
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{delay: 0.5, duration: 1}}
                className="absolute inset-0 flex items-center justify-center z-30"
            >
                <button
                    onClick={handleEnter}
                    className="bg-moss text-paper font-serif text-xl tracking-widest uppercase px-8 py-3 mt-48 border-2 border-ink rounded-xl shadow-[4px_4px_0px_0px_rgba(28,28,28,1)] hover:translate-y-1 hover:shadow-none transition-all duration-200 boiling-border"
                >
                    Enter the Overgrowth
                </button>
            </motion.div>
        )}
      </div>

      {/* Zoom Transition Overlay */}
      {step === 'zooming' && (
        <motion.div
            className="absolute inset-0 bg-void z-50"
            initial={{scale: 0, opacity: 0, borderRadius: '100%'}}
            animate={{scale: 3, opacity: 1}}
            transition={{duration: 1, ease: 'easeInOut'}}
        />
      )}
    </motion.div>
  );
}
