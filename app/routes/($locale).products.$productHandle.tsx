import {useRef, Suspense} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await} from '@remix-run/react';
import {
  getSeoMeta,
  Money,
  ShopPayButton,
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  getProductOptions,
  type MappedProductOptions,
  Image,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';

import type {ProductFragment} from 'storefrontapi.generated';
import {Heading, Section, Text} from '~/components/Text';
import {Link} from '~/components/Link';
import {Button} from '~/components/Button';
import {AddToCartButton} from '~/components/AddToCartButton';
import {Skeleton} from '~/components/Skeleton';
import {ProductSwimlane} from '~/components/ProductSwimlane';
import {ProductGallery} from '~/components/ProductGallery';
import {IconCaret, IconCheck, IconClose} from '~/components/Icon';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  params,
  request,
  context,
}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const [{shop, product}] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: productHandle,
        selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);
  const selectedVariant = product.selectedOrFirstAvailableVariant ?? {};
  const variants = getAdjacentAndFirstAvailableVariants(product);

  const seo = seoPayload.product({
    product: {...product, variants},
    selectedVariant,
    url: request.url,
  });

  return {
    product,
    variants,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    seo,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData(args: LoaderFunctionArgs) {
  // Put any API calls that are not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

import {FieldHero} from '~/components/home/FieldHero'; // Re-using for consistent header if needed, but we have global nav.

export default function Product() {
  const {product, shop, recommended, variants, storeDomain} =
    useLoaderData<typeof loader>();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    variants,
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const firstMedia = media.nodes[0];
  const selectedImage = selectedVariant?.image || (firstMedia?.__typename === 'MediaImage' ? firstMedia.image : null);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
        
        {/* Left Column: The Visual (Specimen) */}
        <div className="relative w-full aspect-[4/5] bg-paper border border-dark-green/20 p-8 shadow-sm">
            {/* Texture Overlay (Multiply) */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply opacity-30"
                style={{backgroundImage: "url('/assets/texture_archive_paper.jpg')", backgroundSize: '500px'}}
            />
            
            {/* Product Image */}
            <div className="relative w-full h-full z-0">
                {selectedImage && (
                    <Image
                        data={selectedImage}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="w-full h-full object-contain mix-blend-multiply filter contrast-110 sepia-[0.1]"
                    />
                )}
            </div>

            {/* Corner Stamps/Marks */}
            <div className="absolute top-4 left-4 z-20 border border-dark-green/30 px-2 py-1">
                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">Fig. 1</span>
            </div>
        </div>

        {/* Right Column: The Data */}
        <div className="flex flex-col gap-8 relative">
            {/* Header */}
            <div className="border-b border-dark-green/20 pb-6">
                <h1 className="font-heading text-4xl md:text-5xl text-dark-green mb-2">
                    {title}
                </h1>
                <div className="flex items-center gap-4 font-body text-sm text-rust tracking-widest uppercase">
                    <span>{vendor}</span>
                    <span>—</span>
                    <Money withoutTrailingZeros data={selectedVariant?.price!} />
                </div>
            </div>

            {/* Metadata Table */}
            <div className="grid gap-4 font-body text-sm text-ink/80">
                <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                    <span className="uppercase tracking-widest opacity-60">Origin</span>
                    <span className="col-span-2">Sector 7 (Reclaimed Zone)</span>
                </div>
                <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                    <span className="uppercase tracking-widest opacity-60">Material</span>
                    <span className="col-span-2">100% Organic Cotton (240 GSM)</span>
                </div>
                <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                    <span className="uppercase tracking-widest opacity-60">Status</span>
                    <span className="col-span-2">{selectedVariant?.availableForSale ? 'Available for Study' : 'Archived'}</span>
                </div>
            </div>

            {/* Description */}
            <div className="prose prose-stone font-body text-sm leading-relaxed text-ink/90">
                <div dangerouslySetInnerHTML={{__html: descriptionHtml || ''}} />
            </div>

            {/* Divider */}
            <div 
                className="w-full h-48 my-4"
                style={{
                    backgroundImage: "url('/assets/divider_ornamental_vine.png')",
                    backgroundSize: 'auto 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            />

            {/* Form & CTA */}
            <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                storeDomain={storeDomain}
                product={product}
            />
        </div>
      </div>

      {/* Related Specimens */}
      <Suspense fallback={<Skeleton className="h-32 mt-12" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <div className="mt-24 border-t border-dark-green/20 pt-12">
                <h3 className="font-heading text-2xl text-dark-green mb-8 text-center">Related Salvage</h3>
                <ProductSwimlane title="" products={products} />
            </div>
          )}
        </Await>
      </Suspense>
      
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

export function ProductForm({
  productOptions,
  selectedVariant,
  storeDomain,
  product,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  storeDomain: string;
  product: ProductFragment;
}) {
  const isOutOfStock = !selectedVariant?.availableForSale;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4">
        {productOptions.map((option) => (
          <div key={option.name} className="flex flex-col gap-3">
            <h4 className="font-body text-xs uppercase tracking-widest text-dark-green/60">
              {option.name}
            </h4>
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map(({name, handle, variantUriQuery, selected, available}) => (
                 <Link
                    key={option.name + name}
                    to={`/products/${handle}?${variantUriQuery}`}
                    preventScrollReset
                    prefetch="intent"
                    replace
                    className={clsx(
                      'min-w-[3rem] px-3 py-2 font-body text-sm border transition-all duration-200 text-center',
                      selected 
                        ? 'border-dark-green bg-dark-green text-cream' 
                        : 'border-dark-green/30 text-dark-green hover:border-dark-green',
                      !available && 'opacity-50 line-through cursor-not-allowed'
                    )}
                  >
                    {name}
                  </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedVariant && (
        <div className="mt-4">
          {isOutOfStock ? (
            <Button variant="secondary" disabled className="w-full py-4 bg-gray-200 text-ink/50 font-heading tracking-widest uppercase cursor-not-allowed">
              Salvage Archived
            </Button>
          ) : (
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id!, quantity: 1}]}
              variant="primary"
              className="group relative w-full h-16 bg-transparent overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              {/* Background Fill Animation (Slide Up) */}
              <div className="absolute inset-0 bg-dark-green transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              
              {/* Border (Static) */}
              <div className="absolute inset-0 border border-dark-green z-20 pointer-events-none" />

              {/* Corner Accents (Top-Left & Bottom-Right) */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-dark-green z-20 group-hover:border-cream transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-dark-green z-20 group-hover:border-cream transition-colors duration-300" />

              {/* Text Content */}
              <span className="relative z-30 flex items-center justify-center h-full w-full gap-4 group-hover:text-[#f4f1ea] transition-colors duration-300">
                <span className="font-heading text-xl tracking-[0.2em] uppercase text-dark-green group-hover:text-[#f4f1ea] transition-colors duration-300">
                  Acquire Salvage
                </span>
                <span className="font-body text-[10px] opacity-60 group-hover:opacity-100 group-hover:text-[#f4f1ea]/80 transition-all duration-300 translate-y-0.5">
                  [FIG. {product.id.substring(product.id.length - 3)}]
                </span>
              </span>
            </AddToCartButton>
          )}
        </div>
      )}
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="w-8 h-8"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

function ProductDetail({
  title,
  content,
  learnMore,
}: {
  title: string;
  content: string;
  learnMore?: string;
}) {
  return (
    <Disclosure key={title} as="div" className="grid w-full gap-2">
      {({open}) => (
        <>
          <Disclosure.Button className="text-left">
            <div className="flex justify-between">
              <Text size="lead" as="h4">
                {title}
              </Text>
              <IconClose
                className={clsx(
                  'transition-transform transform-gpu duration-200',
                  !open && 'rotate-[45deg]',
                )}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className={'pb-4 pt-2 grid gap-2'}>
            <div
              className="prose dark:prose-invert"
              dangerouslySetInnerHTML={{__html: content}}
            />
            {learnMore && (
              <div className="">
                <Link
                  className="pb-px border-b border-primary/30 text-primary/50"
                  to={learnMore}
                >
                  Learn more
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    publishedAt
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
    media(first: 7) {
      nodes {
        ...Media
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_FRAGMENT}
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
