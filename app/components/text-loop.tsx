"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { cn } from "~/lib/utils";

interface TextLoopProps {
  staticText?: string;
  rotatingTexts?: string[];
  className?: string;
  interval?: number;
  transition?: Transition;
  staticTextClassName?: string;
  rotatingTextClassName?: string;
  backgroundClassName?: string;
  cursorClassName?: string;
}

export default function TextLoop({
  staticText = "Overgrowth",
  rotatingTexts = ["Limited Runs", "No Restocks", "Premium Craft"],
  className,
  interval = 3000,
  transition = { duration: 0.8, ease: "easeInOut" },
  staticTextClassName,
  rotatingTextClassName,
  backgroundClassName,
  cursorClassName,
}: TextLoopProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, interval);
    return () => clearInterval(timer);
  }, [rotatingTexts.length, interval]);

  return (
    <div
      className={cn(
        "flex flex-row items-center justify-start w-fit text-2xl md:text-4xl font-heading uppercase tracking-wider",
        className
      )}
    >
      <span className={cn("mr-3 whitespace-nowrap text-[#F2EFE9]", staticTextClassName)}>
        {staticText}
      </span>
      <div className="relative flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={rotatingTexts[index]}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden whitespace-nowrap relative"
          >
            {/* Background gradient box */}
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-r from-transparent via-[#B55A3C]/20 to-[#B55A3C]/30",
                backgroundClassName
              )}
            />

            <span
              className={cn(
                "relative bg-clip-text text-transparent",
                "bg-gradient-to-r from-[#B55A3C] to-[#9A4A30] pr-1",
                rotatingTextClassName
              )}
            >
              {rotatingTexts[index]}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Cursor Line */}
        <motion.div
          className={cn(
            "w-[2px] md:w-[3px] bg-[#B55A3C] h-[1em]",
            cursorClassName
          )}
          animate={{ opacity: [1, 0.3] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
}
