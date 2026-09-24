'use client';

import React from 'react';
import { Truck, ShieldCheck, Banknote, Clock } from 'lucide-react';

export function TrustFeaturesStrip() {
  const features = [
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Prompt courier delivery across all 64 districts in Bangladesh',
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      desc: 'Pay after inspecting your package with COD protection',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic Quality',
      desc: 'Directly sourced from verified local vendors & manufacturers',
    },
    {
      icon: Clock,
      title: 'Dedicated Support',
      desc: 'Live customer & reseller assistance via WhatsApp & phone',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-neutral-200 text-neutral-900 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">{feat.title}</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
