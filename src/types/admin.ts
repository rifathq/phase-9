export type AdminSection = 
  | 'overview' 
  | 'orders' 
  | 'resellers' 
  | 'customers' 
  | 'products' 
  | 'withdrawals' 
  | 'subscriptions' 
  | 'wallets' 
  | 'transactions' 
  | 'notifications' 
  | 'audit-log';

export interface CustomerRecord {
  id: string;
  firebaseUid?: string;
  displayName: string;
  email: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending';
  role?: string;
  createdAt: string;
  ordersCount?: number;
  totalSpent?: number;
  emailVerified?: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  adminEmail: string;
  adminId?: string;
  adminUid?: string;
  description: string;
  targetId: string;
  targetType: string;
  timestamp: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'withdrawal' | 'subscription' | 'system' | 'info';
  isRead: boolean;
  createdAt: string;
  link?: string;
}
