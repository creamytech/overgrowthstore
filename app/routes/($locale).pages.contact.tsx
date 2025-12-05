import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Form} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import {Icon} from '@iconify/react';

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
              
              <Form method="post" action="/contact" className="space-y-6">
                <div>
                  <label className="font-body text-xs text-dark-green/60 uppercase tracking-widest mb-2 block">
                    Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    required
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
                    placeholder="What's on your mind?"
                    className="w-full bg-[#f4f1ea] border border-dark-green/20 p-4 font-body text-dark-green focus:outline-none focus:border-rust transition-colors resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-dark-green text-[#f4f1ea] py-4 font-heading tracking-widest hover:bg-rust transition-colors flex items-center justify-center gap-3"
                >
                  <span>Send Message</span>
                  <Icon icon="ph:paper-plane-tilt" className="w-5 h-5" />
                </button>
              </Form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
                <Icon icon="ph:envelope-simple" className="w-8 h-8 text-rust mb-4" />
                <h3 className="font-heading text-lg text-dark-green mb-2">Email</h3>
                <a href="mailto:hello@overgrowth.com" className="font-body text-dark-green/70 hover:text-rust transition-colors">
                  hello@overgrowth.com
                </a>
              </div>
              
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
                <Icon icon="ph:clock" className="w-8 h-8 text-rust mb-4" />
                <h3 className="font-heading text-lg text-dark-green mb-2">Hours</h3>
                <p className="font-body text-dark-green/70">
                  Mon – Fri, 9am – 5pm EST
                </p>
              </div>
              
              <div className="bg-[#f9f7f3] border border-dark-green/20 p-8">
                <Icon icon="ph:map-pin" className="w-8 h-8 text-rust mb-4" />
                <h3 className="font-heading text-lg text-dark-green mb-2">Location</h3>
                <p className="font-body text-dark-green/70">
                  Fort Lauderdale, FL
                </p>
              </div>
              
              {/* Social Links */}
              <div className="bg-dark-green p-8">
                <h3 className="font-heading text-lg text-[#f4f1ea] mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {['instagram', 'twitter', 'tiktok'].map((social) => (
                    <a 
                      key={social}
                      href={`https://${social}.com/overgrowth`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#f4f1ea]/10 flex items-center justify-center hover:bg-rust transition-colors"
                    >
                      <Icon icon={`ph:${social === 'twitter' ? 'x-logo' : `${social}-logo`}`} className="w-5 h-5 text-[#f4f1ea]" />
                    </a>
                  ))}
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
