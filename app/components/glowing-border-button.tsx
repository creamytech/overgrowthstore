"use client";

import React from "react";
import { cn } from "~/lib/utils";

interface GlowingBorderButtonProps {
  className?: string;
  text?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const GlowingBorderButton = ({ 
  className,
  text = "Join Now",
  onClick,
  type = "button",
}: GlowingBorderButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "glowing-border-button group relative h-[52px] w-[180px] cursor-pointer border-0 bg-transparent p-0 font-mono text-xs uppercase tracking-[0.15em] outline-none hover:scale-[1.02] active:scale-[0.98] transition-transform",
        className
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden p-[2px] transition-all duration-300 ease-in-out",
          "bg-[#1a1a1a]"
        )}
      >
        {/* Rotating Border Glow - Conic gradient for smooth perimeter trace */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-[-100%] animate-[spin_4s_linear_infinite]"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #B55A3C 10%, #B55A3C 15%, transparent 25%)',
            }}
          />
        </div>

        {/* Inner Content */}
        <div
          className={cn(
            "content relative z-10 flex h-full items-center justify-center gap-2 transition-all duration-300 ease-in-out",
            "bg-[#0a0a0a]"
          )}
        >
          <span className="text-[#F2EFE9] transition-colors duration-300 group-hover:text-[#B55A3C]">
            {text}
          </span>
        </div>
      </div>
    </button>
  );
};

export default GlowingBorderButton;
