import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

export function SketchToggle({image}: {image: any}) {
  const [mode, setMode] = useState<'photo' | 'sketch'>('photo');

  return (
    <div className="relative w-full aspect-square border border-ink/10 bg-paper p-4">
      {/* Toggle Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setMode('photo')}
          className={`px-3 py-1 font-mono text-xs border border-ink transition-colors ${
            mode === 'photo' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-ink/10'
          }`}
        >
          PHOTO
        </button>
        <button
          onClick={() => setMode('sketch')}
          className={`px-3 py-1 font-mono text-xs border border-ink transition-colors ${
            mode === 'sketch' ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-ink/10'
          }`}
        >
          SKETCH
        </button>
      </div>

      {/* Image Display */}
      <div className="relative w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}
                className="w-full h-full"
            >
                {image && (
                    <Image
                        data={image}
                        aspectRatio="1/1"
                        className={`w-full h-full object-contain transition-all duration-500 ${
                            mode === 'sketch' 
                            ? 'grayscale contrast-150 sepia brightness-110 mix-blend-multiply' 
                            : ''
                        }`}
                        sizes="(min-width: 45em) 50vw, 100vw"
                    />
                )}
            </motion.div>
        </AnimatePresence>
        
        {/* Sketch Overlay Texture */}
        {mode === 'sketch' && (
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50 bg-[url('https://www.transparenttextures.com/patterns/sketch-lines.png')]" />
        )}
      </div>
      
      {/* Corner Marks */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ink" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ink" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ink" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ink" />
    </div>
  );
}
