import { motion } from "motion/react";
import { Logo } from "./ui/Logo";

export function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-background"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <Logo size={120} />
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-teal-accent tracking-tight">Vishwaspay</h1>
          <p className="text-xs uppercase tracking-[0.4em] text-foreground/40 mt-2 font-bold">Financial Gallery</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
