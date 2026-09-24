'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { AdminSection } from '@/types/admin';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Users, 
  Package, 
  Banknote, 
  CreditCard, 
  Wallet, 
  History, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  Menu, 
  X, 
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { OverviewTab } from './tabs/OverviewTab';
import { OrdersTab } from './tabs/OrdersTab';
import { ResellersTab } from './tabs/ResellersTab';
import { CustomersTab } from './tabs/CustomersTab';
import { ProductsTab } from './tabs/ProductsTab';
import { WithdrawalsTab } from './tabs/WithdrawalsTab';
import { SubscriptionsTab } from './tabs/SubscriptionsTab';
import { WalletsTab } from './tabs/WalletsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AuditLogTab } from './tabs/AuditLogTab';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function AdminPortalLayout() {
  const { 
    isAdminVerified, 
    isCheckingAdmin, 
    activeSection, 
    setActiveSection, 
    refreshAll,
    withdrawals,
    subscriptions,
    notifications,
    orders
  } = useAdmin();
  const { user, logout } = useAuth();
  const { navigate } = useMarketplace();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'Pending').length;
  const pendingSubscriptionsCount = subscriptions.filter(s => s.status === 'pending_payment').length;
  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshAll();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Platform Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders Fulfillment', icon: ShoppingBag, badge: orders.filter(o => o.status === 'Pending').length },
    { id: 'resellers', label: 'Reseller Stores', icon: Store },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Catalog Moderation', icon: Package },
    { id: 'withdrawals', label: 'Payout Queue', icon: Banknote, badge: pendingWithdrawalsCount },
    { id: 'subscriptions', label: 'Tier Subscriptions', icon: CreditCard, badge: pendingSubscriptionsCount },
    { id: 'wallets', label: 'Reseller Wallets', icon: Wallet },
    { id: 'transactions', label: 'Ledger Audit', icon: History },
    { id: 'notifications', label: 'Platform Alerts', icon: Bell, badge: unreadNotifsCount },
    { id: 'audit-log', label: 'Admin Audit Log', icon: ShieldCheck },
  ];

  // Loading state
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mb-4 shadow-lg animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-neutral-900">Verifying Admin Authorization</h2>
        <p className="text-xs text-neutral-500 mt-1">Checking Firestore security rules and privileged access...</p>
      </div>
    );
  }

  // Access Denied if not verified
  if (!isAdminVerified) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-[#E6E4E0] rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#111111]">Administrator Access Required</h2>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              This portal is restricted to authorized platform administrators. Your authenticated account does not have admin privileges in Cloud Firestore.
            </p>
          </div>

          <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E6E4E0] text-[11px] text-neutral-500 font-mono text-left">
            <div><strong>User UID:</strong> {user?.uid || 'Unauthenticated'}</div>
            <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
            <div><strong>Verified Admin:</strong> False</div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to Marketplace Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-neutral-900 flex flex-col">
      {/* Top Banner: Global Admin Status Bar */}
      <header className="bg-white border-b border-[#E6E4E0] sticky top-0 z-40">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-1.5 -ml-1 text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation drawer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#111111]">
                    Zero Invest
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-neutral-900 text-white">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono hidden sm:block">
                  Control Hub · Production Operations
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent hover:border-[#E6E4E0] transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setActiveSection('notifications')}
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Platform Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

            <div className="hidden sm:flex items-center gap-2 text-right">
              <div className="text-xs font-semibold text-neutral-900 line-clamp-1 max-w-[140px]">
                {user?.email || 'Admin'}
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E6E4E0] bg-[#FAF9F5] hover:bg-[#EAE8E2] text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Marketplace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Layout */}
      <div className="flex-1 w-full max-w-[1800px] mx-auto flex">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-[#E6E4E0] bg-white p-4 space-y-1 self-stretch">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Platform Management
          </div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-[#FAF9F5] hover:text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 mt-6 border-t border-[#E6E4E0] space-y-2">
            <div className="px-3 text-[11px] text-neutral-500">
              <span className="font-semibold block text-neutral-800">Admin Mode Active</span>
              <span>Firestore authoritative checks passed.</span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-[85vw] h-full flex flex-col p-4 shadow-xl z-10 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6E4E0]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-neutral-900" />
                  <span className="font-bold text-sm">Admin Navigation</span>
                </div>
                <button 
                  onClick={() => setIsMobileNavOpen(false)} 
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:bg-[#FAF9F5]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#E6E4E0]">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    navigate('home');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF9F5] text-xs font-semibold text-neutral-800 text-center"
                >
                  Return to Marketplace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Content Canvas */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeSection === 'overview' && <OverviewTab />}
          {activeSection === 'orders' && <OrdersTab />}
          {activeSection === 'resellers' && <ResellersTab />}
          {activeSection === 'customers' && <CustomersTab />}
          {activeSection === 'products' && <ProductsTab />}
          {activeSection === 'withdrawals' && <WithdrawalsTab />}
          {activeSection === 'subscriptions' && <SubscriptionsTab />}
          {activeSection === 'wallets' && <WalletsTab />}
          {activeSection === 'transactions' && <TransactionsTab />}
          {activeSection === 'notifications' && <NotificationsTab />}
          {activeSection === 'audit-log' && <AuditLogTab />}
        </main>
      </div>
    </div>
  );
}
