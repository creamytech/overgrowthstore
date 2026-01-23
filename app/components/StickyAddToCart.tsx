'use client';

import {Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Image} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';

interface StickyAddToCartProps {
  selectedVariant: {
    id: string;
    availableForSale: boolean;
    price: {
      amount: string;
      currencyCode: CurrencyCode;
    };
    title?: string;
    image?: {
      url: string;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  } | null;
  productTitle: string;
  show: boolean;
  onSelectSize?: () => void;
  hasSelectedSize?: boolean;
}


export function StickyAddToCart({
  selectedVariant,
  productTitle,
  show,
  onSelectSize,
  hasSelectedSize = true,
}: StickyAddToCartProps) {
  if (!selectedVariant || !show) return null;

  const isOutOfStock = !selectedVariant.availableForSale;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-[9998] bg-[#F2EFE9] border-t border-[#1a472a]/10 shadow-lg lg:hidden"
          style={{
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
          }}
        >
          <div className="flex items-center gap-4 px-4 py-3 max-w-2xl mx-auto">
            {/* Product Thumbnail */}
            {selectedVariant.image && (
              <div className="w-14 h-14 bg-[#0a0a0a] flex-shrink-0 overflow-hidden">
                <Image
                  data={selectedVariant.image}
                  sizes="56px"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Product Info */}
              <div 
                className="flex-1 min-w-0 flex flex-col cursor-pointer"
                onClick={onSelectSize}
              >
                <h3 className="font-heading text-sm text-[#1a472a] uppercase tracking-wide truncate">
                  {productTitle}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[10px] text-[#B55A3C] uppercase tracking-wider">
                    {selectedVariant.title !== 'Default Title' ? selectedVariant.title : ''}
                  </span>
                  <span className="font-mono text-[10px] text-[#1a472a]/40">|</span>
                  <span className="font-mono text-[10px] text-[#1a472a]/70">
                    <Money withoutTrailingZeros data={selectedVariant.price} />
                  </span>
                </div>
              </div>

            {/* CTA Button */}
            <div className="flex-shrink-0">
              {isOutOfStock ? (
                <button
                  disabled
                  className="px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] bg-[#8A8A84]/20 text-[#8A8A84] cursor-not-allowed"
                >
                  Sold Out
                </button>
              ) : !hasSelectedSize ? (
                <button
                  onClick={onSelectSize}
                  className="px-6 py-3 font-mono text-[10px] uppercase tracking-[0.15em] bg-[#1a472a] text-[#F2EFE9] hover:bg-[#0a0a0a] transition-colors"
                >
                  Select a Size
                </button>
              ) : (
                <AddToCartButton
                  lines={[{merchandiseId: selectedVariant.id, quantity: 1}]}
                  variant="primary"
                  asChild
                >
                  <div className="px-6 py-3 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] transition-colors font-mono text-[10px] uppercase tracking-[0.15em] text-center">
                    Recover Artifact
                  </div>
                </AddToCartButton>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
