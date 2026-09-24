'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { 
  Wallet, 
  Search, 
  TrendingUp, 
  ArrowDownLeft, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  Info
} from 'lucide-react';

export function WalletsTab() {
  const { wallets, isLoadingWallets, setActiveSection } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWallets = useMemo(() => {
    return wallets.filter(w => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const rId = (w.resellerId || '').toLowerCase();
        if (!rId.includes(q)) return false;
      }
      return true;
    });
  }, [wallets, searchQuery]);

  const aggregate = useMemo(() => {
    return wallets.reduce((acc, w) => {
      acc.available += Number(w.availableBalanceBDT || 0);
      acc.pending += Number(w.pendingBalanceBDT || 0);
      acc.earnings += Number(w.totalEarningsBDT || 0);
      acc.withdrawn += Number(w.totalWithdrawnBDT || 0);
      return acc;
    }, { available: 0, pending: 0, earnings: 0, withdrawn: 0 });
  }, [wallets]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Reseller Wallets &amp; Financial Balances</h2>
            <p className="text-xs text-neutral-500">
              Audit reseller earnings, pending courier clearances, available balances, and historical payouts.
            </p>
          </div>
          <button
            onClick={() => setActiveSection('transactions')}
            className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#F7F6F3] hover:bg-[#EAE8E2] border border-[#E6E4E0] text-neutral-800 transition-colors self-start sm:self-auto cursor-pointer"
          >
            View Transactions Ledger
          </button>
        </div>

        {/* Security / Settlement Rule Notice */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Cryptographic Ledger Rule:</span> Resellers cannot directly manipulate wallet balances from the client SDK (protected by <code className="font-mono text-[11px] bg-amber-100 px-1 py-0.5 rounded">allow update: if isAdmin();</code> in Cloud Firestore). Financial settlements occur strictly upon courier delivery verification or trusted server execution.
          </div>
        </div>

        {/* Aggregate Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E6E4E0] rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Total Available</span>
            <span className="text-xl font-bold text-[#111111] mt-0.5 block">৳{aggregate.available.toLocaleString()}</span>
          </div>
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E6E4E0] rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Pending Settlement</span>
            <span className="text-xl font-bold text-amber-700 mt-0.5 block">৳{aggregate.pending.toLocaleString()}</span>
          </div>
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E6E4E0] rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Lifetime Earnings</span>
            <span className="text-xl font-bold text-emerald-700 mt-0.5 block">৳{aggregate.earnings.toLocaleString()}</span>
          </div>
          <div className="p-3.5 bg-[#FAF9F5] border border-[#E6E4E0] rounded-xl">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">Lifetime Disbursed</span>
            <span className="text-xl font-bold text-neutral-700 mt-0.5 block">৳{aggregate.withdrawn.toLocaleString()}</span>
          </div>
        </div>

        {/* Search */}
        <div className="pt-2">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by reseller UID..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Wallets Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingWallets ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading wallet accounts from Firestore reseller_wallets...
          </div>
        ) : filteredWallets.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Wallet className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No reseller wallets found</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Resellers initialize their wallet with zero balances upon registering their store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Reseller UID</th>
                  <th className="py-3 px-4">Available Balance</th>
                  <th className="py-3 px-4">Pending Clearance</th>
                  <th className="py-3 px-4">Lifetime Earnings</th>
                  <th className="py-3 px-4">Total Withdrawn</th>
                  <th className="py-3 px-4 text-right">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredWallets.map((wallet) => (
                  <tr key={wallet.resellerId} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-900 select-all">
                      {wallet.resellerId}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-neutral-900 text-sm">
                        ৳{Number(wallet.availableBalanceBDT || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500">Eligible for payout</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-amber-700">
                        ৳{Number(wallet.pendingBalanceBDT || 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500">Courier transit</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-700">
                        ৳{Number(wallet.totalEarningsBDT || 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-700">
                        ৳{Number(wallet.totalWithdrawnBDT || 0).toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right text-neutral-500 text-[11px]">
                      {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
