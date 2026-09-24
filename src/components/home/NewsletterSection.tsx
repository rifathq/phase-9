'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';

export function NewsletterSection() {
  const { showToast } = useMarketplace();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed!', 'You will receive updates on flash deals and reseller bonuses.', 'success');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-[#111111] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-md space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-neutral-300">
            <Mail className="w-3.5 h-3.5" />
            Stay Ahead
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Get Exclusive Drops &amp; Wholesale Price Alerts
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400">
            Join thousands of smart shoppers and digital resellers receiving curated product collections directly in BDT.
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0 max-w-sm">
          {isSubscribed ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 px-4 py-3 rounded-2xl text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! You are now subscribed.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-neutral-400 text-xs focus:outline-none focus:border-white transition-colors"
                required
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#C98F6B] hover:bg-[#b57a55] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
