'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { useReseller } from '@/context/ResellerContext';
import { RESELLER_PLANS } from '@/lib/resellerMockData';
import { Check, ShieldCheck, Zap, ArrowLeft, CreditCard } from 'lucide-react';
import { formatBDT } from '@/lib/formatters';

export function ResellerPackagesView() {
  const { navigate, showToast } = useMarketplace();
  const { user, isAuthenticated } = useAuth();
  const { resellerProfile } = useReseller();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [trxId, setTrxId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('login');
      return;
    }
    if (!trxId.trim()) {
      showToast('Transaction ID Required', 'Please enter your mobile payment TrxID.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Upgrade Submitted', 'Your payment reference has been recorded for admin activation.', 'success');
      navigate('reseller-dashboard');
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('reseller')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Reseller Hub</span>
      </button>

      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
          Reseller Subscription Packages
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Scale your online storefront with custom domain mapping, dedicated sales funnels, and bulk pricing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {RESELLER_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-neutral-900 bg-white shadow-xl scale-[1.02]'
                  : 'border-neutral-200 bg-[#FAF9F5] hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-base text-neutral-900">{plan.name}</h3>
                  {plan.badge && (
                    <span className="text-[10px] font-bold bg-[#C98F6B] text-white px-2.5 py-0.5 rounded-full uppercase">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black text-neutral-900 mb-1">
                  {formatBDT(plan.priceBDT)}
                  <span className="text-xs font-normal text-neutral-500"> / {plan.billingPeriod}</span>
                </div>
                <p className="text-xs text-neutral-600 mb-4">{plan.description}</p>
                <div className="space-y-2.5 pt-4 border-t border-neutral-200/60">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-200/80 text-neutral-800'
                  }`}
                >
                  {isSelected ? 'Selected Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Payment Section for Selected Plan */}
      {selectedPlan !== 'starter' && (
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-neutral-900" />
            <h3 className="text-sm font-bold text-neutral-900">Payment Verification (bKash / Nagad)</h3>
          </div>
          <p className="text-xs text-neutral-600 mb-4">
            Please send the package subscription amount to our merchant number: <strong className="text-neutral-900">01700-000000</strong> (Merchant / Personal), then enter the Transaction ID (TrxID) below.
          </p>

          <form onSubmit={handleUpgrade} className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === 'bKash'}
                  onChange={() => setPaymentMethod('bKash')}
                />
                <span>bKash</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  checked={paymentMethod === 'Nagad'}
                  onChange={() => setPaymentMethod('Nagad')}
                />
                <span>Nagad</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Transaction ID (TrxID)</label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="e.g. BKH9837192"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-900 uppercase font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {isSubmitting ? 'Verifying...' : 'Submit Payment for Verification'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
