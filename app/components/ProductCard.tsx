import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import type {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {Link} from '~/components/Link';
import {isDiscounted, isNewArrival, cn} from '~/lib/utils';
import {getProductPlaceholder} from '~/lib/placeholders';
import {Card, CardContent} from '~/components/ui/card';
import {Badge} from '~/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
  index,
}: {
  product: ProductCardFragment;
  label?: string;
  className?: string;
  loading?: HTMLImageElement['loading'];
  onClick?: () => void;
  quickAdd?: boolean;
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
  const hasDiscount = isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2);

  // Item number for archival feel
  const itemNum = index !== undefined ? (index + 1).toString().padStart(3, '0') : null;

  return (
    <Card 
      className={cn(
        'group relative overflow-hidden',
        'bg-[#F2EFE9] border-[#1a472a]/10',
        'hover:border-[#1a472a]/20',
        'transition-all duration-300',
        'hover-lift',
        className
      )}
    >
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="viewport"
        className="block"
      >
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F2EFE9]">
          {image && (
            <Image
              className={cn(
                'object-cover w-full h-full',
                'transition-all duration-700 ease-out',
                'group-hover:scale-[1.02]',
                isSoldOut && 'grayscale opacity-50'
              )}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
          )}
          
          {/* Hover second image */}
          {product.images?.nodes[1] && (
            <Image
              className="absolute inset-0 object-cover w-full h-full transition-opacity duration-700 opacity-0 group-hover:opacity-100"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              data={product.images.nodes[1]}
              alt={product.images.nodes[1].altText || `Picture of ${product.title}`}
              loading="lazy"
            />
          )}

          {/* Item number - top left */}
          {itemNum && (
            <div className="absolute top-3 left-3 z-10">
              <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.2em]">
                №{itemNum}
              </span>
            </div>
          )}

          {/* Badges - top right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            {cardLabel && (
              <Badge 
                className={cn(
                  "text-[9px] tracking-[0.15em] uppercase",
                  cardLabel === 'Sale' ? "bg-[#B55A3C] text-[#F2EFE9]" : "bg-[#1a472a] text-[#F2EFE9]"
                )}
              >
                {cardLabel}
              </Badge>
            )}
            {isSoldOut && (
              <Badge 
                variant="outline"
                className="text-[9px] tracking-[0.15em] border-[#1a472a]/30 text-[#8A8A84] bg-[#F2EFE9]/90"
              >
                Sold Out
              </Badge>
            )}
          </div>

          {/* Scarcity indicator with Tooltip */}
          {!isSoldOut && firstVariant.quantityAvailable && firstVariant.quantityAvailable <= 3 && (
            <div className="absolute bottom-3 left-3 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono text-[9px] text-[#3E5F4B] tracking-[0.15em] uppercase animate-scarcity cursor-help">
                      {firstVariant.quantityAvailable} left
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a472a] text-[#F2EFE9] border-none">
                    <p className="font-mono text-[10px]">Limited availability — act fast</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 bg-[#F2EFE9]">
          {/* Product Title */}
          <h3 className="font-heading text-sm text-[#1a472a] uppercase tracking-[0.1em] line-clamp-1 group-hover:text-[#B55A3C] transition-colors duration-300">
            {product.title}
          </h3>
          
          {/* Price Row */}
          <div className="flex items-center gap-3 mt-3">
            <span className={cn(
              "font-mono text-xs tracking-wide",
              hasDiscount ? "text-[#B55A3C]" : "text-[#1a472a]"
            )}>
              <Money withoutTrailingZeros data={price!} />
            </span>
            {hasDiscount && (
              <CompareAtPrice
                className="text-[#8A8A84] text-[10px] line-through"
                data={compareAtPrice as MoneyV2}
              />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function CompareAtPrice({
  data,
  className,
}: {
  data: MoneyV2;
  className?: string;
}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} = useMoney(data);

  return (
    <span className={cn('line-through', className)}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
