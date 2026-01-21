import {useState, useRef, useEffect} from 'react';
import {motion, AnimatePresence, useInView} from 'framer-motion';
import {usePrefixPathWithLocale} from '~/lib/utils';

export default function EmailSignupPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(formRef, { margin: "-100px 0px 0px 0px" });
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    // Show sticky only after user has scrolled a bit and form is not in view
    const handleScroll = () => {
      if (window.scrollY > 300 && !isInView && !isSubmitted) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, isSubmitted]);
  
  const newsletterUrl = usePrefixPathWithLocale('/api/newsletter');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('firstName', firstName);
      
      const response = await fetch(newsletterUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
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
      } else {
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="relative w-full min-h-screen-dynamic overflow-hidden font-body selection:bg-[#c05a34]/30 flex items-center justify-center p-4">
      {/* Texture overlay matching PageLayout for site-wide consistency */}
      <div className="fixed inset-0 opacity-20 pointer-events-none mix-blend-multiply bg-[url('/assets/texture_archive_paper.jpg')] z-0" />
      
      <style>{`
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%);
        }
        .terminal-input {
          background: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(26, 71, 42, 0.1);
          border-radius: 2px;
          font-family: 'Courier Prime', monospace;
          color: #1a472a;
          backdrop-blur: 4px;
        }
        .terminal-input:focus {
          border-color: #c05a34;
          box-shadow: 0 0 15px rgba(192, 90, 52, 0.05);
          outline: none;
        }
        .archive-button {
          background: #c05a34;
          color: #f4f1ea;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.05em;
          border-radius: 2px;
          border: 1px solid #a34a2a;
          box-shadow: 0 4px 10px rgba(163, 74, 42, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .archive-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/assets/texture_archive_paper.jpg');
          opacity: 0.1;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        .archive-button:hover {
          background: #d06a44;
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(163, 74, 42, 0.3);
        }
        .archive-card {
          background: #fdfbf7;
          border: 1px solid rgba(26, 71, 42, 0.1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.05);
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

      <motion.div 
        className="w-full max-w-6xl archive-card p-6 md:p-12 border border-[#1a472a]/10 rounded shadow-2xl relative overflow-hidden z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Top Header Labels - Adjusted for Mobile Clarity */}
        <div className="absolute top-4 left-6 md:top-6 md:left-8 flex flex-col gap-1 opacity-60">
          <span className="font-heading text-[8px] md:text-[10px] tracking-widest uppercase text-[#1a472a]">Dept. of Recovery</span>
          <span className="font-body text-[6px] md:text-[8px] tracking-widest text-[#1a472a]/70">NY-DISTRICT-01 // CODENAME: GREENHOUSE</span>
        </div>

        <div className="absolute top-12 md:top-6 right-0 left-0 flex justify-center pointer-events-none px-6">
          <span className="font-heading text-[10px] md:text-xs text-[#c05a34]/80 tracking-[0.4em] uppercase text-center">Manifest 01: The NYC District</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mt-12 md:mt-4">
          
          {/* Left Column: Branding & Form */}
          <div className="w-full lg:w-5/12 flex flex-col">
            <motion.div 
              initial={{x: -20, opacity: 0}} 
              animate={{x: 0, opacity: 1}} 
              transition={{delay: 0.2}}
            >
              <img src="/assets/logo_og_vines.png" alt="Overgrowth" className="h-16 md:h-24 w-auto mb-8" />
              <h1 className="font-heading text-4xl md:text-6xl text-[#1a472a] mb-6 tracking-tight leading-[0.9]">
                Streetwear <br/><span className="text-[#c05a34]">Reclaimed.</span>
              </h1>
              <p className="font-body text-sm md:text-lg text-[#2d3a16] font-medium mb-10 italic max-w-sm leading-relaxed">
                "The city still works, just differently. Collection 01 is limited. Each artifact is custom-engineered from premium, heavyweight textiles."
              </p>
            </motion.div>

            {!isSubmitted ? (
              <motion.form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 md:gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* System Status Near Form */}
                <div className="flex items-center gap-2 mb-2 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-heading text-[9px] uppercase tracking-widest text-[#1a472a]">Signal Active | NYC Node 01</span>
                </div>

                <div className="flex flex-col gap-4 md:gap-3">
                  <input
                    type="email"
                    placeholder="Email Address (required)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="terminal-input px-4 py-4 text-sm w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="First Name (optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="terminal-input px-4 py-4 text-sm w-full"
                  />
                </div>
                
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
                  className="archive-button py-[34px] md:py-[28px] mt-6 md:mt-2 uppercase text-base font-heading shadow-lg font-bold md:font-normal"
                >
                  <span className="relative z-10">{isSubmitting ? 'Verifying Signal...' : 'Secure Early Access'}</span>
                </button>
                <p className="text-[10px] text-center text-[#1a472a]/50 uppercase tracking-[0.2em] mt-2">
                  Priority Clearance • Secure Log
                </p>
              </motion.form>
            ) : (
              <motion.div 
                className="p-10 border border-dashed border-[#c05a34]/30 bg-[#fdfbf7] flex flex-col items-center text-center"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-16 h-16 bg-[#c05a34] text-[#f4f1ea] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-heading text-3xl text-[#1a472a] mb-4">Signal Received.</h3>
                <p className="font-body text-base text-[#2d3a16] font-medium leading-relaxed">
                  Only registered signals will be notified. Watch your local district frequency for arrival notice.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column: Immersive Collection Grid */}
          <div className="w-full lg:w-7/12">
            <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-8">
              {[
                {src: '/assets/teaser_bodega.jpg', title: 'The Bodega', desc: 'Artifact 21-A', caption: 'Archive T-Shirt'},
                {src: '/assets/teaser_slice.jpg', title: 'The OG Slice', desc: 'Artifact 21-B', caption: 'Archive Crewneck'},
                {src: '/assets/teaser_hoodie_v2.jpg', title: 'Archival Hood', desc: 'Artifact 21-C', span: true, caption: 'Archive Hoodie'}
              ].map((item, i) => (
                <div key={i} className={`${item.span ? 'col-span-2' : ''}`}>
                  <motion.div 
                    className={`group relative overflow-hidden rounded bg-[#ece9df] border border-[#1a472a]/5 ${item.span ? 'aspect-[16/9]' : 'aspect-square'}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                  >
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover grayscale-[0.1] transition-transform duration-1000 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Subtle Overlay (kept but made cleaner) */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 border border-[#1a472a]/5 flex justify-between items-center transform translate-y-16 group-hover:translate-y-0 transition-transform duration-500 shadow-xl opacity-0 group-hover:opacity-100">
                      <div>
                        <p className="font-heading text-[10px] text-[#1a472a] uppercase tracking-wider">{item.title}</p>
                        <p className="font-body text-[8px] text-[#c05a34]">{item.desc}</p>
                      </div>
                      <div className="w-4 h-4 text-[#1a472a]/20">
                        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                      </div>
                    </div>
                  </motion.div>
                  {/* Subtle Archival Caption Beneath Image */}
                  <p className="mt-2 font-body text-[9px] text-[#1a472a]/40 uppercase tracking-[0.2em] italic ml-1">
                    {item.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-16 pt-8 border-t border-[#1a472a]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-10">
            <a href="https://instagram.com/overgrowth.co" target="_blank" rel="noopener noreferrer" className="text-[#1a472a]/40 hover:text-[#c05a34] hover:underline transition-all duration-300 group flex items-center gap-2">
              <span className="font-heading text-xs tracking-widest uppercase flex items-center gap-2">
                Instagram
                <span className="w-1 h-1 bg-[#c05a34] rounded-full scale-0 group-hover:scale-100 transition-transform" />
              </span>
            </a>
            <a href="https://x.com/Overgrowthco" target="_blank" rel="noopener noreferrer" className="text-[#1a472a]/40 hover:text-[#c05a34] hover:underline transition-all duration-300 group flex items-center gap-2">
              <span className="font-heading text-xs tracking-widest uppercase flex items-center gap-2">
                Archive-X
                <span className="w-1 h-1 bg-[#c05a34] rounded-full scale-0 group-hover:scale-100 transition-transform" />
              </span>
            </a>
          </div>
          
          <div className="flex items-center gap-3 opacity-40">
            <p className="font-body text-[10px] text-[#1a472a] uppercase tracking-[0.25em]">NYC Node 01</p>
          </div>
        </div>
      </motion.div>

      {/* Sticky Micro-CTA for Mobile */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <button 
              onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full bg-[#c05a34] text-[#f4f1ea] py-4 px-6 font-heading text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] border-t border-[#a34a2a]/30"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Signal Active | Secure Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

