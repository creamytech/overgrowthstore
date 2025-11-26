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

  if (layout === 'drawer') {
    return (
        <div className={clsx('flex flex-col gap-2 group relative', className)}>
          <Link
            onClick={onClick}
            to={`/products/${product.handle}`}
            prefetch="viewport"
            className="flex flex-row gap-4 items-center border-b border-[#fcfbf4]/30 border-dotted pb-4"
          >
            {/* Drawer Image - Small, Rounded, Grayscale */}
            <div className="relative w-16 h-16 flex-shrink-0">
                {image && (
                <Image
                    className={`object-cover w-full h-full rounded-[4px] border border-[#fcfbf4]/20 transition-all duration-300 ${isSoldOut ? 'grayscale opacity-50' : 'grayscale-[0.3] group-hover:grayscale-0'}`}
                    sizes="64px"
                    aspectRatio="1/1"
                    data={image}
                    alt={image.altText || `Picture of ${product.title}`}
                    loading={loading}
                />
                )}
                 {/* Sold Out Overlay - Simplified for Drawer */}
                {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/50 rounded-[4px]">
                        <span className="text-[#c05a34] font-body text-[10px] font-bold tracking-widest uppercase">SOLD</span>
                    </div>
                )}
            </div>

            {/* Drawer Content - Typewriter, White */}
            <div className="flex-grow text-left">
                <h3 className="font-body text-sm text-[#fcfbf4] uppercase tracking-wide group-hover:text-white transition-colors">
                    {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                    <Text className="font-body text-xs text-[#fcfbf4] font-bold">
                        <Money withoutTrailingZeros data={price!} />
                    </Text>
                     {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                        <CompareAtPrice
                        className={'opacity-50 line-through text-[#fcfbf4] text-xs'}
                        data={compareAtPrice as MoneyV2}
                        />
                    )}
                </div>
            </div>
          </Link>
        </div>
    );
  }

  return (
    <div className={clsx('flex flex-col gap-2 group relative', className)}>
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        {/* Specimen Tray Container */}
        <div className="relative aspect-[4/5] bg-[#f4f1ea] overflow-hidden border border-dark-green/10 p-6 transition-all duration-300 group-hover:shadow-lg group-hover:border-dark-green/30">
          
          {/* Texture Overlay (Multiply) */}
          <div 
              className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-30"
              style={{backgroundImage: "url('/assets/texture_archive_paper.jpg')", backgroundSize: '500px'}}
          />

          {/* FIG Label */}
          {index !== undefined && (
            <div className="absolute top-4 left-4 z-20 border border-dark-green/20 px-2 py-1 bg-[#f4f1ea]">
                <span className="font-body text-[10px] tracking-widest text-dark-green uppercase">
                    FIG. {index + 1}
                </span>
            </div>
          )}

          {/* Product Image */}
          <div className="relative w-full h-full flex items-center justify-center z-0">
            {image && (
              <Image
                className={`object-contain w-full h-full transition-all duration-500 mix-blend-multiply filter contrast-110 sepia-[0.1] ${isSoldOut ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
                sizes="(min-width: 64em) 25vw, (min-width: 48em) 30vw, 45vw"
                aspectRatio="4/5"
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
          </div>

          {/* Hover Icon (Bud) */}
          <div className="absolute top-4 right-4 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
             <img src="/assets/icon_menu_bud.png" alt="Specimen" className="w-full h-full object-contain" />
          </div>

          {/* Sold Out Overlay */}
          {isSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-[#f4f1ea]/50 backdrop-blur-[1px]">
                  <div className="border-2 border-rust text-rust px-4 py-1 font-body text-sm tracking-widest uppercase rotate-[-15deg]">
                      SOLD OUT
                  </div>
              </div>
          )}

          {/* Labels */}
          {cardLabel && (
              <Text
              as="label"
              size="fine"
              className="absolute bottom-4 left-4 text-dark-green font-body text-[10px] tracking-widest uppercase border border-dark-green px-1 bg-[#f4f1ea]"
              >
              {cardLabel}
              </Text>
          )}
        </div>

        {/* Typography */}
        <div className="mt-3 text-center">
          <h3 className="font-heading text-xl text-dark-green group-hover:text-rust transition-colors">
            {product.title}
          </h3>
          <div className="flex justify-center gap-2 mt-1">
            <Text className="font-body text-sm text-rust tracking-widest">
              <Money withoutTrailingZeros data={price!} />
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <CompareAtPrice
                  className={'opacity-50 line-through ml-2'}
                  data={compareAtPrice as MoneyV2}
                />
              )}
            </Text>
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
