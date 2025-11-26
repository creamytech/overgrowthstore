import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {FieldHero} from '~/components/home/FieldHero';
import {SpecimenGrid} from '~/components/home/SpecimenGrid';

export const meta: MetaFunction = () => {
  return [{title: 'Overgrowth | The Field Journal'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'frontpage'},
  });

  return defer({
    collections,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <FieldHero />
      
      <Suspense fallback={<div>Loading Specimens...</div>}>
        <Await resolve={data.collections}>
          {(collections) => (
            <SpecimenGrid collections={collections?.nodes || []} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const HOMEPAGE_SEO_QUERY = `#graphql
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 3) {
      nodes {
        id
        title
        handle
        image {
          altText
          url
          width
          height
        }
      }
    }
  }
` as const;
