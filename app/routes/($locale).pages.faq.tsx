import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useState} from 'react';
import {Link} from '~/components/Link';
import {Separator} from '~/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'faq',
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

const faqCategories = [
  {
    id: 'shipping',
    title: 'Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping within the US takes 5-7 business days. Express shipping is available at checkout for 2-3 day delivery.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to most countries worldwide. International shipping typically takes 10-14 business days.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order ships, you\'ll receive an email with tracking information. You can also check your order status in your account.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We accept returns within 30 days of delivery for unworn items with original tags attached. Items must be in original condition.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email us at hello@overgrowth.co with your order number and reason for return. We\'ll provide a prepaid shipping label.',
      },
      {
        q: 'Can I exchange for a different size?',
        a: 'Yes, exchanges are free. Contact us and we\'ll arrange the swap once we receive your original item.',
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    questions: [
      {
        q: 'How do your pieces fit?',
        a: 'Most of our pieces are designed with a relaxed, slightly oversized fit. Check the size guide on each product page for detailed measurements.',
      },
      {
        q: 'What materials do you use?',
        a: 'We prioritize organic cotton, recycled fibers, and sustainable materials. Each product page lists specific fabric compositions.',
      },
      {
        q: 'How should I care for my items?',
        a: 'Machine wash cold, hang dry. Avoid bleach. This helps maintain the quality and extends the life of your garment.',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, PayPal, Apple Pay, Google Pay, and Shop Pay.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'Orders can be modified or cancelled within 1 hour of placement. After that, please contact us immediately and we\'ll do our best to help.',
      },
      {
        q: 'Do you offer gift cards?',
        a: 'Yes, digital gift cards are available in various denominations. They never expire and can be used on any order.',
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('shipping');

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Recovery Guide
            </span>
            <div className="w-8 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl text-[#F2EFE9] tracking-[0.1em] mb-6 uppercase">
            FAQ
          </h1>
          
          <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto">
            Field notes on orders, shipping, and artifact preservation
          </p>
        </div>
      </section>

      {/* FAQ CONTENT - Two column layout */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[280px,1fr] gap-12">
            
            {/* Category Sidebar - Sticky */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-6">
                Categories
              </span>
              <div className="space-y-2">
                {faqCategories.map((cat, i) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left px-5 py-4 font-mono text-sm transition-all duration-300 flex items-center gap-4 ${
                      activeCategory === cat.id
                        ? 'bg-[#0a0a0a] text-[#F2EFE9]'
                        : 'bg-[#0a0a0a]/5 text-[#8A8A84] hover:bg-[#0a0a0a]/10 hover:text-[#0a0a0a]'
                    }`}
                  >
                    <span className={`w-6 h-6 flex items-center justify-center text-[10px] ${
                      activeCategory === cat.id ? 'bg-[#B55A3C] text-[#F2EFE9]' : 'bg-[#8A8A84]/20 text-[#8A8A84]'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="uppercase tracking-wide text-xs">{cat.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Help CTA */}
              <div className="mt-8 p-6 border border-[#B55A3C]/20 bg-[#B55A3C]/5">
                <span className="font-heading text-sm text-[#1a472a] uppercase block mb-2">
                  Still have questions?
                </span>
                <p className="font-mono text-[10px] text-[#8A8A84] mb-4">
                  Our recovery team is here to help.
                </p>
                <Link
                  to="/pages/contact"
                  className="inline-block w-full text-center px-4 py-3 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-[10px] uppercase tracking-widest transition-colors"
                >
                  Contact Us →
                </Link>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              {faqCategories.map((category) => (
                <div
                  key={category.id}
                  className={activeCategory === category.id ? 'block' : 'hidden'}
                >
                  {/* Category Header */}
                  <div className="mb-8 pb-6 border-b border-[#1a472a]/10">
                    <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-2">
                      Section {faqCategories.findIndex(c => c.id === category.id) + 1}
                    </span>
                    <h2 className="font-heading text-3xl text-[#1a472a] uppercase tracking-wide">
                      {category.title}
                    </h2>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {category.questions.map((item, i) => (
                      <AccordionItem 
                        key={i} 
                        value={`item-${i}`} 
                        className="border border-[#1a472a]/10 bg-white/50 px-6 data-[state=open]:border-[#B55A3C]/30 data-[state=open]:bg-[#B55A3C]/5 transition-colors"
                      >
                        <AccordionTrigger className="font-mono text-sm text-[#1a472a] hover:text-[#B55A3C] text-left py-5 hover:no-underline">
                          <span className="flex items-start gap-4">
                            <span className="text-[#8A8A84]/40 text-[10px] mt-1">Q{i + 1}</span>
                            <span>{item.q}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="font-mono text-sm text-[#8A8A84] leading-relaxed pb-5 pl-10">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
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
