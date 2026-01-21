import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';

/**
 * Drawer component - Cream + Brick palette
 * Slides in from left (menu) or right (cart)
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
        {/* Backdrop - Dark */}
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-sm" />
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
                <Dialog.Panel 
                  className={`w-screen max-w-md text-left align-middle transition-all transform h-full bg-[#0a0a0a] border-${openFrom === 'left' ? 'r' : 'l'} border-[#F2EFE9]/10`}
                >
                  
                  {/* Edge accent line - Brick */}
                  <div 
                    className={`absolute top-0 bottom-0 w-px ${openFrom === 'left' ? 'right-0' : 'left-0'} bg-gradient-to-b from-transparent via-[#B55A3C]/30 to-transparent`}
                  />

                  <div className="relative z-10 h-full flex flex-col px-6 md:px-12 py-8 md:py-12">
                    
                    {/* Header */}
                    {heading && (
                      <header className="mb-6 md:mb-12 text-center">
                        <span className="font-mono text-[9px] text-[#F2EFE9]/40 tracking-[0.3em] uppercase block mb-2 md:mb-3">
                          {variant === 'menu' ? '[ Navigate ]' : '[ Items ]'}
                        </span>
                        <Dialog.Title>
                          <h2 className="font-heading text-xl md:text-3xl tracking-[0.15em] text-[#F2EFE9] uppercase">
                            {heading}
                          </h2>
                        </Dialog.Title>
                        <Separator className="w-12 mx-auto mt-4 md:mt-6 bg-[#B55A3C]" />
                      </header>
                    )}
                    
                    {/* Content */}
                    <div className="flex-grow overflow-y-auto scrollbar-hide">
                      {children}
                    </div>
                    
                    {/* Close Button */}
                    <div className="pt-8 text-center">
                      <Button 
                        type="button"
                        onClick={onClose}
                        variant="ghost"
                        className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F2EFE9]/50 hover:text-[#B55A3C] hover:bg-transparent"
                        aria-label="Close"
                      >
                        Close ×
                      </Button>
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
