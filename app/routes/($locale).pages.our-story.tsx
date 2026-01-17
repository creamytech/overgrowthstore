import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Link} from '~/components/Link';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';

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
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO - Full width cinematic */}
      <section className="relative min-h-[70vh] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }} />
        </div>
        
        {/* Corner markers */}
        <div className="absolute top-12 left-12 w-32 h-32 border-l-2 border-t-2 border-[#B55A3C]/40" />
        <div className="absolute bottom-12 right-12 w-32 h-32 border-r-2 border-b-2 border-[#B55A3C]/40" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <span className="font-mono text-[10px] text-[#B55A3C] tracking-[0.5em] uppercase block mb-8">
            Origin Document № 001
          </span>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-[#F2EFE9] tracking-[0.08em] uppercase mb-8">
            The Genesis
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#B55A3C] to-transparent mx-auto mb-8" />
          <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto leading-relaxed">
            Origin coordinates of the Overgrowth movement — where endings become beginnings
          </p>
        </div>
        
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-[#F2EFE9]/30 to-transparent" />
        </div>
      </section>

      {/* CHAPTER I - Philosophy */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1fr,2fr] gap-16 items-start">
            {/* Chapter marker */}
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-16 h-16 bg-[#1a472a] text-[#F2EFE9] flex items-center justify-center font-heading text-2xl">I</span>
                <div>
                  <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-[0.3em] block">Chapter One</span>
                  <span className="font-heading text-xl text-[#1a472a] uppercase">Philosophy</span>
                </div>
              </div>
              
              {/* Visual element */}
              <div className="hidden lg:block aspect-square bg-[#1a472a]/5 border border-[#1a472a]/10 relative mt-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-32 h-32 text-[#1a472a]/10" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeWidth="0.5" d="M12 22V12m0 0c0-4 4-8 8-8-1 4-4 8-8 8m0 0c0-4-4-8-8-8 1 4 4 8 8 8"/>
                  </svg>
                </div>
                <span className="absolute bottom-3 left-3 font-mono text-[8px] text-[#8A8A84]/40 tracking-widest uppercase">
                  Fig. 1
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-8">
              <h2 className="font-heading text-4xl md:text-5xl text-[#1a472a] uppercase tracking-[0.05em] leading-tight">
                The world did not end.<br />
                <span className="text-[#B55A3C]">It grew wild again.</span>
              </h2>
              
              <div className="space-y-6 font-mono text-sm text-[#8A8A84] leading-relaxed">
                <p className="text-lg text-[#1a472a]/70">
                  Cities cracked, concrete split, and the forgotten roots beneath us finally tasted sunlight.
                  Nature returned not as ruin — but as a renaissance.
                </p>
                <p>
                  Overgrowth was born from the belief that every remnant has a second life.
                  A gas station becomes a garden. A skeleton becomes a symbol of what can bloom after loss.
                </p>
                
                {/* Pull quote */}
                <blockquote className="border-l-4 border-[#B55A3C] pl-6 py-4 my-8 bg-[#1a472a]/5">
                  <p className="font-heading text-xl text-[#1a472a] italic">
                    "We do not mourn endings.<br />
                    We document what grows after."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER II - Aesthetic */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[2fr,1fr] gap-16 items-start">
            {/* Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <h2 className="font-heading text-4xl md:text-5xl text-[#F2EFE9] uppercase tracking-[0.05em] leading-tight">
                Where memory and<br />
                <span className="text-[#B55A3C]">moss intertwine.</span>
              </h2>
              
              <div className="space-y-6 font-mono text-sm text-[#F2EFE9]/60 leading-relaxed">
                <p>
                  Steel softened by vines. History becomes habitat.
                  The familiar becomes strange again — and therefore wondrous.
                </p>
                <p>
                  Soft fabrics meet aged textures. Fresh blooms meet weathered landmarks.
                </p>
              </div>
              
              {/* Color palette */}
              <div className="grid grid-cols-4 gap-4 pt-8">
                {[
                  {name: 'Brick', color: '#B55A3C', desc: 'pulse of action'},
                  {name: 'Cream', color: '#F2EFE9', desc: 'paper of recovery'},
                  {name: 'Dark Green', color: '#1a472a', desc: 'weight of truth', dark: true},
                  {name: 'Moss', color: '#3E5F4B', desc: 'life creeping in'},
                ].map((item) => (
                  <div key={item.name} className="text-center">
                    <div 
                      className={`aspect-square mb-3 ${item.dark ? 'border border-[#F2EFE9]/20' : ''}`}
                      style={{backgroundColor: item.color}}
                    />
                    <p className="font-heading text-[10px] text-[#F2EFE9] uppercase tracking-wider">{item.name}</p>
                    <p className="font-mono text-[8px] text-[#F2EFE9]/40 italic">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chapter marker */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-6 lg:justify-end">
                <div className="text-right">
                  <span className="font-mono text-[9px] text-[#F2EFE9]/50 uppercase tracking-[0.3em] block">Chapter Two</span>
                  <span className="font-heading text-xl text-[#F2EFE9] uppercase">Aesthetic</span>
                </div>
                <span className="w-16 h-16 bg-[#B55A3C] text-[#F2EFE9] flex items-center justify-center font-heading text-2xl">II</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER III - Materials */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-12 bg-[#1a472a] text-[#F2EFE9] flex items-center justify-center font-heading text-lg">III</span>
            </div>
            <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-[0.3em] block mb-4">Chapter Three</span>
            <h2 className="font-heading text-4xl md:text-5xl text-[#1a472a] uppercase tracking-[0.05em]">
              Materials We Favor
            </h2>
          </div>
          
          {/* Materials Grid - Bento style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {name: 'Premium Cotton', desc: '240 GSM heavyweight, built to last decades', icon: '◯'},
              {name: 'Limited Runs', desc: 'Small batches only—no mass production', icon: '∞'},
              {name: 'Artisan Craft', desc: 'Each piece reviewed before release', icon: '◇'},
              {name: 'No Reprints', desc: 'Once sold out, archived forever', icon: '△'},
            ].map((item, i) => (
              <div 
                key={item.name} 
                className={`p-8 border border-[#1a472a]/10 bg-[#1a472a]/5 hover:border-[#B55A3C]/50 hover:bg-[#B55A3C]/5 transition-all duration-500 group ${
                  i === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <span className="font-heading text-4xl text-[#1a472a]/20 group-hover:text-[#B55A3C]/30 transition-colors block mb-6">
                  {item.icon}
                </span>
                <h3 className="font-heading text-lg text-[#1a472a] uppercase tracking-wider mb-2">{item.name}</h3>
                <p className="font-mono text-xs text-[#8A8A84] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING - CTA */}
      <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(/assets/texture_archive_paper.jpg)',
            backgroundSize: 'cover',
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-heading text-3xl md:text-5xl text-[#F2EFE9]/80 italic mb-4 leading-tight">
            "The world did not vanish.
          </p>
          <p className="font-heading text-3xl md:text-5xl text-[#B55A3C] italic mb-8">
            It took root."
          </p>
          <p className="font-mono text-[10px] text-[#F2EFE9]/30 uppercase tracking-[0.3em] mb-12">
            — Field Notes: Entry 001
          </p>
          
          <Button asChild className="px-12 py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300">
            <Link to="/products">
              Enter the Archive →
            </Link>
          </Button>
        </div>
      </section>
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
