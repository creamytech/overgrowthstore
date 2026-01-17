import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {ProductCardFragment} from 'storefrontapi.generated';

import type {
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

import {Link} from '~/components/Link';
import {ProductCard} from '~/components/ProductCard';
import {type SortParam} from '~/components/SortFilter';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {getImageLoadingPriority} from '~/lib/const';
import {parseAsCurrency} from '~/lib/utils';
import {Separator} from '~/components/ui/separator';


export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
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
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
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

export default function Collection() {
  const {collection, collections} = useLoaderData<typeof loader>();
  const productCount = collection.products.nodes.length;

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO HEADER - Full width dramatic header */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#F2EFE9]/20" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#F2EFE9]/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
          {/* Archive badge */}
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Archive № {collection.handle.toUpperCase().slice(0, 3)}
            </span>
            <div className="w-12 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#F2EFE9] tracking-[0.1em] mb-6 uppercase">
            {collection.title}
          </h1>
          
          {collection.description && (
            <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      {/* Collection Navigation Pills */}
      <section className="sticky top-[72px] z-40 bg-[#0a0a0a] border-b border-[#F2EFE9]/10 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              to="/products"
              prefetch="intent"
              className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] border border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:border-[#B55A3C] hover:text-[#B55A3C] transition-all duration-300"
            >
              All Artifacts
            </Link>
            
            {(collections as Array<{id: string; title: string; handle: string}>).map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.handle}`}
                prefetch="intent"
                className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  col.handle === collection.handle
                    ? 'bg-[#B55A3C] text-[#F2EFE9] border border-[#B55A3C]'
                    : 'border border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:border-[#B55A3C] hover:text-[#B55A3C]'
                }`}
              >
                {col.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Pagination connection={collection.products}>
            {({nodes, isLoading, NextLink, PreviousLink}) => (
              <>
                {/* Grid - asymmetric layout for visual interest */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {nodes.map((product, i) => (
                    <div
                      key={product.id}
                      className={`animate-fade-up ${
                        // Make first item larger on desktop
                        i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                      }`}
                      style={{animationDelay: `${i * 50}ms`}}
                    >
                      <ProductCard
                        product={product as ProductCardFragment}
                        loading={getImageLoadingPriority(i)}
                        index={i}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-8 mt-20 pt-8 border-t border-[#1a472a]/10">
                  <PreviousLink className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    Previous
                  </PreviousLink>
                  
                  <div className="px-6 py-2 border border-[#1a472a]/10">
                    <span className="font-mono text-[9px] text-[#8A8A84]/60 tracking-[0.2em] uppercase">
                      {nodes.length} of {productCount} Artifacts
                    </span>
                  </div>
                  
                  <NextLink className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
                    Next
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </NextLink>
                </div>
              </>
            )}
          </Pagination>
        </div>
      </section>

      {/* Analytics */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
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
