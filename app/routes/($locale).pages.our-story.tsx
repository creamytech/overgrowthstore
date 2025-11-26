import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'our-story',
      language: context.storefront.i18n.language,
    },
  });

  const seo = page
    ? seoPayload.page({page, url: request.url})
    : {title: 'Our Story | Overgrowth', description: 'The origins of the Overgrowth mission.'};

  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function OurStory() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center relative">
            <div className="inline-block border-2 border-dark-green/20 p-6 bg-[#f4f1ea] relative">
                {/* Stamps */}
                <div className="absolute -top-4 -right-4 border-2 border-rust/30 text-rust/30 p-2 font-heading text-lg -rotate-12 pointer-events-none uppercase tracking-widest bg-[#f4f1ea]">
                    DECLASSIFIED
                </div>
                
                <h1 className="font-heading text-4xl md:text-6xl text-dark-green mb-2 uppercase tracking-widest">
                    Mission Briefing
                </h1>
                <p className="font-body text-xs tracking-[0.3em] text-dark-green/60 uppercase">
                    Subject: The Overgrowth Initiative
                </p>
            </div>
        </div>

        {/* Content Container - File Folder Look */}
        <div className="bg-[#f0ede6] border border-dark-green/10 p-8 md:p-16 shadow-sm relative overflow-hidden">
            
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://cdn.shopify.com/s/files/1/0849/6437/6882/files/topo-pattern.png?v=1732650000')] opacity-5 pointer-events-none" />
            
            <div className="space-y-16 relative z-10">
                
                {/* Section 1: Philosophy */}
                <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start border-b border-dark-green/10 pb-12">
                    <div className="md:text-right">
                        <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">
                            01 // The Philosophy
                        </h2>
                        <span className="font-body text-xs text-rust tracking-widest uppercase mt-2 block">
                            Nature Reclaims All
                        </span>
                    </div>
                    <div className="prose prose-stone max-w-none">
                        <p className="font-body text-dark-green/80 leading-relaxed text-lg">
                            In a world where concrete meets canopy, Overgrowth represents the inevitable return of nature. We don't just make clothing; we design survival gear for the urban jungle, inspired by the resilience of life that thrives in the cracks of civilization.
                        </p>
                        <p className="font-body text-dark-green/80 leading-relaxed mt-4">
                            Our aesthetic is "Reclaimed World"—a vision of the future where the artificial and the organic have merged. It's not about the end of the world; it's about the beginning of a new one.
                        </p>
                    </div>
                </section>

                {/* Section 2: Aesthetic */}
                <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start border-b border-dark-green/10 pb-12">
                    <div className="md:text-right">
                        <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">
                            02 // The Aesthetic
                        </h2>
                        <span className="font-body text-xs text-rust tracking-widest uppercase mt-2 block">
                            Form Follows Function
                        </span>
                    </div>
                    <div className="prose prose-stone max-w-none">
                        <p className="font-body text-dark-green/80 leading-relaxed text-lg">
                            Every piece is crafted with the utility of workwear and the soul of the wilderness. We use heavy-weight cottons, reinforced stitching, and earth-tone palettes derived from moss, rust, and stone.
                        </p>
                        <ul className="list-none space-y-2 mt-4 font-body text-dark-green/70 pl-0">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-rust mr-3 rounded-full"></span>
                                Tactical utility for everyday exploration
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-rust mr-3 rounded-full"></span>
                                Weathered textures that tell a story
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-rust mr-3 rounded-full"></span>
                                Silhouettes built for movement
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 3: Sustainability */}
                <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                    <div className="md:text-right">
                        <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">
                            03 // Sustainability
                        </h2>
                        <span className="font-body text-xs text-rust tracking-widest uppercase mt-2 block">
                            Leave No Trace
                        </span>
                    </div>
                    <div className="prose prose-stone max-w-none">
                        <p className="font-body text-dark-green/80 leading-relaxed text-lg">
                            We believe in creating products that last longer than the trends they outlive. Our commitment to sustainability isn't a marketing tactic; it's a survival strategy.
                        </p>
                        <p className="font-body text-dark-green/80 leading-relaxed mt-4">
                            We source organic cottons and recycled materials wherever possible, minimizing our footprint so the real overgrowth can continue to thrive.
                        </p>
                    </div>
                </section>

            </div>

            {/* Footer Signature */}
            <div className="mt-16 pt-8 border-t border-dark-green/20 flex justify-between items-end">
                <div>
                    <p className="font-body text-xs tracking-widest uppercase text-dark-green/50">
                        Authorized By
                    </p>
                    <div className="font-heading text-xl text-dark-green mt-2 font-bold italic">
                        The Director
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-body text-xs tracking-widest uppercase text-dark-green/50">
                        Date
                    </p>
                    <p className="font-body text-sm text-dark-green mt-1">
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

        </div>
        
        {/* Paper Stack Effect */}
        <div className="absolute top-4 left-4 w-full h-full border border-dark-green/5 bg-[#f4f1ea] -z-10" />
        <div className="absolute top-8 left-8 w-full h-full border border-dark-green/5 bg-[#f4f1ea] -z-20" />

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
