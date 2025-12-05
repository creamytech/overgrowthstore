import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';

import {Button} from '~/components/Button';
import {IconLeaf} from '~/components/ThemedIcons';

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
                    {/* Gentle gradient background */}
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            background: 'linear-gradient(90deg, #4a5d23 0%, #1a472a 50%, #4a5d23 100%)',
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
                    <span className="relative z-10 font-heading text-xl tracking-[0.2em] uppercase text-[#f4f1ea]">
                        Adding to cart...
                    </span>
                 </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <IconLeaf size={18} className="opacity-70" />
                  {children}
                </span>
              )}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
