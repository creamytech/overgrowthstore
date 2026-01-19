import {Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {Button} from '~/components/ui/button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {ShoppingBag} from 'lucide-react';

interface StickyAddToCartProps {
  selectedVariant: {
    id: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: CurrencyCode;
    };
    title?: string;
  } | null;
  productTitle: string;
  show: boolean;
}

export function StickyAddToCart({
  selectedVariant,
  productTitle,
  show,
}: StickyAddToCartProps) {
  if (!selectedVariant || !show) return null;

  const isOutOfStock = !selectedVariant.availableForSale;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9998] bg-[#0a0a0a] border-t border-[#F2EFE9]/10 p-4 transform transition-transform duration-300 lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
      }}
    >
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-sm text-[#F2EFE9] uppercase tracking-wide truncate">
            {productTitle}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-xs text-[#B55A3C]">
              <Money withoutTrailingZeros data={selectedVariant.price} />
            </span>
            {selectedVariant.title && selectedVariant.title !== 'Default Title' && (
              <span className="font-mono text-[10px] text-[#F2EFE9]/50 uppercase">
                {selectedVariant.title}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex-shrink-0">
          {isOutOfStock ? (
            <Button
              disabled
              variant="outline"
              className="px-6 py-2 font-mono text-xs uppercase tracking-wider border-[#F2EFE9]/20 text-[#F2EFE9]/50"
            >
              Sold Out
            </Button>
          ) : (
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
              variant="primary"
            >
              <div className="flex items-center gap-2 px-6 py-2.5 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] transition-colors font-mono text-xs uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </div>
            </AddToCartButton>
          )}
        </div>
      </div>
    </div>
  );
}
