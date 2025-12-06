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
      {/* Standard Header */}
      <div className="relative z-10 pt-40 pb-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
            <div className="w-2 h-2 border border-rust rotate-45" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
          </div>
        </div>
        <p className="font-body text-xs text-rust uppercase tracking-[0.3em] mb-4">Field Notes</p>
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          Our Story
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto mb-2">
          How it all began
        </p>
        <p className="font-body text-dark-green/40 text-sm italic max-w-sm mx-auto">
          Recorded from the quiet places.<br />Compiled by explorers returned.
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          
          {/* Chapter 1 - Philosophy */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Origin</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading text-lg">1</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">The Philosophy</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8 space-y-6">
                <p className="font-body text-dark-green/80 leading-relaxed">
                  The world did not end. It grew wild again.
                </p>
                <p className="font-body text-dark-green/80 leading-relaxed">
                  Cities cracked, concrete split, and the forgotten roots beneath us finally tasted sunlight. 
                  Nature returned not as ruin — but as a renaissance.
                </p>
                <p className="font-body text-dark-green/80 leading-relaxed">
                  Overgrowth was born from the belief that every remnant has a second life. 
                  A gas station becomes a garden. A skeleton becomes a symbol of what can bloom after loss.
                </p>
                <p className="font-body text-dark-green/80 leading-relaxed font-medium">
                  We do not mourn endings.<br />
                  We document what grows after.
                </p>
              </div>
              
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8 flex flex-col justify-between">
                <div className="text-center flex-1 flex flex-col justify-center">
                  <Icons.Quote className="w-10 h-10 text-rust/40 mx-auto mb-4" />
                  <p className="font-handwritten text-2xl text-dark-green/70 italic leading-relaxed">
                    "We are not chasing trends.<br />
                    We are chasing what has been rediscovered."
                  </p>
                </div>
                <p className="font-body text-sm text-dark-green/80 leading-relaxed mt-6 pt-6 border-t border-dark-green/10">
                  Every piece of apparel is an artifact pulled from this new frontier — 
                  a story stitched from the places the wild has reclaimed.
                </p>
              </div>
            </div>
            
            <p className="font-body text-xs text-dark-green/40 italic mt-4 text-center">
              If you listen closely, you can hear the vines growing.
            </p>
          </section>



          {/* Chapter 2 - Aesthetic */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Visual Evidence</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-rust text-[#f4f1ea] flex items-center justify-center font-heading text-lg">2</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">The Aesthetic</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
              <p className="font-body text-dark-green/80 leading-relaxed mb-4">
                Our world lives where memory and moss intertwine.<br />
                Where steel is softened by vines.<br />
                Where history becomes habitat.
              </p>
              
              <p className="font-body text-dark-green/80 leading-relaxed mb-8">
                The Overgrowth aesthetic is:
              </p>
              
              {/* Color Palette */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { color: '#1a472a', name: 'Forest Green', desc: 'the pulse of everything returning' },
                  { color: '#c05a34', name: 'Rust', desc: 'the memory of what was left behind' },
                  { color: '#f5f2eb', name: 'Bone', desc: 'the survivors reborn' },
                  { color: '#8b7355', name: 'Earth', desc: 'the foundation of the new world' },
                ].map((swatch, i) => (
                  <div key={i} className="text-center">
                    <div 
                      className="w-full aspect-square mb-3 border border-dark-green/20"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span className="font-heading text-sm text-dark-green block mb-1">{swatch.name}</span>
                    <span className="font-body text-xs text-dark-green/50 italic">{swatch.desc}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-dark-green/10 pt-6 space-y-2">
                <p className="font-body text-dark-green/70 leading-relaxed">
                  Soft fabrics meet aged textures.
                </p>
                <p className="font-body text-dark-green/70 leading-relaxed">
                  Fresh blooms meet weathered landmarks.
                </p>
                <p className="font-body text-dark-green/70 leading-relaxed">
                  The familiar becomes strange again — and therefore wondrous.
                </p>
              </div>
            </div>
          </section>



          {/* Chapter 3 - Materials */}
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-body text-[10px] text-dark-green/40 uppercase tracking-widest">Subject: Field Gear Standards</span>
            </div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-10 bg-dark-green text-[#f4f1ea] flex items-center justify-center font-heading text-lg">3</span>
              <h2 className="font-heading text-2xl text-dark-green uppercase tracking-wider">Materials We Favor</h2>
              <div className="flex-1 h-px bg-dark-green/20" />
            </div>
            
            <p className="font-body text-dark-green/70 leading-relaxed mb-8 max-w-2xl">
              We choose materials like explorers choose the keepsakes they carry:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: 'leaf', label: 'Organic Cotton', desc: 'gentle on skin, gentle on the world' },
                { icon: 'recycle', label: 'Recycled Fibers', desc: 'remnants reborn and re-imagined' },
                { icon: 'shield', label: 'Durable Weaves', desc: 'garments meant to wander' },
                { icon: 'heart', label: 'Ethical Production', desc: 'a new world deserves better care' },
              ].map((item, i) => (
                <div key={i} className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center group hover:border-rust/50 transition-colors">
                  {item.icon === 'leaf' && <Icons.Leaf className="w-8 h-8 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" />}
                  {item.icon === 'recycle' && <Icons.Recycle className="w-8 h-8 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" />}
                  {item.icon === 'shield' && <Icons.Shield className="w-8 h-8 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" />}
                  {item.icon === 'heart' && <Icons.Heart className="w-8 h-8 text-dark-green/40 mx-auto mb-3 group-hover:text-rust transition-colors" />}
                  <h3 className="font-heading text-sm text-dark-green mb-2">{item.label}</h3>
                  <p className="font-body text-xs text-dark-green/50 italic leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <p className="font-body text-dark-green/70 leading-relaxed mt-8 text-center max-w-2xl mx-auto">
              Every Overgrowth piece is made to last the journey and age beautifully — 
              much like the world that inspired it.
            </p>
          </section>

          {/* Footer Quote & CTA */}
          <div className="text-center pt-12 border-t border-rust">
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
              to="/collections"
              className="inline-flex items-center gap-3 bg-dark-green text-[#f4f1ea] px-8 py-4 font-heading tracking-widest hover:bg-rust transition-colors"
            >
              <span>Browse Recovered Works</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
            <p className="font-body text-xs text-dark-green/40 mt-4 italic">
              Artifacts from the frontier, ready for their next adventure.
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
