import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction, type MetaArgs} from '@remix-run/react';
import {Suspense} from 'react';
import {getSeoMeta} from '@shopify/hydrogen';
import {DropHero} from '~/components/home/DropHero';
import {LatestDrops} from '~/components/home/LatestDrops';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  const featuredProducts = storefront.query(FEATURED_PRODUCTS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const seo = seoPayload.home({url: request.url});

  return defer({
    featuredProducts,
    seo,
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
                desc: 'Heavyweight cotton. Artisan construction. Built to outlast trends.',
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
      
      {/* Instagram Feed Section - Elfsight Widget */}
      <section className="py-20 md:py-28 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                @overgrowth.co
              </span>
              <div className="w-8 h-px bg-[#B55A3C]" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl text-[#F2EFE9] uppercase tracking-wide mb-4">
              Follow The Journey
            </h2>
            <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto">
              Behind-the-scenes drops, styling inspiration, and first looks at upcoming releases.
            </p>
          </div>
          
          {/* Elfsight Instagram Feed Widget */}
          <div 
            className="elfsight-app-cdc3c967-8f50-4cce-babf-dd60c18aecf5" 
            data-elfsight-app-lazy
          />
          
          <div className="text-center mt-10">
            <a 
              href="https://instagram.com/overgrowth.co" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#F2EFE9]/30 text-[#F2EFE9] font-mono text-xs uppercase tracking-[0.2em] hover:border-[#B55A3C] hover:text-[#B55A3C] transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @overgrowth.co
            </a>
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
