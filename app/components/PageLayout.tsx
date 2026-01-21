import {useParams, Form, Await, useRouteLoaderData, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useState, useRef} from 'react';
import {motion, useScroll, useTransform} from 'framer-motion';
import {CartForm} from '@shopify/hydrogen';

import {type LayoutQuery} from 'storefrontapi.generated';
import {Heading} from '~/components/Text';
import {Link} from '~/components/Link';
import {Cart} from '~/components/Cart';
import {CartLoading} from '~/components/CartLoading';
import {Drawer, useDrawer} from '~/components/Drawer';
import {
  IconAccount,
  IconBag,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import type {RootLoader} from '~/root';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';
import GlowingBorderButton from '~/components/glowing-border-button';

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
    <div className="relative bg-[#F2EFE9] min-h-screen">
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
  const location = useLocation();

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


  // Sync menu state to html for safe-area styling
  useEffect(() => {
    document.documentElement.setAttribute('data-menu-open', isMenuOpen ? 'true' : 'false');
  }, [isMenuOpen]);

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      // Sync to html element for CSS safe-area overlays
      document.documentElement.setAttribute('data-scrolled', scrolled ? 'true' : 'false');
    };
    // Initial call
    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect pages with dark hero sections (not just homepage)
  const hasDarkHero = (() => {
    const path = location.pathname;
    // Homepage, products, collections, FAQ, contact, cart, our-story, journal, account all have dark heroes
    if (isHome) return true;
    if (path.includes('/products/') && !path.endsWith('/products')) return true;
    if (path.includes('/collections/')) return true;
    if (path.endsWith('/products')) return true; // All products index
    if (path.includes('/faq')) return true;
    if (path.includes('/contact')) return true;
    if (path.includes('/cart')) return true;
    if (path.includes('/our-story')) return true;
    if (path.includes('/journal')) return true;
    if (path.includes('/account')) return true;
    if (path.includes('/shipping')) return true;
    if (path.includes('/lookbook')) return true;
    if (path.includes('/archive')) return true;
    if (path.includes('/size-guide')) return true;
    if (path.includes('/ecosystem')) return true;
    return false;
  })();

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}


      {/* Dark Header - consistent with drawer */}
      {/* isDarkHero: true when on a page with dark hero AND not scrolled past it */}
      {(() => {
        const isDarkHero = hasDarkHero && !isScrolled;
        
        return (
          <header 
            role="banner" 
            className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1000] px-6 md:px-12 ${
                isScrolled 
                ? 'bg-[#0a0a0a] backdrop-blur-sm pt-4 pb-3 border-b border-[#F2EFE9]/10' 
                : 'bg-transparent pt-6 pb-5 border-b border-transparent'
            }`}
            style={{
              paddingTop: isScrolled 
                ? 'calc(env(safe-area-inset-top) + 1rem)' 
                : 'calc(env(safe-area-inset-top) + 1.5rem)',
              paddingLeft: 'max(env(safe-area-inset-left), 1.5rem)',
              paddingRight: 'max(env(safe-area-inset-right), 1.5rem)',
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              isolation: 'isolate',
            }}
          >
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                
              {/* Left: Menu Icon - Active when menu is open */}
              <button
                onClick={isMenuOpen ? closeMenu : openMenu}
                className="group flex items-center gap-3"
                aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                <img 
                  src="/assets/Menu.png"
                  alt="Menu"
                  className={`transition-all duration-300 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
                  style={{
                    filter: (isDarkHero || isScrolled) ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
                <span className={`hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  (isDarkHero || isScrolled) ? 'text-[#F2EFE9]/70 group-hover:text-[#F2EFE9]' : 'text-[#8A8A84] group-hover:text-[#1a472a]'
                }`}>
                  {isMenuOpen ? 'Close' : 'Menu'}
                </span>
              </button>

              {/* Center: Logo */}
              <Link to="/" prefetch="intent" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img 
                  src="/assets/logo_og_vines.png" 
                  alt="Overgrowth"
                  className={`transition-all duration-500 ${isScrolled ? 'h-10 md:h-12' : 'h-14 md:h-16'}`}
                  style={{
                    filter: (isDarkHero || isScrolled) ? 'brightness(0) invert(1)' : 'none',
                  }}
                />
              </Link>

              {/* Right: Cart Icon - Active when cart drawer is open OR items in cart */}
              <div className="flex items-center gap-4 md:gap-6">
                <CartIcon 
                  isOpen={isCartOpen} 
                  onClick={openCart} 
                  isScrolled={isScrolled}
                  isDarkHero={isDarkHero}
                />
              </div>
            </div>
          </header>
        );
      })()}
    </>
  );
}

