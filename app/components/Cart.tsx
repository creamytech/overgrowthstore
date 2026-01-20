import clsx from 'clsx';
import {useRef} from 'react';
import useScroll from 'react-use/esm/useScroll';
import {
  flattenConnection,
  CartForm,
  Image,
  Money,
  useOptimisticData,
  OptimisticInput,
  type CartReturn,
} from '@shopify/hydrogen';
import type {
  Cart as CartType,
  CartCost,
  CartLine,
  CartLineUpdateInput,
} from '@shopify/hydrogen/storefront-api-types';

import {Link} from '~/components/Link';
import {IconRemove} from '~/components/Icon';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {ScrollArea} from '~/components/ui/scroll-area';

type Layouts = 'page' | 'drawer';

export function Cart({
  layout,
  onClose,
  cart,
}: {
  layout: Layouts;
  onClose?: () => void;
  cart: CartReturn | null;
}) {
  const linesCount = cart?.lines?.edges?.length || 0;
  const hasItems = linesCount > 0;

  return (
    <>
      {!hasItems && <CartEmpty onClose={onClose} layout={layout} />}
      {hasItems && <CartDetails cart={cart} layout={layout} />}
    </>
  );
}

export function CartDetails({
  layout,
  cart,
}: {
  layout: Layouts;
  cart: CartType | null;
}) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const container = {
    drawer: 'grid grid-cols-1 h-full grid-rows-[1fr_auto]', 
    page: 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-12',
  };

  return (
    <div className={container[layout]}>
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartType['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <>
      <dl className={codes && codes.length !== 0 ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-mono text-xs text-[#8A8A84]">
          <dt>Discount</dt>
          <div className="flex items-center gap-2">
            <UpdateDiscountForm>
              <button className="text-[#B55A3C] hover:text-[#1a472a]">
                <IconRemove aria-hidden="true" style={{height: 14}} />
              </button>
            </UpdateDiscountForm>
            <dd className="text-[#B55A3C]">{codes?.join(', ')}</dd>
          </div>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 bg-white border border-[#1a472a]/20 px-4 py-3 font-mono text-xs text-[#1a472a] placeholder:text-[#8A8A84] focus:outline-none focus:border-[#B55A3C] uppercase tracking-wide"
            type="text"
            name="discountCode"
            placeholder="Discount code"
          />
          <Button 
            type="submit" 
            className="px-6 font-mono text-[10px] uppercase tracking-[0.2em] bg-[#F2EFE9] text-[#0a0a0a] hover:bg-[#B55A3C] hover:text-[#F2EFE9] border-0"
          >
            Apply
          </Button>
        </div>
      </UpdateDiscountForm>
    </>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}


function CartLines({
  layout = 'drawer',
  lines: cartLines,
}: {
  layout: Layouts;
  lines: CartType['lines'] | undefined;
}) {
  const currentLines = cartLines ? flattenConnection(cartLines) : [];
  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);

  const className = clsx([
    y > 0 ? 'border-t border-[#F2EFE9]/10' : '',
    layout === 'page'
      ? 'flex-grow'
      : 'pb-6 overflow-auto scrollbar-hide',
  ]);

  return (
    <section
      ref={scrollRef}
      aria-labelledby="cart-contents"
      className={className}
    >
      <ul className="grid gap-6">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} layout={layout} />
        ))}
      </ul>
    </section>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col gap-4 mt-8">
      <a href={checkoutUrl} target="_self">
        <Button className="w-full py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 group">
          <span>Checkout</span>
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </a>
      
      <div className="text-center">
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 font-mono text-[10px] text-[#8A8A84] hover:text-[#B55A3C] uppercase tracking-[0.2em] transition-colors group"
        >
          <span className="w-4 h-px bg-[#8A8A84]/50 group-hover:bg-[#B55A3C] transition-colors" />
          Continue Browsing
        </Link>
      </div>
    </div>
  );
}

