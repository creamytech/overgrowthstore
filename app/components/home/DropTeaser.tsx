import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';

export function DropTeaser({product, index}: {product: any; index: number}) {
  const {title, handle, priceRange, variants} = product;
  const image = variants?.nodes[0]?.image;

  return (
    <motion.div
      initial={{opacity: 0, y: 50}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{duration: 0.8, delay: index * 0.1}}
      className="relative w-full max-w-4xl mx-auto mb-24"
    >
      {/* Spiderweb Connection Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-24 w-px bg-ink/20" />

      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-paper border-woodcut">
        {/* Product Image with "Specimen" Frame */}
        <div className="relative w-full md:w-1/2 aspect-square p-4 border border-ink/10">
            <div className="absolute inset-0 border-2 border-dashed border-ink/20 pointer-events-none" />
            {image && (
                <Image
                data={image}
                aspectRatio="1/1"
                className="object-contain w-full h-full saturate-[0.7] hover:saturate-100 transition-all duration-500"
                sizes="(min-width: 45em) 40vw, 80vw"
                />
            )}
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-ink" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-ink" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-ink" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-ink" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs text-moss tracking-widest uppercase">
              Recovered Work No. 00{index + 1}
            </span>
            <h3 className="font-serif text-4xl text-ink boiling-line">
              {title}
            </h3>
            <div className="font-mono text-lg text-rust">
              <Money data={priceRange.minVariantPrice} />
            </div>
          </div>

          <p className="font-serif text-ink/70 italic">
            "A rare find from the deep overgrowth. Handle with care."
          </p>

          <Link to={`/products/${handle}`} className="btn-stamp inline-block">
            Examine Recovered Work
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
