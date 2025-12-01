import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';
import {
  Image,
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';

import {Grid} from '~/components/Grid';
import {Heading, PageHeader, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';


const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json({collections, seo});
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
       {/* Texture Overlay */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />
       
       {/* Header */}
       <div className="relative z-10 pt-32 pb-12 text-center">
            <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2">
                ARCHIVE INDEX
            </h1>
            <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
                <span>COLLECTION LOGS</span>
            </div>
            <div className="w-24 h-1 bg-rust mx-auto mt-6" />
       </div>

      <Section className="relative z-10 px-4 md:px-12 pb-32">
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="flex items-center justify-center mb-6">
                <Button as={PreviousLink} variant="secondary" width="full">
                  {isLoading ? 'Loading...' : 'Previous collections'}
                </Button>
              </div>
              <Grid
                items={nodes.length === 3 ? 3 : 2}
                data-test="collection-grid"
              >
                {nodes.map((collection, i) => (
                  <CollectionCard
                    collection={collection as Collection}
                    key={collection.id}
                    loading={getImageLoadingPriority(i, 2)}
                    index={i}
                  />
                ))}
              </Grid>
              <div className="flex items-center justify-center mt-6">
                <Button as={NextLink} variant="secondary" width="full">
                  {isLoading ? 'Loading...' : 'Next collections'}
                </Button>
              </div>
            </>
          )}
        </Pagination>
      </Section>
    </div>
  );
}

function CollectionCard({
  collection,
  loading,
  index,
}: {
  collection: Collection;
  loading?: HTMLImageElement['loading'];
  index?: number;
}) {
  return (
    <Link
      prefetch="viewport"
      to={`/collections/${collection.handle}`}
      className="block h-full group"
    >
        <div className="bg-[#f4f1ea] h-full border border-dark-green/20 p-6 flex flex-col transition-all duration-300 group-hover:border-dark-green/50 group-hover:shadow-lg relative overflow-hidden">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-dark-green/30" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dark-green/30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dark-green/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-dark-green/30" />

            {/* ID Stamp */}
            <div className="mb-4 border-b border-dark-green/10 pb-2 flex justify-between items-center">
                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                    SECTOR #{index !== undefined ? index + 1 : '00'}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                    STATUS: ACTIVE
                </span>
            </div>

            <div className="aspect-[3/2] overflow-hidden mb-6 border border-dark-green/10 relative">
                 {/* Texture Overlay */}
                 <div className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-20 bg-[url('/assets/texture_archive_paper.jpg')]" />
                 
                {collection?.image && (
                  <Image
                    data={collection.image}
                    aspectRatio="6/4"
                    sizes="(min-width: 45em) 50vw, 100vw"
                    width={800}
                    loading={loading}
                    className="object-cover w-full h-full mix-blend-multiply filter contrast-110 sepia-[0.2] transition-transform duration-700 group-hover:scale-105"
                  />
                )}
            </div>
            
            <div className="mt-auto">
                <h3 className="font-heading text-2xl text-dark-green mb-3 leading-tight group-hover:text-rust transition-colors uppercase">
                    {collection.title}
                </h3>
                <div className="w-full h-px bg-dark-green/10 mt-4 group-hover:bg-rust/30 transition-colors" />
                <div className="mt-4 flex justify-end">
                    <span className="font-body text-xs text-rust tracking-widest uppercase group-hover:translate-x-1 transition-transform">
                        Access Sector &rarr;
                    </span>
                </div>
            </div>
        </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
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
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
