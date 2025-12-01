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
    <div className="min-h-screen bg-[#f4f1ea] relative pt-32 pb-24 px-4 md:px-8 overflow-hidden">
      
      {/* Background Texture - Coffee Rings & Dirt */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
         <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full border-[20px] border-rust blur-[2px] mask-grunge transform rotate-45" />
         <div className="absolute bottom-[20%] right-[10%] w-48 h-48 rounded-full border-[10px] border-dark-green blur-[1px] mask-grunge" />
         <div className="absolute top-1/3 left-1/2 w-96 h-96 bg-[url('/assets/texture_dirt.png')] opacity-20 mix-blend-multiply" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
        
        {/* Left: The Transmission Form */}
        <div className="relative group">
            {/* Paper Sheet Effect */}
            <div className="absolute inset-0 bg-dark-green/5 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
            <div className="bg-[#f4f1ea] border border-dark-green/20 p-8 md:p-12 shadow-sm relative overflow-hidden transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                {/* Stamps */}
                <div className="absolute top-4 right-4 border-4 border-rust/30 text-rust/30 px-4 py-1 font-heading text-xl -rotate-12 pointer-events-none uppercase tracking-widest mix-blend-multiply mask-grunge">
                    CONFIDENTIAL
                </div>

                <div className="mb-8 border-b-2 border-dashed border-dark-green/20 pb-6">
                    <h1 className="font-heading text-4xl md:text-5xl text-dark-green mb-2">
                        ESTABLISH CONNECTION
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="h-px w-12 bg-rust" />
                        <div className="font-typewriter text-xs tracking-[0.2em] text-dark-green/60 uppercase">
                            <span>TRANSMISSION CHANNEL: OPEN // FREQUENCY: 104.5 MHZ</span>
                        </div>
                    </div>
                </div>

                <Form method="post" action="/contact" className="space-y-8">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block font-typewriter text-xs tracking-widest uppercase text-dark-green/70">
                            Observer Name (Codename)
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            required
                            placeholder="e.g. Agent Cooper"
                            className="w-full bg-[#f0ede6] border-b-2 border-dark-green/20 py-3 px-4 font-typewriter text-dark-green placeholder:text-dark-green/30 focus:outline-none focus:border-rust focus:bg-[#e8e5d5] transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block font-typewriter text-xs tracking-widest uppercase text-dark-green/70">
                            Return Frequency (Email)
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            required
                            placeholder="agent@overgrowth.com"
                            className="w-full bg-[#f0ede6] border-b-2 border-dark-green/20 py-3 px-4 font-typewriter text-dark-green placeholder:text-dark-green/30 focus:outline-none focus:border-rust focus:bg-[#e8e5d5] transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="block font-typewriter text-xs tracking-widest uppercase text-dark-green/70">
                            Observation Data (Message)
                        </label>
                        <div className="relative">
                            <textarea 
                                name="message" 
                                id="message"
                                rows={6}
                                required
                                placeholder="Report your findings..."
                                className="w-full bg-[#f0ede6] border border-dark-green/20 p-4 font-typewriter text-dark-green placeholder:text-dark-green/30 focus:outline-none focus:border-rust focus:bg-[#e8e5d5] transition-all duration-300 resize-none leading-relaxed"
                            />
                            {/* Lined Paper Effect */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_27px,#1a472a10_28px)] bg-[length:100%_28px] mt-1" />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-dark-green text-[#f4f1ea] py-4 font-heading text-xl tracking-widest hover:bg-rust transition-colors duration-300 relative overflow-hidden group border-2 border-transparent hover:border-rust/50"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <span>TRANSMIT REPORT</span>
                            <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity">&gt;&gt;</span>
                        </span>
                        {/* Button Texture */}
                        {/* <div className="absolute inset-0 opacity-10 bg-[url('/assets/texture_noise.png')] mix-blend-overlay" /> */}
                    </button>
                </Form>
            </div>
            
            {/* Paper Stack Effect */}
            <div className="absolute top-2 left-2 w-full h-full border border-dark-green/10 bg-[#f4f1ea] -z-10 transform rotate-1" />
        </div>

        {/* Right: Headquarters Info */}
        <div className="flex flex-col justify-center space-y-12 lg:pl-12 pt-12 lg:pt-0 relative">
            {/* Vertical Line Decoration */}
            <div className="absolute left-0 top-12 bottom-12 w-px bg-dark-green/20 hidden lg:block" />
            
            <div className="space-y-6 relative">
                <div className="absolute -left-[3.25rem] top-2 w-3 h-3 bg-rust rounded-full hidden lg:block" />
                <h2 className="font-heading text-3xl text-dark-green uppercase tracking-wider">
                    HEADQUARTERS
                </h2>
                <div className="font-body text-dark-green/80 leading-relaxed max-w-md text-lg">
                    <span>Our research facility is located in the deep overgrowth of the Pacific Northwest. Direct contact is limited due to atmospheric interference.</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <div className="group cursor-crosshair">
                    <h3 className="font-typewriter text-xs tracking-widest uppercase text-rust mb-2 group-hover:text-dark-green transition-colors">
                        Coordinates
                    </h3>
                    <p className="font-heading text-2xl text-dark-green">
                        45.5152° N, 122.6784° W
                    </p>
                    <p className="font-typewriter text-sm text-dark-green/60 mt-1">
                        Sector 7G, Portland, OR
                    </p>
                </div>

                <div className="group cursor-crosshair">
                    <h3 className="font-typewriter text-xs tracking-widest uppercase text-rust mb-2 group-hover:text-dark-green transition-colors">
                        Radio Silence
                    </h3>
                    <p className="font-heading text-2xl text-dark-green">
                        0900 - 1700 PST
                    </p>
                    <p className="font-typewriter text-sm text-dark-green/60 mt-1">
                        Mon - Fri (Earth Time)
                    </p>
                </div>

                <div className="group cursor-crosshair">
                    <h3 className="font-typewriter text-xs tracking-widest uppercase text-rust mb-2 group-hover:text-dark-green transition-colors">
                        Emergency Frequency
                    </h3>
                    <a href="mailto:help@overgrowth.com" className="font-heading text-2xl text-dark-green hover:text-rust transition-colors border-b-2 border-transparent hover:border-rust inline-block">
                        help@overgrowth.com
                    </a>
                </div>
            </div>

            {/* Decorative Map/Graphic Placeholder */}
            <div className="relative w-full h-48 border-2 border-dark-green/20 overflow-hidden opacity-80 bg-[#e8e5d5] p-2">
                <div className="w-full h-full border border-dashed border-dark-green/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#1a472a_10px,#1a472a_11px)] opacity-5" />
                    {/* Radar Sweep */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,#1a472a40_360deg)] rounded-full animate-spin duration-[4s] linear origin-center mask-radial-fade" />
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-rust rounded-full animate-ping" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-rust rounded-full" />
                    
                    <div className="absolute bottom-2 right-2 font-typewriter text-[10px] text-dark-green/60">
                        RADAR: ACTIVE
                    </div>
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
