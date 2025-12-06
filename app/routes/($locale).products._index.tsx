import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {motion} from 'framer-motion';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'All the store products',
      description: 'All the store products',
      seo: {
        title: 'All Products',
        description: 'All the store products',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });

  return json({
    products: data.products,
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />

      {/* Decorative Botanical Elements */}
      <div className="absolute top-32 left-0 w-64 h-64 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full text-dark-green">
          <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 40 Q140 60 160 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 60 Q60 80 40 60" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 80 Q150 100 170 80" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 100 Q50 120 30 100" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="160" cy="40" r="8" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="40" cy="60" r="6" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="170" cy="80" r="5" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>

       {/* New Header Identity */}
      <motion.div 
        className="relative z-10 pt-40 pb-8 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title Group */}
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          Recovered Works
        </h1>
        
        {/* Illustrated Divider (Vine/Glyph) */}
         <div className="flex justify-center items-center gap-4 mb-4 opacity-60">
            <svg width="120" height="12" viewBox="0 0 120 12" fill="none" className="text-rust">
                <path d="M0 6H120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
                <path d="M60 6L55 1M60 6L55 11" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M60 6L65 1M60 6L65 11" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="60" cy="6" r="2" fill="currentColor"/>
            </svg>
        </div>

        {/* Short Caption */}
        <p className="font-body text-dark-green/60 text-lg uppercase tracking-widest mb-8">
          Artifacts unearthed from the frontier
        </p>

        {/* Expedition Notes Wall */}
        <div className="max-w-xl mx-auto border-l-2 border-rust/30 pl-6 text-left mb-8">
            <p className="font-body text-dark-green/80 italic text-md leading-relaxed">
                "Our scouts salvaged these specimens in the ruins where nature reclaimed what was forgotten. 
                Each piece has been cleaned, catalogued, and prepared for reissue."
            </p>
            <p className="font-heading text-[10px] text-rust tracking-[0.2em] uppercase mt-2">
                — Expedition Log 744 // Sector 4
            </p>
        </div>
      </motion.div>

      {/* Recovered Across the Lost World - MOVED HERE */}
      <div className="relative z-10 py-12 border-b border-dark-green/10 mb-16 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-80 hover:opacity-100 transition-opacity duration-500">
               {/* Region 1 */}
               <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 border border-rust/30 rounded-full flex items-center justify-center text-rust group-hover:bg-rust group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m7-2a2 2 0 012-2h1" /></svg>
                  </div>
                  <div className="flex flex-col text-left">
                     <span className="font-heading text-xs text-dark-green tracking-widest uppercase">Urban Ruins</span>
                     <span className="font-serif text-[10px] text-dark-green/60 italic">Sector 7</span>
                  </div>
              </div>

               {/* Region 2 */}
              <div className="flex items-center gap-3 group cursor-default">
                   <div className="w-10 h-10 border border-rust/30 rounded-full flex items-center justify-center text-rust group-hover:bg-rust group-hover:text-white transition-all duration-300">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                    <div className="flex flex-col text-left">
                     <span className="font-heading text-xs text-dark-green tracking-widest uppercase">Lost Highways</span>
                     <span className="font-serif text-[10px] text-dark-green/60 italic">Route 66</span>
                  </div>
              </div>

               {/* Region 3 */}
              <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-10 h-10 border border-rust/30 rounded-full flex items-center justify-center text-rust group-hover:bg-rust group-hover:text-white transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                  </div>
                   <div className="flex flex-col text-left">
                     <span className="font-heading text-xs text-dark-green tracking-widest uppercase">Deep Forests</span>
                     <span className="font-serif text-[10px] text-dark-green/60 italic">Outpost 9</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Field Index - Stamped Inline Panel */}
       <div className="max-w-4xl mx-auto px-4 mb-16 relative z-10 text-center">
         <div className="inline-block border-2 border-dark-green/10 p-6 bg-[#f4f1ea] relative shadow-lg transform rotate-[-0.5deg]">
             {/* Decorative Corner Stamps */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-dark-green/40" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-dark-green/40" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-dark-green/40" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-dark-green/40" />
            
             <h3 className="font-heading text-lg text-dark-green tracking-widest uppercase mb-6 flex items-center justify-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-rust"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/></svg>
                 Field Index
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-rust"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor"/></svg>
            </h3>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center text-sm font-serif text-dark-green/80">
                <div className="flex flex-wrap justify-center gap-4">
                   {['Apparel', 'Prints', 'Relics', 'Editions'].map(cat => (
                      <button key={cat} className="hover:text-rust transition-colors uppercase tracking-widest text-[10px] font-bold border-b-2 border-transparent hover:border-rust pb-0.5">
                        {cat}
                      </button>
                   ))}
                </div>
                <div className="hidden md:block w-px h-8 bg-dark-green/20 rotate-12" />
                <div className="flex flex-wrap justify-center gap-4 italic text-dark-green/60">
                    {['Sector 7', 'The Silent Highway', 'Deep Woods'].map(site => (
                         <button key={site} className="hover:text-rust transition-colors hover:not-italic">
                            {site}
                         </button>
                    ))}
                </div>
            </div>
         </div>
      </div>

       {/* Archival Grid - Stamped Sheet Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-32 relative z-10">
          <div className="bg-[#f9f7f3] border border-dark-green/10 p-6 md:p-12 relative shadow-sm">
             {/* Sheet Header Metadata */}
             <div className="flex justify-between items-center border-b border-dark-green/10 pb-4 mb-10 opacity-50 select-none">
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                   Fig. 1A — Recovered Inventory
                </span>
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                    Status: Declassified
                </span>
             </div>

             <Section padding="x" className="p-0">
                <Pagination connection={products}>
                  {({nodes, isLoading, NextLink, PreviousLink}) => {
                    const itemsMarkup = nodes.map((product, i) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        <ProductCard
                          product={product as ProductCardFragment}
                          loading={getImageLoadingPriority(i)}
                          index={i}
                        />
                      </motion.div>
                    ));

                    return (
                      <>
                        <motion.div 
                          className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {itemsMarkup}
                          
                          {/* Placeholder Cards for "Incoming Artifacts" */}
                          {[1, 2].map((i) => (
                             <div key={`placeholder-${i}`} className="opacity-60 grayscale relative group cursor-not-allowed">
                                 <div className="bg-[#f4f1ea] border border-dashed border-dark-green/30 h-full p-6 flex flex-col items-center justify-center text-center aspect-[4/5] relative overflow-hidden">
                                     <div className="absolute inset-0 bg-[url('/assets/texture_leaf_shadow.png')] opacity-10 bg-cover" />
                                     <div className="border border-dark-green/20 rounded-full p-4 mb-4">
                                        <svg className="w-8 h-8 text-dark-green/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                     </div>
                                     <span className="font-heading text-sm text-dark-green/60 tracking-widest uppercase mb-1">
                                         Incoming Artifact
                                     </span>
                                     <span className="font-mono text-[10px] text-rust uppercase tracking-widest">
                                         Status: In Transit
                                     </span>
                                 </div>
                             </div>
                          ))}

                        </motion.div>

                        <div className="flex items-center justify-between mt-16 border-t border-dark-green/10 pt-8 opacity-60">
                           <PreviousLink className="font-mono text-xs uppercase tracking-widest text-dark-green hover:text-rust transition-colors">
                             ← Previous Page
                           </PreviousLink>
                            <span className="font-mono text-[10px] text-dark-green/40">
                                Page {1} of {1}
                            </span>
                           <NextLink className="font-mono text-xs uppercase tracking-widest text-dark-green hover:text-rust transition-colors">
                             Load More Artifacts →
                           </NextLink>
                        </div>
                      </>
                    );
                  }}
                </Pagination>
             </Section>
          </div>
      </div>

    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
