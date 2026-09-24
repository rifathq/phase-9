'use client';

import React, { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { CustomerRecord } from '@/types/admin';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Clock,
  UserCheck
} from 'lucide-react';

export function CustomersTab() {
  const { customers, isLoadingCustomers, updateCustomerStatus, isSubmitting } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(cust => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (cust.displayName || '').toLowerCase();
        const email = (cust.email || '').toLowerCase();
        const phone = (cust.phone || '').toLowerCase();
        const uid = (cust.firebaseUid || cust.id || '').toLowerCase();
        if (!name.includes(q) && !email.includes(q) && !phone.includes(q) && !uid.includes(q)) return false;
      }
      if (statusFilter !== 'all') {
        if (cust.status !== statusFilter) return false;
      }
      return true;
    });
  }, [customers, searchQuery, statusFilter]);

  const handleToggleCustomerStatus = async (customerId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    await updateCustomerStatus(customerId, nextStatus);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#111111]">Platform Customers &amp; User Accounts</h2>
            <p className="text-xs text-neutral-500">
              Registered customer accounts synchronized from Firebase Authentication and Firestore profiles.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#F7F6F3] border border-[#E6E4E0] text-neutral-700 self-start sm:self-auto">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer name, email, phone, Firebase UID..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E4E0] bg-[#F7F6F3] focus:bg-white focus:outline-none font-medium text-neutral-800"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-[#E6E4E0] rounded-2xl shadow-xs overflow-hidden">
        {isLoadingCustomers ? (
          <div className="py-16 text-center text-xs text-neutral-500">
            Loading customers from Firestore users collection...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="text-xs font-semibold text-neutral-700">No registered customers match your criteria</p>
            <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
              Customer accounts created during registration or checkout will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F3] border-b border-[#E6E4E0] text-neutral-600 font-semibold">
                <tr>
                  <th className="py-3 px-4">Customer Name &amp; Identity</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((cust) => {
                  const isSuspended = cust.status === 'suspended';
                  return (
                    <tr key={cust.id} className="hover:bg-[#FAF9F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-900">{cust.displayName || 'Customer'}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                          UID: {cust.firebaseUid?.substring(0, 14)}...
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-neutral-700">
                          <Mail className="w-3 h-3 text-neutral-400" />
                          <span>{cust.email || 'No email provided'}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-neutral-600 font-mono text-[11px] mt-0.5">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] uppercase font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {cust.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-[11px]">
                          {cust.emailVerified ? (
                            <span className="text-emerald-700 font-medium">Email Verified</span>
                          ) : (
                            <span className="text-neutral-400">Email Unverified</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isSuspended ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600">
                        {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(cust)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#E6E4E0] text-neutral-700 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleCustomerStatus(cust.id, cust.status)}
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

      {/* Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#E6E4E0] shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#E6E4E0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111111]">{selectedCustomer.displayName}</h3>
                <p className="text-neutral-500 text-[11px]">Customer Record</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-[#F7F6F3] p-3.5 rounded-xl border border-[#E6E4E0]">
              <div>
                <span className="font-semibold text-neutral-500">Firebase UID: </span>
                <span className="font-mono text-neutral-900 select-all">{selectedCustomer.firebaseUid}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Email: </span>
                <span className="text-neutral-900">{selectedCustomer.email}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Phone: </span>
                <span className="font-mono text-neutral-900">{selectedCustomer.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Account Role: </span>
                <span className="font-mono uppercase font-bold text-neutral-900">{selectedCustomer.role}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Status: </span>
                <span className="font-bold text-neutral-900 uppercase">{selectedCustomer.status}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-500">Created At: </span>
                <span className="text-neutral-900">{selectedCustomer.createdAt}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
