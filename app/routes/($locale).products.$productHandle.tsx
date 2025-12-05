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
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Update active image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  // Handle mouse move for zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen relative pt-40 pb-32 px-4 md:px-8">
       <div className="max-w-7xl mx-auto relative">
            {/* Product Container */}
            <div className="bg-[#f4f1ea] relative border border-rust/30 p-6 md:p-12 shadow-sm">
                
                {/* Header Metadata */}
                <div className="relative z-10 border-b-2 border-rust/30 pb-8 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="inline-block px-2 py-1 border border-rust/40 font-body text-[10px] tracking-widest uppercase text-dark-green bg-[#f4f1ea]">
                                RECOVERED WORKS
                            </span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl text-dark-green leading-tight">
                            {title}
                        </h1>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <span className="block font-body text-[10px] tracking-widest uppercase text-dark-green/50 mb-1">
                            Added to Collection
                        </span>
                        <span className="font-body text-sm text-dark-green border-b border-rust/30 pb-1">
                            {new Date(product.publishedAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start relative z-10">
                    
                    {/* Left Column: Product Images */}
                    <div className="flex flex-col gap-4">
                        {/* Image Container with Hover Zoom */}
                        <div 
                            ref={imageContainerRef}
                            className="relative w-full aspect-[4/5] bg-paper border border-rust/30 shadow-sm overflow-hidden group"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {/* Base Product Image */}
                            <div className="relative w-full h-full p-8 z-0">
                                {activeImage && (
                                    <Image
                                        data={activeImage}
                                        sizes="(min-width: 1024px) 60vw, 100vw"
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>

                            {/* Hover Zoom Overlay - Desktop Only */}
                            {activeImage && (
                                <div 
                                    className={`hidden lg:block absolute inset-0 z-30 pointer-events-none transition-opacity duration-200 bg-paper ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                                    style={{
                                        backgroundImage: `url(${activeImage.url})`,
                                        backgroundSize: '200%',
                                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundColor: '#f4f1ea',
                                    }}
                                />
                            )}

                            {/* Corner Label */}
                            <div className="absolute top-4 left-4 z-20 border border-rust/40 px-2 py-1 bg-paper/90">
                                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                                    Preview
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 z-20 border border-rust/40 px-2 py-1 bg-paper/90">
                                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                                    ATTACHMENT 01
                                </span>
                            </div>

                            {/* Zoom Hint - Desktop only */}
                            <div className={`absolute bottom-4 right-4 z-20 hidden lg:block transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
                                <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60 bg-paper/90 px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                    <span>Hover to Zoom</span>
                                </span>
                            </div>

                            {/* Crosshair on hover */}
                            {isHovering && (
                                <div 
                                    className="hidden lg:block absolute w-6 h-6 border-2 border-rust/60 rounded-full pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
                                    style={{
                                        left: `${zoomPosition.x}%`,
                                        top: `${zoomPosition.y}%`,
                                    }}
                                />
                            )}
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
                                            className={`relative w-20 h-24 flex-shrink-0 border transition-all duration-100 ${
                                                isActive 
                                                ? 'border-rust opacity-100 ring-1 ring-rust ring-offset-1 ring-offset-[#f4f1ea]' 
                                                : 'border-rust/30 opacity-60 hover:opacity-100 hover:border-rust/60'
                                            }`}
                                        >
                                            <div className="absolute inset-0 bg-paper opacity-20 mix-blend-multiply pointer-events-none" />
                                            <Image
                                                data={image}
                                                sizes="80px"
                                                className="w-full h-full object-cover"
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
                        <div className="border-b border-dashed border-rust/30 pb-4">
                             <div className="flex items-center justify-between mb-2">
                                 <div className="flex items-center gap-4 font-body text-sm text-rust tracking-widest uppercase">
                                    <span>{vendor}</span>
                                </div>
                                 <div className="font-heading text-3xl md:text-4xl text-dark-green font-bold">
                                    <Money withoutTrailingZeros data={selectedVariant?.price!} />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 text-dark-green/60">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S6.41 3.5 10 3.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm.5-10.5h-1v5l4.25 2.55.75-1.23-4-2.37V6z"/>
                                </svg>
                                <span className="font-body text-xs tracking-wide">Free shipping on orders $75+</span>
                            </div>
                        </div>

                        {/* Metadata Table */}
                        <div className="grid gap-4 font-body text-sm text-ink/80">
                            <div className="grid grid-cols-3 border-b border-dashed border-rust/30 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Origin</span>
                                <span className="col-span-2">
                                    The Quiet Places // Reclaimed
                                </span>
                            </div>
                            <div className="grid grid-cols-3 border-b border-dashed border-rust/30 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Material</span>
                                <span className="col-span-2">
                                    100% Organic Cotton // 240 GSM
                                </span>
                            </div>
                            <div className="grid grid-cols-3 border-b border-dashed border-rust/30 pb-2">
                                <span className="uppercase tracking-widest opacity-60">Status</span>
                                <span className="col-span-2">
                                    {selectedVariant?.availableForSale ? 'Available for Acquisition' : 'Archived // Depleted'}
                                </span>
                            </div>
                        </div>

                        {/* Technical Specifications */}
                        <div className="bg-rust/5 border border-rust/20 p-4 font-mono text-xs text-dark-green/80">
                            <h4 className="font-bold uppercase tracking-widest mb-2 border-b border-rust/20 pb-1">Technical Specifications</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="opacity-50 block">FIT PROFILE</span>
                                    <span>OVERSIZED // BOXY</span>
                                </div>
                                <div>
                                    <span className="opacity-50 block">WEIGHT CLASS</span>
                                    <span>HEAVYWEIGHT</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="opacity-50 block">CARE PROTOCOL</span>
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
                <div className="relative z-10 mt-16 pt-8 border-t border-dashed border-rust/40 text-center">
                    <span className="font-body text-xs text-dark-green/50 tracking-widest">
                        Recovered from the quiet places
                    </span>
                </div>
            </div>

        {/* Related Specimens */}
        <Suspense fallback={<Skeleton className="h-32 mt-12" />}>
          <Await
            errorElement="There was a problem loading related products"
            resolve={recommended}
          >
            {(products) => (
              <div className="mt-24 border-t border-rust/30 pt-12 max-w-6xl mx-auto px-4">
                  <h3 className="font-heading text-2xl text-dark-green mb-8 text-center tracking-widest">
                      YOU MAY ALSO LIKE
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
              Recovered Work Archived // Depleted
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
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                 <span className="font-heading text-2xl tracking-[0.25em] uppercase text-[#f4f1ea] transition-colors duration-100 steps(2)">
                    Claim This Find
                 </span>
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