function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartCost;
  layout: Layouts;
}) {
  const summary = {
    drawer: 'grid gap-4 pt-6 border-t border-[#F2EFE9]/10',
    page: 'sticky top-32 grid gap-6 p-6 bg-[#F2EFE9] border border-[#1a472a]/10',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <dl className="grid gap-4">
        <div className="flex items-center justify-between">
          <dt className="font-mono text-xs uppercase tracking-[0.2em] text-[#8A8A84]">Subtotal</dt>
          <dd className="font-heading text-lg text-[#B55A3C]" data-test="subtotal">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
      
      <Separator className="bg-[#1a472a]/10 my-2" />
      
      {children}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};


function CartLineItem({line, layout = 'drawer'}: {line: CartLine; layout?: Layouts}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  // Conditional colors based on layout
  const isDrawer = layout === 'drawer';
  const borderColor = isDrawer ? 'border-[#F2EFE9]/10' : 'border-[#1a472a]/10';
  const imageBg = isDrawer ? 'bg-[#1a1a1a]' : 'bg-[#F2EFE9]';
  const imageBorder = isDrawer ? 'border-[#F2EFE9]/10' : 'border-[#1a472a]/10';
  const titleColor = isDrawer ? 'text-[#F2EFE9]' : 'text-[#1a472a]';
  const optionColor = isDrawer ? 'text-[#F2EFE9]/40' : 'text-[#8A8A84]';

  return (
    <li
      key={id}
      className={`relative group py-6 border-b ${borderColor}`}
      style={{
        display: optimisticData?.action === 'remove' ? 'none' : 'block',
      }}
    >
      <div className="flex gap-5">
        {/* Image with corner markers */}
        <div className="relative flex-shrink-0">
          <div className={`w-24 h-28 ${imageBg} border ${imageBorder} overflow-hidden`}>
            {merchandise.image && (
              <Image
                width={96}
                height={112}
                data={merchandise.image}
                className="object-cover w-full h-full"
                alt={merchandise.title}
              />
            )}
          </div>
          {/* Corner markers */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-[#B55A3C]" />
          <div className="absolute -top-1 -right-1 w-2 h-2 border-r border-t border-[#B55A3C]" />
        </div>

        <div className="flex-grow flex flex-col justify-between">
          {/* Top: Title + Options */}
          <div>
            <h3 className={`font-heading text-base ${titleColor} uppercase tracking-wide mb-1`}>
              {merchandise?.product?.handle ? (
                <Link to={`/products/${merchandise.product.handle}`} className="hover:text-[#B55A3C] transition-colors">
                  {merchandise?.product?.title || ''}
                </Link>
              ) : (
                <span>{merchandise?.product?.title || ''}</span>
              )}
            </h3>

            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {(merchandise?.selectedOptions || []).map((option) => (
                <span key={option.name} className={`font-mono text-[10px] ${optionColor} uppercase tracking-wide`}>
                  {option.name}: <span className="text-[#B55A3C]">{option.value}</span>
                </span>
              ))}
            </div>
          </div>
          
          {/* Bottom: Quantity + Price */}
          <div className="flex items-end justify-between mt-4">
            <div className="flex items-center gap-3">
              <CartLineQuantityAdjust line={line} />
              <ItemRemoveButton lineId={id} />
            </div>
            
            <div className="text-right">
              <span className="font-heading text-lg text-[#B55A3C]">
                <CartLinePrice line={line} as="span" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ItemRemoveButton({lineId}: {lineId: CartLine['id']}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{
        lineIds: [lineId],
      }}
    >
      <button
        className="text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors"
        type="submit"
      >
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" className="w-4 h-4" />
      </button>
      <OptimisticInput id={lineId} data={{action: 'remove'}} />
    </CartForm>
  );
}

function CartLineQuantityAdjust({line}: {line: CartLine}) {
  const optimisticId = line?.id;
  const optimisticData = useOptimisticData<OptimisticData>(optimisticId);

  if (!line || typeof line?.quantity === 'undefined') return null;

  const optimisticQuantity = optimisticData?.quantity || line.quantity;

  const {id: lineId} = line;
  const prevQuantity = Number(Math.max(0, optimisticQuantity - 1).toFixed(0));
  const nextQuantity = Number((optimisticQuantity + 1).toFixed(0));

  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {optimisticQuantity}
      </label>
      <div className="flex items-center border border-[#F2EFE9]/20">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-8 h-8 flex items-center justify-center text-[#F2EFE9]/50 hover:text-[#B55A3C] hover:bg-[#F2EFE9]/5 transition-colors disabled:opacity-30"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span>−</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: prevQuantity}}
            />
          </button>
        </UpdateCartButton>

        <div className="px-3 text-center text-[#F2EFE9] font-mono text-xs min-w-[2rem]" data-test="item-quantity">
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="w-8 h-8 flex items-center justify-center text-[#F2EFE9]/50 hover:text-[#B55A3C] hover:bg-[#F2EFE9]/5 transition-colors"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span>+</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: nextQuantity}}
            />
          </button>
        </UpdateCartButton>
      </div>
    </>
  );
}

function UpdateCartButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{
        lines,
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />;
}

export function CartEmpty({
  hidden = false,
  layout = 'drawer',
  onClose,
}: {
  hidden?: boolean;
  layout?: Layouts;
  onClose?: () => void;
}) {
  const container = {
    drawer: 'flex flex-col items-center justify-center h-full gap-8 text-center px-8',
    page: clsx([
      hidden ? 'hidden' : 'flex',
      'flex-col items-center justify-center gap-8 text-center py-20',
    ]),
  };

  return (
    <div className={container[layout]} hidden={hidden}>
      {/* Empty state icon */}
      <div className="relative">
        <div className="w-24 h-24 border border-[#F2EFE9]/10 flex items-center justify-center">
          <div className="w-16 h-16 border border-dashed border-[#B55A3C]/30 flex items-center justify-center">
            <span className="font-heading text-2xl text-[#B55A3C]/50">∅</span>
          </div>
        </div>
        {/* Corner markers */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-l border-t border-[#B55A3C]" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-r border-t border-[#B55A3C]" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l border-b border-[#B55A3C]" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r border-b border-[#B55A3C]" />
      </div>
      
      <div className="space-y-3 max-w-xs">
        <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.3em] uppercase block">
          Cart Empty
        </span>
        <h2 className="font-heading text-2xl text-[#F2EFE9] uppercase tracking-[0.08em]">
          Nothing Selected
        </h2>
        <p className="font-mono text-xs text-[#F2EFE9]/50 leading-relaxed">
          Limited quantities available. Once sold out, pieces are permanently archived.
        </p>
      </div>
      
      <Link 
        to="/products" 
        onClick={onClose}
      >
        <Button className="px-10 py-5 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300">
          Browse Archive →
        </Button>
      </Link>
    </div>
  );
}
