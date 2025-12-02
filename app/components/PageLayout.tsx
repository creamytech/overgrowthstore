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
    <>
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
    </>
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
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1000] px-4 md:px-12 ${
            isScrolled 
            ? 'bg-[#f4f1ea]/90 backdrop-blur-md py-4 shadow-md border-b border-rust/20' 
            : 'bg-transparent py-6 border-b border-transparent'
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


      <div className="relative z-10 grid h-full content-between pb-8">
        <MenuMobileNav menu={menu} onClose={onClose} />
        
        <div className="text-center font-body text-xs tracking-widest text-dark-green opacity-60">
            FIG. 01 — FLORA
        </div>
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Map menu items to background images (conceptually)
  const getBackgroundImage = (index: number) => {
      const images = [
          // '/assets/texture_archive_paper.jpg',      // 0 - Home
          '/assets/hero_horse_skeleton_isolated.png', // 1 - Catalog
          '/assets/ui_menu_vellum_bg.jpg',          // 2 - Journal
          '/assets/divider_root_transition.svg'     // 3 - Our Story
      ];
      return images[index % images.length];
  };

  return (
    <nav className="relative grid gap-6 p-6 sm:px-12 sm:py-8 w-full max-w-md mx-auto z-20">
      
      {/* Background Image Area (Fixed/Absolute behind menu) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-10 transition-opacity duration-700">
          {menu?.items?.map((_, index) => (
              <div 
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out mix-blend-multiply ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}
                style={{backgroundImage: `url('${getBackgroundImage(index)}')`}}
              />
          ))}
      </div>

      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <div 
            key={item.id} 
            className="w-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `group flex items-baseline justify-between border-b border-[#8B3A3A] pb-2 hover:border-[#8B3A3A] transition-all duration-100 steps(2) ${
                isActive ? 'opacity-100' : 'opacity-80'
              }`
            }
          >
            <div className="flex items-baseline gap-4">
                {/* Chapter Number */}
                <span className="font-typewriter text-xs text-dark-green/40 group-hover:text-rust transition-colors duration-100 steps(2)">
                    {(index + 1).toString().padStart(2, '0')}.
                </span>
                
                {/* Title */}
                <span className="font-heading text-3xl md:text-4xl tracking-widest text-dark-green group-hover:translate-x-4 transition-transform duration-100 steps(4)">
                    {item.title}
                </span>
            </div>

            {/* Hover Arrow / Active Indicator */}
            <span className="font-handwritten text-xl text-rust opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-100 steps(4)">
                &rarr;
            </span>
          </Link>
        </div>
      ))}
      
      {/* Decorative End Mark */}
      <div className="flex justify-center pt-8 opacity-30">
          <img src="/assets/icon_menu_bud.png" alt="End" className="w-6 h-6" />
      </div>
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  
  return (
    <footer className="relative bg-[#f4f1ea] text-dark-green">
        
        {/* Roots Divider Graphic - Full Width */}
        <div className="w-full h-[400px] md:h-[600px] relative z-10 -mb-40 md:-mb-48 pointer-events-none">
            <img 
                src="/assets/divider_root_transition.svg" 
                alt="Root Transition" 
                className="w-full h-full object-cover object-top"
            />
            {/* Gradient to blend roots into footer bg */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f4f1ea]/10 to-[#f4f1ea]"></div>
        </div>

        {/* Footer Panel */}
        <div className="relative z-20 bg-[#f4f1ea] pt-8 pb-24 px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-16">
                
                {/* 1. Newsletter CTA */}
                <div className="space-y-6">
                    <h4 className="font-heading text-3xl md:text-4xl text-dark-green uppercase tracking-widest">
                        Join the Overgrowth
                    </h4>
                    <p className="font-body text-dark-green/70">
                        First looks. New drops. Stories from the reclaimed world.
                    </p>
                    <div className="flex justify-center">
                        <NewsletterForm />
                    </div>
                </div>

                {/* 2. Navigation Links */}
                <div className="border-t-0 pt-9">
                    {/* Micro-Divider */}
                    <div className="flex justify-center pb-8">
                        <div className="w-24 h-px bg-rust/55"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
                    
                    {/* Primary Links */}
                    <div className="space-y-4 text-right md:text-right pr-4 md:pr-8">
                        <h5 className="font-heading text-base text-dark-green font-bold uppercase tracking-[0.25em] mb-4">Protocol</h5>
                        <nav className="flex flex-col gap-4 font-heading text-xl text-dark-green uppercase tracking-widest leading-relaxed items-end">
                            <Link to="/products" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">Shop Recovered Works</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                            <Link to="/journal" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">Field Journal</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                            <Link to="/pages/ecosystem" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">The Ecosystem</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                        </nav>
                    </div>

                    {/* Secondary Links */}
                    <div className="space-y-4 text-left md:text-left pl-4 md:pl-0">
                        <h5 className="font-heading text-base text-dark-green font-bold uppercase tracking-[0.25em] mb-4">Support</h5>
                        <nav className="flex flex-col gap-3 font-body text-sm text-dark-green/70 leading-relaxed items-start">
                            <Link to="/account" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">Mission Log (Orders)</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                            <Link to="/pages/contact" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">Contact Command</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                            <Link to="/pages/faq" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">FAQ</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                            <Link to="/policies/privacy-policy" className="group relative w-fit block">
                                <span className="hover:text-rust transition-colors duration-500">Privacy Protocol</span>
                                <span className="absolute bottom-0 left-0 w-full h-px bg-rust transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

                {/* 3. Social & Copyright */}
                <div className="space-y-8 pt-12 border-t border-dark-green/10">
                    {/* Social Icons */}
                    <div className="flex justify-center gap-4">
                        {['IG', 'TK', 'X'].map((social) => (
                            <a key={social} href="#" className="w-10 h-10 border border-rust rounded-full flex items-center justify-center text-xs font-heading text-rust hover:border-dark-green hover:text-dark-green hover:bg-dark-green/5 hover:shadow-[0_0_15px_rgba(20,40,30,0.2)] transition-all duration-300">
                                {social}
                            </a>
                        ))}
                    </div>

                    <div className="opacity-50 space-y-2">
                        <p className="font-heading text-xs tracking-widest uppercase text-dark-green font-bold">
                            Overgrowth Industries
                        </p>
                        <p className="font-body text-[10px] tracking-widest uppercase">
                            Streetwear from the reclaimed world
                        </p>
                        <p className="font-body text-[10px] tracking-widest uppercase pt-2">
                            &copy; {new Date().getFullYear()} OVERGROWTH. All Rights Reserved.
                        </p>
                    </div>
                </div>

            </div>
        </div>
        
        {/* Background Texture */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[url('/assets/topo-pattern.png')] opacity-[0.03] pointer-events-none" />
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
                setMessage(data.error || 'Transmission failed.');
            }
        } catch (err) {
            console.error('Newsletter Network Error:', err);
            setStatus('error');
            setMessage('Network error. Check console.');
        }
    };

    return (
        <div className="relative w-full max-w-md">
            {status === 'success' ? (
                <div className="p-4 border border-rust/20 bg-dark-green/5 text-dark-green text-sm font-body">
                    {message}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="relative w-full translate-x-3">
                    <div className="flex items-center gap-0 transition-colors rounded-[3px] overflow-hidden border border-dark-green/10">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ENTER FREQUENCY (EMAIL)" 
                            required
                            className="w-full bg-transparent py-5 px-4 text-dark-green placeholder:text-dark-green/40 font-typewriter text-sm focus:outline-none bg-dark-green/5 rounded-l-[3px]"
                        />
                        <button 
                            type="submit" 
                            disabled={status === 'submitting'}
                            className="bg-dark-green text-[#f4f1ea] px-8 py-5 font-heading text-xs uppercase tracking-widest hover:bg-rust transition-all duration-300 disabled:opacity-50 whitespace-nowrap rounded-r-[3px] hover:shadow-[0_0_15px_rgba(139,58,58,0.4)]"
                        >
                            {status === 'submitting' ? 'SENDING...' : 'Submit'}
                        </button>
                    </div>
                    {status === 'error' && (
                        <p className="absolute -bottom-6 left-0 text-xs text-red-800 font-body">{message}</p>
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
