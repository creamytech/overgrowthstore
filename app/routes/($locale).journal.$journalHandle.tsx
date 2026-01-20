import {
  json,
  type MetaArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {Icons} from '~/components/InlineIcons';

import {Link} from '~/components/Link';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

import styles from '../styles/custom-font.css?url';

const BLOG_HANDLE = 'journal';

export const headers = routeHeaders;

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  invariant(params.journalHandle, 'Missing journal handle');

  const {blog, products} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      articleHandle: params.journalHandle,
      language,
    },
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article?.publishedAt!));

  const seo = seoPayload.article({article, url: request.url});

  return json({article, formattedDate, seo, relatedProducts: products.nodes});
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Article() {
  const {article, formattedDate, relatedProducts} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, tags} = article;

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO - Dark header matching /journal index */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
        </div>
        
        {/* Corner accents - hidden on mobile */}
        <div className="hidden md:block absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#F2EFE9]/20" />
        <div className="hidden md:block absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#F2EFE9]/20" />
        
        <div className="relative max-w-4xl mx-auto px-6">
          {/* Back Link */}
          <Link 
            to="/journal" 
            className="inline-flex items-center gap-2 font-mono text-xs text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors mb-8 uppercase tracking-widest"
          >
            <Icons.ArrowLeft className="w-4 h-4" />
            <span>Back to Field Notes</span>
          </Link>
          
          {/* Header Content */}
          <div className="text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                Field Note
              </span>
              <div className="w-12 h-px bg-[#B55A3C]" />
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-[#F2EFE9] tracking-[0.08em] uppercase mb-6 leading-tight">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="font-mono text-sm text-[#F2EFE9]/50">
                {formattedDate}
              </span>
              
              {tags && tags.length > 0 && (
                <>
                  <span className="text-[#F2EFE9]/30">•</span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {tags.map((tag: string) => (
                      <span 
                        key={tag} 
                        className="font-mono text-[10px] text-[#B55A3C] uppercase tracking-widest border border-[#B55A3C]/30 px-3 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image - Full bleed */}
      {image && (
        <div className="relative -mt-8 mb-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-4 shadow-xl border border-[#1a472a]/10">
              <Image
                data={image}
                className="w-full h-auto"
                sizes="(min-width: 1024px) 800px, 100vw"
                loading="eager"
              />
              {image.altText && (
                <p className="mt-4 text-center font-mono text-xs text-[#8A8A84] uppercase tracking-wider">
                  {image.altText}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="py-12 md:py-16 px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Content */}
          <div
            dangerouslySetInnerHTML={{__html: contentHtml}}
            className="article prose prose-lg max-w-none 
              font-mono text-[#1a472a]/85 leading-relaxed
              prose-headings:font-heading prose-headings:text-[#1a472a] prose-headings:tracking-wide prose-headings:uppercase
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-[#1a472a]/10 prose-h2:pb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:my-5 prose-p:text-sm
              prose-a:text-[#B55A3C] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-[#B55A3C] prose-blockquote:bg-[#B55A3C]/5 
              prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic 
              prose-blockquote:font-heading prose-blockquote:text-lg prose-blockquote:text-[#1a472a]
              prose-strong:text-[#1a472a] prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:text-sm
              prose-ol:list-decimal prose-ol:pl-6
              prose-hr:border-[#1a472a]/10 prose-hr:my-10"
          />

          {/* Entry Footer */}
          <footer className="mt-16 pt-8 border-t border-[#1a472a]/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading text-lg text-[#1a472a]/60 uppercase tracking-wider mb-1">
                  — Field Notes Archive
                </p>
                <p className="font-mono text-[10px] text-[#8A8A84] uppercase tracking-widest">
                  Overgrowth · Est. 2026
                </p>
              </div>
              <div className="w-12 h-12 border border-[#B55A3C]/20 flex items-center justify-center">
                <Icons.Compass className="w-6 h-6 text-[#B55A3C]/40" />
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="py-16 px-6 bg-[#0a0a0a]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-8 h-px bg-[#B55A3C]" />
              <h3 className="font-mono text-[10px] text-[#F2EFE9]/50 tracking-[0.3em] uppercase">
                Related Finds
              </h3>
              <div className="flex-1 h-px bg-[#F2EFE9]/10" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProducts.map((product: any) => (
                <Link 
                  key={product.id} 
                  to={`/products/${product.handle}`} 
                  className="group block bg-[#1a1a1a] border border-[#F2EFE9]/10 p-4 hover:border-[#B55A3C]/50 transition-colors"
                >
                  <div className="aspect-square bg-[#0a0a0a] mb-4 relative overflow-hidden">
                    {product.featuredImage && (
                      <Image 
                        data={product.featuredImage} 
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <h4 className="font-heading text-lg text-[#F2EFE9] group-hover:text-[#B55A3C] transition-colors uppercase tracking-wide">
                    {product.title}
                  </h4>
                  <span className="font-mono text-[10px] text-[#F2EFE9]/40 tracking-widest uppercase flex items-center gap-2 mt-3">
                    <span>View Product</span>
                    <Icons.ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Article Navigation */}
      <div className="py-8 px-6 bg-[#F2EFE9] border-t border-[#1a472a]/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <Link 
              to="/journal"
              className="group flex items-center gap-2 font-mono text-xs tracking-widest text-[#1a472a]/60 hover:text-[#B55A3C] transition-colors uppercase"
            >
              <Icons.ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>All Field Notes</span>
            </Link>
            <Link 
              to="/products"
              className="group flex items-center gap-2 font-mono text-xs tracking-widest text-[#1a472a]/60 hover:text-[#B55A3C] transition-colors uppercase"
            >
              <span>Shop the Archive</span>
              <Icons.ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const ARTICLE_QUERY = `#graphql
  query ArticleDetails(
    $language: LanguageCode
    $blogHandle: String!
    $articleHandle: String!
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        id
        title
        contentHtml
        publishedAt
        tags
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
    products(first: 2, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        featuredImage {
          id
          url
          altText
          width
          height
        }
      }
    }
  }
`;
