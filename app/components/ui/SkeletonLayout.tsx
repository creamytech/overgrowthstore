import {motion, AnimatePresence} from 'framer-motion';
import {useNavigation} from '@remix-run/react';

export function SkeletonLayout({children}: {children: React.ReactNode}) {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="relative min-h-screen bg-void text-bone font-sans selection:bg-moss selection:text-bone">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
            className="fixed inset-0 z-40 flex items-center justify-center bg-void"
          >
            <div className="w-full max-w-4xl h-3/4 border border-primary/20 rounded-lg relative overflow-hidden">
              {/* Ribcage / Wireframe Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-decay font-serif text-2xl animate-pulse">Loading Structure...</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5}}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
