import {type MetaArgs} from '@remix-run/react';
import {Link, useLoaderData} from '@remix-run/react';
import {Image, Money, getSeoMeta} from '@shopify/hydrogen';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {motion} from 'framer-motion';
import {seoPayload} from '~/lib/seo.server';
import {Spotlight} from '~/components/ui/spotlight';

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  
  // Get all products sorted by creation date
  const {products} = await storefront.query(ARCHIVE_QUERY);
  
  const seo = seoPayload.page({
    page: {title: 'Drop Archive', seo: {title: 'Drop Archive | Overgrowth', description: 'Once sold out, our pieces are permanently archived. Browse past releases to see what you missed.'}},
    url: request.url,
  });
  
  return {products: products.nodes, seo};
}

export default function DropArchive() {
  const {products} = useLoaderData<typeof loader>();
  
  // Separate products by actual availability status from Shopify
  const currentProducts = products.filter((p: any) => p.availableForSale);
  const archivedProducts = products.filter((p: any) => !p.availableForSale);
  
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero with Spotlight */}
      <section className="relative bg-[#0a0a0a] py-24 md:py-32 overflow-hidden">
        <Spotlight 
          className="-top-40 left-0 md:left-60 md:-top-20" 
          fill="#B55A3C" 
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase block mb-6">
            Past Releases
          </span>
          <h1 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] uppercase tracking-[0.1em] mb-6">
            Drop Archive
          </h1>
          <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-lg mx-auto">
            Once sold out, our pieces are permanently archived. 
            Browse past releases to see what you missed.
          </p>
        </div>
      </section>

      {/* Current Drops */}
      {currentProducts.length > 0 && (
        <section className="py-20 bg-[#0a0a0a] border-b border-[#F2EFE9]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              <h2 className="font-heading text-2xl text-[#F2EFE9] uppercase tracking-wide">
                Available Now
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  viewport={{once: true}}
                  transition={{delay: index * 0.1}}
                >
                  <Link to={`/products/${product.handle}`} className="group block">
                    <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-4">
                      {product.featuredImage && (
                        <Image
                          data={product.featuredImage}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="25vw"
                        />
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-[#22c55e] text-white font-mono text-[9px] uppercase tracking-wider">
                          In Stock
                        </span>
                      </div>
                    </div>
                    <h3 className="font-heading text-sm text-[#F2EFE9] uppercase tracking-wide mb-1 group-hover:text-[#B55A3C] transition-colors">
                      {product.title}
                    </h3>
                    <span className="font-mono text-sm text-[#F2EFE9]/60">
                      <Money data={product.priceRange.minVariantPrice} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Archived Drops */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-[10px] text-[#F2EFE9]/30 tracking-wider">ARCHIVED</span>
            <div className="flex-1 h-px bg-[#F2EFE9]/10" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {archivedProducts.map((product: any, index: number) => (
              <motion.div
                key={product.id}
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{delay: index * 0.1}}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-4">
                  {product.featuredImage && (
                    <Image
                      data={product.featuredImage}
                      className="w-full h-full object-cover opacity-50 grayscale"
                      sizes="25vw"
                    />
                  )}
                  
                  {/* Sold Out Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-6 py-3 bg-[#0a0a0a]/80 border border-[#F2EFE9]/20">
                      <span className="font-mono text-xs text-[#F2EFE9]/60 uppercase tracking-widest">
                        Sold Out
                      </span>
                    </div>
                  </div>
                  
                  {/* Archive stamp */}
                  <div className="absolute top-3 right-3">
                    <span className="font-mono text-[9px] text-[#B55A3C]/60 uppercase tracking-wider">
                      Archived
                    </span>
                  </div>
                </div>
                
                <h3 className="font-heading text-sm text-[#F2EFE9]/40 uppercase tracking-wide mb-1 line-through">
                  {product.title}
                </h3>
                <span className="font-mono text-sm text-[#F2EFE9]/20">
                  <Money data={product.priceRange.minVariantPrice} />
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Waitlist CTA */}
          <div className="mt-16 text-center">
            <p className="font-mono text-sm text-[#F2EFE9]/40 mb-6">
              Want to be notified about future drops?
            </p>
            <Link 
              to="/#newsletter"
              className="inline-flex items-center gap-3 px-8 py-4 border border-[#B55A3C] text-[#B55A3C] font-mono text-xs uppercase tracking-wider hover:bg-[#B55A3C] hover:text-[#F2EFE9] transition-colors"
            >
              Join the Waitlist
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const ARCHIVE_QUERY = `#graphql
  query ArchiveProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 20, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        availableForSale
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
