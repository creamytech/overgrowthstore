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
          Field Notes
        </h1>
        <p className="font-body text-dark-green/60 text-lg max-w-md mx-auto">
          Dispatches from the quiet places
        </p>
        <div className="w-24 h-1 bg-rust mx-auto mt-8" />
      </div>

      {/* Articles Grid */}
      <Section className="relative z-10 px-4 md:px-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
      </Section>
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
        <div className="bg-[#f9f7f3] h-full border border-dark-green/20 p-6 flex flex-col transition-all duration-300 group-hover:border-rust group-hover:shadow-lg relative overflow-hidden">
            
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-dark-green/30" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-dark-green/30" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-dark-green/30" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-dark-green/30" />

            {/* Note Label */}
            <div className="mb-4 border-b border-dark-green/10 pb-2 flex justify-between items-center">
                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                    Field Note #{index + 1}
                </span>
                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                    {article.publishedAt}
                </span>
            </div>

            {article.image && (
            <div className="aspect-[4/3] overflow-hidden mb-6 border border-dark-green/10 relative">
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
                <h2 className="font-heading text-2xl text-dark-green mb-3 leading-tight group-hover:text-rust transition-colors">
                    {article.title}
                </h2>
                <div className="w-full h-px bg-dark-green/10 mt-4 group-hover:bg-rust/30 transition-colors" />
                <div className="mt-4 flex justify-end">
                    <span className="font-body text-xs text-rust tracking-widest uppercase group-hover:translate-x-1 transition-transform">
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
