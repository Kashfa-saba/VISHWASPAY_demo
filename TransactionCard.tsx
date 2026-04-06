import { motion } from "motion/react";
import { Heart, Calendar, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Transaction } from "@/src/types";
import { cn } from "@/src/lib/utils";

export interface TransactionCardProps {
  key?: string | number;
  transaction: Transaction;
  currentUserId: string;
  onAccept?: (id: string) => void;
  onUseHeart?: (id: string) => void;
  onPay?: (id: string) => void;
  onConfirmReceipt?: (id: string) => void;
  onReminder?: (id: string) => void;
}

export function TransactionCard({ 
  transaction, 
  currentUserId, 
  onAccept, 
  onUseHeart,
  onPay,
  onConfirmReceipt,
  onReminder
}: TransactionCardProps) {
  const isLender = transaction.lender_id === currentUserId;
  const isBorrower = transaction.borrower_id === currentUserId;
  
  const statusColors = {
    pending: "text-amber-accent bg-amber-accent/10",
    active: "text-teal-accent bg-teal-accent/10",
    settled: "text-foreground/40 bg-foreground/5",
    paid: "text-teal-accent bg-teal-accent/20",
    defaulted: "text-red-500 bg-red-500/10",
    pending_confirmation: "text-amber-accent bg-amber-accent/20"
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.01]",
        "art-frame shadow-sm"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={cn(
            "text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded-full mb-2 inline-block", 
            statusColors[transaction.status],
            "bg-foreground/10"
          )}>
            {transaction.status}
          </span>
          <h3 className="text-2xl font-serif font-bold text-foreground">
            ₹{transaction.amount.toLocaleString()}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-40 uppercase tracking-widest mb-1 text-foreground">
            {isLender ? "To" : "From"}
          </p>
          <p className="font-bold text-foreground">
            {isLender ? transaction.borrower_name : transaction.lender_name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm opacity-60 mb-6">
        <div className="flex items-center gap-1.5 text-foreground">
          <Calendar size={14} />
          <span className="opacity-60">Due: {format(new Date(transaction.due_date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        {transaction.is_heart_used && (
          <div className="flex items-center gap-1.5 text-amber-accent">
            <Heart size={14} fill="currentColor" />
            <span className="font-bold">Extended</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {transaction.status === 'pending' && isBorrower && (
          <button 
            onClick={() => onAccept?.(transaction.id)}
            className="flex-1 bg-teal-accent text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-accent/80 transition-colors shadow-lg"
          >
            <CheckCircle2 size={18} />
            Accept Handshake
          </button>
        )}

        {transaction.status === 'active' && isBorrower && (
          <>
            <button 
              onClick={() => onPay?.(transaction.id)}
              className="flex-1 bg-teal-accent text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-teal-accent/80 transition-colors shadow-lg"
            >
              <CheckCircle2 size={18} />
              Pay Now
            </button>
            {!transaction.is_heart_used && (
              <button 
                onClick={() => onUseHeart?.(transaction.id)}
                className="px-4 bg-foreground/10 text-foreground rounded-xl hover:bg-foreground/20 transition-colors flex items-center gap-2"
                title="Use 1 Heart to extend by 48h"
              >
                <Heart size={18} />
              </button>
            )}
          </>
        )}

        {transaction.status === 'active' && isLender && (
          <div className="flex flex-1 gap-2">
            <div className="flex-1 border border-foreground/20 py-3 rounded-xl text-center text-sm opacity-40 flex items-center justify-center gap-2 text-foreground">
              <Clock size={16} />
              Awaiting Payment
            </div>
            <button 
              onClick={() => onReminder?.(transaction.id)}
              className="px-4 bg-teal-accent text-white rounded-xl hover:bg-teal-accent/80 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              Remind
            </button>
          </div>
        )}

        {(transaction.status === 'paid' || transaction.status === 'pending_confirmation') && isLender && (
          <button 
            onClick={() => onConfirmReceipt?.(transaction.id)}
            className="flex-1 bg-amber-accent text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-accent/80 transition-colors shadow-lg"
          >
            <CheckCircle2 size={18} />
            Confirm Receipt
          </button>
        )}

        {transaction.status === 'pending_confirmation' && isBorrower && (
          <div className="flex-1 border border-foreground/20 py-3 rounded-xl text-center text-sm opacity-40 flex items-center justify-center gap-2 text-foreground">
            <Clock size={16} />
            Awaiting Confirmation
          </div>
        )}
      </div>
    </motion.div>
  );
}
