import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';


export function SpecimenGrid({collections}: {collections: Collection[]}) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-5xl text-dark-green tracking-widest"
        >
            Recovered Works
        </motion.h2>
        <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1 bg-rust mx-auto mt-4 origin-center"
        />
      </div>

      {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {collections.map((collection, index) => {
            return (
                <motion.div 
                    key={collection.id} 
                    className="break-inside-avoid mb-6"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ 
                        duration: 0.6, 
                        delay: index * 0.15,
                        ease: "easeOut"
                    }}
                >
                    <Link to={`/collections/${collection.handle}`} className="group block relative overflow-hidden border border-rust/20 bg-paper p-4 hover:border-rust transition-colors duration-300">
                        <div className="aspect-[3/4] overflow-hidden relative mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                             {collection.image && (
                                <Image
                                    data={collection.image}
                                    aspectRatio="3/4"
                                    sizes="(min-width: 45em) 20vw, 50vw"
                                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                />
                             )}
                             {/* Overlay Texture */}
                             <div className="absolute inset-0 bg-paper/20 mix-blend-multiply pointer-events-none" />
                        </div>
                        
                        <div className="text-center">
                            <h3 className="font-heading text-2xl text-dark-green mb-1">
                                {collection.title}
                            </h3>
                            <p className="font-body text-xs text-rust uppercase tracking-widest">
                                Explore Collection
                            </p>
                        </div>

                        {/* Corner Accents - Grow on hover */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rust/40 group-hover:border-rust group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rust/40 group-hover:border-rust group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rust/40 group-hover:border-rust group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rust/40 group-hover:border-rust group-hover:w-5 group-hover:h-5 transition-all duration-300" />
                    </Link>
                </motion.div>
            );
        })}
      </div>
    </section>
  );
}
