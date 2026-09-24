'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { ResellerSubscription } from '@/types/reseller';
import { 
  CreditCard, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar,
  Clock,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export function SubscriptionsTab() {
  const { 
    subscriptions, 
    isLoadingSubscriptions, 
    verifySubscription, 
    cancelSubscription, 
    isSubmitting 
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<ResellerSubscription | null>(null);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(s => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const rId = (s.resellerId || '').toLowerCase();
        const plan = (s.plan || '').toLowerCase();
        const trx = (s.paymentTrxId || '').toLowerCase();
        if (!rId.includes(q) && !plan.includes(q) && !trx.includes(q)) return false;
      }
      if (statusFilter !== 'all') {
        if (s.status !== statusFilter) return false;
      }
      return true;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const handleVerify = async (sub: ResellerSubscription) => {
    await verifySubscription(sub.id, durationDays);
    setSelectedSub(null);
  };

  const handleCancel = async () => {
    if (!selectedSub) return;
    await cancelSubscription(selectedSub.id, cancelReason.trim() || 'Payment not verified by administrator.');
    setIsCancelModalOpen(false);
    setSelectedSub(null);
    setCancelReason('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Reseller Membership &amp; Subscription Control</h2>
            <p className="text-xs text-neutral-500">
              Audit tier memberships (Starter, Pro, Elite), verify manual bKash/Nagad upgrade submissions, and activate benefits.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E6E4E0] text-neutral-700 self-start sm:self-auto">
            {filteredSubs.length} {filteredSubs.length === 1 ? 'Subscription' : 'Subscriptions'}
          </div>
        </div>

        {/* Security / Architecture Notice */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Payment Gateway Verification Notice:</span> Real-time automated verification of bKash/Nagad TrxIDs requires merchant payment gateway API webhooks. In the current production architecture, paid upgrades are securely locked in <code className="bg-blue-100 px-1 py-0.5 rounded font-mono text-[11px]">pending_payment</code> status until an administrator manually verifies receipt of funds.
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reseller UID, plan, or TrxID..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Subscription Statuses</option>
              <option value="pending_payment">Pending Payment Verification</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingSubscriptions ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading subscriptions from Firestore reseller_subscriptions...
          </div>
        ) : filteredSubs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No subscriptions match your search</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Reseller memberships and package upgrades will be stored in Firestore here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Reseller</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Price (BDT)</th>
                  <th className="py-3 px-4">Payment Submission</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Duration &amp; Expiry</th>
                  <th className="py-3 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredSubs.map((sub) => {
                  const isPending = sub.status === 'pending_payment';
                  return (
                    <tr key={sub.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-neutral-900 font-semibold select-all">
                          {sub.resellerId?.substring(0, 14)}...
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          ID: {sub.id?.substring(0, 10)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.plan === 'elite' ? 'bg-purple-100 text-purple-800' :
                          sub.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {sub.plan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900 text-sm">
                          ৳{Number(sub.priceBDT || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {sub.billingCycle || 'monthly'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {sub.paymentTrxId ? (
                          <div>
                            <div className="font-mono font-bold text-neutral-900 select-all">
                              TrxID: {sub.paymentTrxId}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              Method: {sub.paymentMethod || 'bKash'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">Free plan / No TrxID</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          sub.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          sub.status === 'pending_payment' ? 'bg-amber-100 text-amber-800' :
                          sub.status === 'expired' ? 'bg-neutral-200 text-neutral-700' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {sub.status === 'pending_payment' ? 'Pending Verification' : sub.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-neutral-800 text-[11px]">
                          Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-neutral-500 text-[10px]">
                          Expires: {sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : 'Lifetime (Starter)'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedSub(sub);
                                  handleVerify(sub);
                                }}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Verify &amp; Activate
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSub(sub);
                                  setIsCancelModalOpen(true);
                                }}
                                disabled={isSubmitting}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : sub.status === 'active' && sub.plan !== 'starter' ? (
                            <button
                              onClick={() => {
                                setSelectedSub(sub);
                                setIsCancelModalOpen(true);
                              }}
                              disabled={isSubmitting}
                              className="px-2.5 py-1.5 rounded-lg border border-[#E6E4E0] text-neutral-700 hover:bg-neutral-100 font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Cancel Plan
                            </button>
                          ) : (
                            <span className="text-[11px] text-neutral-400 italic">No action</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejection / Cancellation Modal */}
      {isCancelModalOpen && selectedSub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6E4E0] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E6E4E0] pb-3">
              <h3 className="text-base font-bold text-[#111111]">Reject or Cancel Subscription</h3>
              <button onClick={() => setIsCancelModalOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
                ✕
              </button>
            </div>

            <p className="text-neutral-600 leading-relaxed">
              Are you sure you want to reject/cancel the <strong className="uppercase">{selectedSub.plan}</strong> subscription for reseller <code className="font-mono">{selectedSub.resellerId}</code>?
            </p>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Reason for Rejection / Cancellation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="State reason (e.g. TrxID not found on merchant statement, duplicate submission)..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-[#E6E4E0] text-neutral-700 hover:bg-neutral-50 font-semibold"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
