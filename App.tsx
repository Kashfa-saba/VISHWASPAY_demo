import { useState, useEffect } from "react";
import { Dashboard } from "./Dashboard";
import { ProfileDrawer } from "./ProfileDrawer";
import { LendMoneyModal } from "./LendMoneyModal";
import { HeartHubModal } from "./HeartHubModal";
import { Profile, Transaction, Notification, Mission, Badge, HeartGift } from "./types";
import { addHours, format, subDays, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, LogIn, Heart, Sparkles, Bell, X } from "lucide-react";
import { Logo } from "./Logo";
import { HandshakeBounce } from "./HandshakeBounce";
import { cn } from "./utils";

// Mock Data
const MOCK_PROFILE: Profile = {
  id: "user-1",
  full_name: "Aryan Sharma",
  trust_score: 720,
  hearts_balance: 2,
  email: "aryan@example.com",
  upi_id: "aryan@okaxis",
  phone: "+91 98765 43210",
  privacy_mode: 'public',
  theme_preference: 'dark'
};

const MOCK_TRANSACTIONS: Transaction[] = [
  // Section 1: People who Borrowed from Me (Lent - 5 Entries)
  {
    id: "tx-rahul",
    amount: 2500,
    lender_id: "user-1",
    borrower_id: "user-rahul",
    lender_name: "Aryan Sharma",
    borrower_name: "Rahul",
    due_date: addHours(new Date(), 48).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-priya",
    amount: 1200,
    lender_id: "user-1",
    borrower_id: "user-priya",
    lender_name: "Aryan Sharma",
    borrower_name: "Priya",
    due_date: new Date().toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-amit",
    amount: 5000,
    lender_id: "user-1",
    borrower_id: "user-amit",
    lender_name: "Aryan Sharma",
    borrower_name: "Amit",
    due_date: addHours(new Date(), -24).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-sneha",
    amount: 800,
    lender_id: "user-1",
    borrower_id: "user-sneha",
    lender_name: "Aryan Sharma",
    borrower_name: "Sneha",
    due_date: addHours(new Date(), 72).toISOString(),
    status: "active",
    repayment_progress: 80,
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-vikram",
    amount: 3000,
    lender_id: "user-1",
    borrower_id: "user-vikram",
    lender_name: "Aryan Sharma",
    borrower_name: "Vikram",
    due_date: addHours(new Date(), 120).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  // Section 2: People who Lent to Me (Borrowed - 5 Entries)
  {
    id: "tx-karan",
    amount: 1000,
    lender_id: "user-karan",
    borrower_id: "user-1",
    lender_name: "Karan",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 96).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-simran",
    amount: 4500,
    lender_id: "user-simran",
    borrower_id: "user-1",
    lender_name: "Simran",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 168).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-rohan",
    amount: 2000,
    lender_id: "user-rohan",
    borrower_id: "user-1",
    lender_name: "Rohan",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 24).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-anjali",
    amount: 3200,
    lender_id: "user-anjali",
    borrower_id: "user-1",
    lender_name: "Anjali",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 240).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-kabir",
    amount: 1500,
    lender_id: "user-kabir",
    borrower_id: "user-1",
    lender_name: "Kabir",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 48).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  // Section 3: People I MUST Return To (Active Payable - 5 Entries)
  {
    id: "tx-must-1",
    amount: 500,
    lender_id: "user-lender-1",
    borrower_id: "user-1",
    lender_name: "Shopkeeper",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 12).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-must-2",
    amount: 1500,
    lender_id: "user-lender-2",
    borrower_id: "user-1",
    lender_name: "Landlord",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 0).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-must-3",
    amount: 200,
    lender_id: "user-lender-3",
    borrower_id: "user-1",
    lender_name: "Milkman",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), -48).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-must-4",
    amount: 1000,
    lender_id: "user-lender-4",
    borrower_id: "user-1",
    lender_name: "Gym Trainer",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 72).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  },
  {
    id: "tx-must-5",
    amount: 3500,
    lender_id: "user-lender-5",
    borrower_id: "user-1",
    lender_name: "Travel Agent",
    borrower_name: "Aryan Sharma",
    due_date: addHours(new Date(), 120).toISOString(),
    status: "active",
    is_heart_used: false,
    created_at: new Date().toISOString()
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    message: "Rahul accepted your Handshake for ₹2,500.",
    type: "success",
    created_at: subDays(new Date(), 1).toISOString(),
    is_read: false
  },
  {
    id: "n2",
    message: "Reminder: Priya’s payment is due today!",
    type: "warning",
    created_at: new Date().toISOString(),
    is_read: false
  },
  {
    id: "n3",
    message: "Trust Score Updated: +20 points for on-time settlement.",
    type: "info",
    created_at: subDays(new Date(), 2).toISOString(),
    is_read: true
  },
  {
    id: "n4",
    message: "Heart Earned! You now have 3 Hearts.",
    type: "heart",
    created_at: subDays(new Date(), 3).toISOString(),
    is_read: true
  }
];

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-background z-[200] transition-colors duration-300"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <Logo size={120} className="mb-10" />
        <h1 className="text-4xl font-serif font-bold text-teal-accent tracking-tight">Vishwaspay</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/40 mt-2">Financial Gallery</p>
      </motion.div>
    </motion.div>
  );
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-md text-center space-y-10">
        <div className="flex flex-col items-center">
          <Logo size={120} className="mb-6" />
          <h1 className="text-4xl font-serif font-bold">Welcome to the Gallery</h1>
          <p className="opacity-40 mt-2">Secure, trust-based financial handshakes.</p>
        </div>

        <div className="art-frame p-8 rounded-[2.5rem] space-y-6">
          <button 
            onClick={onLogin}
            className="w-full py-4 bg-foreground text-background rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
          >
            <LogIn size={20} />
            Continue with Google
          </button>
          <p className="text-[10px] opacity-30 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to our terms of service and trust guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}

