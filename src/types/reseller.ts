import { Product } from './marketplace';

export type ResellerPlanType = 'starter' | 'pro' | 'enterprise';

export interface ResellerProfile {
  id: string;
  firebaseUid: string;
  storeName: string;
  storeSlug: string;
  customDomain?: string;
  plan: ResellerPlanType;
  status: 'active' | 'pending' | 'suspended';
  contactPhone?: string;
  email?: string;
  walletBalance: number;
  totalEarnings: number;
  totalOrders: number;
  productsCount?: number;
  themeColor?: string;
  logoUrl?: string;
  bio?: string;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ResellerProduct {
  id: string;
  resellerId: string;
  originalProductId: string;
  productName: string;
  category?: string;
  customPrice: number;
  suggestedPrice?: number;
  wholesalePrice?: number;
  resellerProfit?: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  landingPageEnabled?: boolean;
  inStock?: boolean;
  supplierPriceBDT?: number;
  sellingPriceBDT?: number;
}

export interface ResellerSubscription {
  id: string;
  resellerId: string;
  resellerName?: string;
  plan: string;
  amount: number;
  priceBDT?: number;
  status: 'active' | 'pending_payment' | 'cancelled' | 'expired';
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'bank_transfer' | 'system';
  paymentTrxId: string;
  senderNumber?: string;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  expiresAt: string;
  expiryDate?: string;
  createdAt: string;
}

export interface ResellerWithdrawal {
  id: string;
  resellerId: string;
  resellerName?: string;
  amount: number;
  amountBDT?: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'bank_transfer';
  accountDetails: {
    accountNumber?: string;
    accountHolderName?: string;
    bankName?: string;
    branchName?: string;
    routingNumber?: string;
    accountType?: string;
  } | string;
  status: 'Pending' | 'Processing' | 'Approved' | 'Completed' | 'Rejected';
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  processedAt?: string;
  adminNotes?: string;
  payoutTrxId?: string;
}

export interface ResellerWallet {
  id: string;
  resellerId: string;
  balance: number;
  pendingBalance: number;
  totalWithdrawn: number;
  totalEarnings: number;
  availableBalanceBDT?: number;
  pendingBalanceBDT?: number;
  totalEarningsBDT?: number;
  totalWithdrawnBDT?: number;
  lastUpdated: string;
  updatedAt?: string;
}
