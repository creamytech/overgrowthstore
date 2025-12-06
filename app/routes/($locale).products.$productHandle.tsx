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

  const isOutOfStock = !selectedVariant?.availableForSale;

  const firstMedia = media.nodes[0];
  const initialImage = selectedVariant?.image || (firstMedia?.__typename === 'MediaImage' ? firstMedia.image : null);
  
  const [activeImage, setActiveImage] = useState(initialImage);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [showStickyFooter, setShowStickyFooter] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Update active image when variant changes
  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  // Handle scroll for sticky mobile footer
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky footer after scrolling past product section (approximately 800px on mobile)
      const scrolled = window.scrollY > 800;
      setShowStickyFooter(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mouse move for zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen relative pt-24 md:pt-32 pb-32 px-4 md:px-8">
       <div className="max-w-[1250px] mx-auto relative">
            {/* ============================================
                MOBILE LAYOUT (< lg breakpoint)
                Hero-first: Title → Price → Gallery → Lore → Accordions
            ============================================ */}
            
            <div className="lg:hidden">
                {/* Mobile Hero Section */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-2 py-1 border border-rust/40 font-body text-[9px] tracking-widest uppercase text-dark-green bg-[#f4f1ea]">
                            RECOVERED WORKS
                        </span>
                        {selectedVariant?.sku && (
                            <span className="font-body text-[9px] tracking-widest uppercase text-dark-green/40">
                                ARTIFACT NO. {selectedVariant.sku}
                            </span>
                        )}
                    </div>
                    
                    <h1 className="font-heading text-3xl text-dark-green leading-tight mb-4">
                        {title}
                    </h1>

                    {/* Price - Mobile Prominent */}
                    <div className="flex items-end justify-between mb-3 pb-4 border-b border-dashed border-rust/30">
                        <div>
                            <span className="block font-body text-[9px] tracking-widest uppercase text-dark-green/50 mb-1">
                                Recovered Value
                            </span>
                            <div className="font-body text-3xl text-dark-green font-bold tracking-wide">
                                <Money withoutTrailingZeros data={selectedVariant?.price!} />
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-body text-[9px] tracking-widest uppercase text-dark-green/50 mb-1">
                                Recovered On
                            </span>
                            <span className="font-body text-xs text-dark-green">
                                {new Date(product.publishedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mobile Gallery */}
                <div className="mb-6">
                    <div 
                        className="relative w-full aspect-[3/4] bg-paper border border-rust/30 shadow-sm overflow-hidden mb-3"
                    >
                        <div className="relative w-full h-full p-6">
                            {activeImage && (
                                <Image
                                    data={activeImage}
                                    sizes="100vw"
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>

                        {/* Corner Labels */}
                        <div className="absolute top-3 left-3 border border-rust/40 px-2 py-1 bg-paper/90">
                            <span className="font-body text-[9px] uppercase tracking-widest text-dark-green/60">
                                Artifact View
                            </span>
                        </div>
                    </div>

                    {/* Mobile Thumbnails - Horizontal Scroll */}
                    {media.nodes.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {media.nodes.map((med, i) => {
                                const image = med.__typename === 'MediaImage' ? med.image : null;
                                if (!image) return null;
                                
                                const isActive = activeImage?.id === image.id;

                                return (
                                    <button
                                        key={med.id || image.id}
                                        onClick={() => setActiveImage(image)}
                                        className={`relative w-16 h-20 flex-shrink-0 border transition-all duration-100 ${
                                            isActive 
                                            ? 'border-rust opacity-100 ring-1 ring-rust ring-offset-1 ring-offset-[#f4f1ea]' 
                                            : 'border-rust/30 opacity-60'
                                        }`}
                                    >
                                        <Image
                                            data={image}
                                            sizes="64px"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Mobile Lore Paragraph */}
                <div className="mb-6 px-2">
                    <p className="font-body text-sm italic text-dark-green/80 leading-relaxed">
                        Recovered from the quiet places where nature reclaimed what was left behind. 
                        Each piece carries the marks of its journey through the overgrowth.
                    </p>
                </div>

                {/* Mobile Accordions */}
                <div className="mb-6 space-y-3">
                    <FieldNotesAccordion descriptionHtml={descriptionHtml || ''} />
                    <ArtifactSpecsAccordion selectedVariant={selectedVariant} title="Artifact Anatomy" />
                    <ProvenanceAccordion 
                        vendor={vendor} 
                        publishedAt={product.publishedAt}
                        selectedVariant={selectedVariant}
                        title="Recovery Log"
                    />
                </div>

                {/* Mobile Product Form */}
                <ProductForm
                    productOptions={productOptions}
                    selectedVariant={selectedVariant}
                    storeDomain={storeDomain}
                    product={product}
                />
            </div>

            {/* ============================================
                DESKTOP LAYOUT (>= lg breakpoint)
                Two-column: Gallery + Sticky Sidebar
            ============================================ */}
            
            <div className="hidden lg:block">
                {/* Desktop Header Metadata */}
                <div className="relative z-10 border-b-2 border-rust/30 pb-6 mb-12 flex justify-between items-end gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="inline-block px-2 py-1 border border-rust/40 font-body text-[10px] tracking-widest uppercase text-dark-green bg-[#f4f1ea]">
                                RECOVERED WORKS
                            </span>
                            {selectedVariant?.sku && (
                                <span className="font-body text-[10px] tracking-widest uppercase text-dark-green/40">
                                    ARTIFACT NO. {selectedVariant.sku}
                                </span>
                            )}
                        </div>
                        <h1 className="font-heading text-5xl text-dark-green leading-tight tracking-tight">
                            {title}
                        </h1>
                        {/* Mini Vine Divider */}
                        <div className="mt-4 opacity-60">
                            <svg width="40" height="9" viewBox="0 0 40 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.5 4.5C34.5 4.5 32.5 1.5 30 1.5C27.5 1.5 25.5 4.5 20.5 4.5C15.5 4.5 13.5 1.5 11 1.5C8.5 1.5 6.5 4.5 0.5 4.5" stroke="#4A5D23" strokeWidth="0.75" strokeLinecap="round"/>
                                <path d="M10 4.5C10 6.5 11.5 8 13 8" stroke="#4A5D23" strokeWidth="0.75" strokeLinecap="round"/>
                                <path d="M29 4.5C29 6.5 30.5 8 32 8" stroke="#4A5D23" strokeWidth="0.75" strokeLinecap="round"/>
                            </svg>
                        </div>
                    </div>
                    <div className="text-right flex-col items-end pt-2">
                        <span className="block font-body text-[10px] tracking-widest uppercase text-dark-green/50 mb-1">
                            Recovered On
                        </span>
                        <span className="font-body text-sm text-dark-green border-b border-rust/30 pb-1">
                            {new Date(product.publishedAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-12 items-start relative">
                    
                    {/* Left Column: Gallery with Vertical Thumbnails */}
                    <div className="col-span-7 flex gap-4">
                        
                        {/* Vertical Thumbnail Strip */}
                        {media.nodes.length > 1 && (
                            <div className="flex flex-col gap-3 w-24 flex-shrink-0">
                                {media.nodes.map((med, i) => {
                                    const image = med.__typename === 'MediaImage' ? med.image : null;
                                    if (!image) return null;
                                    
                                    const isActive = activeImage?.id === image.id;

                                    return (
                                        <button
                                            key={med.id || image.id}
                                            onClick={() => setActiveImage(image)}
                                            className={`relative w-full aspect-[3/4] border transition-all duration-300 ${
                                                isActive 
                                                ? 'border-rust opacity-100 ring-1 ring-rust ring-offset-2 ring-offset-[#f4f1ea]' 
                                                : 'border-rust/10 opacity-70 hover:opacity-100 hover:border-rust/40'
                                            }`}
                                        >
                                            <div className="absolute inset-0 bg-paper opacity-10 mix-blend-multiply pointer-events-none" />
                                            <Image
                                                data={image}
                                                sizes="96px"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Main Image with Zoom */}
                        <div className="flex-1">
                            <div 
                                ref={imageContainerRef}
                                className="relative w-full aspect-[4/5] bg-paper border border-rust/30 shadow-sm overflow-hidden group"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {/* Base Product Image */}
                                <div className="relative w-full h-full p-12">
                                    {activeImage && (
                                        <Image
                                            data={activeImage}
                                            sizes="(min-width: 1024px) 60vw, 100vw"
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>

                                {/* Hover Zoom Overlay */}
                                {activeImage && (
                                    <div 
                                        className={`absolute inset-0 pointer-events-none transition-opacity duration-200 bg-paper ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                                        style={{
                                            backgroundImage: `url(${activeImage.url})`,
                                            backgroundSize: '200%',
                                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundColor: '#f4f1ea',
                                        }}
                                    />
                                )}

                                {/* Corner Labels */}
                                <div className="absolute top-4 left-4 border border-rust/40 px-2 py-1 bg-paper/90 backdrop-blur-sm">
                                    <span className="font-body text-[10px] uppercase tracking-widest text-dark-green/60">
                                        Artifact Views
                                    </span>
                                </div>

                                {/* Zoom Hint - Moved below image */}

                                {/* Crosshair on hover */}
                                {isHovering && (
                                    <div 
                                        className="absolute w-6 h-6 border-2 border-rust/60 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                        style={{
                                            left: `${zoomPosition.x}%`,
                                            top: `${zoomPosition.y}%`,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="col-span-5 sticky top-8 flex flex-col gap-6">
                        
                        {/* Lore Paragraph */}
                        <div className="border-l-2 border-rust/30 pl-4">
                            <p className="font-body text-sm italic text-dark-green/80 leading-relaxed">
                                Recovered from the quiet places where nature reclaimed what was left behind. 
                                Each piece carries the marks of its journey through the overgrowth.
                            </p>
                        </div>

                        {/* Price Display - Emphasized */}
                        <div className="bg-rust/5 border-2 border-rust/20 p-6">
                            <span className="block font-body text-[10px] tracking-widest uppercase text-dark-green/50 mb-2">
                                Recovered Value
                            </span>
                            <div className="font-body text-4xl text-dark-green font-bold tracking-wide mb-3">
                                <Money withoutTrailingZeros data={selectedVariant?.price!} />
                            </div>
                        </div>

                        {/* Micro-Detail Row */}
                        <div className="flex flex-wrap items-center justify-between gap-y-2 text-[10px] uppercase tracking-widest text-dark-green/60 py-3 border-b border-dashed border-rust/20 mb-4 px-1">
                           <span>Edition of 50 Artifacts</span>
                           <span className="text-rust/40">•</span>
                           <span>Soft-weave cotton</span>
                           <span className="text-rust/40">•</span>
                           <span>Recovered in the ruins</span>
                        </div>

                        {/* Desktop Accordions */}
                        <div className="space-y-3">
                            <FieldNotesAccordion descriptionHtml={descriptionHtml || ''} />
                            <ArtifactSpecsAccordion selectedVariant={selectedVariant} title="Artifact Anatomy" />
                            <ProvenanceAccordion 
                                vendor={vendor} 
                                publishedAt={product.publishedAt}
                                selectedVariant={selectedVariant}
                                title="Recovery Log"
                            />
                        </div>

                        {/* Product Form - Sticky in Sidebar */}
                        <ProductForm
                            productOptions={productOptions}
                            selectedVariant={selectedVariant}
                            storeDomain={storeDomain}
                            product={product}
                        />
                    </div>
                </div>
            </div>

        {/* Related Specimens - Both Mobile & Desktop */}
        <Suspense fallback={<Skeleton className="h-32 mt-16" />}>
          <Await
            errorElement="There was a problem loading related products"
            resolve={recommended}
          >
            {(products) => (
              <div className="mt-32 border-t border-rust/30 pt-16">
                  <div className="text-center mb-4">
                      <h3 className="font-heading text-2xl text-dark-green mb-2 tracking-widest">
                          OTHER RECOVERED ARTIFACTS
                      </h3>
                      <p className="font-body text-xs text-dark-green/60 italic tracking-wide">
                          From similar expeditions into the quiet places
                      </p>
                  </div>
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

        {/* Sticky Mobile Footer Bar */}
        <div 
          className={`lg:hidden fixed bottom-0 left-0 right-0 bg-[#f4f1ea] border-t-2 border-dark-green p-4 z-[100] shadow-[0_-4px_12px_rgba(0,0,0,0.15)] transition-transform duration-300 ${
            showStickyFooter ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-heading text-xs text-dark-green/60 uppercase tracking-widest mb-1">Price</p>
              <div className="font-body font-bold text-xl text-dark-green">
                <Money withoutTrailingZeros data={selectedVariant?.price!} />
              </div>
            </div>
            {isOutOfStock ? (
              <Button variant="secondary" disabled className="px-6 py-3 bg-gray-200 text-ink/50 font-heading text-xs tracking-widest uppercase cursor-not-allowed">
                Depleted
              </Button>
            ) : (
              <AddToCartButton
                lines={[{merchandiseId: selectedVariant.id!, quantity: 1}]}
                variant="primary"
                className="group relative flex-1 overflow-hidden"
              >
                <div className="relative bg-rust text-[#f4f1ea] overflow-hidden group hover:bg-[#722f2f] transition-all duration-300 h-full flex items-center justify-center shadow-sm">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#f4f1ea]/40" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#f4f1ea]/40" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#f4f1ea]/40" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#f4f1ea]/40" />

                  {/* Content */}
                  <div className="relative z-10 px-6">
                    <span className="block font-heading text-lg uppercase text-[#f4f1ea] tracking-[0.15em] whitespace-nowrap">
                      Claim This Find
                    </span>
                  </div>
                </div>
              </AddToCartButton>
            )}
          </div>
        </div>
    </div>
  );
}

/* ============================================
   ACCORDION COMPONENTS
   ============================================ */

function FieldNotesAccordion({descriptionHtml}: {descriptionHtml: string}) {
  return (
    <Disclosure>
      {({open}) => (
        <div className="border border-rust/30 bg-paper">
          <Disclosure.Button className="w-full px-4 py-3 flex justify-between items-center hover:bg-rust/5 transition-colors">
            <span className="font-body text-xs uppercase tracking-widest text-dark-green font-bold">
              Field Notes
            </span>
            <IconCaret
              className={clsx(
                'w-4 h-4 text-rust transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-4 border-t border-rust/20">
            <div
              className="prose prose-sm prose-stone font-body text-sm leading-relaxed text-ink/90 max-w-none"
              dangerouslySetInnerHTML={{__html: descriptionHtml}}
            />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function ArtifactSpecsAccordion({selectedVariant, title = "Artifact Specifications"}: {selectedVariant: any; title?: string}) {
  return (
    <Disclosure>
      {({open}) => (
        <div className="border border-rust/30 bg-paper">
          <Disclosure.Button className="w-full px-4 py-3 flex justify-between items-center hover:bg-rust/5 transition-colors">
            <span className="font-body text-xs uppercase tracking-widest text-dark-green font-bold">
              {title}
            </span>
            <IconCaret
              className={clsx(
                'w-4 h-4 text-rust transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-4 border-t border-rust/20">
            <div className="space-y-3 font-body text-xs text-dark-green/90">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Material Composition</span>
                <span className="col-span-2">100% Organic Cotton // 240 GSM</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Combat Fit Class</span>
                <span className="col-span-2">Oversized // Boxy</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Textile Grade</span>
                <span className="col-span-2">Heavyweight</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="uppercase tracking-widest opacity-60">Preservation Protocol</span>
                <span className="col-span-2">Machine Wash Cold // Hang Dry Only</span>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

function ProvenanceAccordion({
  vendor, 
  publishedAt,
  selectedVariant,
  title = "Provenance Intel"
}: {
  vendor: string;
  publishedAt: string;
  selectedVariant: any;
  title?: string;
}) {
  return (
    <Disclosure>
      {({open}) => (
        <div className="border border-rust/30 bg-paper">
          <Disclosure.Button className="w-full px-4 py-3 flex justify-between items-center hover:bg-rust/5 transition-colors">
            <span className="font-body text-xs uppercase tracking-widest text-dark-green font-bold">
              {title}
            </span>
            <IconCaret
              className={clsx(
                'w-4 h-4 text-rust transition-transform duration-200',
                open && 'rotate-180',
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-4 border-t border-rust/20">
            <div className="space-y-3 font-body text-xs text-dark-green/90">
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Recovery Site</span>
                <span className="col-span-2">The Quiet Places // Reclaimed</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Provenance Code</span>
                <span className="col-span-2">{vendor}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pb-2 border-b border-dashed border-rust/20">
                <span className="uppercase tracking-widest opacity-60">Artifact Status</span>
                <span className="col-span-2">
                  {selectedVariant?.availableForSale ? 'Available for Acquisition' : 'Archived // Depleted'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="uppercase tracking-widest opacity-60">Catalogued</span>
                <span className="col-span-2">
                  {new Date(publishedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}

/* ============================================
   PRODUCT FORM COMPONENT
   ============================================ */

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
    <div className="grid gap-6">
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
                      'min-w-[3rem] px-3 py-2 font-body text-sm border transition-all duration-100 text-center',
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
        <div className="mt-2">
          {isOutOfStock ? (
            <Button variant="secondary" disabled className="w-full py-4 bg-gray-200 text-ink/50 font-heading tracking-widest uppercase cursor-not-allowed border border-dashed border-ink/20">
              Recovered Work Archived // Depleted
            </Button>
          ) : (
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id!, quantity: 1}]}
              variant="primary"
              className="group relative w-full overflow-hidden"
            >
              {/* Main Button Structure */}
              {/* Main Button Structure - Artifact Crate Style */}
              <div className="relative bg-rust text-[#f4f1ea] overflow-hidden group hover:bg-[#722f2f] transition-all duration-300 w-full shadow-[0_4px_15px_rgba(139,58,58,0.2)] hover:shadow-[0_6px_20px_rgba(139,58,58,0.3)]">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f4f1ea]/40" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f4f1ea]/40" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f4f1ea]/40" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f4f1ea]/40" />
                
                {/* Centered Text - Taller Padding */}
                <div className="relative z-10 py-8 px-10 text-center">
                  <span className="block font-heading text-2xl uppercase text-[#f4f1ea] tracking-[0.2em]">
                    Claim This Find
                  </span>
                </div>
              </div>
            </AddToCartButton>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================
   GRAPHQL QUERIES & HELPERS
   ============================================ */

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


