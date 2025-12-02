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
                    <span>Ref. 07.14</span>
                </div>
            </div>

            {/* Content Sections */}
            <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                     <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-6 border-b border-dark-green/20 pb-2">
                        01 // The Philosophy
                    </h2>
                    <div className="prose prose-stone font-body text-lg leading-relaxed text-dark-green/80 text-justify">
                        <p className="mb-4">
                            Overgrowth began with a simple idea. The world did not end. It grew back in ways no one expected.
                        </p>
                        <p className="mb-4">
                            We believe in creating apparel that celebrates that strange and beautiful return. Soft fabrics. Living colors. Stories woven from a world reclaimed by nature and imagination.
                        </p>
                        <p>
                            Our goal is not to chase trends. It is to build pieces that feel alive, personal, and full of character. Every garment is a small artifact from the frontier that grew after us.
                        </p>
                    </div>
                </div>
                {/* Founder / Operative Section */}
                <div className="order-1 md:order-2 relative group">
                    <div className="aspect-[3/4] bg-dark-green/5 border border-dark-green/20 relative overflow-hidden">
                         <img 
                            src="/assets/hero_horse_skeleton_isolated.png" 
                            alt="The Operative" 
                            className="w-full h-full object-cover mix-blend-multiply opacity-80 filter grayscale contrast-125"
                        />
                        {/* Classified Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="border-4 border-rust/50 p-4 transform -rotate-12 bg-[#f4f1ea]/90 backdrop-blur-sm">
                                <span className="font-heading text-4xl text-rust tracking-widest uppercase">
                                    Classified
                                </span>
                            </div>
                        </div>
                        {/* HUD Elements */}
                        <div className="absolute top-2 left-2 font-mono text-[10px] text-dark-green/60">
                            SUBJ: OPERATIVE 001
                        </div>
                        <div className="absolute bottom-2 right-2 font-mono text-[10px] text-dark-green/60">
                            STATUS: ACTIVE
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-24">
                 <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-6 border-b border-dark-green/20 pb-2">
                    02 // The Aesthetic
                </h2>
                <div className="prose prose-stone font-body text-lg leading-relaxed text-dark-green/80 text-justify max-w-2xl">
                    <p className="mb-4">
                        Inspired by the quiet power of nature reclaiming forgotten places, our artwork mixes bones, blooms, neon remnants, and wild shapes.
                    </p>
                    <p className="mb-4">
                        The Overgrowth world is playful and surreal. A horse made of branches might wander the road. A gas station might bloom with fresh flowers. Light seeps through vines and turns old metal warm again.
                    </p>
                    <p>
                        This is the visual language that shapes every Overgrowth design. Colorful. Dreamlike. Rooted in the idea that beauty returns even in the strangest places.
                    </p>
                </div>
            </section>

            <section className="mb-16">
                 <h2 className="font-heading text-4xl text-dark-green uppercase tracking-wider mb-12 border-b border-dark-green/20 pb-2">
                    03 // MATERIALS OF CHOICE
                </h2>
                
                {/* Technical Specs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Spec 1 */}
                    <div className="border border-dark-green/20 p-6 flex flex-col items-center text-center hover:border-rust transition-colors group">
                        <div className="w-12 h-12 mb-4 border border-dark-green/30 rounded-full flex items-center justify-center group-hover:border-rust group-hover:text-rust transition-colors">
                            <span className="font-heading text-xl">O</span>
                        </div>
                        <h3 className="font-heading text-sm text-dark-green tracking-widest mb-2">Organic</h3>
                        <p className="font-mono text-[10px] text-dark-green/60 uppercase">
                            Everyday comfort with gentle softness
                        </p>
                    </div>

                    {/* Spec 2 */}
                    <div className="border border-dark-green/20 p-6 flex flex-col items-center text-center hover:border-rust transition-colors group">
                        <div className="w-12 h-12 mb-4 border border-dark-green/30 rounded-full flex items-center justify-center group-hover:border-rust group-hover:text-rust transition-colors">
                            <span className="font-heading text-xl">R</span>
                        </div>
                        <h3 className="font-heading text-sm text-dark-green tracking-widest mb-2">Recycled</h3>
                        <p className="font-mono text-[10px] text-dark-green/60 uppercase">
                            Fibers sourced with care for the world around us
                        </p>
                    </div>

                    {/* Spec 3 */}
                    <div className="border border-dark-green/20 p-6 flex flex-col items-center text-center hover:border-rust transition-colors group">
                        <div className="w-12 h-12 mb-4 border border-dark-green/30 rounded-full flex items-center justify-center group-hover:border-rust group-hover:text-rust transition-colors">
                            <span className="font-heading text-xl">D</span>
                        </div>
                        <h3 className="font-heading text-sm text-dark-green tracking-widest mb-2">Durable</h3>
                        <p className="font-mono text-[10px] text-dark-green/60 uppercase">
                            Made to last through daily wanderings and long adventures
                        </p>
                    </div>

                    {/* Spec 4 */}
                    <div className="border border-dark-green/20 p-6 flex flex-col items-center text-center hover:border-rust transition-colors group">
                        <div className="w-12 h-12 mb-4 border border-dark-green/30 rounded-full flex items-center justify-center group-hover:border-rust group-hover:text-rust transition-colors">
                            <span className="font-heading text-xl">E</span>
                        </div>
                        <h3 className="font-heading text-sm text-dark-green tracking-widest mb-2">Ethical</h3>
                        <p className="font-mono text-[10px] text-dark-green/60 uppercase">
                            Fair production and responsible partnerships
                        </p>
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
                        12.24.2043
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
