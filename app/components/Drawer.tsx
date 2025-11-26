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
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
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
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className={`w-screen max-w-lg text-left align-middle transition-all transform shadow-xl h-screen-dynamic ${variant === 'default' ? 'bg-contrast' : 'bg-transparent'}`}>
                  
                  {/* SVG Backgrounds Removed - Handled by parent components */}

                  <div className={`relative z-10 h-full flex flex-col ${variant === 'menu' ? 'px-12 py-24' : variant === 'cart' ? 'px-16 py-20' : ''}`}>
                      <header
                        className={`flex items-center ${
                          variant === 'default' ? 'px-6 h-nav sm:px-8 md:px-12' : 'mb-4'
                        } ${heading ? 'justify-between' : 'justify-end'}`}
                      >
                        {heading !== null && (
                          <Dialog.Title>
                            <Heading as="span" size="lead" id="cart-contents" className={`${variant !== 'default' ? 'font-serif text-3xl tracking-wide text-ink' : ''}`}>
                              {heading}
                            </Heading>
                          </Dialog.Title>
                        )}
                        <button
                          type="button"
                          className={`p-4 -m-4 transition ${
                            variant === 'cart' 
                                ? 'text-[#f4f1ea] hover:text-rust' 
                                : variant === 'menu'
                                    ? 'text-dark-green hover:text-rust'
                                    : 'text-primary hover:text-primary/50'
                          }`}
                          onClick={onClose}
                          data-test="close-cart"
                        >
                          {variant === 'menu' ? (
                              <span className="font-heading text-sm tracking-[0.2em] border-b border-transparent hover:border-rust transition-all">
                                  EXIT GUIDE
                              </span>
                          ) : variant === 'cart' ? (
                              <span className="font-body text-xs tracking-widest opacity-80 hover:opacity-100 transition-all">
                                  [EXIT]
                              </span>
                          ) : (
                              <IconClose aria-label="Close panel" />
                          )}
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
