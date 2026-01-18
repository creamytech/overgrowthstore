import {
  defer,
  type LinksFunction,
  type LoaderFunctionArgs,
  type AppLoadContext,
  type MetaArgs,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useRouteError,
  useLocation,
  type ShouldRevalidateFunction,
  type MetaFunction,
} from '@remix-run/react';
import {
  useNonce,
  Analytics,
  getShopAnalytics,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {PageLayout} from '~/components/PageLayout';
import {GenericError} from '~/components/GenericError';
import {NotFound} from '~/components/NotFound';
import {seoPayload} from '~/lib/seo.server';
import styles from '~/styles/app.css?url';
import fieldJournalStyles from '~/styles/field-journal.css?url';
import {SmoothScrollProvider} from '~/components/SmoothScroll';
import {CommandPalette} from '~/components/CommandPalette';
import {Toaster} from '~/components/ui/sonner';
import {DropNotificationPopup} from '~/components/DropNotificationPopup';

import {DEFAULT_LOCALE, parseMenu} from './lib/utils';

export type RootLoader = typeof loader;

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: fieldJournalStyles},
    {rel: 'icon', type: 'image/png', href: '/assets/logo_og_vines.png'},
  ];
};

export const meta: MetaFunction<typeof loader> = ({matches}) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

// This is important to avoid re-fetching root queries on sub-navigations
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({
    ...deferredData,
    ...criticalData,
  });
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({request, context}: LoaderFunctionArgs) {
  const [layout] = await Promise.all([
    getLayoutData(context),
    // Add other queries here, so that they are loaded in parallel
  ]);

  const seo = seoPayload.root({shop: layout.shop, url: request.url});

  const {storefront, env} = context;

  return {
    layout,
    seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
    },
    selectedLocale: storefront.i18n,
  };
}


import {GrowthLoader} from '~/components/ui/GrowthLoader';
import {NavigationProgress} from '~/components/PageTransition';
function loadDeferredData({context}: LoaderFunctionArgs) {
  const {cart, customerAccount} = context;

  return {
    isLoggedIn: customerAccount.isLoggedIn(),
    cart: cart.get(),
  };
}

function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<typeof loader>('root');
  const locale = data?.selectedLocale ?? DEFAULT_LOCALE;
  const location = useLocation();
  const isPasswordPage = location.pathname.includes('/password');

  return (
    <html lang={locale.language} style={{backgroundColor: '#0a0a0a'}} data-scrolled="false">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        {/* iOS Safari theme color */}
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="msvalidate.01" content="A352E6A0AF9A652267361BBB572B8468" />
        {/* Google Fonts Preconnect for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts - IM Fell English SC for headings, Caveat for handwritten */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IM+Fell+English+SC&display=swap" 
          rel="stylesheet" 
        />
        <Meta />
        <Links />
        
        
        
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '890598863301634');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            src="https://www.facebook.com/tr?id=890598863301634&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body 
        className="antialiased text-ink bg-[#0a0a0a] selection:bg-rust selection:text-paper"
        style={{
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
        }}
      >
        {/* iOS Safe-Area Top Overlay - syncs with navbar scroll state */}
        <div 
          className="safe-area-top-overlay"
          aria-hidden="true"
        />
        {/* iOS Safe-Area Bottom Overlay - syncs with navbar scroll state */}
        <div 
          className="safe-area-bottom-overlay"
          aria-hidden="true"
        />
        {/* Global Paper Texture Overlay - Inline styles for guaranteed display */}
        <div 
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            pointerEvents: 'none',
            backgroundImage: "url('/assets/texture_archive_paper.jpg')",
            backgroundRepeat: 'repeat',
            backgroundSize: 'cover',
            opacity: 0.08,
          }}
        />
        
        {/* Navigation Progress Bar */}
        <NavigationProgress />


        
          {data ? (
            <Analytics.Provider
              cart={data.cart}
              shop={data.shop}
              consent={data.consent}
            >
              {isPasswordPage ? (
                children
              ) : (
                <PageLayout
                    key={`${locale.language}-${locale.country}`}
                    layout={data.layout}
                >
                    {children}
                </PageLayout>
              )}
            </Analytics.Provider>
          ) : (
            children
          )}
        
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        
        {/* Global Command Palette (⌘K) */}
        <CommandPalette />
        
        {/* Drop Notification Popup - appears after 10s for first-time visitors */}
        <DropNotificationPopup />
        
        {/* Toast notifications */}
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'font-mono text-sm bg-[#0a0a0a] text-[#F2EFE9] border border-[#F2EFE9]/20',
            style: {
              background: '#0a0a0a',
              color: '#F2EFE9',
              border: '1px solid rgba(242, 239, 233, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}

import {AnimatePresence, motion} from 'framer-motion';

export default function App() {
  return (
    <Layout>
      <SmoothScrollProvider>
        <Outlet />
      </SmoothScrollProvider>
    </Layout>
  );
}

export function ErrorBoundary({error}: {error: Error}) {
  const routeError = useRouteError();
  const isRouteError = isRouteErrorResponse(routeError);

  let title = 'Error';
  let pageType = 'page';

  if (isRouteError) {
    title = 'Not found';
    if (routeError.status === 404) pageType = routeError.data || pageType;
  }

  return (
    <Layout>
      {isRouteError ? (
        <>
          {routeError.status === 404 ? (
            <NotFound type={pageType} />
          ) : (
            <GenericError
              error={{message: `${routeError.status} ${routeError.data}`}}
            />
          )}
        </>
      ) : (
        <GenericError error={error instanceof Error ? error : undefined} />
      )}
    </Layout>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

async function getLayoutData({storefront, env}: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      footerMenuHandle: 'footer',
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(
        data.headerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
        data.footerMenu,
        data.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  return {shop: data.shop, headerMenu, footerMenu};
}
