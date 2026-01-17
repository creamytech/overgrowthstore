import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

/**
 * LatestDrops - Premium bento-style grid showcasing recent products
 * Features a hero product with supporting grid layout
 */
export function LatestDrops({products, title = "Latest Drops"}: {products: any[], title?: string}) {
  if (!products || products.length === 0) return null;

  // Split products: first is hero, rest are grid
  const heroProduct = products[0];
  const gridProducts = products.slice(1, 5); // Take up to 4 more

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }} />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l-2 border-t-2 border-[#F2EFE9]/10 hidden lg:block" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r-2 border-b-2 border-[#F2EFE9]/10 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                Just Released
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] tracking-[0.08em] uppercase">
              {title}
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/products" 
              className="group inline-flex items-center gap-3 font-mono text-sm text-[#F2EFE9]/60 hover:text-[#B55A3C] transition-colors"
            >
              <span className="uppercase tracking-wider">View All</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Hero Product - Large Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <Link to={`/products/${heroProduct.handle}`} className="block">
              <div className="relative aspect-[4/5] bg-[#1a1a1a] overflow-hidden">
                {/* Product Image */}
                {heroProduct.featuredImage && (
                  <Image
                    data={heroProduct.featuredImage}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1.5 bg-[#B55A3C] text-[#F2EFE9] font-mono text-[10px] uppercase tracking-wider">
                    New Drop
                  </span>
                </div>
                
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="font-mono text-[10px] text-[#F2EFE9]/50 uppercase tracking-wider block mb-2">
                    Limited Edition
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl text-[#F2EFE9] uppercase tracking-wide mb-3 group-hover:text-[#B55A3C] transition-colors">
                    {heroProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-xl text-[#F2EFE9]">
                      <Money data={heroProduct.priceRange.minVariantPrice} />
                    </span>
                    <span className="font-mono text-[10px] text-[#F2EFE9]/40 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grid Products - Right Side */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {gridProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group"
              >
                <Link to={`/products/${product.handle}`} className="block">
                  <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-4">
                    {product.featuredImage && (
                      <Image
                        data={product.featuredImage}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, 50vw"
                      />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    
                    {/* Corner accent */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Quick view badge */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-4 py-2 bg-[#F2EFE9] text-[#0a0a0a] font-mono text-[10px] uppercase tracking-wider">
                        View
                      </span>
                    </div>
                  </div>
                  
                  <div className="px-1">
                    <h4 className="font-heading text-sm text-[#F2EFE9] uppercase tracking-wide mb-1 group-hover:text-[#B55A3C] transition-colors truncate">
                      {product.title}
                    </h4>
                    <span className="font-mono text-sm text-[#F2EFE9]/60">
                      <Money data={product.priceRange.minVariantPrice} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
