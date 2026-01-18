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
        {/* Rotating Border Beam */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[500%] w-[80px] -translate-x-1/2 -translate-y-1/2 animate-[spin_3s_linear_infinite]",
              "[background:linear-gradient(to_right,transparent_20%,#B55A3C_50%,#B55A3C_60%,transparent_80%)]",
              "blur-[2px]"
            )}
          ></div>
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
