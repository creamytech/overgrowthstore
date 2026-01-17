import {useRef, Suspense, useState, useEffect} from 'react';
import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Await} from '@remix-run/react';
import {
  getSeoMeta,
  Money,
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

import type {ProductFragment} from 'storefrontapi.generated';
import {Link} from '~/components/Link';
import {AddToCartButton} from '~/components/AddToCartButton';
import {ProductCard} from '~/components/ProductCard';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {Button} from '~/components/ui/button';
import {Badge} from '~/components/ui/badge';
import {Separator} from '~/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import {Alert, AlertDescription} from '~/components/ui/alert';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {productHandle} = args.params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const criticalData = await loadCriticalData(args);
  return defer({...criticalData});
}

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

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  return getSeoMeta(...matches.map((match) => (match.data as any).seo));
};

export default function Product() {
  const {product, shop, recommended, variants, storeDomain} =
    useLoaderData<typeof loader>();
  const {media, title, vendor, descriptionHtml} = product;

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (selectedVariant?.image) {
      setActiveImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      
      {/* Dark header spacer for navbar consistency */}
      <div className="h-20 bg-[#0a0a0a] w-full" />
      
      {/* HERO SECTION - Full bleed immersive product display */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
        
        {/* Left: Full-height Image Gallery */}
        <div className="lg:w-[60%] relative bg-[#0a0a0a]">
          {/* Main Image */}
          <div className="sticky top-0 h-screen flex items-center justify-center p-8 lg:p-16">
            {activeImage && (
              <div className="relative w-full h-full max-w-2xl mx-auto">
                <Image
                  data={activeImage}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="w-full h-full object-contain"
                />
                
                {/* Specimen Corner Markers */}
                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-[#F2EFE9]/20" />
                <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-[#F2EFE9]/20" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-[#F2EFE9]/20" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-[#F2EFE9]/20" />
                
                {/* Item ID Tag */}
                <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 backdrop-blur-sm">
                  <span className="font-mono text-[10px] text-[#F2EFE9]/70 uppercase tracking-wider">
                    {selectedVariant?.sku ? `Item № ${selectedVariant.sku}` : `View ${activeIndex + 1}/${media.nodes.length}`}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Thumbnail Strip - Vertical on left side */}
          {media.nodes.length > 1 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
              {media.nodes.map((med, i) => {
                const image = med.__typename === 'MediaImage' ? med.image : null;
                if (!image) return null;
                
                const isActive = activeImage?.id === image.id;

                return (
                  <button
                    key={med.id || image.id}
                    onClick={() => {
                      setActiveImage(image);
                      setActiveIndex(i);
                    }}
                    className={clsx(
                      'relative w-14 h-16 border-2 transition-all duration-300 overflow-hidden',
                      isActive 
                        ? 'border-[#B55A3C] opacity-100' 
                        : 'border-[#F2EFE9]/20 opacity-40 hover:opacity-80'
                    )}
                  >
                    <Image
                      data={image}
                      sizes="56px"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Product Info Panel - Cream background */}
        <div className="lg:w-[40%] bg-[#F2EFE9] relative">
          <div className="sticky top-0 min-h-screen flex flex-col justify-center p-8 lg:p-12 xl:p-16">
            
            {/* Archive Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-px bg-[#B55A3C]" />
                <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                  {isOutOfStock ? 'Archived' : 'Available'}
                </span>
              </div>
              
              <span className="font-mono text-[10px] text-[#8A8A84] tracking-[0.3em] uppercase block mb-4">
                {vendor || 'Overgrowth'} Collection
              </span>
              
              <h1 className="font-heading text-4xl md:text-5xl xl:text-6xl text-[#1a472a] tracking-[0.05em] uppercase leading-none mb-6">
                {title}
              </h1>
              
              <Separator className="bg-[#1a472a]/10 my-6" />
              
              {/* Price Display */}
              <div className="flex items-baseline gap-4">
                <span className="font-heading text-3xl md:text-4xl text-[#1a472a]">
                  <Money withoutTrailingZeros data={selectedVariant?.price!} />
                </span>
                {selectedVariant?.compareAtPrice && (
                  <span className="font-mono text-sm text-[#8A8A84] line-through">
                    <Money withoutTrailingZeros data={selectedVariant.compareAtPrice} />
                  </span>
                )}
              </div>
              
              {/* Low Stock Warning - shows for available items to create urgency */}
              {selectedVariant?.availableForSale && (
                <Alert className="mt-4 bg-[#B55A3C]/10 border-[#B55A3C]/30">
                  <AlertDescription className="font-mono text-xs text-[#B55A3C]">
                    ⚠ Limited stock — no restocks once sold out
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Size Guide Link */}
              <div className="mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to="/pages/size-guide" 
                        className="inline-flex items-center gap-2 font-mono text-[10px] text-[#8A8A84] hover:text-[#B55A3C] uppercase tracking-wider transition-colors"
                      >
                        <span>📏</span>
                        Size Guide
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#0a0a0a] text-[#F2EFE9] border-[#F2EFE9]/20">
                      <p className="font-mono text-xs">View measurements & fit guide</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Product Options & Add to Cart */}
            <div className="space-y-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                storeDomain={storeDomain}
                product={product}
              />
            </div>

            {/* Expandable Details */}
            <div className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-[#1a472a]/10">
                  <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] py-4">
                    Discovery Notes
                  </AccordionTrigger>
                  <AccordionContent>
                    <div 
                      className="prose prose-sm font-mono text-[#8A8A84] max-w-none text-xs leading-relaxed"
                      dangerouslySetInnerHTML={{__html: descriptionHtml || 'No description available.'}}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="specs" className="border-[#1a472a]/10">
                  <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] py-4">
                    Material Analysis
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs text-[#8A8A84]">
                      <div className="space-y-1">
                        <span className="text-[#8A8A84]/60 block text-[9px] uppercase tracking-wider">Composition</span>
                        <span>100% Premium Cotton</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[#8A8A84]/60 block text-[9px] uppercase tracking-wider">Weight</span>
                        <span>240 GSM Heavyweight</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[#8A8A84]/60 block text-[9px] uppercase tracking-wider">Structure</span>
                        <span>Relaxed Fit</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[#8A8A84]/60 block text-[9px] uppercase tracking-wider">Production</span>
                        <span className="text-[#B55A3C]">Limited Run</span>
                      </div>
                    </div>
                    <p className="font-mono text-[10px] text-[#8A8A84]/50 mt-4 italic">
                      Constructed with premium heavyweight cotton. No reprints—when it's gone, it's archived.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping" className="border-[#1a472a]/10">
                  <AccordionTrigger className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] py-4">
                    Recovery & Returns
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="font-mono text-xs text-[#8A8A84] space-y-2">
                      <p>• Free shipping on orders over $100</p>
                      <p>• Standard recovery: 5-7 business days</p>
                      <p>• Returns accepted within 30 days</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Trust Signals */}
            <div className="mt-8 pt-8 border-t border-[#1a472a]/10">
              <div className="flex justify-between font-mono text-[9px] text-[#8A8A84]/60 uppercase tracking-widest">
                <span>Premium Quality</span>
                <span>Limited Run</span>
                <span>Est. 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS - Dark section */}
      <Suspense fallback={null}>
        <Await resolve={recommended}>
          {(products) => products?.nodes?.length > 0 && (
            <section className="bg-[#F2EFE9] py-24">
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-px bg-[#1a472a]/20" />
                    <span className="font-mono text-[9px] text-[#8A8A84] tracking-[0.4em] uppercase">
                      More From This Collection
                    </span>
                    <div className="w-16 h-px bg-[#1a472a]/20" />
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl text-[#1a472a] tracking-[0.1em] uppercase">
                    Related Discoveries
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {products.nodes.slice(0, 4).map((product: any, i: number) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              </div>
            </section>
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

function ProductForm({
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
    <div className="space-y-6">
      {/* Options */}
      {productOptions.map((option) => (
        <div key={option.name}>
          <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] mb-3">
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
                  'min-w-[3rem] px-4 py-3 font-mono text-xs uppercase tracking-wide border transition-all text-center',
                  selected 
                    ? 'border-[#B55A3C] bg-[#B55A3C] text-[#F2EFE9]' 
                    : 'border-[#1a472a]/20 text-[#1a472a] hover:border-[#B55A3C] hover:text-[#B55A3C]',
                  !available && 'opacity-40 line-through pointer-events-none'
                )}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Add to Cart */}
      {selectedVariant && (
        <div className="pt-4">
          {isOutOfStock ? (
            <Button 
              disabled 
              variant="outline" 
              className="w-full py-6 font-mono text-xs uppercase tracking-[0.2em] border-[#1a472a]/20 text-[#8A8A84]"
            >
              Sold Out
            </Button>
          ) : (
            <AddToCartButton
              lines={[{merchandiseId: selectedVariant.id!, quantity: 1}]}
              variant="primary"
              className="w-full"
            >
              <div className="w-full py-6 bg-[#B55A3C] text-[#F2EFE9] hover:bg-[#9A4A30] transition-all duration-300 font-mono text-xs uppercase tracking-[0.2em] text-center">
                Recover This Artifact
              </div>
            </AddToCartButton>
          )}
        </div>
      )}
    </div>
  );
}

/* GraphQL Queries */
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
