import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';

import {Heading} from '~/components/Text';
import {IconClose} from '~/components/Icon';

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
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
          enter="duration-100 steps(2)"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="duration-100 steps(2)"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                enter="transform transition duration-100 steps(2)"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition duration-100 steps(2)"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className={`w-screen max-w-lg text-left align-middle transition-all transform shadow-xl h-screen-dynamic ${variant === 'default' ? 'bg-contrast' : 'bg-transparent'}`}>
                  
                  {/* Vellum Background for Menu/Cart */}
                  {(variant === 'menu' || variant === 'cart') && (
                    <>
                        <div 
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: "url('/assets/ui_menu_vellum_bg.jpg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: 0.98,
                            }}
                        />
                        <div className="absolute inset-0 z-0 backdrop-blur-md bg-white/30" />
                    </>
                  )}

                  <div className={`relative z-10 h-full flex flex-col ${variant === 'menu' || variant === 'cart' ? 'px-12 py-24' : ''}`}>
                      <header
                        className={`flex items-center ${
                          variant === 'default' ? 'px-6 h-nav sm:px-8 md:px-12 justify-between' : 'mb-4 relative justify-center'
                        }`}
                      >
                        {heading !== null && (
                          <Dialog.Title>
                            <Heading as="span" size="lead" id="cart-contents" className={`${variant !== 'default' ? 'font-heading text-4xl tracking-widest text-dark-green' : ''}`}>
                              {heading}
                            </Heading>
                          </Dialog.Title>
                        )}
                        <button
                          type="button"
                          className={`p-4 -m-4 transition flex items-center gap-2 ${
                            variant !== 'default' ? 'absolute right-0' : ''
                          } ${
                            variant === 'cart' || variant === 'menu'
                                ? 'text-dark-green hover:text-rust' 
                                : 'text-primary hover:text-primary/50'
                          }`}
                          onClick={onClose}
                          data-test="close-cart"
                        >
                          <IconClose aria-label="Close panel" className="w-6 h-6" />
                        </button>
                      </header>
                      <div className="flex-grow overflow-y-auto">
                        {children}
                      </div>
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
