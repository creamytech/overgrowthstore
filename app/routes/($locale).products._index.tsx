import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination,
  getPaginationVariables,
  getSeoMeta,
} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {motion} from 'framer-motion';

import {Section} from '~/components/Text';
import {ProductCard} from '~/components/ProductCard';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({
  request,
  context: {storefront},
}: LoaderFunctionArgs) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'All the store products',
      description: 'All the store products',
      seo: {
        title: 'All Products',
        description: 'All the store products',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });

  return json({
    products: data.products,
    seo,
  });
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />

      {/* Decorative Botanical Elements */}
      <div className="absolute top-32 left-0 w-64 h-64 opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full text-dark-green">
          <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 40 Q140 60 160 40" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 60 Q60 80 40 60" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 80 Q150 100 170 80" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 100 Q50 120 30 100" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="160" cy="40" r="8" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="40" cy="60" r="6" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <circle cx="170" cy="80" r="5" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-48 right-0 w-48 h-48 opacity-[0.04] pointer-events-none rotate-180">
        <svg viewBox="0 0 200 200" className="w-full h-full text-dark-green">
          <path d="M100 20 Q120 60 100 100 Q80 140 100 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 50 Q130 70 150 50" stroke="currentColor" strokeWidth="0.5" fill="none"/>
          <path d="M100 90 Q70 110 50 90" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        </svg>
      </div>

      {/* Standard Header - Kept as requested */}
      <motion.div 
        className="relative z-10 pt-40 pb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
            <div className="w-2 h-2 border border-rust rotate-45" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
          </div>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-4 uppercase">
          Recovered Works
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
          Artifacts unearthed from the frontier
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </motion.div>

      {/* Field Notes Quote - Mid-page storytelling element */}
      <motion.div 
        className="relative z-10 max-w-2xl mx-auto px-8 py-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="relative inline-block">
          <span className="absolute -left-6 -top-2 text-4xl text-rust/30 font-serif">"</span>
          <p className="font-body text-dark-green/70 italic text-lg leading-relaxed">
            Each piece tells a story of reclamation — where nature's patience meets human craft.
          </p>
          <span className="absolute -right-6 -bottom-4 text-4xl text-rust/30 font-serif">"</span>
        </div>
        <p className="font-heading text-xs text-dark-green/40 tracking-[0.3em] uppercase mt-6">
          — Field Notes, Entry 47
        </p>
      </motion.div>

      <Section padding="x" className="relative z-10 pb-32">
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const itemsMarkup = nodes.map((product, i) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <ProductCard
                  product={product as ProductCardFragment}
                  loading={getImageLoadingPriority(i)}
                  index={i}
                />
              </motion.div>
            ));

            return (
              <>
                <div className="flex items-center justify-center mb-12">
                  <PreviousLink className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-heading font-bold text-dark-green transition-all duration-300 bg-transparent border-2 border-dark-green hover:text-[#f4f1ea]">
                    <span className="absolute inset-0 w-full h-full bg-dark-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">{isLoading ? 'Loading...' : '← Previous'}</span>
                  </PreviousLink>
                </div>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 md:gap-12 px-4 md:px-0"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {itemsMarkup}
                </motion.div>

                {/* Decorative Divider before Load More */}
                <div className="flex justify-center items-center gap-4 my-16">
                  <div className="w-24 h-px bg-gradient-to-r from-transparent to-rust/30" />
                  <div className="w-1.5 h-1.5 bg-rust/40 rotate-45" />
                  <div className="w-24 h-px bg-gradient-to-l from-transparent to-rust/30" />
                </div>

                <div className="flex items-center justify-center">
                  <NextLink className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-heading font-bold text-dark-green transition-all duration-300 bg-transparent border-2 border-dark-green hover:text-[#f4f1ea]">
                    <span className="absolute inset-0 w-full h-full bg-dark-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
                    <span className="relative z-10">{isLoading ? 'Loading...' : 'Load More →'}</span>
                  </NextLink>
                </div>

                {/* Bottom Botanical Accent */}
                <div className="flex justify-center mt-20 opacity-[0.06]">
                  <svg viewBox="0 0 300 60" className="w-48 h-12 text-dark-green">
                    <path d="M50 30 Q100 10 150 30 Q200 50 250 30" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="150" cy="30" r="4" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                    <path d="M140 25 Q150 15 160 25" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                    <path d="M140 35 Q150 45 160 35" stroke="currentColor" strokeWidth="0.5" fill="none"/>
                  </svg>
                </div>
              </>
            );
          }}
        </Pagination>
      </Section>
    </div>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
