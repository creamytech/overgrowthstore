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

import {Button} from '~/components/Button';
import {Text, Heading} from '~/components/Text';
import {Link} from '~/components/Link';
import {IconRemove, IconTicket} from '~/components/Icon';
import {FeaturedProducts} from '~/components/FeaturedProducts';
import {getInputStyleClasses} from '~/lib/utils';

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
  const linesCount = Boolean(cart?.lines?.edges?.length || 0);

  return (
    <>
      <CartEmpty hidden={linesCount} onClose={onClose} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
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
  // @todo: get optimistic cart cost
  const cartHasItems = !!cart && cart.totalQuantity > 0;
  const container = {
    drawer: 'grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto] bg-transparent text-dark-green font-body', 
    page: 'w-full pb-12 grid md:grid-cols-2 md:items-start gap-8 md:gap-8 lg:gap-12',
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
      {/* Have existing discount, display it with a remove option */}
      <dl className={codes && codes.length !== 0 ? 'grid' : 'hidden'}>
        <div className="flex items-center justify-between font-medium">
          <Text as="dt">Discount(s)</Text>
          <div className="flex items-center justify-between">
            <UpdateDiscountForm>
              <button>
                <IconRemove
                  aria-hidden="true"
                  style={{height: 18, marginRight: 4}}
                />
              </button>
            </UpdateDiscountForm>
            <Text as="dd">{codes?.join(', ')}</Text>
          </div>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="relative mt-4 border border-dark-green bg-[#e8e4d9]">
            {/* Header Bar */}
            <div className="bg-dark-green text-[#f4f1ea] px-3 py-1.5 flex items-center gap-2">
                <IconTicket className="w-4 h-4 text-[#f4f1ea]" />
                <span className="font-heading text-xs tracking-[0.2em] uppercase">
                    Promo Code Authorization
                </span>
            </div>
            
            {/* Input Area */}
            <div className="p-3 flex gap-2">
                <div className="flex-grow bg-white border border-dark-green/20 p-2 shadow-inner">
                    <input
                        className="w-full bg-transparent font-typewriter text-sm text-dark-green placeholder:text-dark-green/30 focus:outline-none uppercase tracking-widest"
                        type="text"
                        name="discountCode"
                        placeholder="ENTER_CODE_HERE..."
                    />
                </div>
                <button className="font-heading text-sm tracking-widest text-[#f4f1ea] bg-dark-green px-4 hover:bg-rust transition-colors shadow-sm">
                    APPLY
                </button>
            </div>
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
    y > 0 ? 'border-t border-dark-green/10' : '',
    layout === 'page'
      ? 'flex-grow md:translate-y-4'
      : 'pb-6 sm-max:pt-2 overflow-auto transition',
  ]);

  return (
    <section
      ref={scrollRef}
      aria-labelledby="cart-contents"
      className={className}
    >
      <ul className="grid gap-6 md:gap-10">
        {currentLines.map((line) => (
          <CartLineItem key={line.id} line={line as CartLine} />
        ))}
      </ul>
    </section>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-4">
      <a href={checkoutUrl} target="_self" className="group relative">
        <Button as="span" width="full" className="relative bg-dark-green text-[#f4f1ea] font-heading tracking-[2px] uppercase hover:bg-rust transition-colors duration-100 steps(2) flex items-center justify-center gap-2 py-4">
          ACQUIRE
        </Button>
      </a>
      {/* @todo: <CartShopPayButton cart={cart} /> */}
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
    drawer: 'grid gap-4 pt-6 border-t border-dark-green/10',
    page: 'sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full',
  };

  return (
    <section aria-labelledby="summary-heading" className={summary[layout]}>
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium text-dark-green">
          <Text as="dt">Subtotal</Text>
          <Text as="dd" data-test="subtotal">
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </Text>
        </div>
      </dl>
      {children}
    </section>
  );
}

type OptimisticData = {
  action?: string;
  quantity?: number;
};


