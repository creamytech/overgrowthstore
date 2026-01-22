'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import GlowingBorderButton from '~/components/glowing-border-button';
import { AlertCircle, Clock, Users } from 'lucide-react';

const POPUP_STORAGE_KEY = 'overgrowth_popup_dismissed';
const POPUP_DELAY_DESKTOP_MS = 10000; // 10 seconds on desktop
const POPUP_DELAY_MOBILE_MS = 3000; // 3 seconds on mobile

// Drop date - Jan 23rd, 2026, 1:00 PM EST
const DROP_DATE = new Date('2026-01-23T13:00:00-05:00');

interface DropNotificationPopupProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropNotificationPopup({ open: externalOpen, onOpenChange }: DropNotificationPopupProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [timeLeft, setTimeLeft] = useState<{days: number; hours: number; minutes: number; seconds: number} | null>(null);
  const [isLive, setIsLive] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Use external open state if provided, otherwise use internal
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = DROP_DATE.getTime() - now;

      if (distance < 0) {
        setIsLive(true);
        setTimeLeft(null);
        return;
      }

      setIsLive(false);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Skip auto-open if externally controlled
    if (externalOpen !== undefined) return;
    
    // Check if user has already dismissed the popup
    const dismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) return;

    // Use shorter delay on mobile
    const delay = isDesktop ? POPUP_DELAY_DESKTOP_MS : POPUP_DELAY_MOBILE_MS;
    
    // Show popup after delay
    const timer = setTimeout(() => {
      setInternalOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isDesktop, externalOpen]);

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

  // Countdown component
  const CountdownDisplay = () => {
    if (isLive) {
      return (
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-[#B55A3C]/10 border border-[#B55A3C]/30 mb-4">
          <span className="w-2 h-2 bg-[#B55A3C] rounded-full animate-pulse" />
          <span className="font-mono text-xs text-[#B55A3C] uppercase tracking-wider">
            Drop is Live Now!
          </span>
        </div>
      );
    }

    if (!timeLeft) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-center gap-3 md:gap-4 py-3 px-4 bg-[#1a1a1a] border border-[#F2EFE9]/10">
          {[
            {value: timeLeft.days, label: 'D'},
            {value: timeLeft.hours, label: 'H'},
            {value: timeLeft.minutes, label: 'M'},
            {value: timeLeft.seconds, label: 'S'},
          ].map(({value, label}) => (
            <div key={label} className="flex items-center gap-1">
              {label === 'S' ? (
                <motion.span 
                  key={value}
                  initial={{ scale: 1.1, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="font-heading text-lg md:text-xl text-[#B55A3C] tabular-nums"
                >
                  {value.toString().padStart(2, '0')}
                </motion.span>
              ) : (
                <span className="font-heading text-lg md:text-xl text-[#F2EFE9] tabular-nums">
                  {value.toString().padStart(2, '0')}
                </span>
              )}
              <span className="font-mono text-[8px] text-[#F2EFE9]/40 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Urgency indicators
  const UrgencyBadges = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#B55A3C]/10 border border-[#B55A3C]/20">
        <AlertCircle className="w-3 h-3 text-[#B55A3C]" />
        <span className="font-mono text-[9px] text-[#B55A3C] uppercase tracking-wider">Limited Pieces</span>
      </div>
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F2EFE9]/5 border border-[#F2EFE9]/20">
        <Users className="w-3 h-3 text-[#F2EFE9]/70" />
        <span className="font-mono text-[9px] text-[#F2EFE9]/70 uppercase tracking-wider">350+ Waiting</span>
      </div>
    </div>
  );

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
    <form onSubmit={handleSubmit} className="space-y-4 text-center">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          autoComplete="email"
          // font-size: 16px prevents iOS zoom on focus
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#F2EFE9]/20 text-[#F2EFE9] font-mono text-base placeholder:text-[#F2EFE9]/30 focus:border-[#B55A3C] focus:outline-none transition-colors text-center"
          style={{ fontSize: '16px' }} // Explicit 16px to ensure no iOS zoom
        />
      </div>
      
      <div className="flex justify-center">
        <GlowingBorderButton
          type="submit"
          text={status === 'loading' ? 'Joining...' : 'Get Drop Reminder'}
        />
      </div>
      
      {status === 'error' && (
        <p className="font-mono text-xs text-red-400 text-center">
          Something went wrong. Please try again.
        </p>
      )}
      
      <p className="font-mono text-[10px] text-[#F2EFE9]/30 text-center">
        No spam. Drop notifications only. Unsubscribe anytime.
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
          
          <DialogHeader className="text-center sm:text-center items-center">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-8 h-px bg-[#B55A3C]" />
              <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase animate-pulse">
                Drop Incoming
              </span>
              <div className="w-8 h-px bg-[#B55A3C]" />
            </div>
            
            <DialogTitle className="font-heading text-3xl md:text-4xl text-[#F2EFE9] uppercase tracking-[0.08em]">
              OG-NYC-001
            </DialogTitle>
            
            {/* Countdown Timer */}
            <div className="mt-4">
              <CountdownDisplay />
            </div>
            
            {/* Urgency Badges */}
            <UrgencyBadges />
            
            <DialogDescription className="font-mono text-xs text-[#F2EFE9]/50 text-center">
              Get reminded when the drop goes live. Limited pieces, no restocks.
            </DialogDescription>

          </DialogHeader>
          
          <div className="mt-4 px-4 pb-6">
            {formContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: simple fixed overlay (avoids Drawer/vaul iOS keyboard issues)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80"
        onClick={handleClose}
      />
      
      {/* Content - fixed to top to avoid keyboard issues */}
      <div className="absolute top-0 left-0 right-0 bg-[#0a0a0a] border-b border-[#F2EFE9]/10 p-6 pt-12 safe-area-inset-top">
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#F2EFE9]/50 hover:text-[#F2EFE9] p-2"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="text-center mb-3">
          <span className="font-mono text-[9px] text-[#B55A3C] tracking-[0.4em] uppercase animate-pulse">
            Drop Incoming
          </span>
          <h3 className="font-heading text-xl text-[#F2EFE9] uppercase tracking-[0.08em] mt-1">
            OG-NYC-001
          </h3>
        </div>
        
        {/* Countdown */}
        <CountdownDisplay />
        
        {/* Urgency */}
        <UrgencyBadges />
        
        {/* Form */}
        {formContent}
      </div>
    </div>
  );
}
