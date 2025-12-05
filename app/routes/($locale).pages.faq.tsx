import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useState} from 'react';
import {Link} from '~/components/Link';

export const headers = routeHeaders;

// Inline SVG icons
const CategoryIcons: Record<string, (className: string) => JSX.Element> = {
  truck: (className) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  recycle: (className) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
  bag: (className) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  ),
  shirt: (className) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  ),
};

const PlusIcon = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const MinusIcon = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
  </svg>
);

const EnvelopeIcon = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const ArrowRightIcon = ({className}: {className: string}) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'faq',
      language: context.storefront.i18n.language,
    },
  });

  const seo = page
    ? seoPayload.page({page, url: request.url})
    : {title: 'FAQ | Overgrowth', description: 'Answers to common questions.'};

  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Shipping',
      iconKey: 'truck' as const,
      questions: [
        { q: 'How long does shipping take?', a: 'Orders ship within 2-5 business days. Delivery is typically 5-7 days domestic, 10-14 days international.' },
        { q: 'Do you ship internationally?', a: 'Yes! We ship worldwide. International orders may have customs fees handled by the recipient.' },
        { q: 'How do I track my order?', a: 'You\'ll receive a tracking email once your order ships. Check your spam folder if you don\'t see it.' },
      ]
    },
    {
      category: 'Returns',
      iconKey: 'recycle' as const,
      questions: [
        { q: 'What\'s your return policy?', a: 'Returns accepted within 30 days. Items must be unworn, unwashed, with tags attached.' },
        { q: 'How do I start a return?', a: 'Email customerservice@overgrowth.co with your order number. We\'ll send a prepaid label.' },
      ]
    },
    {
      category: 'Orders',
      iconKey: 'bag' as const,
      questions: [
        { q: 'What payment methods do you accept?', a: 'All major cards, PayPal, Apple Pay, Google Pay, and Shop Pay.' },
        { q: 'Can I modify my order?', a: 'Contact us within 2 hours of ordering. After that, we may have already started processing.' },
      ]
    },
    {
      category: 'Products',
      iconKey: 'shirt' as const,
      questions: [
        { q: 'How should I care for my items?', a: 'Machine wash cold, tumble dry low. Avoid bleach. Your pieces will last years with proper care.' },
        { q: 'Are your products sustainable?', a: 'We prioritize organic cotton and recycled materials. Quality over quantity, always.' },
      ]
    },
  ];

  let globalIndex = 0;

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
          Help Center
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
          Everything you need to know
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* FAQ Content */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-dark-green flex items-center justify-center">
                  {CategoryIcons[section.iconKey]("w-5 h-5 text-[#f4f1ea]")}
                </div>
                <h2 className="font-heading text-xl text-dark-green tracking-widest">{section.category}</h2>
                <div className="flex-1 h-px bg-dark-green/20" />
              </div>
              
              {/* Questions */}
              <div className="space-y-3">
                {section.questions.map((item, qIdx) => {
                  const currentIndex = globalIndex++;
                  const isOpen = openIndex === currentIndex;
                  
                  return (
                    <div 
                      key={qIdx}
                      className={`bg-[#f9f7f3] border transition-colors ${isOpen ? 'border-rust' : 'border-dark-green/20'}`}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className={`font-heading transition-colors ${isOpen ? 'text-rust' : 'text-dark-green'}`}>
                          {item.q}
                        </span>
                        {isOpen 
                          ? <MinusIcon className="w-5 h-5 text-rust" />
                          : <PlusIcon className="w-5 h-5 text-dark-green/40" />
                        }
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-5">
                          <p className="font-body text-sm text-dark-green/70 leading-relaxed border-l-2 border-rust/30 pl-4">
                            {item.a}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
            <EnvelopeIcon className="w-10 h-10 text-rust mx-auto mb-4" />
            <h3 className="font-heading text-xl text-dark-green mb-2">Still have questions?</h3>
            <p className="font-body text-sm text-dark-green/60 mb-6">
              We're here to help. Drop us a note.
            </p>
            <Link 
              to="/pages/contact"
              className="inline-flex items-center gap-2 bg-dark-green text-[#f4f1ea] px-6 py-3 font-heading tracking-widest hover:bg-rust transition-colors"
            >
              <span>Contact Us</span>
              <ArrowRightIcon className="w-4 h-4" />
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
