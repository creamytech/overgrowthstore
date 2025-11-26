import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

export function XRayCard({product}: {product: any}) {
  const {title, priceRange, featuredImage, variants} = product;
  // Use the second image as the "X-Ray" reveal if available, otherwise use the first one
  const secondaryImage = variants?.nodes?.[1]?.image || featuredImage;

  return (
    <Link to={`/products/${product.handle}`} className="group relative block w-full mb-8 break-inside-avoid">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper border-2 border-ink p-2 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(42,42,42,1)]">
        
        {/* Main Image (Normal) */}
        <div className="absolute inset-2 z-10 transition-opacity duration-500 group-hover:opacity-0">
            {featuredImage && (
                <Image
                    data={featuredImage}
                    aspectRatio="4/5"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    className="object-cover w-full h-full grayscale contrast-125" // Woodcut feel
                />
            )}
        </div>

        {/* X-Ray Image (Reveal) */}
        <div className="absolute inset-2 z-0">
             {secondaryImage && (
                <Image
                    data={secondaryImage}
                    aspectRatio="4/5"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    className="object-cover w-full h-full invert sepia brightness-90 contrast-150" // X-Ray/Negative feel
                />
            )}
        </div>

        {/* Overlay Texture (Paper Grain) */}
        <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        
        {/* "Vintage Sign" Quick Add (Appears on Hover) */}
        <div className="absolute bottom-4 right-4 z-20 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <button className="bg-rust text-paper font-serif px-4 py-1 border border-ink shadow-[2px_2px_0px_0px_rgba(42,42,42,1)] hover:translate-y-px hover:shadow-none transition-all">
                COLLECT
            </button>
        </div>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <h3 className="font-serif text-lg text-ink group-hover:underline decoration-rust underline-offset-4">
          {title}
        </h3>
        <span className="font-mono text-xs text-moss">
          <Money data={priceRange.minVariantPrice} />
        </span>
      </div>
    </Link>
  );
}
