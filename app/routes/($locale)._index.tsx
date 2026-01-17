import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {DropHero} from '~/components/home/DropHero';
import {LatestDrops} from '~/components/home/LatestDrops';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export const meta: MetaFunction = () => {
  return [{title: 'Overgrowth | Streetwear'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  const featuredProducts = storefront.query(FEATURED_PRODUCTS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    featuredProducts,
  });
}

export default function Homepage() {
  const {featuredProducts} = useLoaderData<typeof loader>();
  
  return (
    <div className="home">
      <DropHero />
      
      {/* Why Overgrowth - Brand Pillars */}
      <section className="py-24 md:py-32 bg-[#F2EFE9] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                The Overgrowth Philosophy
              </span>
              <div className="w-12 h-px bg-[#B55A3C]" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-[#1a472a] uppercase tracking-[0.08em] mb-6">
              What We Stand For
            </h2>
            <p className="font-mono text-sm text-[#8A8A84] max-w-2xl mx-auto">
              In a world of infinite replicas, we choose scarcity. Each piece is a limited artifact—never reprinted, always earned.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '◯',
                title: 'Limited Runs',
                desc: 'Every drop is produced in small batches. When it sells out, it enters the archive—forever.',
              },
              {
                icon: '◇',
                title: 'Premium Craft',
                desc: '240 GSM heavyweight cotton. Artisan construction. Built to outlast trends.',
              },
              {
                icon: '△',
                title: 'No Restocks',
                desc: 'Once archived, it stays archived. Scarcity is the point. Recovery is the reward.',
              },
            ].map((pillar, i) => (
              <div 
                key={i}
                className="text-center p-8 border border-[#1a472a]/10 bg-white/50 hover:border-[#B55A3C]/30 transition-colors group"
              >
                <span className="font-heading text-4xl text-[#1a472a]/20 group-hover:text-[#B55A3C]/40 transition-colors block mb-6">
                  {pillar.icon}
                </span>
                <h3 className="font-heading text-lg text-[#1a472a] uppercase tracking-wider mb-3">
                  {pillar.title}
                </h3>
                <p className="font-mono text-xs text-[#8A8A84] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest Drops Section */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <Await resolve={featuredProducts}>
          {(data) => (
            <LatestDrops 
              products={data?.products?.nodes || []} 
              title="Latest Drops"
            />
          )}
        </Await>
      </Suspense>
      
      {/* Social Proof / Field Notes */}
      <section className="py-20 md:py-28 bg-[#F2EFE9]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.4em] uppercase block mb-4">
              Field Notes
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-[#1a472a] uppercase tracking-wide">
              From The Community
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally, a brand that gets it. The quality is unreal and knowing it won't be mass-produced makes it special.",
                author: "Jake M.",
                location: "Los Angeles, CA"
              },
              {
                quote: "Copped the first drop and now I'm hooked. The fit, the weight, the details—nothing else compares.",
                author: "Sarah K.",
                location: "Brooklyn, NY"
              },
              {
                quote: "Missed the last drop and learned my lesson. Now I'm on the list and ready. This is how streetwear should be.",
                author: "Marcus T.",
                location: "Miami, FL"
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-8 border border-[#1a472a]/10 bg-white/30">
                <p className="font-mono text-sm text-[#1a472a]/80 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1a472a]/10 rounded-full" />
                  <div>
                    <span className="font-heading text-sm text-[#1a472a] block">{testimonial.author}</span>
                    <span className="font-mono text-[10px] text-[#8A8A84]">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter CTA */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase block mb-6">
            Join The Archive
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-[#F2EFE9] uppercase tracking-wide mb-6">
            Never Miss A Drop
          </h2>
          <p className="font-mono text-sm text-[#F2EFE9]/50 mb-10 max-w-lg mx-auto">
            Get exclusive early access to new releases, behind-the-scenes content, and members-only drops.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-4 bg-[#1a1a1a] border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-sm placeholder:text-[#F2EFE9]/30 focus:outline-none focus:border-[#B55A3C] transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#B55A3C] text-[#F2EFE9] font-mono text-xs uppercase tracking-[0.2em] hover:bg-[#9A4A30] transition-colors"
            >
              Join
            </button>
          </form>
          
          <p className="font-mono text-[10px] text-[#F2EFE9]/30 mt-6">
            No spam. Drops only. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeaturedProductsSkeleton() {
  return (
    <section className="py-24 px-4 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-8 w-48 bg-muted animate-pulse mx-auto rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[3/4] bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
