import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {useState} from 'react';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';

export const headers = routeHeaders;

export async function loader({request, context}: LoaderFunctionArgs) {
  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'contact',
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

export default function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Submit to our Resend-powered API endpoint
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('subject', formData.subject);
      submitData.append('message', formData.message);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json() as { success: boolean; error?: string };
      
      if (result.success) {
        setFormStatus('success');
        setFormData({name: '', email: '', subject: '', message: ''});
      } else {
        console.error('Contact form error:', result.error);
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO - Full width at top for proper header contrast */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-16 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-[#F2EFE9]/10" />
        <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-[#F2EFE9]/10" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Recovery Station
            </span>
            <div className="w-8 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl text-[#F2EFE9] tracking-[0.1em] uppercase mb-6">
            Contact
          </h1>
          
          <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto">
            Questions about artifacts, orders, or the archive? Our recovery team responds within 24-48 hours.
          </p>
        </div>
      </section>

      {/* Two column content */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div>
              <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-6">
                Coordinates
              </span>
              
              <div className="space-y-8">
                <div className="group">
                  <span className="font-mono text-[9px] text-[#8A8A84]/60 uppercase tracking-[0.3em] block mb-2">
                    Email
                  </span>
                  <a 
                    href="mailto:hello@overgrowth.co" 
                    className="font-heading text-2xl text-[#1a472a] hover:text-[#B55A3C] transition-colors"
                  >
                    hello@overgrowth.co
                  </a>
                </div>
                
                <div className="group">
                  <span className="font-mono text-[9px] text-[#8A8A84]/60 uppercase tracking-[0.3em] block mb-2">
                    Response Time
                  </span>
                  <p className="font-heading text-2xl text-[#1a472a]">
                    24-48 Hours
                  </p>
                </div>
                
                <div className="pt-8 border-t border-[#1a472a]/10">
                  <span className="font-mono text-[9px] text-[#8A8A84]/60 uppercase tracking-[0.3em] block mb-4">
                    Social
                  </span>
                  <div className="flex gap-6">
                    <a 
                      href="https://instagram.com/overgrowth.co" 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono text-sm text-[#8A8A84] hover:text-[#B55A3C] uppercase tracking-wider transition-colors"
                    >
                      Instagram
                    </a>
                    <a 
                      href="https://x.com/Overgrowthco" 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-mono text-sm text-[#8A8A84] hover:text-[#B55A3C] uppercase tracking-wider transition-colors"
                    >
                      X
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white/50 border border-[#1a472a]/10 p-8">
              <div className="mb-8">
                <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-3">
                  Send a Message
                </span>
                <h2 className="font-heading text-2xl text-[#1a472a] uppercase tracking-wide">
                  Get In Touch
                </h2>
              </div>

              {formStatus === 'success' ? (
                <div className="bg-[#1a472a]/5 border border-[#3E5F4B]/30 p-8 text-center">
                  <div className="w-12 h-12 bg-[#3E5F4B] text-[#F2EFE9] flex items-center justify-center mx-auto mb-4">
                    ✓
                  </div>
                  <span className="font-mono text-[10px] text-[#3E5F4B] tracking-[0.2em] uppercase block mb-3">
                    Message Received
                  </span>
                  <p className="font-mono text-sm text-[#8A8A84]">
                    We'll respond within 24-48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="font-mono text-[10px] text-[#8A8A84] uppercase tracking-[0.2em] block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full bg-[#F2EFE9] border border-[#1a472a]/10 px-4 py-4 font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84]/40 focus:outline-none focus:border-[#B55A3C] transition-colors"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#8A8A84] uppercase tracking-[0.2em] block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full bg-[#F2EFE9] border border-[#1a472a]/10 px-4 py-4 font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84]/40 focus:outline-none focus:border-[#B55A3C] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#8A8A84] uppercase tracking-[0.2em] block mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="w-full bg-[#F2EFE9] border border-[#1a472a]/10 px-4 py-4 font-mono text-sm text-[#1a472a] focus:outline-none focus:border-[#B55A3C] transition-colors"
                    >
                      <option value="">Select topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#8A8A84] uppercase tracking-[0.2em] block mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={5}
                      className="w-full bg-[#F2EFE9] border border-[#1a472a]/10 px-4 py-4 font-mono text-sm text-[#1a472a] placeholder:text-[#8A8A84]/40 focus:outline-none focus:border-[#B55A3C] transition-colors resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={formStatus === 'submitting'}
                    className="w-full py-5 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message →'}
                  </Button>
                </form>
              )}
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