function CartBadge({isLight = false}: {isLight?: boolean}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  
  return (
    <Suspense fallback={null}>
      <Await resolve={rootData?.cart}>
        {(cart) => {
          const quantity = cart?.totalQuantity || 0;
          if (quantity === 0) return null;
          return (
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
              isLight ? 'bg-[#F2EFE9] text-[#1a472a]' : 'bg-[#B55A3C] text-[#F2EFE9]'
            }`}>
              {quantity}
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
}

function CartIcon({
  isOpen,
  onClick,
  isScrolled,
  isDarkHero,
}: {
  isOpen: boolean;
  onClick: () => void;
  isScrolled: boolean;
  isDarkHero: boolean;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  
  return (
    <Suspense fallback={
      <button onClick={onClick} className="relative group" aria-label="Open Cart">
        <img 
          src="/assets/CartInactive.png"
          alt="Cart"
          className={`transition-all duration-300 group-hover:scale-110 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
          style={{ filter: (isDarkHero || isScrolled) ? 'brightness(0) invert(1)' : 'none' }}
        />
      </button>
    }>
      <Await resolve={rootData?.cart}>
        {(cart) => {
          const hasItems = (cart?.totalQuantity || 0) > 0;
          const isActive = isOpen || hasItems;
          
          return (
            <button
              onClick={onClick}
              className="relative group"
              aria-label="Open Cart"
            >
              <img 
                src={isActive ? '/assets/CartActive.png' : '/assets/CartInactive.png'}
                alt="Cart"
                className={`transition-all duration-300 group-hover:scale-110 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
                style={{ filter: (isDarkHero || isScrolled) ? 'brightness(0) invert(1)' : 'none' }}
              />
              <CartBadge isLight={isDarkHero || isScrolled} />
            </button>
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
    <Drawer open={isOpen} onClose={onClose} heading="YOUR CART" openFrom="right" variant="cart">
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
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="MENU" variant="menu">
      <div className="relative z-10 flex flex-col h-full justify-between">
        <MenuMobileNav menu={menu} onClose={onClose} />
        
        <p className="font-mono text-[10px] tracking-[0.2em] text-[#8A8A84]/40 text-center uppercase">
          Streetwear Reclaimed
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
    <nav className="flex flex-col h-full">
      {/* Main Menu Items - Centered */}
      <div className="flex-1 flex flex-col justify-center">
        {(menu?.items || []).map((item, index) => (
          <Link
            key={item.id}
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `group relative block py-5 md:py-6 border-b border-[#F2EFE9]/10 hover:bg-[#F2EFE9]/5 transition-all duration-300 ${
                isActive ? 'bg-[#B55A3C]/10 border-[#B55A3C]/30' : ''
              }`
            }
          >
            <div className="flex items-center justify-center gap-4">
              <span className="font-mono text-xs text-[#B55A3C] tracking-wide opacity-60 group-hover:opacity-100 transition-opacity">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              
              <span className="font-heading text-3xl md:text-4xl tracking-[0.08em] text-[#F2EFE9] group-hover:text-[#B55A3C] transition-colors uppercase">
                {item.title}
              </span>

              <span className="font-heading text-2xl md:text-3xl text-[#B55A3C] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                →
              </span>
            </div>
            
            {/* Hover accent line - centered */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#B55A3C] group-hover:w-1/2 transition-all duration-500" />
          </Link>
        ))}
      </div>
      
      {/* Quick Links - Centered */}
      <div className="mt-auto pt-8 border-t border-[#F2EFE9]/10 text-center">
        <span className="font-mono text-[10px] text-[#F2EFE9]/40 tracking-[0.3em] uppercase block mb-4">
          Quick Access
        </span>
        <div className="flex justify-center gap-8">
          <Link 
            to="/account" 
            onClick={onClose}
            className="font-mono text-base text-[#F2EFE9]/60 hover:text-[#B55A3C] transition-colors"
          >
            Account
          </Link>
          <Link 
            to="/pages/faq" 
            onClick={onClose}
            className="font-mono text-base text-[#F2EFE9]/60 hover:text-[#B55A3C] transition-colors"
          >
            Help
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "start 0.3"]
  });
  
  // Footer content slides up from behind the divider
  const footerY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  
  return (
    <footer ref={footerRef} className="relative bg-[#0a0a0a] text-[#F2EFE9]">
      
      {/* Decorative Divider - Static, sits on top */}
      <div className="relative z-10 w-full bg-[#0a0a0a]">
        <img 
          src="/assets/FooterDivider1.svg" 
          alt="" 
          className="w-full h-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>
      
      {/* Main Footer Content - Slides up from behind the divider */}
      <motion.div 
        style={{ 
          y: footerY,
          opacity: footerOpacity,
        }}
        className="relative z-0"
      >
        <div className="grid lg:grid-cols-[1.2fr,1fr]">
        
        {/* Left: Brand Statement */}
        <div className="relative flex flex-col justify-center items-center lg:items-start p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#F2EFE9]/10 text-center lg:text-left">
          
          <div className="max-w-md">
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase block mb-6">
              Est. 2026
            </span>
            
            {/* Wordmark Logo - inverted to white */}
            <img 
              src="/assets/Wordmark Logo.svg" 
              alt="Overgrowth" 
              className="h-12 md:h-16 lg:h-20 w-auto mb-6 mx-auto lg:mx-0"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
            
            <p className="font-mono text-xs text-[#F2EFE9]/40 leading-relaxed max-w-sm mb-8 mx-auto lg:mx-0">
              Premium streetwear, released in limited quantities. Once sold out, it's gone.
            </p>
            
            {/* Social */}
            <div className="flex gap-6 justify-center lg:justify-start">
              <a 
                href="https://instagram.com/overgrowth.co" 
                target="_blank" 
                rel="noreferrer" 
                className="font-mono text-xs text-[#F2EFE9]/40 hover:text-[#B55A3C] transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://x.com/Overgrowthco" 
                target="_blank" 
                rel="noreferrer" 
                className="font-mono text-xs text-[#F2EFE9]/40 hover:text-[#B55A3C] transition-colors"
              >
                X / Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Right: Newsletter + Links */}
        <div className="flex flex-col justify-center items-center lg:items-start p-8 md:p-12 lg:p-16 text-center lg:text-left">
          
          {/* Newsletter */}
          <div className="mb-16 w-full max-w-sm">
            <span className="font-mono text-[9px] text-[#F2EFE9]/30 tracking-[0.3em] uppercase block mb-4">
              Join The Archive
            </span>
            <p className="font-mono text-xs text-[#F2EFE9]/50 mb-6">
              First access to new recoveries and exclusive drops.
            </p>
            <NewsletterForm />
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 w-full max-w-sm">
            <div>
              <span className="font-mono text-[9px] text-[#F2EFE9]/20 tracking-[0.3em] uppercase block mb-4">
                Shop
              </span>
              <nav className="flex flex-col gap-3">
                <Link to="/products" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  All Pieces
                </Link>
                <Link to="/pages/lookbook" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  Lookbook
                </Link>
                <Link to="/pages/archive" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  Drop Archive
                </Link>
              </nav>
            </div>
            
            <div>
              <span className="font-mono text-[9px] text-[#F2EFE9]/20 tracking-[0.3em] uppercase block mb-4">
                Help
              </span>
              <nav className="flex flex-col gap-3">
                <Link to="/pages/size-guide" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  Size Guide
                </Link>
                <Link to="/pages/shipping" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  Shipping & Returns
                </Link>
                <Link to="/pages/faq" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  FAQ
                </Link>
                <Link to="/pages/contact" className="font-mono text-sm text-[#F2EFE9]/50 hover:text-[#B55A3C] transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div 
        className="border-t border-[#F2EFE9]/10 px-8 md:px-12 py-6"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="font-mono text-[9px] text-[#F2EFE9]/30 tracking-wider">
              © {new Date().getFullYear()} OVERGROWTH
            </div>
            
            <div className="flex gap-6 font-mono text-[9px] text-[#F2EFE9]/30 tracking-wider">
              <Link to="/policies/terms-of-service" className="hover:text-[#F2EFE9]/60 transition-colors">
                Terms
              </Link>
              <Link to="/policies/privacy-policy" className="hover:text-[#F2EFE9]/60 transition-colors">
                Privacy
              </Link>
            </div>
          </div>
          
          {/* Pixel Boba attribution */}
          <a 
            href="https://www.pixelboba.com" 
            target="_blank" 
            rel="noreferrer"
            className="font-mono text-[8px] text-[#F2EFE9]/40 hover:text-[#F2EFE9]/60 tracking-wider transition-colors"
          >
            An in-house project by Pixel Boba
          </a>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json() as { success?: boolean };
      
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setStatus('error');
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {status === 'success' ? (
        <div className="text-center py-6">
          <span className="font-mono text-[10px] text-[#B55A3C] tracking-[0.2em] uppercase">
            ✓ You're In
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for drop alerts" 
            required
            className="w-full sm:flex-1 bg-[#1a1a1a] border border-[#F2EFE9]/20 py-4 px-5 text-[#F2EFE9] placeholder:text-[#8A8A84]/40 font-mono text-xs tracking-wide focus:outline-none focus:border-[#B55A3C] transition-colors"
          />
          <GlowingBorderButton 
            text={status === 'submitting' ? '...' : 'Join Now'}
            type="submit"
            className="w-full sm:w-auto"
          />
        </form>
      )}
    </div>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http') || item.target === '_blank') {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer" className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8A8A84] hover:text-[#B55A3C] transition-colors">
      {item.title}
    </Link>
  );
}
