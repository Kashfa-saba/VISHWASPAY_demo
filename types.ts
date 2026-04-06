export type TransactionStatus = 'pending' | 'active' | 'paid' | 'settled' | 'defaulted' | 'pending_confirmation';

export interface Profile {
  id: string;
  full_name: string;
  trust_score: number; // 300-900
  hearts_balance: number;
  email?: string;
  upi_id?: string;
  phone?: string;
  privacy_mode: 'public' | 'private';
  theme_preference: 'dark' | 'light' | 'system';
}

export interface Transaction {
  id: string;
  amount: number;
  lender_id: string;
  borrower_id: string;
  lender_name: string;
  borrower_name: string;
  due_date: string; // ISO string
  status: TransactionStatus;
  is_heart_used: boolean;
  created_at: string;
  settled_at?: string;
  repayment_progress?: number; // 0-100
}

export interface DebtorInfo {
  name: string;
  amount: number;
  status: TransactionStatus;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  reward: string;
  is_completed: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  is_unlocked: boolean;
  icon_name: string;
}

export interface HeartGift {
  id: string;
  from_name: string;
  type: 'nudge' | 'gift';
  created_at: string;
  is_thanked: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'heart';
  created_at: string;
  is_read: boolean;
}
