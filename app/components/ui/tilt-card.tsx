"use client";

import { cn } from "~/lib/utils";
import React, { useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  intensity?: number;
}

export const TiltCard = ({
  children,
  className,
  containerClassName,
  intensity = 15,
}: TiltCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / intensity;
    const y = (e.clientY - top - height / 2) / intensity;
    containerRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsHovered(false);
    containerRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className={cn("", containerClassName)}>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "transition-transform duration-200 ease-out",
          className
        )}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        
        {/* Shine effect on hover */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-opacity duration-300",
            "bg-gradient-to-tr from-transparent via-white/5 to-transparent",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform: "translateZ(1px)",
          }}
        />
      </div>
    </div>
  );
};
