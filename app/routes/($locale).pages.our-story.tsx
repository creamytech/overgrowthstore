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
            Est. 2024
          </span>
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-[#F2EFE9] tracking-[0.08em] uppercase mb-8">
            Our Story
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#B55A3C] to-transparent mx-auto mb-8" />
          <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto leading-relaxed">
            Limited edition streetwear for those who value quality over quantity
          </p>
        </div>
        
        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-[#F2EFE9]/30 to-transparent" />
        </div>
      </section>

      {/* CHAPTER I - The Beginning */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1fr,2fr] gap-16 items-start">
            {/* Chapter marker */}
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-16 h-16 bg-[#1a472a] text-[#F2EFE9] flex items-center justify-center font-heading text-2xl">I</span>
                <div>
                  <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-[0.3em] block">Chapter One</span>
                  <span className="font-heading text-xl text-[#1a472a] uppercase">The Beginning</span>
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
                Born from a simple<br />
                <span className="text-[#B55A3C]">frustration.</span>
              </h2>
              
              <div className="space-y-6 font-mono text-sm text-[#8A8A84] leading-relaxed">
                <p className="text-lg text-[#1a472a]/70">
                  We got tired of seeing the same mass-produced pieces everywhere. 
                  The same fits. The same graphics. The same lack of intention.
                </p>
                <p>
                  Overgrowth started as an experiment: what if we made pieces we actually wanted to wear? 
                  What if we prioritized quality over scale, and authenticity over trends?
                </p>
                
                {/* Pull quote */}
                <blockquote className="border-l-4 border-[#B55A3C] pl-6 py-4 my-8 bg-[#1a472a]/5">
                  <p className="font-heading text-xl text-[#1a472a] italic">
                    "We don't chase trends.<br />
                    We build pieces that outlast them."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER II - The Philosophy */}
      <section className="py-24 md:py-32 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[2fr,1fr] gap-16 items-start">
            {/* Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <h2 className="font-heading text-4xl md:text-5xl text-[#F2EFE9] uppercase tracking-[0.05em] leading-tight">
                Scarcity is<br />
                <span className="text-[#B55A3C]">intentional.</span>
              </h2>
              
              <div className="space-y-6 font-mono text-sm text-[#F2EFE9]/60 leading-relaxed">
                <p>
                  Every piece we release is limited. Not for hype—for purpose. 
                  Small batches mean we can obsess over every detail without compromise.
                </p>
                <p>
                  When something sells out, it's archived forever. No restocks. No reprints. 
                  What you own is genuinely one of a kind.
                </p>
              </div>
              
              {/* Color palette */}
              <div className="grid grid-cols-4 gap-4 pt-8">
                {[
                  {name: 'Brick', color: '#B55A3C', desc: 'energy & action'},
                  {name: 'Cream', color: '#F2EFE9', desc: 'clean & timeless'},
                  {name: 'Dark Green', color: '#1a472a', desc: 'growth & depth', dark: true},
                  {name: 'Moss', color: '#3E5F4B', desc: 'nature & calm'},
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
                  <span className="font-heading text-xl text-[#F2EFE9] uppercase">Philosophy</span>
                </div>
                <span className="w-16 h-16 bg-[#B55A3C] text-[#F2EFE9] flex items-center justify-center font-heading text-2xl">II</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER III - The Craft */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="w-12 h-12 bg-[#1a472a] text-[#F2EFE9] flex items-center justify-center font-heading text-lg">III</span>
            </div>
            <span className="font-mono text-[9px] text-[#8A8A84] uppercase tracking-[0.3em] block mb-4">Chapter Three</span>
            <h2 className="font-heading text-4xl md:text-5xl text-[#1a472a] uppercase tracking-[0.05em]">
              What We Believe
            </h2>
          </div>
          
          {/* Values Grid - Bento style */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {name: 'Premium Quality', desc: 'Heavyweight cotton that actually lasts', icon: '◯'},
              {name: 'Limited Runs', desc: 'Small batches only—no mass production', icon: '∞'},
              {name: 'Artisan Craft', desc: 'Every piece reviewed before it ships', icon: '◇'},
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
            "Quality over quantity.
          </p>
          <p className="font-heading text-3xl md:text-5xl text-[#B55A3C] italic mb-8">
            Always."
          </p>
          <p className="font-mono text-[10px] text-[#F2EFE9]/30 uppercase tracking-[0.3em] mb-12">
            — The Overgrowth Team
          </p>
          
          <Button asChild className="px-12 py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300">
            <Link to="/products">
              Shop the Collection →
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
