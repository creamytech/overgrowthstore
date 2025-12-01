import {
  json,
  type MetaArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {Section} from '~/components/Text';
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
  const {title, image, contentHtml, author, tags} = article;

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative py-32 px-4 md:px-8">
       {/* Texture Overlay */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />
       <div className="max-w-3xl mx-auto relative">
            {/* Official Report Container */}
            <div className="bg-[#f4f1ea] relative border border-dark-green/20 p-8 md:p-16 shadow-sm">
                
                {/* Header Metadata */}
                <div className="relative z-10 border-b-2 border-dark-green/20 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block px-2 py-1 border border-dark-green/30 font-body text-[10px] tracking-widest uppercase text-dark-green bg-[#f4f1ea]">
                                OBSERVATION LOG
                            </span>
                            <span className="font-body text-[10px] tracking-widest uppercase text-dark-green/60">
                                CASE FILE #{article.id.substring(article.id.length - 6)}
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl text-dark-green leading-tight mb-4">
                            {title}
                        </h1>
                        {/* Tags */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag: string) => (
                                    <span key={tag} className="font-mono text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-2 py-0.5">
                                        [{tag}]
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="block font-body text-[10px] tracking-widest uppercase text-dark-green/50 mb-1">
                            Date Recorded
                        </span>
                        <span className="font-body text-sm text-dark-green border-b border-dark-green/20 pb-1">
                            {formattedDate}
                        </span>
                    </div>
                </div>

                {/* Main Image (Specimen Style) */}
                {image && (
                    <div className="relative z-10 mb-12 w-full border border-dark-green/10 p-2 bg-[#f4f1ea]">
                        <Image
                            data={image}
                            className="w-full h-auto mix-blend-multiply filter contrast-110 sepia-[0.1]"
                            sizes="90vw"
                            loading="eager"
                        />
                        <div className="mt-2 flex justify-between items-center px-2">
                             <p className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                                FIG A. {image.altText || 'Visual Evidence'}
                            </p>
                             <p className="font-body text-[10px] uppercase tracking-widest text-dark-green/40">
                                ATTACHMENT 01
                            </p>
                        </div>
                    </div>
                )}

                {/* Content (Typewriter) */}
                <div
                    dangerouslySetInnerHTML={{__html: contentHtml}}
                    className="article relative z-10 prose prose-stone max-w-none font-body text-ink/80 prose-headings:font-heading prose-headings:text-dark-green prose-a:text-rust prose-blockquote:border-l-2 prose-blockquote:border-rust prose-blockquote:bg-rust/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic"
                />

                {/* Related Artifact (Product Tie-in) */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="relative z-10 mt-16 pt-8 border-t border-dashed border-dark-green/30">
                        <h3 className="font-heading text-xl text-dark-green mb-6 tracking-widest text-center">
                            RELATED ARTIFACTS
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {relatedProducts.map((product: any) => (
                                <Link key={product.id} to={`/products/${product.handle}`} className="group block border border-dark-green/20 p-4 hover:border-rust transition-colors">
                                    <div className="aspect-square bg-[#f4f1ea] mb-4 relative overflow-hidden">
                                        {product.featuredImage && (
                                            <Image 
                                                data={product.featuredImage} 
                                                className="object-contain w-full h-full mix-blend-multiply filter contrast-110 sepia-[0.1] group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <h4 className="font-heading text-lg text-dark-green group-hover:text-rust transition-colors uppercase truncate">
                                        {product.title}
                                    </h4>
                                    <span className="font-body text-xs text-dark-green/60 tracking-widest uppercase">
                                        Acquire Asset &rarr;
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Signature */}
                <div className="relative z-10 mt-16 pt-8 border-t border-dashed border-dark-green/30 flex justify-between items-end">
                    <div>
                         <span className="block font-body text-[10px] uppercase tracking-widest text-dark-green/50 mb-2">
                            Status
                        </span>
                        <span className="font-heading text-lg text-dark-green">
                            ARCHIVED
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block font-body text-[10px] uppercase tracking-widest text-dark-green/50 mb-2">
                            Logged By
                        </span>
                        <span className="font-heading text-xl text-dark-green block border-b border-dark-green/30 pb-1 px-4">
                            {author?.name || 'The Botanist'}
                        </span>
                    </div>
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
        author: authorV2 {
          name
        }
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
