'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { ResellerWithdrawal } from '@/types/reseller';
import { 
  Banknote, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight,
  ShieldAlert,
  Send,
  Building
} from 'lucide-react';

export function WithdrawalsTab() {
  const { 
    withdrawals, 
    isLoadingWithdrawals, 
    approveWithdrawal, 
    completeWithdrawal, 
    rejectWithdrawal, 
    isSubmitting 
  } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [activeModal, setActiveModal] = useState<{
    type: 'approve' | 'complete' | 'reject';
    withdrawal: ResellerWithdrawal;
  } | null>(null);
  const [modalInput, setModalInput] = useState('');

  const openActionModal = (type: 'approve' | 'complete' | 'reject', withdrawal: ResellerWithdrawal) => {
    setActiveModal({ type, withdrawal });
    setModalInput('');
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalInput('');
  };

  const handleConfirmAction = async () => {
    if (!activeModal) return;
    const { type, withdrawal } = activeModal;

    let success = false;
    if (type === 'approve') {
      success = await approveWithdrawal(withdrawal.id, modalInput.trim() || 'Approved for disbursement clearance.');
    } else if (type === 'complete') {
      success = await completeWithdrawal(withdrawal.id, modalInput.trim());
    } else if (type === 'reject') {
      success = await rejectWithdrawal(withdrawal.id, modalInput.trim());
    }

    if (success) {
      closeModal();
    }
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const rId = (w.resellerId || '').toLowerCase();
        const method = (w.method || '').toLowerCase();
        const acc = typeof w.accountDetails === 'string' 
          ? (w.accountDetails as string).toLowerCase() 
          : `${w.accountDetails?.accountNumber || ''} ${w.accountDetails?.accountHolderName || ''} ${w.accountDetails?.bankName || ''}`.toLowerCase();
        const id = (w.id || '').toLowerCase();
        if (!rId.includes(q) && !method.includes(q) && !acc.includes(q) && !id.includes(q)) return false;
      }
      if (statusFilter !== 'all' && w.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [withdrawals, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Reseller Payout &amp; Withdrawal Queue</h2>
            <p className="text-xs text-neutral-500">
              Process verified reseller earnings withdrawals. Disburse funds and record transaction references.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E6E4E0] text-neutral-700 self-start sm:self-auto">
            {filteredWithdrawals.length} {filteredWithdrawals.length === 1 ? 'Request' : 'Requests'}
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
              placeholder="Search reseller UID, payout method, account number..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed / Disbursed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingWithdrawals ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading payout requests from Firestore reseller_withdrawals...
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Banknote className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No withdrawal requests found</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              When resellers request payouts of their settled order profits (minimum BDT 500), they appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Request Details</th>
                  <th className="py-3 px-4">Reseller</th>
                  <th className="py-3 px-4">Requested Amount</th>
                  <th className="py-3 px-4">Disbursement Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Admin Notes / TrxID</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredWithdrawals.map((w) => {
                  return (
                    <tr key={w.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-neutral-900">
                          #{w.id?.substring(0, 10)}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {w.requestedAt ? new Date(w.requestedAt).toLocaleString() : 'Recent'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono text-neutral-800 select-all font-semibold">
                          {w.resellerId?.substring(0, 14)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-neutral-900 text-sm">
                          ৳{Number(w.amountBDT || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{w.method}</div>
                        <div className="font-mono text-[11px] text-neutral-600 select-all">
                          {typeof w.accountDetails === 'string' 
                            ? w.accountDetails 
                            : `${w.accountDetails?.accountNumber || ''} ${w.accountDetails?.accountType ? `(${w.accountDetails.accountType})` : ''} ${w.accountDetails?.bankName ? `· ${w.accountDetails.bankName}` : ''}`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          w.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                          w.status === 'Processing' ? 'bg-indigo-100 text-indigo-800' :
                          w.status === 'Rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {w.status}
                        </span>
                        {w.processedAt && (
                          <div className="text-[10px] text-neutral-400 mt-0.5">
                            {new Date(w.processedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="text-neutral-600 text-[11px] line-clamp-2">
                          {w.adminNotes || 'Under courier settlement clearance'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => openActionModal('approve', w)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openActionModal('reject', w)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {w.status === 'Approved' && (
                            <button
                              onClick={() => openActionModal('complete', w)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Mark Disbursed
                            </button>
                          )}

                          {(w.status === 'Completed' || w.status === 'Rejected') && (
                            <span className="text-[11px] text-neutral-400 italic">Archived</span>
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

      {/* Action Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6E4E0] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E6E4E0] pb-3">
              <h3 className="text-base font-bold text-[#111111]">
                {activeModal.type === 'approve' && 'Approve Reseller Withdrawal'}
                {activeModal.type === 'complete' && 'Confirm Payout Disbursement'}
                {activeModal.type === 'reject' && 'Reject Withdrawal Request'}
              </h3>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-700 p-1">
                ✕
              </button>
            </div>

            <div className="bg-[#F7F6F3] p-3.5 rounded-xl border border-[#E6E4E0] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Requested Amount:</span>
                <span className="font-bold text-neutral-900 text-sm">৳{Number(activeModal.withdrawal.amountBDT).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Payout Method:</span>
                <span className="font-semibold text-neutral-900">{activeModal.withdrawal.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Account Details:</span>
                <span className="font-mono text-neutral-900 font-bold">
                  {typeof activeModal.withdrawal.accountDetails === 'string' 
                    ? activeModal.withdrawal.accountDetails 
                    : `${activeModal.withdrawal.accountDetails?.accountNumber || ''} ${activeModal.withdrawal.accountDetails?.accountType ? `(${activeModal.withdrawal.accountDetails.accountType})` : ''} ${activeModal.withdrawal.accountDetails?.bankName ? `· ${activeModal.withdrawal.accountDetails.bankName}` : ''}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Reseller UID:</span>
                <span className="font-mono text-neutral-700">{activeModal.withdrawal.resellerId}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                {activeModal.type === 'complete' 
                  ? 'Disbursement Reference / Transaction ID (bKash/Nagad/BEFTN TrxID) *'
                  : activeModal.type === 'reject'
                  ? 'Rejection Reason (will be shown to reseller) *'
                  : 'Approval Notes (optional)'}
              </label>
              <textarea
                value={modalInput}
                onChange={(e) => setModalInput(e.target.value)}
                rows={3}
                placeholder={
                  activeModal.type === 'complete'
                    ? 'Enter bank clearance reference or MFS TrxID (e.g. 9J4K2L8810)...'
                    : activeModal.type === 'reject'
                    ? 'State reason (e.g. Invalid account number, courier settlement hold)...'
                    : 'Notes for disbursement clearance...'
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-white focus:outline-none focus:border-black"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-3.5 py-2 rounded-xl border border-[#E6E4E0] text-neutral-700 hover:bg-neutral-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-xl text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer ${
                  activeModal.type === 'reject' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-black hover:bg-neutral-800'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
