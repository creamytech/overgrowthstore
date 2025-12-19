import {useEffect, useRef, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {usePrefixPathWithLocale} from '~/lib/utils';

export default function EmailSignupPage() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Use the same locale-prefixed URL as the footer
  const newsletterUrl = usePrefixPathWithLocale('/api/newsletter');

  // Handle form submission - same approach as footer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      
      const response = await fetch(newsletterUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Newsletter Error Status:', response.status, response.statusText);
        const text = await response.text();
        console.error('Newsletter Error Body:', text);
        try {
          const jsonError = JSON.parse(text) as {error?: string};
          setErrorMessage(jsonError.error || `Server Error: ${response.status}`);
        } catch {
          setErrorMessage(`Server Error: ${response.status}`);
        }
        setIsSubmitting(false);
        return;
      }
      
      const data = await response.json() as {success?: boolean; message?: string; error?: string};
      
      if (data.success) {
        setIsSubmitted(true);
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Newsletter Network Error:', err);
      setErrorMessage('Network error. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  // Fallback: Show video after 1 second even if load events don't fire
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Safari autoplay fix: Try to play video programmatically
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Speed up video to 2x
    video.playbackRate = 2;
    
    const attemptPlay = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log('Autoplay prevented, waiting for user interaction');
      }
    };

    video.addEventListener('loadedmetadata', attemptPlay);
    video.addEventListener('canplaythrough', attemptPlay);
    
    return () => {
      video.removeEventListener('loadedmetadata', attemptPlay);
      video.removeEventListener('canplaythrough', attemptPlay);
    };
  }, []);

  // Audio fade-out effect: Gradually reduce volume in the last 2 seconds
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      const timeRemaining = video.duration - video.currentTime;
      const fadeStartTime = 2; // Start fading 2 seconds before end
      
      if (timeRemaining <= fadeStartTime && timeRemaining > 0) {
        // Calculate fade progress (1 = full volume, 0 = silent)
        const fadeProgress = timeRemaining / fadeStartTime;
        video.volume = Math.max(0, fadeProgress);
      }
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
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
    setTimeout(() => setShowContent(true), 300);
  };

  return (
    <div className="relative w-full min-h-screen-dynamic overflow-hidden bg-[#f4f1ea] font-body selection:bg-[#c05a34]/30">
      {/* Immersive Paper Background - Global */}
      <div 
        className="fixed inset-0 opacity-40 pointer-events-none mix-blend-multiply transition-opacity duration-1000 z-0"
        style={{backgroundImage: "url('/assets/texture_archive_paper.jpg')", backgroundSize: 'cover'}}
      />
      <div className="fixed inset-0 pointer-events-none z-[1] bg-radial-vignette opacity-30 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />

      <style>{`
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%);
        }
        .terminal-input {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(26, 71, 42, 0.1);
          border-radius: 4px;
          font-family: 'Courier Prime', monospace;
          color: #1a472a;
          backdrop-blur: 4px;
        }
        .terminal-input:focus {
          border-color: #c05a34;
          box-shadow: 0 0 15px rgba(192, 90, 52, 0.1);
          outline: none;
        }
        .archive-button {
          background: #c05a34;
          color: #f4f1ea;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.15em;
          border-radius: 4px;
          border: 1px solid #a34a2a;
          box-shadow: 0 4px 10px rgba(163, 74, 42, 0.2);
          transition: all 0.3s ease;
        }
        .archive-button:hover {
          background: #d06a44;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(163, 74, 42, 0.3);
        }
        .archive-card {
          background: #fdfbf7;
          border: 1px solid rgba(26, 71, 42, 0.1);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          position: relative;
        }
        .archive-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/assets/texture_archive_paper.jpg');
          opacity: 0.03;
          pointer-events: none;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {!showContent ? (
          /* STAGE 1: THE DISCOVERY (VIDEO) */
          <motion.div 
            key="video-stage"
            className="relative z-50 flex flex-col items-center justify-center min-h-screen p-6 md:p-12"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Header branding during video */}
            <motion.div 
              className="absolute top-12 left-0 right-0 flex justify-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <img src="/assets/Wordmark Logo.svg" alt="Overgrowth" className="h-12 md:h-16 w-auto grayscale" />
            </motion.div>

            {/* Video Postcard */}
            <motion.div 
              className="relative p-3 md:p-5 max-w-5xl w-full bg-[#fdfbf7] border border-[#1a472a]/10 shadow-2xl skew-x-[0.2deg]"
              initial={{ rotate: -0.5, scale: 0.95, opacity: 0 }}
              animate={{ rotate: 0.5, scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Photo corners */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#1a472a]/10" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#1a472a]/10" />
              
              <div className="bg-[#0a100c] relative overflow-hidden">
                <video
                  ref={videoRef}
                  className={`w-full h-auto block transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  poster="/assets/GateClosed.png"
                  onEnded={handleVideoEnd}
                  onLoadedData={() => setVideoLoaded(true)}
                >
                  <source src="/assets/EmailSignup.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Mute button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-10 right-10 z-30 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center transition-all text-white"
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line><path d="M11 5L6 9H2V15H6L11 19V5z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                )}
              </button>
            </motion.div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="relative w-48 md:w-64 h-1 bg-[#1a472a]/10 overflow-hidden rounded-full">
                <motion.div 
                  className="absolute inset-0 bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2.5, 
                    ease: "linear" 
                  }}
                />
              </div>
              <motion.div 
                className="text-[#22c55e] font-heading text-[10px] md:text-xs tracking-[0.3em] uppercase"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                Signal Retrieval: In Progress
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* STAGE 2: THE ARCHIVE (DASHBOARD) */
          <motion.div 
            key="archive-stage"
            className="relative z-50 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-y-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            {/* Main Dashboard Container */}
            <div className="w-full max-w-6xl archive-card p-6 md:p-12 border border-[#1a472a]/10 rounded-lg shadow-2xl relative overflow-hidden">
              
              {/* Decorative Textural Elements */}
              <div className="absolute top-4 right-6 md:top-8 md:left-8 flex flex-col gap-1 opacity-80 md:opacity-40 pointer-events-none text-right md:text-left">
                <span className="font-heading text-[8px] md:text-[10px] tracking-widest uppercase text-[#1a472a] brightness-75">Dept. of Recovery</span>
                <span className="font-body text-[6px] md:text-[8px] tracking-tighter text-[#1a472a] brightness-90">NY-DISTRICT-01 // CODENAME: GREENHOUSE</span>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                
                {/* Left: Branding & Signup */}
                <div className="w-full lg:w-5/12 flex flex-col">
                  <motion.div 
                    initial={{x: -30, opacity: 0}} 
                    animate={{x: 0, opacity: 1}} 
                    transition={{delay: 0.3}}
                  >
                    <img src="/assets/logo_og_vines.png" alt="Overgrowth" className="h-16 md:h-20 w-auto mb-8" />
                    <h1 className="font-heading text-4xl md:text-5xl text-[#1a472a] mb-4 tracking-tight leading-none">
                      Streetwear <br/><span className="text-[#c05a34]">Reclaimed.</span>
                    </h1>
                    <p className="font-body text-sm md:text-base text-[#4a5d23]/80 mb-10 italic max-w-sm leading-relaxed">
                      "The city still works, just differently. We're logging neighbors for the first archival distribution of Collection 01 — NYC."
                    </p>
                  </motion.div>

                  {!isSubmitted ? (
                    <motion.form 
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="terminal-input px-4 py-3 text-sm"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="terminal-input px-4 py-3 text-sm"
                          required
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="archive@signal.nyc"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="terminal-input px-4 py-3 text-sm"
                        required
                      />
                      
                      <AnimatePresence>
                        {errorMessage && (
                          <motion.p 
                            className="text-[#c05a34] text-xs font-body italic"
                            initial={{opacity: 0, height: 0}}
                            animate={{opacity: 1, height: 'auto'}}
                            exit={{opacity: 0, height: 0}}
                          >
                            {errorMessage}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="archive-button py-4 mt-2 uppercase text-sm font-heading"
                      >
                        {isSubmitting ? 'Verifying Signal...' : 'Initialize Access'}
                      </button>
                      <p className="text-[10px] text-center text-[#1a472a]/70 uppercase tracking-widest mt-2">
                        Priority Clearance • Secure Log
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div 
                      className="p-8 border-2 border-dashed border-[#c05a34]/30 bg-[#fdfbf7] flex flex-col items-center text-center"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="w-12 h-12 bg-[#c05a34] text-[#f4f1ea] rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="font-heading text-2xl text-[#1a472a] mb-2">Signal Received.</h3>
                      <p className="font-body text-sm text-[#4a5d23]/70">
                        You've been logged for distribution. Watch your local district frequency for arrival notice.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Right: Immersive Collection Grid */}
                <div className="w-full lg:w-7/12">
                  <div className="grid grid-cols-2 gap-4 md:gap-6 relative">
                    
                    {/* Header Label - Truly Centered */}
                    <div className="absolute -top-10 left-0 right-0 flex justify-center">
                      <span className="font-heading text-[10px] md:text-xs text-[#c05a34]/80 tracking-[0.4em] uppercase">Manifest 01: The NYC District</span>
                    </div>

                    {[
                      {src: '/assets/teaser_bodega.jpg', title: 'The Bodega', desc: 'Artifact 21-A'},
                      {src: '/assets/teaser_slice.jpg', title: 'The OG Slice', desc: 'Artifact 21-B'},
                      {src: '/assets/teaser_hoodie_v2.jpg', title: 'Archival Hood', desc: 'Artifact 21-C', span: true}
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className={`relative group archive-card rounded shadow-sm overflow-hidden ${item.span ? 'col-span-2 aspect-[4/3]' : 'aspect-square'}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + (i * 0.1) }}
                        whileHover={{ y: -5 }}
                      >
                        <img 
                          src={item.src} 
                          alt={item.title} 
                          className={`absolute inset-0 w-full h-full ${item.span ? 'object-cover' : 'object-cover'} transition-transform duration-700 group-hover:scale-105 grayscale-[0.2]`} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Polaroid overlay / Archive label */}
                        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm p-3 border border-[#1a472a]/10 flex justify-between items-center transform translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                          <div>
                            <p className="font-heading text-[10px] text-[#1a472a] uppercase">{item.title}</p>
                            <p className="font-body text-[8px] text-[#c05a34]">{item.desc}</p>
                          </div>
                          <div className="w-4 h-4 text-[#1a472a]/30">
                            <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Area */}
              <div className="mt-16 pt-8 border-t border-[#1a472a]/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-8">
                  <a href="https://instagram.com/overgrowth.co" target="_blank" className="text-[#1a472a]/40 hover:text-[#c05a34] transition-colors">
                    <span className="font-heading text-xs tracking-widest uppercase">Instagram</span>
                  </a>
                  <a href="https://x.com/Overgrowthco" target="_blank" className="text-[#1a472a]/40 hover:text-[#c05a34] transition-colors">
                    <span className="font-heading text-xs tracking-widest uppercase">Archive-X</span>
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500/40 animate-pulse" />
                  <p className="font-body text-[9px] text-[#1a472a]/30 uppercase tracking-[0.2em]">Signal Active • NYC Node 01</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
