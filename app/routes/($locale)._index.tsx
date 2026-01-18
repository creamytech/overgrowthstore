import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, type MetaFunction, type MetaArgs} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {getSeoMeta} from '@shopify/hydrogen';
import {DropHero} from '~/components/home/DropHero';
import {LatestDrops} from '~/components/home/LatestDrops';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {StatsCards} from '~/components/stats-cards';
import GlowingBorderButton from '~/components/glowing-border-button';

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
      
      {/* Latest Drops Section */}
      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <Await resolve={featuredProducts}>
          {(data) => (
            <LatestDrops 
              products={data?.products?.nodes || []} 
              title="OG-NYC-001"
            />
          )}
        </Await>
      </Suspense>
      
      {/* Why Overgrowth - Brand Pillars with StatsCards */}
      <section className="py-24 md:py-32 bg-[#F2EFE9] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
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
          
          {/* Animated Stats Cards */}
          <StatsCards 
            className="bg-transparent"
            cards={[
              {
                value: "50",
                title: "Pieces Per Drop",
                description: "Every drop is produced in small batches. When it sells out, it enters the archive—forever.",
              },
              {
                value: "0",
                title: "Restocks Ever",
                description: "We never reprint. Each piece enters the permanent archive when it sells out.",
                accent: true,
              },
              {
                value: "100%",
                title: "Premium Cotton",
                description: "Heavyweight construction. Built to outlast trends and fast fashion.",
              },
            ]}
          />
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
          
          <HomepageNewsletterForm />
          
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


function HomepageNewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json() as { success?: boolean };
      
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-4">
        <span className="font-mono text-sm text-[#B55A3C] tracking-wide">
          ✓ You're on the list!
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto items-center justify-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 w-full sm:w-auto px-5 py-4 bg-[#1a1a1a] border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-sm placeholder:text-[#F2EFE9]/30 focus:outline-none focus:border-[#B55A3C] transition-colors"
      />
      <GlowingBorderButton 
        text={status === 'submitting' ? '...' : 'Join Now'}
        type="submit"
      />
    </form>
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
