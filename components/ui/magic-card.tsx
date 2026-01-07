"use client";

import { cn } from "@/lib/utils";
import { MouseEvent, useRef } from "react";

interface MagicContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function MagicContainer({ children, className }: MagicContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const { clientX, clientY } = e;
    const cards = containerRef.current.getElementsByClassName("magic-card");

    Array.from(cards).forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("group/magic-container", className)}
    >
      {children}
    </div>
  );
}

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className,
  gradientSize = 300,
  gradientColor = "hsl(var(--primary))",
  gradientOpacity = 0.5,
}: MagicCardProps) {
  return (
    <div
      className={cn(
        "magic-card relative overflow-hidden rounded-xl bg-muted/50 p-[2px]", // p-[1px] creates the border
        // The wrapper handles the outer border color/glow
      )}
    >
      {/* Outer Glow (Border Glow) - Revealed on group hover */}
      <div
        className=" pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/magic-container:opacity-100"
        style={{
          background: `radial-gradient(${gradientSize}px circle at var(--mouse-x) var(--mouse-y), ${gradientColor}, transparent 100%)`,
          opacity: gradientOpacity,
        }}
      />
      
      {/* Inner Card (Content) */}
      <div className={cn(
        "relative h-full w-full rounded-[11px] bg-card overflow-hidden ",
        className
      )}>
         {/* Inner Glow (Content Glow) - Revealed on local hover */}
         <div 
           className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
           style={{
             background: `radial-gradient(${gradientSize * 0.6}px circle at var(--mouse-x) var(--mouse-y), ${gradientColor}, transparent 100%)`,
             opacity: gradientOpacity * 0.5,
           }}
         />

      <div className="absolute inset-0 noise pointer-events-none" />

         
         {/* Content */}
         <div className="relative h-full">
            {children}
         </div>
      </div>
    </div>
  );
}
