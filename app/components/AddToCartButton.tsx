import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {toast} from 'sonner';

import {Button} from '~/components/Button';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  productTitle,
  ...props
}: {
  children: React.ReactNode;
  lines: Array<OptimisticCartLineInput>;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  productTitle?: string;
  [key: string]: any;
}) {
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <AddToCartButtonInner 
            fetcher={fetcher}
            disabled={disabled}
            className={className}
            variant={variant}
            width={width}
            productTitle={productTitle}
            {...props}
          >
            {children}
          </AddToCartButtonInner>
        );
      }}
    </CartForm>
  );
}

function AddToCartButtonInner({
  fetcher,
  children,
  className,
  variant,
  width,
  disabled,
  productTitle,
  ...props
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  productTitle?: string;
  [key: string]: any;
}) {
  const prevState = useRef(fetcher.state);

  // Show toast when item is added successfully
  useEffect(() => {
    if (prevState.current === 'submitting' && fetcher.state === 'idle') {
      // Check if there's no error
      if (!fetcher.data?.errors?.length) {
        toast.success('Recovered to cart', {
          description: productTitle || 'Item added successfully',
          duration: 3000,
          icon: '◆',
        });
      }
    }
    prevState.current = fetcher.state;
  }, [fetcher.state, fetcher.data, productTitle]);

  return (
    <Button
      as="button"
      type="submit"
      width={width}
      variant={variant}
      className={`${className} relative overflow-hidden`}
      disabled={disabled ?? fetcher.state !== 'idle'}
      {...props}
    >
      {fetcher.state !== 'idle' ? (
         <div className="absolute inset-0 flex items-center justify-center bg-[#1a472a] z-50">
            {/* Gentle gradient background */}
            <div 
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'linear-gradient(90deg, #3E5F4B 0%, #1a472a 50%, #3E5F4B 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease-in-out infinite'
                }}
            />
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
            
            {/* Text */}
            <span className="relative z-10 font-mono text-xs tracking-[0.2em] uppercase text-[#F2EFE9]">
                Processing...
            </span>
         </div>
      ) : (
        <>
          {children}
        </>
      )}
    </Button>
  );
}
