'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer';
import GlowingBorderButton from '~/components/glowing-border-button';

const POPUP_STORAGE_KEY = 'overgrowth_popup_dismissed';
const POPUP_DELAY_DESKTOP_MS = 10000; // 10 seconds on desktop
const POPUP_DELAY_MOBILE_MS = 3000; // 3 seconds on mobile

export function DropNotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    // Check if user has already dismissed the popup
    const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    // Use shorter delay on mobile
    const delay = isDesktop ? POPUP_DELAY_DESKTOP_MS : POPUP_DELAY_MOBILE_MS;
    
    // Show popup after delay
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isDesktop]);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user dismissed for this session
    localStorage.setItem(POPUP_STORAGE_KEY, 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      // Use FormData like footer/homepage forms
      const formData = new FormData();
      formData.append('email', email);
      
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json() as { success?: boolean };

      if (data.success) {
        setStatus('success');
        // Close after success message
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  // Form content - inline to prevent re-render focus issues
  const formContent = status === 'success' ? (
    <div className="text-center py-4">
      <div className="w-12 h-12 mx-auto mb-4 border-2 border-[#B55A3C] flex items-center justify-center">
        <svg className="w-6 h-6 text-[#B55A3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="font-mono text-sm text-[#F2EFE9]/70">
        You're on the list. We'll notify you first.
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
          // font-size: 16px prevents iOS zoom on focus
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-base placeholder:text-[#F2EFE9]/30 focus:border-[#B55A3C] focus:outline-none transition-colors"
          style={{ fontSize: '16px' }} // Explicit 16px to ensure no iOS zoom
        />
      </div>
      
      <div className="flex justify-center">
        <GlowingBorderButton
          type="submit"
          text={status === 'loading' ? 'Joining...' : 'Notify Me'}
        />
      </div>
      
      {status === 'error' && (
        <p className="font-mono text-xs text-red-400 text-center">
          Something went wrong. Please try again.
        </p>
      )}
      
      <p className="font-mono text-[10px] text-[#F2EFE9]/30 text-center">
        No spam. Drop notifications only.
      </p>
    </form>
  );

  // Desktop: centered dialog
  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md bg-[#0a0a0a] border border-[#F2EFE9]/10 text-[#F2EFE9]">
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-[#B55A3C]" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-[#B55A3C]" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-[#B55A3C]" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-[#B55A3C]" />
          
          <DialogHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
                Incoming Drop
              </span>
              <div className="w-8 h-px bg-[#B55A3C]" />
            </div>
            
            <DialogTitle className="font-heading text-3xl md:text-4xl text-[#F2EFE9] uppercase tracking-[0.08em]">
              OG-NYC-001
            </DialogTitle>
            
            <DialogDescription className="font-mono text-sm text-[#F2EFE9]/50 mt-4">
              Our next drop is coming soon. Strictly limited quantities. Once they're gone, they're archived forever.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 px-4 pb-6">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: drawer sliding up from bottom
  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="bg-[#0a0a0a] border-t border-[#F2EFE9]/10 text-[#F2EFE9]">
        <DrawerHeader className="text-center pt-2">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-8 h-px bg-[#B55A3C]" />
            <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase">
              Incoming Drop
            </span>
            <div className="w-8 h-px bg-[#B55A3C]" />
          </div>
          
          <DrawerTitle className="font-heading text-2xl text-[#F2EFE9] uppercase tracking-[0.08em]">
            OG-NYC-001
          </DrawerTitle>
          
          <DrawerDescription className="font-mono text-sm text-[#F2EFE9]/50 mt-2">
            Our next drop is coming soon. Strictly limited.
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="mt-6 px-4 pb-6">
          {formContent}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
