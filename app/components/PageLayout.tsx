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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}

      {/* Field Journal Navigation */}
      <header 
        role="banner" 
        className={`fixed top-0 left-0 w-full transition-all duration-500 z-[1000] flex justify-between items-center px-12 ${
            isScrolled 
            ? 'bg-[rgba(244,241,234,0.6)] backdrop-blur-lg py-4 shadow-sm border-b border-[#1a472a]/10' 
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
          <div className="relative w-12 h-12">
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
            className={`object-contain transition-all duration-500 ${isScrolled ? 'h-12' : 'h-16'}`}
          />
        </Link>

        {/* Right: Cart Icon */}
        <button
          onClick={openCart}
          className="menu-toggle"
          aria-label="Open Cart"
        >
           <div className="relative w-12 h-12">
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
    <Drawer open={isOpen} onClose={onClose} heading="SPECIMENS" openFrom="right" variant="cart">


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
    <nav className="grid gap-0 p-6 sm:px-12 sm:py-8 text-center">
      {/* Top level menu items */}
      {(menu?.items || []).map((item, index) => (
        <div key={item.id} className="flex flex-col items-center w-full">
          {index > 0 && (
            <div className="w-1/2 h-px bg-dark-green/20 my-4" />
          )}
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              `block font-heading text-3xl md:text-4xl tracking-widest text-dark-green hover:text-rust transition-colors duration-300 ${
                isActive ? 'opacity-100' : 'opacity-80'
              }`
            }
          >
            <span className="relative inline-block py-2">
                {item.title}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  );
}

function Footer({menu}: {menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <footer className="relative bg-[#f4f1ea] text-dark-green pt-[620px] pb-24 overflow-visible">
        {/* Root Transition Divider - The "Ceiling" */}
        {/* Positioned to overlap the section above by ~50px and hang down */}
        <div className="absolute -top-12 left-0 w-full h-[600px] z-10 pointer-events-none">
            <img 
                src="/assets/divider_root_transition.svg" 
                alt="Root Transition" 
                className="w-full h-full object-cover object-top mix-blend-multiply opacity-80"
            />
        </div>
        
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4">
        <div className={`grid items-start grid-flow-row w-full gap-6 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}`}>
            <FooterMenu menu={menu} />
            <div className="grid gap-4">
                <Heading className="font-heading text-xl text-dark-green" size="lead" as="h3">
                    LOCATION
                </Heading>
                <CountrySelector />
            </div>
            
            <div
            className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount} font-body text-sm`}
            >
            &copy; {new Date().getFullYear()} / OVERGROWTH. All rights reserved.
            </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({item}: {item: ChildEnhancedMenuItem}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer" className="hover:text-rust transition-colors">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent" className="hover:text-rust transition-colors">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: {menu?: EnhancedMenu}) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6 font-body',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between font-heading text-xl text-dark-green" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
