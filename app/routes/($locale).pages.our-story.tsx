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
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8 overflow-hidden">
      
      {/* Background Texture - Coffee Rings & Dirt */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
         <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full border-[20px] border-rust blur-[2px] mask-grunge transform rotate-45" />
         <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full border-[10px] border-dark-green blur-[1px] mask-grunge" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-24 text-center relative">
            <div className="inline-block relative">
                {/* Stamps */}
                <div className="absolute -top-8 -right-12 border-4 border-rust text-rust px-4 py-1 font-heading text-xl -rotate-12 pointer-events-none uppercase tracking-widest mix-blend-multiply opacity-80 mask-grunge">
                    DECLASSIFIED
                </div>
                
                <h1 className="font-heading text-6xl md:text-8xl text-dark-green mb-4 uppercase tracking-widest relative z-10">
                    Mission Briefing
                </h1>
                <div className="h-1 w-32 bg-rust mx-auto mb-4" />
                <p className="font-typewriter text-sm tracking-[0.3em] text-dark-green/60 uppercase">
                    Subject: The Overgrowth Initiative // Ref: 88-Z
                </p>
            </div>
        </div>

        {/* Content Container */}
        <div className="space-y-32">
            
            {/* Section 1: Philosophy (Left Aligned) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group">
                    <div className="absolute inset-0 bg-dark-green/5 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                    <div className="relative border border-dark-green/20 p-8 bg-[#f4f1ea] shadow-sm transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                        <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-2">
                            01 // The Philosophy
                        </h2>
                        <span className="font-typewriter text-xs text-rust tracking-widest uppercase mb-6 block">
                            Nature Reclaims All
                        </span>
                        <p className="font-body text-dark-green/80 leading-relaxed text-lg mb-4">
                            In a world where concrete meets canopy, <span className="font-bold text-dark-green">Overgrowth</span> represents the inevitable return of nature. We don't just make clothing; we design survival gear for the urban jungle.
                        </p>
                        <p className="font-body text-dark-green/80 leading-relaxed">
                            Our aesthetic is <span className="bg-dark-green text-[#f4f1ea] px-1">"Reclaimed World"</span>—a vision of the future where the artificial and the organic have merged.
                        </p>
                    </div>
                    {/* Decorative Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#e8e5d5] opacity-80 rotate-1 shadow-sm" />
                </div>
                
                {/* Visual/Evidence */}
                <div className="relative md:pl-12">
                    <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden shadow-xl transform rotate-3 hover:rotate-1 transition-transform duration-700">
                         <img src="/assets/hero_horse_skeleton_isolated.png" alt="Evidence A" className="w-full h-full object-contain p-8 mix-blend-multiply filter sepia-[0.3] contrast-125" />
                         <div className="absolute bottom-4 left-4 font-handwritten text-2xl text-rust">Fig. 1A</div>
                    </div>
                </div>
            </section>

            {/* Section 2: Aesthetic (Right Aligned) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Visual/Evidence - Swapped order on desktop */}
                <div className="relative md:pr-12 order-2 md:order-1">
                    <div className="aspect-square bg-[#e8e5d5] relative overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition-transform duration-700 p-4">
                         <div className="w-full h-full border-2 border-dashed border-dark-green/30 flex items-center justify-center">
                            <div className="text-center">
                                <span className="font-heading text-6xl text-dark-green/20 block mb-2">?</span>
                                <span className="font-typewriter text-xs text-dark-green/40 uppercase tracking-widest">Image Missing</span>
                            </div>
                         </div>
                         <div className="absolute top-4 right-4 font-handwritten text-xl text-dark-green rotate-12">Field Notes</div>
                    </div>
                </div>

                <div className="relative group order-1 md:order-2">
                    <div className="absolute inset-0 bg-rust/5 transform rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                    <div className="relative border border-rust/20 p-8 bg-[#f4f1ea] shadow-sm transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                        <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-2">
                            02 // The Aesthetic
                        </h2>
                        <span className="font-typewriter text-xs text-rust tracking-widest uppercase mb-6 block">
                            Form Follows Function
                        </span>
                        <p className="font-body text-dark-green/80 leading-relaxed text-lg mb-6">
                            Every piece is crafted with the utility of workwear and the soul of the wilderness. We use heavy-weight cottons, reinforced stitching, and earth-tone palettes.
                        </p>
                        
                        <div className="space-y-3 font-typewriter text-xs text-dark-green/70">
                            <div className="flex items-center gap-3 group/item cursor-help">
                                <span className="w-4 h-4 border border-rust flex items-center justify-center text-[8px] text-rust group-hover/item:bg-rust group-hover/item:text-[#f4f1ea] transition-colors">A</span>
                                <span className="relative">
                                    <span className="bg-dark-green text-transparent select-none group-hover/item:bg-transparent group-hover/item:text-dark-green transition-all duration-300">REDACTED</span>
                                    <span className="absolute inset-0 group-hover/item:hidden">Tactical Utility</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-3 group/item cursor-help">
                                <span className="w-4 h-4 border border-rust flex items-center justify-center text-[8px] text-rust group-hover/item:bg-rust group-hover/item:text-[#f4f1ea] transition-colors">B</span>
                                <span>Weathered textures that tell a story</span>
                            </div>
                            <div className="flex items-center gap-3 group/item cursor-help">
                                <span className="w-4 h-4 border border-rust flex items-center justify-center text-[8px] text-rust group-hover/item:bg-rust group-hover/item:text-[#f4f1ea] transition-colors">C</span>
                                <span>Silhouettes built for movement</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 3: Sustainability (Centered) */}
            <section className="max-w-3xl mx-auto text-center relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12 bg-dark-green/20" />
                
                <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-4">
                    03 // Sustainability
                </h2>
                <span className="font-typewriter text-xs text-rust tracking-widest uppercase mb-8 block">
                    Leave No Trace
                </span>
                
                <div className="prose prose-lg prose-stone mx-auto">
                    <p className="font-body text-dark-green/80 leading-relaxed">
                        We believe in creating products that last longer than the trends they outlive. Our commitment to sustainability isn't a marketing tactic; it's a <span className="italic text-rust">survival strategy</span>.
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

        </div>

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
