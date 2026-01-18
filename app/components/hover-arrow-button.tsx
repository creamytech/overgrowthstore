"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface HoverArrowButtonProps {
  text?: string;
  duration?: number;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function HoverArrowButton({
  text = "Shop Now",
  duration = 0.3,
  className,
  onClick,
  type = "button",
}: HoverArrowButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-3.5 text-[#F2EFE9] border border-[#F2EFE9]/10 hover:border-[#B55A3C]/40 transition-colors font-mono text-xs uppercase tracking-[0.15em] cursor-pointer",
        className
      )}
      whileHover="hover"
      initial="initial"
      whileTap={{ scale: 0.98 }}
    >
      {/* Arrow entering from left */}
      <motion.div
        className="flex items-center justify-center overflow-hidden"
        variants={{
          initial: { width: 0, opacity: 0 },
          hover: { width: "auto", opacity: 1 },
        }}
        transition={{
          duration: duration,
          ease: [0.165, 0.84, 0.44, 1],
        }}
      >
        <motion.span
          className="flex items-center justify-center text-[#B55A3C]"
          variants={{
            initial: { x: "-200%", opacity: 0 },
            hover: { x: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.4,
            ease: [0.165, 0.84, 0.44, 1],
          }}
        >
          →
        </motion.span>
      </motion.div>

      <span className="mx-2">{text}</span>

      {/* Arrow exiting to right */}
      <motion.div
        className="flex items-center justify-center overflow-hidden"
        variants={{
          initial: { width: "auto", opacity: 1 },
          hover: { width: 0, opacity: 0 },
        }}
        transition={{
          duration: duration,
          ease: [0.165, 0.84, 0.44, 1],
        }}
      >
        <motion.span
          className="flex items-center justify-center text-[#F2EFE9]/40"
          variants={{
            initial: { x: 0, opacity: 1 },
            hover: { x: "200%", opacity: 0 },
          }}
          transition={{
            duration: duration - 0.1,
            ease: [0.165, 0.84, 0.44, 1],
          }}
        >
          →
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
