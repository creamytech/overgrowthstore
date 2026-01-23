import {useState, useEffect} from 'react';
import {Link} from '@remix-run/react';
import {X, ChevronLeft, ChevronRight} from 'lucide-react';

interface AnnouncementMessage {
  id: string;
  text: string;
  link?: string;
  linkText?: string;
}

const announcements: AnnouncementMessage[] = [
  {
    id: '1',
    text: '🔥 OG-NYC-001 Live Now | Limited Availability',
    link: '/',
    linkText: 'View Drop',
  },
  {
    id: '2',
    text: '📦 Free shipping on orders over $150',
    link: '/pages/shipping',
    linkText: 'Learn More',
  },
  {
    id: '3',
    text: '⚡ Join the archive | Get early access to drops',
    link: '#newsletter',
    linkText: 'Subscribe',
  },
];

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate announcements
  useEffect(() => {
    if (!isAutoPlaying || announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Dismiss bar for session
  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('announcementDismissed', 'true');
  };

  // Check if already dismissed this session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcementDismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="bg-[#B55A3C] text-[#F2EFE9] relative z-[10000]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4">
        {/* Previous Button */}
        {announcements.length > 1 && (
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Announcement Content */}
        <div className="flex items-center gap-3 text-center flex-1 justify-center">
          <span className="font-mono text-[10px] sm:text-xs tracking-wide uppercase">
            {current.text}
          </span>
          {current.link && current.linkText && (
            <Link
              to={current.link}
              className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase underline underline-offset-2 hover:text-white transition-colors"
            >
              {current.linkText}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Next Button */}
        {announcements.length > 1 && (
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex((prev) => (prev + 1) % announcements.length);
            }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Indicators */}
      {announcements.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-0.5">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Go to announcement ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
