import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {ProductCard} from '~/components/ProductCard';

export function FeaturedGrid({products, title = "FIELD ISSUE"}: {products: any[], title?: string}) {
  if (!products || products.length === 0) return null;

  return (
    <section id="featured-grid" className="py-24 px-4 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
            <div className="font-typewriter text-xs text-dark-green/60 mb-4 tracking-widest uppercase">
                <span>Supply Drop // Priority Access</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-dark-green tracking-widest mb-6 uppercase">
                {title}
            </h2>
            <div className="w-24 h-1 bg-rust mx-auto" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
            <Link to="/collections/all" className="inline-block border-b border-rust text-dark-green font-heading tracking-widest hover:text-rust hover:border-rust transition-colors pb-1">
                VIEW FULL MANIFEST &rarr;
            </Link>
        </div>

      </div>
    </section>
  );
}
