import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {ProductCard} from '~/components/ProductCard';

export function FeaturedGrid({products, title = "Latest Finds"}: {products: any[], title?: string}) {
  if (!products || products.length === 0) return null;

  return (
    <section id="featured-grid" className="py-24 px-4 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="font-typewriter text-xs text-dark-green/60 mb-4 tracking-widest uppercase"
            >
                <span>New Discoveries</span>
            </motion.div>
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-4xl md:text-5xl text-dark-green tracking-widest mb-6 uppercase"
            >
                {title}
            </motion.h2>
            <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-1 bg-rust mx-auto origin-center"
            />
        </div>

        {/* Product Grid with Staggered Animation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 md:gap-8">
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
                >
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
            <Link to="/collections/all" className="inline-block border-b border-rust text-dark-green font-heading tracking-widest hover:text-rust hover:border-rust transition-colors pb-1">
                Explore All Finds &rarr;
            </Link>
        </motion.div>

      </div>
    </section>
  );
}
