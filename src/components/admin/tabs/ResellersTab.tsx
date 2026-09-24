'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { 
  Store, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Ban, 
  CheckCircle, 
  CreditCard,
  Package,
  ShoppingBag,
  Wallet
} from 'lucide-react';

export function ResellersTab() {
  const { resellers, isLoadingResellers, updateResellerStatus, isSubmitting } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  const filteredResellers = useMemo(() => {
    return resellers.filter(r => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (r.storeName || '').toLowerCase();
        const slug = (r.storeSlug || '').toLowerCase();
        const uid = (r.resellerId || '').toLowerCase();
        if (!name.includes(q) && !slug.includes(q) && !uid.includes(q)) return false;
      }
      if (statusFilter !== 'all') {
        const currentStatus = r.status || 'active';
        if (currentStatus !== statusFilter) return false;
      }
      if (planFilter !== 'all') {
        if ((r.plan || 'starter') !== planFilter) return false;
      }
      return true;
    });
  }, [resellers, searchQuery, statusFilter, planFilter]);

  const handleToggleStatus = async (storeId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    await updateResellerStatus(storeId, nextStatus);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Reseller Stores &amp; Partners</h2>
            <p className="text-xs text-neutral-500">
              Manage authorized storefronts, subscription tiers, and operational status.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E6E4E0] text-neutral-700 self-start sm:self-auto">
            {filteredResellers.length} {filteredResellers.length === 1 ? 'Reseller' : 'Resellers'}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name, slug, reseller UID..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Store Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Subscription Plans</option>
              <option value="starter">Starter (Free)</option>
              <option value="pro">Pro</option>
              <option value="elite">Elite</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resellers Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingResellers ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading reseller directory from Firestore...
          </div>
        ) : filteredResellers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Store className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No matching resellers found</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Resellers who create storefronts on the platform will be registered in Firestore here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Store Profile</th>
                  <th className="py-3 px-4">Public URL</th>
                  <th className="py-3 px-4">Subscription Plan</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4">Store Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredResellers.map((reseller) => {
                  const isSuspended = reseller.status === 'suspended';
                  return (
                    <tr key={reseller.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{reseller.storeName || 'Store'}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          UID: {reseller.resellerId?.substring(0, 14)}...
                        </div>
                        {reseller.tagline && (
                          <div className="text-[11px] text-neutral-600 italic mt-0.5 line-clamp-1">{reseller.tagline}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <a
                          href={`/r/${reseller.storeSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-900 hover:underline font-mono text-[11px] font-medium"
                        >
                          <span>/r/{reseller.storeSlug}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-400" />
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          reseller.plan === 'elite' ? 'bg-purple-100 text-purple-800' :
                          reseller.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                          'bg-neutral-100 text-neutral-700'
                        }`}>
                          {reseller.plan || 'Starter'}
                        </span>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          Status: {reseller.subscriptionStatus || 'active'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">
                          ৳{(reseller.walletBalanceBDT || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500">Available</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStore(reseller)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E6E4E0] text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleStatus(reseller.id, reseller.status || 'active')}
                            disabled={isSubmitting}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              isSuspended 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
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

      {/* Reseller Detail Modal */}
      {selectedStore && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6E4E0] shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E6E4E0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111111]">{selectedStore.storeName}</h3>
                <p className="text-neutral-500 font-mono text-[11px]">Slug: {selectedStore.storeSlug}</p>
              </div>
              <button
                onClick={() => setSelectedStore(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-[#F7F6F3] p-3.5 rounded-xl border border-[#E6E4E0]">
              <div>
                <span className="font-semibold text-neutral-500">Reseller UID: </span>
                <span className="font-mono text-neutral-900 select-all">{selectedStore.resellerId}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Subscription Tier: </span>
                <span className="font-bold text-neutral-900 uppercase">{selectedStore.plan || 'Starter'}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Store Status: </span>
                <span className="font-bold text-neutral-900 uppercase">{selectedStore.status || 'Active'}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Available Wallet Balance: </span>
                <span className="font-bold text-neutral-900">৳{(selectedStore.walletBalanceBDT || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href={`/r/${selectedStore.storeSlug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold"
              >
                <span>Visit Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedStore(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
