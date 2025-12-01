import {useRef, Suspense, useState, useEffect} from 'react';
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
import {Modal} from '~/components/Modal';
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
  const initialImage = selectedVariant?.image || (firstMedia?.__typename === 'MediaImage' ? firstMedia.image : null);
  
  const [activeImage, setActiveImage] = useState(initialImage);
  const [isInspecting, setIsInspecting] = useState(false);

  // Update active image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] relative py-32 px-4 md:px-8">
       {/* Texture Overlay */}
       <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')]" />
       
       <div className="max-w-7xl mx-auto relative">
            {/* Official Report Container */}
            <div className="bg-[#f4f1ea] relative border border-dark-green/20 p-6 md:p-12 shadow-sm">
                
                {/* Header Metadata */}
                <div className="relative z-10 border-b-2 border-dark-green/20 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block px-2 py-1 border border-dark-green/30 font-body text-[10px] tracking-widest uppercase text-dark-green bg-[#f4f1ea]">
                                SALVAGE ANALYSIS
                            </span>
                            <span className="font-body text-[10px] tracking-widest uppercase text-dark-green/60">
                                REF ID #{product.id.substring(product.id.length - 6)}
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl text-dark-green leading-tight">
                            {title}
                        </h1>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="block font-body text-[10px] tracking-widest uppercase text-dark-green/50 mb-1">
                            Acquisition Date
                        </span>
                        <span className="font-body text-sm text-dark-green border-b border-dark-green/20 pb-1">
                            {new Date(product.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start relative z-10">
                    
                    {/* Left Column: The Visual (Specimen) */}
                    <div className="flex flex-col gap-4">
                        <div 
                            className="relative w-full aspect-[4/5] bg-paper border border-dark-green/20 p-8 shadow-sm group cursor-crosshair transition-colors duration-100 steps(2)"
                            onClick={() => setIsInspecting(!isInspecting)}
                        >
                            {/* Texture Overlay (Multiply) - Fades out on hover or inspect */}
                            <div 
                                className={`absolute inset-0 z-10 pointer-events-none mix-blend-multiply transition-opacity duration-100 steps(2) ${isInspecting ? 'opacity-0' : 'opacity-30 group-hover:opacity-0'}`}
                            />
                            
                            {/* Product Image - Removes filters on hover or inspect */}
                            <div className="relative w-full h-full z-0">
                                {activeImage && (
                                    <Image
                                        data={activeImage}
                                        sizes="(min-width: 1024px) 60vw, 100vw"
                                        className={`w-full h-full object-contain transition-all duration-100 steps(2) ${isInspecting ? 'mix-blend-normal filter-none sepia-0' : 'mix-blend-multiply filter contrast-110 sepia-[0.1] group-hover:mix-blend-normal group-hover:filter-none group-hover:sepia-0'}`}
                                    />
                                )}
                            </div>

                            {/* Corner Stamps/Marks */}
                            <div className={`absolute top-4 left-4 z-20 border border-dark-green/30 px-2 py-1 transition-opacity duration-100 steps(2) ${isInspecting ? 'opacity-50' : 'group-hover:opacity-50'}`}>
                                <span className="font-typewriter text-[10px] uppercase tracking-widest text-dark-green/60">
                                    Fig. A
                                </span>
                            </div>
                             <div className={`absolute bottom-4 left-4 z-20 border border-dark-green/30 px-2 py-1 transition-opacity duration-100 steps(2) ${isInspecting ? 'opacity-50' : 'group-hover:opacity-50'}`}>
                                <span className="font-typewriter text-[10px] uppercase tracking-widest text-dark-green/60">
                                    ATTACHMENT 01
                                </span>
                            </div>

                            {/* Mobile Hint */}
                            <div className={`absolute bottom-4 right-4 z-20 transition-opacity duration-100 steps(2) ${isInspecting ? 'opacity-0' : 'opacity-100 lg:opacity-0'}`}>
                                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/40 bg-paper/80 px-2 py-1 rounded-full">
                                    Tap to Inspect
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {media.nodes.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {media.nodes.map((med, i) => {
                                    const image = med.__typename === 'MediaImage' ? med.image : null;
                                    if (!image) return null;
                                    
                                    const isActive = activeImage?.id === image.id;

                                    return (
                                        <button
                                            key={med.id || image.id}
                                            onClick={() => setActiveImage(image)}
                                            className={`relative w-20 h-24 flex-shrink-0 border transition-all duration-100 steps(2) ${
                                                isActive 
                                                ? 'border-dark-green opacity-100 ring-1 ring-dark-green ring-offset-1 ring-offset-[#f4f1ea]' 
                                                : 'border-dark-green/20 opacity-60 hover:opacity-100 hover:border-dark-green/50'
                                            }`}
                                        >
                                            <div className="absolute inset-0 bg-paper opacity-20 mix-blend-multiply pointer-events-none" />
                                            <Image
                                                data={image}
                                                sizes="80px"
                                                className="w-full h-full object-cover grayscale-[0.2]"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Right Column: The Data */}
                    <div className="flex flex-col gap-8 relative">
                        
                        {/* Price & Vendor */}
                        <div className="flex items-center justify-between border-b border-dashed border-dark-green/20 pb-4">
                             <div className="flex items-center gap-4 font-body text-sm text-rust tracking-widest uppercase">
                                <span>{vendor}</span>
                            </div>
                             <div className="font-heading text-2xl text-dark-green">
                                <Money withoutTrailingZeros data={selectedVariant?.price!} />
                            </div>
                        </div>

                        {/* Metadata Table */}
                        <div className="grid gap-4 font-body text-sm text-ink/80">
                            <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Origin</span>
                                <span className="col-span-2">
                                    Sector 7 (Reclaimed Zone)
                                </span>
                            </div>
                            <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Material</span>
                                <span className="col-span-2">
                                    100% Organic Cotton (240 GSM)
                                </span>
                            </div>
                            <div className="grid grid-cols-3 border-b border-dashed border-dark-green/20 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Status</span>
                                <span className="col-span-2">
                                    {selectedVariant?.availableForSale ? 'Available for Study' : 'Archived'}
                                </span>
                            </div>
                        </div>

                        {/* Technical Specifications (New Section) */}
                        <div className="bg-dark-green/5 border border-dark-green/10 p-4 font-mono text-xs text-dark-green/80">
                            <h4 className="font-bold uppercase tracking-widest mb-2 border-b border-dark-green/10 pb-1">Technical Specifications</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="opacity-50 block">FIT PROFILE</span>
                                    <span>OVERSIZED / BOXY</span>
                                </div>
                                <div>
                                    <span className="opacity-50 block">WEIGHT</span>
                                    <span>HEAVYWEIGHT</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="opacity-50 block">CARE INSTRUCTIONS</span>
                                    <span>MACHINE WASH COLD // HANG DRY ONLY</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose prose-stone font-body text-sm leading-relaxed text-ink/90">
                            <div dangerouslySetInnerHTML={{__html: descriptionHtml || ''}} />
                        </div>

                        {/* Divider */}
                        <div 
                            className="w-full h-32 my-2 opacity-60"
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

                {/* Footer Signature */}
                <div className="relative z-10 mt-16 pt-8 border-t border-dashed border-dark-green/30 flex justify-between items-end">
                    <div>
                         <span className="block font-body text-[10px] uppercase tracking-widest text-dark-green/50 mb-2">
                            Clearance
                        </span>
                        <span className="font-heading text-lg text-dark-green">
                            LEVEL 4 AUTHORIZED
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block font-body text-[10px] uppercase tracking-widest text-dark-green/50 mb-2">
                            Verified By
                        </span>
                        <span className="font-heading text-xl text-dark-green block border-b border-dark-green/30 pb-1 px-4">
                            The Quartermaster
                        </span>
                    </div>
                </div>

            </div>
       </div>

      {/* Related Specimens */}
      <Suspense fallback={<Skeleton className="h-32 mt-12" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <div className="mt-24 border-t border-dark-green/20 pt-12 max-w-7xl mx-auto px-4">
                <h3 className="font-heading text-2xl text-dark-green mb-8 text-center tracking-widest">
                    RECOMMENDED LOADOUT
                </h3>
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
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <div className="grid gap-8">
      <div className="grid gap-4">
        {productOptions.map((option) => (
          <div key={option.name} className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h4 className="font-body text-xs uppercase tracking-widest text-dark-green/60">
                {option.name}
                </h4>
                {option.name === 'Size' && (
                    <button 
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="font-body text-[10px] uppercase tracking-widest text-rust hover:underline"
                    >
                        [ VIEW SIZE GUIDE ]
                    </button>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {option.optionValues.map(({name, handle, variantUriQuery, selected, available}) => (
                 <Link
                    key={option.name + name}
                    to={`/products/${handle}?${variantUriQuery}`}
                    preventScrollReset
                    prefetch="intent"
                    replace
                    className={clsx(
                      'min-w-[3rem] px-3 py-2 font-body text-sm border transition-all duration-100 steps(2) text-center',
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

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
          <Modal cancelLink="" close={() => setIsSizeGuideOpen(false)}>
              <div className="p-6 bg-[#f4f1ea] border border-dark-green relative">
                  <button 
                    onClick={() => setIsSizeGuideOpen(false)}
                    className="absolute top-2 right-2 text-dark-green hover:text-rust"
                  >
                      <IconClose />
                  </button>
                  <h3 className="font-heading text-2xl text-dark-green mb-4">SIZE SPECIFICATIONS</h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm font-body text-dark-green text-left">
                          <thead>
                              <tr className="border-b border-dark-green/20">
                                  <th className="py-2">SIZE</th>
                                  <th className="py-2">CHEST</th>
                                  <th className="py-2">LENGTH</th>
                                  <th className="py-2">SLEEVE</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr className="border-b border-dark-green/10">
                                  <td className="py-2 font-bold">S</td>
                                  <td className="py-2">20"</td>
                                  <td className="py-2">28"</td>
                                  <td className="py-2">8"</td>
                              </tr>
                              <tr className="border-b border-dark-green/10">
                                  <td className="py-2 font-bold">M</td>
                                  <td className="py-2">22"</td>
                                  <td className="py-2">29"</td>
                                  <td className="py-2">8.5"</td>
                              </tr>
                              <tr className="border-b border-dark-green/10">
                                  <td className="py-2 font-bold">L</td>
                                  <td className="py-2">24"</td>
                                  <td className="py-2">30"</td>
                                  <td className="py-2">9"</td>
                              </tr>
                              <tr className="border-b border-dark-green/10">
                                  <td className="py-2 font-bold">XL</td>
                                  <td className="py-2">26"</td>
                                  <td className="py-2">31"</td>
                                  <td className="py-2">9.5"</td>
                              </tr>
                              <tr>
                                  <td className="py-2 font-bold">XXL</td>
                                  <td className="py-2">28"</td>
                                  <td className="py-2">32"</td>
                                  <td className="py-2">10"</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <p className="mt-4 text-[10px] text-dark-green/60 uppercase tracking-widest">
                      * Measurements are approximate. Garments are pre-shrunk.
                  </p>
              </div>
          </Modal>
      )}

          {selectedVariant && (
        <div className="mt-8">
          {isOutOfStock ? (
            <Button variant="secondary" disabled className="w-full py-4 bg-gray-200 text-ink/50 font-heading tracking-widest uppercase cursor-not-allowed border border-dashed border-ink/20">
              Salvage Archived // Depleted
            </Button>
          ) : (
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id!, quantity: 1}]}
              variant="primary"
              className="group relative w-full h-20 overflow-hidden transition-all duration-100 steps(2)"
            >
              {/* Button Container - Stamped Look */}
              <div className="absolute inset-0 bg-dark-green border-2 border-dark-green transition-all duration-100 steps(2) group-hover:bg-rust group-hover:border-rust">
                 {/* Inner Border */}
                 <div className="absolute inset-1 border border-[#f4f1ea]/30 group-hover:border-[#f4f1ea]/50" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-1">
                 <span className="font-heading text-2xl tracking-[0.25em] uppercase text-[#f4f1ea] transition-colors duration-100 steps(2)">
                    Acquire Salvage
                 </span>
                 <div className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-100 steps(2)">
                    <span className="h-px w-8 bg-[#f4f1ea] transition-colors" />
                    <span className="font-typewriter text-[10px] text-[#f4f1ea] transition-colors uppercase tracking-widest">
                        FIG. {product.id.substring(product.id.length - 3)}
                    </span>
                    <span className="h-px w-8 bg-[#f4f1ea] transition-colors" />
                 </div>
              </div>

              {/* Hover Effect - Stamp Mark */}
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-[#f4f1ea] rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-100 steps(2) pointer-events-none" />
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
                  'transition-transform transform-gpu duration-100 steps(2)',
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
