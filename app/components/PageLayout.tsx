import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {useScroll, useMotionValueEvent} from 'framer-motion';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Text, Heading, Section} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Input} from '~/components/Input';
import {Drawer, useDrawer} from '~/components/Drawer';
import {CountrySelector} from '~/components/CountrySelector';
import {IconInstagram, IconTiktok, IconX} from '~/components/ThemedIcons';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
  usePrefixPathWithLocale,
} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({children, layout}: LayoutProps) {
  const {headerMenu, footerMenu} = layout || {};
  return (
    <div className="relative bg-[#f4f1ea] min-h-screen">
      {/* Global paper texture overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')] z-0" />
      
      {headerMenu && layout?.shop.name && (
        <Header title={layout.shop.name} menu={headerMenu} />
      )}
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </div>
  );
}

function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  // Menu Icon Animation State
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);

  // Scroll State for Sticky Header
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If sentinel is NOT intersecting (out of view), we are scrolled down
        setIsScrolled(!entry.isIntersecting);
      },
      {threshold: 0}
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}

      {/* Scroll Sentinel - Invisible div at the very top */}
      <div id="scroll-sentinel" className="absolute top-0 left-0 w-full h-px pointer-events-none opacity-0" />

      {/* Field Journal Navigation */}
      <header 
        role="banner" 
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1000] px-4 md:px-12 pt-[env(safe-area-inset-top)] ${
            isScrolled 
            ? 'bg-[#f4f1ea]/95 backdrop-blur-sm py-3 md:py-4 shadow-md border-b border-rust/20' 
            : 'bg-transparent py-4 md:py-6 border-b border-transparent'
        }`}
      >
        <div className="flex justify-between items-center w-full">
            
            {/* --- MOBILE HEADER (md:hidden) --- */}
            <div className="flex md:hidden justify-between items-center w-full">
                {/* Left: Hamburger Menu */}
                <button
                onClick={openMenu}
                className="menu-toggle"
                aria-label="Open Menu"
                >
                <div className="relative w-10 h-10">
                    <img 
                    src="/assets/icon_menu_bud.png" 
                    alt="Menu" 
                    className="w-full h-full object-contain"
                    />
                </div>
                </button>

                {/* Center: Logo */}
                <Link to="/" prefetch="intent" className="nav-logo flex items-center justify-center">
                <img 
                    src="/assets/logo_og_vines.png" 
                    alt={title} 
                    className={`object-contain transition-all duration-500 ${isScrolled ? 'h-12' : 'h-16'}`}
                />
                </Link>

                {/* Right: Cart Icon */}
                <button
                onClick={openCart}
                className="menu-toggle"
                aria-label="Open Cart"
                >
                <div className="relative w-10 h-10">
                    <img 
                    src="/assets/icon_cart_woven.png" 
                    alt="Cart" 
                    className="w-full h-full object-contain nav-icon"
                    />
                    <CartBadge count={0} />
                </div>
                </button>
            </div>

            {/* --- DESKTOP HEADER (hidden md:flex) --- */}
            <div className="hidden md:grid grid-cols-3 items-center w-full">
                
                {/* Left: Navigation Links */}
                <nav className="flex items-center gap-8 justify-start">
                    {(menu?.items || []).map((item) => (
                        <Link
                            key={item.id}
                            to={item.to}
                            target={item.target}
                            prefetch="intent"
                            className={({isActive}: {isActive: boolean}) => 
                                `font-heading text-sm uppercase tracking-[0.2em] text-dark-green hover:text-rust hover-underline transition-colors duration-200 ${isActive ? 'active-underline text-rust' : ''}`
                            }
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Center: Logo */}
                <div className="flex justify-center">
                    <Link to="/" prefetch="intent" className="nav-logo">
                        <img 
                            src="/assets/Wordmark Logo.svg" 
                            alt={title} 
                            className={`object-contain transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}
                        />
                    </Link>
                </div>

                {/* Right: Icons (Account, Cart) */}
                <div className="flex items-center gap-6 justify-end">
                    {/* Account */}
                    <Link to="/account" className="w-6 h-6 text-dark-green hover:text-rust transition-colors">
                        <IconAccount className="w-full h-full" />
                    </Link>

                    {/* Cart */}
                    <button
                        onClick={openCart}
                        className="relative w-8 h-8 group"
                        aria-label="Open Cart"
                    >
                        <img 
                            src="/assets/icon_cart_woven.png" 
                            alt="Cart" 
                            className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                        <CartBadge count={0} />
                    </button>
                </div>
            </div>

        </div>
      </header>
    </>
  );
}

