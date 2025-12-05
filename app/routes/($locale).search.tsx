import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {
  Pagination,
  getPaginationVariables,
  Analytics,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Section} from '~/components/Text';
import {Grid} from '~/components/Grid';
import {ProductCard} from '~/components/ProductCard';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {FeaturedCollections} from '~/components/FeaturedCollections';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {Icon} from '@iconify/react';

import {
  getFeaturedData,
  type FeaturedData,
} from './($locale).featured-products';

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q')!;
  const variables = getPaginationVariables(request, {pageBy: 8});

  const {products} = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Search() {
  const {searchTerm, products, noResultRecommendations} =
    useLoaderData<typeof loader>();
  const noResults = products?.nodes?.length === 0;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Layered Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f1ea] via-[#ebe7dc] to-[#f4f1ea]" />
      
      {/* Decorative grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a472a 1px, transparent 1px),
            linear-gradient(to bottom, #1a472a 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Hero Search Section */}
      <div className="relative z-10 pt-40 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative top element */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
              <Icon icon="ph:magnifying-glass-light" className="w-6 h-6 text-rust" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
            </div>
          </div>

          <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4">
            SEARCH
          </h1>
          <p className="font-body text-dark-green/60 text-lg mb-12 max-w-md mx-auto">
            Find recovered works from the quiet places
          </p>

          {/* Enhanced Search Form */}
          <Form method="get" className="relative max-w-2xl mx-auto">
            <div 
              className={`
                relative bg-[#f9f7f3] border-2 transition-all duration-300 shadow-lg
                ${isFocused 
                  ? 'border-rust shadow-xl shadow-rust/10' 
                  : 'border-dark-green/20 hover:border-dark-green/40'
                }
              `}
            >
              {/* Corner accents that animate on focus */}
              <div className={`absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 transition-colors duration-300 ${isFocused ? 'border-rust' : 'border-dark-green/30'}`} />
              <div className={`absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 transition-colors duration-300 ${isFocused ? 'border-rust' : 'border-dark-green/30'}`} />
              <div className={`absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 transition-colors duration-300 ${isFocused ? 'border-rust' : 'border-dark-green/30'}`} />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 transition-colors duration-300 ${isFocused ? 'border-rust' : 'border-dark-green/30'}`} />
              
              <div className="flex items-center">
                <div className="pl-6 pr-3">
                  <Icon 
                    icon="ph:magnifying-glass" 
                    className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-rust' : 'text-dark-green/40'}`} 
                  />
                </div>
                <input
                  type="search"
                  name="q"
                  defaultValue={searchTerm}
                  placeholder="What are you looking for?"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="flex-1 bg-transparent py-5 px-2 font-body text-dark-green placeholder:text-dark-green/30 focus:outline-none text-lg tracking-wide"
                />
                <button 
                  type="submit"
                  className="group m-2 bg-dark-green text-[#f4f1ea] px-8 py-3 font-heading tracking-widest hover:bg-rust transition-all duration-300 flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Search</span>
                  <Icon icon="ph:arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Search suggestions hint */}
            <p className="mt-4 font-body text-xs text-dark-green/40 tracking-wide">
              Try searching for "hoodie", "vintage", or browse our collections below
            </p>
          </Form>
        </div>
      </div>

      {/* Results Section */}
      {!searchTerm || noResults ? (
        <NoResults
          noResults={noResults}
          searchTerm={searchTerm}
          recommendations={noResultRecommendations}
        />
      ) : (
        <Section className="relative z-10 px-4 md:px-12 pb-32">
          {/* Results header with count */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex items-center justify-between border-b border-dark-green/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rust/10 flex items-center justify-center">
                  <Icon icon="ph:sparkle" className="w-5 h-5 text-rust" />
                </div>
                <div>
                  <p className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Results for</p>
                  <p className="font-heading text-xl text-dark-green">"{searchTerm}"</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading text-3xl text-rust">{products.nodes.length}</p>
                <p className="font-body text-xs text-dark-green/50 uppercase tracking-widest">Items found</p>
              </div>
            </div>
          </div>
          
          <Pagination connection={products}>
            {({nodes, isLoading, NextLink, PreviousLink}) => {
              const itemsMarkup = nodes.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  loading={getImageLoadingPriority(i)}
                />
              ));

              return (
                <>
                  <div className="flex items-center justify-center mb-8">
                    <PreviousLink className="group inline-flex items-center gap-2 font-heading text-sm text-dark-green border border-dark-green/20 px-6 py-3 hover:bg-dark-green hover:text-[#f4f1ea] transition-all duration-300 tracking-widest">
                      <Icon icon="ph:arrow-left" className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      {isLoading ? 'Loading...' : 'Previous'}
                    </PreviousLink>
                  </div>
                  <Grid data-test="product-grid">{itemsMarkup}</Grid>
                  <div className="flex items-center justify-center mt-8">
                    <NextLink className="group inline-flex items-center gap-2 font-heading text-sm text-dark-green border border-dark-green/20 px-6 py-3 hover:bg-dark-green hover:text-[#f4f1ea] transition-all duration-300 tracking-widest">
                      {isLoading ? 'Loading...' : 'Load More'}
                      <Icon icon="ph:arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </NextLink>
                  </div>
                </>
              );
            }}
          </Pagination>
        </Section>
      )}
      <Analytics.SearchView data={{searchTerm, searchResults: products}} />
    </div>
  );
}

