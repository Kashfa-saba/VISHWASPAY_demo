import { motion, AnimatePresence } from "motion/react";
import { Plus, User, Search, MessageSquare, Send, Sparkles, X, Bell, CheckCircle2, AlertCircle, Info, Heart as HeartIcon, Home, Target, Trophy, Zap, Shield, Handshake } from "lucide-react";
import { InfoBlock } from "./ui/InfoBlock";
import { SegmentedRing } from "./ui/Ring";
import { TransactionCard } from "./ui/TransactionCard";
import { Profile, Transaction, DebtorInfo, Notification, Mission, Badge } from "@/src/types";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";

import { Logo } from "./ui/Logo";

const CHART_DATA = [
  { month: 'Oct', lent: 12000, borrowed: 5000 },
  { month: 'Nov', lent: 15000, borrowed: 8000 },
  { month: 'Dec', lent: 10000, borrowed: 12000 },
  { month: 'Jan', lent: 18000, borrowed: 7000 },
  { month: 'Feb', lent: 22000, borrowed: 9000 },
  { month: 'Mar', lent: 25000, borrowed: 10000 },
];

const CHHOTU_TONES = {
  funny: [
    "Bhai, kidney bechne ki naubat aa gayi hai, mera paisa kab dega?",
    "Dosti apni jagah, udhaar apni jagah. Chai ke paise nikal jaldi!",
    "Error 404: My money not found in my wallet. Help me find it?",
    "Paisa de de bhai, warna ghar ke bahaar nimbu-mirchi latka doonga!",
    "My bank balance is doing 'Moye Moye'. Thodi daya karo!",
    "Khaali jeb, lambi umeed... thoda settlement kar de bhai, dil ko sukoon milega.",
    "Udhaar ek jaadu hai, main deta hoon aur tu gayab ho jata hai. Magic khatam kar!",
    "Bhai, 21 din mein paisa double ka scheme nahi hai ye, bas mera paisa wapas kar de!",
    "Biryani khane ke paise hain, par mera udhaar dene ke nahi? Wah bhai wah!",
    "Bhai, kidney ek hi kaafi hai jeene ke liye, doosri bech ke mera paisa de de!"
  ],
  strict: [
    "Payment is overdue. Please settle now to avoid a Trust Score drop.",
    "Action required: Transaction ID #{id} needs immediate settlement.",
    "Friendly period is over. Please complete the transfer now."
  ],
  polite: [
    "Hey! Just a friendly reminder about our pending handshake. Whenever you're ready!",
    "Hope you're doing well. Just checking in on the repayment plan.",
    "Whenever you have a moment, could we settle the pending amount?"
  ]
};

interface DashboardProps {
  profile: Profile;
  transactions: Transaction[];
  notifications: Notification[];
  missions: Mission[];
  badges: Badge[];
  activeTab: 'home' | 'missions' | 'accomplishments' | 'profile';
  setActiveTab: (tab: 'home' | 'missions' | 'accomplishments' | 'profile') => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onOpenProfile: () => void;
  onLendMoney: () => void;
  onAccept: (id: string) => void;
  onUseHeart: (id: string) => void;
  onPay: (id: string) => void;
  onConfirmReceipt: (id: string) => void;
  onGoHome: () => void;
}

