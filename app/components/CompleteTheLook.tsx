import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {
  Card,
  CardContent,
} from '~/components/ui/card';
import {Badge} from '~/components/ui/badge';

interface Product {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants?: {
    nodes: Array<{
      availableForSale: boolean;
    }>;
  };
}

interface CompleteTheLookProps {
  products: Product[];
  currentProductId: string;
  title?: string;
}

export function CompleteTheLook({
  products,
  currentProductId,
  title = 'Complete the Look',
}: CompleteTheLookProps) {
  // Filter out current product and limit to 4
  const relatedProducts = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-px bg-[#B55A3C]" />
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
            {title}
          </span>
          <div className="w-12 h-px bg-[#B55A3C]" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => {
            const isAvailable = product.variants?.nodes?.some(
              (v) => v.availableForSale
            );

            return (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                prefetch="intent"
                className="group"
              >
                <Card className="bg-transparent border-[#F2EFE9]/10 hover:border-[#B55A3C]/50 transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="aspect-[3/4] relative bg-[#F2EFE9]/5 overflow-hidden">
                    {product.featuredImage ? (
                      <img
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-xs text-[#F2EFE9]/30">
                          No image
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    {!isAvailable && (
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant="secondary"
                          className="bg-[#0a0a0a]/80 text-[#F2EFE9]/70 font-mono text-[9px] uppercase"
                        >
                          Archived
                        </Badge>
                      </div>
                    )}

                    {/* Quick Add Hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-[#F2EFE9] uppercase tracking-wider bg-[#B55A3C] px-4 py-2">
                        View
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-3">
                    <h4 className="font-heading text-sm text-[#F2EFE9] uppercase tracking-wide truncate group-hover:text-[#B55A3C] transition-colors">
                      {product.title}
                    </h4>
                    <span className="font-mono text-xs text-[#F2EFE9]/70 mt-1 block">
                      ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
