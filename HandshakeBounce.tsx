import { motion } from "motion/react";

export function HandshakeBounce({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <motion.div
        animate={{ 
          x: [0, 10, 0],
          rotate: [0, -10, 0]
        }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-12 h-12 flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-teal-accent">
          <path d="M20 50C20 50 40 40 50 50C60 60 80 50 80 50" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
      <motion.div
        animate={{ 
          x: [0, -10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 0.8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="w-12 h-12 flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-accent transform scale-x-[-1]">
          <path d="M20 50C20 50 40 40 50 50C60 60 80 50 80 50" stroke="currentColor" strokeWidth="12" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>
    </div>
  );
}
