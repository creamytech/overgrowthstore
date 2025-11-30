import clsx from 'clsx';
import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';

import type {ProductCardFragment} from 'storefrontapi.generated';
import {Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {isDiscounted, isNewArrival} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';



export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
  layout = 'grid',
  index,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
  layout?: 'grid' | 'drawer';
  index?: number;
}) {
  let cardLabel;

  const cardProduct: Product = product?.variants
    ? (product as Product)
    : getProductPlaceholder();
  if (!cardProduct?.variants?.nodes?.length) return null;

  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const isSoldOut = !firstVariant.availableForSale;

  // Drawer Layout (Polaroid Style)
  if (layout === 'drawer') {
    return (
        <div className={clsx('flex flex-col gap-2 group relative', className)}>
          <Link
            onClick={onClick}
            to={`/products/${product.handle}`}
            prefetch="viewport"
            className="flex flex-row gap-4 items-center border-b border-[#fcfbf4]/30 border-dotted pb-4"
          >
            {/* Drawer Image - Polaroid Style */}
            <div className="relative w-20 h-24 flex-shrink-0 rotate-2 transition-transform duration-100 steps(2) group-hover:rotate-0 group-hover:scale-105">
                <div className="absolute inset-0 bg-white shadow-md p-1.5 pb-4 transform transition-transform duration-100 steps(2)">
                    {image && (
                    <Image
                        className={`object-cover w-full h-full border border-gray-100 ${isSoldOut ? 'grayscale opacity-50' : 'grayscale-[0.2]'}`}
                        sizes="80px"
                        aspectRatio="1/1"
                        data={image}
                        alt={image.altText || `Picture of ${product.title}`}
                        loading={loading}
                    />
                    )}
                </div>
                 {/* Sold Out Overlay */}
                {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <span className="text-[#c05a34] font-body text-[10px] font-bold tracking-widest uppercase bg-white/90 px-1">SOLD</span>
                    </div>
                )}
            </div>

            {/* Drawer Content - Typewriter, White */}
            <div className="flex-grow text-left">
                <h3 className="font-body text-sm text-dark-green uppercase tracking-wide group-hover:text-rust transition-colors duration-100 steps(2)">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <Text className="font-body text-xs text-dark-green font-bold">
                        <Money withoutTrailingZeros data={price!} />
                    </Text>
                     {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                        <CompareAtPrice
                        className={'opacity-50 line-through text-dark-green text-xs'}
                        data={compareAtPrice as MoneyV2}
                        />
                    )}
                </div>
            </div>
          </Link>
        </div>
    );
  }

  // Grid Layout (Specimen Tag Style)
  return (
    <div className={clsx('group relative perspective-1000', className)}>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block transform transition-transform duration-100 steps(2) group-hover:rotate-y-2 group-hover:rotate-x-2"
      >
        {/* Specimen Tag Container */}
        <div className="relative aspect-[4/5] bg-[#f0eee6] overflow-hidden border-2 border-dark-green/10 p-4 shadow-sm transition-all duration-100 steps(2) group-hover:shadow-xl group-hover:border-dark-green/40 flex flex-col">
          
          {/* Paper Texture Overlay */}
          <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-40"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '200px'
              }}
          />

          {/* Top Label Bar */}
          <div className="flex justify-between items-start mb-2 relative z-20 flex-shrink-0">
             <div className="border border-dark-green/30 px-2 py-0.5 bg-[#f4f1ea]">
                <span className="font-body text-[10px] tracking-widest text-dark-green uppercase">
                    FIG. {(index || 0) + 1}
                </span>
            </div>
            {cardLabel && (
              <div className="border border-rust px-2 py-0.5 bg-rust/10">
                 <span className="font-body text-[10px] tracking-widest text-rust uppercase">
                    {cardLabel}
                 </span>
              </div>
            )}
          </div>

          {/* Product Image Area */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center z-0 my-2 border border-dark-green/5 bg-white/40 p-2">
            {image && (
              <Image
                className={`object-contain w-full h-full transition-all duration-100 steps(2) mix-blend-multiply filter contrast-110 sepia-[0.1] ${isSoldOut ? 'grayscale opacity-70' : 'group-hover:scale-110'}`}
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            
            {/* Handwritten Note (Appears on Hover) */}
            <div className="absolute -bottom-2 -right-2 transform rotate-[-5deg] opacity-0 group-hover:opacity-100 transition-all duration-100 steps(2) z-30 pointer-events-none">
                <span className="font-handwritten text-xl text-rust">
                    {isSoldOut ? 'Depleted' : 'Specimen A'}
                </span>
            </div>
          </div>

          {/* Bottom Info Area */}
          <div className="relative z-20 mt-2 border-t border-dark-green/10 pt-2 flex-shrink-0">
             <h3 className="font-heading text-lg text-dark-green leading-tight group-hover:text-rust transition-colors duration-100 steps(2) truncate">
                {product.title}
             </h3>
             <div className="flex justify-between items-end mt-2">
                <Text className="font-body text-xs text-dark-green/70 tracking-widest">
                  REF: {product.id.substring(product.id.length - 6)}
                </Text>
                <Text className="font-body text-sm text-dark-green font-bold tracking-widest">
                  <Money withoutTrailingZeros data={price!} />
                  {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                    <CompareAtPrice
                      className={'opacity-50 line-through ml-2 text-xs'}
                      data={compareAtPrice as MoneyV2}
                    />
                  )}
                </Text>
             </div>
          </div>

          {/* Sold Out Stamp */}
          {isSoldOut && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                  <div className="border-4 border-rust text-rust px-6 py-2 font-heading text-xl tracking-widest uppercase rotate-[-15deg] opacity-80 mix-blend-multiply mask-grunge">
                      SOLD OUT
                  </div>
              </div>
          )}

        </div>
      </Link>
    </div>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  const styles = clsx('strike', className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
