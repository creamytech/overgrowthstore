import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {CartForm, type CartQueryDataReturn, Analytics} from '@shopify/hydrogen';

import {isLocalPath} from '~/lib/utils';
import {Cart} from '~/components/Cart';
import {Separator} from '~/components/ui/separator';

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);
  invariant(action, 'No cartAction defined');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCode = inputs.discountCode;

      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      invariant(false, `${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, errors, userErrors} = result;

  return json(
    {
      cart: cartResult,
      userErrors,
      errors,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const {cart} = context;
  return json(await cart.get());
}

export default function CartRoute() {
  const cart = useLoaderData<typeof loader>();
  const itemCount = cart?.lines?.edges?.length || 0;

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO Header */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-16 overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#F2EFE9]/10" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#F2EFE9]/10" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Recovery Cart
            </span>
            <div className="w-8 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] tracking-[0.1em] uppercase mb-4">
            Your Artifacts
          </h1>
          
          <div className="w-16 h-px bg-[#F2EFE9]/20 mx-auto mb-4" />
          
          <p className="font-mono text-sm text-[#F2EFE9]/40">
            {itemCount === 0 
              ? 'Your cart is empty' 
              : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
            }
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Cart layout="page" cart={cart} />
        </div>
      </section>
      
      <Analytics.CartView />
    </div>
  );
}
