import {json, type LoaderFunctionArgs, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form, useActionData, useNavigation} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  console.log('CONTACT ROUTE LOADER HIT');
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'contact',
      language: context.storefront.i18n.language,
    },
  });

  // If page is not found, we don't throw 404, we just render the form without dynamic SEO/Body
  // This ensures the custom page works even if the user hasn't created it in Admin yet.
  const seo = page 
    ? seoPayload.page({page, url: request.url})
    : {title: 'Contact | Overgrowth', description: 'Establish connection with Headquarters.'};

  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function Contact() {
  const {page} = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8">


      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
        
        {/* Left: The Transmission Form */}
        <div className="relative">
            {/* Paper Sheet Effect */}
            <div className="bg-[#f4f1ea] border border-dark-green/20 p-8 md:p-12 shadow-sm relative overflow-hidden">
                {/* Stamps */}
                <div className="absolute top-4 right-4 border-2 border-rust/30 text-rust/30 p-2 font-heading text-xl -rotate-12 pointer-events-none uppercase tracking-widest">
                    CONFIDENTIAL
                </div>

                <div className="mb-8 border-b border-dark-green/10 pb-4">
                    <h1 className="font-heading text-4xl md:text-5xl text-dark-green mb-2">
                        ESTABLISH CONNECTION
                    </h1>
                    <p className="font-body text-xs tracking-[0.2em] text-dark-green/60 uppercase">
                        TRANSMISSION CHANNEL: OPEN // FREQUENCY: 104.5 MHZ
                    </p>
                </div>

                <Form method="post" action="/contact" className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block font-body text-xs tracking-widest uppercase text-dark-green/70">
                            Observer Name (Codename)
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            required
                            placeholder="e.g. Agent Cooper"
                            className="w-full bg-transparent border-b border-dark-green/30 py-2 font-body text-dark-green placeholder:text-dark-green/20 focus:outline-none focus:border-rust transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-body text-xs tracking-widest uppercase text-dark-green/70">
                            Return Frequency (Email)
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            required
                            placeholder="agent@overgrowth.com"
                            className="w-full bg-transparent border-b border-dark-green/30 py-2 font-body text-dark-green placeholder:text-dark-green/20 focus:outline-none focus:border-rust transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="block font-body text-xs tracking-widest uppercase text-dark-green/70">
                            Observation Data (Message)
                        </label>
                        <textarea 
                            name="message" 
                            id="message"
                            rows={6}
                            required
                            placeholder="Report your findings..."
                            className="w-full bg-[#f0ede6] border border-dark-green/10 p-4 font-body text-dark-green placeholder:text-dark-green/20 focus:outline-none focus:border-rust transition-colors resize-none"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-dark-green text-[#f4f1ea] py-4 font-heading text-xl tracking-widest hover:bg-rust transition-colors duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10">TRANSMIT REPORT</span>
                    </button>
                </Form>
            </div>
            
            {/* Paper Stack Effect */}
            <div className="absolute top-2 left-2 w-full h-full border border-dark-green/10 bg-[#f4f1ea] -z-10" />
            <div className="absolute top-4 left-4 w-full h-full border border-dark-green/5 bg-[#f4f1ea] -z-20" />
        </div>

        {/* Right: Headquarters Info */}
        <div className="flex flex-col justify-center space-y-12 lg:pl-12 pt-12 lg:pt-0">
            
            <div className="space-y-4">
                <div className="w-12 h-1 bg-rust mb-6" />
                <h2 className="font-heading text-3xl text-dark-green">
                    HEADQUARTERS
                </h2>
                <p className="font-body text-dark-green/80 leading-relaxed max-w-md">
                    Our research facility is located in the deep overgrowth of the Pacific Northwest. Direct contact is limited due to atmospheric interference.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="border-l-2 border-dark-green/20 pl-6">
                    <h3 className="font-body text-xs tracking-widest uppercase text-dark-green/50 mb-2">
                        Coordinates
                    </h3>
                    <p className="font-heading text-xl text-dark-green">
                        45.5152° N, 122.6784° W
                    </p>
                    <p className="font-body text-sm text-dark-green/70 mt-1">
                        Sector 7G, Portland, OR
                    </p>
                </div>

                <div className="border-l-2 border-dark-green/20 pl-6">
                    <h3 className="font-body text-xs tracking-widest uppercase text-dark-green/50 mb-2">
                        Radio Silence
                    </h3>
                    <p className="font-heading text-xl text-dark-green">
                        0900 - 1700 PST
                    </p>
                    <p className="font-body text-sm text-dark-green/70 mt-1">
                        Mon - Fri (Earth Time)
                    </p>
                </div>

                <div className="border-l-2 border-dark-green/20 pl-6">
                    <h3 className="font-body text-xs tracking-widest uppercase text-dark-green/50 mb-2">
                        Emergency Frequency
                    </h3>
                    <a href="mailto:help@overgrowth.com" className="font-heading text-xl text-dark-green hover:text-rust transition-colors">
                        help@overgrowth.com
                    </a>
                </div>
            </div>

            {/* Decorative Map/Graphic Placeholder */}
            <div className="relative w-full h-32 border border-dark-green/10 overflow-hidden opacity-50">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#1a472a_10px,#1a472a_11px)] opacity-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border rounded-full border-dark-green/30 flex items-center justify-center">
                    <div className="w-1 h-1 bg-rust rounded-full animate-ping" />
                </div>
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
