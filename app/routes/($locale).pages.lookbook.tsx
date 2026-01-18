import {type MetaArgs} from '@remix-run/react';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Money, getSeoMeta} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {motion} from 'framer-motion';
import {seoPayload} from '~/lib/seo.server';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Get products for the lookbook
  const {products} = await storefront.query(LOOKBOOK_QUERY);
  
  const seo = seoPayload.page({
    page: {title: 'Lookbook', seo: {title: 'Lookbook | Overgrowth', description: 'Styling inspiration from the archive. Each piece photographed in its natural environment.'}},
    url: request.url,
  });
  
  return {products: products.nodes, seo};
}

export default function Lookbook() {
  const {products} = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="font-mono text-[9px] text-[#B55A3C] tracking-[0.5em] uppercase block mb-6"
          >
            Season One
          </motion.span>
          <motion.h1 
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3}}
            className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#F2EFE9] uppercase tracking-[0.15em]"
          >
            Lookbook
          </motion.h1>
          <motion.p
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.5}}
            className="font-mono text-sm text-[#F2EFE9]/50 mt-8 max-w-md mx-auto"
          >
            Styling inspiration from the archive. Each piece photographed in its natural environment.
          </motion.p>
        </div>
      </section>

      {/* Editorial Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Masonry-style grid */}
          <div className="grid md:grid-cols-2 gap-1">
            {products.slice(0, 8).map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{opacity: 0, y: 40}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{delay: index * 0.1}}
                className={`group relative ${index % 3 === 0 ? 'md:col-span-2' : ''}`}
              >
                <Link to={`/products/${product.handle}`}>
                  <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/5]'}`}>
                    {product.featuredImage && (
                      <Image
                        data={product.featuredImage}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={index % 3 === 0 ? '100vw' : '50vw'}
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-mono text-[10px] text-[#B55A3C] uppercase tracking-wider mb-2">
                        {product.productType || 'Apparel'}
                      </span>
                      <h3 className="font-heading text-2xl md:text-3xl text-[#F2EFE9] uppercase tracking-wide mb-2">
                        {product.title}
                      </h3>
                      <span className="font-mono text-sm text-[#F2EFE9]/70">
                        <Money data={product.priceRange.minVariantPrice} />
                      </span>
                    </div>
                    
                    {/* Corner accents on hover */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <Link 
          to="/products"
          className="inline-flex items-center gap-4 px-10 py-5 border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-sm uppercase tracking-wider hover:border-[#B55A3C] hover:text-[#B55A3C] transition-colors"
        >
          Shop All Pieces
          <span>→</span>
        </Link>
      </section>
    </div>
  );
}

const LOOKBOOK_QUERY = `#graphql
  query LookbookProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        productType
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
