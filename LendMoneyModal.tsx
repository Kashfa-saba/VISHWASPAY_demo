import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone, Banknote, QrCode, Camera, Upload, CheckCircle2 } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface LendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLend: (data: any) => void;
}

export function LendMoneyModal({ isOpen, onClose, onLend }: LendMoneyModalProps) {
  const [mode, setMode] = useState<'select' | 'upi' | 'cash'>('select');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    upiId: '',
    dueDate: '',
    image: null as string | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.dueDate) {
      alert("Please enter amount and return date.");
      return;
    }
    onLend({
      ...formData,
      amount: parseFloat(formData.amount),
      due_date: new Date(formData.dueDate).toISOString(),
      mode
    });
    onClose();
    setMode('select');
    setFormData({ name: '', phone: '', amount: '', upiId: '', dueDate: '', image: null });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 max-w-lg mx-auto z-[70] p-8 pb-12 overflow-hidden rounded-t-[3rem] transition-colors duration-300",
              "art-frame"
            )}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground">Lend Money</h2>
              <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-colors">
                <X size={24} className="text-foreground" />
              </button>
            </div>

            {mode === 'select' && (
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setMode('upi')}
                  className="flex items-center gap-6 p-6 art-frame rounded-[2rem] hover:bg-foreground/5 transition-all text-left group shadow-sm"
                >
                  <div className="w-16 h-16 bg-teal-accent/20 rounded-2xl flex items-center justify-center text-teal-accent group-hover:scale-110 transition-transform">
                    <Smartphone size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Digital Transfer</h3>
                    <p className="text-sm opacity-40 text-foreground">UPI, QR Code, Online</p>
                  </div>
                </button>

                <button
                  onClick={() => setMode('cash')}
                  className="flex items-center gap-6 p-6 art-frame rounded-[2rem] hover:bg-foreground/5 transition-all text-left group shadow-sm"
                >
                  <div className="w-16 h-16 bg-amber-accent/20 rounded-2xl flex items-center justify-center text-amber-accent group-hover:scale-110 transition-transform">
                    <Banknote size={32} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">Manual Cash</h3>
                    <p className="text-sm opacity-40 text-foreground">Physical Handover</p>
                  </div>
                </button>
              </div>
            )}

            {mode === 'upi' && (
              <div className="space-y-6">
                <div className="flex flex-col items-center py-8 art-frame rounded-[2rem] border-dashed border-foreground/20">
                  <QrCode size={120} className="opacity-20 mb-4" />
                  <button className="flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-foreground/10 transition-colors">
                    <Camera size={16} />
                    Scan QR Code
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Receiver UPI ID</label>
                    <input
                      type="text"
                      placeholder="e.g. name@upi"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-teal-accent transition-colors"
                      value={formData.upiId}
                      onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-teal-accent transition-colors text-2xl font-serif font-bold"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Return By (Due Date)</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-teal-accent transition-colors"
                      value={formData.dueDate}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setMode('select')} className="flex-1 py-4 art-frame rounded-2xl font-bold uppercase tracking-widest text-xs">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] py-4 bg-teal-accent text-white rounded-2xl font-bold uppercase tracking-widest text-xs glow-teal">Confirm Transfer</button>
                </div>
              </div>
            )}

            {mode === 'cash' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Debtor Name</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-amber-accent transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-amber-accent transition-colors"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-amber-accent transition-colors text-2xl font-serif font-bold"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Return By (Due Date)</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4 focus:outline-none focus:border-amber-accent transition-colors"
                      value={formData.dueDate}
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest opacity-40 ml-2">Physical Evidence</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="evidence-upload"
                      />
                      <label
                        htmlFor="evidence-upload"
                        className={cn(
                          "w-full flex flex-col items-center justify-center p-8 art-frame rounded-[2rem] border-dashed border-foreground/20 cursor-pointer hover:bg-foreground/5 transition-all",
                          formData.image && "border-teal-accent bg-teal-accent/5"
                        )}
                      >
                        {formData.image ? (
                          <>
                            <CheckCircle2 size={32} className="text-teal-accent mb-2" />
                            <span className="text-xs font-bold text-teal-accent uppercase tracking-widest">Image Attached</span>
                          </>
                        ) : (
                          <>
                            <Upload size={32} className="opacity-20 mb-2" />
                            <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Picture of Money Handover</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setMode('select')} className="flex-1 py-4 art-frame rounded-2xl font-bold uppercase tracking-widest text-xs">Back</button>
                  <button onClick={handleSubmit} className="flex-[2] py-4 bg-amber-accent text-black rounded-2xl font-bold uppercase tracking-widest text-xs glow-amber">Record Handshake</button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
