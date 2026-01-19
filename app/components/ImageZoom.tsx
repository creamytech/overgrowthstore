import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {Button} from '~/components/ui/button';
import {ZoomIn, ZoomOut, X} from 'lucide-react';

interface ImageZoomProps {
  image: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomDialog({image, isOpen, onClose}: ImageZoomProps) {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));
  const handleReset = () => setScale(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full bg-[#0a0a0a] border-[#F2EFE9]/10 p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Product Image Zoom</DialogTitle>
        </DialogHeader>
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="bg-[#0a0a0a]/80 border-[#F2EFE9]/20 hover:bg-[#0a0a0a] hover:border-[#B55A3C]"
          >
            <ZoomOut className="w-4 h-4 text-[#F2EFE9]" />
          </Button>
          <span className="font-mono text-xs text-[#F2EFE9]/50 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="bg-[#0a0a0a]/80 border-[#F2EFE9]/20 hover:bg-[#0a0a0a] hover:border-[#B55A3C]"
          >
            <ZoomIn className="w-4 h-4 text-[#F2EFE9]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="bg-[#0a0a0a]/80 border-[#F2EFE9]/20 hover:bg-[#0a0a0a] hover:border-[#B55A3C] ml-2"
          >
            <X className="w-4 h-4 text-[#F2EFE9]" />
          </Button>
        </div>

        {/* Image Container */}
        <div 
          className="w-full h-full flex items-center justify-center overflow-auto p-8 cursor-move"
          onClick={handleReset}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-out',
            }}
          >
            <img
              src={image.url}
              alt={image.altText || 'Product image'}
              className="max-w-full max-h-[calc(95vh-4rem)] object-contain"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="font-mono text-[10px] text-[#F2EFE9]/30 uppercase tracking-wider">
            Click to reset • Use controls to zoom
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Zoomable image wrapper for product pages
export function ZoomableImage({
  image,
  sizes,
  className,
}: {
  image: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  };
  sizes?: string;
  className?: string;
}) {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsZoomOpen(true)}
        className={`relative group cursor-zoom-in ${className}`}
      >
        <Image
          data={image}
          sizes={sizes}
          className="w-full h-full object-contain"
        />
        {/* Zoom Hint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-3">
            <ZoomIn className="w-5 h-5 text-[#F2EFE9]" />
          </div>
        </div>
      </button>

      <ImageZoomDialog
        image={image}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </>
  );
}
