import {ReactNode} from 'react';

export function FieldJournalLayout({
  children,
  title,
  date = 'Unknown',
  location = 'The Quiet Places',
}: {
  children: ReactNode;
  title: string;
  date?: string;
  location?: string;
}) {
  return (
    <div className="min-h-screen bg-stone-200 py-20 px-4 md:px-8 flex items-center justify-center overflow-hidden">
      {/* Book Container */}
      <div className="relative w-full max-w-7xl bg-[#fdfbf7] shadow-2xl flex flex-col md:flex-row perspective-1000">
        
        {/* Book Cover/Edges Effect */}
        <div className="absolute inset-0 border-[1px] border-stone-300 pointer-events-none z-20 mix-blend-multiply" />
        <div className="absolute inset-y-0 left-0 w-1 md:w-2 bg-gradient-to-r from-stone-400 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-1 md:w-2 bg-gradient-to-l from-stone-400 to-transparent z-10" />
        
        {/* Central Spine (Desktop Only) */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-12 -ml-6 bg-gradient-to-r from-transparent via-stone-300/50 to-transparent z-10 pointer-events-none mix-blend-multiply" />
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-stone-400/30 z-20" />

        {/* Content Wrapper */}
        <div className="w-full p-8 md:p-16 relative z-0">
            {/* Header Info (Top of Left Page usually, but we'll keep it full width for now or let it flow) */}
            <div className="mb-8 border-b border-ink/10 pb-4 flex justify-between items-end font-mono text-xs text-ink/50 uppercase tracking-widest">
                <div>
                    <span>Ref: {(Math.random() * 10000).toFixed(0)}</span>
                    <span className="mx-4">|</span>
                    <span>Loc: {location}</span>
                </div>
                <div>
                    <span>Date: {date}</span>
                </div>
            </div>

            {/* Main Content (The Grid) */}
            {children}
        </div>
      </div>
    </div>
  );
}
