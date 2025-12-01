import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

import {Button} from '~/components/Button';

export function AddToCartButton({
  children,
  lines,
  className = '',
  variant = 'primary',
  width = 'full',
  disabled,
  ...props
}: {
  children: React.ReactNode;
  lines: Array<OptimisticCartLineInput>;
  className?: string;
  variant?: 'primary' | 'secondary' | 'inline';
  width?: 'auto' | 'full';
  disabled?: boolean;
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
          <>
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
                 <div className="absolute inset-0 flex items-center justify-center bg-dark-green z-50">
                    {/* Hazard Stripes Background */}
                    <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, #c05a34 0, #c05a34 10px, transparent 10px, transparent 20px)',
                            backgroundSize: '28px 28px',
                            animation: 'slide 1s linear infinite'
                        }}
                    />
                    <style>{`
                        @keyframes slide {
                            0% { background-position: 0 0; }
                            100% { background-position: 28px 0; }
                        }
                    `}</style>
                    
                    {/* Text */}
                    <span className="relative z-10 font-heading text-xl tracking-[0.2em] uppercase text-[#f4f1ea] animate-pulse">
                        SECURING ASSET...
                    </span>
                 </div>
              ) : (
                children
              )}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
