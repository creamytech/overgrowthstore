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

import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';

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
  const variables = getPaginationVariables(request, {pageBy: 12});

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
    <div className="min-h-screen bg-[#F2EFE9] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-[10px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-6">
            — Find Artifacts —
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-[#1a472a] tracking-[0.12em] uppercase mb-4">
            Search
          </h1>
          <Separator className="w-16 mx-auto bg-[#B55A3C] my-8" />
        </div>

        {/* Search Form */}
        <Form method="get" className="mb-16">
          <div className={`flex border transition-colors ${isFocused ? 'border-[#B55A3C]' : 'border-[#1a472a]/15'}`}>
            <input
              type="search"
              name="q"
              defaultValue={searchTerm}
              placeholder="Search the archive..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent px-6 py-4 font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84]/40 focus:outline-none"
            />
            <Button 
              type="submit"
              className="px-8 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em]"
            >
              Search
            </Button>
          </div>
        </Form>

        {/* Results */}
        {!searchTerm || noResults ? (
          <NoResults
            noResults={noResults}
            searchTerm={searchTerm}
            recommendations={noResultRecommendations}
          />
        ) : (
          <div>
            {/* Results header */}
            <div className="flex items-center justify-between mb-8 border-b border-[#1a472a]/10 pb-6">
              <div>
                <span className="font-mono text-[10px] text-[#8A8A84]/60 uppercase tracking-[0.2em] block mb-1">
                  Results for
                </span>
                <span className="font-heading text-lg text-[#1a472a] uppercase tracking-wide">
                  "{searchTerm}"
                </span>
              </div>
              <div className="text-right">
                <span className="font-heading text-2xl text-[#B55A3C]">{products.nodes.length}</span>
                <span className="font-mono text-[10px] text-[#8A8A84]/60 uppercase tracking-[0.2em] block">
                  Found
                </span>
              </div>
            </div>
            
            <Pagination connection={products}>
              {({nodes, isLoading, NextLink, PreviousLink}) => (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {nodes.map((product, i) => (
                      <div
                        key={product.id}
                        className="animate-fade-up"
                        style={{animationDelay: `${i * 50}ms`}}
                      >
                        <ProductCard
                          product={product}
                          loading={getImageLoadingPriority(i)}
                          index={i}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#1a472a]/10">
                    <PreviousLink className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
                      ← Previous
                    </PreviousLink>
                    <NextLink className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
                      Next →
                    </NextLink>
                  </div>
                </>
              )}
            </Pagination>
          </div>
        )}
        
        <Analytics.SearchView data={{searchTerm, searchResults: products}} />
      </div>
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
        <div className="text-center py-16">
          <span className="font-mono text-[10px] text-[#8A8A84]/60 tracking-[0.3em] uppercase block mb-4">
            — Empty —
          </span>
          <h2 className="font-heading text-2xl text-[#1a472a] uppercase tracking-[0.1em] mb-2">
            No Results Found
          </h2>
          <p className="font-mono text-sm text-[#8A8A84] mb-2">
            No artifacts found for "<span className="text-[#B55A3C]">{searchTerm}</span>"
          </p>
          <p className="font-mono text-xs text-[#8A8A84]/60">
            Try a different search term
          </p>
        </div>
      )}
      
      {!searchTerm && (
        <div className="text-center py-16">
          <span className="font-mono text-[10px] text-[#8A8A84]/60 tracking-[0.3em] uppercase block mb-4">
            — Ready —
          </span>
          <p className="font-mono text-sm text-[#8A8A84]">
            Enter a search term to find artifacts
          </p>
        </div>
      )}
      
      <Suspense>
        <Await
          errorElement="There was a problem loading recommendations"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const {featuredProducts} = result;

            return (
              <div className="mt-16 border-t border-[#1a472a]/10 pt-12">
                <div className="text-center mb-8">
                  <span className="font-mono text-[10px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-3">
                    — Suggested —
                  </span>
                  <h3 className="font-heading text-lg text-[#1a472a] uppercase tracking-[0.1em]">
                    Popular Artifacts
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {featuredProducts.nodes.slice(0, 4).map((product: any, i: number) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
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
