import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {ProductCard} from '~/components/ProductCard';

export function FeaturedGrid({products, title = "Latest Drops"}: {products: any[], title?: string}) {
  if (!products || products.length === 0) return null;

  return (
    <section id="featured-grid" className="pt-12 pb-24 px-4 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-mono text-xs text-[#8A8A84] mb-4 tracking-[0.3em] uppercase"
            >
                <span>Just Released</span>
            </motion.div>
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl md:text-5xl text-[#1a472a] tracking-[0.1em] mb-6 uppercase"
            >
                {title}
            </motion.h2>
            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-[#B55A3C] mx-auto origin-center"
            />
        </div>

        {/* Product Grid with Staggered Animation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-10">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        ease: "easeOut"
                    }}
                    className="group relative"
                >
                     {/* Hover Glow Effect */}
                     <div className="absolute -inset-4 bg-[#B55A3C]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />
                     
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>

        {/* View All Link */}
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 text-center"
        >
            <Link to="/products" className="inline-flex items-center gap-2 border border-[#1a472a]/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C] transition-all duration-300">
                Browse Full Archive
                <span>→</span>
            </Link>
        </motion.div>

      </div>
    </section>
  );
}
