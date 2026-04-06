import { motion } from "motion/react";
import { Logo } from "./ui/Logo";
import { LogIn } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass p-10 rounded-[3rem] text-center shadow-2xl"
      >
        <div className="flex justify-center mb-8">
          <Logo size={100} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-teal-accent mb-2">Vishwaspay</h1>
        <p className="text-xs uppercase tracking-[0.4em] text-foreground/40 mb-10 font-bold">Financial Gallery</p>
        
        <div className="space-y-6">
          <p className="text-sm text-foreground/60 leading-relaxed">
            Welcome to the most exclusive trust-based lending platform. Connect with your community and build your financial legacy.
          </p>
          
          <button 
            onClick={onLogin}
            className="w-full bg-teal-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-teal-accent/80 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
          
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest">
            By continuing, you agree to our Terms & Privacy Policy compliant with IT Act 2000.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
