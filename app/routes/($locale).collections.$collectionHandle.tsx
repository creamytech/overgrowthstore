import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {motion} from 'framer-motion';
import type {ProductCardFragment} from 'storefrontapi.generated';

import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  Pagination,
  flattenConnection,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {ProductCard} from '~/components/ProductCard';
import {type SortParam} from '~/components/SortFilter';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {getImageLoadingPriority} from '~/lib/const';
import {parseAsCurrency} from '~/lib/utils';


export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });
  const {collectionHandle} = params;
  const locale = context.storefront.i18n;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  const seo = seoPayload.collection({collection, url: request.url});

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};



// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    rotate: -1,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function Collection() {
  const {collection, collections} = useLoaderData<typeof loader>();

  // Vibe Tile component - atmospheric/texture tiles mixed in grid (same as catalog)
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

       {/* Header - Collection Title */}
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
          <span className="font-mono text-xs text-dark-green/40 uppercase tracking-widest">Sector Inventory</span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          {collection.title}
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

        {collection.description && (
          <p className="font-body text-dark-green/60 text-lg uppercase tracking-widest mb-8">
            {collection.description}
          </p>
        )}

        {/* Sector Navigation - Filter Bar */}
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest mb-3">Browse by Sector</p>
          <div className="flex flex-wrap justify-center gap-2">
            {/* "All Zones" links back to main catalog */}
            <Link
              to="/products"
              prefetch="intent"
              className="px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all bg-[#f9f7f3] border border-dark-green/20 text-dark-green/60 hover:border-rust hover:text-rust"
            >
              All Zones
            </Link>
            
            {/* Collection links - current collection is highlighted */}
            {(collections as Array<{id: string; title: string; handle: string}>).map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                prefetch="intent"
                className={`px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all ${
                  col.handle === collection.handle
                    ? 'bg-dark-green text-[#f4f1ea]'
                    : 'bg-[#f9f7f3] border border-dark-green/20 text-dark-green/60 hover:border-rust hover:text-rust'
                }`}
              >
                {col.title}
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
                   Manifest {collection.handle?.toUpperCase()?.slice(0, 8) || 'COL'}-001 — {collection.title}
                </span>
                <span className="font-mono text-[10px] text-dark-green uppercase tracking-widest">
                    Status: Open for Acquisition
                </span>
             </div>

             <Section padding="x" className="p-0">
                <Pagination connection={collection.products}>
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



const COLLECTION_QUERY = `#graphql
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    case 'featured':
      return {
        sortKey: 'MANUAL',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
