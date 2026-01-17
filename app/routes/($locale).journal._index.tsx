import {
  json,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {flattenConnection, getSeoMeta, Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {Icon} from '@iconify/react';

import {Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import type {ArticleFragment} from 'storefrontapi.generated';


const BLOG_HANDLE = 'Journal';

export const headers = routeHeaders;

export const loader = async ({
  request,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const {language, country} = storefront.i18n;
  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: BLOG_HANDLE,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  const articles = flattenConnection(blog.articles).map((article) => {
    const {publishedAt} = article!;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt!)),
    };
  });

  const seo = seoPayload.blog({blog, url: request.url});

  return json({articles, seo});
};

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Journals() {
  const {articles} = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* HERO - Dark header matching other pages */}
      <section className="relative bg-[#0a0a0a] pt-32 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }} />
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-[#F2EFE9]/20" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-[#F2EFE9]/20" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Dispatches
            </span>
            <div className="w-12 h-px bg-[#B55A3C]" />
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-[#F2EFE9] tracking-[0.1em] uppercase mb-6">
            Field Notes
          </h1>
          
          <p className="font-mono text-sm text-[#F2EFE9]/50 max-w-md mx-auto leading-relaxed">
            Observations, stories, and discoveries from the quiet places
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <JournalCard
                blogHandle={BLOG_HANDLE.toLowerCase()}
                article={article}
                key={article.id}
                loading={getImageLoadingPriority(i, 2)}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function JournalCard({
  blogHandle,
  article,
  loading,
  index,
}: {
  blogHandle: string;
  article: ArticleFragment;
  loading?: HTMLImageElement['loading'];
  index: number;
}) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group h-full"
    >
      <Link to={`/${blogHandle}/${article.handle}`} className="block h-full">
        <div className="bg-white h-full border border-[#1a472a]/10 p-6 flex flex-col transition-all duration-300 group-hover:border-[#B55A3C]/50 group-hover:shadow-lg relative overflow-hidden">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#B55A3C]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#B55A3C]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#B55A3C]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#B55A3C]" />

            {/* Note Label */}
            <div className="mb-4 border-b border-[#1a472a]/10 pb-2 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A84]">
                    Field Note #{(index + 1).toString().padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#8A8A84]">
                    {article.publishedAt}
                </span>
            </div>

            {article.image && (
            <div className="aspect-[4/3] overflow-hidden mb-6 border border-[#1a472a]/10 relative">
                <Image
                alt={article.image.altText || article.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                data={article.image}
                aspectRatio="4/3"
                loading={loading}
                sizes="(min-width: 768px) 33vw, 100vw"
                />
            </div>
            )}
            
            <div className="mt-auto">
                <h2 className="font-heading text-xl text-[#1a472a] mb-3 leading-tight group-hover:text-[#B55A3C] transition-colors uppercase tracking-wide">
                    {article.title}
                </h2>
                <div className="w-full h-px bg-[#1a472a]/10 mt-4 group-hover:bg-[#B55A3C]/30 transition-colors" />
                <div className="mt-4 flex justify-end">
                    <span className="font-mono text-[10px] text-[#B55A3C] tracking-widest uppercase group-hover:translate-x-1 transition-transform">
                        Read More →
                    </span>
                </div>
            </div>
        </div>
      </Link>
    </motion.div>
  );
}

const BLOGS_QUERY = `#graphql
query Blog(
  $language: LanguageCode
  $blogHandle: String!
  $pageBy: Int!
  $cursor: String
) @inContext(language: $language) {
  blog(handle: $blogHandle) {
    title
    seo {
      title
      description
    }
    articles(first: $pageBy, after: $cursor) {
      edges {
        node {
          ...Article
        }
      }
    }
  }
}

fragment Article on Article {
  author: authorV2 {
    name
  }
  contentHtml
  handle
  id
  image {
    id
    altText
    url
    width
    height
  }
  publishedAt
  title
}
`;
