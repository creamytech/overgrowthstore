"use client";

import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface ShimmerButtonProps {
  text?: string;
  className?: string;
  duration?: number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const ShimmerButton = ({
  text = "Shop Now",
  className,
  duration = 1.2,
  onClick,
  type = "button",
  disabled = false,
}: ShimmerButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative bg-[#0a0a0a] px-8 py-3.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-[#F2EFE9]/10 hover:border-[#B55A3C]/30",
        className
      )}
    >
      <motion.span
        className="relative block bg-clip-text text-transparent bg-[linear-gradient(110deg,#F2EFE9_0%,#F2EFE9_40%,#B55A3C_50%,#F2EFE9_60%,#F2EFE9_100%)] bg-[length:200%_100%] font-mono text-sm uppercase tracking-[0.15em]"
        animate={{
          backgroundPosition: ["0% 0%", "-200% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: "linear",
        }}
      >
        {text}
      </motion.span>
    </button>
  );
};

export default ShimmerButton;
