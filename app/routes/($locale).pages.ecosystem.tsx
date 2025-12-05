import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link} from '~/components/Link';
import {motion} from 'framer-motion';
import {Icons} from '~/components/InlineIcons';

export async function loader({request, context}: LoaderFunctionArgs) {
  return json({});
}

// Inline SVG icons for tiers
const TierIcons = {
  plant: (className: string) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.38 48.38 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
    </svg>
  ),
  tree: (className: string) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11 21v-4.8c-1.2-.5-2-1.6-2-2.9 0-1.1.6-2.1 1.5-2.7-.3-.6-.5-1.3-.5-2.1 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 .8-.2 1.5-.5 2.1.9.6 1.5 1.6 1.5 2.7 0 1.3-.8 2.4-2 2.9V21h-7z"/>
    </svg>
  ),
  sun: (className: string) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  flower: (className: string) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
};

const CheckIcon = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const CaretDown = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function EcosystemPage() {
  const tiers = [
    {
      name: 'THE ROOT',
      level: 1,
      points: '0 - 199',
      iconKey: 'plant' as const,
      benefits: ['Member-only pricing', 'Early access announcements', 'Birthday reward'],
    },
    {
      name: 'THE VINE',
      level: 2,
      points: '200 - 499',
      iconKey: 'tree' as const,
      benefits: ['Everything in The Root', '10% off all orders', 'Free shipping over $50', 'Exclusive drops access'],
      featured: true,
    },
    {
      name: 'THE CANOPY',
      level: 3,
      points: '500+',
      iconKey: 'sun' as const,
      benefits: ['Everything in The Vine', '15% off all orders', 'Free shipping always', 'First access', 'Surprise gifts'],
    },
  ];

  const steps = [
    { num: '01', title: 'Plant', desc: 'Create your free account', iconKey: 'plant' as const },
    { num: '02', title: 'Grow', desc: 'Every dollar plants a seed', iconKey: 'flower' as const },
    { num: '03', title: 'Bloom', desc: 'Watch your path unfold', iconKey: 'sun' as const },
  ];

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
          The Ecosystem
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-lg mx-auto">
          Join our community of explorers and unlock rewards
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 text-center mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/account/register"
            className="bg-dark-green text-[#f4f1ea] px-8 py-4 font-heading tracking-widest hover:bg-rust transition-colors"
          >
            Join the Ecosystem
          </Link>
          <Link 
            to="/account/login"
            className="font-body text-sm text-dark-green/60 hover:text-rust transition-colors underline underline-offset-4"
          >
            Already a member? Sign in
          </Link>
        </div>
      </div>

      {/* How It Works */}
      <div className="relative z-10 px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-heading text-lg text-dark-green">How It Works</span>
            <div className="flex-1 h-px bg-dark-green/20" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="bg-[#f9f7f3] border border-dark-green/20 p-6 text-center">
                <span className="font-heading text-3xl text-rust">{step.num}</span>
                {TierIcons[step.iconKey]("w-8 h-8 text-dark-green/40 mx-auto my-4")}
                <h3 className="font-heading text-xl text-dark-green mb-2">{step.title}</h3>
                <p className="font-body text-sm text-dark-green/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tier Cards */}
      <div className="relative z-10 px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-heading text-lg text-dark-green">Explorer Tiers</span>
            <div className="flex-1 h-px bg-dark-green/20" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${tier.featured ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-rust text-[#f4f1ea] px-4 py-1 font-body text-xs uppercase tracking-widest">Popular</span>
                  </div>
                )}
                
                <div className={`bg-[#f9f7f3] border-2 ${tier.featured ? 'border-rust' : 'border-dark-green/20'} overflow-hidden h-full`}>
                  {/* Header */}
                  <div className="bg-dark-green p-6 text-center">
                    {TierIcons[tier.iconKey]("w-10 h-10 text-rust mx-auto mb-3")}
                    <h3 className="font-heading text-xl text-[#f4f1ea] tracking-widest">{tier.name}</h3>
                    <p className="font-body text-sm text-[#f4f1ea]/60 mt-1">{tier.points} points</p>
                  </div>
                  
                  {/* Benefits */}
                  <div className="p-6">
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <CheckIcon className="w-4 h-4 text-rust flex-shrink-0 mt-0.5" />
                          <span className="font-body text-sm text-dark-green/70">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-heading text-lg text-dark-green">Quick Questions</span>
            <div className="flex-1 h-px bg-dark-green/20" />
          </div>
          
          <div className="space-y-4">
            {[
              { q: 'How do I earn points?', a: '1 point for every $1 spent. Points are added after your order ships.' },
              { q: 'Do points expire?', a: 'Points expire after 12 months of inactivity.' },
              { q: 'When do I level up?', a: 'Hit the point threshold and you level up immediately.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-[#f9f7f3] border border-dark-green/20">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="font-heading text-dark-green">{faq.q}</span>
                  <CaretDown className="w-5 h-5 text-rust group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="font-body text-sm text-dark-green/60">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
