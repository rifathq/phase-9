'use client';

import React from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { 
  ShoppingBag, 
  Users, 
  Store, 
  Package, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Layers,
  Banknote
} from 'lucide-react';

export function OverviewTab() {
  const { 
    metrics, 
    isLoadingMetrics, 
    orders, 
    withdrawals, 
    subscriptions, 
    setActiveSection,
    refreshAll
  } = useAdmin();
  const { navigate } = useMarketplace();

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'Pending');
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending_payment');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Operational Status */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Platform Operations
            </span>
            <span className="text-xs text-neutral-500">
              Last synced: {metrics?.lastCalculatedAt ? new Date(metrics.lastCalculatedAt).toLocaleTimeString() : 'Just now'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
            Platform Command &amp; Operations
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
            Real-time reseller metrics, pending payouts, order fulfillment, and subscription verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => refreshAll()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F7F6F3] text-neutral-800 hover:bg-[#EAE8E2] border border-[#E6E4E0] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* Critical Operational Attention Callouts */}
      {(pendingWithdrawals.length > 0 || pendingSubscriptions.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {pendingWithdrawals.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    {pendingWithdrawals.length} Pending Withdrawal {pendingWithdrawals.length === 1 ? 'Request' : 'Requests'}
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Resellers requesting payout disbursement. Review details and disburse funds.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('withdrawals')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-amber-800 text-white text-xs font-semibold hover:bg-amber-900 transition-colors"
              >
                Review Payouts
              </button>
            </div>
          )}

          {pendingSubscriptions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-900">
                    {pendingSubscriptions.length} Subscription {pendingSubscriptions.length === 1 ? 'Payment' : 'Payments'} Pending
                  </h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Resellers submitted paid upgrades awaiting manual TrxID verification.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSection('subscriptions')}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-800 text-white text-xs font-semibold hover:bg-blue-900 transition-colors"
              >
                Verify Payments
              </button>
            </div>
          )}
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            {isLoadingMetrics ? '...' : (metrics?.totalOrders || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <span className="text-amber-600 font-semibold">{metrics?.pendingOrders || 0} pending</span>
            <span>·</span>
            <span className="text-emerald-600 font-semibold">{metrics?.deliveredOrders || 0} delivered</span>
          </div>
        </div>

        {/* Gross Delivered Sales */}
        <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Delivered Volume</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            ৳{isLoadingMetrics ? '...' : (metrics?.grossPlatformSalesBDT || 0).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Settled marketplace deliveries
          </div>
        </div>

        {/* Resellers */}
        <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Reseller Stores</span>
            <Store className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            {isLoadingMetrics ? '...' : (metrics?.totalResellers || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
            <span className="text-emerald-600 font-semibold">{metrics?.activeResellers || 0} active</span>
            <span>·</span>
            <span className="text-rose-600 font-semibold">{metrics?.suspendedResellers || 0} suspended</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            {isLoadingMetrics ? '...' : (metrics?.totalCustomers || 0).toLocaleString()}
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            Registered accounts on platform
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-[#E6E4E0] rounded-xl p-3.5 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">Catalog Products</span>
          <span className="text-lg font-bold text-neutral-900 mt-0.5 block">{metrics?.totalProducts || 0} listed</span>
        </div>
        <div className="bg-white border border-[#E6E4E0] rounded-xl p-3.5 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">Pending Withdrawals</span>
          <span className="text-lg font-bold text-amber-700 mt-0.5 block">৳{(metrics?.pendingWithdrawalsBDT || 0).toLocaleString()}</span>
        </div>
        <div className="bg-white border border-[#E6E4E0] rounded-xl p-3.5 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">Reseller Earnings</span>
          <span className="text-lg font-bold text-emerald-700 mt-0.5 block">৳{(metrics?.resellerTotalEarningsBDT || 0).toLocaleString()}</span>
        </div>
        <div className="bg-white border border-[#E6E4E0] rounded-xl p-3.5 text-center sm:text-left">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 block">Total Disbursed</span>
          <span className="text-lg font-bold text-neutral-800 mt-0.5 block">৳{(metrics?.resellerTotalWithdrawnBDT || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111111]">
              Recent Platform Orders
            </h3>
            <p className="text-xs text-neutral-500">
              Live orders submitted across all storefronts and landing pages.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('orders')}
            className="text-xs font-semibold text-[#111111] hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View all ({orders.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 text-xs sm:text-sm">
            No orders created in Firestore yet. Orders placed by customers will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead>
                <tr className="border-b border-[#E6E4E0] text-neutral-500 font-semibold">
                  <th className="pb-3 pr-4">Order #</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Reseller</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Payment</th>
                  <th className="pb-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFCFB] transition-colors">
                    <td className="py-3 pr-4 font-mono font-bold text-neutral-900">
                      #{order.orderNumber || order.id?.substring(0, 8)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-neutral-900">{order.customerName || 'Customer'}</div>
                      <div className="text-[11px] text-neutral-500">{order.customerPhone || ''}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-medium text-neutral-800">{order.storeName || 'Direct'}</span>
                    </td>
                    <td className="py-3 pr-4 font-bold text-neutral-900">
                      ৳{Number(order.totalAmountBDT || order.total || 0).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-800' :
                        order.status === 'Cancelled' || order.status === 'Returned' ? 'bg-rose-100 text-rose-800' :
                        'bg-neutral-100 text-neutral-800'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {order.paymentMethod || 'Cash on Delivery'}
                    </td>
                    <td className="py-3 text-right text-neutral-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Production Architecture & Security Card */}
      <div className="bg-[#FAF9F5] border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h4 className="text-sm font-bold text-neutral-900">Platform Integrity &amp; Security State</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-600">
          <div className="p-3 bg-white rounded-xl border border-[#E6E4E0]">
            <span className="font-bold text-neutral-800 block mb-0.5">Firebase Security Rules</span>
            <span>All 9 reseller collections hardened locally against client balance &amp; order mutations.</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E6E4E0]">
            <span className="font-bold text-neutral-800 block mb-0.5">Financial Immutability</span>
            <span>Orders totalAmountBDT, items, and isSettled are strictly immutable in Firestore.</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#E6E4E0]">
            <span className="font-bold text-neutral-800 block mb-0.5">Payment Gateway Policy</span>
            <span className="text-amber-800 font-semibold block mb-0.5">REQUIRES BACKEND / PAYMENT GATEWAY</span>
            <span>Manual TrxID review active; automated API verification requires server webhook integration.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
