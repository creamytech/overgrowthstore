import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {DropHero} from '~/components/home/DropHero';
import {LatestDrops} from '~/components/home/LatestDrops';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export const meta: MetaFunction = () => {
  return [{title: 'Overgrowth | Streetwear'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  const featuredProducts = storefront.query(FEATURED_PRODUCTS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    featuredProducts,
  });
}

export default function Homepage() {
  const {featuredProducts} = useLoaderData<typeof loader>();
  
  return (
    <div className="home">
      <DropHero />
      
      {/* Latest Drops Section */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <Await resolve={featuredProducts}>
          {(data) => (
            <LatestDrops 
              products={data?.products?.nodes || []} 
              title="Latest Drops"
            />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-24 px-4 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-muted animate-pulse mx-auto rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
