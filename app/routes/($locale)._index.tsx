import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {FieldHero} from '~/components/home/FieldHero';
import {SpecimenGrid} from '~/components/home/SpecimenGrid';
import {FeaturedGrid} from '~/components/home/FeaturedGrid';
import {Link} from '~/components/Link';

export const meta: MetaFunction = () => {
  return [{title: 'Overgrowth | The Field Journal'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections, products} = await storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'frontpage'},
  });

  return defer({
    collections,
    products,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="home">
      <FieldHero />
      
      {/* 2. Featured Grid (Shop First) */}
      <Suspense fallback={<div>Loading Supply Drop...</div>}>
        <Await resolve={data.products}>
          {(products) => (
            <FeaturedGrid products={products?.nodes || []} />
          )}
        </Await>
      </Suspense>

      {/* 3. Brand Story + Lifestyle Image */}
      <section className="py-24 px-4 md:px-12 relative z-10 border-y border-rust/20">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-24">
            
            {/* Lifestyle Image (Placeholder for now, using existing asset or placeholder) */}
            <div className="flex-1 relative group">
                <div className="aspect-[4/5] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                    {/* Using a placeholder or existing asset if available. 
                        Since no specific human shot exists, using a thematic placeholder or re-using an asset creatively.
                        For now, I'll use a placeholder URL or a texture to represent the "Human" element until provided.
                    */}
                    <img 
                        src="/assets/journalmain.jpeg" 
                        alt="Field Journal" 
                        className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply"
                    />
                    <div className="absolute inset-0 bg-dark-green/10 mix-blend-multiply" />
                    
                    {/* HUD Overlay */}
                    <div className="absolute top-4 left-4 border border-dark-green/30 p-2 bg-[#f4f1ea]/80 backdrop-blur-sm">
                        <div className="font-typewriter text-[10px] text-dark-green uppercase tracking-widest">
                            Subj: OPERATIVE 001
                        </div>
                    </div>
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-rust" />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
                <h2 className="font-heading text-4xl md:text-6xl text-dark-green tracking-widest mb-6">
                    Wander.<br/>Discover.<br/>Bloom.
                </h2>
                <div className="w-24 h-1 bg-rust mb-8 mx-auto md:mx-0" />
                <p className="font-body text-dark-green/80 text-lg leading-relaxed mb-8 max-w-lg">
                    Overgrowth is inspired by a world that grew brighter after we stopped shaping it. Creatures returned. Flowers climbed through old metal. Everything became strange in the best way. Our apparel reflects that sense of wonder with designs pulled from a reclaimed frontier full of life.
                </p>
                <Link to="/pages/our-story" className="inline-block bg-dark-green text-[#f4f1ea] px-8 py-3 font-heading tracking-widest hover:bg-rust transition-colors duration-300">
                    Read the Story
                </Link>
            </div>
         </div>
      </section>

      {/* 4. Roots Divider (Visual Break) */}
      {/* This is handled by the footer top or can be a separate section if needed. 
          The previous design had it. Let's keep the flow clean. 
      */}

      {/* 5. Journal / Collections (Specimen Grid moved here as "Archive") */}
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
    products(first: 4) {
      nodes {
        id
        title
        handle
        publishedAt
        variants(first: 1) {
          nodes {
            id
            image {
              url
              altText
              width
              height
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
` as const;
