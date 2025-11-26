import {XRayCard} from './XRayCard';

export function SpecimenGrid({products}: {products: any[]}) {
  return (
    <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
      {products.map((product) => (
        <XRayCard key={product.id} product={product} />
      ))}
    </div>
  );
}
