import {useState, useRef, useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

interface ImageData {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
  id?: string;
}

interface ImageZoomModalProps {
  image: any;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({image, isOpen, onClose}: ImageZoomModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({x: 0, y: 0});

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({x: 0, y: 0});
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    setPosition({x: 0, y: 0});
  };

  // Mouse drag for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      lastPosition.current = {x: e.clientX - position.x, y: e.clientY - position.y};
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - lastPosition.current.x,
        y: e.clientY - lastPosition.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      lastPosition.current = {
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && scale > 1 && e.touches.length === 1) {
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - lastPosition.current.x,
        y: e.touches[0].clientY - lastPosition.current.y,
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Double tap/click to zoom
  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      handleReset();
    }
  };

  if (!isOpen || !image) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close zoom"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
          disabled={scale <= 1}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Zoom out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <span className="text-white/70 text-sm font-mono min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
          disabled={scale >= 4}
          className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Zoom in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="w-px h-6 bg-white/20 mx-1" />
        <button
          onClick={(e) => { e.stopPropagation(); handleReset(); }}
          className="px-3 py-1 text-white/70 hover:text-white text-sm transition-colors"
          aria-label="Reset zoom"
        >
          Reset
        </button>
      </div>

      {/* Hint */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm">
        {scale === 1 ? 'Double-tap to zoom' : 'Drag to pan'}
      </div>

      {/* Image Container */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          className="max-w-[90vw] max-h-[90vh]"
        >
          <Image
            data={image}
            sizes="100vw"
            className="max-w-full max-h-[90vh] object-contain select-none"
          />
        </div>
      </div>
    </div>
  );
}
