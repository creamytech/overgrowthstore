import {useParams, Form, Await, useRouteLoaderData} from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
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
      <div className="flex flex-col min-h-screen relative z-10">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
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

  // Use IntersectionObserver to detect scroll
  // This is more robust than window.scrollY as it works regardless of what container is scrolling
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
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1000] flex justify-between items-center px-12 ${
            isScrolled 
            ? 'bg-[#f4f1ea]/95 backdrop-blur-md py-4 shadow-md border-b border-dark-green/10' 
            : 'bg-transparent py-6 border-b border-transparent'
        }`}
      >
        {/* Left: Hamburger Menu (Bud to Bloom) */}
        <button
          onClick={openMenu}
          className="menu-toggle"
          aria-label="Open Menu"
          onMouseEnter={() => setIsHoveringMenu(true)}
          onMouseLeave={() => setIsHoveringMenu(false)}
        >
          <div className="relative w-10 h-10">
             {/* Bud (Default) */}
             <img 
               src="/assets/icon_menu_bud.png" 
               alt="Menu" 
               className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-300 ${isHoveringMenu ? 'opacity-0' : 'opacity-100'}`}
             />
             {/* Bloom (Hover) */}
             <img 
               src="/assets/icon_menu_bloom.png" 
               alt="Menu Open" 
               className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-300 ${isHoveringMenu ? 'opacity-100' : 'opacity-0'}`}
             />
          </div>
        </button>

        {/* Center: Logo */}
        <Link to="/" prefetch="intent" className="nav-logo flex items-center justify-center">
          <img 
            src="/assets/logo_og_vines.png" 
            alt={title} 
            className={`object-contain transition-all duration-500 ${isScrolled ? 'h-14' : 'h-20'}`}
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
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-dark-green rounded-full flex items-center justify-center text-[10px] font-bold font-body border border-dark-green">
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
    <Drawer open={isOpen} onClose={onClose} heading="SALVAGE" openFrom="right" variant="cart">


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
  return (
    <nav className="grid gap-6 p-6 sm:px-12 sm:py-8 w-full max-w-md mx-auto">
      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <div key={item.id} className="w-full">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `group flex items-baseline justify-between border-b border-dark-green/10 pb-2 hover:border-dark-green/40 transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-80'
              }`
            }
          >
            <div className="flex items-baseline gap-4">
                {/* Chapter Number */}
                <span className="font-typewriter text-xs text-dark-green/40 group-hover:text-rust transition-colors">
                    {(index + 1).toString().padStart(2, '0')}.
                </span>
                
                {/* Title */}
                <span className="font-heading text-3xl md:text-4xl tracking-widest text-dark-green group-hover:translate-x-2 transition-transform duration-300">
                    {item.title}
                </span>
            </div>

            {/* Hover Arrow / Active Indicator */}
            <span className="font-handwritten text-xl text-rust opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                &rarr;
            </span>
          </Link>
          
          {/* Active State Note */}
          {/* We can't easily check isActive here without the render prop, so we'll skip the note for now or use a match hook if needed. 
              For simplicity in this component structure, we'll rely on the visual opacity/color change. */}
        </div>
      ))}
      
      {/* Decorative End Mark */}
      <div className="flex justify-center pt-8 opacity-30">
          <img src="/assets/icon_leaf_small.png" alt="End" className="w-6 h-6" />
      </div>
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  
  return (
    <footer className="relative bg-[#f4f1ea] text-dark-green pt-[620px] pb-12 overflow-visible">
        {/* Root Transition Divider - The "Ceiling" */}
        {/* Positioned to overlap the section above by ~50px and hang down */}
        <div className="absolute -top-12 left-0 w-full h-[600px] z-10 pointer-events-none">
            <img 
                src="/assets/divider_root_transition.svg" 
                alt="Root Transition" 
                className="w-full h-full object-cover object-top mix-blend-multiply opacity-80"
            />
        </div>

        {/* Top Border / Divider (Optional now, maybe redundant with the root transition, but keeping for structure if needed below the image) */}
        {/* <div className="absolute top-0 left-0 w-full h-px bg-dark-green/10" /> */}
        
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12 md:gap-24">
                
                {/* Column 1: Brand & Newsletter */}
                <div className="space-y-8">
                    <div className="max-w-xs">
                        <Link to="/" className="block mb-6">
                            <img src="/assets/logo_og_vines.png" alt="Overgrowth" className="h-12 object-contain" />
                        </Link>
                        <p className="font-body text-sm text-dark-green/70 leading-relaxed mb-6">
                            Survival gear for the urban jungle. Reclaiming the world, one garment at a time.
                        </p>
                        
                        <NewsletterForm />
                    </div>
                </div>

                {/* Column 2: Navigation */}
                <div>
                    <Heading className="font-heading text-lg text-dark-green uppercase tracking-widest mb-6" size="lead" as="h3">
                        Field Guide
                    </Heading>
                    <FooterMenu menu={menu} />
                </div>

                {/* Column 3: Legal / Info */}
                <div>
                    <Heading className="font-heading text-lg text-dark-green uppercase tracking-widest mb-6" size="lead" as="h3">
                        Protocol
                    </Heading>
                    <nav className="grid gap-3 font-body text-sm text-dark-green/70">
                        <Link to="/policies/privacy-policy" className="hover:text-rust transition-colors">Privacy Protocol</Link>
                        <Link to="/policies/terms-of-service" className="hover:text-rust transition-colors">Terms of Engagement</Link>
                        <Link to="/policies/shipping-policy" className="hover:text-rust transition-colors">Supply Lines</Link>
                        <Link to="/policies/refund-policy" className="hover:text-rust transition-colors">Return Manifest</Link>
                    </nav>
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="mt-24 pt-8 border-t border-dark-green/10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
                <p className="font-body text-xs tracking-widest uppercase">
                    &copy; {new Date().getFullYear()} Overgrowth Industries.
                </p>
                <p className="font-body text-xs tracking-widest uppercase">
                    All Rights Reserved.
                </p>
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
            
            const data = await response.json() as {success?: boolean; message?: string; error?: string};
            
            if (response.ok && data.success) {
                setStatus('success');
                setMessage(data.message || 'Subscribed successfully.');
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.error || 'Transmission failed.');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Network error. Try again.');
        }
    };

    return (
        <div className="relative">
            <h4 className="font-heading text-sm text-rust uppercase tracking-widest mb-3">
                Join the Resistance
            </h4>
            
            {status === 'success' ? (
                <div className="p-4 border border-dark-green/20 bg-dark-green/5 text-dark-green text-sm font-body">
                    {message}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="relative">
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ENTER FREQUENCY (EMAIL)" 
                        required
                        className="w-full bg-transparent border-b border-dark-green/30 py-3 pr-12 text-dark-green placeholder:text-dark-green/40 font-body text-sm focus:outline-none focus:border-rust transition-colors"
                    />
                    <button 
                        type="submit" 
                        disabled={status === 'submitting'}
                        className="absolute right-0 top-0 h-full text-rust hover:text-dark-green transition-colors font-heading text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {status === 'submitting' ? 'SENDING...' : 'TRANSMIT'}
                    </button>
                    {status === 'error' && (
                        <p className="absolute -bottom-6 left-0 text-xs text-red-800 font-body">{message}</p>
                    )}
                </form>
            )}
        </div>
    );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer" className="hover:text-rust transition-colors block py-1">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className="hover:text-rust transition-colors block py-1">
      {item.title}
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
                    <div className="pl-2 border-l border-dark-green/10">
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