export function Dashboard({ 
  profile, 
  transactions, 
  notifications,
  missions,
  badges,
  activeTab,
  setActiveTab,
  setNotifications,
  onOpenProfile, 
  onLendMoney,
  onAccept,
  onUseHeart,
  onPay,
  onConfirmReceipt,
  onGoHome
}: DashboardProps) {
  const [selectedDebtor, setSelectedDebtor] = useState<Transaction | null>(null);
  const [selectedTone, setSelectedTone] = useState<'funny' | 'strict' | 'polite' | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [isChhotuOpen, setIsChhotuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const lentMoney = transactions
    .filter(t => t.lender_id === profile.id && t.status !== 'settled')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const arrivingThisWeek = transactions
    .filter(t => t.lender_id === profile.id && (t.status === 'active' || t.status === 'paid' || t.status === 'pending_confirmation'))
    .reduce((acc, t) => acc + t.amount, 0);
    
  const borrowedMoney = transactions
    .filter(t => t.borrower_id === profile.id && t.status !== 'settled')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeDebtors: DebtorInfo[] = transactions
    .filter(t => t.lender_id === profile.id && t.status === 'active')
    .map(t => ({ name: t.borrower_name, amount: t.amount, status: t.status }));

  const debtorSegments = activeDebtors.map((d, i) => ({
    value: d.amount,
    color: i % 2 === 0 ? "var(--color-amber-accent)" : "var(--color-teal-accent)",
    name: d.name,
    amount: d.amount
  }));

  const ledgerTransactions = transactions.filter(t => t.status !== 'settled');

  const handleGenerateReminder = (tone: 'funny' | 'strict' | 'polite') => {
    if (!selectedDebtor) return;
    const messages = CHHOTU_TONES[tone];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const formatted = randomMsg
      .replace("{amount}", selectedDebtor.amount.toLocaleString())
      .replace("{date}", new Date(selectedDebtor.due_date).toLocaleDateString())
      .replace("{id}", selectedDebtor.id.split('-')[1] || selectedDebtor.id);
    setGeneratedMessage(formatted);
    setSelectedTone(tone);
  };

  const handleWhatsAppSend = () => {
    if (!selectedDebtor || !generatedMessage) return;
    
    const phone = "919876543210"; // Mock phone
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(generatedMessage)}`;
    window.open(url, '_blank');
    
    // Demo Magic: Simulate return to app after 3 seconds
    setIsChhotuOpen(false);
    setTimeout(() => {
      onConfirmReceipt(selectedDebtor.id);
      setSelectedDebtor(null);
      setGeneratedMessage("");
      setSelectedTone(null);
    }, 3000);
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Financial Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoBlock 
          title="Total Money Lent" 
          value={`₹${lentMoney.toLocaleString()}`} 
          subValue={`₹${arrivingThisWeek.toLocaleString()} arriving this week`}
          type="lent" 
        />
        <InfoBlock 
          title="Total Money Borrowed" 
          value={`₹${borrowedMoney.toLocaleString()}`} 
          type="borrowed" 
        />
      </section>

      {/* Circular Ledger Section */}
      <section className="flex flex-col items-center py-10 art-frame rounded-[3rem] relative overflow-hidden shadow-sm">
        <div className="absolute top-6 left-6 flex items-center gap-2 opacity-40 text-foreground">
          <Search size={14} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Scan Ledger</span>
        </div>
        <SegmentedRing segments={debtorSegments.length > 0 ? debtorSegments : [{ value: 1, color: 'rgba(128,128,128,0.1)', name: 'No active debtors', amount: 0 }]} />
      </section>

      {/* Line Chart Section */}
      <section className="art-frame p-8 rounded-[3rem] w-full md:w-[60%] mx-auto shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest opacity-40 text-foreground">Trust Velocity</h3>
          <p className="text-xs opacity-20 text-foreground">Lent vs Borrowed (6 Months)</p>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 35, 126, 0.1)" vertical={false} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.4 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', fontSize: '10px', color: 'var(--foreground)' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Line 
                type="monotone" 
                dataKey="lent" 
                stroke="var(--foreground)" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="borrowed" 
                stroke="#FFBF00" 
                strokeWidth={3} 
                dot={false} 
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Handshake Ledger */}
      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Handshake Ledger</h2>
            <p className="text-xs opacity-40 text-foreground">Active and pending trust agreements</p>
          </div>
          <button className="text-teal-accent text-sm font-bold uppercase tracking-widest hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {ledgerTransactions.length > 0 ? ledgerTransactions.map(tx => (
            <TransactionCard 
              key={tx.id} 
              transaction={tx} 
              currentUserId={profile.id}
              onAccept={onAccept}
              onUseHeart={onUseHeart}
              onPay={onPay}
              onConfirmReceipt={onConfirmReceipt}
              onReminder={() => {
                setSelectedDebtor(tx);
                setIsChhotuOpen(true);
              }}
            />
          )) : (
            <div className="text-center py-20 art-frame rounded-3xl border-dashed border-foreground/10">
              <p className="opacity-40 font-serif italic">The gallery is empty. Start a new handshake.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );

  const renderMissions = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif font-bold">Mission Hub</h2>
        <p className="text-xs opacity-40 uppercase tracking-[0.3em]">The Grind for Hearts & XP</p>
      </div>

      <div className="grid gap-4">
        {missions.map(mission => (
          <div key={mission.id} className="art-frame p-6 rounded-[2rem] space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{mission.title}</h3>
                <p className="text-xs opacity-60">{mission.description}</p>
              </div>
              <div className="px-3 py-1 bg-amber-accent/10 text-amber-accent rounded-full text-[10px] font-bold uppercase tracking-widest">
                {mission.reward}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-40 font-bold">
                <span>Progress</span>
                <span>{mission.progress}%</span>
              </div>
              <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${mission.progress}%` }}
                  className="h-full bg-teal-accent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAccomplishments = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif font-bold">Achievement Gallery</h2>
        <p className="text-xs opacity-40 uppercase tracking-[0.3em]">The Flex of Financial Honor</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className={cn(
              "art-frame p-6 rounded-[2.5rem] flex flex-col items-center text-center space-y-4 transition-all",
              badge.is_unlocked ? "shadow-md" : "bg-foreground/5 opacity-40 grayscale"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-inner",
              badge.is_unlocked ? "bg-amber-accent/20 text-amber-accent" : "bg-foreground/10 text-foreground/40"
            )}>
              {badge.icon_name === 'Handshake' && <Handshake size={32} />}
              {badge.icon_name === 'Zap' && <Zap size={32} />}
              {badge.icon_name === 'Shield' && <Shield size={32} />}
              {badge.icon_name === 'Trophy' && <Trophy size={32} />}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground">{badge.title}</h3>
              <p className="text-[10px] leading-tight opacity-60">{badge.description}</p>
            </div>
            {!badge.is_unlocked && (
              <div className="text-[8px] uppercase tracking-widest font-bold opacity-40">Locked</div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 transition-colors duration-300">
      {/* Header */}
      <header className="p-6 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <button 
          onClick={onGoHome}
          className="flex items-center gap-3 group"
        >
          <Logo size={32} className="group-hover:rotate-12 transition-transform" />
          <div className="text-left">
            <h1 className="text-xl font-serif font-bold leading-none text-foreground">Vishwaspay</h1>
            <p className="text-[8px] uppercase tracking-[0.3em] opacity-40 font-bold text-foreground">Financial Gallery</p>
          </div>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) markAllAsRead();
              }}
              className="p-3 art-frame rounded-2xl hover:bg-foreground/5 transition-all hover:scale-110 relative shadow-sm"
            >
              <Bell size={20} className="text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-16 right-0 w-80 art-frame rounded-[2rem] shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-foreground/5 flex justify-between items-center">
                    <h3 className="font-serif font-bold text-foreground">Activity</h3>
                    <span className="text-[10px] uppercase tracking-widest opacity-40">{notifications.length} Recent</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-foreground/5 hover:bg-foreground/5 transition-colors flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          n.type === 'success' ? "bg-teal-accent/10 text-teal-accent" :
                          n.type === 'warning' ? "bg-red-500/10 text-red-500" :
                          n.type === 'heart' ? "bg-amber-accent/10 text-amber-accent" :
                          "bg-foreground/10 text-foreground"
                        )}>
                          {n.type === 'success' ? <CheckCircle2 size={14} /> :
                           n.type === 'warning' ? <AlertCircle size={14} /> :
                           n.type === 'heart' ? <HeartIcon size={14} /> :
                           <Info size={14} />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs leading-relaxed text-foreground">{n.message}</p>
                          <p className="text-[9px] opacity-30 uppercase tracking-widest">{format(new Date(n.created_at), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-10 text-center opacity-40 italic text-xs">No recent activity</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={onOpenProfile}
            className="p-3 art-frame rounded-2xl hover:bg-foreground/5 transition-all hover:scale-110"
          >
            <User size={20} className="text-foreground" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'missions' && renderMissions()}
        {activeTab === 'accomplishments' && renderAccomplishments()}
        {activeTab === 'profile' && (
          <div className="text-center py-20">
            <p className="opacity-40 italic">Profile details are in the side drawer.</p>
            <button 
              onClick={onOpenProfile}
              className="mt-4 px-6 py-2 bg-teal-accent text-white rounded-xl font-bold"
            >
              Open Profile
            </button>
          </div>
        )}
      </main>

      {/* Chhotu AI Assistant */}
      <div className="fixed bottom-24 left-8 z-50">
        <AnimatePresence>
          {isChhotuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 left-0 w-80 art-frame p-6 rounded-[2rem] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-accent rounded-full flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="font-serif font-bold text-foreground">Chhotu AI</span>
                </div>
                <button onClick={() => setIsChhotuOpen(false)} className="opacity-40 hover:opacity-100">
                  <X size={18} />
                </button>
              </div>

              {!selectedDebtor ? (
                <p className="text-xs opacity-60 italic">Select a transaction from the ledger to generate a reminder.</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-foreground">Kaise bolun? (Funny / Strict / Polite)</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-40">Reminder for {selectedDebtor.borrower_name}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['funny', 'strict', 'polite'] as const).map(tone => (
                      <button
                        key={tone}
                        onClick={() => handleGenerateReminder(tone)}
                        className={cn(
                          "py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                          selectedTone === tone ? "bg-teal-accent text-white" : "bg-foreground/5 opacity-40 hover:bg-foreground/10"
                        )}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  {generatedMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-foreground/5 rounded-2xl text-sm italic opacity-80 border border-foreground/5 text-foreground"
                    >
                      "{generatedMessage}"
                    </motion.div>
                  )}

                  {generatedMessage && (
                    <button 
                      onClick={handleWhatsAppSend}
                      className="w-full py-3 bg-teal-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-accent/80 transition-colors"
                    >
                      <Send size={16} />
                      Send via WhatsApp
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChhotuOpen(!isChhotuOpen)}
          className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all",
            isChhotuOpen ? "bg-teal-accent text-white" : "art-frame text-teal-accent"
          )}
        >
          <MessageSquare size={24} />
        </motion.button>
      </div>

      {/* Floating Action Button */}
      {activeTab === 'home' && (
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLendMoney}
          className="fixed bottom-24 right-8 bg-teal-accent text-white p-5 rounded-3xl shadow-2xl glow-teal flex items-center gap-3 z-40"
        >
          <Plus size={24} />
          <span className="font-bold uppercase tracking-widest text-xs">Lend Money</span>
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--nav-border)] px-6 py-4 flex justify-between items-center z-50">
        <NavButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<Home size={20} />} 
          label="Home" 
        />
        <NavButton 
          active={activeTab === 'missions'} 
          onClick={() => setActiveTab('missions')} 
          icon={<Target size={20} />} 
          label="Missions" 
        />
        <NavButton 
          active={activeTab === 'accomplishments'} 
          onClick={() => setActiveTab('accomplishments')} 
          icon={<Trophy size={20} />} 
          label="Flex" 
        />
        <NavButton 
          active={activeTab === 'profile'} 
          onClick={onOpenProfile} 
          icon={<User size={20} />} 
          label="Profile" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 transition-all",
        active ? "text-teal-accent scale-110" : "text-foreground/40 hover:text-foreground/60"
      )}
    >
      <div className={cn(
        "p-2 rounded-xl transition-all",
        active ? "bg-teal-accent/10" : ""
      )}>
        {icon}
      </div>
      <span className="text-[8px] uppercase tracking-widest font-bold">{label}</span>
    </button>
  );
}
