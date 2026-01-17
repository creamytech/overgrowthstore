import {Skeleton} from '~/components/ui/skeleton';
import {Card, CardContent} from '~/components/ui/card';

export function ProductCardSkeleton() {
  return (
    <Card className="bg-[#F2EFE9] border-[#1a472a]/10 overflow-hidden">
      {/* Image skeleton */}
      <div className="relative aspect-[3/4] bg-[#1a472a]/5">
        <Skeleton className="absolute inset-0 bg-[#1a472a]/10" />
        
        {/* Specimen number placeholder */}
        <div className="absolute top-3 left-3 z-10">
          <Skeleton className="w-12 h-3 bg-[#1a472a]/10" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4 bg-[#1a472a]/10" />
        
        {/* Price */}
        <Skeleton className="h-3 w-1/3 bg-[#1a472a]/10" />
      </CardContent>
    </Card>
  );
}

export function ProductGridSkeleton({count = 8}: {count?: number}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({length: count}).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F2EFE9] pt-24 md:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex gap-2">
          <Skeleton className="h-3 w-16 bg-[#1a472a]/10" />
          <span className="text-[#8A8A84]">/</span>
          <Skeleton className="h-3 w-24 bg-[#1a472a]/10" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-[#1a472a]/5 border border-[#1a472a]/10">
            <Skeleton className="w-full h-full bg-[#1a472a]/10" />
          </div>

          {/* Info skeleton */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-3 w-20 bg-[#1a472a]/10" />
              <Skeleton className="h-10 w-3/4 bg-[#1a472a]/10" />
              <Skeleton className="h-6 w-1/4 bg-[#1a472a]/10" />
            </div>

            {/* Options skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-3 w-12 bg-[#1a472a]/10" />
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-12 bg-[#1a472a]/10" />
                ))}
              </div>
            </div>

            {/* CTA skeleton */}
            <Skeleton className="h-14 w-full bg-[#1a472a]/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
