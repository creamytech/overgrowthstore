import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Disclosure} from '@headlessui/react';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'faq',
      language: context.storefront.i18n.language,
    },
  });

  const seo = page
    ? seoPayload.page({page, url: request.url})
    : {title: 'FAQ | Overgrowth', description: 'Field Manual and Survival Guide for Overgrowth equipment.'};

  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function FAQ() {
  const {page} = useLoaderData<typeof loader>();

  const faqs = [
    {
      category: "Logistics & Supply",
      items: [
        {
          question: "Shipping Protocols & Timelines",
          answer: "All standard supply drops are dispatched within 24-48 hours of order confirmation. Domestic transit typically requires 3-5 business days. International supply lines may vary based on customs clearance protocols."
        },
        {
          question: "Tracking Your Supply Drop",
          answer: "Once your equipment is dispatched, you will receive a transmission containing your tracking coordinates. Use this to monitor the package's trajectory through the network."
        },
        {
          question: "International Operations",
          answer: "We ship globally. Note that international operatives are responsible for any local customs duties or import taxes levied by their region's authorities."
        }
      ]
    },
    {
      category: "Equipment Management",
      items: [
        {
          question: "Return & Exchange Policy",
          answer: "If your equipment fails to meet mission standards, you may initiate a return within 30 days of receipt. Items must be in original, unused condition with all tags attached. Initiating a return requires a Return Authorization Code."
        },
        {
          question: "Defective Gear",
          answer: "In the rare event of manufacturing failure, contact Command immediately. We stand by our gear and will replace defective items swiftly to ensure your mission readiness."
        }
      ]
    },
    {
      category: "Transaction Protocols",
      items: [
        {
          question: "Accepted Currencies",
          answer: "We accept all major credit cards, PayPal, and Shop Pay. All transactions are encrypted and secured."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
       {/* Texture Overlay - Fixed to cover viewport */}
       <div className="fixed inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')] z-0" />
       
       {/* Header */}
       <div className="relative z-10 pt-32 pb-12 text-center">
            <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2">
                FIELD MANUAL
            </h1>
            <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
                <span>REFERENCE GUIDE</span>
            </div>
            <div className="w-24 h-1 bg-rust mx-auto mt-6" />
       </div>

      <div className="max-w-4xl mx-auto relative z-10 px-4 md:px-8 pb-24">

        {/* FAQ Content */}
        <div className="space-y-16">
            {faqs.map((section, idx) => (
                <div key={idx} className="relative">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="font-heading text-4xl text-rust/40">0{idx + 1}</span>
                        <h2 className="font-heading text-2xl text-dark-green uppercase tracking-widest border-b border-rust/30 pb-2 flex-grow">
                            {section.category}
                        </h2>
                    </div>
                    
                    <div className="space-y-6 pl-0 md:pl-12">
                        {section.items.map((item, itemIdx) => (
                            <Disclosure key={itemIdx} as="div" className="group">
                                {({ open }) => (
                                    <div className={`border-l-2 transition-all duration-300 ${open ? 'border-rust bg-[#f0ede6]' : 'border-dark-green/20 hover:border-dark-green/60'}`}>
                                        <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left font-body text-dark-green focus:outline-none">
                                            <span className="font-bold tracking-wide uppercase text-sm md:text-base group-hover:text-rust transition-colors">
                                                {item.question}
                                            </span>
                                            <span className={`ml-6 transform transition-transform duration-300 text-rust ${open ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </Disclosure.Button>
                                        
                                        <Disclosure.Panel className="px-6 pb-6 pt-2 text-dark-green/80 font-typewriter text-sm leading-relaxed">
                                            <div className="relative">
                                                {/* "Redacted" bar decoration */}
                                                <div className="w-12 h-1 bg-dark-green/10 mb-4" />
                                                {item.answer}
                                            </div>
                                        </Disclosure.Panel>
                                    </div>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Note */}
        <div className="mt-24 relative">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,#1a472a05_5px,#1a472a05_6px)]" />
            <div className="border-2 border-dark-green p-8 text-center relative bg-[#f4f1ea]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f4f1ea] px-4 font-heading text-rust text-xl">
                    NOTICE
                </div>
                <p className="font-body text-lg text-dark-green/80 mb-4">
                    Cannot find the data you require?
                </p>
                <a href="/pages/contact" className="inline-block border-b-2 border-rust text-rust font-heading text-xl hover:bg-rust hover:text-[#f4f1ea] transition-all duration-300 px-2">
                    ESTABLISH DIRECT CONTACT
                </a>
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
