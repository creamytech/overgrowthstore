import {useEffect, useState, useRef} from 'react';
import {Link} from '@remix-run/react';
import {Badge} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import TextLoop from '~/components/text-loop';
import HoverArrowButton from '~/components/hover-arrow-button';

// Using Cloudinary transformation for boomerang effect (processed server-side)
// e_boomerang creates a forward-reverse loop at the CDN level
const HERO_VIDEO_URL = 'https://res.cloudinary.com/dzmc26src/video/upload/e_boomerang/v1768690424/Static_nighttime_shot_4k_202601171752_ci7i1q.mp4';

export function DropHero() {
  const [timeLeft, setTimeLeft] = useState<{days: number; hours: number; minutes: number; seconds: number} | null>(null);
  const [isLive, setIsLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simple video loop - Cloudinary handles the boomerang effect server-side
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video loops seamlessly
    video.loop = true;
    
    const handleEnded = () => {
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    // Target Date: Jan 23rd, 2026, 1:00 PM EST
    const dropDate = new Date('2026-01-23T13:00:00-05:00');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = dropDate.getTime() - now;

      if (distance < 0) {
        setIsLive(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]"
      style={{ minHeight: '100dvh' }}
    >
      
      {/* Video Background - Cinematic, dark */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        
        {/* Dark cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }} />
      </div>

      {/* Hero Content - SEO H1 + Wordmark Logo */}
      <div className="relative z-10 text-center px-6">
        <h1 className="sr-only">Overgrowth - Limited Edition Streetwear</h1>
        <img 
          src="/assets/Wordmark Logo.svg" 
          alt="Overgrowth" 
          className="h-16 md:h-24 lg:h-32 w-auto mx-auto mb-6"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <p className="font-mono text-sm text-[#F2EFE9]/60 max-w-lg mx-auto">
          Limited edition streetwear. Never restocked.
        </p>
      </div>


      {/* Bottom Countdown Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-[#0a0a0a]/90 backdrop-blur-sm border-t border-[#F2EFE9]/10">
          <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-center">
            
            {/* Countdown or Live */}
            {timeLeft && !isLive ? (
              <div className="flex items-center gap-6 md:gap-8">
                {[
                  {value: timeLeft.days, label: 'Days'},
                  {value: timeLeft.hours, label: 'Hrs'},
                  {value: timeLeft.minutes, label: 'Min'},
                  {value: timeLeft.seconds, label: 'Sec'},
                ].map(({value, label}, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="font-heading text-2xl md:text-3xl text-[#F2EFE9] tabular-nums">
                      {value.toString().padStart(2, '0')}
                    </span>
                    <span className="font-mono text-[8px] text-[#F2EFE9]/40 uppercase tracking-wider">
                      {label}
                    </span>
                    {i < 3 && <span className="text-[#F2EFE9]/20 ml-4">:</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[#B55A3C] rounded-full animate-pulse" />
                <span className="font-mono text-sm text-[#F2EFE9] uppercase tracking-wider">
                  Drop Live
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#F2EFE9]/30" />
      </div>
    </section>
  );
}
