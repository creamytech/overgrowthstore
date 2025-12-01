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

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
       {/* Texture Overlay */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />

      {/* Custom Header */}
      <div className="relative z-10 pt-32 pb-12 text-center">
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2">
          ALL SALVAGE
        </h1>
        <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
            <span>COMPLETE CATALOG</span>
        </div>
        <div className="w-24 h-1 bg-rust mx-auto mt-6" />
      </div>

      <Section padding="x" className="relative z-10 pb-32">
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const itemsMarkup = nodes.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={getImageLoadingPriority(i)}
                index={i}
              />
            ));

            return (
              <>
                <div className="flex items-center justify-center mb-12">
                  <PreviousLink className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-heading font-bold text-dark-green transition-all duration-300 bg-transparent border-2 border-dark-green hover:text-[#f4f1ea]">
                    <span className="absolute inset-0 w-full h-full bg-dark-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">{isLoading ? 'LOADING...' : 'PREVIOUS PAGE'}</span>
                  </PreviousLink>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {itemsMarkup}
                </div>

                <div className="flex items-center justify-center mt-12">
                  <NextLink className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-heading font-bold text-dark-green transition-all duration-300 bg-transparent border-2 border-dark-green hover:text-[#f4f1ea]">
                    <span className="absolute inset-0 w-full h-full bg-dark-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">{isLoading ? 'LOADING...' : 'NEXT PAGE'}</span>
                  </NextLink>
                </div>
              </>
            );
          }}
        </Pagination>
      </Section>
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
