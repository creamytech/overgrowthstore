import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Icon} from '@iconify/react';
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
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />

      {/* Standard Header */}
      <div className="relative z-10 pt-40 pb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
            <div className="w-2 h-2 border border-rust rotate-45" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
          </div>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          Our Story
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
          How it all began
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Content - Specimen Card Layout */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Chapter 1 - Philosophy */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading">1</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">The Philosophy</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
                <p className="font-body text-dark-green/80 leading-relaxed mb-4">
                  The world didn't end. It grew back in ways no one expected.
                </p>
                <p className="font-body text-dark-green/80 leading-relaxed mb-4">
                  Overgrowth began with a simple observation: beauty returns, even in the strangest places. 
                  We create apparel that celebrates nature's quiet return.
                </p>
                <p className="font-body text-dark-green/80 leading-relaxed">
                  Every garment is a small artifact from the frontier that grew after us.
                </p>
              </div>
              
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8 flex items-center justify-center">
                <div className="text-center">
                  <Icon icon="ph:quotes" className="w-10 h-10 text-rust/40 mx-auto mb-4" />
                  <p className="font-handwritten text-2xl text-dark-green/70 italic">
                    "We don't chase trends. We chase the feeling of discovering something forgotten."
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 2 - Aesthetic */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-rust text-[#f4f1ea] flex items-center justify-center font-heading">2</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">The Aesthetic</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
              <p className="font-body text-dark-green/80 leading-relaxed mb-6">
                Our designs blend bones and blooms, neon remnants and wild growth. A horse made of branches might wander the road. A gas station might bloom with fresh flowers. Light seeps through vines and turns everything warm again.
              </p>
              
              {/* Color Palette */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                {[
                  { color: '#1a472a', name: 'Forest' },
                  { color: '#c05a34', name: 'Rust' },
                  { color: '#f4f1ea', name: 'Paper' },
                  { color: '#8b7355', name: 'Earth' },
                ].map((swatch, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className="w-full aspect-square mb-2 border border-dark-green/20"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span className="font-body text-xs text-dark-green/60">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Chapter 3 - Materials */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading">3</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">Materials We Love</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: 'ph:leaf', label: 'Organic', desc: 'Gentle softness' },
                { icon: 'ph:recycle', label: 'Recycled', desc: 'New life' },
                { icon: 'ph:shield-check', label: 'Durable', desc: 'Built to last' },
                { icon: 'ph:heart', label: 'Ethical', desc: 'Fair always' },
              ].map((item, i) => (
                <div key={i} className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                  <Icon icon={item.icon} className="w-8 h-8 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" />
                  <h3 className="font-heading text-sm text-dark-green mb-1">{item.label}</h3>
                  <p className="font-body text-xs text-dark-green/50">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Quote */}
          <div className="text-center pt-12 border-t border-dark-green/20">
            <p className="font-handwritten text-2xl text-dark-green/60 italic mb-4">
              "The world did not end. It took back over."
            </p>
            <p className="font-body text-xs text-dark-green/40 uppercase tracking-widest">Growing since 2024</p>
            
            <Link 
              to="/collections"
              className="inline-flex items-center gap-2 mt-8 bg-dark-green text-[#f4f1ea] px-8 py-4 font-heading tracking-widest hover:bg-rust transition-colors"
            >
              <span>Browse Recovered Works</span>
              <Icon icon="ph:arrow-right" className="w-4 h-4" />
            </Link>
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
