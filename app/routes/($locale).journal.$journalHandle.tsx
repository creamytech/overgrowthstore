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
    <div className="min-h-screen relative overflow-hidden py-32 md:py-40 px-4">
      {/* Back Link - Top */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link to="/journal" className="inline-flex items-center gap-2 font-body text-sm text-dark-green/60 hover:text-rust transition-colors">
          <Icons.ArrowLeft className="w-4 h-4" />
          <span>Back to Field Notes</span>
        </Link>
      </div>

      {/* Journal Entry Container */}
      <article className="max-w-4xl mx-auto relative">
        {/* Paper effect with shadow */}
        <div className="bg-[#faf8f4] border border-rust/20 shadow-xl relative">
          {/* Binding holes decoration */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 flex flex-col justify-start pt-16 gap-12 pointer-events-none">
            <div className="w-3 h-3 rounded-full border-2 border-rust/30 bg-[#f4f1ea]" />
            <div className="w-3 h-3 rounded-full border-2 border-rust/30 bg-[#f4f1ea]" />
            <div className="w-3 h-3 rounded-full border-2 border-rust/30 bg-[#f4f1ea]" />
          </div>

          {/* Red margin line */}
          <div className="absolute left-12 md:left-20 top-0 bottom-0 w-px bg-rust/20" />

          {/* Content area */}
          <div className="pl-16 md:pl-28 pr-6 md:pr-12 py-10 md:py-16">
            
            {/* Entry Header */}
            <header className="mb-10 pb-8 border-b border-dashed border-dark-green/20">
              {/* Date stamp */}
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 bg-dark-green text-[#f4f1ea] font-body text-xs tracking-widest uppercase">
                  Field Entry
                </div>
                <span className="font-body text-sm text-dark-green/60">{formattedDate}</span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl md:text-4xl text-dark-green tracking-wide leading-tight mb-6">
                {title}
              </h1>

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span key={tag} className="font-body text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image - Polaroid style */}
            {image && (
              <figure className="mb-10 -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-white p-3 pb-12 shadow-lg border border-dark-green/10 inline-block max-w-full md:max-w-md">
                  <Image
                    data={image}
                    className="w-full h-auto"
                    sizes="(min-width: 768px) 400px, 100vw"
                    loading="eager"
                  />
                  {image.altText && (
                    <p className="mt-4 text-center font-handwritten text-lg text-dark-green/70">
                      {image.altText}
                    </p>
                  )}
                </div>
              </figure>
            )}

            {/* Article Content - Lined paper effect */}
            <div className="relative">
              {/* Subtle lined paper background */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(26, 71, 42, 0.1) 28px)',
                  backgroundSize: '100% 28px',
                }}
              />
              
              <div
                dangerouslySetInnerHTML={{__html: contentHtml}}
                className="article relative prose prose-stone max-w-none font-body text-dark-green/85 leading-[1.9] prose-headings:font-heading prose-headings:text-dark-green prose-headings:tracking-wide prose-p:my-4 prose-a:text-rust prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-rust prose-blockquote:bg-rust/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:font-handwritten prose-blockquote:text-xl prose-strong:text-dark-green prose-ul:list-disc prose-li:my-1"
              />
            </div>

            {/* Entry Footer - Signature */}
            <footer className="mt-12 pt-8 border-t border-dashed border-dark-green/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-handwritten text-2xl text-dark-green/60 mb-1">
                    — Field Notes Archive
                  </p>
                  <p className="font-body text-xs text-dark-green/40 uppercase tracking-widest">
                    Overgrowth Research Division
                  </p>
                </div>
                <div className="w-16 h-16 border border-rust/30 flex items-center justify-center opacity-40">
                  <Icons.Compass className="w-8 h-8 text-rust" />
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Paper shadow/stack effect */}
        <div className="absolute -bottom-1 left-2 right-2 h-4 bg-[#f0ede6] border-x border-b border-rust/10 -z-10" />
        <div className="absolute -bottom-2 left-4 right-4 h-4 bg-[#ebe8e0] border-x border-b border-rust/10 -z-20" />
      </article>

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-rust/30">
          <div className="flex items-center gap-4 mb-8">
            <Icons.ShoppingBag className="w-5 h-5 text-rust" />
            <h3 className="font-heading text-lg text-dark-green tracking-widest uppercase">Related Finds</h3>
            <div className="flex-1 h-px bg-rust/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedProducts.map((product: any) => (
              <Link key={product.id} to={`/products/${product.handle}`} className="group block border border-rust/20 p-4 hover:border-rust transition-colors bg-[#faf8f4]">
                <div className="aspect-square bg-[#f4f1ea] mb-4 relative overflow-hidden">
                  {product.featuredImage && (
                    <Image 
                      data={product.featuredImage} 
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <h4 className="font-heading text-lg text-dark-green group-hover:text-rust transition-colors">
                  {product.title}
                </h4>
                <span className="font-body text-xs text-dark-green/60 tracking-widest uppercase flex items-center gap-2 mt-2">
                  <span>View Product</span>
                  <Icons.ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
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
