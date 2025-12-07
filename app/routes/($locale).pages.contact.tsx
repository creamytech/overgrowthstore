import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Icons} from '~/components/InlineIcons';
import {useState} from 'react';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'contact',
      language: context.storefront.i18n.language,
    },
  });

  const seo = page 
    ? seoPayload.page({page, url: request.url})
    : {title: 'Contact | Overgrowth', description: 'Get in touch with us.'};

  return json({page, seo});
}

export const meta = ({matches}: any) => {
  return getSeoMeta(...matches.map((match: any) => match.data.seo));
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
    orderNumber: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const mailtoSubject = encodeURIComponent(`[${formData.subject}] Contact from ${formData.name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
    );
    
    window.location.href = `mailto:customerservice@overgrowth.co?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  // Input class for ruled-line style
  const inputClass = "w-full bg-transparent border-0 border-b-2 border-dark-green/20 p-4 font-mono text-dark-green focus:outline-none focus:border-rust transition-colors placeholder:text-dark-green/30";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header - "The Transmission" */}
      <div className="relative z-10 pt-40 pb-12 text-center px-4">
        {/* Pulsing Signal Dot */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="relative">
            <div className="w-3 h-3 bg-dark-green rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-dark-green rounded-full animate-ping opacity-50" />
          </div>
          <span className="font-body text-xs text-dark-green/60 uppercase tracking-[0.3em]">Signal Active</span>
        </div>
        
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          Establish Connection
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-lg mx-auto">
          The network is quiet, but we are listening.<br />
          Transmit coordinates, inquiries, or discoveries below.
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-2xl mx-auto">
          
          {/* Contact Form - "Field Report" Style */}
          <div className="bg-[#f9f7f3] border border-dark-green/20 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-heading text-sm text-dark-green uppercase tracking-widest">Field Report</span>
              <div className="flex-1 h-px bg-dark-green/20" />
              <span className="font-mono text-xs text-dark-green/40">FORM-001</span>
            </div>
            
            {submitted ? (
              <div className="text-center py-12">
                <Icons.Check className="w-12 h-12 text-dark-green mx-auto mb-4" />
                <p className="font-heading text-lg text-dark-green mb-2">Transmission Sent</p>
                <p className="font-body text-sm text-dark-green/60">
                  Complete sending in your mail client.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-6 font-mono text-xs text-rust hover:underline uppercase tracking-widest"
                >
                  [ New Transmission ]
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="font-mono text-[10px] text-dark-green/50 uppercase tracking-widest mb-2 block">
                  Callsign <span className="text-rust">*</span>
                </label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={inputClass}
                  placeholder="Your designation"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-dark-green/50 uppercase tracking-widest mb-2 block">
                  Frequency <span className="text-rust">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={inputClass}
                  placeholder="signal@coordinates.net"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-dark-green/50 uppercase tracking-widest mb-2 block">
                  Classification
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className={inputClass + " cursor-pointer"}
                >
                  <option>General Inquiry</option>
                  <option>Supply Drop Status</option>
                  <option>Exchange Request</option>
                  <option>Collaboration Proposal</option>
                  <option>Field Report</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] text-dark-green/50 uppercase tracking-widest mb-2 block">
                  Reference # (optional)
                </label>
                <input 
                  type="text" 
                  name="orderNumber" 
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                  className={inputClass}
                  placeholder="#OG-12345"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] text-dark-green/50 uppercase tracking-widest mb-2 block">
                  Transmission <span className="text-rust">*</span>
                </label>
                <textarea 
                  name="message" 
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Begin transmission..."
                  className={inputClass + " resize-none"}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-dark-green text-[#f4f1ea] py-4 font-heading tracking-widest hover:bg-rust transition-colors flex items-center justify-center gap-3 uppercase"
              >
                <span>Transmit</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </form>
            )}

            {/* Monitor Frequencies - Social Links */}
            <div className="mt-10 pt-8 border-t border-dark-green/10">
              <p className="font-mono text-[10px] text-dark-green/40 uppercase tracking-widest mb-4 text-center">
                Monitor Frequencies
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://instagram.com/overgrowth.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-dark-green/20 flex items-center justify-center hover:border-rust hover:text-rust transition-colors group"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-dark-green/50 group-hover:text-rust transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                  </svg>
                </a>
                <a 
                  href="https://x.com/Overgrowthco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-dark-green/20 flex items-center justify-center hover:border-rust hover:text-rust transition-colors group"
                  aria-label="X (Twitter)"
                >
                  <svg className="w-5 h-5 text-dark-green/50 group-hover:text-rust transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:customerservice@overgrowth.co"
                  className="w-10 h-10 border border-dark-green/20 flex items-center justify-center hover:border-rust hover:text-rust transition-colors group"
                  aria-label="Email"
                >
                  <svg className="w-5 h-5 text-dark-green/50 group-hover:text-rust transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8l9-4 9 4"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Ruin Coordinates */}
          <div className="mt-8 text-center">
            <p className="font-mono text-[10px] text-dark-green/30 uppercase tracking-widest mb-1">
              Signal Origin
            </p>
            <p className="font-mono text-xs text-dark-green/50">
              42.3314° N, 83.0458° W — Michigan Central Station Ruins
            </p>
          </div>
        </div>
      </div>

      {/* Inline styles for focus states */}
      <style>{`
        input:focus, textarea:focus, select:focus {
          border-bottom-color: #c05a34 !important;
          border-bottom-width: 2px;
        }
      `}</style>
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
