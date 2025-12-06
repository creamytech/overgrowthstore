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
    <div className="min-h-screen relative overflow-hidden">
      {/* Texture Overlay & Dappled Light (Matches PDP) */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
           {/* Texture removed to use global PageLayout texture */}
           <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-gradient-radial from-orange-100/40 to-transparent opacity-60 blur-3xl rounded-full mix-blend-screen" />
           <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gradient-radial from-green-100/30 to-transparent opacity-40 blur-3xl rounded-full mix-blend-screen" />
      </div>

      {/* Decorative Botanical Elements */}
      <div className="absolute top-32 left-0 w-64 h-64 opacity-[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full text-dark-green">
          <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 40 Q140 60 160 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 60 Q60 80 40 60" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 80 Q150 100 170 80" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 100 Q50 120 30 100" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>

      {/* ... (Header Content remains somewhat similar, ensuring z-10) ... */}

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
        
        {/* Illustrated Divider */}
         <div className="flex justify-center items-center gap-4 mb-4 opacity-60">
            <svg width="120" height="12" viewBox="0 0 120 12" fill="none" className="text-rust">
                <path d="M0 6H120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2"/>
                <path d="M60 6L55 1M60 6L55 11" stroke="currentColor" strokeWidth="0.5"/>
                <path d="M60 6L65 1M60 6L65 11" stroke="currentColor" strokeWidth="0.5"/>
                <circle cx="60" cy="6" r="2" fill="currentColor"/>
            </svg>
        </div>

        <p className="font-body text-dark-green/60 text-lg uppercase tracking-widest mb-8">
          Artifacts unearthed from the frontier
        </p>


      </motion.div>

      {/* Recovered Across the Lost World section remains ... */}

      {/* Field Index section remains ... */}

       {/* Archival Grid - Stamped Sheet Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-32 relative z-10">
          <div className="bg-[#f9f7f3]/80 backdrop-blur-sm border border-dark-green/10 p-6 md:p-12 relative shadow-sm">
             {/* Sheet Header Metadata */}
             <div className="flex justify-between items-center border-b border-dark-green/10 pb-4 mb-10 opacity-50 select-none">
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                   Fig. 1A — The Archive
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
                        className="break-inside-avoid"
                      >
                        <ProductCard
                          product={product as ProductCardFragment}
                          loading={getImageLoadingPriority(i)}
                          index={i}
                          layout="archive"
                        />
                      </motion.div>
                    ));

                    return (
                      <>
                        <motion.div 
                          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
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
