import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useFetcher} from '@remix-run/react';
import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import {json} from '@shopify/remix-oxygen';

// Action to handle newsletter signup
export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email')?.toString();

  if (!email || !email.includes('@')) {
    return json({success: false, error: 'Please enter a valid email address'});
  }

  try {
    // Create customer with email for newsletter
    await context.storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {
          email,
          acceptsMarketing: true,
        },
      },
    });
    return json({success: true, error: null});
  } catch (error) {
    // If customer already exists, that's still a success for our purposes
    return json({success: true, error: null});
  }
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

export default function EmailSignupPage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fetcher = useFetcher<{ok: boolean; error?: string; message?: string}>();

  // Fallback: Show video after 1 second even if load events don't fire
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Toggle mute on the video element
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Handle video end - pause on last frame
  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Small delay before starting UI reveal
    setTimeout(() => setShowContent(true), 300);
  };

  // Handle successful submission
  useEffect(() => {
    if (fetcher.data?.ok) {
      setIsSubmitted(true);
    }
  }, [fetcher.data]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes subtlePulse {
          0%, 100% { box-shadow: 0 0 20px rgba(192, 90, 52, 0.3); }
          50% { box-shadow: 0 0 30px rgba(192, 90, 52, 0.5); }
        }
        
        .terminal-cursor {
          animation: blink 1s step-end infinite;
        }
        
        /* Terminal input style - darker, more refined */
        .terminal-input {
          background: rgba(20, 20, 18, 0.95);
          border: 1px solid rgba(192, 90, 52, 0.4);
          border-radius: 2px;
          font-family: 'Courier Prime', 'Courier New', monospace;
          caret-color: #c05a34;
        }
        
        .terminal-input:focus {
          border-color: rgba(192, 90, 52, 0.8);
          box-shadow: 0 0 20px rgba(192, 90, 52, 0.2);
          outline: none;
        }
        
        .terminal-input::placeholder {
          color: rgba(200, 190, 175, 0.4);
        }
        
        /* Vault button - rust accent with subtle glow */
        .vault-button {
          background: linear-gradient(180deg, #c05a34 0%, #a34a2a 100%);
          border: none;
          border-radius: 2px;
          font-family: 'IM Fell English SC', serif;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .vault-button:hover {
          background: linear-gradient(180deg, #d06a44 0%, #b35a3a 100%);
          transform: translateY(-1px);
          animation: subtlePulse 2s ease-in-out infinite;
        }
        
        .vault-button:active {
          transform: translateY(0);
        }
        
        /* Subtle scanline effect */
        .scanlines::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.02) 2px,
            rgba(0, 0, 0, 0.02) 4px
          );
          pointer-events: none;
          z-index: 10;
        }
        
        /* CRT vignette */
        .crt-vignette {
          box-shadow: inset 0 0 150px 60px rgba(0, 0, 0, 0.5);
        }
      `}</style>

      {/* Video Layer - Always visible, pauses on last frame */}
      <div className="fixed inset-0 z-0 flex flex-col items-center justify-between p-6 md:p-12 bg-[#f4f1ea]">
        {/* Paper texture background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
          style={{backgroundImage: "url('/assets/texture_archive_paper.jpg')", backgroundSize: 'cover'}}
        />
        
        {/* Logo at top of page - visible from start */}
        <div className="relative z-10 pt-2 md:pt-4">
          {/* Mobile logo */}
          <img 
            src="/assets/logo_og_vines.png" 
            alt="Overgrowth" 
            className="md:hidden h-14 w-auto object-contain"
          />
          {/* Desktop logo */}
          <img 
            src="/assets/Wordmark Logo.svg" 
            alt="Overgrowth" 
            className="hidden md:block h-16 w-auto object-contain"
          />
        </div>
        
        {/* Postcard Container - centered */}
        <div className={`relative p-4 md:p-6 max-w-6xl w-full bg-[#fdfbf7] border border-[#1a472a]/15 shadow-xl transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Corner photo mounts */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#1a472a]/20" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#1a472a]/20" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#1a472a]/20" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#1a472a]/20" />
          
          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-auto block"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onLoadedData={() => setVideoLoaded(true)}
          >
            <source src="/assets/EmailSignup.mp4" type="video/mp4" />
          </video>
          
          {/* Sound toggle button - bottom right */}
          {!videoEnded && (
            <button
              onClick={toggleMute}
              className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                // Muted icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-80 group-hover:opacity-100">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                // Sound on icon
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 opacity-80 group-hover:opacity-100">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          )}
          
          {/* Overlay Content - appears over video after it ends */}
          <AnimatePresence>
            {showContent && (
              <motion.div 
                className="absolute inset-4 md:inset-6 flex items-center justify-center scanlines crt-vignette"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.8}}
              >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60" />
                
                {/* Content */}
                <div className="relative z-20 flex flex-col items-center text-center px-6 py-8">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <motion.div
                        key="form"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0, y: -20}}
                        className="flex flex-col items-center max-w-md"
                      >
                        {/* Decorative line */}
                        <motion.div
                          className="w-16 h-px bg-gradient-to-r from-transparent via-[#c05a34] to-transparent mb-6"
                          initial={{scaleX: 0}}
                          animate={{scaleX: 1}}
                          transition={{delay: 0.3, duration: 0.6}}
                        />
                        
                        {/* H1 - Larger and more prominent */}
                        <motion.h1
                          className="font-heading text-[#f4f1ea] text-2xl md:text-3xl lg:text-4xl tracking-[0.06em] mb-4 leading-tight"
                          initial={{opacity: 0, y: 20}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: 0.4, duration: 0.6, ease: 'easeOut'}}
                        >
                          The city changes soon.
                        </motion.h1>

                        {/* Supporting line */}
                        <motion.p
                          className="font-body text-[#c9c4b8] text-sm md:text-base tracking-[0.02em] mb-10"
                          initial={{opacity: 0, y: 15}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: 0.6, duration: 0.5, ease: 'easeOut'}}
                        >
                          Be first to see what grows below.
                        </motion.p>

                        {/* Email Form */}
                        <motion.div
                          initial={{opacity: 0, y: 20}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: 0.8, duration: 0.6, ease: 'easeOut'}}
                          className="w-full max-w-xs"
                        >
                          <fetcher.Form method="post" className="flex flex-col items-center gap-5">
                            {/* Email Input */}
                            <div className="w-full relative">
                              <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                placeholder="your@email.com"
                                required
                                className="terminal-input w-full px-4 py-3.5 text-[#e8e4dc] text-sm tracking-wide transition-all duration-300 text-center"
                              />
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                              {fetcher.data?.error && (
                                <motion.p
                                  className="text-[#c05a34] text-xs tracking-wide font-body"
                                  initial={{opacity: 0, y: -5}}
                                  animate={{opacity: 1, y: 0}}
                                  exit={{opacity: 0, y: -5}}
                                >
                                  {fetcher.data.error}
                                </motion.p>
                              )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                              type="submit"
                              disabled={fetcher.state === 'submitting'}
                              className="vault-button w-full px-8 py-4 text-sm text-[#f4f1ea] disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={{scale: 1.01}}
                              whileTap={{scale: 0.99}}
                            >
                              {fetcher.state === 'submitting' ? 'Entering...' : 'Enter the Vault'}
                            </motion.button>
                          </fetcher.Form>
                          
                          {/* Privacy note */}
                          <motion.p
                            className="text-center text-[10px] text-[#a8a090]/60 mt-4 tracking-wider"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            transition={{delay: 1.2}}
                          >
                            Early access • Exclusive drops • No spam
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    ) : (
                      /* Success State */
                      <motion.div
                        key="success"
                        initial={{opacity: 0, scale: 0.95}}
                        animate={{opacity: 1, scale: 1}}
                        className="flex flex-col items-center py-6"
                      >
                        {/* Success checkmark */}
                        <motion.div
                          className="w-16 h-16 mb-6 rounded-full border-2 border-[#c05a34] flex items-center justify-center"
                          initial={{scale: 0}}
                          animate={{scale: 1}}
                          transition={{type: 'spring', bounce: 0.4, delay: 0.1}}
                        >
                          <motion.svg 
                            viewBox="0 0 24 24" 
                            className="w-8 h-8 text-[#c05a34]"
                            initial={{pathLength: 0, opacity: 0}}
                            animate={{pathLength: 1, opacity: 1}}
                            transition={{delay: 0.3, duration: 0.5}}
                          >
                            <motion.path
                              d="M5 13l4 4L19 7"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{pathLength: 0}}
                              animate={{pathLength: 1}}
                              transition={{delay: 0.4, duration: 0.4}}
                            />
                          </motion.svg>
                        </motion.div>

                        <motion.h2
                          className="font-heading text-[#f4f1ea] text-2xl md:text-3xl tracking-[0.06em] mb-3"
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: 0.5}}
                        >
                          You're in the first wave.
                        </motion.h2>

                        <motion.p
                          className="font-body text-[#c9c4b8] text-sm md:text-base tracking-wide mb-6"
                          initial={{opacity: 0, y: 10}}
                          animate={{opacity: 1, y: 0}}
                          transition={{delay: 0.6}}
                        >
                          We'll call you when the vault opens.
                        </motion.p>
                        
                        {/* Decorative divider */}
                        <motion.div
                          className="w-16 h-px bg-gradient-to-r from-transparent via-[#c05a34] to-transparent"
                          initial={{scaleX: 0}}
                          animate={{scaleX: 1}}
                          transition={{delay: 0.8, duration: 0.6}}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom spacer for balanced centering */}
        <div className="h-14 md:h-16" />
      </div>
    </div>
  );
}