function CartLineItem({line}: {line: CartLine}) {
  const optimisticData = useOptimisticData<OptimisticData>(line?.id);

  if (!line?.id) return null;

  const {id, quantity, merchandise} = line;

  if (typeof quantity === 'undefined' || !merchandise?.product) return null;

  return (
    <li
      key={id}
      className="flex gap-6 py-6 border-b-2 border-dashed border-dark-green/20 relative group transition-transform duration-100 steps(2) hover:bg-dark-green/5 items-start"
      style={{
        display: optimisticData?.action === 'remove' ? 'none' : 'flex',
      }}
    >
      {/* Polaroid Image */}
      <div className="flex-shrink-0 relative w-24 h-28 rotate-[-2deg] transition-transform duration-100 steps(2) group-hover:rotate-0 group-hover:scale-105">
        <div className="absolute inset-0 bg-white shadow-md p-1.5 pb-5 transform transition-transform duration-100 steps(2)">
            {merchandise.image && (
            <Image
                width={110}
                height={110}
                data={merchandise.image}
                className="object-cover object-center w-full h-full border border-gray-100 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-100 steps(2)"
                alt={merchandise.title}
            />
            )}
        </div>
      </div>

      <div className="flex justify-between flex-grow gap-4">
        <div className="grid gap-1">
          {/* Handwritten Title */}
          <Heading as="h3" size="copy" className="font-heading text-2xl tracking-widest text-dark-green leading-tight">
            {merchandise?.product?.handle ? (
              <Link to={`/products/${merchandise.product.handle}`}>
                {merchandise?.product?.title || ''}
              </Link>
            ) : (
              <Text>{merchandise?.product?.title || ''}</Text>
            )}
          </Heading>

          <div className="grid pb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name} className="text-dark-green/70 font-body text-xs uppercase tracking-wider">
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex justify-start text-copy scale-90 origin-left">
              <CartLineQuantityAdjust line={line} />
            </div>
            <ItemRemoveButton lineId={id} />
          </div>
        </div>
        
        <div className="flex flex-col items-end">
            <Text className="font-body text-dark-green font-bold text-lg">
            <CartLinePrice line={line} as="span" />
            </Text>
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
        className="flex items-center justify-center w-10 h-10 border border-dark-green/20 rounded hover:border-rust hover:text-rust transition-colors duration-100 steps(2)"
        type="submit"
      >
        <span className="sr-only">Remove</span>
        <IconRemove aria-hidden="true" />
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
      <div className="flex items-center border border-dark-green/20 rounded">
        <UpdateCartButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            name="decrease-quantity"
            aria-label="Decrease quantity"
            className="w-10 h-10 transition duration-100 steps(2) text-dark-green/50 hover:text-dark-green disabled:text-dark-green/10"
            value={prevQuantity}
            disabled={optimisticQuantity <= 1}
          >
            <span>&#8722;</span>
            <OptimisticInput
              id={optimisticId}
              data={{quantity: prevQuantity}}
            />
          </button>
        </UpdateCartButton>

        <div className="px-2 text-center text-dark-green" data-test="item-quantity">
          {optimisticQuantity}
        </div>

        <UpdateCartButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            className="w-10 h-10 transition text-dark-green/50 hover:text-dark-green"
            name="increase-quantity"
            value={nextQuantity}
            aria-label="Increase quantity"
          >
            <span>&#43;</span>
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
  hidden: boolean;
  layout?: Layouts;
  onClose?: () => void;
}) {
  const scrollRef = useRef(null);
  const {y} = useScroll(scrollRef);

  const container = {
    drawer: clsx([
      'content-start gap-4 pb-8 transition overflow-y-scroll md:gap-12 h-screen-no-nav md:pb-12 text-dark-green font-body',
      y > 0 ? 'border-t border-dark-green/10' : '',
    ]),
    page: clsx([
      hidden ? '' : 'grid',
      `pb-12 w-full md:items-start gap-4 md:gap-8 lg:gap-12`,
    ]),
  };

  return (
    <div ref={scrollRef} className={container[layout]} hidden={hidden}>
      <section className="grid gap-6 text-center justify-items-center pt-12">
        <div className="w-24 h-24 opacity-30 mb-4">
             {/* Empty Backpack / Crossed Circle Icon */}
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-dark-green">
                 <circle cx="12" cy="12" r="10" />
                 <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
             </svg>
        </div>
        <Text format className="font-typewriter text-xl md:text-2xl leading-relaxed max-w-md mx-auto">
          Looks like you haven&rsquo;t added anything yet...
          <br/>
          <span className="text-sm opacity-70">Begin your requisition.</span>
        </Text>
        <div>
          <Button onClick={onClose} className="bg-dark-green text-[#EFEBD6] font-heading tracking-widest px-8 py-3 hover:bg-rust transition-colors duration-100 steps(2)">
              INITIATE SEARCH
          </Button>
        </div>
      </section>
      <section className="grid gap-8 pt-16 border-t border-dark-green/10 mt-8">
        <FeaturedProducts
          count={4}
          heading="STANDARD ISSUE"
          layout={layout}
          onClose={onClose}
          sortKey="BEST_SELLING"
        />
      </section>
    </div>
  );
}
