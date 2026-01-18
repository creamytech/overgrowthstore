"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

interface Feature {
  step?: string;
  title: string;
  content: string;
  image?: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  autoPlayInterval?: number;
  imageClassName?: string;
}

export default function FeatureSteps({
  features,
  className,
  autoPlayInterval = 4000,
  imageClassName = "min-h-[300px] md:min-h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setProgressKey((prev) => prev + 1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, currentFeature, features.length]);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full md:items-stretch max-w-6xl mx-auto",
        className
      )}
    >
      {/* Left Column: Feature List */}
      <div className="flex flex-col w-full md:w-1/2 border border-[#1a472a]/10 divide-y divide-[#1a472a]/10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            layoutId={feature.title}
            onClick={() => {
              setCurrentFeature(index);
              setProgressKey((prev) => prev + 1);
            }}
            className={cn(
              "p-6 md:p-8 relative cursor-pointer transition-colors",
              index === currentFeature 
                ? "bg-[#1a472a]/5" 
                : "hover:bg-[#1a472a]/5"
            )}
          >
            {/* Step indicator */}
            {feature.step && (
              <span className="font-mono text-[10px] text-[#B55A3C] uppercase tracking-[0.3em] mb-2 block">
                {feature.step}
              </span>
            )}
            
            <h3 className="font-heading text-lg md:text-xl text-[#1a472a] uppercase tracking-wide">
              {feature.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-[#8A8A84] leading-relaxed">
              {feature.content}
            </p>
            
            {/* Progress bar for active item */}
            {index === currentFeature && (
              <motion.div
                key={progressKey}
                className="absolute h-[2px] bottom-0 left-0 bg-[#B55A3C]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: autoPlayInterval / 1000,
                  ease: "linear",
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Right Column: Visual Display */}
      <div
        className={cn(
          "w-full md:w-1/2 border border-[#1a472a]/10 md:border-l-0 border-t-0 md:border-t relative overflow-hidden bg-gradient-to-br from-[#1a472a] to-[#0f2d1a]",
          imageClassName
        )}
      >
        <motion.div
          key={currentFeature}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
        >
          {/* Large step number */}
          <span className="font-heading text-[120px] md:text-[180px] text-[#F2EFE9]/5 leading-none absolute">
            {(currentFeature + 1).toString().padStart(2, '0')}
          </span>
          
          {/* Feature title */}
          <h4 className="relative z-10 font-heading text-2xl md:text-3xl text-[#F2EFE9] uppercase tracking-wider mb-4">
            {features[currentFeature].title}
          </h4>
          
          {/* Feature content */}
          <p className="relative z-10 font-mono text-sm text-[#F2EFE9]/60 max-w-sm">
            {features[currentFeature].content}
          </p>
          
          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-[#B55A3C]/30" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-[#B55A3C]/30" />
        </motion.div>
      </div>
    </div>
  );
}
