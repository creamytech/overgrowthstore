import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {useState, useEffect} from 'react';
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

  // Drop Date Logic
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    const checkLive = () => {
      const dropDate = new Date('2026-01-23T13:00:00-05:00');
      setIsLive(new Date() >= dropDate);
    };
    
    checkLive();
    // Check every second to unlock in real-time
    const interval = setInterval(checkLive, 1000);
    return () => clearInterval(interval);
  }, []);

  if (label) {
    cardLabel = label;
  } else if (!isLive) {
    cardLabel = 'Locked';
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
                isSoldOut && 'grayscale opacity-50',
                !isLive && 'grayscale-[0.5]' // Partial grayscale for locked items
              )}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
          )}
          
          {/* Hover second image - only if live */}
          {product.images?.nodes[1] && isLive && (
            <Image
              className="absolute inset-0 object-cover w-full h-full transition-opacity duration-700 opacity-0 group-hover:opacity-100"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              data={product.images.nodes[1]}
              alt={product.images.nodes[1].altText || `Picture of ${product.title}`}
              loading="lazy"
            />
          )}
          
          {/* Locked Overlay */}
          {!isLive && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
                <div className="w-12 h-12 rounded-full border border-[#F2EFE9]/40 flex items-center justify-center backdrop-blur-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F2EFE9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                     <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                   </svg>
                </div>
             </div>
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
                  cardLabel === 'Sale' ? "bg-[#B55A3C] text-[#F2EFE9]" : 
                  cardLabel === 'Locked' ? "bg-[#0a0a0a] text-[#F2EFE9] border border-[#F2EFE9]/20" :
                  "bg-[#1a472a] text-[#F2EFE9]"
                )}
              >
                {cardLabel}
              </Badge>
            )}
            {isSoldOut && isLive && (
              <Badge 
                variant="outline"
                className="text-[9px] tracking-[0.15em] border-[#1a472a]/30 text-[#8A8A84] bg-[#F2EFE9]/90"
              >
                Sold Out
              </Badge>
            )}
          </div>

          {/* Scarcity indicator with Tooltip - only if live */}
          {isLive && !isSoldOut && firstVariant.quantityAvailable && firstVariant.quantityAvailable <= 3 && (
            <div className="absolute bottom-3 left-3 z-10">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="font-mono text-[9px] text-[#3E5F4B] tracking-[0.15em] uppercase animate-scarcity cursor-help">
                      {firstVariant.quantityAvailable} left
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a472a] text-[#F2EFE9] border-none">
                    <p className="font-mono text-[10px]">Limited availability | act fast</p>
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
