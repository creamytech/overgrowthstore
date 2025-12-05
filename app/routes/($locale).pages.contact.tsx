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
          Contact
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
          Questions, ideas, or just want to say hello?
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Form */}
            <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
              <h2 className="font-heading text-xl text-dark-green mb-6">Send a Message</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <Icons.Check className="w-12 h-12 text-dark-green mx-auto mb-4" />
                  <p className="font-heading text-lg text-dark-green mb-2">Email Client Opened!</p>
                  <p className="font-body text-sm text-dark-green/60">
                    Complete sending the email in your mail app.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 font-body text-xs text-rust underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-body text-xs text-dark-green/60 uppercase tracking-widest mb-2 block">
                    Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#f4f1ea] border border-dark-green/20 p-4 font-body text-dark-green focus:outline-none focus:border-rust transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-dark-green/60 uppercase tracking-widest mb-2 block">
                    Email
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#f4f1ea] border border-dark-green/20 p-4 font-body text-dark-green focus:outline-none focus:border-rust transition-colors"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label className="font-body text-xs text-dark-green/60 uppercase tracking-widest mb-2 block">
                    Subject
                  </label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#f4f1ea] border border-dark-green/20 p-4 font-body text-dark-green focus:outline-none focus:border-rust transition-colors"
                  >
                    <option>General Question</option>
                    <option>Order Inquiry</option>
                    <option>Return Request</option>
                    <option>Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-body text-xs text-dark-green/60 uppercase tracking-widest mb-2 block">
                    Message
                  </label>
                  <textarea 
                    name="message" 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="What's on your mind?"
                    className="w-full bg-[#f4f1ea] border border-dark-green/20 p-4 font-body text-dark-green focus:outline-none focus:border-rust transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-dark-green text-[#f4f1ea] py-4 font-heading tracking-widest hover:bg-rust transition-colors flex items-center justify-center gap-3"
                >
                  <span>Send Message</span>
                  <Icons.PaperPlane className="w-5 h-5" />
                </button>
              </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
                <Icons.Envelope className="w-8 h-8 text-rust mb-4" />
                <h3 className="font-heading text-lg text-dark-green mb-2">Email</h3>
                <a href="mailto:customerservice@overgrowth.co" className="font-body text-dark-green/70 hover:text-rust transition-colors">
                  customerservice@overgrowth.co
                </a>
                <p className="font-body text-xs text-dark-green/50 mt-3">
                  We typically respond within 24-48 hours.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="bg-dark-green p-8">
                <h3 className="font-heading text-lg text-[#f4f1ea] mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com/overgrowth.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#f4f1ea]/10 flex items-center justify-center hover:bg-rust transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 text-[#f4f1ea]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://x.com/Overgrowthco"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#f4f1ea]/10 flex items-center justify-center hover:bg-rust transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-5 h-5 text-[#f4f1ea]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
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
