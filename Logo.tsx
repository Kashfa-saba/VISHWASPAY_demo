import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export function Logo({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <motion.div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 rounded-full bg-background border border-foreground/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-accent/20 to-amber-accent/20 animate-pulse" />
      </div>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[70%] h-[70%] relative z-10">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-teal-accent)" />
            <stop offset="100%" stopColor="var(--color-amber-accent)" />
          </linearGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* The 'V' Handshake */}
        <path 
          d="M25 35C25 35 40 75 50 75C60 75 75 35 75 35" 
          stroke="url(#logoGradient)" 
          strokeWidth="10" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#logoGlow)"
        />
        <path 
          d="M40 60L50 70L60 60" 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  );
}