const MOCK_MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "The Early Bird",
    description: "Repay 5 loans at least 2 days before the due date.",
    progress: 40,
    reward: "+2 Hearts",
    is_completed: false
  },
  {
    id: "m2",
    title: "Trust Ambassador",
    description: "Invite 3 friends to join Vishwaspay.",
    progress: 66,
    reward: "+1 Heart",
    is_completed: false
  },
  {
    id: "m3",
    title: "Lifesaver",
    description: "Gift a heart to a friend whose score is about to drop.",
    progress: 0,
    reward: "Kind Soul Badge",
    is_completed: false
  },
  {
    id: "m4",
    title: "Consistent Shaker",
    description: "Complete 10 successful handshakes without any delays.",
    progress: 80,
    reward: "+50 Trust XP",
    is_completed: false
  }
];

const MOCK_BADGES: Badge[] = [
  {
    id: "b1",
    title: "First Handshake",
    description: "Unlocked after first loan.",
    is_unlocked: true,
    icon_name: "Handshake"
  },
  {
    id: "b2",
    title: "Unstoppable",
    description: "30 days of 0 overdue payments.",
    is_unlocked: false,
    icon_name: "Zap"
  },
  {
    id: "b3",
    title: "Heart Guard",
    description: "Successfully used a Heart to extend a deadline.",
    is_unlocked: true,
    icon_name: "Shield"
  },
  {
    id: "b4",
    title: "Vishwaas Pro",
    description: "Reached a Trust Score of 850+.",
    is_unlocked: false,
    icon_name: "Trophy"
  }
];

