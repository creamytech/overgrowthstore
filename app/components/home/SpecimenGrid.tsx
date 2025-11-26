import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

export function SpecimenGrid({collections}: {collections: Collection[]}) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-5xl text-dark-green tracking-widest">
          SPECIMEN TRAY
        </h2>
        <div className="w-24 h-1 bg-rust mx-auto mt-4" />
      </div>

      {/* Masonry Layout using CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {collections.map((collection) => {
            // Map specific collections to our visual concepts if needed
            // For now, just render them all
            return (
                <div key={collection.id} className="break-inside-avoid mb-6">
                    <Link to={`/collections/${collection.handle}`} className="group block relative overflow-hidden border border-dark-green/20 bg-paper p-4 hover:border-rust transition-colors duration-300">
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
                                Fig. {collection.id.substring(collection.id.length - 3)}
                            </p>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-dark-green" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dark-green" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dark-green" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-dark-green" />
                    </Link>
                </div>
            );
        })}
      </div>
    </section>
  );
}
