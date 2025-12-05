import {
  json,
  type MetaArgs,
  type LinksFunction,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {getSeoMeta, Image} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {Icon} from '@iconify/react';

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
    <div className="min-h-screen bg-[#f4f1ea] relative overflow-hidden">
       {/* Texture Overlay */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />
       
       {/* Standard Header */}
       <div className="relative z-10 pt-40 pb-8 text-center px-4">
         <div className="flex justify-center mb-6">
           <div className="flex items-center gap-4">
             <div className="w-16 h-px bg-gradient-to-r from-transparent to-dark-green/30" />
             <div className="w-2 h-2 border border-rust rotate-45" />
             <div className="w-16 h-px bg-gradient-to-l from-transparent to-dark-green/30" />
           </div>
         </div>
         <span className="font-body text-xs text-dark-green/50 uppercase tracking-widest mb-4 block">Field Notes</span>
         <h1 className="font-heading text-4xl md:text-5xl text-dark-green tracking-wider mb-4 max-w-3xl mx-auto">
           {title}
         </h1>
         <div className="flex items-center justify-center gap-4 text-dark-green/60">
           <span className="font-body text-sm">{formattedDate}</span>
           {author?.name && (
             <>
               <span className="w-1 h-1 bg-dark-green/30 rounded-full" />
               <span className="font-body text-sm">by {author.name}</span>
             </>
           )}
         </div>
         <div className="w-24 h-1 bg-rust mx-auto mt-8" />
       </div>

       <div className="max-w-3xl mx-auto relative z-10 px-4 pb-24">
         {/* Tags */}
         {tags && tags.length > 0 && (
           <div className="flex flex-wrap gap-2 justify-center mb-8">
             {tags.map((tag: string) => (
               <span key={tag} className="font-body text-xs text-rust uppercase tracking-widest border border-rust/30 px-3 py-1">
                 {tag}
               </span>
             ))}
           </div>
         )}

         {/* Main Image */}
         {image && (
           <div className="relative mb-12 border border-dark-green/10 p-2 bg-[#f9f7f3]">
             <Image
               data={image}
               className="w-full h-auto"
               sizes="(min-width: 768px) 768px, 100vw"
               loading="eager"
             />
             {image.altText && (
               <p className="mt-3 text-center font-body text-xs text-dark-green/50 uppercase tracking-widest">
                 {image.altText}
               </p>
             )}
           </div>
         )}

         {/* Content */}
         <div
           dangerouslySetInnerHTML={{__html: contentHtml}}
           className="article prose prose-stone max-w-none font-body text-dark-green/80 prose-headings:font-heading prose-headings:text-dark-green prose-a:text-rust prose-blockquote:border-l-2 prose-blockquote:border-rust prose-blockquote:bg-rust/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic leading-relaxed"
         />

         {/* Related Products */}
         {relatedProducts && relatedProducts.length > 0 && (
           <div className="mt-16 pt-8 border-t border-dark-green/20">
             <div className="flex items-center gap-4 mb-8">
               <Icon icon="ph:tote-simple" className="w-6 h-6 text-rust" />
               <h3 className="font-heading text-xl text-dark-green tracking-widest">Related Finds</h3>
               <div className="flex-1 h-px bg-dark-green/20" />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {relatedProducts.map((product: any) => (
                 <Link key={product.id} to={`/products/${product.handle}`} className="group block border border-dark-green/20 p-4 hover:border-rust transition-colors bg-[#f9f7f3]">
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
                     <Icon icon="ph:arrow-right" className="w-3 h-3" />
                   </span>
                 </Link>
               ))}
             </div>
           </div>
         )}

         {/* Back to Journal */}
         <div className="mt-12 text-center">
           <Link to="/journal" className="inline-flex items-center gap-2 font-body text-sm text-dark-green/60 hover:text-rust transition-colors">
             <Icon icon="ph:arrow-left" className="w-4 h-4" />
             <span>Back to Field Notes</span>
           </Link>
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
