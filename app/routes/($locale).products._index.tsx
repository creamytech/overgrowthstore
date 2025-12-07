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
  flattenConnection,
} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {motion} from 'framer-motion';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Link} from '~/components/Link';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  // Fetch products and collections in parallel
  const [productsData, collectionsData] = await Promise.all([
    storefront.query(ALL_PRODUCTS_QUERY, {
      variables: {
        ...variables,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
    storefront.query(COLLECTIONS_QUERY, {
      variables: {
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    }),
  ]);

  invariant(productsData, 'No data returned from Shopify API');

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
      products: productsData.products,
      updatedAt: '',
    },
  });

  return json({
    products: productsData.products,
    collections: flattenConnection(collectionsData.collections) as Array<{id: string; title: string; handle: string}>,
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
  const {products, collections} = useLoaderData<typeof loader>();

  // Vibe Tile component - atmospheric/texture tiles mixed in grid
  const VibeTile = ({type, index}: {type: 'texture' | 'quote' | 'coordinates', index: number}) => {
    if (type === 'texture') {
      return (
        <div className="aspect-square bg-gradient-to-br from-dark-green/10 to-rust/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-dark-green/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5">
              <path d="M12 22V12m0 0c0-4 4-8 8-8-1 4-4 8-8 8m0 0c0-4-4-8-8-8 1 4 4 8 8 8"/>
            </svg>
          </div>
          <p className="absolute bottom-2 left-2 font-mono text-[8px] text-dark-green/30 uppercase">Sample #{index + 1}</p>
        </div>
      );
    }
    if (type === 'quote') {
      return (
        <div className="aspect-[4/3] bg-[#f4f1ea] border border-dark-green/10 p-6 flex flex-col justify-center text-center">
          <svg className="w-6 h-6 text-rust/30 mx-auto mb-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609v3.518c-2.999.905-4.785 3.428-4.826 6.311l.034-.006H22v8.177h-7.983zM2 21v-7.391c0-5.704 3.731-9.57 8.983-10.609v3.518c-2.999.905-4.785 3.428-4.826 6.311l.035-.006H10V21H2z"/>
          </svg>
          <p className="font-handwritten text-lg text-dark-green/60 italic leading-relaxed">
            "The wild always finds a way to reclaim what was left behind."
          </p>
          <p className="font-mono text-[8px] text-rust/50 mt-2 uppercase">— Field Notes</p>
        </div>
      );
    }
    return (
      <div className="aspect-[3/2] bg-dark-green/5 border border-dark-green/10 p-4 flex flex-col justify-end">
        <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest">Signal Origin</p>
        <p className="font-mono text-xs text-dark-green/60">40.7128° N, 74.0060° W</p>
        <p className="font-mono text-[8px] text-dark-green/30 mt-1">Sector: NYC Overgrown</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Texture Overlay & Dappled Light */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
           <div className="absolute top-0 right-0 w-[60vw] h-[60vh] bg-gradient-radial from-orange-100/40 to-transparent opacity-60 blur-3xl rounded-full mix-blend-screen" />
           <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-gradient-radial from-green-100/30 to-transparent opacity-40 blur-3xl rounded-full mix-blend-screen" />
      </div>

      {/* Decorative Botanical Elements */}
      <div className="absolute top-32 left-0 w-64 h-64 opacity-[0.04] pointer-events-none z-0">
        <svg viewBox="0 0 200 200" className="w-full h-full text-dark-green">
          <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 40 Q140 60 160 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 60 Q60 80 40 60" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>

       {/* Header - "The Supply Depot" */}
      <motion.div 
        className="relative z-10 pt-40 pb-8 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Document Badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <svg className="w-5 h-5 text-dark-green/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <span className="font-mono text-xs text-dark-green/40 uppercase tracking-widest">Inventory Manifest</span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          The Supply Depot
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
          Gear recovered from the frontier zones
        </p>

        {/* Zone Tags Filter - Links to Collections */}
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest mb-3">Browse by Sector</p>
          <div className="flex flex-wrap justify-center gap-2">
            {/* "All Zones" is always active on this page */}
            <span
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest bg-dark-green text-[#f4f1ea]"
            >
              All Zones
            </span>
            
            {/* Dynamic collection links */}
            {collections.map((collection: {id: string; title: string; handle: string}) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
                className="px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all bg-[#f9f7f3] border border-dark-green/20 text-dark-green/60 hover:border-rust hover:text-rust"
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

       {/* Archival Grid - Supply Depot Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 pb-32 relative z-10">
          <div className="bg-[#f9f7f3]/80 backdrop-blur-sm border border-dark-green/10 p-6 md:p-12 relative shadow-sm">
             {/* Sheet Header Metadata */}
             <div className="flex justify-between items-center border-b border-dark-green/10 pb-4 mb-10 opacity-50 select-none">
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                   Manifest SD-001 — Active Inventory
                </span>
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                    Status: Open for Acquisition
                </span>
             </div>

             <Section padding="x" className="p-0">
                <Pagination connection={products}>
                  {({nodes, isLoading, NextLink, PreviousLink}) => {
                    // Mix vibe tiles into the product grid
                    const itemsWithVibes: React.ReactNode[] = [];
                    nodes.forEach((product, i) => {
                      // Add a vibe tile every 4 products
                      if (i > 0 && i % 4 === 0) {
                        const tileTypes: ('texture' | 'quote' | 'coordinates')[] = ['texture', 'quote', 'coordinates'];
                        const tileType = tileTypes[Math.floor(i / 4) % 3];
                        itemsWithVibes.push(
                          <motion.div
                            key={`vibe-${i}`}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="break-inside-avoid"
                          >
                            <VibeTile type={tileType} index={i} />
                          </motion.div>
                        );
                      }
                      
                      itemsWithVibes.push(
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
                      );
                    });

                    return (
                      <>
                        <motion.div 
                          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {itemsWithVibes}
                        </motion.div>

                        <div className="flex items-center justify-between mt-16 border-t border-dark-green/10 pt-8">
                           <PreviousLink className="font-mono text-xs uppercase tracking-widest text-dark-green/60 hover:text-rust transition-colors">
                             ← Previous Sector
                           </PreviousLink>
                            <span className="font-mono text-[10px] text-dark-green/40">
                                Excavation Date: Recent First
                            </span>
                           <NextLink className="font-mono text-xs uppercase tracking-widest text-dark-green/60 hover:text-rust transition-colors">
                             Load More Gear →
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

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 10, sortKey: UPDATED_AT) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

