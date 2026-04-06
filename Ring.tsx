import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

interface RingProps {
  value: number;
  min?: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
  glow?: boolean;
}

export function Ring({
  value,
  min = 0,
  max = 100,
  size = 200,
  strokeWidth = 8,
  color = "var(--color-amber-accent)",
  label,
  className,
  glow = true
}: RingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const offset = circumference - percentage * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-5"
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className={glow ? "glow-amber" : ""}
          style={{ filter: glow ? `drop-shadow(0 0 8px ${color})` : 'none' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-serif font-bold text-foreground"
        >
          {value}
        </motion.span>
        {label && <span className="text-xs uppercase tracking-widest text-foreground/40 mt-1">{label}</span>}
      </div>
    </div>
  );
}

interface SegmentedRingProps {
  segments: { value: number; color: string; name: string; amount: number }[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function SegmentedRing({
  segments,
  size = 240,
  strokeWidth = 12,
  className
}: SegmentedRingProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let currentOffset = 0;

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
        {segments.map((segment, i) => {
          const percentage = segment.value / total;
          const strokeDashoffset = circumference - (percentage * circumference);
          const rotation = (currentOffset / total) * 360;
          currentOffset += segment.value;

          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: strokeDashoffset,
                strokeWidth: hoveredIndex === i ? strokeWidth + 4 : strokeWidth
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
              strokeLinecap="round"
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transformOrigin: 'center',
                filter: hoveredIndex === i ? `drop-shadow(0 0 8px ${segment.color})` : 'none'
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer transition-all"
            />
          );
        })}
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <AnimatePresence mode="wait">
          {hoveredIndex !== null ? (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm text-foreground/60">{segments[hoveredIndex].name}</span>
              <span className="text-xl font-serif font-bold text-foreground">₹{segments[hoveredIndex].amount.toLocaleString()}</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <span className="text-2xl font-serif font-bold text-foreground">Owes Me</span>
              <span className="text-[10px] uppercase tracking-widest text-foreground/40">Active Debtors</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

