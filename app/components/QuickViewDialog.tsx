import {useState} from 'react';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {Button} from '~/components/ui/button';
import {Badge} from '~/components/ui/badge';
import {AddToCartButton} from '~/components/AddToCartButton';
import {X, ShoppingBag, ExternalLink} from 'lucide-react';

interface QuickViewProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      availableForSale: boolean;
      price: {
        amount: string;
        currencyCode: string;
      };
    }>;
  };
}

interface QuickViewDialogProps {
  product: QuickViewProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewDialog({
  product,
  isOpen,
  onClose,
}: QuickViewDialogProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!product) return null;

  const variants = product.variants?.nodes || [];
  const selectedVariant = variants[selectedVariantIndex] || variants[0];
  const isAvailable = selectedVariant?.availableForSale;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-[#F2EFE9] border-[#1a472a]/20 p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Quick View: {product.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2 aspect-square bg-[#0a0a0a] relative">
            {product.featuredImage ? (
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-mono text-xs text-[#F2EFE9]/30">
                  No image
                </span>
              </div>
            )}

            {/* Status Badge */}
            {!isAvailable && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#8A8A84] text-[#F2EFE9] font-mono text-[9px] uppercase">
                  Archived
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 hover:bg-[#0a0a0a]/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-[#1a472a]" />
            </button>

            {/* Header */}
            <div className="mb-4">
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.3em] uppercase block mb-2">
                Quick View
              </span>
              <h2 className="font-heading text-2xl text-[#1a472a] uppercase tracking-wide">
                {product.title}
              </h2>
            </div>

            {/* Price */}
            <div className="mb-4">
              <span className="font-heading text-2xl text-[#1a472a]">
                ${parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount).toFixed(0)}
              </span>
            </div>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mb-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] block mb-2">
                  Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariantIndex(index)}
                      disabled={!variant.availableForSale}
                      className={`min-w-[3rem] px-3 py-2 font-mono text-xs uppercase tracking-wide border transition-all text-center ${
                        selectedVariantIndex === index
                          ? 'border-[#B55A3C] bg-[#B55A3C] text-[#F2EFE9]'
                          : variant.availableForSale
                          ? 'border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C]'
                          : 'border-[#8A8A84]/20 text-[#8A8A84]/50 line-through cursor-not-allowed'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="mt-auto space-y-3">
              {isAvailable ? (
                <AddToCartButton
                  lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
                  variant="primary"
                  className="w-full"
                  onClick={onClose}
                >
                  <div className="w-full flex items-center justify-center gap-2 py-3 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] transition-colors font-mono text-xs uppercase tracking-[0.2em]">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </div>
                </AddToCartButton>
              ) : (
                <Button
                  disabled
                  className="w-full py-3 font-mono text-xs uppercase tracking-[0.2em]"
                  variant="outline"
                >
                  Sold Out
                </Button>
              )}

              <Link
                to={`/products/${product.handle}`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 border border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C] transition-colors font-mono text-xs uppercase tracking-[0.2em]"
              >
                <ExternalLink className="w-4 h-4" />
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
