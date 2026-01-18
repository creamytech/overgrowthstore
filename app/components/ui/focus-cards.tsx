"use client";

import React, { useState } from "react";
import { cn } from "~/lib/utils";

interface FocusCard {
  title: string;
  src: string;
  description?: string;
}

export const FocusCard = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCard;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative bg-[#1a1a1a] overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-70"
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full transition-transform duration-500"
        style={{
          transform: hovered === index ? 'scale(1.05)' : 'scale(1)',
        }}
      />
      {/* Dark overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-60"
        )}
      >
        <span className="font-mono text-[9px] text-[#B55A3C] uppercase tracking-[0.3em] mb-2">
          Featured
        </span>
        <h3 className="font-heading text-xl md:text-2xl text-[#F2EFE9] uppercase tracking-wide">
          {card.title}
        </h3>
        {card.description && hovered === index && (
          <p className="font-mono text-xs text-[#F2EFE9]/60 mt-2 line-clamp-2">
            {card.description}
          </p>
        )}
      </div>
      
      {/* Corner accent on hover */}
      <div 
        className={cn(
          "absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B55A3C] transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      />
      <div 
        className={cn(
          "absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B55A3C] transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  )
);

FocusCard.displayName = "FocusCard";

export function FocusCards({ cards, className }: { cards: FocusCard[], className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full", className)}>
      {cards.map((card, index) => (
        <FocusCard
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
