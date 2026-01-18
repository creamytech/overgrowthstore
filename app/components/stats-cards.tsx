"use client";

import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

interface StatsCardsProps {
  className?: string;
  cards?: {
    value: string;
    title: string;
    description: string;
    accent?: boolean;
  }[];
}

export function StatsCards({
  className,
  cards = [
    {
      value: "50+",
      title: "Limited Pieces",
      description: "Every drop is produced in small batches. Once it's gone, it's gone.",
    },
    {
      value: "0",
      title: "Restocks",
      description: "We don't reprint. Ever. Each piece enters the archive permanently.",
      accent: true,
    },
    {
      value: "100%",
      title: "Premium Cotton",
      description: "Heavyweight construction. Built to outlast trends and fast fashion.",
    },
  ],
}: StatsCardsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 md:gap-8 px-4 py-8",
        className
      )}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          className={cn(
            "relative w-[280px] h-[320px] p-6 flex flex-col justify-between group cursor-pointer",
            card.accent 
              ? "bg-[#B55A3C] text-[#F2EFE9]" 
              : "bg-[#F2EFE9] text-[#1a472a] border border-[#1a472a]/10"
          )}
          initial={{
            rotate: index === 0 ? -3 : index === 1 ? 2 : index === 2 ? -2 : 4,
          }}
          whileHover={{
            rotate: 0,
            scale: 1.05,
            zIndex: 50,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          {/* Value */}
          <div>
            <h2 className={cn(
              "font-heading text-5xl tracking-tight",
              card.accent ? "text-[#F2EFE9]" : "text-[#1a472a]"
            )}>
              {card.value}
            </h2>
          </div>
          
          {/* Content */}
          <div>
            <h4 className={cn(
              "font-heading text-lg uppercase tracking-wider mb-2",
              card.accent ? "text-[#F2EFE9]" : "text-[#1a472a]"
            )}>
              {card.title}
            </h4>
            <div className={cn(
              "w-full h-px my-3",
              card.accent ? "bg-[#F2EFE9]/30" : "bg-[#1a472a]/20"
            )} />
            <p className={cn(
              "font-mono text-xs leading-relaxed",
              card.accent ? "text-[#F2EFE9]/80" : "text-[#8A8A84]"
            )}>
              {card.description}
            </p>
          </div>
          
          {/* Corner accents */}
          <div className={cn(
            "absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 opacity-0 group-hover:opacity-100 transition-opacity",
            card.accent ? "border-[#F2EFE9]/30" : "border-[#B55A3C]/40"
          )} />
          <div className={cn(
            "absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 opacity-0 group-hover:opacity-100 transition-opacity",
            card.accent ? "border-[#F2EFE9]/30" : "border-[#B55A3C]/40"
          )} />
        </motion.div>
      ))}
    </div>
  );
}
