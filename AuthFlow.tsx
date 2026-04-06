import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Logo } from "./ui/Logo";
import { ArrowRight, Phone, CreditCard } from "lucide-react";

interface AuthFlowProps {
  onComplete: (data: { upi_id: string; phone: string }) => void;
}

export function AuthFlow({ onComplete }: AuthFlowProps) {
  const [step, setStep] = useState<'splash' | 'login' | 'onboarding'>('splash');
  const [upi, setUpi] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setStep('login'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setStep('onboarding');
  };

  const handleSubmitOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (upi && phone) {
      onComplete({ upi_id: upi, phone });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#121212] z-[100] flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <Logo size={120} />
          </motion.div>
        )}

        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full max-w-sm px-6"
          >
            <motion.div 
              layoutId="logo"
              className="mb-12"
            >
              <Logo size={64} />
            </motion.div>
            
            <h1 className="text-4xl font-serif font-bold text-white mb-2 text-center">Vishwaspay</h1>
            <p className="text-white/40 text-sm tracking-[0.2em] uppercase mb-12 text-center">Trust is the new currency</p>

            <button
              onClick={handleLogin}
              className="w-full glass border-amber-accent/50 border py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-[10px]">G</span>
              </div>
              <span className="font-bold text-sm uppercase tracking-widest text-white">Continue with Google</span>
              <ArrowRight size={18} className="text-amber-accent group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {step === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm px-6"
          >
            <div className="mb-10">
              <Logo size={48} className="mb-6" />
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Almost there</h2>
              <p className="text-white/40 text-sm">We need a few more details to set up your trust profile.</p>
            </div>

            <form onSubmit={handleSubmitOnboarding} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold ml-1">UPI ID</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                  <input
                    required
                    type="text"
                    placeholder="yourname@upi"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="w-full glass bg-white/5 border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-teal-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={18} />
                  <input
                    required
                    type="tel"
                    placeholder="+91 00000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full glass bg-white/5 border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-teal-accent transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-accent text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-teal-accent/80 transition-colors mt-4"
              >
                Complete Setup
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
