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
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-16 border-b-2 border-dark-green/20 pb-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-heading text-4xl md:text-5xl text-dark-green mb-2 uppercase tracking-widest">
                        Field Manual
                    </h1>
                    <p className="font-body text-xs tracking-[0.2em] text-dark-green/60 uppercase">
                        Reference Guide: v2.4.0
                    </p>
                </div>
                <div className="hidden md:block border border-dark-green/30 p-2">
                    <div className="w-16 h-16 bg-[url('https://cdn.shopify.com/s/files/1/0849/6437/6882/files/qr-code-placeholder.png?v=1732650000')] bg-cover opacity-50 grayscale" />
                </div>
            </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-12">
            {faqs.map((section, idx) => (
                <div key={idx} className="relative">
                    <h2 className="font-heading text-xl text-rust uppercase tracking-widest mb-6 flex items-center">
                        <span className="mr-4 opacity-50">0{idx + 1} //</span> 
                        {section.category}
                    </h2>
                    
                    <div className="space-y-4">
                        {section.items.map((item, itemIdx) => (
                            <Disclosure key={itemIdx} as="div" className="border border-dark-green/10 bg-[#f0ede6]">
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex justify-between w-full px-6 py-4 text-left font-body text-dark-green hover:bg-dark-green/5 transition-colors focus:outline-none">
                                            <span className="font-bold tracking-wide uppercase text-sm">{item.question}</span>
                                            <span className={`ml-6 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                                                ▼
                                            </span>
                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-6 pb-6 pt-2 text-dark-green/80 font-body leading-relaxed border-t border-dark-green/5 bg-[#f4f1ea]/50">
                                            {item.answer}
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 p-6 border border-dashed border-dark-green/30 bg-[#f0ede6]/50 text-center">
            <p className="font-body text-sm text-dark-green/70">
                Cannot find the data you require? <a href="/pages/contact" className="text-rust hover:underline font-bold">Establish direct contact</a> with Headquarters.
            </p>
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
