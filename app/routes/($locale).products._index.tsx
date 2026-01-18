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

import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Link} from '~/components/Link';
import {Separator} from '~/components/ui/separator';
import {Spotlight} from '~/components/ui/spotlight';

const PAGE_BY = 12;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

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
      descriptionHtml: 'All recovered artifacts',
      description: 'All recovered artifacts',
      seo: {
        title: 'All Products',
        description: 'Browse all recovered artifacts',
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

export default function AllProducts() {
  const {products, collections} = useLoaderData<typeof loader>();
  const productCount = products.nodes.length;

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO HEADER - Full width dramatic header */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        {/* Spotlight Effect */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#B55A3C" />
        
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
          {/* Archive badge */}
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Complete Archive
            </span>
            <div className="w-12 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#F2EFE9] tracking-[0.1em] mb-6 uppercase">
            All Artifacts
          </h1>
          
          <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-xl mx-auto leading-relaxed">
            Premium streetwear in limited runs. No reprints—when they're gone, they're archived.
          </p>
        </div>
      </section>

      {/* Collection Navigation Pills */}
      <section className="sticky top-[72px] z-40 bg-[#0a0a0a] border-b border-[#F2EFE9]/10 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] bg-[#B55A3C] text-[#F2EFE9] border border-[#B55A3C]">
              All Artifacts
            </span>
            
            {collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
                className="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] border border-[#F2EFE9]/20 text-[#F2EFE9]/60 hover:border-[#B55A3C] hover:text-[#B55A3C] transition-all duration-300"
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Pagination connection={products}>
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
                      {nodes.length} Artifacts
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