function NoResults({
  noResults,
  searchTerm,
  recommendations,
}: {
  noResults: boolean;
  searchTerm: string;
  recommendations: Promise<null | FeaturedData>;
}) {
  return (
    <>
      {noResults && (
        <div className="relative z-10 text-center px-4 pb-20">
          <div className="max-w-lg mx-auto">
            {/* Empty state card */}
            <div className="relative bg-[#f9f7f3] border border-dark-green/10 p-12 shadow-lg">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-dark-green/20" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-dark-green/20" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-dark-green/20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-dark-green/20" />
              
              {/* Icon container */}
              <div className="w-20 h-20 mx-auto mb-6 border-2 border-dashed border-dark-green/20 flex items-center justify-center">
                <Icon icon="ph:magnifying-glass-minus" className="w-10 h-10 text-dark-green/30" />
              </div>
              
              <h2 className="font-heading text-2xl text-dark-green tracking-widest mb-4">
                NO RESULTS FOUND
              </h2>
              <p className="font-body text-dark-green/60 mb-2">
                We couldn't find anything for "<span className="text-rust">{searchTerm}</span>"
              </p>
              <p className="font-body text-dark-green/40 text-sm">
                Try a different search term or browse our collections below
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!searchTerm && (
        <div className="relative z-10 text-center px-4 pb-16">
          <div className="max-w-md mx-auto py-12">
            <div className="w-16 h-16 mx-auto mb-6 border border-dark-green/20 flex items-center justify-center">
              <Icon icon="ph:compass" className="w-8 h-8 text-dark-green/40" />
            </div>
            <p className="font-body text-dark-green/60">
              Enter a search term to discover items from our collection
            </p>
          </div>
        </div>
      )}
      
      <Suspense>
        <Await
          errorElement="There was a problem loading recommendations"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const {featuredCollections, featuredProducts} = result;

            return (
              <div className="pb-24 relative z-10">
                {/* Section header */}
                <div className="max-w-7xl mx-auto px-4 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-dark-green/20 to-transparent" />
                    <h3 className="font-heading text-xl text-dark-green tracking-widest">
                      POPULAR DISCOVERIES
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-dark-green/20 to-transparent" />
                  </div>
                </div>
                <FeaturedCollections
                  title=""
                  collections={featuredCollections}
                />
                <ProductSwimlane
                  title="Fresh Finds"
                  products={featuredProducts}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

export function getNoResultRecommendations(
  storefront: LoaderFunctionArgs['context']['storefront'],
) {
  return getFeaturedData(storefront, {pageBy: PAGINATION_SIZE});
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
` as const;
