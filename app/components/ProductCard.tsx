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
                        className={`object-cover w-full h-full border border-gray-100 ${isSoldOut ? 'grayscale opacity-50' : ''}`}
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

  // Grid Layout (Tactical HUD Style)
  return (
    <div className={clsx('group relative perspective-1000', className)}>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        {/* Card Container */}
        <div className="relative aspect-[4/5] bg-[#f4f1ea] overflow-hidden border border-rust/20 transition-all duration-300 group-hover:border-rust/60 group-hover:shadow-lg">
          
          {/* Paper Texture Overlay */}
          <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-20 bg-[url('/assets/texture_archive_paper.jpg')]" 
          />

          {/* Product Image Area */}
          <div className="relative w-full h-full p-4 flex items-center justify-center z-0">
            {/* Primary Image */}
            {image && (
              <Image
                className={`object-contain w-full h-full transition-opacity duration-500 ${isSoldOut ? 'grayscale opacity-70' : ''} ${product.images?.nodes[1] ? 'group-hover:opacity-0' : ''}`}
                sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                width={800}
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            
            {/* Secondary Image (Hover) */}
            {product.images?.nodes[1] && (
                <Image
                    className={`absolute inset-0 object-contain w-full h-full p-4 transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isSoldOut ? 'grayscale opacity-70' : ''}`}
                    sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                    width={800}
                    aspectRatio="4/5"
                    data={product.images.nodes[1]}
                    alt={product.images.nodes[1].altText || `Picture of ${product.title}`}
                    loading={loading}
                />
            )}
          </div>

          {/* HUD Overlay (Appears on Hover) */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Scan Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-rust/50 shadow-[0_0_10px_rgba(192,90,52,0.5)] animate-[scan_2s_linear_infinite]" />
                
                {/* Corner Brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-rust" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-rust" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-rust" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-rust" />

                {/* Data Readout */}
                <div className="absolute bottom-4 left-0 w-full text-center">
                    <div className="inline-block bg-rust/10 backdrop-blur-sm border border-rust/30 px-3 py-1">
                        <span className="font-mono text-xs text-rust tracking-widest uppercase animate-pulse">
                            {isSoldOut ? 'SIGNAL LOST' : 'RECOVERED WORK DETECTED'}
                        </span>
                    </div>
                </div>
          </div>

          {/* Badges (Static Info) */}
          <div className="absolute top-0 left-0 w-full p-3 flex flex-col gap-2 items-start z-20">
             {cardLabel && (
                <div className="bg-rust text-[#f4f1ea] px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold">
                    {cardLabel}
                </div>
             )}
             {/* Custom Badges based on Tags */}
             {product.tags?.includes('Limited') && (
                 <div className="bg-dark-green text-[#f4f1ea] px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold border border-[#f4f1ea]/20">
                     LIMITED RUN
                 </div>
             )}
             {product.tags?.includes('Field Issue') && (
                 <div className="bg-[#f4f1ea] text-dark-green px-2 py-0.5 text-[10px] tracking-widest uppercase font-bold border border-dark-green">
                     FIELD ISSUE
                 </div>
             )}
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/5 pointer-events-none">
                  <div className="border-2 border-rust text-rust px-4 py-2 font-heading text-xl tracking-widest uppercase rotate-[-12deg] bg-[#f4f1ea]/80 backdrop-blur-sm">
                      DEPLETED
                  </div>
              </div>
          )}

        </div>

        {/* Bottom Info */}
        <div className="mt-4 px-1 text-center">
             <h3 className="font-heading text-xl md:text-2xl text-dark-green leading-tight group-hover:text-rust transition-colors duration-300 uppercase mb-2">
                {product.title}
             </h3>
             
             <div className="flex flex-col items-center gap-1">
                <Text className="font-body text-base md:text-lg text-dark-green font-bold tracking-widest">
                  <Money withoutTrailingZeros data={price!} />
                  {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                    <CompareAtPrice
                      className={'opacity-50 line-through ml-2 text-sm'}
                      data={compareAtPrice as MoneyV2}
                    />
                  )}
                </Text>
                <span className="font-mono text-[10px] text-dark-green/50 tracking-widest">
                    ID: {product.id.substring(product.id.length - 4)}
                </span>
             </div>
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
