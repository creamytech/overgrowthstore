import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useState, useEffect, useMemo, memo} from 'react';
import {TiltCard} from '~/components/ui/tilt-card';

// Configure your drop date here - Jan 23rd, 2026 at 1:00 PM EST
const DROP_DATE = new Date('2026-01-23T13:00:00-05:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Check if drop is locked (only updates when state changes)
function useLockState(targetDate: Date) {
  const [isLocked, setIsLocked] = useState(() => {
    return new Date().getTime() < targetDate.getTime();
  });

  useEffect(() => {
    const checkLock = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      if (now >= target && isLocked) {
        setIsLocked(false);
      }
    };

    checkLock();
    const timer = setInterval(checkLock, 1000);
    return () => clearInterval(timer);
  }, [targetDate, isLocked]);

  return isLocked;
}

// Countdown timer display component - matches DropHero style
const CountdownTimer = memo(function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex flex-col items-end">
      <span className="font-mono text-[9px] text-[#F2EFE9]/40 uppercase tracking-wider mb-3">
        Drop Unlocks In
      </span>
      <div className="flex items-center gap-4 md:gap-6">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hrs' },
          { value: timeLeft.minutes, label: 'Min' },
          { value: timeLeft.seconds, label: 'Sec' },
        ].map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-2">
            <span className="font-heading text-xl md:text-2xl text-[#F2EFE9] tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="font-mono text-[8px] text-[#F2EFE9]/40 uppercase tracking-wider">
              {unit.label}
            </span>
            {i < 3 && <span className="text-[#F2EFE9]/20 ml-2">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
});

// Lock icon component
function LockIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

/**
 * LatestDrops - Premium bento-style grid showcasing recent products
 * Features a hero product with supporting grid layout and countdown lock
 */
export function LatestDrops({products, title = "Current Drop"}: {products: any[], title?: string}) {
  const isLocked = useLockState(DROP_DATE);
  
  if (!products || products.length === 0) return null;

  // Split products: first is hero, rest are grid
  const heroProduct = products[0];
  const gridProducts = products.slice(1, 5); // Take up to 4 more

  // Product card content (shared between locked/unlocked states)
  const HeroContent = () => (
    <div className="relative aspect-[4/5] bg-[#1a1a1a] overflow-hidden">
      {heroProduct.featuredImage && (
        <Image
          data={heroProduct.featuredImage}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            isLocked ? 'grayscale-[30%] brightness-75' : 'group-hover:scale-105'
          }`}
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
          <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-[#F2EFE9]/30 rounded-full flex items-center justify-center mb-4">
            <LockIcon className="w-8 h-8 md:w-10 md:h-10 text-[#F2EFE9]/60" />
          </div>
          <span className="font-mono text-xs text-[#F2EFE9]/60 uppercase tracking-widest">
            Locked Until Drop
          </span>
        </div>
      )}
      
      {/* Corner markers - only show when unlocked */}
      {!isLocked && (
        <>
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
      
      {/* Badge */}
      <div className="absolute top-6 left-6 z-20">
        <span className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
          isLocked 
            ? 'bg-[#1a1a1a] border border-[#F2EFE9]/20 text-[#F2EFE9]/60' 
            : 'bg-[#B55A3C] text-[#F2EFE9]'
        }`}>
          {isLocked ? 'Dropping Soon' : 'Live Now'}
        </span>
      </div>
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <span className="font-mono text-[10px] text-[#F2EFE9]/50 uppercase tracking-wider block mb-2">
          Limited Edition
        </span>
        <h3 className={`font-heading text-2xl md:text-3xl text-[#F2EFE9] uppercase tracking-wide mb-3 ${
          !isLocked && 'group-hover:text-[#B55A3C]'
        } transition-colors`}>
          {heroProduct.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-heading text-xl text-[#F2EFE9]">
            <Money data={heroProduct.priceRange.minVariantPrice} />
          </span>
          {!isLocked && (
            <span className="font-mono text-[10px] text-[#F2EFE9]/40 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Shop Now →
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Grid product card content
  const GridProductContent = ({product}: {product: any}) => (
    <>
      <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-4">
        {product.featuredImage && (
          <Image
            data={product.featuredImage}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isLocked ? 'grayscale-[30%] brightness-75' : 'group-hover:scale-105'
            }`}
            sizes="(min-width: 1024px) 25vw, 50vw"
          />
        )}
        
        {/* Locked Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
            <div className="w-10 h-10 border border-[#F2EFE9]/30 rounded-full flex items-center justify-center">
              <LockIcon className="w-5 h-5 text-[#F2EFE9]/50" />
            </div>
          </div>
        )}
        
        {/* Hover overlay - only when unlocked */}
        {!isLocked && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="px-4 py-2 bg-[#F2EFE9] text-[#0a0a0a] font-mono text-[10px] uppercase tracking-wider">
                View
              </span>
            </div>
          </>
        )}
      </div>
      
      <div className="px-1">
        <h4 className={`font-heading text-sm text-[#F2EFE9] uppercase tracking-wide mb-1 ${
          !isLocked && 'group-hover:text-[#B55A3C]'
        } transition-colors truncate`}>
          {product.title}
        </h4>
        <span className="font-mono text-sm text-[#F2EFE9]/60">
          <Money data={product.priceRange.minVariantPrice} />
        </span>
      </div>
    </>
  );

  return (
    <section className="py-20 md:py-32 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #F2EFE9 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }} />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-12 left-12 w-32 h-32 border-l-2 border-t-2 border-[#F2EFE9]/10 hidden lg:block" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-r-2 border-b-2 border-[#F2EFE9]/10 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Section Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                {isLocked ? 'Dropping Soon' : 'Live Now'}
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl text-[#F2EFE9] tracking-[0.08em] uppercase">
              {title}
            </h2>
          </motion.div>
          
          {/* Countdown Timer or View All Link */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {isLocked ? (
              <CountdownTimer targetDate={DROP_DATE} />
            ) : (
              <Link 
                to="/products" 
                className="group inline-flex items-center gap-3 font-mono text-sm text-[#F2EFE9]/60 hover:text-[#B55A3C] transition-colors"
              >
                <span className="uppercase tracking-wider">View All</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          
          {/* Hero Product - Large Left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            {isLocked ? (
              <div className="block cursor-not-allowed">
                <HeroContent />
              </div>
            ) : (
              <TiltCard intensity={25} containerClassName="relative h-full">
                <Link to={`/products/${heroProduct.handle}`} className="block">
                  <HeroContent />
                </Link>
              </TiltCard>
            )}
          </motion.div>

          {/* Grid Products - Right Side */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {gridProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group"
              >
                {isLocked ? (
                  <div className="block cursor-not-allowed">
                    <GridProductContent product={product} />
                  </div>
                ) : (
                  <TiltCard intensity={20} containerClassName="relative">
                    <Link to={`/products/${product.handle}`} className="block">
                      <GridProductContent product={product} />
                    </Link>
                  </TiltCard>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
