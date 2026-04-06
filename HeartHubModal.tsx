import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Heart, Gift, Zap, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { HeartGift } from "@/src/types";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";

interface HeartHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  heartGifts: HeartGift[];
  onThank: (id: string) => void;
  onBuy: (count: number) => void;
}

export function HeartHubModal({ isOpen, onClose, heartGifts, onThank, onBuy }: HeartHubModalProps) {
  const [activeTab, setActiveTab] = useState<'gifts' | 'shop'>('gifts');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-md art-frame rounded-[3rem] overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-foreground/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-accent/20 rounded-2xl flex items-center justify-center text-amber-accent">
                  <Heart size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground">Heart Hub</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-foreground/5 mx-8 mt-6 rounded-2xl">
              <button
                onClick={() => setActiveTab('gifts')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === 'gifts' ? "bg-background text-foreground shadow-sm" : "opacity-40"
                )}
              >
                Nudges & Gifts
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTab === 'shop' ? "bg-background text-foreground shadow-sm" : "opacity-40"
                )}
              >
                Heart Shop
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 pt-6">
              {activeTab === 'gifts' ? (
                <div className="space-y-4">
                  {heartGifts.length > 0 ? heartGifts.map(gift => (
                    <div key={gift.id} className="art-frame p-4 rounded-2xl flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center",
                          gift.type === 'gift' ? "bg-amber-accent/10 text-amber-accent" : "bg-teal-accent/10 text-teal-accent"
                        )}>
                          {gift.type === 'gift' ? <Heart size={20} fill="currentColor" /> : <Zap size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">
                            {gift.from_name} {gift.type === 'gift' ? "gifted a Heart" : "sent a Nudge"}
                          </p>
                          <p className="text-[9px] opacity-40 uppercase tracking-widest">
                            {format(new Date(gift.created_at), 'MMM dd, h:mm a')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onThank(gift.id)}
                        disabled={gift.is_thanked}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                          gift.is_thanked 
                            ? "bg-foreground/5 text-foreground/20 cursor-default" 
                            : "bg-teal-accent text-white hover:bg-teal-accent/80"
                        )}
                      >
                        {gift.is_thanked ? "Thanked" : "Thank You"}
                      </button>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-40 italic text-xs">No gifts yet. Invite friends!</div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-teal-accent/10 rounded-2xl border border-teal-accent/20 flex gap-3 items-start">
                    <Shield size={20} className="text-teal-accent shrink-0 mt-1" />
                    <p className="text-xs text-teal-accent font-medium leading-relaxed">
                      Protect your Score! Trust Score only drops when Heart Balance reaches 0.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    <ShopItem 
                      title="Starter Pack" 
                      description="2 Hearts for emergency" 
                      price="₹199" 
                      onBuy={() => onBuy(2)} 
                    />
                    <ShopItem 
                      title="Safety Net" 
                      description="5 Hearts for peace of mind" 
                      price="₹399" 
                      onBuy={() => onBuy(5)} 
                    />
                    <ShopItem 
                      title="Trust Protector" 
                      description="Unlimited Hearts (Monthly)" 
                      price="₹999/mo" 
                      onBuy={() => onBuy(10)} 
                      isPopular
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ShopItem({ title, description, price, onBuy, isPopular }: { title: string, description: string, price: string, onBuy: () => void, isPopular?: boolean }) {
  return (
    <div className={cn(
      "art-frame p-5 rounded-[2rem] flex justify-between items-center transition-all hover:scale-[1.02]",
      isPopular ? "border-amber-accent/50 shadow-lg" : "shadow-sm"
    )}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-foreground">{title}</h3>
          {isPopular && (
            <span className="px-2 py-0.5 bg-amber-accent text-black text-[8px] font-bold uppercase tracking-widest rounded-full">Popular</span>
          )}
        </div>
        <p className="text-[10px] opacity-60">{description}</p>
      </div>
      <button 
        onClick={onBuy}
        className="px-4 py-2 bg-foreground text-background rounded-xl text-xs font-bold hover:opacity-90 transition-colors"
      >
        {price}
      </button>
    </div>
  );
}
