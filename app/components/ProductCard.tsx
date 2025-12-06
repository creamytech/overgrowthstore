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

  // Grid Layout (Field Journal Style - Artifact Mode)
  return (
    <div className={clsx('group relative perspective-1000', className)}>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        {/* Artifact Frame Container with Lift Effect */}
        <div className="relative bg-[#f4f1ea] border-2 border-transparent transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-5px_rgba(74,93,35,0.15)]">
          
          {/* Frame Borders */}
          <div className="absolute inset-0 border border-dark-green/10 z-20 pointer-events-none group-hover:border-rust/30 transition-colors duration-500" />
          
          {/* Paper Texture Overlay */}
          <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-30 bg-[url('/assets/texture_archive_paper.jpg')]" 
          />

          {/* Product Image Area - With 'Photo Frame' Padding */}
          <div className="relative p-3 pb-8 bg-white/50">
            <div className="relative aspect-[4/5] overflow-hidden border border-dark-green/5">
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
                        className={`absolute inset-0 object-contain w-full h-full transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isSoldOut ? 'grayscale opacity-70' : ''}`}
                        sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                        width={800}
                        aspectRatio="4/5"
                        data={product.images.nodes[1]}
                        alt={product.images.nodes[1].altText || `Picture of ${product.title}`}
                        loading={loading}
                    />
                )}
            </div>
            
            {/* Artifact Sticker/Label */}
            <div className="absolute bottom-2 right-2 z-20">
                <div className="bg-[#f4f1ea] border border-dark-green/20 px-2 py-0.5 shadow-sm transform rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300">
                     <span className="font-mono text-[8px] text-dark-green/60 tracking-widest uppercase">
                        Fig. {index ? index + 1 : '01'}
                     </span>
                </div>
            </div>
          </div>

          {/* Bottom Info Section - Field Card Style Refined */}
          <div className="px-4 py-4 border-t border-dashed border-dark-green/20 relative z-20">
               <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 justify-between">
                         <h3 className="font-heading text-lg text-dark-green leading-none group-hover:text-rust transition-colors duration-300 uppercase truncate">
                            {product.title}
                        </h3>
                        {/* Edition/Series Number - Right Aligned */}
                        <span className="font-mono text-xs text-rust/80 tracking-widest shrink-0">
                            NO. {String(index ? index + 1 : 1).padStart(3, '0')}
                        </span>
                    </div>

                    {/* Metadata Row - Framed & Separated */}
                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-dark-green/70 font-mono mt-2 pt-2 border-t border-dark-green/5">
                        <span className="uppercase tracking-wider text-dark-green/60">
                            Apparel Artifact
                        </span>
                        <span className="w-1 h-1 rounded-full bg-rust/40" />
                        <span className="uppercase tracking-wider text-dark-green/60">
                            {product.publishedAt ? new Date(product.publishedAt).getFullYear() : '2025'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-rust/40" />
                        <span className="font-bold text-dark-green">
                           {/* Value Display */}
                            <Money withoutTrailingZeros data={price!} />
                        </span>
                         <span className="w-1 h-1 rounded-full bg-rust/40" />
                         <span className="text-dark-green/40">
                             {index ? 142 + index : 142}/500
                         </span>
                    </div>
                </div>
          </div>

          {/* Badges (Overlaid on Top Left) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-30 pointer-events-none">
             {cardLabel && (
                <div className="bg-rust text-[#f4f1ea] px-2 py-0.5 text-[9px] tracking-widest uppercase font-bold shadow-sm">
                    {cardLabel}
                </div>
             )}
             {isSoldOut && (
                 <div className="bg-[#f4f1ea] border border-dark-green text-dark-green px-2 py-0.5 text-[9px] tracking-widest uppercase font-bold">
                     DEPLETED
                 </div>
             )}
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