function CartBadge({count}: {count: number}) {
    const rootData = useRouteLoaderData<RootLoader>('root');
    
    return (
        <Suspense fallback={null}>
            <Await resolve={rootData?.cart}>
                {(cart) => {
                    const quantity = cart?.totalQuantity || 0;
                    if (quantity === 0) return null;
                    return (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-dark-green rounded-full flex items-center justify-center text-[10px] font-bold font-body border border-rust">
                            {quantity}
                        </div>
                    );
                }}
            </Await>
        </Suspense>
    );
}


function CartDrawer({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="RECOVERED WORKS" openFrom="right" variant="cart">


      <div className="relative z-10 grid h-full grid-rows-[1fr_auto]">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="FIELD GUIDE" variant="menu">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <MenuMobileNav menu={menu} onClose={onClose} />
        
        <p className="font-body text-xs tracking-widest text-dark-green/40 text-center">
            Where will you wander?
        </p>
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="flex flex-col gap-2">
      {(menu?.items || []).map((item, index) => (
        <Link
          key={item.id}
          to={item.to}
          target={item.target}
          onClick={onClose}
          className={({isActive}) =>
            `group flex items-center gap-4 py-4 border-b border-dark-green/10 hover:border-rust/30 transition-all duration-300 ${
              isActive ? 'border-rust/40' : ''
            }`
          }
        >
          {/* Number */}
          <span className="font-body text-xs text-dark-green/30 group-hover:text-rust/60 transition-colors w-6">
              {(index + 1).toString().padStart(2, '0')}.
          </span>
          
          {/* Title */}
          <span className="font-heading text-2xl md:text-3xl tracking-widest text-dark-green group-hover:text-rust transition-colors">
              {item.title}
          </span>

          {/* Arrow on hover */}
          <span className="ml-auto font-body text-rust opacity-0 group-hover:opacity-100 transition-opacity">
              →
          </span>
        </Link>
      ))}
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  
  // Randomized "zero point" coordinates for story engagement
  const [coordinates] = useState(() => {
    const locations = [
      { coords: '42.3314° N, 83.0458° W', name: 'Detroit Ruins' },
      { coords: '51.5074° N, 0.1278° W', name: 'London Overgrowth' },
      { coords: '35.6762° N, 139.6503° E', name: 'Tokyo Reclaim' },
      { coords: '48.8566° N, 2.3522° E', name: 'Paris Sector' },
      { coords: '40.7128° N, 74.0060° W', name: 'New York Vine' },
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  });
  
  // Generate Google Maps link from coordinates
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(coordinates.coords)}`;
  
  return (
    <footer className="relative z-[5]">
        {/* Custom CSS for footer hover effects */}
        <style>{`
          .footer-link {
            position: relative;
            transition: all 0.18s ease-out;
            display: inline-block;
          }
          .footer-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: #c05a34;
            transition: width 0.18s ease-out;
          }
          .footer-link:hover {
            transform: translateX(1px);
            letter-spacing: 0.18em;
            color: #f4f1ea;
          }
          .footer-link:hover::after {
            width: 100%;
            animation: underlineFlicker 0.8s ease-out forwards;
          }
          @keyframes underlineFlicker {
            0% { opacity: 0; width: 0; }
            50% { opacity: 1; width: 60%; }
            100% { opacity: 0.8; width: 100%; }
          }
          
          /* Pulsing arrow for coordinates */
          @keyframes signalSearch {
            0%, 85%, 100% { opacity: 1; transform: translateX(0); }
            90% { opacity: 0.5; transform: translateX(2px); }
            95% { opacity: 1; transform: translateX(0); }
          }
          .signal-arrow {
            display: inline-block;
            animation: signalSearch 6s ease-in-out infinite;
          }
        `}</style>

        {/* Roots Divider Graphic - Full Width */}
        <div className="w-full relative pointer-events-none z-[5]">
            <img 
                src="/assets/FooterDivider1.svg" 
                alt="Root Transition" 
                className="w-full h-auto opacity-80"
            />
        </div>

        {/* Footer Panel - THE SEDIMENT LAYER (Dark Background) */}
        <div className="relative bg-[#1A2E1A] pt-12 pb-12 px-6 md:px-12">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }} />
            
            <div className="max-w-6xl mx-auto relative z-10 space-y-8">
                
                {/* 1. Newsletter CTA - "Field Transmission" - Reduced padding */}
                <div className="max-w-xl mx-auto text-center space-y-3 pb-6">
                    <h4 className="font-heading text-3xl md:text-4xl text-[#f4f1ea] uppercase tracking-wider">
                        Join the Overgrowth
                    </h4>
                    <p className="font-mono text-[11px] text-[#f4f1ea]/40 uppercase tracking-[0.2em]">
                        Signals from the quiet places • Artifact drops • Survival notes
                    </p>
                    <div className="pt-2">
                        <NewsletterForm />
                    </div>
                </div>

                {/* Divider Line - Slightly stronger */}
                <div className="border-t border-[#f4f1ea]/30" />

                {/* 2. Navigation Links - "Manifest Grid" */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 py-6">
                    
                    {/* SECTORS */}
                    <div className="space-y-4">
                        <h5 className="font-heading text-base text-[#f4f1ea]/90 uppercase tracking-widest">
                            Sectors
                        </h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="/products" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Recovered Works
                            </Link>
                            <Link to="/collections" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Collections
                            </Link>
                            <Link to="/journal" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Field Journal
                            </Link>
                        </nav>
                    </div>

                    {/* INFO */}
                    <div className="space-y-4">
                        <h5 className="font-heading text-base text-[#f4f1ea]/90 uppercase tracking-widest">
                            Intel
                        </h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="/pages/our-story" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                The Genesis
                            </Link>
                        </nav>
                    </div>

                    {/* LOGISTICS */}
                    <div className="space-y-4">
                        <h5 className="font-heading text-base text-[#f4f1ea]/90 uppercase tracking-widest">
                            Logistics
                        </h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="/account" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Your Orders
                            </Link>
                            <Link to="/pages/faq" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Field Manual
                            </Link>
                            <Link to="/pages/contact" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Transmissions
                            </Link>
                        </nav>
                    </div>

                    {/* LEGAL */}
                    <div className="space-y-4">
                        <h5 className="font-heading text-base text-[#f4f1ea]/90 uppercase tracking-widest">
                            Legal
                        </h5>
                        <nav className="flex flex-col gap-3">
                            <Link to="/policies/privacy-policy" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Privacy
                            </Link>
                            <Link to="/policies/terms-of-service" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Terms
                            </Link>
                            <Link to="/policies/shipping-policy" className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-wider">
                                Shipping
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* 3. Bottom Bar - "Stamped Artifact" - Tighter gap */}
                <div className="pt-4 border-t border-[#f4f1ea]/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        
                        {/* Coordinates - Left - Now Clickable */}
                        <a 
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[11px] text-[#f4f1ea]/25 uppercase tracking-widest order-3 md:order-1 hover:text-rust transition-colors cursor-pointer group"
                            title={`Zero Point: ${coordinates.name}`}
                        >
                            <span className="group-hover:hidden">LOC: {coordinates.coords}</span>
                            <span className="hidden group-hover:inline text-rust"><span className="signal-arrow">→</span> {coordinates.name}</span>
                        </a>
                        
                        {/* Socials - Center (Text-based) */}
                        <div className="flex items-center gap-8 order-1 md:order-2">
                            <a 
                                href="https://instagram.com/overgrowth.co" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-widest"
                            >
                                FREQ: IG
                            </a>
                            <span className="text-[#f4f1ea]/15">•</span>
                            <a 
                                href="https://x.com/Overgrowthco" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="footer-link font-mono text-sm text-[#f4f1ea]/60 uppercase tracking-widest"
                            >
                                FREQ: X
                            </a>
                        </div>
                        
                        {/* Classification - Right */}
                        <div className="font-mono text-[11px] text-[#f4f1ea]/25 uppercase tracking-widest text-center md:text-right order-2 md:order-3">
                            CLASSIFIED // OVERGROWTH IND. // RECLAIMED & RESTORED
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>
  );
}

function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const actionUrl = usePrefixPathWithLocale('/api/newsletter');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const formData = new FormData();
            formData.append('email', email);
            
            const response = await fetch(actionUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error('Newsletter Error Status:', response.status, response.statusText);
                const text = await response.text();
                console.error('Newsletter Error Body:', text);
                try {
                    // Try to parse JSON error if available
                    const jsonError = JSON.parse(text) as {error?: string};
                    setStatus('error');
                    setMessage(jsonError.error || `Server Error: ${response.status}`);
                    return;
                } catch {
                    // Fallback if not JSON
                    setStatus('error');
                    setMessage(`Server Error: ${response.status}`);
                    return;
                }
            }
            
            const data = await response.json() as {success?: boolean; message?: string; error?: string};
            
            if (data.success) {
                setStatus('success');
                setMessage(data.message || 'Subscribed successfully.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Newsletter Network Error:', err);
            setStatus('error');
            setMessage('Network error. Check console.');
        }
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {status === 'success' ? (
                <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 border-2 border-rust rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-rust" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                    <p className="font-heading text-lg text-[#f4f1ea] tracking-widest uppercase">Uplink Established</p>
                    <p className="font-mono text-xs text-[#f4f1ea]/50 mt-2">{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="relative">
                    {/* Terminal-style Input Container */}
                    <div className="relative bg-transparent border border-[#f4f1ea]/20 p-1">
                        {/* Corner accents - Thicker for grit */}
                        <div className="absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-rust" />
                        <div className="absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-rust" />
                        <div className="absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-rust" />
                        <div className="absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-rust" />
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="[ ENTER FREQUENCY / EMAIL ]" 
                                required
                                className="flex-1 bg-transparent py-4 px-5 text-[#f4f1ea] placeholder:text-[#f4f1ea]/30 font-mono text-xs uppercase tracking-widest focus:outline-none border-b border-dashed border-[#f4f1ea]/20 sm:border-b-0"
                            />
                            <button 
                                type="submit" 
                                disabled={status === 'submitting'}
                                className="group relative border-2 border-rust text-rust px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-rust hover:text-[#f4f1ea] transition-all duration-300 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {status === 'submitting' ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-rust/30 border-t-rust rounded-full animate-spin" />
                                            ...
                                        </>
                                    ) : (
                                        'TRANSMIT'
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Privacy note */}
                    <p className="text-center font-mono text-[10px] text-[#f4f1ea]/30 mt-4 tracking-widest uppercase">
                        Signal encrypted. Unsubscribe anytime.
                    </p>
                    
                    {status === 'error' && (
                        <p className="text-center text-xs text-rust font-mono mt-3">{message}</p>
                    )}
                </form>
            )}
        </div>
    );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  // Force internal routing for Account/Orders to keep user in Hydrogen app
  if (item.title === 'Account' || item.title === 'Orders' || item.url?.includes('/account')) {
      return (
        <Link to="/account" prefetch="intent" className="group relative w-fit block py-1">
          <span className="hover:text-rust transition-colors duration-200">{item.title}</span>
          <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </Link>
      );
  }

  if (item.to.startsWith('http') || item.target === '_blank') {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer" className="group relative w-fit block py-1">
        <span className="hover:text-rust transition-colors duration-200">{item.title}</span>
        <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className="group relative w-fit block py-1">
      <span className="hover:text-rust transition-colors duration-200">{item.title}</span>
      <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  return (
    <nav className="grid gap-2 font-body text-sm text-dark-green/70">
      {(menu?.items || []).map((item) => (
        <div key={item.id}>
            {/* If it has sub-items, render them flattened or as a group? 
                For this design, let's assume a flat list or simple hierarchy. 
                The previous design used Disclosure, but for a cleaner footer we might just list them.
                Let's stick to simple links for top level if they have no children, or render children if they do.
            */}
            
            {item.items && item.items.length > 0 ? (
                <div className="mb-4">
                    <span className="block font-bold text-dark-green mb-2">{item.title}</span>
                    <div className="pl-2 border-l border-rust/20">
                        {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                        ))}
                    </div>
                </div>
            ) : (
                <FooterLink item={item} />
            )}
        </div>
      ))}
    </nav>
  );
}
