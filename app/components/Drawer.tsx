import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';

import {Heading} from '~/components/Text';
import {IconClose} from '~/components/Icon';

/**
 * Drawer component that opens on user click.
 */

export function Drawer({
  heading,
  open,
  onClose,
  openFrom = 'right',
  children,
  variant = 'default',
}: {
  heading?: string;
  open: boolean;
  onClose: () => void;
  openFrom: 'right' | 'left';
  children: React.ReactNode;
  variant?: 'menu' | 'cart' | 'default';
}) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[2000]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="duration-200 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark-green/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : ''
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition duration-300 ease-out"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition duration-200 ease-out"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className={`w-screen max-w-lg text-left align-middle transition-all transform shadow-2xl h-screen-dynamic ${variant === 'default' ? 'bg-contrast' : 'bg-[#f4f1ea]'}`}>
                  
                  {/* Simple edge accent for Menu/Cart */}
                  {(variant === 'menu' || variant === 'cart') && (
                    <div 
                        className={`absolute top-0 bottom-0 w-1 ${openFrom === 'left' ? 'right-0' : 'left-0'} bg-gradient-to-b from-rust/40 via-dark-green/30 to-rust/40`}
                    />
                  )}

                  <div className={`relative z-10 h-full flex flex-col ${variant === 'menu' || variant === 'cart' ? 'px-8 md:px-12 py-16' : ''}`}>
                      <header
                        className={`flex items-center ${
                          variant === 'default' ? 'px-6 h-nav sm:px-8 md:px-12 justify-between' : 'mb-10 relative justify-center flex-col items-center text-center'
                        }`}
                      >
                        {heading !== null && variant !== 'default' && (
                          <>
                            <span className="text-rust text-[10px] tracking-[0.3em] font-body uppercase mb-2">
                                {variant === 'menu' ? '— Navigate' : '— Your Cart'}
                            </span>
                            <Dialog.Title>
                              <Heading as="span" size="lead" id="cart-contents" className="font-heading text-4xl md:text-5xl tracking-widest text-dark-green">
                                {heading}
                              </Heading>
                            </Dialog.Title>
                            <div className="w-16 h-0.5 bg-rust mt-4 mx-auto" />
                          </>
                        )}
                        {heading !== null && variant === 'default' && (
                          <Dialog.Title>
                            <Heading as="span" size="lead" id="cart-contents">
                              {heading}
                            </Heading>
                          </Dialog.Title>
                        )}
                        {variant === 'default' && (
                          <button
                            type="button"
                            className="p-4 -m-4 transition flex items-center gap-2 text-primary hover:text-primary/50"
                            onClick={onClose}
                            data-test="close-cart"
                          >
                            <IconClose aria-label="Close panel" className="w-6 h-6" />
                          </button>
                        )}
                      </header>
                      <div className="flex-grow overflow-y-auto scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                        {children}
                      </div>
                      
                      {/* Simple Close Button - rust hover */}
                      {(variant === 'menu' || variant === 'cart') && (
                          <div className="pt-6 text-center">
                              <button 
                                  type="button"
                                  onClick={onClose}
                                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-dark-green/30 hover:border-rust hover:bg-rust/10 transition-all duration-300"
                                  aria-label="Close"
                              >
                                  <span className="font-body text-xs tracking-widest text-dark-green group-hover:text-rust transition-colors uppercase">
                                      Close
                                  </span>
                                  <svg className="w-3.5 h-3.5 text-dark-green/60 group-hover:text-rust transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                              </button>
                          </div>
                      )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}
