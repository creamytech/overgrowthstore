import {Link} from '@remix-run/react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductCard} from '~/components/ProductCard';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';

interface FeaturedProductsProps {
  products: ProductCardFragment[];
  title?: string;
}

export function FeaturedProducts({products, title = "Fresh Recoveries"}: FeaturedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 md:py-32 px-4 md:px-12 bg-[#F2EFE9] relative">
      {/* Top divider */}
      <div className="divider-archival mb-24" />
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="specimen-number block mb-6">
            — Specimens —
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-[#1a472a] tracking-[0.12em] mb-6 uppercase">
            {title}
          </h2>
          <Separator className="w-16 mx-auto bg-[#B55A3C]" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {products.slice(0, 8).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{animationDelay: `${index * 80}ms`}}
            >
              <ProductCard 
                product={product} 
                loading={index < 4 ? 'eager' : 'lazy'}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* View Archive Link */}
        <div className="mt-20 text-center">
          <Button 
            asChild 
            variant="outline" 
            className="px-10 py-5 text-xs font-mono tracking-[0.2em] uppercase border-[#1a472a]/30 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C] transition-all duration-300"
          >
            <Link to="/collections/all">
              Browse Full Archive →
            </Link>
          </Button>
        </div>

      </div>
    </section>
  );
}
