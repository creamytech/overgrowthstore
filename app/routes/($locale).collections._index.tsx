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
       <div className="relative z-10 pt-40 pb-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
                <div className="w-2 h-2 border border-rust rotate-45" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
              </div>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4">
                COLLECTIONS
            </h1>
            <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
                Recovered works, organized by origin
            </p>
            <div className="w-24 h-1 bg-rust mx-auto mt-8" />
       </div>

      <Section className="relative z-10 px-4 md:px-12 pb-32">
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="flex items-center justify-center mb-6">
                <Button as={PreviousLink} variant="secondary" width="full">
                  {isLoading ? 'Growing...' : '← More Gardens'}
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
              <div className="flex items-center justify-center mt-12">
                <Button as={NextLink} variant="secondary" width="full">
                  {isLoading ? 'Loading...' : 'View More Collections'}
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
        <div className="bg-[#f9f7f3] h-full border border-dark-green/15 flex flex-col transition-all duration-500 group-hover:border-rust/40 group-hover:shadow-xl group-hover:shadow-rust/5 relative overflow-hidden">
            
            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-dark-green/20 group-hover:border-rust/50 group-hover:w-8 group-hover:h-8 transition-all duration-300" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-dark-green/20 group-hover:border-rust/50 group-hover:w-8 group-hover:h-8 transition-all duration-300" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-dark-green/20 group-hover:border-rust/50 group-hover:w-8 group-hover:h-8 transition-all duration-300" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-dark-green/20 group-hover:border-rust/50 group-hover:w-8 group-hover:h-8 transition-all duration-300" />

            {/* Image with overlay effects */}
            <div className="aspect-[4/3] overflow-hidden relative">
                 {/* Gradient overlay */}
                 <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#f9f7f3] via-transparent to-transparent opacity-60" />
                 
                 {/* Texture */}
                 <div className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-10 bg-[url('/assets/texture_archive_paper.jpg')]" />
                 
                {collection?.image && (
                  <Image
                    data={collection.image}
                    aspectRatio="4/3"
                    sizes="(min-width: 45em) 50vw, 100vw"
                    width={800}
                    loading={loading}
                    className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 filter contrast-105"
                  />
                )}
                
                {/* Collection number badge */}
                <div className="absolute top-4 left-4 z-20 bg-[#f9f7f3]/90 backdrop-blur-sm border border-dark-green/20 px-3 py-1">
                  <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/70">
                    Collection {index !== undefined ? String(index + 1).padStart(2, '0') : '01'}
                  </span>
                </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-2xl text-dark-green mb-2 leading-tight group-hover:text-rust transition-colors duration-300 uppercase tracking-wide">
                    {collection.title}
                </h3>
                
                {collection.description && (
                  <p className="font-body text-sm text-dark-green/50 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                
                {/* Footer with animated arrow */}
                <div className="mt-auto pt-4 border-t border-dark-green/10 flex justify-between items-center">
                    <span className="font-body text-xs text-dark-green/40 uppercase tracking-widest">
                      View Works
                    </span>
                    <div className="w-8 h-8 border border-dark-green/20 flex items-center justify-center group-hover:border-rust group-hover:bg-rust transition-all duration-300">
                      <span className="text-dark-green/50 group-hover:text-white transition-colors">→</span>
                    </div>
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
