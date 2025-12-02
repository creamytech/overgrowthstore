import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Heading, Section, Text} from '~/components/Text';
import {Button} from '~/components/Button';
import {Link} from '~/components/Link';
import {motion} from 'framer-motion';
import {useState, useEffect} from 'react';

export async function loader({request, context}: LoaderFunctionArgs) {
  return json({});
}

export default function EcosystemPage() {
  // Fix Hydration Error: Generate particles on client only
  const [particles, setParticles] = useState<Array<{x: string, y: string, scale: number, opacity: number, duration: number, moveY: number, moveX: number, width: number, height: number}>>([]);

  useEffect(() => {
    const newParticles = [...Array(8)].map(() => ({
        x: Math.random() * 100 + "%",
        y: Math.random() * 100 + "%",
        scale: Math.random() * 0.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 20 + 10,
        moveY: Math.random() * -100,
        moveX: (Math.random() - 0.5) * 50,
        width: Math.random() * 6 + 2,
        height: Math.random() * 6 + 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden">
      {/* Floating Spores/Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {particles.map((p, i) => (
              <motion.div
                  key={i}
                  className="absolute bg-dark-green/20 rounded-full blur-[1px]"
                  initial={{
                      x: p.x,
                      y: p.y,
                      scale: p.scale,
                      opacity: p.opacity
                  }}
                  animate={{
                      y: [null, p.moveY],
                      x: [null, p.moveX],
                  }}
                  transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "linear"
                  }}
                  style={{
                      width: p.width + "px",
                      height: p.height + "px",
                  }}
              />
          ))}
      </div>

      {/* Header - Standardized to match Journal */}
      <div className="relative z-10 pt-32 pb-12 text-center">
            <h1 className="font-heading text-5xl md:text-7xl text-dark-green tracking-widest mb-2 uppercase">
                The Ecosystem
            </h1>
            <div className="font-body text-rust text-lg tracking-[0.3em] uppercase">
                <span>Artifact Index</span>
            </div>
            <div className="w-24 h-1 bg-rust mx-auto mt-6" />
       </div>

      {/* Hero Section Content */}
      <Section className="text-center px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
            
            <div className="font-typewriter text-xs md:text-sm text-dark-green/60 mb-8 tracking-widest uppercase">
                <span>Doc Ref: OG-ECO-2025 // Status: </span>
                <span className="bg-dark-green text-[#f4f1ea] px-1">ACTIVE</span>
            </div>

            <div className="font-heading text-xl md:text-3xl text-rust mb-8 tracking-[0.2em] uppercase border-y border-rust/20 py-4">
                <div>Concrete fades.</div>
                <div>The Ecosystem remains.</div>
            </div>
            
            <div className="font-typewriter text-dark-green text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed text-justify">
                In the Overgrowth, we do not look for customers.
                We look for wanderers who see the world the way we do, full of strange beauty and quiet wonder.
                Recovered Artifacts help you travel deeper into the world of Overgrowth with small rewards, early access, and hidden discoveries.
            </div>

            <Link to="/account/register">
                <Button className="bg-dark-green text-[#f4f1ea] px-10 py-5 font-heading tracking-widest hover:bg-rust transition-colors duration-300 border-2 border-transparent hover:border-dark-green relative overflow-hidden group">
                    <span className="relative z-10">INITIATE PROTOCOL</span>
                    {/* <div className="absolute inset-0 bg-[url('/assets/texture_dirt.png')] opacity-20 mix-blend-overlay"></div> */}
                </Button>
            </Link>
            
            <div className="mt-6">
                <Link to="/account/login" className="font-typewriter text-xs text-dark-green hover:text-rust uppercase tracking-widest border-b border-dark-green/30 pb-1">
                    // Already an Operative? Access Field Guide
                </Link>
            </div>
        </div>
      </Section>

      {/* Tactical Brief (How it Works) */}
      <Section className="py-16 px-4 relative z-10 border-b border-dark-green/10">
          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  {/* Step 1 */}
                  <div className="relative group">
                      <div className="w-16 h-16 mx-auto mb-4 border-2 border-rust rounded-full flex items-center justify-center text-2xl text-rust group-hover:bg-rust group-hover:text-[#f4f1ea] transition-colors">
                          1
                      </div>
                      <h3 className="font-heading text-xl text-dark-green mb-2">INITIATE</h3>
                      <p className="font-body text-sm text-dark-green/70">Create your explorer profile to begin your journey.</p>
                  </div>
                  {/* Step 2 */}
                  <div className="relative group">
                      <div className="w-16 h-16 mx-auto mb-4 border-2 border-rust rounded-full flex items-center justify-center text-2xl text-rust group-hover:bg-rust group-hover:text-[#f4f1ea] transition-colors">
                          2
                      </div>
                      <h3 className="font-heading text-xl text-dark-green mb-2">SCAVENGE</h3>
                      <p className="font-body text-sm text-dark-green/70">Collect Artifacts as you move through the Overgrowth.</p>
                  </div>
                  {/* Step 3 */}
                  <div className="relative group">
                      <div className="w-16 h-16 mx-auto mb-4 border-2 border-rust rounded-full flex items-center justify-center text-2xl text-rust group-hover:bg-rust group-hover:text-[#f4f1ea] transition-colors">
                          3
                      </div>
                      <h3 className="font-heading text-xl text-dark-green mb-2">RECLAIM</h3>
                      <p className="font-body text-sm text-dark-green/70">Unlock rewards, stories, and exclusive access.</p>
                  </div>
              </div>
          </div>
      </Section>

      {/* Cultivation Status (Progress Bar) */}
      <Section className="py-24 border-y-2 border-dark-green/10 bg-[#e8e4d9] relative z-10">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'url(/assets/topo-pattern.png)', backgroundSize: '200px'}}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative">
            <h2 className="font-heading text-3xl text-dark-green mb-8 tracking-widest uppercase">
                Artifact Index
            </h2>
            
            {/* Progress Bar UI */}
            <div className="bg-[#f4f1ea] border border-dark-green/20 p-8 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-end mb-4">
                    <span className="font-typewriter text-xs text-dark-green/60 uppercase tracking-widest">Current Rank: GUEST</span>
                    <span className="font-mono text-xl text-dark-green font-bold">0 / 500</span>
                </div>
                <div className="w-full h-4 bg-dark-green/10 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-rust w-[0%]"></div>
                    {/* Segments */}
                    <div className="absolute top-0 left-1/3 h-full w-px bg-[#f4f1ea]/50"></div>
                    <div className="absolute top-0 left-2/3 h-full w-px bg-[#f4f1ea]/50"></div>
                </div>
                <div className="flex justify-between mt-2 font-typewriter text-[10px] text-dark-green/40 uppercase">
                    <span>The Root</span>
                    <span>The Vine</span>
                    <span>The Canopy</span>
                </div>

                {/* Login CTA Overlay */}
                <div className="absolute inset-0 bg-[#f4f1ea]/80 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="text-center">
                        <p className="font-heading text-dark-green mb-4 text-lg">IDENTIFICATION REQUIRED</p>
                        <Link to="/account/login" className="inline-block bg-dark-green text-[#f4f1ea] px-6 py-2 font-heading text-sm tracking-widest hover:bg-rust transition-colors">
                            ACCESS TERMINAL
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </Section>

      {/* Tiers Section - "Specimen Files" */}
      <Section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                
                {/* Tier I: The Root */}
                <TierCard 
                    title="THE ROOT"
                    range="Ref. 01. 112-K // Observation"
                    description="The Root is the foundation of all growth within the Overgrowth. Strong, ancient, and steady, it carries old memories and new stories alike. Those who follow the Root learn to see the world beneath the surface."
                    icon="🌱"
                    benefits={[
                        "Assessment: Stable",
                        "Classification: Living"
                    ]}
                    rotation="-rotate-2"
                    paperColor="bg-[#f0eee6]"
                />

                {/* Tier II: The Vine */}
                <TierCard 
                    title="THE VINE"
                    range="Ref. 02. 157-J // Movement"
                    description="The Vine is restless. It climbs, wanders, and searches for forgotten corners. Every path it chooses leads to another discovery. Those who follow the Vine tend to stumble into new wonders without trying."
                    icon="🌿"
                    highlight
                    benefits={[
                        "Assessment: Active",
                        "Classification: Expanding"
                    ]}
                    rotation="rotate-1"
                    paperColor="bg-[#e8e4d9]"
                    stamp="CLASSIFIED"
                />

                {/* Tier III: The Canopy */}
                <TierCard 
                    title="THE CANOPY"
                    range="Ref. 03. 889-L // Observation"
                    description="The Canopy watches over the reclaimed world. It filters light, shelters creatures, and creates small pockets of calm across the frontier. Those who follow the Canopy learn to appreciate the quiet magic above."
                    icon="🌳"
                    benefits={[
                        "Assessment: Flourishing",
                        "Classification: Elevated"
                    ]}
                    rotation="-rotate-1"
                    paperColor="bg-[#dcd8cc]"
                    stamp="TOP SECRET"
                />

            </div>
        </div>
      </Section>
    </div>
  );
}

function TierCard({title, range, description, icon, benefits, highlight = false, rotation = 'rotate-0', paperColor = 'bg-white', stamp}: {title: string, range: string, description: string, icon: string, benefits: string[], highlight?: boolean, rotation?: string, paperColor?: string, stamp?: string}) {
    return (
        <div className={`relative group ${rotation} transition-transform duration-500 hover:scale-105 hover:rotate-0 hover:z-20`}>
            {/* Paper Clip Visual (CSS/SVG) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-12 border-4 border-gray-400 rounded-full border-b-0 opacity-80"></div>

            <div className={`${paperColor} p-8 pt-12 shadow-xl border border-dark-green/20 h-full flex flex-col relative overflow-hidden`}>
                
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-5" 
                     style={{backgroundImage: 'linear-gradient(darkgreen 1px, transparent 1px), linear-gradient(90deg, darkgreen 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
                </div>

                {/* Stamp */}
                {stamp && (
                    <div className="absolute top-12 right-4 rotate-12 border-2 border-rust p-1 opacity-60 pointer-events-none">
                        <span className="font-heading text-rust text-xs uppercase tracking-widest">{stamp}</span>
                    </div>
                )}

                <div className="text-center mb-8 relative z-10">
                    <div className="text-5xl mb-4 opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</div>
                    <h2 className="font-heading text-3xl text-dark-green tracking-widest mb-1">{title}</h2>
                    <div className="w-full h-px bg-dark-green/20 my-2"></div>
                    <p className="font-typewriter text-rust text-xs font-bold tracking-widest uppercase mb-4">{range}</p>
                    <p className="font-typewriter text-dark-green/80 text-xs leading-relaxed min-h-[3rem] text-justify">
                        {description}
                    </p>
                </div>
                
                <div className="flex-grow relative z-10">
                    <ul className="space-y-3">
                        {benefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-dark-green font-typewriter">
                                <span className="text-rust mt-0.5">[-]</span>
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-dark-green/20 text-center relative z-10">
                    <span className="font-typewriter text-[10px] text-dark-green/40 uppercase tracking-widest">
                        Clearance: {title === 'THE ROOT' ? 'LEVEL 1' : title === 'THE VINE' ? 'LEVEL 2' : 'LEVEL 3'}
                    </span>
                </div>
            </div>
        </div>
    )
}
