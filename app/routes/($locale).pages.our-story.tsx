import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';


export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'our-story',
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});
  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function OurStory() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 relative overflow-hidden">
        {/* Texture Overlay - Removed to use global */}
        {/* <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" /> */}
        
        <div className="max-w-4xl mx-auto relative z-10">
            {/* Header - Standardized */}
            <div className="mb-16 text-center">
                <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2 uppercase">
                    Mission Briefing
                </h1>
                <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
                    <span>Subject: The Overgrowth Initiative</span>
                </div>
                <div className="w-24 h-1 bg-rust mx-auto mt-6" />
                
                <div className="font-typewriter text-sm tracking-[0.3em] text-dark-green/60 uppercase mt-4">
                    <span>Ref: 88-Z</span>
                </div>
            </div>

            {/* Content Sections */}
            <section className="mb-16">
                 <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-6 border-b border-dark-green/20 pb-2">
                    01 // The Philosophy
                </h2>
                <div className="prose prose-stone font-body text-lg leading-relaxed text-dark-green/80 text-justify">
                    <p>
                        We believe in creating products that last longer than the trends they outlive. Our commitment to sustainability isn't a marketing tactic; it's a survival strategy.
                    </p>
                </div>
            </section>

            <section className="mb-16">
                 <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-6 border-b border-dark-green/20 pb-2">
                    02 // The Aesthetic
                </h2>
                <div className="prose prose-stone font-body text-lg leading-relaxed text-dark-green/80 text-justify">
                    <p>
                        Inspired by the resilience of nature reclaiming the built environment. Our design language speaks in textures of decay, growth, and persistence. Every garment is a field note from a world after.
                    </p>
                </div>
            </section>

            <section className="mb-16">
                 <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-6 border-b border-dark-green/20 pb-2">
                    03 // Sustainability
                </h2>
                <div className="prose prose-stone font-body text-lg leading-relaxed text-dark-green/80 text-justify">
                    <p>
                        We utilize 100% organic cotton and recycled fibers. Our supply chain is as transparent as our intentions. We don't just minimize our footprint; we plant seeds in it.
                    </p>
                </div>
                
                 <div className="mt-12 flex justify-center gap-8 opacity-60">
                     <div className="w-16 h-16 border-2 border-dark-green rounded-full flex items-center justify-center">
                        <span className="font-heading text-xs text-dark-green text-center leading-none">100%<br/>ORG</span>
                     </div>
                     <div className="w-16 h-16 border-2 border-dark-green rounded-full flex items-center justify-center">
                        <span className="font-heading text-xs text-dark-green text-center leading-none">RE<br/>CYC</span>
                     </div>
                </div>
            </section>
            
            {/* Footer Signature */}
            <div className="mt-32 pt-12 border-t-2 border-dashed border-dark-green/20 flex justify-between items-end max-w-2xl mx-auto">
                <div>
                    <p className="font-typewriter text-xs tracking-widest uppercase text-dark-green/50 mb-2">
                        Authorized By
                    </p>
                    <div className="font-handwritten text-3xl text-dark-green -rotate-6">
                        The Director
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-typewriter text-xs tracking-widest uppercase text-dark-green/50 mb-2">
                        Timestamp
                    </p>
                    <p className="font-typewriter text-sm text-dark-green">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  ) @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
