import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';
import {useEffect, useRef} from 'react';
import {toast} from 'sonner';
import {Loader2} from 'lucide-react';

import {Button} from '~/components/ui/button';
import {cn} from '~/lib/utils';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  productTitle,
  asChild = false,
  ...props
}: {
  children: React.ReactNode;
  lines: Array<OptimisticCartLineInput>;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  productTitle?: string;
  asChild?: boolean;
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
            asChild={asChild}
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
  asChild,
  ...props
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
  productTitle?: string;
  asChild?: boolean;
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

  const isLoading = fetcher.state !== 'idle';
  
  // Map legacy variants to shadcn variants
  const shadcnVariant = 
    variant === 'primary' ? 'default' :
    variant === 'secondary' ? 'secondary' :
    variant === 'inline' ? 'link' : 
    'default';

  return (
    <Button
      type="submit"
      variant={shadcnVariant}
      className={cn(
        width === 'full' && 'w-full',
        className
      )}
      disabled={disabled ?? isLoading}
      asChild={asChild}
      {...props}
    >
      {asChild ? children : (
        isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="font-mono text-xs tracking-wider uppercase">
              Adding...
            </span>
          </>
        ) : (
          children
        )
      )}
    </Button>
  );
}
