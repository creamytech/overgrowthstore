import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Icons} from '~/components/InlineIcons';
import {Link} from '~/components/Link';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
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
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header - "The Genesis" */}
      <div className="relative z-10 pt-40 pb-16 text-center px-4">
        <p className="font-body text-xs text-rust uppercase tracking-[0.3em] mb-4">Classified Document</p>
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          The Genesis
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto mb-2">
          Origin coordinates of the Overgrowth movement
        </p>
        <p className="font-body text-dark-green/40 text-sm italic max-w-sm mx-auto">
          Declassified from the frontier archives.
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Vine Timeline Container */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-6xl mx-auto relative">

          {/* Chapters Container - Contains vine and all chapters */}
          <div className="relative">
            {/* Central Vine SVG - Absolute positioned, contained within chapters */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 2 1000" preserveAspectRatio="none">
              <path 
                d="M1 0 Q0 100 1 200 Q2 300 1 400 Q0 500 1 600 Q2 700 1 800 Q0 900 1 1000" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                className="text-dark-green/20"
              />
              {/* Leaf nodes along the vine */}
              <circle cx="1" cy="150" r="4" className="fill-rust/40" />
              <circle cx="1" cy="400" r="4" className="fill-rust/40" />
              <circle cx="1" cy="650" r="4" className="fill-rust/40" />
              <circle cx="1" cy="900" r="4" className="fill-rust/40" />
            </svg>
          </div>

          {/* Chapter 1 - Philosophy (Text Left, Image Right) */}
          <section className="mb-24 relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left: Text */}
              <div className="md:pr-8 order-2 md:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading text-sm">I</span>
                  <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Origin</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-dark-green uppercase tracking-wider mb-6">The Philosophy</h2>
                
                <div className="space-y-4 font-body text-dark-green/80 leading-relaxed">
                  <p>The world did not end. <span className="redacted-text">It grew wild again.</span></p>
                  <p>
                    Cities cracked, concrete split, and the forgotten roots beneath us finally tasted sunlight. 
                    Nature returned not as ruin — but as a <span className="redacted-text">renaissance</span>.
                  </p>
                  <p>
                    Overgrowth was born from the belief that every remnant has a second life. 
                    A gas station becomes a garden. A skeleton becomes a symbol of what can bloom after loss.
                  </p>
                  <p className="font-medium border-l-2 border-rust pl-4 mt-6">
                    We do not mourn endings.<br />
                    We document what grows after.
                  </p>
                </div>
              </div>
              
              {/* Right: Image placeholder - would be a ruin photo */}
              <div className="order-1 md:order-2 md:pl-8">
                <div className="aspect-[4/5] bg-[#f9f7f3] border border-dark-green/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-dark-green/5 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Iconify inline SVG - Botanical sketch style */}
                    <svg className="w-24 h-24 text-dark-green/20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                  </div>
                  <p className="absolute bottom-4 left-4 font-body text-[10px] text-dark-green/40 uppercase tracking-widest">
                    Fig. 1 — The Ruin That Bloomed
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 2 - Aesthetic (Image Left, Text Right) */}
          <section className="mb-24 relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Left: Color Palette as Macro Photos */}
              <div className="md:pr-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Moss = Forest Green */}
                  <div className="group cursor-default">
                    <div className="aspect-square bg-[#1a472a] relative overflow-hidden border border-dark-green/20">
                      {/* Simulated macro texture overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }} />
                    </div>
                    <p className="font-heading text-sm text-dark-green mt-2">Moss</p>
                    <p className="font-body text-xs text-dark-green/50 italic">the pulse of everything returning</p>
                  </div>
                  
                  {/* Oxidized Iron = Rust */}
                  <div className="group cursor-default">
                    <div className="aspect-square bg-[#c05a34] relative overflow-hidden border border-dark-green/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                      <div className="absolute inset-0 opacity-40" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }} />
                    </div>
                    <p className="font-heading text-sm text-dark-green mt-2">Oxidized Iron</p>
                    <p className="font-body text-xs text-dark-green/50 italic">the memory of what was left behind</p>
                  </div>
                  
                  {/* Sun-bleached Paper = Bone */}
                  <div className="group cursor-default">
                    <div className="aspect-square bg-[#f5f2eb] relative overflow-hidden border border-dark-green/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-dark-green/5 to-transparent" />
                      <div className="absolute inset-0 bg-[url('/assets/texture_archive_paper.jpg')] bg-cover opacity-30" />
                    </div>
                    <p className="font-heading text-sm text-dark-green mt-2">Sun-bleached Paper</p>
                    <p className="font-body text-xs text-dark-green/50 italic">the survivors reborn</p>
                  </div>
                  
                  {/* Earth */}
                  <div className="group cursor-default">
                    <div className="aspect-square bg-[#8b7355] relative overflow-hidden border border-dark-green/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                      <div className="absolute inset-0 opacity-25" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }} />
                    </div>
                    <p className="font-heading text-sm text-dark-green mt-2">Cracked Earth</p>
                    <p className="font-body text-xs text-dark-green/50 italic">the foundation of the new world</p>
                  </div>
                </div>
                <p className="font-body text-xs text-dark-green/40 mt-4 text-center italic">
                  Colors extracted from environmental evidence.
                </p>
              </div>
              
              {/* Right: Text */}
              <div className="md:pl-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-rust text-[#f4f1ea] flex items-center justify-center font-heading text-sm">II</span>
                  <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Visual Evidence</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-dark-green uppercase tracking-wider mb-6">The Aesthetic</h2>
                
                <div className="space-y-4 font-body text-dark-green/80 leading-relaxed">
                  <p>
                    Our world lives where memory and moss intertwine.<br />
                    Where steel is softened by vines.<br />
                    Where history becomes <span className="redacted-text">habitat</span>.
                  </p>
                  <p>
                    Soft fabrics meet aged textures. Fresh blooms meet weathered landmarks.
                    The familiar becomes strange again — and therefore <span className="redacted-text">wondrous</span>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 3 - Materials (Text Left, Icons Right) */}
          <section className="mb-24 relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              {/* Left: Text */}
              <div className="md:pr-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading text-sm">III</span>
                  <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Field Gear Standards</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl text-dark-green uppercase tracking-wider mb-6">Materials We Favor</h2>
                
                <p className="font-body text-dark-green/80 leading-relaxed mb-6">
                  We choose materials like explorers choose the keepsakes they carry:
                </p>
                
                <p className="font-body text-dark-green/70 leading-relaxed">
                  Every Overgrowth piece is made to last the journey and age beautifully — 
                  much like the world that inspired it.
                </p>
              </div>
              
              {/* Right: Botanical Sketch Icons */}
              <div className="md:pl-8">
                <div className="grid grid-cols-2 gap-4">
                  {/* Organic Cotton - Iconify Sapling */}
                  <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                    <svg className="w-12 h-12 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 22V12m0 0c0-3.5 3-6 6-6c0 3.5-3 6-6 6m0 0c0-3.5-3-6-6-6c0 3.5 3 6 6 6"/>
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 22c-2 0-4-1-4-4"/>
                    </svg>
                    <h3 className="font-heading text-sm text-dark-green mb-1">Organic Cotton</h3>
                    <p className="font-body text-xs text-dark-green/50 italic">gentle on skin, gentle on the world</p>
                  </div>
                  
                  {/* Recycled Fibers - Iconify Recycle/Loop */}
                  <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                    <svg className="w-12 h-12 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 2a5 5 0 0 1 5 5v6m0 0l-3-3m3 3l3-3M12 22a5 5 0 0 1-5-5v-6m0 0l3 3m-3-3l-3 3"/>
                    </svg>
                    <h3 className="font-heading text-sm text-dark-green mb-1">Recycled Fibers</h3>
                    <p className="font-body text-xs text-dark-green/50 italic">remnants reborn and re-imagined</p>
                  </div>
                  
                  {/* Durable Weaves - Iconify Shield Outline */}
                  <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                    <svg className="w-12 h-12 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5.25-3.5 9.5-7 11c-3.5-1.5-7-5.75-7-11V7z"/>
                    </svg>
                    <h3 className="font-heading text-sm text-dark-green mb-1">Durable Weaves</h3>
                    <p className="font-body text-xs text-dark-green/50 italic">garments meant to wander</p>
                  </div>
                  
                  {/* Ethical Production - Iconify Compass */}
                  <div className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                    <svg className="w-12 h-12 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                      <path fill="currentColor" d="M12 2v3m0 14v3M2 12h3m14 0h3"/>
                      <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M16.24 7.76l-4.24 4.24l-4.24-4.24"/>
                    </svg>
                    <h3 className="font-heading text-sm text-dark-green mb-1">Ethical Production</h3>
                    <p className="font-body text-xs text-dark-green/50 italic">a new world deserves better care</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
          {/* End Chapters Container */}

          {/* Footer Quote & CTA - Outside vine container */}
          <div className="text-center pt-16 mt-8 border-t border-rust relative">
            <Icons.Quote className="w-8 h-8 text-rust/30 mx-auto mb-6" />
            <p className="font-handwritten text-2xl md:text-3xl text-dark-green/70 italic mb-2">
              "The world did not vanish.
            </p>
            <p className="font-handwritten text-2xl md:text-3xl text-dark-green/70 italic mb-4">
              It took root."
            </p>
            <p className="font-body text-xs text-dark-green/40 uppercase tracking-widest mb-10">
              — Field Notes: Entry 001
            </p>
            
            <Link 
              to="/products"
              className="inline-flex items-center gap-3 bg-dark-green text-[#f4f1ea] px-8 py-4 font-heading tracking-widest hover:bg-rust transition-colors"
            >
              <span>ENTER THE RUINS</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
            <p className="font-body text-xs text-dark-green/40 mt-4 italic">
              Artifacts from the frontier, ready for their next adventure.
            </p>
          </div>
        </div>
      </div>

      {/* Redacted Text Styles - Add to app.css or inline */}
      <style>{`
        .redacted-text {
          position: relative;
          cursor: pointer;
        }
        .redacted-text::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #1a472a;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .redacted-text:hover::before {
          opacity: 0;
          transform: scaleX(0);
        }
      `}</style>
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