const MOCK_HEART_GIFTS: HeartGift[] = [
  {
    id: "hg1",
    from_name: "Rahul",
    type: "gift",
    created_at: subDays(new Date(), 1).toISOString(),
    is_thanked: false
  },
  {
    id: "hg2",
    from_name: "Priya",
    type: "nudge",
    created_at: subDays(new Date(), 2).toISOString(),
    is_thanked: true
  }
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [badges, setBadges] = useState<Badge[]>(MOCK_BADGES);
  const [heartGifts, setHeartGifts] = useState<HeartGift[]>(MOCK_HEART_GIFTS);
  
  const [activeTab, setActiveTab] = useState<'home' | 'missions' | 'accomplishments' | 'profile'>('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLendModalOpen, setIsLendModalOpen] = useState(false);
  const [isHeartHubOpen, setIsHeartHubOpen] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showHandshakeAnimation, setShowHandshakeAnimation] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showHeartPenalty, setShowHeartPenalty] = useState(false);

  useEffect(() => {
    // Check session
    const session = localStorage.getItem('vishwaspay_session');
    if (session) {
      setIsAuthenticated(true);
    }
    
    // Splash screen timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Trust Engine: Initial Overdue Check
    checkOverdue();
    
    return () => clearTimeout(timer);
  }, []);

  const addNotification = (message: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: `n-${Date.now()}`,
      message,
      type,
      created_at: new Date().toISOString(),
      is_read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const checkOverdue = () => {
    const now = new Date();
    let heartPenalty = 0;
    let scorePenalty = 0;

    setTransactions(prev => prev.map(tx => {
      if (tx.status === 'active' && new Date(tx.due_date) < now) {
        // This transaction is overdue
        const dueDate = new Date(tx.due_date);
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (profile.hearts_balance > 0) {
          // Immediate -1 heart if just became overdue (simplified for demo)
          if (daysOverdue === 0) {
            heartPenalty++;
          }
        } else {
          // -5 trust score daily if hearts are 0
          if (daysOverdue > 0) {
            scorePenalty += 5;
          }
        }
        return { ...tx, status: 'active' as const };
      }
      return tx;
    }));

    if (heartPenalty > 0 || scorePenalty > 0) {
      setProfile(prev => ({
        ...prev,
        hearts_balance: Math.max(0, prev.hearts_balance - heartPenalty),
        trust_score: Math.max(300, prev.trust_score - scorePenalty)
      }));
      
      if (heartPenalty > 0) {
        setShowHeartPenalty(true);
        addNotification("Trust Penalty: -1 Heart due to overdue payment.", "warning");
        setTimeout(() => setShowHeartPenalty(false), 3000);
      }
      if (scorePenalty > 0) {
        addNotification(`Trust Score Drop: -${scorePenalty} points for delayed settlement.`, "warning");
      }
    }
  };

  useEffect(() => {
    // Handle theme application
    const root = window.document.documentElement;
    const theme = profile.theme_preference;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [profile.theme_preference]);

  const handleLogin = () => {
    localStorage.setItem('vishwaspay_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vishwaspay_session');
    setIsAuthenticated(false);
    setIsProfileOpen(false);
  };

  const triggerHandshake = () => {
    setShowHandshakeAnimation(true);
    setTimeout(() => setShowHandshakeAnimation(false), 1500);
  };

  const handleAccept = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: 'active' as const } : tx
    ));
    if (tx) {
      addNotification(`${tx.borrower_name} accepted your Handshake for ₹${tx.amount.toLocaleString()}.`, "success");
    }
    triggerHandshake();
  };

  const handleUseHeart = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (profile.hearts_balance <= 0 || tx?.is_heart_used) return;

    setProfile(prev => ({ ...prev, hearts_balance: prev.hearts_balance - 1 }));
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { 
        ...tx, 
        is_heart_used: true, 
        due_date: addHours(new Date(tx.due_date), 48).toISOString() 
      } : tx
    ));
  };

  const handlePay = (id: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: 'paid' as const } : tx
    ));
  };

  const handleConfirmReceipt = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    const now = new Date();
    const isLate = tx ? new Date(tx.due_date) < now : false;

    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: 'settled' as const, settled_at: new Date().toISOString() } : tx
    ));
    
    triggerHandshake();

    // Trust Engine: Reward for on-time payment
    if (!isLate) {
      setTimeout(() => {
        setProfile(prev => ({
          ...prev,
          trust_score: Math.min(900, prev.trust_score + 20),
          hearts_balance: prev.hearts_balance + 1
        }));
        addNotification("Trust Score Updated: +20 points for on-time settlement.", "info");
        addNotification("Heart Earned! You now have more protection.", "heart");
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowPaymentSuccess(true);
        setTimeout(() => setShowPaymentSuccess(false), 3000);
      }, 1000);
    }
  };

  const handleSettle = (id: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === id ? { ...tx, status: 'settled' as const, settled_at: new Date().toISOString() } : tx
    ));
    triggerHandshake();
  };

  const handleThankGift = (giftId: string) => {
    const gift = heartGifts.find(g => g.id === giftId);
    if (!gift || gift.is_thanked) return;

    setHeartGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, is_thanked: true } : g
    ));
    
    // Sending a heart back
    if (profile.hearts_balance > 0) {
      setProfile(prev => ({ ...prev, hearts_balance: prev.hearts_balance - 1 }));
      addNotification(`Heart sent back to ${gift.from_name} as a thank you!`, "heart");
    } else {
      addNotification(`Thanked ${gift.from_name}! (No hearts left to send back)`, "info");
    }
  };

  const handleBuyHearts = (count: number) => {
    setProfile(prev => ({ ...prev, hearts_balance: prev.hearts_balance + count }));
    addNotification(`Successfully added ${count} Hearts to your balance!`, "success");
    setShowLevelUp(true);
    setTimeout(() => setShowLevelUp(false), 3000);
  };

  const handleUpdateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleLendMoney = (data: any) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      amount: data.amount,
      lender_id: profile.id,
      borrower_id: "user-new",
      lender_name: profile.full_name,
      borrower_name: data.name || "New Debtor",
      due_date: data.due_date || addHours(new Date(), 168).toISOString(),
      status: "pending",
      is_heart_used: false,
      created_at: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification(`Handshake created for ₹${data.amount.toLocaleString()} with ${data.name || "New Debtor"}.`, "info");
    triggerHandshake();
  };

  const settledTransactions = transactions.filter(t => t.status === 'settled');
  const activeBorrowings = transactions.filter(t => t.borrower_id === profile.id && t.status !== 'settled');

  return (
    <div className="font-sans min-h-screen bg-background text-foreground transition-colors duration-300">
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!isLoading && !isAuthenticated && (
        <Login onLogin={handleLogin} />
      )}

      {!isLoading && isAuthenticated && (
        <>
          <Dashboard 
            profile={profile}
            transactions={transactions}
            notifications={notifications}
            missions={missions}
            badges={badges}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setNotifications={setNotifications}
            onOpenProfile={() => setIsProfileOpen(true)}
            onLendMoney={() => setIsLendModalOpen(true)}
            onAccept={handleAccept}
            onUseHeart={handleUseHeart}
            onPay={handlePay}
            onConfirmReceipt={handleConfirmReceipt}
            onGoHome={() => setActiveTab('home')}
          />

          <ProfileDrawer 
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            profile={profile}
            settledTransactions={settledTransactions}
            activeBorrowings={activeBorrowings}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onSettle={handleSettle}
            onOpenHeartHub={() => setIsHeartHubOpen(true)}
          />

          <HeartHubModal 
            isOpen={isHeartHubOpen}
            onClose={() => setIsHeartHubOpen(false)}
            heartGifts={heartGifts}
            onThank={handleThankGift}
            onBuy={handleBuyHearts}
          />

          <LendMoneyModal 
            isOpen={isLendModalOpen}
            onClose={() => setIsLendModalOpen(false)}
            onLend={handleLendMoney}
          />
        </>
      )}

      {/* Handshake Animation Overlay */}
      <AnimatePresence>
        {showHandshakeAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <HandshakeBounce />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Celebration */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-amber-accent/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="text-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(255,191,0,0.6)]"
              >
                <Heart size={80} fill="#FFBF00" className="text-amber-accent" />
              </motion.div>
              <h2 className="text-5xl font-serif font-bold text-white mb-4">Level Up!</h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-bold text-xl">+20 Trust Score</p>
                <p className="text-white font-bold text-xl">+1 Golden Heart</p>
              </div>
              <p className="text-white/60 uppercase tracking-[0.4em] text-xs mt-8">Exemplary Financial Honor</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heart Penalty Animation */}
      <AnimatePresence>
        {showHeartPenalty && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-red-500/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="text-center"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 0.9, 1],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(239,68,68,0.6)]"
              >
                <div className="relative">
                  <Heart size={80} fill="#EF4444" className="text-red-500" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute top-1/2 left-0 h-1 bg-white -rotate-45"
                  />
                </div>
              </motion.div>
              <h2 className="text-5xl font-serif font-bold text-white mb-4">Trust Penalty</h2>
              <div className="flex flex-col items-center gap-2">
                <p className="text-white font-bold text-xl">-1 Heart (Overdue)</p>
                <p className="text-white/80 text-sm">Settle now to protect your score</p>
              </div>
              <p className="text-white/60 uppercase tracking-[0.4em] text-xs mt-8">Financial Honor Compromised</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Success Animation */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-teal-accent/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 20 }}
              className="text-center"
            >
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <HandshakeBounce />
              </div>
              <h2 className="text-4xl font-serif font-bold text-white mb-2">Payment Successful</h2>
              <p className="text-white/60 uppercase tracking-[0.3em] text-xs">Trust Restored</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
